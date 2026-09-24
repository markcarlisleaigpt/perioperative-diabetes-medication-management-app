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
// WHAT THIS SWEEP CANNOT SEE. It loads only the pure logic layer above the app
// class, so the ENTIRE patient-sheet renderer is out of reach: the checklist row,
// the diet ordering and de-duplication, and the eating-and-drinking footer are all
// below the boundary and must be checked in a browser. For the same reason a
// regression in hasAnyGLP1() is invisible here - it gates the GI-symptom screen and
// the NPO-cutoff question CARD, both of which live in the class. Mutation testing
// 2026-08-18 confirmed this: reverting hasAnyGLP1 to a class-membership test leaves
// the sweep passing, while reverting coIncretin or onIncretin is caught.
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
// The app's canonical values. 'type1'/'type2' match NEITHER branch of
// `isT1 = dmType === 'T1DM' || !dmType`, so this axis swept nothing at all until
// 2026-08-18 - the same class of error the surgeryType comment above warns about.
// 'noDM' added 2026-09-24: a patient without diabetes has had its own SGLT2i rule since
// then (a 24 h window replacing the 12 h, >3 h and GLP-1 cutoff triggers), and until then
// that whole population was unswept.
const DM_TYPES = ['T1DM', 'T2DM', 'noDM'];
// '' is the not-entered case, which must apply the conservative metformin hold.
// The rest straddle every eGFR threshold in the app: 30, 45, and above.
const EGFRS = ['', '25', '35', '50', '60', '90'];
const CONTRASTS = [true, false, null];
const HFS = [true, false];
// Previously pinned, so whole branches were never executed: the GI-symptom screen
// (including the flag that must never reach a pen that cannot be held), and the dose
// guards. '' is not-entered, '3' is millilitres read off the carton, '100' is a total
// daily insulin dose, '15' is the pen minimum, '40' an ordinary dose.
const GI_SYMPTOMS = [true, false, null];
const COMBO_DOSES = ['40', '15', '3', '100', ''];

// The oral agents. Plain insulin is still excluded: those cards need insulinDetails
// per drug and want a differently shaped sweep. The fixed-ratio insulin/GLP-1 pen IS
// swept, because its whole reason for existing is that it carries GLP-1 rules while
// filed under insulin - exactly the thing that fails silently.
const ORAL_CLASSES = ['dpp4i', 'metformin', 'sulfonylurea', 'meglitinide', 'tzd', 'agi'];

// A fixed-ratio insulin/GLP-1 pen: filed under basalInsulin, carries the GLP-1 diet.
const COMBO_PEN = 'iglarlixi';
const COMBO_PEN_DETAILS = { [COMBO_PEN]: { eveningDose: '40' } };

// --------------------------------------------------------- assertions ----

// Patient-facing fields only. These are what print on the sheet.
const PATIENT_FIELDS = ['daysBefore', 'nightBefore', 'morningOf', 'dietary'];

// Wording introduced 2026-08-18: cards state the LAST PERMITTED DOSE rather
// than negating a morning dose the patient may never take.
const DAY_AND_NIGHT = 'through the day and night before surgery';
const HOLD_MORNING = 'HOLD MORNING OF SURGERY';

const RESUMPTION = /\b(resume|restart|resuming|restarting)\b/i;

// A card that carries the 24 h clear liquid diet declares it with this property. The
// patient sheet keys its diet ordering, its checklist wording and its
// eating-and-drinking footer off the property rather than off a list of card ids.
const DIET_PROPERTY = 'carriesGlp1Diet';

// The timed preoperative carbohydrate drink, issued only to SGLT2i patients who are not
// co-treated with an incretin (or who are, on a 2 h cutoff, still continuing the SGLT2i).
const TIMED_DRINK = /8 to 12 ounces/i;

// The fixed-ratio pen's card id.
const PEN_CARD = () => 'basal-' + COMBO_PEN;

const ASSERTIONS = [
  {
    name: 'the pen card never carries a hold-suggesting flag',
    // The GI-symptom flag from getGLP1Disposition says 'consider holding medication'.
    // On this card that would mean holding the patient's only basal insulin. It is
    // filtered on the structural suggestsHold property, not on its wording.
    check(card) {
      if (card.id !== PEN_CARD()) return null;
      if ((card.flags || []).some(f => f.suggestsHold)) return 'a suggestsHold flag reached the pen card';
      return null;
    },
  },
  {
    name: 'the pen card confirms the day-before dose',
    // Silence means 'no change' by convention, but a patient told emphatically not to
    // take this pen on one day may generalise to the day before - skipping their only
    // basal insulin, which is the more harmful direction.
    check(card) {
      if (card.id !== PEN_CARD()) return null;
      const t = (card.patient && card.patient.morningOf) || '';
      if (!/up to and including the day before surgery/.test(t)) {
        return 'patient.morningOf does not confirm the day-before dose';
      }
      return null;
    },
  },
  {
    name: 'the pen card fallback is actionable when the patient reads it',
    // 'call the clinic before your surgery' is useless to someone reading the sheet at
    // 5 am on the day.
    check(card) {
      if (card.id !== PEN_CARD()) return null;
      const t = (card.patient && card.patient.morningOf) || '';
      if (!/as soon as you get these instructions/.test(t)) return 'fallback is not anchored to when the sheet is read';
      return null;
    },
  },
  {
    name: 'an out-of-range pen dose never yields a number on the patient sheet',
    // Flags do NOT render on the patient sheet, so a clinician alert is no protection
    // here: 3 units read off the carton as millilitres once printed "take 2 units", and
    // the patient saw the number with none of the doubt attached. Out of range must
    // degrade to the non-numeric sentence, not to a smaller wrong number.
    check(card, scenario) {
      if (card.id !== PEN_CARD()) return null;
      const d = parseFloat(scenario.comboDose);
      const outOfRange = !isNaN(d) && (d < 15 || d > 60);
      if (!outOfRange) return null;
      const t = (card.patient && card.patient.morningOf) || '';
      const m = t.match(/\b\d+(\.\d+)?\s*units\b/);
      if (m) return `dose ${scenario.comboDose} is outside the pen range but the sheet still prints "${m[0]}"`;
      return null;
    },
  },
  {
    name: 'the pen card never asks the patient to compute a dose',
    // A blank dose used to yield 'take 75% of your usual Soliqua dose of the separate
    // long-acting insulin' - ungrammatical, and insulin arithmetic on the morning of
    // surgery is precisely what the dose machinery exists to prevent.
    check(card) {
      if (card.id !== PEN_CARD()) return null;
      const t = (card.patient && card.patient.morningOf) || '';
      if (/%/.test(t)) return 'patient.morningOf contains a percentage: ' + JSON.stringify(t.slice(0, 120));
      return null;
    },
  },
  {
    name: 'a card that declares the GLP-1 diet actually prints one',
    // carriesGlp1Diet drives the patient sheet's footer suppression. A card that sets
    // it without printing a dietary block suppresses the "follow the instructions from
    // the Preoperative Clinic" line and replaces it with nothing.
    check(card) {
      if (!card[DIET_PROPERTY]) return null;
      const diet = card.patient && card.patient.dietary;
      if (typeof diet !== 'string' || !diet.trim()) {
        return `sets ${DIET_PROPERTY} but prints no patient.dietary block`;
      }
      return null;
    },
  },
  {
    name: 'a fixed-ratio insulin/GLP-1 pen is never held',
    // Holding this pen holds the patient's only basal insulin. No branch may badge it
    // as a hold - not the GI-symptom branch, not the combination rule.
    check(card) {
      if (card.id !== `basal-${COMBO_PEN}`) return null;
      if (/HOLD/i.test(card.badge || '')) {
        return `badged ${card.badge} - holding this pen holds the patient's only basal insulin`;
      }
      return null;
    },
  },
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
    // Restart guidance lives ONLY in the renderer's After Surgery blocks (SGLT2i since
    // 2026-09-02, every other changed class since 2026-09-16). The four timing fields swept
    // here print under PREOPERATIVE headings, so resumption language in them would put a
    // restart instruction under "Morning of Surgery". The original 2026-08-14 rule was that
    // the whole sheet was silent about restarting; that is no longer true, but this
    // assertion still holds for the fields it covers.
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
  {
    name: 'a colonoscopy patient gets the colonoscopy eating-and-drinking limb, never a co-treated or timed one',
    // Until 2026-09-16 the SGLT2i card tested the two co-treated limbs BEFORE surgery type, so
    // a patient on a GLP-1 plus an SGLT2 inhibitor having a colonoscopy got the co-treated
    // wording keyed to a GLP-1 fasting cutoff that the sheet never issues on a colonoscopy
    // (478 of 480 combinations, enumerated by execution). The clinician chain was ordered
    // differently again. Colonoscopy is now the first test in both chains. The colonoscopy
    // limb carries the prep-day carbohydrate line and the last-drink line, and no timed
    // 8-12 oz drink (Mark, 2026-09-16). The colour line was removed the same day.
    check(card, scenario) {
      if (scenario.surgeryType !== 'colonoscopy' || card.id !== 'sglt2i') return null;
      const d = (card.patient && card.patient.dietary) || '';
      if (!/While you are on clear liquids/.test(d)) return 'colonoscopy: SGLT2i dietary text lacks the prep-day carbohydrate line';
      if (!/Your last drink before your cut-off/.test(d)) return 'colonoscopy: SGLT2i dietary text lacks the last-drink-before-cut-off line';
      if (/before you stop/.test(d)) return 'colonoscopy: SGLT2i dietary text is the co-treated wording, not the colonoscopy limb';
      if (TIMED_DRINK.test(d)) return 'colonoscopy: SGLT2i dietary text issues the timed 8-12 oz drink, which the prep governs';
      if (/red, purple or orange/.test(d)) return 'colonoscopy: the colour line was removed on 2026-09-16 and has come back';
      if (/gelatin/.test(d)) return 'colonoscopy: the SGLT2i dietary text names gelatin - the prep-day line names no beverages (Mark, 2026-09-16)';
      return null;
    },
  },
];

// Assertions over the WHOLE result set for one scenario, rather than one card. These
// catch cross-card contradictions, which per-card checks cannot see.
const SET_ASSERTIONS = [
  {
    name: 'a co-treated SGLT2i card declares the incretin trigger in its provenance',
    // Guards the SECOND of the three unified incretin sites - coIncretin, which feeds
    // cutoffForcesFast. Reverting it does not change the SGLT2i badge for this product,
    // because a patient on the pen trips the separate current-insulin trigger anyway, so
    // asserting the badge would catch nothing. The trigger text is what disappears. Same
    // lesson as 'assert the R-number, not just the badge'.
    check(results, scenario, selection) {
      if (!selection.hasIncretin) return null;
      // The trigger is only reachable on the long-fast surgery types, and only for T2DM:
      // a T1DM patient takes the fixed-hold branch, which never evaluates it. Asserting it
      // outside that branch would fail on scenarios where its absence is correct.
      if (scenario.dmType !== 'T2DM') return null;
      // Bariatric is a FIXED hold too (isFixedHold covers T1DM, ketogenic diet and
      // bariatric), so it never evaluates the fasting trigger either. Minor, major and
      // cardiac are asserted: since 2026-09-24 the trigger applies at minor
      // procedures as well (Mark - only the 2 h cutoff schedules a carbohydrate drink).
      // Colonoscopy is exempt: that sheet follows the prep and never issues the cutoff, so
      // the clinician's 12 h answer decides there (Mark, 2026-09-24, on clinical review).
      if (scenario.surgeryType === 'bariatric') return null;
      const sglt2i = results.find(c => c.id === 'sglt2i');
      if (!sglt2i) return null;
      const prov = JSON.stringify(sglt2i.provenance || {});
      if (scenario.surgeryType === 'colonoscopy') {
        return /satisfied by GLP-1 or tirzepatide co-treatment/.test(prov)
          ? 'colonoscopy: the GLP-1 cutoff trigger fired, but a colonoscopy sheet never issues that cutoff'
          : null;
      }
      if (!/satisfied by GLP-1 or tirzepatide co-treatment/.test(prov)) {
        return 'SGLT2i provenance does not declare the incretin co-treatment trigger';
      }
      return null;
    },
  },
  {
    name: 'a patient without diabetes is never held by the GLP-1 fasting cutoff',
    // Mark, 2026-09-24: for a patient without diabetes the 24 h window REPLACES the 12 h
    // question, the >3 h trigger and the GLP-1 cutoff trigger. This sweep fixes the cutoff
    // at midnight, so a co-treated patient without diabetes is exactly the case that would
    // show the incretin trigger if the exemption were lost.
    check(results, scenario) {
      if (scenario.dmType !== 'noDM') return null;
      const sglt2i = results.find(c => c.id === 'sglt2i');
      if (!sglt2i) return null;
      const prov = JSON.stringify(sglt2i.provenance || {});
      // Only the GLP-1 half is exercised here: the sweep fixes surgeryOver3h to null and the
      // fasting answers to false, so a surgery-length or 12 h check could never fire and would
      // be decoration. Those two were verified by a separate 138,240-scenario grid on 2026-09-24.
      if (/satisfied by GLP-1 or tirzepatide co-treatment/.test(prov)) return 'noDM: the GLP-1 cutoff trigger fired';
      return null;
    },
  },
  {
    name: 'a co-treated patient is never issued the timed carbohydrate drink',
    // THE silent failure this sweep exists for, and it is not the diet - the combination
    // card sets its own diet property, so a broken incretin test does not remove it.
    // What breaks is the SGLT2i COUPLING. onIncretin (index.html) decides whether the
    // timed drink is issued at all; when it wrongly reads false, the sheet prints
    // "8 to 12 ounces ... about 2 hours before you arrive" alongside "nothing to eat or
    // drink after midnight". Two contradictory eating instructions, silently.
    //
    // Precondition: this sweep fixes glp1NpoCutoff to 'midnight'. A co-treated patient
    // on a 2 h cutoff whose SGLT2i is CONTINUING is deliberately given the timed drink
    // (index.html, carbPatient branch), so this assertion would be wrong there.
    check(results, scenario, selection) {
      if (!selection.hasIncretin) return null;
      const offender = results.find(c => TIMED_DRINK.test((c.patient && c.patient.dietary) || ''));
      if (offender) {
        return `incretin present with a midnight cutoff, but card "${offender.id}" still issues the timed carbohydrate drink`;
      }
      return null;
    },
  },
  {
    name: 'on a colonoscopy the "follow the preparation instructions" bullet appears exactly once',
    // The SGLT2i limb omits its prep bullet when an incretin is present, because the GLP-1
    // card prints the same bullet directly above it. The omission keys on hasAnyIncretin and
    // the bullet on carriesGlp1Diet - two predicates that agree today by coincidence of the
    // drug database. If they ever disagree, a colonoscopy patient gets an SGLT2i carbohydrate
    // instruction with no statement anywhere that the prep governs. Clinical review 2026-09-16.
    check(results, scenario) {
      if (scenario.surgeryType !== 'colonoscopy') return null;
      const carriers = results.filter(c => c.id === 'sglt2i' || c[DIET_PROPERTY]);
      if (!carriers.length) return null;
      const n = results.filter(c => /Follow the preparation instructions/.test((c.patient && c.patient.dietary) || '')).length;
      if (n !== 1) return `colonoscopy: the prep bullet appears ${n} times across the cards (expected exactly once)`;
      return null;
    },
  },
];

// ------------------------------------------------------------- driver ----

function run() {
  const { getAllResults, DRUG_DB } = loadLogic();

  const orals = new Set();
  for (const key of ORAL_CLASSES) {
    const cls = DRUG_DB[key];
    if (!cls || !cls.drugs || !cls.drugs.length) throw new Error(`DRUG_DB has no drugs for "${key}" - class key renamed?`);
    for (const d of cls.drugs) orals.add(d.id);
  }
  // An enum the app does not recognise sweeps nothing while still reporting PASS.
  for (const dm of DM_TYPES) {
    if (dm !== 'T1DM' && dm !== 'T2DM' && dm !== 'noDM') throw new Error(`DM_TYPES contains "${dm}" - the app tests 'T1DM'/'T2DM'/'noDM'`);
  }
  if (!DRUG_DB.basalInsulin.drugs.some(d => d.id === COMBO_PEN)) {
    throw new Error(`${COMBO_PEN} not found in basalInsulin - drug id renamed?`);
  }

  const SELECTIONS = [
    { name: 'all oral agents', ids: orals, insulinDetails: {}, hasIncretin: false },
    { name: 'combination pen alone', ids: new Set([COMBO_PEN]), insulinDetails: COMBO_PEN_DETAILS, hasIncretin: true, varyDose: true },
    { name: 'combination pen + SGLT2i', ids: new Set([COMBO_PEN, 'empagliflozin']), insulinDetails: COMBO_PEN_DETAILS, hasIncretin: true, varyDose: true },
    { name: 'GLP-1 + SGLT2i', ids: new Set(['sema-sc', 'empagliflozin']), insulinDetails: {}, hasIncretin: true },
    // Added 2026-09-16 on clinical review: every SGLT2i scenario above is co-treated, so the
    // whole SGLT2i-only population - timed drink, on-waking escape, colonoscopy limb - was unswept.
    { name: 'SGLT2i alone', ids: new Set(['empagliflozin']), insulinDetails: {}, hasIncretin: false },
  ];

  const failures = [];
  let scenarios = 0;

  for (const selection of SELECTIONS)
  for (const surgeryType of SURGERY_TYPES)
    for (const surgeryTiming of TIMINGS)
      for (const dmType of DM_TYPES)
        for (const eGFR of EGFRS)
          for (const contrastWithin48h of CONTRASTS)
            for (const hasHF of HFS)
              for (const giSymptoms of GI_SYMPTOMS)
                for (const comboDose of (selection.varyDose ? COMBO_DOSES : ['40'])) {
              scenarios++;
              const scenario = { selection: selection.name, surgeryType, surgeryTiming, dmType, eGFR: eGFR || '(blank)', contrastWithin48h, hasHF, giSymptoms, comboDose: comboDose || '(blank)' };

              const ctx = { dmType, surgeryType, surgeryTiming, hasHF, hasCKD: false, arrivalTime: '', surgeryDate: '' };
              const details = {
                sglt2iMode: 'SPAQI', a1cOver8: null, prolongedFasting: false, surgeryOver3h: null,
                sglt2iDoseTime: 'morning', dkaHistory: null, ketoDiet: null,
                eGFR, contrastWithin48h, giSymptoms, glp1NpoCutoff: 'midnight',
                insulinDetails: selection.varyDose ? { [COMBO_PEN]: { eveningDose: comboDose } } : selection.insulinDetails,
              };

              let results;
              try {
                results = getAllResults(ctx, details, selection.ids);
              } catch (err) {
                failures.push({ scenario, card: '(threw)', assertion: 'getAllResults must not throw', detail: err.message });
                continue;
              }

              for (const card of results) {
                for (const a of ASSERTIONS) {
                  const detail = a.check(card, scenario);
                  if (detail) failures.push({ scenario, card: card.id, assertion: a.name, detail });
                }
              }
              for (const a of SET_ASSERTIONS) {
                const detail = a.check(results, scenario, selection);
                if (detail) failures.push({ scenario, card: '(whole sheet)', assertion: a.name, detail });
              }
            }

  return { scenarios, selections: SELECTIONS.length, failures };
}

let report;
try {
  report = run();
} catch (err) {
  console.error('SWEEP COULD NOT RUN\n' + err.message);
  process.exit(2);
}

console.log(`scenarios: ${report.scenarios}   selections: ${report.selections}   assertions: ${ASSERTIONS.length} per-card + ${SET_ASSERTIONS.length} per-sheet`);

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
