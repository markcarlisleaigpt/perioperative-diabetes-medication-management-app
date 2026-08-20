#!/usr/bin/env node
//
// Scenario sweep over the patient-facing output of index.html.
//
//   node sweep.js
//
// Exit code 0 = every assertion held, non-zero = at least one failed. No
// dependencies and no build step, matching the app itself.
//
// WHY THIS EXISTS. The app is one file with no test suite, and the part that
// can hurt a patient is a printed string, not a crash. A wrong branch produces
// a sheet that renders perfectly and tells someone to take a medication that is
// being held. This sweep reads the real index.html, pulls out the pure logic
// layer, and drives it across the whole context matrix looking for exactly that
// class of defect. It has caught nothing so far; it is cheap insurance, and it
// had to be rebuilt from scratch twice before being committed (2026-08-18).
//
// HOW IT LOADS THE APP. Everything above `class PerioperativeDMApp` is pure -
// no DOM, no app instance - and it ends at getAllResults(). That prefix is
// extracted and evaluated in Node. Nothing is stubbed and nothing is mocked, so
// what runs here is the shipping code, not a copy of it. If the file is ever
// reorganised so the logic no longer sits above the class, this script fails
// loudly rather than silently sweeping nothing.
//
// ADDING AN ASSERTION. Put it in ASSERTIONS below. Each one receives a single
// card result plus the scenario, and returns a string describing the failure or
// null when it holds. Prefer assertions about what the PATIENT is told - the
// clinician fields are reviewed by a clinician, the patient fields are not.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML = path.join(__dirname, 'index.html');
const CLASS_MARKER = 'class PerioperativeDMApp';

// ---------------------------------------------------------------- load ----

function loadLogic() {
  const html = fs.readFileSync(HTML, 'utf8');
  const scripts = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g) || [];
  if (!scripts.length) throw new Error('no inline <script> block found in index.html');

  const body = scripts
    .map(s => s.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''))
    .join('\n;\n');

  const cut = body.indexOf(CLASS_MARKER);
  if (cut === -1) {
    throw new Error(
      `could not find "${CLASS_MARKER}" in index.html.\n` +
      'The sweep extracts everything above the app class as the pure logic layer. ' +
      'If the file was reorganised, update CLASS_MARKER or the extraction below.'
    );
  }

  // Top-level `const`/`let` stay in the script's lexical scope and never become
  // properties of the sandbox - only function declarations do. So the two things
  // this sweep needs are handed out explicitly rather than fished off the global.
  const source = body.slice(0, cut) + '\n;globalThis.__sweep__ = { getAllResults, DRUG_DB };\n';

  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'index.html (logic layer)' });

  const api = sandbox.__sweep__;
  if (!api || typeof api.getAllResults !== 'function') throw new Error('getAllResults() not found in the logic layer');
  if (!api.DRUG_DB) throw new Error('DRUG_DB not found in the logic layer');
  return api;
}

// ------------------------------------------------------------- matrix ----

// Valid surgeryType values. `majorNoncardiac` is camelCase on purpose - passing
// `major-noncardiac` falls through to the same default branch, so badges look
// right while the R-number provenance is silently wrong.
const SURGERY_TYPES = ['minor', 'colonoscopy', 'majorNoncardiac', 'cardiac', 'bariatric'];
const TIMINGS = ['AM', 'PM'];
const DM_TYPES = ['type1', 'type2'];
// '' is the not-entered case, which must apply the conservative metformin hold.
// The rest straddle every eGFR threshold in the app: 30, 45, and above.
const EGFRS = ['', '25', '35', '50', '60', '90'];
const CONTRASTS = [true, false, null];
const HFS = [true, false];

// The oral agents. Insulin is deliberately excluded: its cards need
// insulinDetails per drug, which is a different sweep with a different shape.
const ORAL_CLASSES = ['dpp4i', 'metformin', 'sulfonylurea', 'meglitinide', 'tzd', 'agi'];

// --------------------------------------------------------- assertions ----

// Patient-facing fields only. These are what print on the sheet.
const PATIENT_FIELDS = ['daysBefore', 'nightBefore', 'morningOf', 'dietary'];

// Wording introduced 2026-08-18: cards state the LAST PERMITTED DOSE rather
// than negating a morning dose the patient may never take.
const DAY_AND_NIGHT = 'through the day and night before surgery';
const HOLD_MORNING = 'HOLD MORNING OF SURGERY';

const RESUMPTION = /\b(resume|restart|resuming|restarting)\b/i;

const ASSERTIONS = [
  {
    name: 'day-and-night claim requires the HOLD MORNING OF SURGERY badge',
    // The badge IS the safety boundary. Every card carrying it permits the
    // day-before dose; every card that does not permit it carries a different
    // badge (sulfonylureas skip the evening dose the night before; metformin's
    // eGFR and contrast limbs badge HOLD). A card claiming the permission
    // without the badge would be telling a patient to take a held dose.
    check(card) {
      const claims = PATIENT_FIELDS.some(f => typeof card.patient?.[f] === 'string' && card.patient[f].includes(DAY_AND_NIGHT));
      if (claims && card.badge !== HOLD_MORNING) {
        return `claims "${DAY_AND_NIGHT}" but badge is ${card.badge}`;
      }
      return null;
    },
  },
  {
    name: 'HOLD MORNING OF SURGERY cards state the last permitted dose',
    // The converse. Catches a card that reverts to a bare negation, which is
    // the defect the 2026-08-18 wording change fixed.
    check(card) {
      if (card.badge !== HOLD_MORNING) return null;
      const text = card.patient?.morningOf;
      if (typeof text === 'string' && !text.includes(DAY_AND_NIGHT)) {
        return `badged ${HOLD_MORNING} but morningOf does not state the last permitted dose: ${JSON.stringify(text.slice(0, 100))}`;
      }
      return null;
    },
  },
  {
    name: 'no resumption language on the patient sheet',
    // The sheet is deliberately and completely silent about restarting
    // medication. Resumption is a clinician decision made after surgery, and a
    // printed "resume when eating normally" invites a patient to self-restart.
    check(card) {
      for (const f of PATIENT_FIELDS) {
        const text = card.patient?.[f];
        if (typeof text === 'string' && RESUMPTION.test(text)) {
          return `patient.${f} contains resumption language: ${JSON.stringify(text.slice(0, 100))}`;
        }
      }
      return null;
    },
  },
];

// ------------------------------------------------------------- driver ----

function run() {
  const { getAllResults, DRUG_DB } = loadLogic();

  const selected = new Set();
  for (const key of ORAL_CLASSES) {
    const cls = DRUG_DB[key];
    if (!cls || !cls.drugs || !cls.drugs.length) throw new Error(`DRUG_DB has no drugs for "${key}" - class key renamed?`);
    for (const d of cls.drugs) selected.add(d.id);
  }

  const failures = [];
  let scenarios = 0;

  for (const surgeryType of SURGERY_TYPES)
    for (const surgeryTiming of TIMINGS)
      for (const dmType of DM_TYPES)
        for (const eGFR of EGFRS)
          for (const contrastWithin48h of CONTRASTS)
            for (const hasHF of HFS) {
              scenarios++;
              const scenario = { surgeryType, surgeryTiming, dmType, eGFR: eGFR || '(blank)', contrastWithin48h, hasHF };

              const ctx = { dmType, surgeryType, surgeryTiming, hasHF, hasCKD: false, arrivalTime: '', surgeryDate: '' };
              const details = {
                sglt2iMode: 'SPAQI', a1cOver8: null, prolongedFasting: false, surgeryOver3h: null,
                sglt2iDoseTime: 'morning', dkaHistory: null, ketoDiet: null,
                eGFR, contrastWithin48h, giSymptoms: null, glp1NpoCutoff: 'midnight', insulinDetails: {},
              };

              let results;
              try {
                results = getAllResults(ctx, details, selected);
              } catch (err) {
                failures.push({ scenario, card: '(threw)', assertion: 'getAllResults must not throw', detail: err.message });
                continue;
              }

              for (const card of results) {
                for (const a of ASSERTIONS) {
                  const detail = a.check(card);
                  if (detail) failures.push({ scenario, card: card.id, assertion: a.name, detail });
                }
              }
            }

  return { scenarios, drugs: selected.size, failures };
}

let report;
try {
  report = run();
} catch (err) {
  console.error('SWEEP COULD NOT RUN\n' + err.message);
  process.exit(2);
}

console.log(`scenarios: ${report.scenarios}   oral drugs selected: ${report.drugs}   assertions: ${ASSERTIONS.length}`);

if (!report.failures.length) {
  console.log('PASS - every assertion held in every scenario');
  process.exit(0);
}

// Group by assertion so a single systematic defect reads as one problem rather
// than as hundreds of near-identical lines.
const grouped = new Map();
for (const f of report.failures) {
  const key = `${f.assertion} | ${f.card} | ${f.detail}`;
  if (!grouped.has(key)) grouped.set(key, { ...f, count: 0 });
  grouped.get(key).count++;
}

console.log(`\nFAIL - ${report.failures.length} failure(s), ${grouped.size} distinct:\n`);
for (const f of grouped.values()) {
  console.log(`  [${f.assertion}]`);
  console.log(`    card:     ${f.card}`);
  console.log(`    detail:   ${f.detail}`);
  console.log(`    example:  ${JSON.stringify(f.scenario)}`);
  console.log(`    seen in:  ${f.count} scenario(s)\n`);
}
process.exit(1);
