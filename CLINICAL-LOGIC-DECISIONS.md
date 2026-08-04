# Clinical Logic — Decision Record

**Scope of this document:** SGLT2 inhibitor pathway, WEB app. Extensible to other drug classes later.
**Status:** implemented on branch `design-mission-mcc`; not promoted to production.
**Decision-maker:** Mark Carlisle, MD. Every entry below was decided by him; nothing here is an assistant inference unless explicitly marked.
**Last updated:** 2026-08-04

## How to read this

Every rule is tagged with its provenance:

- **SOURCE** — stated by Oprea et al., SPAQI consensus, BJA 2026, with the R-number or location.
- **INSTITUTIONAL** — not in the source. An ABSMC decision. No R-number.
- **DEPARTURE** — the source says something different, and we are knowingly doing otherwise. Rationale recorded.

Where the source is silent, that is stated rather than papered over.

## Primary source

`G:\My Drive\PCMD\Perioperative Diabetes App - Source Articles\`
- `British Journal of Anaesthesia - article in press (1).pdf` — Oprea et al., SPAQI consensus. R1–R10 Box on p.12; Figure 2 reproduced p.18.
- `SGLT2 SPAQI Algorithm Part 1.jpg.pdf` — Figure 2 panels a, b.
- `SGLT2 SPAQI Algorithm Part 2.jpg.pdf` — Figure 2 panels c, d.

**Algorithm logic lives in figure boxes.** Render figure pages as images; text extraction drops branch structure.

**Box vs Figure conflict:** the Box (p.12) and Figure 2 disagree on the R-number for the T2DM major-noncardiac fasting hold — Box calls it R3a ("we recommend discontinuing"), Figure prints (R4) ("consider discontinuing", which the Box reserves for non-T2DM). **Decision: the Box governs.** The graded consensus statements are the recommendations; the figure is a rendering, and renderings are where transcription errors occur. The clinician view footnotes the discrepancy.

---

## 1. Base branch logic

### Cardiac surgery — three-way split — SOURCE (panel d)

| Patient | Action | Provenance |
|---|---|---|
| T2DM **with** HF or CKD | CONTINUE | R1 |
| **No** T2DM | CONTINUE | R1 |
| T2DM **without** HF or CKD | HOLD | R3a, grade B |

**Interim safeguard:** a clinician-facing flag instructs the NPs to confirm with CT surgery until written confirmation is received that continuing per guideline is acceptable. Message sent to the cardiac team 2026-07-31, read but not yet answered. **Remove this flag once CT surgery confirms.**

Note: this replaced a prior hold-for-all-cardiac-patients rule. The source continues in two of three cardiac sub-populations, and continuation there is grade B — the strongest grade in the Box — because HF/CKD patients derive cardiorenal benefit. The paper cites increased major perioperative complications in patients who withheld (25% vs 7.6%, P=0.04). Holding all cardiac patients carried a real safety cost, not merely patient burden.

### Type 1 diabetes — HOLD always — SOURCE (prose, not an R-number)

Supported by BJA p.18–20 (Limitations): *"…we advise following the FDA recommendations to discontinue these drugs before surgery for these patients, **irrespective of preoperative fasting and type of surgery**."*

- No R-number and no evidence grade — this is an FDA-label deferral in the Limitations section. Cite it narratively, not as R-n.
- Overrides every other branch.
- **Hold duration: same 72 h / 96 h as everyone else.** The source specifies no duration for T1DM (R3 is scoped to T2DM); the FDA labeling it defers to specifies the same intervals. Tagged FDA-derived. Not lengthened despite higher eDKA risk, because there is no basis for choosing a longer number. Revisit if data emerges.
- These patients should not be on an SGLT2i at all; use is off-label.

### Minor surgery / procedures / colonoscopy — CONTINUE — SOURCE (panel a, R1)

Panel a is a single column headed "Patient with or without T2DM" — no diabetes split.

### Bariatric surgery OR ketogenic / very-low-carbohydrate diet — HOLD

**DEPARTURE for T2DM patients.** Source (panel c) splits by diabetes status:
- T2DM → **R3b, grade B**: stop at the *start of the very-low-carbohydrate diet*, potentially ~14 days preoperatively.
- No T2DM → R3a, grade E: stop 3 days (4 ertugliflozin).

**We hold 72 h / 96 h for everyone, regardless of diabetes status.**

> **Rationale.** The clinic cannot rely on seeing these patients before the diet begins. Stopping at diet initiation creates an open-ended gap in glycemic control that would require initiating an alternative agent — a substantive clinical decision that should not be made by written preoperative instruction.

This is the **only permissive departure** in the pathway; every other departure is in the conservative direction. Recorded prominently for that reason.

### Major noncardiac surgery — CONTINUE by default

Applies to **both** T2DM and non-diabetic patients — one rule shape, not two.

- T2DM with HF or CKD → continue (**R1**)
- T2DM without HF or CKD → continue (**R2**, "consider continuing", grade B)
- No T2DM → continue (**R1**)

Hold if either universal trigger below fires.

For non-diabetics the source says *consider* stopping on anticipated prolonged fasting (**R4**); we harden "consider" into a hold. Minor conservative departure.

**HF/CKD status must still be collected** even though it does not change the output in this branch — it is the entire branch condition for cardiac surgery, and the correct R-number (R1 vs R2) cannot be emitted without it.

---

## 2. Universal hold triggers

These override **every** branch above, including the unconditional-continue branches (minor procedure, colonoscopy, non-diabetic cardiac).

### 2a. More than 12 hours without carbohydrate — INSTITUTIONAL (threshold), SOURCE (concept)

**One clinician-judgment question**, covering the entire perioperative carbohydrate-free window — from last preoperative carbohydrate through expected *postoperative* resumption. Exceeds 12 h → HOLD.

> **Rationale for a single universal threshold.** The source never numerically defines "prolonged fasting." HF/CKD patients plausibly tolerate a longer carbohydrate-free interval — the continue recommendations are strongest in that group — but no threshold is given for them. Rather than invent an unsourced number (18 h? 24 h?), one 12-hour threshold applies to all patients. **Where the source declines to differentiate, the app does not manufacture a differentiation.**

Source support for the concept and the number: R1 and R2 are scoped to *"patients not expected to fast from carbohydrates >12 h preoperatively"*; footnote a to panels a, b, d uses *">12 h"*. Note the source's 12 h refers to the *preoperative* fast; the hold trigger in R3a/R4 is *anticipated postoperative fasting*, left undefined. We apply one number to the combined window.

**Why this is not computed.** Postoperative resumption timing is clinical judgment — two cases finishing at 1 p.m. can resume carbohydrate three hours apart, and nothing in the app knows which is which.

#### Provenance of this trigger is branch-dependent (revised 2026-08-04)

This rule was originally tagged INSTITUTIONAL throughout. That was wrong in one branch and right in the others, and the app now distinguishes them:

| Branch | Provenance | Printed as |
|---|---|---|
| Major noncardiac, T2DM | **SOURCE** — Box p.12 **R3a** | "Held per SPAQI", R-number shown |
| Major noncardiac, no T2DM | **SOURCE** — Box p.12 **R4** | "Held per SPAQI", R-number shown |
| Minor procedure, colonoscopy, cardiac | **INSTITUTIONAL** — no R-number | "Held on ABSMC criteria", announces a departure |

R3a and R4 recommend discontinuing on anticipated prolonged fasting, so calling that hold institutional understated the source. But outside major noncardiac the source has **no fasting-keyed stop branch at all** — panel a contains no stop branch, and panel d stops only T2DM without HF/CKD, unconditioned on fasting. Exiting R1's scope means R1 does not apply; it does **not** mean SPAQI recommends holding. Claiming otherwise both misattributes the hold and suppresses the departure notice §7 requires.

**Caveat printed with the R-number.** R3a and R4 are keyed to anticipated *postoperative* fasting. This app deliberately asks one combined pre- plus postoperative question (above). A patient tripping the question on the preoperative limb alone — midnight NPO plus an afternoon case, normal postoperative diet — is not who R3a describes. The clinician view therefore prints the R-number together with a note that the question combines both windows, rather than a bare R-number.

The 12-hour threshold itself remains INSTITUTIONAL in every branch.

**Computed aid (display only, decides nothing):** for GLP-1 co-treated patients only, show the preoperative half — NPO cutoff plus arrival time — so the clinician isn't doing that arithmetic while estimating the postoperative side. Not shown for other patients, whose cutoff is typically 2 h before arrival and whose preoperative fast therefore never approaches 12 h on its own.

**Cross-class coupling, deliberate:** a GLP-1 patient's NPO cutoff (default midnight; options 8/6/4/2 h) feeds the SGLT2i hold decision. Midnight cutoff plus an afternoon case already exceeds 12 h before any postoperative time is added, so co-treated patients trip this rule far more often.

### 2b. Expected surgical duration > 3 hours — INSTITUTIONAL EXTENSION

**No R-number.** In the source, >3 h appears **only** in the intraoperative row and only as a trigger for eDKA *monitoring* in a patient who is *continuing* (R7). It is not a preoperative hold criterion.

> **Rationale.** Retained deliberately despite overlapping with the 12-hour rule. Most users will see the 3-hour question as meaningful and connected to the paper; without it, users may wonder whether expected surgical duration should have been asked. Holding also avoids obligating eDKA monitoring the institution would otherwise have to provision.

**Independent trigger:** either 2a or 2b holds. They are not redundant in practice — a 3.5-hour case with normal postoperative diet trips 2b but not 2a.

Generated text must **never** cite R7 for a hold.

### 2c. Risk-factor holds — INSTITUTIONAL EXTENSION

**No R-number.** These criteria are real but relocated: footnote **a** of panels a, b, d lists *"prolonged fasting for carbohydrates >12 h, <50 g carbohydrate diet, history of insulin use or DKA, or HbA1c >8%"* as triggers for *considering day-of-surgery eDKA testing in a patient who is continuing*. Converting a "consider testing" flag into a mandatory hold is a genuine transformation of the source and must be labeled as such.

| Trigger | Behavior | Notes |
|---|---|---|
| Any current insulin use | HOLD | **Derived from the medication list already selected** — not asked again. Adding/removing an insulin elsewhere changes the SGLT2i output; the clinician view must name insulin use as the trigger. |
| History of DKA | HOLD | New question. Yes / No / **Unknown**. **Unknown → HOLD.** |
| Most recent A1c > 8% | HOLD | Existing boolean, relabeled **"Most recent A1c >8%?"**. Deliberately not a numeric field — avoids implying a staleness judgment the source explicitly declines to make. |

Note the DKA-history limb was previously dropped and has been restored; it is the most predictive item on the footnote's list.

### Unknown / unanswered conventions — deliberate asymmetry

| Question | Unknown or blank resolves to | Why |
|---|---|---|
| More than 12 h without carbohydrate | **Cannot be left blank — REQUIRED** | Always answerable; it is a clinical judgment about the case, not a lookup. It forces a hold in every branch, so a blank would generate a recommendation from an unanswered question. The app refuses to generate until it is answered. |
| History of DKA | **HOLD** | Cannot be verified in clinic; conservative default appropriate. |
| Ketogenic diet | **NOT ketogenic** | Patients on these diets know it; strict forms are uncommon outside bariatric preparation. |
| Expected surgery > 3 h | **NO — no trigger** | Not required. A blank permits continuation; the fasting question carries the decision. |
| Most recent A1c > 8% ("Not available") | **No trigger — permits continuation** | A missing A1c is common. Holding a patient for an absent lab rather than an abnormal one is too costly a default. The clinician view should note that A1c was not supplied, so the omission is visible rather than silent. |

Recorded because the differences will otherwise look like inconsistencies.

Note on the >3 h rule: it was briefly considered whether >3 h should stop being decisive when the fasting answer is No. Rejected — if a case is expected to exceed 3 h the drug is held, independent of the fasting answer. The two triggers remain independent (§2b).

---

## 3. Hold duration and date arithmetic

**72 hours** for canagliflozin, dapagliflozin, empagliflozin. **96 hours** for ertugliflozin. — SOURCE (R3, R4: "3 days (4 days for ertugliflozin)").

**Strict clock, not calendar days.** The last dose must fall at least 72 h (96 h) before scheduled surgery/arrival time.

Worked example — Thursday 07:00 surgery:

| Dosing time | 72 h agents | Ertugliflozin (96 h) |
|---|---|---|
| Morning | Last dose **Monday** morning | Last dose **Sunday** morning |
| Evening | Last dose **Sunday** evening | Last dose **Saturday** evening |

Evening dosers lose an additional calendar day. A Monday *night* dose before a Thursday morning case is ~58 h and is **not** acceptable — this is why calendar-day arithmetic was rejected.

Note the day count is counterintuitive: 72 h before a Thursday case means skipping **Tuesday and Wednesday** — two missed doses, not three. Colloquial "stop 3 days before" would imply three.

**Source gap:** the paper does not state whether "3 days" means 72 h or 3 missed doses. 72 h is our operational definition.

**Inputs required:** surgery date; arrival/surgery time (already collected); dose time-of-day (morning/evening — new, precision beyond that buys nothing).

### Assumed dosing hours: morning 06:00, evening 20:00 (decided 2026-08-04)

The worked example above requires an assumed clock hour, and the app now uses **06:00** for morning dosers and 20:00 for evening dosers.

At the previously assumed 08:00, a Monday dose is 71 h before a Thursday 07:00 arrival, so the strict clock pushed the last dose back to Sunday and the table above was internally inconsistent with its own rule. 06:00 makes the table hold as written.

> **Rationale for accepting the earliest plausible hour.** A clinical review raised that 06:00 is the *least* conservative choice: a patient who really takes the pill at 09:00 on that Monday gets 70 h, not 72. **Considered and accepted**, because the clock is anchored to **arrival**, not to incision. Arrival is roughly two hours before the operation and incision is rarely before 08:00, so a late morning doser still clears ~72 h to incision. The arrival anchor supplies the margin the assumed hour gives up. There is always a balance of risk between holding and continuing, and an extra skipped day is not free.

**Known residual:** the same slack exists for evening dosers assumed at 20:00 (a 22:00 doser loses two hours). Not addressed; the arrival anchor covers it by the same argument.

The assumed hour is disclosed on the clinician card ("morning dosing assumed 06:00"). It is deliberately **not** printed on the patient sheet, which names calendar days rather than clock hours.

### Surgery date — optional

- Present → print the **explicit calendar date** *and* **the number of days held**. Both, always. The interval lets the patient re-derive the date if their surgery moves.
- Absent → instructions still generate, using relative language.

### Dose time-of-day — scope

Collected for **SGLT2i only** in this pass. Time-of-day plausibly matters for other classes (insulin, sulfonylureas, daily vs weekly GLP-1). A separate scouting pass will map every place in the app where time-of-day already changes an instruction or should, before any app-wide intake change. Shared intake is not modified without flagging first.

---

## 4. Continue means continue

A continued patient takes the medication **on the normal schedule, including the morning-of dose** if that is when they take it.

There is no one-dose hold for SGLT2i. The only two states are a 72/96 h hold or uninterrupted continuation. This differs from metformin, which is held the morning of but permitted up to the night before.

Not a departure: the source says SGLT2i *"can be"* withheld on the day of the procedure (colonoscopy discussion, p.10/p.14) — permissive, not directive.

---

## 5. Carbohydrate instruction

**Applies to every patient on an SGLT2i — held or continuing — with no group suppressed.**

Only for SGLT2i patients. This is not general preoperative advice; patients not on an SGLT2i receive no such recommendation.

**Content:** carbohydrate-containing **clear liquids**, patient's choice. Examples: apple juice, cranberry juice, sports drinks, soda. Excluded: anything milky or creamy.

**Sugar-free exclusion — required wording.** The instruction must explicitly say to avoid **carbohydrate-free / sugar-free versions**. Every named example has a mass-market zero-carbohydrate twin in near-identical packaging (Diet Coke, Coke Zero, Gatorade Zero, G2, diet cranberry, no-sugar-added apple juice), and this population has been conditioned for years to choose exactly those. Without the exclusion, a patient drinks a zero-carbohydrate product, believes they have complied, receives no eDKA mitigation, and the omission is undetectable — the record shows the instruction was given. This is a silent-failure path, which is why the exclusion is mandatory rather than advisory.

**No volume limit — for any patient, including GLP-1 co-treated.** Clear liquids are ad lib up to the applicable cutoff; after the cutoff, nothing. The app states no volume, target, or ceiling.

> **Rationale.** Existing practice permits clear liquids ad lib to the cutoff and gives no volume instruction to anyone. ASA fasting guidance likewise permits clear liquids to 2 h without imposing a volume ceiling. The clinical reviewer raised unbounded volume as a HIGH finding on gastric-residual grounds in GLP-1 patients; **considered and declined.** Either a patient may drink up to the cutoff or they may not — volume is not the lever being managed, and specifying amounts would depart from how every other patient in the clinic is instructed.

**Emphasis gradient: stronger for patients CONTINUING than for patients holding.** Consistent with the source's emphasis — the gram targets appear only in boxes whose primary instruction is *continue* (panels a and b), and are absent where the instruction is to stop (panels c and d). The source does not state this gradient in prose; it is inferred from where the targets are placed. Rationale: carbohydrate emphasis rides with the drug still being on board, and p.17 notes a washout of 4–5 half-lives largely mitigates eDKA risk in held patients.

**Do not name the clinic-supplied product.** Bariatric patients receive a carbohydrate drink from the clinic; the app must not issue instructions about that specific product.

**Bounded by the strictest NPO cutoff** applying to that patient across all their medications. Midnight cutoff → no morning-of drink instructed. 2 h cutoff → permitted up to 2 h before.

**Explain the rationale** in both the clinician view and the patient sheet.

### Groups explicitly NOT suppressed, and why

The clinical reviewer recommended suppressing this instruction for bariatric/VLCD patients and for T1DM. **Both recommendations were overruled, on factual grounds:**

- **Bariatric / VLCD.** The reviewer assumed a preoperative very-low-carbohydrate diet forbids carbohydrate liquids and that instructing them would countermand the surgeon's liver-reduction diet. **This is factually incorrect at ABSMC** — bariatric patients are permitted clear carbohydrate drinks preoperatively and in fact receive a carbohydrate-loading drink from this clinic. The reviewer was reasoning from the paper without knowledge of local practice.
- **Ketogenic diet, non-bariatric.** Uncommon, and self-selected. A short deviation for perioperative carbohydrate is acceptable and will be recommended.
- **Type 1 diabetes.** These patients should not be on an SGLT2i, but if one is, the carbohydrate drink is recommended **strongly**, and the instruction states explicitly that it is recommended *because they are on an SGLT2 inhibitor and to mitigate the risk of euglycemic DKA*.

**Do not re-raise these as safety findings without new information.** The reviewer's bariatric finding was tagged CRITICAL and is superseded by local practice.

### Provenance and known gaps — carbohydrate instruction

- **The gram target is ungraded.** "50–100 g carbohydrates/day" (panels a and b-T2DM) and ">50 g carbohydrates/day" (panel b non-T2DM) appear **only inside figure boxes** — not in the prose, not in the R1–R10 Box, not in Table 5. No R-number, no evidence grade. Do not present it to a clinician as a graded consensus recommendation.
- **Panels c and d carry no gram target.** Panel c carries no carbohydrate instruction at all.
- **The source does not support a day-of-surgery carbohydrate drink.** Searches for "carbohydrate load/loading/drink/beverage" return zero hits across all 24 pages. The source supports (i) daily dietary carbohydrate in the days before and (ii) minimizing fasting duration. Instructing a *drink* is an INSTITUTIONAL EXTENSION and must not be attributed to SPAQI.
- **The correct citation for carbohydrate-containing clear liquids** is the 2023 ASA modular fasting update (Joshi/Abdelmalak/Weigel, Anesthesiology 2023;138:132–51), which SPAQI cites once (ref 78) for fasting limits only. **Not yet obtained or read.**
- **The source is silent** on carbohydrate loading in diabetes (hyperglycemia on arrival, gastroparesis) — zero hits for "gastroparesis" or "aspiration". It is silent on GLP-1 RAs and tirzepatide entirely ("GLP-1" appears once, in a reference title).

---

## 6. Scope boundary

**In scope:** day-of-surgery *medication* instructions — take or hold that morning, for every drug class. This is core app function.

**Out of scope:**
- Decisions requiring data gathered on the day of surgery.
- Instructions that are not preoperative: intraoperative eDKA monitoring, prophylactic dextrose/insulin infusions, postoperative monitoring. Rationale: this guidance would never reach the clinician actually caring for the patient. If it is ever wanted, it belongs in a clinician note, not the patient sheet. **Parked, not rejected.**

Note: `SGLT2I-SPEC.md` §1 states the "Preoperative DOS" row is out of scope because "the app never runs at that moment." **That sentence is wrong** and is superseded by this section.

---

## 7. Clinician view

Per `SGLT2I-SPEC.md` §5.2, the clinician view shows: base recommendation with R-number(s); any applied override marked as institutional; the named trigger that fired; the source-override notice described below; the note that eDKA monitoring is an alternative to holding where monitoring exists; and the override control.

### Source-override notice — ANNOUNCE EVERY OVERRIDE (decided 2026-07-31)

Whenever an institutional trigger (§2b, §2c) overrides a source CONTINUE, the clinician view must say so and name the trigger that did it. **This applies to every override, not a subset** — R1 or R2, T2DM or non-diabetic, any of the five triggers.

Fires when `baseRecommendation === 'CONTINUE'` and at least one **institutional** trigger fired and **no source-backed trigger** did. The notice carries the source recommendation with its R-number.

**Narrowed 2026-08-04.** The original condition was `overrideTriggers.length > 0` with no provenance test, which announced "SPAQI would continue here" over holds the source itself recommends (§2a, R3a/R4) — the opposite of the truth. The narrowing is only safe because the fasting trigger is now correctly classified per branch; when it is institutional, as it is outside major noncardiac, the notice still fires.

**Two labeled groups.** Firing triggers render as "Held per SPAQI" (with R-numbers) and "Held on ABSMC criteria", each shown only when non-empty. Where the base recommendation is *already* HOLD, institutional triggers render as "Also present ... the hold above is already source-recommended" — calling them the basis would frame a grade B recommendation to discontinue as an institutional add-on a clinician might reasonably override.

**The eDKA-monitoring alternative renders on every hold**, not only alongside an override notice.

> **Rationale.** Five institutional rules override a published guideline. Each is defensible and each is recorded here. The honest behavior is to disclose the departure every time rather than only in one branch. It also makes the clinician override control meaningful — the reviewing clinician sees what the source said and what the institutional rule did to it.

**This supersedes the earlier `overridesR1Continue` flag**, which fired only when the overridden continue was an R1 earned via HF or CKD in a T2DM patient. That definition produced a confusing asymmetry: a non-diabetic taking an SGLT2i purely for CKD, held because their case is expected to exceed 3 h, is arguably the clearest conflict in the pathway and received no notice at all. Meanwhile a T2DM patient whose R2 "consider continuing" was overridden by the same rule also received none.

Accepted cost: the notice appears often, because these triggers fire often. It therefore reads as "here is the departure," not "here is an unusual conflict."

**R-numbers are printed.** Box governs over Figure 2 where they conflict; the discrepancy is footnoted, which also flags a real inconsistency to residents practicing from the paper.

Every output string derived from the source carries its R-number. Every output that does not is marked as an institutional extension.

---

## Open items

1. Institutional definition of "minor procedure" vs "major noncardiac". The source defines neither.
2. Whether "3 days" in the source means 72 h or 3 missed doses — unresolvable from the source; 72 h adopted.
3. CT surgery confirmation on the cardiac change; remove the NP double-check flag when received.
4. 2024 AGA/ASA/ASMBS multisociety GLP-1 guidance — cited by the app, **not on disk, not read**.
5. 2023 ASA modular fasting update — needed to cite carbohydrate clear liquids correctly. **Not on disk.**
6. Three remaining uncommitted 7/26 edits still need clinical sign-off (the morning-of string is now endorsed; the conservative-hold-when-unanswered default, the citation change, and the toggle relabeling are not).
7. Clinician override feature — settled in principle (per-session, resets; patient PDF notes instructions were clinician-reviewed without clinical detail; no audit trail of the original recommendation) but the UI has not been designed or discussed.
