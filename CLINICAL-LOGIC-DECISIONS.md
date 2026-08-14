# Clinical Logic — Decision Record

**Scope of this document:** SGLT2 inhibitor pathway, WEB app. Extensible to other drug classes later.
**Status:** implemented on branch `design-mission-mcc`; not promoted to production.
**Decision-maker:** Mark Carlisle, MD. Every entry below was decided by him; nothing here is an assistant inference unless explicitly marked.
**Last updated:** 2026-08-11

## How to read this

Every rule is tagged with its provenance:

- **SOURCE** — stated by Oprea et al., SPAQI consensus, BJA 2026, with the R-number or location.
- **INSTITUTIONAL** — not in the source. An ABSMC decision. No R-number.
- **DEPARTURE** — the source says something different, and we are knowingly doing otherwise. Rationale recorded.

Where the source is silent, that is stated rather than papered over.

## Primary source

`G:\My Drive\PCMD\Projects\Perioperative-Diabetes-App\Source-Articles\`
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

**Adopted 2026-08-12 (Mark).** The interim clinician-facing flag telling the NPs to confirm
cardiac cases with CT surgery has been **removed from the app**. The three-way cardiac split
above is now the standing recommendation, with no double-check notice attached. The flag ran
from 2026-07-31, when the question went to the cardiac team, until Mark elected to adopt the
guideline pathway rather than keep waiting on a written reply that never came.

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

**One clinician-judgment question** (with one computed exception, below - a GLP-1 or tirzepatide cutoff earlier than 2 h before arrival satisfies it outright), covering the entire perioperative carbohydrate-free window — from last preoperative carbohydrate through expected *postoperative* resumption. Exceeds 12 h → HOLD.

> **Rationale for a single universal threshold.** The source never numerically defines "prolonged fasting." HF/CKD patients plausibly tolerate a longer carbohydrate-free interval — the continue recommendations are strongest in that group — but no threshold is given for them. Rather than invent an unsourced number (18 h? 24 h?), one 12-hour threshold applies to all patients. **Where the source declines to differentiate, the app does not manufacture a differentiation.**

Source support for the concept and the number: R1 and R2 are scoped to *"patients not expected to fast from carbohydrates >12 h preoperatively"*; footnote a to panels a, b, d uses *">12 h"*. Note the source's 12 h refers to the *preoperative* fast; the hold trigger in R3a/R4 is *anticipated postoperative fasting*, left undefined. We apply one number to the combined window.

**Why this is not computed in general.** Postoperative resumption timing is clinical judgment — two cases finishing at 1 p.m. can resume carbohydrate three hours apart, and nothing in the app knows which is which.

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

**Computed aid (display only, decides nothing on its own):** for GLP-1 co-treated patients only, show the preoperative half — NPO cutoff plus arrival time — so the clinician isn't doing that arithmetic while estimating the postoperative side. Not shown for other patients, whose cutoff is typically 2 h before arrival and whose preoperative fast therefore never approaches 12 h on its own.

**Cross-class coupling is now COMPUTED, not left to the clinician (Mark, 2026-08-13).**
For a patient co-treated with a GLP-1 RA or tirzepatide, the prolonged carbohydrate-free
window stops being a judgment call: their own fasting cutoff settles it.

| GLP-1 / tirzepatide cutoff | SGLT2 inhibitor |
|---|---|
| After midnight | **Trigger satisfied - HOLD** |
| 8 h before arrival | **Trigger satisfied - HOLD** |
| 6 h before arrival | **Trigger satisfied - HOLD** |
| 4 h before arrival | **Trigger satisfied - HOLD** |
| 2 h before arrival | No automatic trigger; the clinician's answer decides, as for everyone else |

**Scoped to major noncardiac, cardiac and bariatric surgery (clinical review, 2026-08-13).**
As first written the rule had no surgery-type condition, so it held minor-procedure and
colonoscopy patients too - overriding an explicit No from the clinician on a premise that is
false for them. Worked: colonoscopy, last carbohydrate at a midnight cutoff, 07:30 arrival,
procedure about 09:00, eating by about 11:00 is roughly 11 h, under the 12 h threshold. SPAQI
panel a carries no fasting-keyed stop branch for those procedures at all. Reproduced in the
browser before the fix and after. The certainty this rule rests on is the postoperative half
of the window, and that half is short precisely in the branches now excluded.

The 2 h cutoff is the only one that leaves a co-treated patient where every other patient
sits - clear liquids to 2 h before arrival - so the ordinary judgment applies there and
nowhere else.

**This overrides an explicit No from the clinician.** The rule exists because the cutoff is
a fact about the patient's fasting plan, not an opinion about it.

> **The certainty rests on the POSTOPERATIVE half of the window.** Midnight to an 07:30
> arrival is 7.5 h, not 12. The rule clears 12 h only once time to incision and the
> postoperative stretch before carbohydrate resumes are added - which is exactly the combined
> window this section's question asks about. Do not "correct" this rule later by checking the
> preoperative clock alone; the same caution is written into the code comment.

**Implemented by satisfying the existing trigger, not by adding a parallel one.**

> **CORRECTED 2026-08-13 after clinical review.** This section previously claimed the existing
> provenance applied unchanged. It does not. R3a and R4 are both keyed to anticipated
> POSTOPERATIVE fasting. When the cutoff fires the trigger and the clinician has answered NO to
> the combined question, the source's condition is not established, and printing "Held per
> SPAQI (R3a/R4)" claims guideline backing the entered facts do not support - while also
> suppressing the section 7 departure notice, which fires only when no source-backed trigger
> did. **A hold fired by the cutoff alone is now tagged INSTITUTIONAL with no R-number, and it
> announces its departure like any other institutional trigger.** Where the clinician answered
> YES, the R-number stands exactly as before. Reproduced both ways in the browser.

The provenance below therefore applies only when the clinician has affirmed the fast: R3a for T2DM and R4 for
non-diabetics in major noncardiac surgery, institutional elsewhere with the departure notice
firing. The trigger label names the cutoff when the cutoff, rather than the clinician, is
what fired it, so the clinician view never implies they answered a question they did not.
Verified across all five cutoffs, both diabetes statuses, and both provenance branches.

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
| History of DKA | HOLD | **Yes / No only.** A blank answer holds - see the blank-answer defaults below. |
| Most recent A1c > 8% | HOLD | Existing boolean, relabeled **"Most recent A1c >8%?"**. Deliberately not a numeric field — avoids implying a staleness judgment the source explicitly declines to make. |

Note the DKA-history limb was previously dropped and has been restored; it is the most predictive item on the footnote's list.

### Unknown / unanswered conventions — deliberate asymmetry

| Question | Unknown or blank resolves to | Why |
|---|---|---|
| More than 12 h without carbohydrate | **Cannot be left blank — REQUIRED** | Always answerable; it is a clinical judgment about the case, not a lookup. It forces a hold in every branch, so a blank would generate a recommendation from an unanswered question. The app refuses to generate until it is answered. |
| History of DKA | **HOLD when blank** | Cannot be verified in clinic and cannot be reconstructed later; conservative default appropriate. The only blank that holds - see below. |
| Ketogenic diet | **NOT ketogenic** | Patients on these diets know it; strict forms are uncommon outside bariatric preparation. |
| Expected surgery > 3 h | **NO — no trigger** | Not required. A blank permits continuation; the fasting question carries the decision. |
| Most recent A1c > 8% ("Not available") | **No trigger — permits continuation** | A missing A1c is common. Holding a patient for an absent lab rather than an abnormal one is too costly a default. The clinician view should note that A1c was not supplied, so the omission is visible rather than silent. |

Recorded because the differences will otherwise look like inconsistencies.

#### Blank-answer defaults, and why DKA is the exception (Mark, 2026-08-13)

Four questions can be left blank. Three default toward continuation; one does not.

| Question left blank | Default applied | Effect |
|---|---|---|
| Most recent A1c >8% | treated as not over 8% | permits continuation |
| Expected surgical duration >3 h | treated as under 3 h | permits continuation |
| Ketogenic / very-low-carbohydrate diet | treated as not on one | permits continuation |
| **History of DKA** | **treated as not established** | **HOLDS** |

**The asymmetry is deliberate.** The first three fail toward continuing a drug in someone whose
risk nobody measured. The fourth fails toward continuing an SGLT2 inhibitor in the patient the
source flags hardest. **Corrected 2026-08-13:** footnote a lists four risk factors - prolonged
carbohydrate fasting, a <50 g carbohydrate diet, history of insulin use or DKA, and HbA1c >8% -
as an unranked disjunctive list, and does NOT designate DKA history the most predictive of
them. The app and this record both said it did; the claim has been removed from the clinician
view. What survives is institutional and is stated as such: unlike an A1c, a DKA history cannot
be reconstructed after the fact. A clinician who knows the patient
has no history answers No and gets a continue - that is what the No answer is for.

**The "Unknown" option is REMOVED from the DKA question.** It is now Yes / No, and blank carries
the meaning Unknown used to: nobody has established the history, so the drug is held. Keeping
both was a distinction without a difference, since both held. The app has no persistence layer,
so there was nothing stored to migrate.

**Disclosure lives in the clinician view, not under every intake question.** Printing each
default beneath its question would bloat the intake, and the people who need to know are
clinicians reading the output. The clinician view prints, only when something was left blank:

- one dim line naming every permissively-defaulted blank and what was assumed for each;
- for a blank DKA question, a highlighted block stating that the history is neither confirmed
  nor excluded, that this blank holds where the others do not, why, and that answering No
  produces a continue.

Both are silent when every question was answered. Verified 2026-08-13 across all four fields
individually and together.

> **Flagged for clinical review.** Mark asked that the reviewer specifically weigh whether a
> blank DKA question should hold, given it is the single place where an unanswered question
> changes the recommendation. The counter-argument is that a clinician who skipped it probably
> had no reason to suspect DKA, and the hold costs those patients three days of their drug.

> **Discussed and not adopted:** letting an unknown or blank DKA history continue with a
> clinician-view note. Raised 2026-08-13 on the initial understanding that the app already
> behaved that way; it did not.

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

**Content:** carbohydrate-containing **clear liquids**, patient's choice. Named examples:
clear juice without pulp, sports drinks, regular (non-diet) soda, and plain gelatin. Water,
diet drinks, tea or coffee without milk and fat-free broth are permitted clear liquids but
are named as **not** counting toward the carbohydrate, since broth and diet drinks are the
two a patient is most likely to believe do.

### An instruction at a moment, not a permission window (Mark, 2026-08-13)

The earlier wording - *"drink clear liquids that contain carbohydrate up until 2 hours before
your arrival time"* - was a permission window, and it read as an invitation to drink sugary
liquids through the days before surgery. That was never the intent. **Mark's correction: the
point is to get carbohydrate in at a moment, close to surgery, for SGLT2 inhibitor patients
specifically.**

The sheet now states the clinic's ordinary fasting rules and then adds one step. What each
group receives:

| Patient | Eating and drinking on this sheet |
|---|---|
| **Neither drug** | Nothing. A pointer to the Preoperative Clinic's own instructions, so there is nothing here to contradict Epic. |
| **SGLT2 inhibitor, no GLP-1** | The clinic rules restated - solids stop 8 h before arrival, clear liquids until 2 h before, with examples - **plus** a carbohydrate-containing clear liquid as the LAST thing they drink, at about 2 h before arrival. |
| **GLP-1, no SGLT2 inhibitor** | Unchanged rules, plus what counts as a clear liquid. |
| **Both** | Depends on the cutoff and on whether the SGLT2i continues - superseded by the matrix below. |

### Who gets the drink, and when (Mark, 2026-08-13 - supersedes the rows above where they differ)

The single rule underneath all of it: **the on-waking drink goes to a patient who is
CONTINUING the SGLT2 inhibitor and whose clear liquid cutoff is the ordinary 2 h.**

| Patient | Arrival | Instruction |
|---|---|---|
| SGLT2i only, **continuing** | early | **8-12 oz on waking, the first thing they do** |
| SGLT2i only, **continuing** | normal | 8-12 oz at about 2 h before arrival |
| SGLT2i only, **held** | early | 8-12 oz **before bed** |
| SGLT2i only, **held** | normal | 8-12 oz at about 2 h before arrival |
| GLP-1 + SGLT2i, cutoff **earlier than 2 h** | any | **No timed or morning drink.** Shape the 24 h clear liquid diet instead: some of it should contain carbohydrate, and so should the last drink before the cutoff |
| GLP-1 + SGLT2i, cutoff **2 h**, **continuing** | early | **8-12 oz on waking** |
| GLP-1 + SGLT2i, cutoff **2 h**, **continuing** | normal | 8-12 oz at about 2 h before arrival |
| GLP-1 + SGLT2i, cutoff **2 h**, **held** | any | **No timed drink**; the 24 h diet wording only |

"Early" is not computed. The sheet says *if that time falls while you are asleep*, and the
patient judges it. This keeps Mark's intervals-not-clock-times rule and needs no threshold.

**The on-waking drink may fall inside the final 2 h before ARRIVAL, and that is deliberate.**
The boundary that actually matters is 2 h before *surgery*. Every cutoff in this app is stated
against arrival because arrival runs about 2 h ahead of surgery, which is what makes the
cutoffs conservative in the first place (see the 2026-08-04 item A decision). A patient waking
at 04:00 for an 05:30 arrival drinks about 3.5 h before anesthesia - comfortably outside what
ASA asks for, and outside the 2 h ASA itself specifies. The patient sheet says the drink
supersedes where instructions differ, so the printed 2 h clear-liquid line does not contradict
it, but **preoperative staff should be aware** that these patients are told to drink on waking.

> **Why before bed for a HELD patient rather than on waking.** A drink at bedtime is a weak
> version of this instruction - the clinical review objected to it for exactly that reason, since
> a 22:00 drink before an 05:30 arrival leaves a ~7.5 h carbohydrate-free window and delivers
> the carbohydrate where it helps least. It is kept for held patients because the deviation
> from the stated fasting window has to be paid for by benefit, and the benefit is smaller once
> the drug has been stopped for 72-96 h. **The evidence for how much eDKA risk survives an
> adequate hold has NOT been checked, and it is the fact that decides this row. Open.**

> **The deliberate asymmetry, and its reason.** A HELD SGLT2i-only patient still gets the timed
> drink; a HELD co-treated patient with the same 2 h cutoff gets none. Mark, 2026-08-13: for the
> co-treated patient there is a gastric-emptying cost to putting anything extra in, so the drink
> is only worth it where the euglycemic DKA rationale is strongest, which is a continuing drug.
> For the SGLT2i-only patient there is no such cost to weigh against it. Recorded because two
> patients with identical fasting windows receive different sheets, and that will otherwise read
> as an inconsistency.

**The co-treated 2 h cutoff was previously lumped in with the other four and got no timed
instruction at all** - it received *"whenever you have your last drink before you have to stop,
make that one a carbohydrate drink too"*, which is a conditional about a drink they may not
have, not an instruction to drink. Mark caught this 2026-08-13. The no-clock anchoring exists
because a named time lands between 1 and 5 am for the midnight, 8, 6 and 4 h cutoffs; the 2 h
cutoff has no such problem, and section 2a already singles it out as the one that leaves a
co-treated patient where everyone else sits. The patient text now splits the same way the hold
rule does.

**Volume is now stated to the patient: 8 to 12 ounces**, on every timed instruction. This
reverses the earlier no-volume decision below. 8-12 oz is 237-355 mL, at or just under the
up-to-400 mL ASA 2023 tested (median 400, IQR 300-400), and it brackets the 10 oz
carbohydrate drink already in use at the clinic. **The product is still never named on the
patient sheet.** Mark's 10 oz figure has not been independently confirmed.

**Intervals only, never computed clock times.** Mark's choice: the lines cannot go stale if
the surgery time moves, and the patient keeps the rule rather than only the answer.

**The 8-hour solids rule and the 2-hour clear liquid rule are the clinic's, restated here,
not invented by the app.** They are stated only for SGLT2 inhibitor patients, because those
patients need the 2 h boundary named in order for the added instruction to make sense.

**Nobody is asked to set an alarm.** For a dual-drug patient the drink is anchored to their
last drink before the cutoff rather than to a clock, because a named time lands between 1 and
5 am for several arrival-time and cutoff combinations - a 6 h cutoff before an 07:30 arrival
is 01:30, an 8 h cutoff before a 12:30 arrival is 04:30. For an SGLT2-only patient the timed
instruction is kept, with an explicit escape: if 2 h before arrival falls while they are
asleep - a 05:30 arrival puts it at 03:30 - they drink before bed instead.

### Colonoscopy is carved out of the supersession (clinical review, 2026-08-13)

The rewritten sheet restated the clinic's 8 h solids / 2 h clear liquid rules and then told the
patient, in writing, to follow this sheet wherever it differs from their other instructions.
For a colonoscopy patient that is a live instruction conflict: bowel preparation governs their
intake, is stricter and differently timed, and SPAQI continues the SGLT2i for these patients, so
it is a common combination rather than an edge case. It also resolved, in this sheet's favor,
the Epic-conflict question recorded below as Mark's to own.

**A colonoscopy patient now receives no restated fasting rules and no supersession sentence.**
They are pointed at their preparation instructions, told to follow them, and given the one extra
step: make the LAST drink before the cut-off a carbohydrate-containing clear liquid, avoiding
red, purple and orange, with a line telling them to follow the prep and notify the clinic if it
does not permit this. **The red/purple/orange exclusion is new and is an assistant addition, not
a Mark decision - it needs his sign-off.** The milk, pulp and alcohol exclusions, dropped in the
rewrite, are restored to both this and the general instruction.

**Arrival hyperglycemia is now disclosed to the clinician.** The drink goes to patients whose
SGLT2 inhibitor may be held for 72-96 h, so the glucose-lowering agent is off while the
carbohydrate goes in - and hyperglycemia with case cancellation is the one concrete harm
Endocrine Society Rec 8.1 names. The clinician text now says so and carries the ASA volume and
the home-glucometer suggestion. The patient sheet is unchanged and still states no volume.

> **OPEN, needs Mark: the before-bed escape.** For an early arrival the sheet tells an
> SGLT2i-only patient to drink before bed rather than at 03:30. The clinical review would not
> sign it: a 22:00 drink before an 05:30 arrival is a ~7.5 h preoperative carbohydrate-free
> window, most of the way to the 12 h threshold before the postoperative limb is counted, and
> inconsistent with auto-holding a 4 h GLP-1 cutoff. Suggested alternatives: drink on waking to
> travel, or omit the extra step for arrivals before about 07:00. **Behavior unchanged; a note
> to that effect is in the clinician text.** Mark set the no-alarm principle deliberately, so
> the replacement is his call, not the reviewer's.

**These instructions supersede the general clinic ones where they differ**, stated on the
sheet for both SGLT2 inhibitor and GLP-1 patients. **Rollout risk Mark flagged:** the clinic
also issues fasting instructions from Epic, and if both are printed they can disagree. One
fix is to have Epic defer to this handout for these patients. **Not resolved; owned by Mark.**

**Sugar-free exclusion - required wording.** The instruction must explicitly say that diet,
zero-sugar and sugar-free versions do not count. Every named example has a mass-market
zero-carbohydrate twin in near-identical packaging (Diet Coke, Coke Zero, Gatorade Zero, G2,
diet cranberry, no-sugar-added apple juice), and this population has been conditioned for
years to choose exactly those. Without the exclusion, a patient drinks a zero-carbohydrate
product, believes they have complied, receives no eDKA mitigation, and the omission is
undetectable - the record shows the instruction was given. This is a silent-failure path,
which is why the exclusion is mandatory rather than advisory.

**No volume limit - for any patient, including GLP-1 co-treated.** Clear liquids are ad lib
up to the applicable cutoff; after the cutoff, nothing. The app states no volume, target, or
ceiling. Note this survives the change from a permission window to an instruction: the
patient is told to have a carbohydrate drink, not how much of one.

**The emphasis gradient is RETIRED (2026-08-13).** The instruction previously read
*"especially important because you are staying on this medicine"* versus *"important even
though you are stopping"*, inferred from the source placing its gram targets only in
continue-limbed panels. Mark's reason sentence replaces both: *"In people who take these
medicines, going a long stretch without carbohydrate can cause acid to build up in the blood
... This is true whether or not you are stopping it before surgery."* The gradient was
dropped because "while taking it" invited a held patient to conclude the instruction did not
apply to them, which is the opposite of the intent - the instruction has always gone to held
and continuing patients alike.

**Do not name the clinic-supplied product.** Bariatric patients receive a carbohydrate drink
from the clinic; the app must not issue instructions about that specific product.

**Explain the rationale** in both the clinician view and the patient sheet.

### Groups explicitly NOT suppressed, and why

The clinical reviewer recommended suppressing this instruction for bariatric/VLCD patients and for T1DM. **Both recommendations were overruled, on factual grounds:**

- **Bariatric / VLCD.** The reviewer assumed a preoperative very-low-carbohydrate diet forbids
  carbohydrate liquids and that instructing them would countermand the liver-reduction diet.
  That reasoning came from the paper without knowledge of local practice, and the instruction
  stands - but the local practice was recorded inaccurately here until 2026-08-12 and the
  correct version matters, because it makes this a deliberate exception rather than a
  restatement of what the clinic already does.

  **What ABSMC actually does (Mark, 2026-08-12): bariatric patients receive a preoperative
  carbohydrate drink, EXCEPT those with diabetes.** The earlier entry said only that bariatric
  patients receive one, which is true of the non-diabetic majority and false for exactly the
  population this app serves.

  **The app therefore makes an exception to that exception, deliberately.** A bariatric patient
  who has diabetes AND is on an SGLT2 inhibitor still receives the carbohydrate instruction,
  because euglycemic ketoacidosis is the governing risk for that patient and it is the reason
  the instruction exists at all. Mark confirmed on 2026-08-12 that this is the intended
  behavior. **Verified in the browser the same day:** bariatric with type 2 diabetes, bariatric
  with type 1 diabetes, and bariatric without diabetes all receive the instruction when an
  SGLT2 inhibitor is selected, and no patient receives it otherwise.

  Note this narrows what the reviewer was originally overruled on. The instruction is not
  "what the clinic already gives these patients"; it is a considered departure from the
  clinic's own diabetes carve-out, made for a drug-specific reason. It sits alongside the
  Endocrine Society Recommendation 8.1 departure in section 10 and is disclosed for the same
  reason.
- **Ketogenic diet, non-bariatric.** Uncommon, and self-selected. A short deviation for perioperative carbohydrate is acceptable and will be recommended.
- **Type 1 diabetes.** These patients should not be on an SGLT2i, but if one is, the carbohydrate drink is recommended **strongly**, and the instruction states explicitly that it is recommended *because they are on an SGLT2 inhibitor and to mitigate the risk of euglycemic DKA*.

**Do not re-raise these as safety findings without new information.** The reviewer's bariatric finding was tagged CRITICAL and is superseded by local practice.

### Provenance and known gaps — carbohydrate instruction

- **The gram target is ungraded.** "50–100 g carbohydrates/day" (panels a and b-T2DM) and ">50 g carbohydrates/day" (panel b non-T2DM) appear **only inside figure boxes** — not in the prose, not in the R1–R10 Box, not in Table 5. No R-number, no evidence grade. Do not present it to a clinician as a graded consensus recommendation.
- **Panels c and d carry no gram target.** Panel c carries no carbohydrate instruction at all.
- **The source does not support a day-of-surgery carbohydrate drink.** Searches for "carbohydrate load/loading/drink/beverage" return zero hits across all 24 pages. The source supports (i) daily dietary carbohydrate in the days before and (ii) minimizing fasting duration. Instructing a *drink* is an INSTITUTIONAL EXTENSION and must not be attributed to SPAQI.
- **The correct citation for carbohydrate-containing clear liquids** is the 2023 ASA modular fasting update (Joshi/Abdelmalak/Weigel, Anesthesiology 2023;138:132–51), which SPAQI cites once (ref 78) for fasting limits only. **ON DISK and READ as of 2026-08-13** -
  `Source-Articles\2023-american-society-of-anesthesiologists-practice.PDF`. Every claim the app
  makes about it checks out verbatim. **One nuance in the app's favor:** ASA does not forbid the
  drink in diabetes. It excludes diabetes, gastroparesis and obesity from the population its
  strong recommendation covers and says *"exercise clinical judgment with this patient
  population"* - a scoping limitation, not a contraindication. It also supplies the volume the
  app had been missing: up to 400 mL, median 400 (IQR 300-400).
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

**The eDKA-monitoring alternative renders on every hold except the fixed-hold limbs** (T1DM; ketogenic/bariatric), not only alongside an override notice.

> **Why the fixed-hold exception (added 2026-08-04).** It was originally specified as "every hold". A clinical review found that unsafe for T1DM: the app's own authority there is the FDA deferral in the SPAQI Limitations section, which discontinues *"irrespective of preoperative fasting and type of surgery"* and offers no monitoring alternative — and the provenance line directly above it states that SPAQI does not cover type 1 diabetes at all. Printing "monitoring is an alternative to holding" to a clinician with ketone testing available, in the single highest-eDKA-risk population in the pathway, invites exactly the wrong substitution.

**Box-vs-Figure footnotes are limb-specific.** Two different discrepancies exist and each gets its own text: panel c (bariatric/VLCD) and panel d (cardiac T2DM without HF/CKD) print a **bare (R3)** where the Box splits 3a and 3b; panel b (major noncardiac fasting) prints **(R4)** in the T2DM column where the Box assigns **R3a** and reserves R4 for patients without T2DM.

**"Also present" applies whenever the hold is source-backed**, whether via the base branch or via a source-backed trigger. Otherwise an institutional criterion is framed as the basis for a hold that R3a independently requires.

> **Rationale.** Five institutional rules override a published guideline. Each is defensible and each is recorded here. The honest behavior is to disclose the departure every time rather than only in one branch. It also makes the clinician override control meaningful — the reviewing clinician sees what the source said and what the institutional rule did to it.

**This supersedes the earlier `overridesR1Continue` flag**, which fired only when the overridden continue was an R1 earned via HF or CKD in a T2DM patient. That definition produced a confusing asymmetry: a non-diabetic taking an SGLT2i purely for CKD, held because their case is expected to exceed 3 h, is arguably the clearest conflict in the pathway and received no notice at all. Meanwhile a T2DM patient whose R2 "consider continuing" was overridden by the same rule also received none.

Accepted cost: the notice appears often, because these triggers fire often. It therefore reads as "here is the departure," not "here is an unusual conflict."

**R-numbers are printed.** Box governs over Figure 2 where they conflict; the discrepancy is footnoted, which also flags a real inconsistency to residents practicing from the paper.

---

## 8. Combination products

A combination pill is held only when a component **actually holds in this scenario**, determined per component class from the same rules the individual drug cards apply.

**Do not encode this as a surgery-type list.** The first attempt exempted minor procedures and colonoscopy on the assumption that metformin and DPP-4 inhibitors both continue there. That assumption is wrong, and the app's own behavior is the authority:

| Component | Actual behavior in this app |
|---|---|
| **Metformin** | **HOLDS in every scenario.** `getMetforminResults` has no surgery-type branch at all — minor, colonoscopy and major all hold. |
| **DPP-4 inhibitor** | Continues **only** for `minor`. Colonoscopy and everything else hold the morning of surgery. |
| Anything unrecognized | Holds. Conservative default. |

> **Why this matters.** Under the surgery-type version, a colonoscopy patient on Synjardy with an eGFR of 33 was told *"Continue taking Empagliflozin/Metformin (Synjardy) as usual. No changes are needed"* — while a patient on plain Glucophage, same eGFR, same procedure, was correctly told to hold. Bowel prep, volume depletion and a possible eGFR change are the classic metformin-hold setting. Caught by clinical review 2026-08-04 before it left the preview branch.

SGLT2i + DPP-4 products (Qtern, Glyxambi) are excluded from the DPP-4 card entirely; the component's disposition is stated in the SGLT2i card's clinician note, which follows that card's actual recommendation rather than assuming a hold.

**Patient-sheet decision (Mark, 2026-08-04):** the patient sheet names the pill and its instruction only, with no component breakdown.

### Combination metformin follows the metformin renal and contrast rules (resolved 2026-08-11)

`getMetforminResults` used to return early when metformin was present only inside a
combination product, so the eGFR <30, eGFR 30-45 and contrast-within-48 h branches never
ran for those patients - even though the eGFR field is shown to them and their answer is
recorded. The pill took its instruction and its resumption wording from whichever card
reported it, which is looser than metformin's own postoperative rule.

**Fix.** The eGFR and contrast branches now live in `getMetforminDisposition(details)`.
`getMetforminResults` calls it for plain metformin, and every card that reports a
metformin-containing combination pill calls `getMetforminComboOverlay(details, comboDrugs)`,
which returns the same flags, the same day-of-surgery wording and metformin's resumption
rule. One helper, one set of rules, no card restating another card's behavior.

The pill still appears on exactly one card, so the patient sheet still names the pill and
its instruction only (the decision above). What the combination patient now gains is the
renal or contrast alert, and metformin's 48-hour postoperative rule appended to the card's
resumption text. Where renal function is normal and no contrast is planned, the note says
the check ran and found no additional restriction rather than repeating metformin's
"continuation is reasonable" paragraph onto a pill that is being held.

Cards carrying metformin combinations: SGLT2i (Invokamet, Xigduo XR, Synjardy), DPP-4
(Janumet, Kombiglyze XR, Kazano, Jentadueto), TZD (Actoplus Met).

### DPP-4 metformin combinations hold for minor procedures (Mark, 2026-08-11)

Fixing the above surfaced the same defect shape as the CRITICAL caught on 2026-08-04, on a
different card. `getDPP4iResults` continued at usual dose for minor procedures, and it
reports the metformin combinations, so a Janumet patient having a minor procedure with an
eGFR of 25 was told *"Take this medication as usual"* while plain Glucophage at the same
eGFR correctly held.

This contradicted the rule at the top of this section - a combination pill holds when a
component actually holds, and metformin holds in every scenario. **Decision: hold.**
Metformin-containing DPP-4 combinations are held the morning of surgery in every scenario,
including minor procedures. Plain DPP-4 inhibitors keep their minor-procedure continuation
unchanged.

A patient on both a plain DPP-4 inhibitor and a metformin combination for a minor procedure
gets a split instruction naming each pill, plus a clinician warning to check for duplicate
DPP-4 therapy. The card-level badge reads HOLD in that case, which is the same card-level
versus per-drug mismatch already recorded as a MEDIUM finding for SGLT2i.

### Fourth clinical review 2026-08-11 - five findings fixed

Run over the fix above. Each finding was reproduced in the browser before it was acted on.

**[CRITICAL] Oseni was reported by two cards with opposite instructions.** `getDPP4iResults`
pulled TZD+DPP-4 combinations in through `comboDPP4i`, so a minor procedure produced
"Take this medication as usual" on the DPP-4 card while the TZD card, which also reports
Oseni, said "Do NOT take this medication." Pre-existing, not introduced by this work, but
the split instruction added above made it print the brand name in both. **Oseni is now
reported by the TZD card only**, which holds it, and that card states the DPP-4
component's disposition the way the SGLT2i card does for Qtern and Glyxambi. Every
combination pill now has exactly one owning card: SGLT2i+anything on the SGLT2i card,
TZD+DPP-4 on the TZD card, DPP-4+metformin on the DPP-4 card.

**[HIGH] The appended metformin resumption softened a stricter rule.** For Synjardy in
bariatric surgery the card says hold until tolerating a regular diet long-term, and for
Actoplus Met in heart failure it requires cardiology or endocrinology review; metformin's
looser "resume when oral intake established" then printed after both, and the last sentence
is the one that gets read. The metformin rule is now explicitly subordinated: *"In addition,
and not sooner than the rule above."*

**[HIGH] The component note borrowed metformin's hold interval.** It pasted metformin's
own "HOLD morning of surgery" sentence onto pills the SGLT2i card holds for 72 or 96 hours.
The note now gives the renal or contrast reason only and says the hold instruction on that
card governs the timing.

**[MEDIUM] `renalRestricted` was inferred from a badge string.** It now comes from a
`renalReason` set inside each branch of `getMetforminDisposition`, so it cannot drift from
the decision it describes, and that same reason text is what the note prints.

**[MEDIUM] The DPP-4 evidence text described continuation** after the card was changed to
hold metformin combinations. When a metformin combination is present it now states the ADA
basis for the hold and that it is stricter than SAMBA's ambulatory guidance for metformin.

**Not acted on, recorded instead:** a patient on plain metformin plus one or more metformin
combinations sees the same eGFR alert once per card (LOW, noise not error). `DRUG_DB`
contains no sulfonylurea/metformin combinations (Glucovance, Metaglip) and no Trijardy XR;
if any are added, the owning card needs a `getMetforminComboOverlay` call or the renal and
contrast rules will be bypassed again. The reviewer also reported that the SPAQI `consider`
limb skips the combination hold - **not reproduced**; `consider` is dead code in SPAQI mode,
as open item 8 records.

### Fifth clinical review 2026-08-11 - three findings fixed, one rejected on the evidence

**[HIGH] The SAMBA metformin claim was wrong in two ways.** The evidence paragraph added
above said SAMBA "permits metformin on the day of surgery above an eGFR of 45". SAMBA 2024
Table 2, Biguanides row, actually reads: *"Take unless eGFR <45 mL/min and/or procedure
includes nephrotoxic agents (eg, contrast dye)"*. The paraphrase dropped the contrast
condition - the very condition this app enforces - and moved the boundary, since SAMBA
permits metformin AT 45. Verified directly in the PDF and corrected to quote both halves.

**[HIGH] "Follow the hold instruction on this card" was ambiguous on the split-instruction
path.** On the DPP-4 card a patient taking both Januvia and Janumet gets a hold and a
continue on one card, and the metformin note did not say which pill it was deferring to.
The sentence now names the pill.

**[MEDIUM] The TZD combination note asserted what another card had done** - "no separate
DPP-4 inhibitor instruction is issued for this patient" - which is false for a patient also
taking a plain DPP-4 inhibitor, who does get one on the DPP-4 card. It now says the
component travels with the pill and flags a separate DPP-4 inhibitor as duplicate therapy
worth confirming. Same defect exists in the SGLT2i version of this note (Qtern plus
Januvia); left alone as pre-existing and out of scope.

**[REJECTED - CRITICAL as filed] "The note defers to a card rule that permits taking the
pill the night before."** The reviewer read the deferral sentence as loosening metformin at
eGFR <30. Checked in the browser: at eGFR 22, plain Glucophage produces *"Do NOT take this
medication on the morning of surgery"* and no night-before instruction, and Invokamet on the
same patient produces a morning-of hold as well. The card the note defers to is never looser
than metformin's own rule - metformin is the strictest input to every card that carries it.
No change made.

The finding did surface a real question, which is **not** about combination products and is
therefore not settled here: **this app never holds metformin earlier than the morning of
surgery, even at eGFR <30 where FDA labeling calls it contraindicated, or when iodinated
contrast is planned within 48 h.** Plain metformin behaves the same way. Whether a
contraindicated patient should be told to stop earlier than the morning of surgery is a
clinical decision for Mark. Recorded, not acted on.

**Also raised, needs Mark, not acted on:** ADA Standards of Care 2026 perioperative practice
point 4 reads *"Metformin and other oral glucose-lowering agents should be held on the day of
surgery or procedure"* - verified verbatim. The app continues plain DPP-4 inhibitors for
minor procedures, which is a departure from that sentence, and the DPP-4 card now quotes the
sentence. The quote was narrowed to metformin so the card does not print a guideline
statement against its own recommendation, but the underlying departure is unresolved and
undeclared. This is the same ground as the recorded LOW finding that the DPP-4 and metformin
strips understate ADA.

**Confirmed clean by this pass:** every DPP-4-containing product has exactly one owning card
(Qtern and Glyxambi on the SGLT2i card, Janumet/Kombiglyze XR/Kazano/Jentadueto on the DPP-4
card, Oseni on the TZD card); the subordinated resumption reads correctly whether the card's
own rule is stricter or looser; `renalReason` is set in all four restricting branches and
null only in the unrestricted one; the ADA metformin quote is verbatim.

**Pre-existing, logged not fixed:** the contrast check sits inside the eGFR >=45 branch, so a
patient with eGFR 25 AND contrast within 48 h gets the eGFR alert but never the contrast one.
Both hold, so no dosing error, but the post-contrast reassessment rationale is not surfaced.

### Contrast timing and the ADA quotation (Mark, 2026-08-12)

**Q1 as originally posed was withdrawn.** The proposal was that a patient with eGFR <30
should be told to stop metformin outright rather than hold the morning dose. **Mark: no.**
If someone is prescribing metformin below an eGFR of 30, the app does not interfere with
that decision, and it does not dictate postoperative management either. The eGFR <30 branch
is unchanged: the clinician card flags the contraindication and says reassess, the patient
instruction remains the day-of hold. Scope discipline, not an evidence disagreement.

**Contrast timing gets a clinician flag, and nothing else changes.** The intake question is
"iodinated contrast within 48 h of *surgery*", which includes a study done a day or two
before the case. FDA labeling asks for metformin to be stopped at or before the contrast
study itself in the eGFR 30-60 band (also for intra-arterial contrast at any eGFR, and for
hepatic impairment, alcoholism or heart failure). A day-of-surgery hold does not accomplish
that when the study precedes the operation: an eGFR 45 patient having a CTA on Tuesday for a
Thursday case takes metformin right through the study.

KDIGO 2024 does **not** ask for a pre-emptive stop above eGFR 30 with no AKI and intravenous
contrast, which is where most of this clinic's contrast patients sit. So the gap is narrow
and the response is proportionate:

| | Behavior |
|---|---|
| Badge, patient instruction, resumption text | **Unchanged in every scenario** |
| Contrast flagged AND eGFR 30-60 | New clinician-facing warn flag naming the FDA timing and the pre-surgery-study case |
| Contrast flagged, eGFR >=60 or <30 | No new flag |

The flag also names intra-arterial contrast and AKI as warranting the same approach at any
eGFR, because **the app collects neither contrast route nor AKI status**. Adding those two
intake fields was offered and not taken; the flag states the band it can identify and leaves
the rest to the clinician. It lives in `getMetforminDisposition`, so plain metformin and
every combination pill pick it up from one place.

**The ADA quotation is restored whole, and the departure is declared (Mark, 2026-08-12).**
The DPP-4 evidence strip had quoted ADA 2026 as saying "metformin should be held on the day
of surgery or procedure". The actual sentence, section 16 perioperative practice point 4, is
*"Metformin and other oral glucose-lowering agents should be held on the day of surgery or
procedure."* It had been narrowed to metformin so the card would not print a guideline
statement contradicting its own plain-DPP-4 continuation for minor procedures.

> **Mark's ruling.** Narrowing the quote to conceal the conflict misrepresents the guideline.
> The sentence is a single indivisible statement, and truncating it removes the reader's
> ability to see that the tool is deviating. Quote it accurately and declare the deviation
> with its rationale.

The strip now opens with the full sentence, and when the card recommends CONTINUE it adds a
DECLARED DEPARTURE paragraph: the ADA statement covers other oral glucose-lowering agents,
which includes DPP-4 inhibitors; ABSMC continues one for minor procedures deliberately, on
minimal hypoglycemia risk, SAMBA 2024 listing them as "take", and ADA's own endorsement of
DPP-4 inhibitor use for mild to moderate inpatient hyperglycemia.

**Left alone, needs Mark:** the same strip still ends its base text with "ABSMC default is a
conservative institutional hold, not a universal guideline mandate." Directly beneath a
quoted guideline mandate that is now printed in full, that clause reads as self-contradictory.
It is Mark's deliberate institutional framing and the same ground as the recorded LOW finding
that the DPP-4 and metformin strips understate ADA, so it was not changed unilaterally. One
sentence, one decision.

Every output string derived from the source carries its R-number. Every output that does not is marked as an institutional extension.

---

## 9. ADA Standards of Care 2026 citation sweep (2026-08-12)

Every "per ADA 2026" assertion in the app was checked against
`ADA Standards of Care 2026 - S16 Diabetes Care in the Hospital.pdf` directly. This section
is outside the SGLT2i scope of the rest of this document, but the verdicts belong somewhere
durable.

### Verified correct, no change

| Claim | Verdict |
|---|---|
| Glucose target 100-180 mg/dL before, during and after surgery, Rec 16.15 grade E | **Verbatim.** "Blood glucose before, during, and after surgery should be monitored and maintained between 100 and 180 mg/dL." |
| Stricter targets not advised | **Verbatim**, perioperative practice point 1 |
| CGM should not be used alone during surgery | **Verbatim**, practice point 3 |
| HbA1c alone is not a reason to postpone | **Supported by prose**: postponing based on A1C or glucose management indicator alone is not recommended |
| SGLT2i held 3-4 days before elective surgery | **Verbatim** |
| Do not hold all basal insulin in T1DM | **Supported**: an insulin schedule with basal and correction components is necessary for all hospitalized individuals with type 1 diabetes, even those taking nothing by mouth |
| Basal analogs to 75-80%, NPH to one-half | **Verbatim** |
| Pump may continue during surgery | **Verbatim**, practice point 5 |
| Metformin and other oral agents held on the day of surgery | **Verbatim**, practice point 4 (already fixed 2026-08-12) |

### Corrected

**[HIGH] The SGLT2i restart line claimed ADA covers a CKD indication. It does not.** ADA:
*"The medication may be restarted in the hospital setting for heart failure indication when
nutritional intake is resumed."* Heart failure only. The app printed "For HF or CKD
indication: may restart in hospital setting ... per ADA 2026" for either. A CKD patient now
gets a note saying ADA makes that statement for heart failure only and does not extend it to
CKD, so restart follows the criteria already on the card. A heart failure patient gets the
ADA sentence, accurately scoped.

**[MEDIUM] The bolus insulin card said "Universal rule: hold all prandial/bolus insulin while
NPO. No exceptions."** Two problems: ADA pairs prandial insulin with eating rather than
stating a universal rule, and **the card contradicted itself** - its own PM-surgery branch
permits the usual breakfast dose with a full breakfast. The evidence now states the rule as
ADA does and names the PM-surgery case explicitly.

**[MEDIUM] The premixed insulin card led with ADA for numbers ADA does not give.** ADA S16
does not address premixed insulin in the perioperative period at all. The evening/morning
split is JBDS and Demma; those now lead the citation, with ADA credited for what it does
supply - the 100-180 target and the principle of preoperative insulin reduction.

**[LOW] The basal insulin card attributed two things to ADA that are not ADA.** Applying the
same percentage to each injection of a twice-daily regimen is an ABSMC extension, now labeled
as one. And "T1DM: reduce 20% - never more" implied an ADA cap; ADA sets none, saying the
decision must be individualized and the reduction may not be appropriate for some people with
type 1 diabetes. The 20% and 25% figures are ABSMC choices within the ADA band and are now
described that way. **No dose changed.** ADA's own "25% reduction of the basal dose given the
evening before surgery" is now cited, which independently supports the T2DM figure.

**[LOW] The pump card now quotes practice point 5 in substance**, including the alternative
plan ADA requires when the pump cannot be used. It also notes that ADA lists adjustment of
pump basal rates, if not in automated mode, among perioperative reductions, while ABSMC
continues the current rate and relies on monitoring - **a behavioral difference from ADA that
was previously undisclosed. Left as behavior, disclosed as text. Mark may want to revisit.**

**Sulfonylurea, meglitinide and alpha-glucosidase inhibitor cards** carried a bare "Source:
ADA Standards of Care 2026" with no locator. All three now cite practice point 4, which is
what actually supports their hold. The sulfonylurea card additionally quotes SAMBA properly:
*"Sulfonylureas carry the risk of asymptomatic hypoglycemia, and thus should be held the day
of surgery."*

**No badge, dose, or patient instruction changed anywhere in this sweep.** All eight affected
cards were re-rendered and checked.

### Still unchecked

The Endocrine Society 2022 (Korytkowski) citation on the insulin pump card. The PDF is on
disk; the claim has never been verified.

## 10. Endocrine Society 2022 (Korytkowski) checked (2026-08-12)

The app cited "Endocrine Society inpatient hyperglycemia guideline" once, on the insulin pump
card, with no recommendation number and no scope. Checked against
`Endocrine Society 2022 Korytkowski ... JCEM 107-2101.pdf` directly.

**The pump claim is supported, but was cited without its conditions.** Recommendation 3.1
suggests continuing insulin pump therapy rather than switching to subcutaneous basal-bolus,
**in hospitals with access to personnel with expertise in insulin pump therapy**; where that
expertise is not accessible and anticipated length of stay exceeds 1 to 2 days, it suggests
transitioning to scheduled basal-bolus before the pump is discontinued. Conditional
recommendation, low-certainty evidence. It is scoped to **admission for noncritical illness,
not to intraoperative management**, and its remarks exclude patients with impaired
consciousness, inability to adjust pump settings, critical illness, DKA or a hyperosmolar
state from inpatient pump use. All of that is now on the card. No behavior change.

### The guideline also contains a direct recommendation against this app's carbohydrate drink

Recommendation 8.1, found while checking the pump citation:

> *"In adult patients with T1D, T2D, and other forms of diabetes undergoing surgical
> procedures, we suggest not administering CHO-containing oral fluids preoperatively."*
> Conditional recommendation, very low certainty evidence.

Its stated reasoning: the reduced insulin resistance sought by ERAS carbohydrate loading is
not expected in diabetes, there is a hyperglycemia and case-cancellation harm, and most
published trials excluded patients with diabetes.

This is the **third** source pointing away from preoperative carbohydrate in diabetes,
alongside the ASA 2023 population exclusion (section 5) and the absence of any SPAQI support
for a day-of-surgery drink. It is also the most explicit of the three.

**Mark's decision 2026-08-12: declare the departure, keep the behavior.** The clinician
carbohydrate text now quotes Rec 8.1, states its grade and certainty, and gives the reason
for departing: the recommendation addresses carbohydrate loading for insulin resistance and
does not address mitigating euglycemic ketoacidosis in a patient on an SGLT2 inhibitor, which
is the purpose here - and this app gives the instruction only to patients on an SGLT2
inhibitor. **The patient sheet is unchanged.** Same principle Mark set for the ADA sentence
the same day: quote the conflict accurately and declare the departure rather than omit it.

This does not reopen section 5. The bariatric and T1DM suppression questions were settled on
local-practice grounds and are not revisited by this recommendation.

## Open items

1. Institutional definition of "minor procedure" vs "major noncardiac". The source defines neither.
2. Whether "3 days" in the source means 72 h or 3 missed doses — unresolvable from the source; 72 h adopted.
3. ~~CT surgery confirmation on the cardiac change.~~ **CLOSED 2026-08-12** - Mark adopted the guideline pathway without the written reply; the NP double-check flag is removed from the app.
4. 2024 AGA/ASA/ASMBS multisociety GLP-1 guidance — cited by the app, **not on disk, not read**.
5. ~~2023 ASA modular fasting update - needed to cite carbohydrate clear liquids correctly.~~
   **CLOSED 2026-08-13** - it was on disk all along and has now been read. See section 5.
6. Three remaining uncommitted 7/26 edits still need clinical sign-off (the morning-of string is now endorsed; the conservative-hold-when-unanswered default, the citation change, and the toggle relabeling are not).
7. Clinician override feature — settled in principle (per-session, resets; patient PDF notes instructions were clinician-reviewed without clinical detail; no audit trail of the original recommendation) but the UI has not been designed or discussed.
