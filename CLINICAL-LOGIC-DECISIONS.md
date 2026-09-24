# Clinical Logic — Decision Record

**Scope of this document:** SGLT2 inhibitor pathway, WEB app. Extensible to other drug classes later.
**Status:** implemented on branch `design-mission-mcc`; not promoted to production.
**Decision-maker:** Mark Carlisle, MD. Every entry below was decided by him; nothing here is an assistant inference unless explicitly marked.
**Last updated:** 2026-09-24 (section 13)

## How to read this

Every rule is tagged with its provenance:

- **SOURCE** — stated by Oprea et al., SPAQI consensus, BJA 2026, with the R-number or location.
- **INSTITUTIONAL** — not in the source. An ABSMC decision. No R-number.
- **DEPARTURE** — the source says something different, and we are knowingly doing otherwise. Rationale recorded.

Where the source is silent, that is stated rather than papered over.

## Primary source

`G:\My Drive\PCMD\Projects\Perioperative-Diabetes-App\Source-Articles\`
- `British Journal of Anaesthesia - article in press (1).pdf` — Oprea et al., SPAQI consensus. R1–R10 Box on p.12; Figure 2 reproduced p.18. **Final citation: Br J Anaesth 2026;136:1776–99, doi 10.1016/j.bja.2026.02.031** (given by the Garcia editorial; page numbers in this record refer to the in-press copy).
- `Haziri 2026 BJA 137-440 ...pdf` and `Garcia 2026 BJA 137-413 ...pdf` — supporting evidence added 2026-09-24; see section 13.
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

> **SUPERSEDED IN PART 2026-09-24 (Mark) - see section 13.** A patient without diabetes is now asked about a **24 h** carbohydrate-free window, not 12 h, and the >3 h and GLP-1 cutoff triggers no longer apply to them. The hold on a Yes is still the hardened R4 in major noncardiac surgery, and institutional elsewhere.

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

> **SUPERSEDED 2026-09-24 (Mark) - see section 13.** The scoping below was widened: the trigger now applies at minor procedures as well as major noncardiac and cardiac surgery (bariatric is a fixed hold anyway), for patients with diabetes (or unrecorded status) only. Colonoscopy stays exempt, now for a different reason (13a). The arithmetic below assumed the last carbohydrate is taken AT the cutoff and an early slot; the sheet tells the patient not to set an alarm or stay up, so a midnight cutoff before a noon minor case is about 16 h. Kept for the record.

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

**Not for a patient without diabetes (Mark, 2026-09-24).** The 24 h window replaces it for that group; the question is not shown to them. Kept for everyone else when Mark reviewed it on 2026-09-22 ("there is reason for it") - the rationale above, avoiding monitoring the institution does not provide.

### 2c. Risk-factor holds — INSTITUTIONAL EXTENSION

**No R-number.** These criteria are real but relocated: footnote **a** of panels a, b, d lists *"prolonged fasting for carbohydrates >12 h, <50 g carbohydrate diet, history of insulin use or DKA, or HbA1c >8%"* as triggers for *considering day-of-surgery eDKA testing in a patient who is continuing*. Converting a "consider testing" flag into a mandatory hold is a genuine transformation of the source and must be labeled as such.

| Trigger | Behavior | Notes |
|---|---|---|
| Any current insulin use | HOLD | **Derived from the medication list already selected** — not asked again. Adding/removing an insulin elsewhere changes the SGLT2i output; the clinician view must name insulin use as the trigger. |
| History of DKA | HOLD | **Yes / No only**, and only an explicit **Yes** holds. A blank permits continuation, like the other three - reversed 2026-08-13, see below. |
| Most recent A1c > 8% | HOLD | Existing boolean, relabeled **"Most recent A1c >8%?"**. Deliberately not a numeric field — avoids implying a staleness judgment the source explicitly declines to make. |

Note the DKA-history limb was previously dropped and has been restored; it is the most predictive item on the footnote's list.

### Unknown / unanswered conventions — deliberate asymmetry

| Question | Unknown or blank resolves to | Why |
|---|---|---|
| More than 12 h without carbohydrate | **Cannot be left blank — REQUIRED** | Always answerable; it is a clinical judgment about the case, not a lookup. It forces a hold in every branch, so a blank would generate a recommendation from an unanswered question. The app refuses to generate until it is answered. |
| History of DKA | **No trigger - permits continuation** | Reversed 2026-08-13. The rule that made it hold rested on a claim the source does not support. |
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
| **History of DKA** | **treated as no history** | **permits continuation** |

### REVERSED 2026-08-13: all four blanks now permit continuation (Mark)

For most of 2026-08-13 a blank DKA question HELD, and it was the only blank that did. **That
rule is withdrawn.** All four blanks now default toward continuation and are disclosed the same
way, in one dim line in the clinician view. There is no longer any question in the pathway
where leaving the intake untouched changes the recommendation.

**Why it was withdrawn.** The rule rested entirely on the claim that DKA history was the most
predictive item on the source's risk-factor footnote. **The source does not say that** (section
11). It names an HbA1c >8%, insulin use and a prior DKA history together, unranked, and gives
an effect size for none of them - and the only one of the three it quantifies anywhere is
HbA1c. With no magnitude to justify singling DKA history out, there is nothing left to support
treating its blank differently from an A1c blank. Mark: *we don't have a magnitude of risk
here.*

**Note the direction this cuts.** Had the evidence gone the other way it would have argued for
making A1c blanks hold too, not for keeping the DKA exception. The consistent position is the
one now implemented: absent a measured magnitude, an unanswered risk-factor question does not
generate a hold.

**Why not force an answer instead.** The clinical review proposed making the question required,
as the >12 h question is. Mark declined: the question's importance would have to be explained
inside the question to make a forced answer meaningful, which bloats the intake. A clinician
who skips it now reaches the clinician view, sees what was assumed, and can either go back and
answer it or accept the default.

**Insulin use is not in this set** because it is derived from the selected medication list and
can never be blank.

> **Superseded reasoning, kept for the record.** The withdrawn rule argued: the first three
> blanks fail toward continuing a drug in someone whose risk nobody measured, while the fourth
> fails toward continuing an SGLT2 inhibitor in the patient the source flags hardest. **Corrected 2026-08-13:** footnote a lists four risk factors - prolonged
carbohydrate fasting, a <50 g carbohydrate diet, history of insulin use or DKA, and HbA1c >8% -
as an unranked disjunctive list, and does NOT designate DKA history the most predictive of
them. The app and this record both said it did; the claim has been removed from the clinician
view. What survives is institutional and is stated as such: unlike an A1c, a DKA history cannot
be reconstructed after the fact. A clinician who knows the patient
has no history answers No and gets a continue - that is what the No answer is for.

**The "Unknown" option is REMOVED from the DKA question**, and stays removed after the reversal.
It is Yes / No. An Unknown button would now do exactly what a blank does, so it would be a
control that changes nothing. The app has no persistence layer, so there was nothing to migrate.

> **Not built, worth knowing.** There is now no way to record *"I tried and could not establish
> this"* as distinct from *"I did not ask."* The A1c question has exactly that, as its explicit
> "Not available" button, and both resolve to continuation there too. Raise it if the
> distinction is ever wanted for DKA.

**Disclosure lives in the clinician view, not under every intake question.** Printing each
default beneath its question would bloat the intake, and the people who need to know are
clinicians reading the output. The clinician view prints, only when something was left blank:

- one dim line naming every permissively-defaulted blank and what was assumed for each;
- for a blank DKA question, a highlighted block stating that the history is neither confirmed
  nor excluded, that this blank holds where the others do not, why, and that answering No
  produces a continue.

Both are silent when every question was answered. Verified 2026-08-13 across all four fields
individually and together.

> **ANSWERED 2026-08-13 - the reviewer weighed it, and the rule was subsequently withdrawn on
> the evidence (above). The reviewer's own recommendation was to keep the hold but make the
> question required; Mark took neither horn and removed the hold instead.** Original flag:
> Mark asked that the reviewer specifically weigh whether a
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
clear juice without pulp, sports drinks, and regular (non-diet) soda. Water, diet drinks,
tea or coffee without milk and fat-free broth are permitted clear liquids but are named as
**not** counting toward the carbohydrate, since broth and diet drinks are the two a patient
is most likely to believe do.

#### Two lists, deliberately different (Mark, 2026-08-14)

The sheet carries a GENERAL clear-liquid list and a CARBOHYDRATE list, and they no longer
match. Both departures are intentional.

| | General clear-liquid list | Carbohydrate step |
|---|---|---|
| Soda | **"soda"**, unqualified | **"regular (non-diet) soda"** |
| Gelatin | permitted | **not named** on the TIMED drink |

- **Diet soda is fine as an ordinary clear liquid** (Mark). ASA 2017 defines clear liquids to
  include "carbonated beverages" without qualification, so nothing is being stretched. The
  "(non-diet)" qualifier is kept - and was newly ADDED - on the carbohydrate step, where the
  whole purpose is carbohydrate delivery and a diet drink is a silent no-op in a population
  conditioned to reach for it.
- **Gelatin is out of the TIMED 8-12 oz drink only.** It remains in the general clear-liquid
  list, and it remains in the two co-treated branches, which carry no timed drink and only ask
  that some of the 24 h clear liquid diet contain carbohydrate. The colonoscopy limb names no
  beverages at all on its prep-day line and does not name gelatin on its last-drink line
  (Mark, 2026-09-16, on clinical review - see the 2026-09-16 section). **The reason to cite is dose and unit.** The step is specified as "8 to 12
  ounces", which is a volume for a drink and has no clear meaning for gelatin, and a standard
  serving delivers roughly a third of the carbohydrate of the same volume of juice. A patient
  substituting gelatin gets a fraction of the intended load - the same silent-underdose failure
  the "(non-diet)" qualifier exists to prevent.
  **Two other rationales were considered and neither supports the change**, so neither is cited:
  faster absorption of a liquid than a gel is unverified - no source on disk addresses gastric
  emptying of gels, and gelatin liquefies at body temperature anyway; and the protein content of
  gelatin is not disqualifying, because **ASA 2023 studied exactly this** and found that "the
  addition of protein to preoperative carbohydrate-containing clear liquids did not seem to
  either benefit or harm healthy patients" (Highlights box).
- **Jell-O is NOT named as excluded** on the carbohydrate step, though it is offered as a clear
  liquid earlier in the same paragraph. The clinical review argued it should be, since the
  exclusion clause is the only place a patient learns what does not count. **Mark declined
  (2026-08-14):** leave it absent and say nothing. Recorded because it was raised and settled,
  not overlooked.

#### The GLP-1 / tirzepatide checklist line names the diet (Mark, 2026-08-14)

The medication continues, so a bare "keep taking as usual" is true but hides what actually
burdens this patient. The checklist row reads:

> keep taking as usual - clear liquid diet starts 24 hours before arrival

The timing is included because it is the part patients get wrong. Wording was chosen against a
measured render: the longer "...24 hours before you arrive" wrapped to THREE lines at the
Comfortable scale; "before arrival" brings it to two.

**Applied on colonoscopy too**, although the dietary block below defers entirely to bowel
preparation there. Mark, 2026-08-14: a colonoscopy prep is largely clear liquids for about that
long anyway, so the line does not conflict with the prep in practice, and the block below still
states that the prep instructions govern.

The clause is appended OUTSIDE the disposition rules so it survives every branch, including the
multi-drug rule - the 24 h diet applies whichever GLP-1 agents are listed. Tirzepatide shares
the same card.

### SUPERSEDED 2026-09-02 - the patient sheet now carries restart guidance for SGLT2 inhibitors

**The section below records the 2026-08-14 decision, which was to say NOTHING about restarting
any medication on the patient sheet. That decision has been reversed for SGLT2 inhibitors only.
The reasoning is kept in full because it predicted, correctly, both defects that the reversal
then introduced.**

**What changed (Mark, 2026-09-02).** The preoperative clinic asked for postoperative return
precautions. Those arrived with a restart question attached, and Mark's decision was: restart
when eating and drinking normally, patient decides, no waiting for a call. The sheet now ends
with an **After Surgery** block, issued to SGLT2 inhibitor patients and no one else.

**How the 2026-08-14 counter-argument is answered.** That argument was that a resumption line on
ONE drug, while eight others say nothing, reads as a rule being withheld for the rest. The block
is therefore titled **"After Surgery - Your SGLT2 Medicine"** and prints the drug name above the
bullets, exactly as every other block on the sheet does. It is scoped by its own heading rather
than reading as a general resumption rule. The heading was generic in the first implementation
and clinical review flagged precisely this: a patient on glargine and glipizide read a block
called "After Surgery" as the complete postoperative picture.

**Both hazards this record predicted DID occur, and both were caught by clinical review
2026-09-03, after the work had already shipped.**

- **Bariatric staged diets.** The record said bariatric patients "reliably do not eat normally
  after discharge". The first implementation gave every held patient identical wording - restart
  when eating and drinking normally - which for a bariatric patient is not a signal but a trap.
  SPAQI Figure 2c, postoperative row, is explicit: *"Do not resume SGLT2i"* (T2DM), *"Do not
  resume SGLT2i until discussed with prescriber"* (no T2DM); BJA p.18 names bariatric surgery as
  the exception to restarting on normal oral intake. The card's OWN clinician string already said
  hold until tolerating a regular diet. The two halves of one card contradicted each other.
- **The combination pill.** The record said the combination limb "silently restarted the
  metformin component against that card's 48 h and renal-reassessment rule". The new patient
  wording did the same thing again, on the sheet the patient takes home.

**The current rule.** Restart splits four ways, and `sglt2iHeld` gates the whole thing so a
continuing patient never sees it:

| Population | Patient wording |
|---|---|
| Bariatric surgery, or ketogenic/VLCD | Do NOT restart on your own; the surgeon or prescriber decides. States that the postoperative diet is why their case differs. |
| Any pill containing metformin | ~~Do NOT restart until the prescriber says so~~ **Withdrawn 2026-09-16 (Mark):** the pill follows the row for its surgery type below, like plain metformin. See "After Surgery for the other classes". |
| Minor procedure or colonoscopy | Restart when eating and drinking normally; no need to wait for a call. The only setting a source endorses that in. |
| Major noncardiac, cardiac | Restart when eating and drinking normally, **conditioned on an uncomplicated recovery**; ask the prescriber if anything went wrong, or if treated for infection or a kidney problem. |

Plus, for every held patient, an unconditional override: **discharge instructions and any doctor
seen after surgery outrank this sheet**, which is printed at the preoperative visit and can be
weeks older than any postoperative decision. That clause exists because a deliberate non-restart
for AKI is invisible to a patient and no symptom wording can reach it.

**Also added at the same review, and worth keeping separate from the restart decision:** a
sick-day rule (*if you cannot eat, or cannot keep fluids down, stop taking this medicine*), which
had never appeared anywhere on the sheet - for a CONTINUING patient the After Surgery block was
otherwise the entire postoperative instruction set, so an intercurrent vomiting illness had no
instruction attached to it at all.

**What still carries the risk.** Unchanged: the clinician view keeps its full three-part
resumption criteria on every card, and its bariatric "hold until tolerating regular diet
long-term". The ketosis condition is deliberately absent from the patient wording - a patient
cannot assess it, and the symptom bullets are the patient-facing proxy. Clinical review accepted
that on its own terms, but noted it becomes a defect **in combination with** an unconditional
"you do not need to wait for anyone to call you", which is why that clause is now scoped.

**The two sources behind the timing sentence, verified in full text 2026-09-16.** Snel et al,
*A Systematic Review and Expert Evaluation of Perioperative SGLT2 Inhibitor-Associated
Ketoacidosis Case Reports*, Acta Anaesthesiol Scand 2026;70(6):e70254, open access PMC13172662:
169 reports, 128 met the ketoacidosis criteria, expert panel rated 53 likely / 38 possible / 27
unlikely / 10 not assessable; onset median 2 days (IQR 1-5, range 0-120), 108 of 128 (86%)
within one week; "temporal mismatch" was the commonest reason for an unlikely rating. The
cohort is Takemura M, Ikemura K, Okuda M, *Factors and preventive strategies for perioperative
euglycemic diabetic ketoacidosis in patients with type 2 diabetes receiving SGLT2 inhibitors*,
J Pharm Health Care Sci 2025;11:79, doi 10.1186/s40780-025-00487-6, PMC12376744: 1,169 patients
at the University of Osaka Hospital 2014-2023, 21 euDKA within 30 days (1.8%), diagnosed by day
3 in 9, by day 7 in 17, by day 14 in 20; discontinuation for at least 3 days before surgery was
protective (OR 0.047), and the protocol restarts when normal eating resumes. The sheet's
"most likely in the first week, most often in the first few days" stands as written.

**SUPERSEDED 2026-09-16 - the other classes now get an After Surgery block too.** See the next
section. The 2026-08-14 reasoning below is kept because it still explains the shape chosen.

### After Surgery for the other classes (Mark, 2026-09-16)

Three decisions, asked one at a time:

1. **Every drug the sheet told the patient to hold, skip, reduce, stop early or substitute gets
   restart guidance**, framed generically. Mark: "1 can work but need some generic comments.
   Even for metformin, I would let them restart unless their surgeon or prescriber has
   recommended otherwise."
2. **Shape: ONE generic block with named exceptions**, not per-drug bullets. Titled
   "After Surgery - Your Other Diabetes Medicines" when the SGLT2 block is also printed, and
   "After Surgery - Your Diabetes Medicines" when it is not. The drug names print above the
   bullets, as every block does.
3. **The metformin combination pill on the SGLT2 block follows the same rule.** Its
   prescriber-only bullet ("needs your kidney function checked first") is withdrawn; the pill
   takes the ambulatory or major wording like plain metformin. The clinician card keeps its 48 h
   post-contrast and renal-reassessment rule, and the discharge-instructions override bullet is
   the patient-facing half of that: it is the clinician's job to say "wait".

**Clinical review of the first draft, 2026-09-16, and what it changed.** The first draft put one
eating-contingent lead over every changed non-SGLT2 card. The review found that reaching
INSULIN and the PUMP, which is the DKA direction - ADA 2026 S16 p.5: basal insulin, including
via pump, is not held in type 1 diabetes even while NPO - and rated it BLOCKING twice (basal
under an eating-contingent lead; the bariatric "do not restart on your own" lead on insulin),
plus the pump being named as something that restarts when it was never stopped. It also found
the GLP-1 card included on CONSIDER HOLDING although the app never holds it, the unconditional
"you do not need to wait for anyone to call you" on major surgery where the SGLT2 block scopes
it, sulfonylureas told "usual doses" against UpToDate's low-dose re-titration, a glitazone in
heart failure with no named review, and a combination pill skipped only on the morning of
surgery getting no restart line anywhere. All of those are fixed in the shipped block, below.

**What prints.** The block appears only when some non-SGLT2, non-GLP-1, non-pump card actually
changed what the patient does - a night-before instruction on a card not badged CONTINUE BASAL,
a badge other than CONTINUE or CONTINUE BASAL, or a declared checklist disposition (the
substituted fixed-ratio pen) - or a pump is selected. **The GLP-1 card is excluded**: the app
never holds it, and CONSIDER HOLDING is advice to the clinician, so a GLP-1-only sheet prints
nothing even with GI symptoms. A DPP-4 continuing for a minor procedure prints nothing; a
metformin-containing DPP-4 pill at a minor procedure is held the morning of and does print.
Bullets, in order, each present only when its drugs are:

- **Oral agents lead** (metformin, DPP-4, sulfonylurea, meglitinide, glitazone, AGI, held or
  skipped). Minor procedure or colonoscopy: *start taking these medicines again, at your usual
  doses, as soon as you are eating and drinking normally - unless your surgeon, or the doctor
  who prescribes them, told you to wait. You do not need to wait for anyone to call you.*
  Major or cardiac: the same, *as long as your recovery has been straightforward*, and *if
  anything went wrong ... or you were treated for an infection or a kidney problem, ask before
  you restart* - the SGLT2 block's own scoping, mirrored. Bariatric: *your bariatric team
  decides when each of these medicines restarts ... do not restart them on your own* - orals
  only, never insulin.
- **Sulfonylurea or meglitinide, named and REMOVED from the generic lead** (not on bariatric,
  where the team decides): *start again only once you are eating full meals, not just fluids. If
  you are eating less than usual, call ... because it can push your blood sugar too low. If you
  take a high dose, your doctor may want you to start back at a lower dose first.* UpToDate:
  restart only after eating well, low doses first for high-dose patients. The second review found
  the first draft naming the drug under "at your usual doses ... no need to wait for a call" AND
  under "call before you restart" on adjacent lines; a drug named in a specific bullet is now
  never also named in the lead.
- **Glitazone, named for every glitazone patient and removed from the lead**: *start again when
  eating and drinking normally - but if your legs or belly have swollen, or you have become short
  of breath since surgery, ask before you restart*, plus *because you have heart failure, ask
  before you restart in any case* when HF is recorded. UpToDate: do not restart if the patient
  develops heart failure or fluid retention - a postoperative event the sheet cannot see, so the
  patient is given the signs. The card's own rule: monitor for fluid retention; formal review
  in HF.
- **Insulin, never under the eating-contingent lead, one bullet per kind.** Long-acting analogs
  (glargine, detemir, degludec): *never skip it, even if you are not eating. Take it at your next
  scheduled dose after surgery. If you are eating very little, do not assume your usual dose is
  right - ask your diabetes doctor, who may lower it.* The never-skip half is ADA S16 (type 1,
  basal is not held even while NPO); the may-lower half is the card's own clinician rule and
  UpToDate's "often by more than 25 percent" postoperative reduction for type 2. **NPH, its own
  bullet**: *do not skip it, but do not take your full dose while you are not eating - call for
  a reduced dose until you are eating normally; if you cannot reach them before your next dose
  is due, take half your usual dose rather than none, and check your blood sugar before bed and
  on waking* (the app halves NPH preoperatively for its peak; ADA S16 practice point 5; the
  half-dose fallback mirrors that). **Soliqua, its own bullet**: *restart at its usual time once
  eating normally and any sickness has settled; it contains a second medicine taken with food;
  until then use the separate long-acting insulin your clinic prescribed instead of it, at the
  dose prescribed; if you were only given enough for the morning of surgery, call the same day
  for more - do not go without it* - it is meal-anchored (FDA schedule, the card's own
  rationale), is NOT described as long-acting insulin, names the listed basal as the substitute
  when one is on the sheet, and after bariatric surgery defers to the team. Premixed: *usual
  doses once eating regular meals; if not eating, do not take the usual dose - call, because you
  may need a different insulin; if you cannot reach them and blood sugar is running high or you
  feel unwell, go to the emergency department*, and for type 1: *you must not go without insulin
  - if you cannot reach them before your next dose is due, take half your usual dose rather than
  none.* The bariatric insulin line also covers the pump ("that includes your pump settings").
  Mealtime: *start again with your first meal, dosed for what you eat.* Always: *if your
  diabetes doctor gave you different insulin doses for after surgery, follow those.* Bariatric
  adds, first: *your insulin doses will need adjusting ... your diabetes doctor or bariatric team
  sets them. Do not stop your long-acting insulin on your own* - or, for a patient with no
  long-acting insulin listed, *do not stop your insulin on your own*.
- **Pump**: *was meant to keep running through surgery, with only your mealtime (bolus) doses
  paused - start those again with your first meal. If your pump was stopped or taken off at any
  point, do not go without insulin: make sure it is back on, or that you have been given another
  insulin, before you leave.* Conditional, because the same sheet tells the patient the
  anesthesiologist may pause the pump, and a patient converted to injections in hospital must
  not read a flat "keeps running" as fact. Reached by id, not by the changed predicate, because
  it is badged CONTINUE BASAL with a truthy night-before line.
- **U-500**: *do not change the dose on your own. Follow your endocrinologist's instructions.*
- Always: the discharge-instructions override.
- When the SGLT2 block actually carries a restart line: *your SGLT2 medicine has its own
  instructions above.* The pointer is gated on that, not on the block existing.

**The SGLT2 block gained a line for a combination pill skipped only on the morning of surgery**
(SGLT2i continuing, metformin or DPP-4 component held): *take it again at its next usual time
after surgery, once you are eating and drinking normally*, scoped by surgery type exactly like
every other restart line - *no need to wait for a call* after a minor procedure or colonoscopy,
*as long as your recovery has been straightforward ... infection or a kidney problem, ask* after
major or cardiac surgery - with the discharge override. The second review found the first draft
unscoped, which made the table row above false; it is true now. Before this the only drug on
such a sheet had no restart guidance at all.

**No safety precautions for these classes** - no hypoglycaemia warning for insulin or
sulfonylureas, no GI or aspiration warning for GLP-1. Offered as an option and not taken
(2026-09-16); the restart rule was the ask. The sulfonylurea "push your blood sugar too low"
clause is the one exception, carried because it is the reason for that drug's own rule.

**Metformin: NO renal or contrast exception on the sheet - Mark, 2026-09-16, on clinical
review, asked directly.** The review rated MAJOR that a patient whose morning-of line says the
drug is held for kidney function (eGFR under 30), or who had contrast, is told two blocks later
to restart when eating normally, and offered a targeted bullet keyed to the eGFR and contrast
answers the app already holds. Mark chose to keep his rule in every case: the clinician card
carries the 48 h post-contrast and renal-reassessment rule, and it is the clinician's job to
say "wait". Recorded as an accepted tension, with the review's worked failure case: a
metformin patient at eGFR 25 reads "held for kidney function" under Morning of Surgery and
"start taking these medicines again" under After Surgery on the same sheet.

**Split DPP-4 card fixed:** a card holding Janumet while Januvia continues now exposes
`changedDrugNames` (the held pills only), and the After Surgery block names those, not the
continuing drug. The drug-name header lists every included drug on its own line and each bullet
repeats the names it covers, so a patient can see which line is theirs.

**Renderer-level, so the sweep cannot see it.** Verified in the browser at 375 px, no
horizontal overflow, across: orals plus basal insulin, major (recovery-conditioned lead,
sulfonylurea bullet, basal bullet); metformin plus a continuing DPP-4, minor (only metformin
named, no-call clause present); glargine plus lispro, bariatric, type 1 (bariatric insulin
bullet, basal never-skip, mealtime bullet, no oral lead); pump alone, major, type 1 (pump
bullet only); pump plus metformin, bariatric (bariatric oral lead plus pump bullet); GLP-1
alone with GI symptoms (no block); pioglitazone with heart failure (named bullet); Synjardy
alone, minor (SGLT2 block carries the next-usual-time line and the override); empagliflozin
continuing plus metformin ("Other" title, no SGLT2 pointer); U-500 plus metformin (U-500
bullet); Humalog Mix 75/25 major and bariatric (premixed bullet, bariatric insulin bullet);
Januvia plus Janumet, minor (the known minor above). Sent for a second clinical review pass.

**Metformin morning-of lines give no reason (Mark, 2026-09-16).** The second review noted that
after a minor procedure the lead's "you do not need to wait for anyone to call you" reached a
metformin patient whose Morning of Surgery line said *held because you are receiving contrast dye*
or *your kidney function requires that this medication be held*, and asked whether that clause
should be suppressed there. Mark's answer went to the premise: metformin is held for everyone on
the day of the procedure, so the sheet should not single out a reason - an eGFR under 30 is a
reason not to be on the drug at all, not a perioperative hold reason. All three metformin patient
morning-of lines now read *Do NOT take this medication on the morning of surgery.* and nothing
else; the clinician card keeps the eGFR bands and the 48 h contrast rule. The no-call clause
therefore needs no special case.

**Second clinical review, 2026-09-16, and the third-round fixes.** Rated CRITICAL: Soliqua and
NPH under the analog basal bullet (fixed, own bullets); HIGH: the unscoped combination-pill line
(fixed), "usual dose" for type 2 basal (fixed, may-lower clause), premixed "call for a dose"
(fixed), sulfonylurea still named under the lead (fixed), the pump claim asserted as fact
(fixed), the record's table row and Android paragraph (fixed); MEDIUM: bolus-only bariatric told
not to stop a long-acting insulin it does not have (fixed), glitazone only in HF (fixed, every
glitazone), split DPP-4 (fixed). Verified in the browser at 375 px, no overflow: Soliqua alone;
NPH alone; Humulin 70/30 alone; repaglinide, minor (no lead, its own bullet); pioglitazone with
and without HF; pump alone; Synjardy at major and at minor (scoped lines); Januvia plus Janumet
(Janumet only named); metformin at eGFR 25 and with contrast (plain morning line); lispro alone,
bariatric ("do not stop your insulin"); glargine 60 units plus orals, major. The reviewer also
confirmed both citations against the primary sources (Snel: 128 cases, median 2 d, range 0-120,
86% within a week; Takemura: 1,169 / 21 / 9-17-20). The Snel IQR 1-5 was read from the PMC full
text by the session, not by the reviewer.

**Third clinical review, 2026-09-16, targeted at the delta, and the round-four wording.** No
blocking web finding. Rated HIGH: the Soliqua bullet told the patient to "keep using" a
substitute basal the sheet prescribes for ONE morning (fixed: call the same day for more, do not
go without it; a bariatric branch deferring to the team; the listed basal named as the
substitute when both are selected); the NPH bullet referred back to "a reduced dose, as you were
given before surgery", which a once-daily MORNING NPH patient never receives because the card has
no dosing-time input for NPH (fixed by dropping the backreference and adding the half-dose
fallback; the missing NPH dosing-time input is a pre-existing card gap, recorded in the handoff).
MEDIUM, all fixed: no fallback when the NPH prescriber cannot be reached; a type 1 patient on
premixed alone left with no interim basal; the bariatric insulin line never reaching a pump;
Soliqua plus a separate basal reproducing the duplicate-basal confusion on the patient sheet; the
comment above `sglt2iHeld` still describing the pre-delta behaviour; header order matching
bullet order only by coincidence. LOW, left: meglitinides inherit the sulfonylurea high-dose
clause (stricter than the card's own rule; defensible under the UpToDate topic); the glitazone
bullet omits the liver clause (a patient cannot see an LFT; deliberate). The round-four wording
follows the review's suggested corrections and was verified in the browser at 375 px (Soliqua
major, bariatric and with glargine; NPH; 70/30 type 1; pump bariatric; four orals for header
order; two basal analogs for the plural) but was NOT sent for a fourth review pass. Mark's
sign-off covers it.

**The half-dose fallbacks are the one clinical addition of round four that no source states in
those words.** They mirror what the app itself does preoperatively (NPH halved; premixed evening
dose reduced) and exist so that a patient who cannot reach a prescriber before the next dose is
due is never left choosing between a full dose while not eating and no insulin at all.

**Android parity.** This is web-only. The Android app has NO patient-facing After Surgery block of
any kind - not the withdrawn metformin-combination line, not the 2026-09-02 SGLT2 block, not this
one (checked by the second review: `lib/pdf_export.dart` emits only the night-before and
morning-of sections). Raised as an open item in the handoff; any difference between the products
is a defect regardless of which is right. **The third review, reading the Dart source (no Flutter
toolchain to execute), found on Android: a Janumet patient having a minor procedure is told to
take the pill as usual on the morning of surgery, because the Android DPP-4 card has no
metformin-component split and the Android metformin card handles plain metformin only - CRITICAL
against ADA S16 practice point 4 and against this web app, which holds it; the metformin
morning-of lines still carry the kidney and contrast reasons removed here today, and the contrast
one has no timing at all; and the SGLT2 multi-day stop still ends "Do not take it again until
your doctor tells you it is safe to restart", under a night-before heading. All three are in the
handoff as open items for the Android product.**

---

### The original decision, superseded above (Mark, 2026-08-14)

**The patient sheet says NOTHING about restarting any medication.** Verified by sweeping 720
scenarios - every surgery type against every diabetes type, sixteen drug selections and three
eGFR bands - for any mention of resuming or restarting in the four printed patient fields.
Zero hits.

Removed: the SGLT2i "Do not take it again until your doctor tells you it is safe to restart"
on both multi-day hold limbs; "Resume it when your care team tells you that you may eat and
drink normally" on the combination limb; and "held and reviewed before restarting" on the
metformin eGFR 30-45 limb. The metformin renal caution itself is kept - only the gate went.

**The argument this decision overrides, recorded because it is a real one.** Restarting an
SGLT2 inhibitor during poor oral intake is the euglycemic-DKA setting the 72-96 h hold exists
to prevent, and bariatric patients go home on a staged liquid diet by protocol - they are the
one group that reliably does not eat normally after discharge.

**Mark's counter, which governs:** a resumption line on ONE drug while eight others say
nothing reads as a rule being withheld for the rest, and generates the "when do I restart my
metformin?" calls it would be trying to prevent. The app gives no restart instruction for any
other medication and does not generally instruct on resumption at all.

**What carries the risk instead:** the clinician view keeps its full resumption criteria on
every card, including the three-part SGLT2i rule (tolerating oral intake AND no active ketosis
AND no perioperative AKI, active infection or hemodynamic instability) and the bariatric
"hold until tolerating regular diet long-term". The sheet footer already routes the patient to
the surgeon's office with questions about resuming medications.

**Two of the removed lines were found by clinical review, not by the original edit**, and one
of them was **clinically looser than this app's own clinician rule** - the combination limb
cleared restart on oral intake alone, and silently restarted the metformin component against
that card's 48 h and renal-reassessment rule. A partial removal was worse than either
extreme: silent on the 72-96 h hold, permissive on the combination pill.

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
| SGLT2i only, **held** | early | **8-12 oz on waking** - same as continuing, changed 2026-08-13 |
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

> **The before-bed escape is RETIRED (Mark, 2026-08-13).** It was briefly kept for held
> patients on the reasoning that a deviation from the stated fasting window has to be paid for
> by benefit, and the benefit is smaller once the drug has been stopped. **The evidence in
> section 11 does not support that split, and Mark reversed it the same day.** Residual eDKA
> risk after a hold is lower but not zero - and, decisively, **the studies reporting near-zero
> rates held for 120 h and 168 h, while this app holds 72-96 h.** A patient held for 72 h is
> not in the reassuring part of that evidence, and there is no study at 72 h to appeal to.
> A bedtime drink was also the weakest version of the instruction, which is what the clinical
> review objected to. **Every patient who receives a timed drink now receives the on-waking
> escape**, continuing or held.

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
a Mark decision - it needs his sign-off.** **Decided 2026-09-16: REMOVED. Colours are left to the
preparation instructions (Mark).** The milk, pulp and alcohol exclusions, dropped in the
rewrite, are restored to both this and the general instruction.

**Arrival hyperglycemia is now disclosed to the clinician.** The drink goes to patients whose
SGLT2 inhibitor may be held for 72-96 h, so the glucose-lowering agent is off while the
carbohydrate goes in - and hyperglycemia with case cancellation is the one concrete harm
Endocrine Society Rec 8.1 names. The clinician text now says so and carries the ASA volume and
the home-glucometer suggestion. The patient sheet now states 8-12 oz on every timed instruction (2026-08-13); it previously stated no volume.

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

**No volume limit on clear liquids generally - for any patient, including GLP-1 co-treated.**
Clear liquids are ad lib up to the applicable cutoff; after the cutoff, nothing. **Superseded
in part 2026-08-13:** the carbohydrate drink itself now carries a stated volume of 8-12 oz.
What remains true is that the app sets no ceiling on other clear liquids, no target, or
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

### The on-waking drink has a floor, and bowel prep defers everywhere (Mark, 2026-08-14)

**Floor: "before you leave home."** The on-waking instruction previously ended at *"even if
that is less than 2 hours before you arrive"* with no lower bound, so a patient who overslept
could drink in the car. The clinical review declined to endorse it unbounded. Mark chose a
**behavioural** floor rather than a clock: *"drink it as soon as you are up, and in any case
before you leave home for the hospital."* This keeps the no-alarm rule and the
intervals-not-clock-times rule, needs no data the app lacks, and in practice travel plus
check-in puts the drink well clear of induction. **The app still does not compute this** - it
is patient-judged, like "if that time falls while you are asleep".

**Bowel preparation defers in EVERY instruction, not just colonoscopy.** Mark, 2026-08-14:
prep is not colonoscopy-only - colorectal, urologic and gynaecologic cases can carry one, and
**this app has no intake field that identifies them**, so a `surgeryType === 'colonoscopy'`
test misses them entirely. Every eating-and-drinking instruction on both cards now carries the
deferral. Where the instruction already claims precedence over other preoperative advice, the
prep line is phrased as the explicit exception to that claim, so the two cannot be read as
contradicting each other. Adding a "bowel prep ordered?" intake question was considered and
not taken, consistent with the contrast-route, AKI and gastroparesis decisions.

**The colonoscopy full deferral is kept on top of it**, because prep is universal there and
the app should not restate fasting rules to those patients at all.

**A co-treated colonoscopy patient was missing the carve-out entirely.** The branch chain
tested incretin co-treatment before surgery type, so a patient on a GLP-1 and an SGLT2i having
a colonoscopy received the 2 h timed drink with no prep deferral and no colour exclusion -
introduced 2026-08-13, caught by clinical review 2026-08-14, reproduced before and after the
fix. Colonoscopy was then tested ahead of the timed limbs but BEHIND the two co-treated limbs,
on the stated ground that those two limbs "issue no drink at all". **That ground was inexact
when written** (corrected 2026-09-16, next section): those limbs issue no TIMED drink, but they do
tell the patient to make some of their clear liquids carbohydrate and to make the last drink
before they stop a carbohydrate drink, naming juice, sports drinks, regular soda and gelatin
with no colour exclusion. The gelatin section above describes them correctly ("carry no timed
drink"); this paragraph did not.

### The colonoscopy limb is tested first, in both chains (2026-09-16)

**The defect.** Enumerated by executing the SGLT2i card across every co-treated colonoscopy
combination - two selections (GLP-1 + SGLT2i, fixed-ratio pen + SGLT2i), two modes, five
cutoffs, two diabetes types, AM/PM, and six hold-trigger states, 480 in all: **478 landed in a
co-treated limb** and were told juice, a sports drink, regular soda or gelatin with no
red/purple/orange exclusion and no "apple or white grape" qualifier. Only the two continuing,
SPAQI, 2 h cutoff cases reached the colonoscopy limb. The handoff open item said "any cutoff
other than 2 h"; it is every cutoff whenever the SGLT2i is held, FDA mode included, plus every
non-2 h cutoff when it continues.

**Why the co-treated limbs are wrong for a colonoscopy beyond the colours.** They are keyed to
the GLP-1 fasting cutoff, and on a colonoscopy the GLP-1 card defers that cutoff to the
preparation entirely (section above). So the clinician text said "clear liquids run until
midnight (GLP-1/tirzepatide cutoff governs)" and referred to "the 24 h clear liquid diet",
neither of which this sheet issues to a colonoscopy patient.

**A second, latent defect.** The clinician chain and the patient chain did not share a branch
order: the clinician chain tested colonoscopy behind the CONTINUING co-treated limb as well.
For the two cases where the patient sheet did show the colonoscopy text, the clinician was told
a timed 8-12 oz drink at 2 h before arrival had been issued. It had not.

**The change.** `sType === 'colonoscopy'` is now the FIRST test in both `carbPatient` and
`carbClinicianLead`. Every SGLT2i patient having a colonoscopy - co-treated or not, held or
continuing, any cutoff, either mode - gets the colonoscopy limb. The held co-treated rule (no
timed drink) is preserved, because the colonoscopy limb issues no timed drink. The clinician
colonoscopy text gains a co-treatment sentence when an incretin is present, saying the GLP-1
cutoff is not issued and no timed drink is given.

**Two decisions by Mark, 2026-09-16, taken on the same day and applied to the colonoscopy limb:**

1. **The red/purple/orange line is removed.** It had never been signed off (2026-08-13 above),
   and the reorder would have carried it to every SGLT2i colonoscopy patient. Colours are the
   preparation instructions' business. The milky/creamy, pulp and alcohol exclusions stay, as
   their own bullet, in the wording the general instruction uses. The last-drink examples
   still read "apple or white grape juice, a sports drink, or regular (non-diet) soda".
2. **The prep-day carbohydrate line is carried for EVERY SGLT2i colonoscopy patient, and it
   names no beverages.** "While you are on clear liquids - make sure some of what you drink
   contains carbohydrate. Choose from the clear liquids your preparation instructions allow, and
   not a diet, zero-sugar, sugar-free or no-sugar-added version. Fat-free broth does not count
   either." As first written that line named juice, a sports drink, regular soda and gelatin;
   the clinical review rated that MAJOR (naming an item reads as permitting it, and gelatin and
   sports drinks are sold in exactly the colours a prep forbids). Mark chose to name nothing.
   Co-treated patients had it from the co-treated limb and would otherwise have lost it in the
   reorder; SGLT2i-only colonoscopy patients never had it. A prep day is a long clear-liquid
   stretch and >12 h without carbohydrate is the eDKA trigger, so one wording now covers both.
   The last-drink line is the only place beverages are named: "apple or white grape juice, a
   sports drink, or regular (non-diet) soda". The exclusion sentence appears once, on the
   prep-day line.

The colonoscopy limb now reads, in order: follow the prep (omitted when a GLP-1 card prints
it directly above - see next paragraph); while on clear liquids, some carbohydrate; last drink
before the cut-off, carbohydrate; nothing milky, pulp or alcohol; if the prep does not allow
drinks like these, follow the prep and tell the clinic; then the "why" paragraph.

**Duplicate bullet suppressed.** The GLP-1 card's colonoscopy dietary text is exactly the
"follow the preparation instructions" bullet, and it prints first (dietRank 0 against 1). With
the reorder that bullet printed twice in a row on a co-treated sheet, so the SGLT2i limb omits
it when an incretin is present. Verified in the browser at 375 px.

**Sweep.** New per-card assertion on the SGLT2i card for a colonoscopy: the prep-day line and
the last-drink-before-cut-off line must be present; the co-treated "before you stop" wording,
the timed 8-12 oz drink, the removed colour line and gelatin must be absent. A new per-sheet
assertion requires the "follow the preparation instructions" bullet exactly once across the
cards on a colonoscopy, because the SGLT2i limb suppresses it on `hasAnyIncretin` while the
GLP-1 card produces it on `carriesGlp1Diet` - two predicates that agree today by coincidence of
the drug database. **The sweep gained an `SGLT2i alone` selection** (clinical review: every
SGLT2i scenario in the matrix was co-treated, so the whole SGLT2i-only population, timed drink
and on-waking escape included, had never been swept). The sweep now runs 28,080 scenarios. The
first version of the assertion failed on the unfixed code in 2,592 scenarios; the final version
was mutation-tested in a throwaway copy in both directions (routing reverted; prep-day line
removed for the SGLT2i-only patient). The sweep still fixes the GLP-1 cutoff to midnight and
the mode to SPAQI.

**Clinical review, 2026-09-16 (clinical-reviewer, on the final text).** One MAJOR, resolved by
the no-beverages wording above. MINORs applied the same day: the clinician co-treated sentence
no longer claims the 24 h diet is deferred, because the medication-list row still prints
"clear liquid diet starts 24 hours before arrival" on a colonoscopy (deliberate, 2026-08-14);
the eating-and-drinking footer says "drinks ... them" and no longer prints on a colonoscopy
sheet with no SGLT2i card, where it pointed at a drink that was not there; the clinician text
says the app cannot see where the prep places its cut-off. Verified by the reviewer by
execution: 480/480 co-treated colonoscopy combinations land in the colonoscopy limb; every
incretin drug id paired with an SGLT2i prints the prep bullet exactly once; no other field on
the SGLT2i card references the GLP-1 cutoff, the 24 h diet or a timed drink. The reviewer
quoted SPAQI's colonoscopy section - "maintaining hydration and carbohydrate intake before
colonoscopy ... will likely mitigate the risk of eDKA" - and panel a's "minimize preoperative
NPO time for carbohydrates; recommend 50-100 g carbohydrates/day" in support of the prep-day
line.

> **OPEN, for Mark, raised by that review and not decided:**
> - SPAQI panel a states a carbohydrate target (50-100 g/day). The prep-day line says "some".
>   On a clear-liquid day where the patient chooses every gram, a number may be warranted.
> - "Your last drink before your cut-off" nudges a carbohydrate drink to a boundary the app
>   cannot see. Some low-volume preps (Suprep, Plenvu) mandate a water volume after each dose
>   and then nothing; the escape bullet covers it, the clinician text now says so.
> - The global footer line "the eating and drinking times on this sheet count back from your
>   arrival time" is untrue on a colonoscopy sheet, where every time comes from the prep. Low.
> - No bowel-preparation guideline is on disk; the colour convention was never verified against
>   a source, which is one more reason the line was removed rather than kept.

### The GLP-1 card defers a colonoscopy patient to prep, at a stated cost (Mark, 2026-08-14)

The GLP-1 card had no surgery-type branch, so a colonoscopy patient was told to start a 24 h
clear liquid diet, take nothing after their cutoff, and *"if anything here differs from your
other preoperative instructions, follow these"* - which overrides prep, and whose NPO cutoff
is incompatible with a morning split-dose prep. **Mark's decision: defer entirely, matching
the SGLT2i card.**

> **The cost, recorded because it is real and was raised before the decision.** The GLP-1 24 h
> clear liquid diet and NPO cutoff exist for **delayed gastric emptying**, not bowel
> cleanliness. Deferring drops an aspiration mitigation in a population selected for it. In
> practice prep supplies the clear liquid diet anyway, so the real loss is the cutoff.
> **The clinician card states this explicitly** and prints the fasting requirement that would
> otherwise apply, so it is available to be reimposed for a patient where aspiration risk
> matters. The patient sheet defers, as decided.

### Gastroparesis and aspiration risk - stated on every card that issues these rules

**Added 2026-08-13 at Mark's request.** Both cards that issue eating and drinking
instructions - SGLT2i and GLP-1 - now carry the same clinician-facing caveat.

ASA 2023 scopes its fasting recommendations to *"healthy patients ... those without
coexisting diseases or conditions that may increase the risk for aspiration"* and names
**gastroparesis, diabetes mellitus and obesity** in that exclusion list, adding that
anesthesiologists *"should recognize that these conditions can increase the likelihood of
regurgitation and pulmonary aspiration and should modify these guidelines based upon clinical
judgment."* ASA 2017 carries the equivalent sentence, also naming diabetes. **Every patient
this app gives eating and drinking instructions to falls in that excluded population.**

The caveat states this, says the app does not ask about gastroparesis and does not try to
detect it, and directs that where delayed gastric emptying is suspected clinically a longer
fast should be considered and these intervals overridden.

**Deliberately not an intake question.** Mark: it has to be picked up clinically rather than
by forcing another question into the intake. Offered and not taken, on the same reasoning as
the contrast route and AKI fields in section 8.

**The caveat also carries ASA's own hedge**, quoted rather than omitted: *"emerging data
suggesting that some of the conditions traditionally considered to have an impact on gastric
emptying may have little or no effect on gastric emptying."* Printing the exclusion without
it would overstate how settled the question is.

> **Relevance to the on-waking drink.** This is the one place where the on-waking instruction
> could bite, since it puts fluid in closer to induction than the printed 2 h rule. The caveat
> is what the clinician acts on if they suspect delayed emptying. Note the drink is still
> roughly 3 h before anesthesia on the arrival anchor.

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

## 5b. Clinician override (built 2026-09-19)

**Designed 2026-08-14 (`Override-Design\override-design.md`), built unchanged 2026-09-19 after
Mark answered the two questions the design left open**, with one departure from the design found
by review and corrected (the "app recommendation" option was corrected as the design said it
should, rather than blanking the badge). Settled earlier and unchanged: per-session,
resets between patients, no audit trail anywhere the patient sees.

### The four design decisions, all implemented as written

1. **Scope: per-drug disposition plus free-text patient instruction.** Both, on one editor.
2. **The flip is inert until text is typed.** Apply is disabled unless there is non-whitespace text AND a chosen disposition (that requirement was added 2026-09-19, below), so
   the app never writes wording for a decision it did not make.
3. **The app's own recommendation stays visible**, struck and dimmed beside the new badge, with
   Undo. A clinician never edits blind and never forgets they departed.
4. **"These instructions were reviewed by your preoperative clinic team" prints on EVERY patient
   sheet**, overridden or not, so its presence carries no information about whether an override
   happened.

### The two questions the design left open, answered by Mark 2026-09-19

- **One time slot per override.** A clinician needing to cover two slots writes one instruction
   covering both. Multiple slots were offered and declined: the same sentence printed twice, or
   two sentences that can contradict each other, are both worse than one.
- **Soft warning on restart wording, not a block.** Text matching resume, restart, start again or
   start taking raises a line under the textarea noting that restart guidance normally prints in
   the After Surgery section. Apply still works. The clinician stays in control and is told what
   the sheet's convention is.

### How it is wired, and why that shape

`getAllResults()` stays pure. Overrides are applied once, in `renderOutput()`, by
`applyOverrides(results)`, and the clinician cards and `renderPatientSheet()` both read the
same post-override array. **They cannot disagree**, which was the design's central requirement.
The sweep therefore still exercises exactly the code it exercised before, unchanged, 28,080
scenarios green.

State is `this.overrides[cardId] = { badge, badgeType, slot, patientText, editing, draft, slotDraft, badgeDraft, sig }` on the app
instance, next to `sheetSize`, cleared by `startOver()`. Nothing persists, nothing is stored,
nothing leaves the browser.

**On the patient sheet the checklist row and the timeline both move.** The row is built from the
new badge AND the slot the typed text lands in - see the second and third review sections below for
why both are needed - the multi-drug rule still wins, and all three time slots on that card are
CLEARED before the typed text is placed in the chosen one.

**Clearing all three slots prevents a contradiction BETWEEN THE THREE TIMELINE SLOTS, and nothing
more.** That narrow claim is the one worth making. The first review of this build found four other
parts of the sheet still computed from the app's own decision and still printing around the
override, each of which could contradict it on the same page. All four are addressed below; the
general form of the lesson is that an override changes a disposition, and every element keyed to
that disposition has to be found, not assumed.

**On the clinician card:** original badge struck and dimmed beside the new one; an accent strip
carrying the typed text with Edit and Undo; the card's own patient-facing sections struck as
superseded. Monitoring, resumption and evidence are untouched - they never print for the patient,
so an override has no business changing them.

### Deliberately out of scope, per the design

- **The eating-and-drinking block is not overridable.** It is the section 5 matrix - held versus
  continuing, GLP-1 co-treatment, cutoff timing, bowel prep, colonoscopy - not a per-drug
  instruction. A disposition flip cannot express a change to it, and free text replacing it would
  drop branches silently. Raise separately if clinicians ask.
- No suppress-the-card option. No override of monitoring, resumption or evidence text.

### The standing risk, restated

**Free text bypasses everything that makes the sheet safe**: the PEMAT work, the line-measure cap,
the reading level, every sweep assertion. The permanent warning under the textarea ("printed
exactly as typed ... not checked for reading level") is the only mitigation and it is a weak one.
That is inherent to the feature, not a defect in it. The restart-wording hint is a second, softer
guard on the one convention the sheet is strictest about.

### First clinical review of the build, 2026-09-19: five critical defects, all fixed

The review executed the real renderer against the working tree. Every finding was a case of the
sheet printing the app's ORIGINAL decision alongside the clinician's override.

1. **"App recommendation" blanked the badge instead of preserving it.** The first option carries an
   empty value, which was stored as `null` and assigned unconditionally. A clinician adding a
   clarifying sentence without changing the disposition got a literal `null` badge, and the
   checklist row then read "stop the night before" for a type 1 patient on basal insulin, which is
   the ketoacidosis direction and contrary to ADA Standards of Care 2026. **Fixed:** the badge is
   only replaced when one was chosen.
2. **The checklist row followed the SLOT, not the badge.** `dispoCore` tests the days-before and
   night-before fields before it reads the badge, which is right for an app-written card, where
   the slot is the disposition. Under an override the two are independent, and badge and slot
   combinations printed a contradiction - worst, CONSULT REQUIRED in a non-morning slot printing
   "stop the night before". **First fix, and it was wrong in the other direction:** driving the row
   from the badge alone. See the second review below.
3. **The slot defaulted to the card's pre-override slot**, which is exactly wrong when the
   disposition is flipped: a card overridden from HOLD to CONTINUE inherited the heading "Days
   Before Surgery - Stop These Early" over "keep taking it". **Fixed:** choosing a disposition
   moves the slot to the one that matches it, visibly, and the clinician can still change it.
4. **`checklistDispo` was never cleared**, so the fixed-ratio pen ignored the override entirely:
   one sheet said "do not take it, a different insulin is used instead", "take your usual dose",
   and "use the separate long-acting insulin until you restart it". Double dose or none.
   **Fixed:** cleared on override.
5. **The After Surgery block was computed pre-override, and contradicted in both directions.** A
   held SGLT2 inhibitor overridden to CONTINUE still told the patient to "start taking this
   medicine again when you are eating and drinking normally", which a patient can read as an
   instruction to stop now; and it used the held timing wording. A continuing one overridden to
   HOLD got NO restart instruction at all and no discharge-override line. **Fixed:** the SGLT2
   card now also returns `returnPrecautionsNeutral`, in which the restart, discharge-override and
   timing bullets are replaced by wording true whichever way the drug goes, and the renderer swaps
   it in for an overridden card. Every other bullet is the same string, not a copy, so the two
   cannot drift. The cross-reference pointer from the other-classes block is now override-aware.

Also fixed from that review:

- **A stale override survived a change to the assessment.** An override written for a minor
  procedure still applied after the surgery type was corrected to bariatric. Overrides are now
  stamped with a signature of the context, details and drug list, dropped when it changes, and the
  clinician is told on the Clinician Summary rather than left to notice.
- **Typed text was inserted unescaped.** "If your sugar is <low>" printed as "If your sugar is",
  the bracketed word parsed as a tag and silently dropped, while still showing in the editor.
  Now escaped on the way into both the sheet and the strip.
- **A half-typed instruction was destroyed** by any re-render, including opening another card's
  editor. The draft now persists.
- **A multi-drug card** (Januvia plus Janumet on one card) took one sentence and printed it under
  both names, erasing the split instruction. The editor now names every drug the card covers and
  warns that the text replaces the instruction for all of them.

### Second clinical review, 2026-09-19: six more blocking defects, one of them a regression I caused

The second pass proved by execution that nothing changed for a non-overridden sheet - 7,040
scenarios, HEAD against the working tree, zero differences in either the patient sheet or the
clinician cards, once the new review line is normalised out. Every finding below is on the
override path only.

1. **The badge-only checklist row was a REGRESSION.** With the slot thrown away, every
   days-before override printed "do not take on the day of surgery" under the heading "Days Before
   Surgery - Stop These Early" - 12,080 of 12,080 such renders. Before my fix that case printed
   "stop early", which was right. A patient on a one-week GLP-1 hold could read the summary row and
   take their weekly dose four days out. **Now:** the row combines badge and slot - a hold whose
   text sits in the days-before slot reads "stop early".
2. **A CONTINUE-family override printed no pointer below**, although an overridden card always has
   text there. "Keep taking metformin, but only half your usual morning dose" summarised as "keep
   taking as usual", full stop. **Now:** an overridden row always ends "- see below".
3. **The multi-drug rule was bypassed.** My override branch ran before it, so a card covering
   Januvia and Janumet took one sentence about Januvia and summarised both as "keep taking as
   usual". Janumet carries metformin. Both the design and my own record said the rule still won;
   neither was true. **Now:** the multi-drug test runs first, as it always did.
4. **The other-classes After Surgery block was still computed pre-override** - I had fixed this for
   the SGLT2 card and assumed the rest. A pump overridden to HOLD still printed "your insulin pump
   was meant to keep running"; basal insulin overridden to HOLD still printed "never skip it, even
   if you are not eating", on the same sheet as the clinician's stop instruction. **Now:** an
   overridden card is pulled out of the per-drug bullets and given one neutral bullet.
5. **A GLP-1 overridden to HOLD got no restart guidance anywhere.** That card is excluded from the
   block on the reasoning that the app never holds it - which an override makes false. **Now:** an
   overridden GLP-1 card is admitted to the block.
6. **Clearing `checklistDispo` unconditionally broke the unchanged-badge case.** The fixed-ratio
   pen states its own phrase precisely because its MODIFY DOSE badge misleads; clearing it made the
   row read "dose changes" for a pen that must not be taken at all. **Now:** cleared only when the
   disposition actually changed, and honoured inside the override branch when it survives.
   **SUPERSEDED the same day** by Mark's decision to require a disposition: `checklistDispo` is now
   always cleared, and the survival path is deleted.

Also fixed: **the neutral After Surgery bullet had dropped SPAQI R10** - a patient overridden to
HOLD was pointed at an instruction that says when to stop and nothing about starting again. It now
carries "unless you were told otherwise, start taking it again once you are eating and drinking
normally", suppressed on the bariatric and very-low-carbohydrate limb where SPAQI panel c says not
to resume. **The stale-override notice survived only one render**, so a clinician who glanced at
the patient tab lost both the override and the notice; it is now sticky with a Dismiss button and
names the drugs affected. **Cancel left an abandoned draft** that reappeared next to the applied
text on reopening, inviting a clinician to apply wording they had discarded. **The editor textarea
did not escape `&`** on redisplay.

**The lesson, recorded because I got it wrong twice in one session.** An override changes a
disposition. Every element keyed to that disposition has to be found by enumeration, not by
assumption - and a fix that replaces one input with another (slot with badge) is as likely to be
wrong as the thing it replaced. Both of my fixes to the checklist row were incorrect before the
third attempt combined the two inputs it actually depends on.

**Known and accepted:** correcting the arrival time, the surgery date or an eGFR drops every
override on every card, because the signature covers the whole assessment. It fails safe, it is
now visible, and narrowing it would risk keeping an override against facts that moved.

### Third clinical review, 2026-09-19: two more critical defects, and the root cause

**The root cause, stated plainly: the design predates the sheet it is overriding.** It was written
2026-08-14. The After Surgery blocks were built 2026-09-02 (SGLT2) and 2026-09-16 (every other
class). The design therefore describes an override of a purely PREOPERATIVE sheet, and its three
time slots are all preoperative. Each review pass has been discovering another piece of
postoperative content the design never contemplated.

1. **The neutral bullet promised a restart instruction that cannot exist.** It said "follow the
   instruction printed above for when to stop it and when to start it again" - but the editor has
   no postoperative slot, so nothing above can carry a restart. Worse, overriding a pump or a basal
   card removed the never-go-without-insulin safeguard from the sheet entirely, for a type 1
   patient. **Now:** the bullet says the clinic has written its own instruction above and to follow
   that, and points to discharge instructions or the prescriber for restarting; and an overridden
   insulin or pump card adds an unconditional "Never go without insulin" bullet.
2. **A split card dropped one of its drugs.** `changedDrugNames` holds the subset the APP decided
   to hold. An override covers every drug on the card, so a DPP-4 card overridden to "stop BOTH of
   these" named only Janumet in the After Surgery block, and Januvia appeared nowhere. **Now:** the
   name helper uses the full drug list for an overridden card.

**Mark's decision, 2026-09-19: a disposition is REQUIRED whenever text is typed.** "Keep the app
   recommendation" disables Apply. **SUPERSEDED by the fourth review below: it does NOT remove an
   existing override - the Remove override button added there is the cancel.** The review had found the unchanged-badge case still
   printing the app's own checklist phrase over the clinician's instruction - the fixed-ratio pen
   saying "do not take it, a different insulin is used instead" above "take your usual Soliqua
   dose". Requiring a disposition removes that whole class, and matches how the design described
   the option. It costs one extra click when a clinician only wants to clarify. With a badge always
   chosen, `checklistDispo` is always cleared and the survival path is gone.

**Also fixed from that review:** the SGLT2 neutral bullet had dropped the caveats the primary path
carries on every limb - "as long as your recovery has been straightforward ... infection or a
kidney problem" on major and cardiac, "if you are unwell ... wait until you can" on ambulatory -
rendering SPAQI R10 as a sufficient trigger, which this card's own comment explicitly forbids
outside ambulatory surgery. Both are restored, split by surgery type. An in-progress disposition
and slot choice now survive a re-render, as the text already did. A non-hold disposition placed in
the days-before slot raises a hint, because that slot's heading reads "Stop These Early". The
original badge is struck beside the new one only when it actually changed.

**Three passes, and I introduced defects in two of them.** Recorded because the pattern matters
more than the instances: each fix addressed the case in front of it rather than the class. The
checklist row took three attempts - slot, then badge, then both - and the After Surgery blocks took
two, because the first fix covered the SGLT2 card and assumed the rest. The general rule for this
feature is that an override changes a disposition, and EVERY element keyed to that disposition has
to be enumerated, including the ones added to the sheet after the override was designed.

### Fourth clinical review, 2026-09-19: the release blocker is closed; two more found

**The third pass's blocker is confirmed closed by execution:** twelve card types overridden to a
hold, every one produced an After Surgery restart pointer. The reviewer also re-ran the regression
sweep - 6,560 scenarios, HEAD against the working tree, no overrides set - and found zero
differences in the patient sheet and the clinician cards beyond the two intended additions.

1. **The option labelled "cancels the override" cancelled nothing.** Selecting it only disabled
   Apply; Cancel then kept the override, so a clinician deliberately retracting one silently
   failed and the sheet still carried their earlier instruction. The label was what made it
   dangerous. **Now:** the label promises nothing, and the editor carries an explicit Remove
   override button beside Cancel.
2. **A CONTINUE-direction override still said "for when to start it again".** Nothing was stopped,
   so there is nothing to restart, and a patient could infer their medicine had been held and not
   take it after discharge. This is the third review's critical finding re-emerging pointing the
   other way - the same pattern the lesson above describes. **Now:** the bullet splits on the
   disposition, which is mandatory and therefore always known: a continued drug gets "if anything
   about it is unclear, ask the doctor who prescribes it" instead.

Also fixed: the plural in that bullet counted CARDS rather than drugs, so a split card naming two
medicines said "this medicine ... start it again"; the closing insulin sentence printed twice when
one insulin card was overridden and another was not; and a whitespace-only draft re-enabled Apply
after a re-render.

**One pre-existing contradiction in SHIPPED patient text was fixed at the same time.** The sick-day
bullet told every SGLT2 patient "start it again only once you are eating and drinking normally" -
including the bariatric and very-low-carbohydrate patients whose bullet directly above says not to
restart on their own, and that eating normally is not the signal for them. That is the exact signal
the limb exists to suppress, and the hazard is euglycemic ketoacidosis in a patient on a staged
postoperative diet. The sick-day bullet now defers to the surgeon or prescriber on that limb only;
every other patient's wording is unchanged. **This changes text on the live sheet, not only under
an override, and is flagged to Mark as such.**

### Fifth clinical review, 2026-09-19: the same class again, on two more unenumerated paths

The four fixes from the fourth pass held under execution, and the regression sweep was re-run at
23,040 scenarios with three classes of difference and no others: the Override button, the review
footer line, and the intended bariatric sick-day rewording.

1. **MODIFY DOSE and CONSULT REQUIRED were being treated as stops.** The direction split was
   written as "CONTINUE or not", so a dose change or a change-nothing-yet told the patient when to
   "start it again". A type 1 patient given a reduced basal dose could read that as confirmation
   the insulin was stopped. **Now:** direction comes from one table with three values, and an
   unrecognised badge asserts nothing rather than defaulting to a stop.
2. **A bariatric oral override dropped the do-not-restart-on-your-own rule.** That rule is keyed
   to the postoperative diet, not to the preoperative disposition, so an override has no business
   removing it - the SGLT2 card already got this right and the other classes did not. **Now:** on a
   bariatric case an overridden ORAL drug defers to the bariatric team (never an insulin or pump card -
   see the sixth review below), and continue-direction and
   dose-change overrides carry the team sentence too.

Also fixed: a continue-direction override placed in the days-before slot printed under the heading
"Days Before Surgery - Stop These Early". The heading is the bolder element and is what a patient
scans, so it now drops its "Stop These Early" half when any overridden card in that slot is not a
hold. A non-overridden sheet is untouched.

**Five passes. The same failure has appeared five times in different clothes:** an element computed
from the app's decision, surviving an override that reversed it. Checklist row, After Surgery
block, split-card drug names, restart direction, bariatric deferral, section heading. The fix that
finally generalised was replacing ad hoc conditionals with one direction table, so a badge cannot
fall through to a default that asserts something. Anything added to this sheet later that depends
on a disposition has to go in that table, not be tested separately.

### Sixth clinical review, 2026-09-19: my bariatric fix reached insulin

**One critical, and it was introduced by the fifth-pass fix.** The bariatric deferral - "do not
start it again on your own: your bariatric team decides when" - was gated on the surgery type
alone, against a group that can contain insulin. So a type 1 patient whose basal, NPH, premixed,
U-500 or pump card was overridden to a hold was told to wait for the team before restarting
insulin, beside a contradicting "do not stop your insulin on your own" in the same block. That is
the ketoacidosis direction, and ADA Standards of Care 2026 section 16 is explicit that basal
insulin is not held in type 1 diabetes even while nil by mouth.

**The fix generalises the grouping instead of adding another condition.** Overridden cards are now
grouped on TWO axes at once, direction and card kind, from one loop. An insulin, U-500 or pump
card never receives the bariatric deferral in any surgery type; it gets the discharge-instructions
wording plus "do not go without your insulin while you wait: if you are not sure, call before you
skip a dose". Oral agents keep the deferral on a bariatric case. A sheet with both overridden
prints both bullets, each with its own tail.

**Also fixed: two editor hints that stated things no longer true.** The days-before hint quoted a
heading ("Stop These Early") that the fifth-pass change means cannot print in the case that raises
the hint. And "Replaces every instruction this card would otherwise print on the patient sheet"
was never true: the eating-and-drinking block and the After Surgery section are not replaced, they
adjust. The hint now names exactly what it replaces. That matters because these hints are the
feature's only mitigation for free text, and a hint that is visibly wrong devalues the others.

**Six passes, six appearances of one failure.** Every instance has been an element computed from
the app's decision surviving an override that reversed it, or a condition tested ad hoc against a
set that is not homogeneous. The two structural fixes that finally held are the direction table
and the two-axis grouping: both replace a conditional with a table that every consumer reads.
Anything added to this sheet that varies by disposition or by card kind belongs in those, not in a
new `if`.

### Seventh clinical review, 2026-09-21, and the SGLT2 restart fix Mark asked for

The seventh pass confirmed the sixth-pass critical closed: 770 insulin-family override scenarios
with no bariatric deferral anywhere, 112 oral scenarios keeping it, mixed sheets correct, and a
2,240-scenario regression showing only the three known differences. It re-raised the SGLT2 restart
bullet at HIGH rather than accepting it as an open item, on the ground that it was the last place
on the sheet where a sentence computed from the app's decision survived an override reversing it.

**Mark: fix it (2026-09-21).** The SGLT2 card now returns TWO neutral variants and
`applyOverrides` picks between them using the same direction table the rest of the sheet reads.
A card overridden to CONTINUE or CONTINUE BASAL gets "Follow the instruction for this medicine
printed above. If anything about it is unclear, or you are not sure what to do after surgery, ask
the doctor who prescribes it", with the discharge-instructions line; on the bariatric and
very-low-carbohydrate limb it defers to the team instead. **Only a STOPPED direction keeps the
restart trigger** with its ambulatory or major caveat - corrected 2026-09-21 on the eighth review,
which found the pick was two-way over a three-way table, so a CONSULT REQUIRED override told the
patient to restart while the checklist row said to change nothing until their doctor called. An
unrecognised badge now also asserts nothing, which is what the table's default always promised. Every bullet below the first is the same
string in BOTH NEUTRAL variants, not a copy, so those two cannot drift. (The ordinary
`returnPrecautions` shares five of its eight bullets; its restart, discharge-override and timing
bullets are its own. The eighth review caught this record overstating it.) **The direction table moved to
module scope** so `applyOverrides` and the renderer read one definition.

Two more from that review, both fixed: **the insulin predicate was defined twice**, eleven lines
apart, and the second copy was the mechanism by which the sixth-pass critical could silently
return for a future insulin card - there is one definition now. And **the drug names in the block
header were in a different order from the bullets below them**, a consequence of the two-axis
grouping; the header is now built from the same groups.

**Still open, and recorded as accepted rather than fixed:** an override cannot change the
eating-and-drinking block, so a GLP-1 held for weeks by a clinician still prints the 24 h clear
liquid diet, and the checklist row still advertises it. That is the design's scope boundary and
the conservative direction. Also noted: the insulin predicate matches card ids by prefix, so a new
insulin card under a different prefix would be grouped as oral - worth converting to a property
the card sets, like the diet flag, when the next insulin card is added.

**Seven passes.** Six of them found something, and three of those were defects in my own previous
fix. What worked in the end was not care but structure: two tables (direction, and grouping by
direction and card kind) that every consumer reads, replacing conditionals that each had to be
remembered separately.

**Not changed, and why.** The GLP-1 24 h clear-liquid diet still prints when that card is
overridden: the eating-and-drinking block is out of scope for this feature by design, and the diet
exists for delayed gastric emptying that outlasts the last dose. Flagged by the review as a
clinical judgement for Mark, not resolved here.

**The sweep cannot see any of this.** It loads only the pure logic layer above the app class, and
the entire feature is renderer-level. It stays green at 28,080 scenarios because the logic layer is
untouched, which is evidence that nothing was broken elsewhere, not evidence that the feature works.

**Verified in the browser after the fixes, 2026-09-19:** all five critical cases reproduced and
confirmed fixed by execution, plus Apply disabled while empty; the restart hint appearing and
clearing as text is typed; the struck original badge and the override strip; clinician sections
struck as superseded; the typed text printing once in the chosen slot; a second selected drug
untouched; Undo; New Assessment clearing state; the review line on every sheet; no horizontal
overflow at 375 px or at any of the three text sizes; and no override control reaching paper -
though note the print suppression actually comes from the whole clinician tab being hidden in
print, not from `no-print` on each control.

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

## 11. eDKA risk: what the source actually quantifies (checked 2026-08-13)

Read directly from Oprea et al., BJA 2026, pp.3-4 and Table 2, plus ADA S16 p.9.
Both questions below were raised by Mark and had been answered by assumption until now.

### How much risk survives an adequate hold?

**Pharmacokinetic basis for the interval:** *"if SGLT2is are discontinued for ~72 h, <1% of
drug then remains in circulation."* That is the whole basis for 3 days, and it is about drug
concentration, not about ketogenesis.

**Outcome data, from Table 2:**

| Study | Hold | Population | eDKA |
|---|---|---|---|
| Woronow 2024 | 24 h | T2DM, n=29 | **31%**, ketoacidosis lasting 3-20 days, 7 relapses |
| Auerbach 2025 | 120 h | cardiac, n=540 | **0%** |
| Chen 2025 | 168 h | metabolic/bariatric, n=4364 | **0.69%** vs 0.46% in nonusers (OR 1.5, P=0.316) |

**Reading:** a short hold is clearly inadequate; an adequate hold brings risk close to
baseline without eliminating it. Even at a full week, in the highest-risk surgical population
in the paper, eDKA still occurred at 0.69% - numerically above nonusers, not significantly so.

**CORRECTED 2026-08-14 (clinical review).** The anion-gap finding below was attributed to
Pitta. It is **Steinhorn and colleagues, ref 44, 2023** - T2DM/HF/CKD, n=463, **average 36 h
hold**. **Pitta, ref 40, 2025 is a different study and a materially important one: the
POST-CABGDM randomised trial, T2DM, n=145, at a 72 h hold**, reporting reduced postoperative
AKI (22.5% vs 39.1%, RR 0.57, 95% CI 0.34-0.96, P=0.03) and **no increase in safety events
including ketoacidosis** - though the table records "no eDKA criteria", so ketoacidosis was a
safety endpoint rather than a systematically ascertained outcome.

**Whether a LONGER hold helps is genuinely unsettled.** Steinhorn found a strong inverse
correlation between hold time and postoperative anion gap (r=-0.63, 95% CI -0.91 to -0.34);
another study *"did not find a correlation between the duration of SGLT2i cessation before
surgery ... and hyperketonaemia."* The paper also notes the drug's tissue effects outlast its
plasma levels - SGLT2is *"might confer AKI protection when given chronically even if withheld
for 72 h"* - so "<1% in circulation" is not the same as "no pharmacologic effect".

**Consequence for this app (Mark, 2026-08-13):** it supports giving the carbohydrate drink to
held patients (section 5, and the long-standing decision not to suppress any group), **and it
supports giving them the on-waking version too.** The near-zero rates come from 120 h and
168 h holds; this app holds 72-96 h. **Corrected 2026-08-14:** this section previously said no
study reports the rate at exactly 72 h. Pitta 2025 does, at n=145, with no increase in
ketoacidosis - but ketoacidosis was a safety endpoint with no eDKA criteria defined, so it is
small and underpowered for this question rather than absent. The argument stands in the weaker
form: the 72 h evidence is thin, not missing. A held
patient is therefore not in the reassuring part of the evidence, and the drink is close to
free. No change to the 72/96 h intervals, which remain as the source sets them.

### Does the source quantify a prior DKA history?

**No.** The prose reads: *"Poorly controlled diabetes mellitus, with an HbA1c >8%, use of
insulin, or a prior history of diabetic ketoacidosis, adds to the risk among patients with
T2DM."* Three factors named together, no ranking, no separate effect size for any of them.
This independently confirms the 2026-08-13 review finding and the correction made in
section 2c.

**The source is not silent on prior DKA elsewhere, though it still does not rank or quantify
it.** BJA p.16, discussing Recommendation 9, suggests a concomitant insulin infusion in those
*"deemed to be 'insulin deficient' such as those with higher HbA1c concentrations, taking
high-dose insulin or multiple oral hypoglycaemic agents, or with a prior history of diabetic
ketoacidosis."* That is intraoperative management, not a preoperative hold, but it is fair to
say the source treats prior DKA as a marker of the insulin-deficient phenotype. It does not
restore the withdrawn blank-holds rule. **Note also (clinical review, 2026-08-14): ref 42
(Lui 2022, n=147,115), the paper's own largest citation for the risk-factor sentence, is
summarised in Table 2 as naming insulin use and HbA1c >8% - it does not name DKA history at
all.**

**The only one of the three the paper quantifies is HbA1c:** RR 2.24 (95% CI 1.59-3.14) above
7.9%, versus RR 1.05 (0.49-2.26) at or below, interaction P=0.034.

> **This is the strongest argument against the blank-answer asymmetry, and it should be
> recorded as such.** The risk factor with a measured effect size (A1c) defaults toward
> CONTINUATION when blank; the one with no measured effect size (DKA history) HOLDS. Mark's
> reasoning was never about effect size - it was that an A1c can be looked up later and a DKA
> history cannot - so this does not overturn the decision. But anyone revisiting section 2c
> should weigh it. **Decision unchanged, 2026-08-13.**

**Scale, for the clinician note:** perioperative eDKA runs about 6.40 per 1000 person-years,
and a population-based cohort of over 147,000 surgical patients with T2DM found an incidence
rate ratio of **6.33 (95% CI 5.57-7.18)** in SGLT2i users versus nonusers. Both figures are
now in the clinician view's blank-DKA block, which previously asserted the risk without
defining it.

**ADA S16 adds one datum and one caution.** In emergency surgery - where no hold is possible
- DKA was 4.9% in SGLT2i users versus 3.5% in nonusers, **not significant after adjustment**,
though ADA notes ICD-10 ascertainment likely missed euglycemic cases. ADA's own framing of
the 3-4 day hold is explicitly precautionary: *"until further prospective studies are
conducted, as an abundance of caution."*

---

## 12. Patient sheet is time-ordered (Option B, 2026-08-14)

**Mark chose Option B, chronological ordering, over Option A.** The sheet was one card per
drug, each holding up to four time sections. It is now ordered by TIME, because a patient
reads it to answer "what do I do now", not "what does each of my drugs do".

Order, and why: **medication checklist, eating and drinking, days before, night before,
morning of.**

- The **checklist is first** because it is a table of contents, not a summary, and because its
  one unique safety function - catching a medication the patient takes that is not on the
  sheet at all - only helps BEFORE they act.
- **Eating and drinking is above the timeline** (Mark, 2026-08-14). It is chronologically
  first: the 24 h clear liquid diet starts about 26 h before surgery.
- Each eating-and-drinking paragraph prints **WHOLE and unedited**. Every branch of the
  section 5 matrix spans the entire timeline inside one paragraph. Slicing them into time
  buckets would rewrite signed-off wording and break the branches that deliberately carry no
  clock anchor (co-treated, cutoff earlier than 2 h) or no timed instruction at all
  (colonoscopy). **No patient instruction string was altered by the restructure.**
- GLP-1 prints before SGLT2i where both exist - the 24 h diet precedes the 2 h drink.
- Two HEADINGS changed, which are not instructions: "Days Before Surgery - Stop This
  Medication Early" became "Stop These Early" (it now covers several drugs), and "Important
  Dietary Instruction" became "Eating and Drinking Before Surgery".

### The checklist disposition is derived from the time buckets, NOT the badge

This is the safety-critical part of the restructure and it took three attempts.

**The badge is not a reliable summary of what a patient must do**, because the same badge
string means different things on different cards:

| Signal | On this card | Actually means |
|---|---|---|
| `HOLD` badge | SGLT2i | stop 72-96 h early |
| `HOLD` badge | metformin (eGFR/contrast), sulfonylurea | stop on the day of surgery |
| night-before text | basal insulin | REDUCE the dose |
| night-before text | sulfonylurea | SKIP the dose |
| night-before text | pump | change NOTHING |
| night-before text | bolus insulin | PERMISSION to take the dinner dose |

**The worst of these was caught by clinical review and reproduced in the browser before it was
fixed:** a T1DM patient on Humalog with a dinner dose entered was told, in the checklist,
"stop the night before" - directly over an instruction below that permits that dinner bolus.
Skipping it leaves a type 1 patient uncovered overnight after a full meal.

**Rules now applied, in order:**

1. **A card covering more than one drug states nothing** and points below. A card can carry a
   split instruction - Janumet held while Januvia continues, Synjardy morning-held while
   Jardiance continues outright - and no single disposition is true for both. Deliberately
   conservative: it costs a summary line on multi-drug cards whose drugs do agree, and it is
   the only rule here that cannot be wrong.
2. `daysBefore` present gives **"stop early"**, NOT "stop several days early": the bariatric
   limb stops at the start of the preoperative diet, typically 2-4 weeks out.
3. `nightBefore` present takes its direction from the badge, with bolus insulin
   (`HOLD WHILE NPO`) suppressed to a pointer because its night-before text is a conditional
   permission rather than an instruction.
4. Otherwise the badge, with **a "see below" pointer on every hold**, because the AGI and
   meglitinide morning-of strings are conditional on whether breakfast is permitted.

**This is a restatement, never a new rule.** Anything the checklist cannot state without
qualification points at the instructions rather than guessing.

### Type scale (Mark, 2026-08-14)

The colleague's original request was **legibility for older patients and patients with vision
problems**. Body text printed at 14px and section headings at 10px wide-tracked monospace;
the print stylesheet changed colors only and never raised a font size.

Three reader-selected scales, **CSS only** - no clinical logic reads the class and no patient
string changes with it. Per-session, resets with New Assessment, never printed on the sheet.

| Scale | Body | Note |
|---|---|---|
| Condensed | 14px | the pre-2026-08-14 body size |
| **Comfortable (default)** | **16px** | about 12pt |
| Large Print | 22px | about 16.5pt, inside the recognized 16-18pt large-print range |

The 10px wide-tracked monospace headings are **replaced at every size**, including Condensed -
they were the least legible element on the page. Mark wants to reconsider making Large Print
the default once he has seen it in use.

#### Line measure capped (2026-08-14)

Type size was not the only legibility variable. Measured on the rendered sheet, body text ran
**103 / 90 / 65 characters per line** at Condensed / Comfortable / Large Print. The recognized
comfortable range for sustained reading is about **45-75**, and an over-long measure hurts
exactly the readers this exercise is for - the eye has to track back across a wide gap to find
the start of the next line. Part of why Large Print read better was its narrower measure, not
only its type size.

A `max-width` now caps the measure, expressed in `ch` so it scales with each size. **Tuned
empirically, not by theory:** `ch` is the width of "0", narrower than Barlow's average glyph,
so an initial 68ch still rendered about 89 real characters. Final values give **68 / 68 / 66
characters** on the widest line - all three in range. Large Print is left wider because it was
already container-limited inside the range, and narrowing it further would only add pages.

CSS only. No patient string changed, and the low-vision display-size source gives a floor of at
least 13 characters per line, which nothing here approaches.

Rendered samples of all three, with the builder that regenerates them, are committed at
`Patient-Sheet-Samples\`. They are in the project deliberately: session scratchpads do not
persist and these samples were lost twice.

## 13. Decisions of 2026-09-24 (Mark), after two new papers

Asked one at a time, all collected before any edit. Sources: Haziri et al., *Perioperative
discontinuation of SGLT2 inhibitors and cardiac complications after noncardiac surgery*, Br J
Anaesth 2026;137:440-9 (Basel cohorts, 451 patients, 90-day heart failure or CV death 1.7%
continued vs 11.5% held >=3 days, adjusted OR 1.58 per day held; observational, 31 events); and
Garcia, Dixit, Legrand, *Balancing the evidence with the SPAQI recommendations*, Br J Anaesth
2026;137:413-9 (editorial, no new data). Both in Source-Articles.

### 13a. GLP-1 or tirzepatide cutoff earlier than 2 h holds at minor procedures too - BUILT

Mark: "hold for everyone if cutoff earlier than 2 hours". Removes the 2026-08-13 scoping to
major noncardiac, cardiac and bariatric (section 2a). Why the scoping was wrong: only the 2 h
eating-and-drinking branch schedules a timed carbohydrate drink. The 4, 6, 8 h and midnight
branches say "your last drink before you stop - make that one a carbohydrate drink too. Do not
set an alarm or stay up for it", so the last carbohydrate is realistically about 22:00. Midnight
cutoff, noon minor case: about 16 h. Midnight cutoff, 09:00 case: about 13 h. An 8 h cutoff works
only when it falls in the evening (07:30 arrival, 23:30 cutoff, about 11.5 h), which depends on
an optional arrival time; Mark chose the single rule. The clinician override covers the early
case that would have been fine. **Diabetic patients (and unrecorded diabetes status) only** - see
13b.

**Colonoscopy is NOT included (Mark, 2026-09-24, on the clinical review of this build).** As first
built the rule reached colonoscopy too, and the review (MEDIUM) found that there it depends on a
field that means nothing: a colonoscopy sheet follows the bowel prep, never issues the GLP-1
cutoff, and never schedules a timed drink whatever the cutoff. The default (midnight) held every
co-treated colonoscopy patient; a clinician who picked 2 h continued the same patient. Offered:
always hold, or never auto-hold. **Mark: never auto-hold** - the clinician's 12 h answer decides,
as for an SGLT2-only colonoscopy patient, and the prep-day carbohydrate line keeps the window
short. Net effect of 13a: minor procedures only; major noncardiac and cardiac already had it.

**Evidence weighed against (clinical review, recorded at its request):** SPAQI p.9 cites Ramadan
data (fasting 12-16 h daily for a month) as reassurance about fasting on an SGLT2i, and Haziri
associates each day held with more heart failure or CV death (observational, major surgery).
Holding a minor-procedure patient 72 h over a 13-16 h fast is the conservative choice for
ketoacidosis and not a free one.

### 13b. Patients without diabetes: 24 h, and nothing else except diet - BUILT

A patient without diabetes holds ONLY for a ketogenic / very-low-carbohydrate diet or bariatric
surgery (unchanged), or an anticipated **>24 h** carbohydrate-free window, before and after
surgery combined. The 24 h question REPLACES, for this group, the 12 h question, the >3 h
trigger and the GLP-1 cutoff trigger (Mark: "use 24 hours for non-diabetics, it replaces the
other two"). A separate field (`prolongedFasting24h`) so an answer never changes meaning if
the diabetes type is edited after it was given. Insulin use, A1c >8 and DKA history are left as
built; they describe a diabetic patient.

**Basis, SPAQI pp.15-16 (the in-press copy):** patients without diabetes taking SGLT2is for
cardiorenal indications "are at negligible risk of eDKA"; no cases in the non-diabetic cohorts
of DAPA-HF, EMPEROR-Reduced or EMPEROR-Preserved; none in DAPA-CKD participants with
normoglycaemia or prediabetes; one in EMPA-KIDNEY, "starving due to a medical illness"; and
**"All case reports of eDKA in patients with HF without diabetes mellitus have poor oral intake
or prolonged preoperative fasting (>24 h) as a common denominator."** The panel continues them
for all surgery except bariatric. Garcia adds one event in about 30,000 patient-years without
diabetes (Baigent, Lancet 2022). Haziri's authors speculate that stopping is "likely even worse" in this group; their cohort was 89.6% diabetic with no subgroup analysis, so this is their opinion, not a finding.

**What this goes beyond (clinical review 2026-09-24, HIGH, accepted as a labelling fix).** The
Box scopes R1 to patients "not expected to fast from carbohydrates >12 h preoperatively", and
that limb explicitly covers "major noncardiac or cardiac surgery, if no T2DM". R7b recommends
intraoperative eDKA monitoring for "major noncardiac surgery >3 h, who fast from carbohydrates
>12 h, if no T2DM (E)", which the >3 h hold used to cover. (Figure 2 panel b, column without
T2DM, prints "No routine monitoring" at that step, so the figure and the Box disagree.) A patient
without diabetes expected to fast 12-24 h is therefore continued beyond what the Box states. The
decision stands (Mark); the clinician view now says so in a flag on every continuing card for a
patient without diabetes, rather than letting "R1" imply SPAQI endorses it. Worked case from the
review: heart failure, no diabetes, empagliflozin plus semaglutide, midnight cutoff, 4 h
hemicolectomy at 13:00 - about 15 h fasting before surgery, about 20 h before food - continues.

**What 24 h is and is not.** It sits below every reported case. It is NOT a measured threshold:
the cases are a handful of reports, and no source compares ketoacidosis risk against heart
failure risk by hours fasted. 24 h was chosen over 30-36 h (Mark's reasoning that the reported
cases' total window was longer than their >24 h preoperative fast) because nothing beyond 24 h
is in the source text. Measured, like 12 h, over the combined pre- and postoperative window,
which is stricter than SPAQI's preoperative phrasing.

**No monitoring or handover line** (Mark): post-operative teams are not expected to recognise a
rising anion gap as eDKA. **Caveat recorded:** SPAQI ref 118 (Hoque et al., Perioper Med 2025,
PMID 40616115; from the abstract, full text not read) - an 82-year-old without diabetes, on
empagliflozin for heart failure, held it 72 h before a planned bowel resection and was found
INTRAOPERATIVELY to have profound metabolic acidosis with normal glucose and raised
beta-hydroxybutyrate. So a 72 h hold did not prevent it, and it surfaced before any
postoperative fast: the preoperative period - bowel preparation and restricted intake - is where
this case points. (Corrected on clinical review; the first draft of this entry said "afterwards"
and blamed the postoperative fast.)

### 13c. Bariatric patients on other classes are not asked the surgery type - ACCEPTED TENSION

The After Surgery renderer reads `ctx.surgeryType` for every oral and insulin class, but
`CONTEXT_NEEDS` asks it only for SGLT2, GLP-1, tirzepatide, DPP-4 and basal insulin. So a
bariatric patient on metformin, a sulfonylurea, meglitinide, TZD, AGI, mealtime or premixed
insulin, or a pump, with no other selected drug that asks it, receives the non-bariatric restart
wording ("start taking these medicines again ... when you are eating and drinking normally")
instead of "your bariatric team decides". Offered: add `surgeryType` to those eight entries.
**Mark: leave as is.** Recorded so it is not raised again as new. (The earlier open item that
the surgery-type question could be removed for basal insulin was WRONG: the basal sheet carries
a bariatric insulin line.)

### 13d. SPAQI R9 post-operative monitoring is not carried out - ACCEPTED DEPARTURE

R9: monitor for eDKA until normal oral intake in every patient with T2DM continuing through
major noncardiac surgery. ABSMC does not. Offered: hold T2DM without HF or CKD for major surgery
(within SPAQI, since R2 is only "consider continuing"), or hold every T2DM patient except for
minor procedures and colonoscopy. **Mark: keep as built.** His reasoning: the combined 12 h
window, plus the >3 h, insulin, A1c >8 and DKA-history holds, leave only low-risk patients who
resume carbohydrate within hours, close to SPAQI's own no-labs group (p.17: ambulatory patients
without PONV who are eating normally). **The gap, stated:** SPAQI's R1 and R2 already assume no
fast over 12 h and still pair continuation with R9, because surgical stress is a risk factor in
its own right (p.9). The recovery that does not go to plan - ileus, PONV, a complication - is
unmonitored in hospital (Snel 2026: median onset day 2). After discharge the sheet covers it
(symptom warnings; stop the drug if unable to eat or keep fluids down).

### 13e. Confirmed as built, no change

- **Insulin use holds at every surgery type.** Its source is SPAQI Figure 2 footnote a -
  "Consider for patient with T2DM who had: prolonged fasting for carbohydrates >12 h, <50 g
  carbohydrate diet, history of insulin use or DKA, or HbA1c >8%" - attached to the
  DAY-OF-SURGERY box "No routine monitoring for eDKA" (and, for minor procedures, the
  intraoperative box). It is a "consider testing" criterion, not a post-operative rule and not a
  hold; section 2c already records the transformation into a hold, for the same reason as today:
  ABSMC does not test. Mark had recalled it as a post-operative ketone rule; corrected from the
  figure.
- **Symptom warnings go to every SGLT2 patient, held or continued.** Mark's written summary said
  "for anyone who continues"; kept as built because the ketosis tendency persists after a hold
  (Garcia; Tallarico, JAMA Surg 2025), and the Hoque case above shows a 72 h hold does not remove it.
- **Ambulatory surgery stays under major noncardiac** (the 2026-08-18 decision), although SPAQI
  groups "low-risk or ambulatory procedures" with minor (pp.9, 17) and Garcia reads SPAQI the same
  way. With 13a and 13b every trigger applies in both categories, so for SGLT2 it mostly changes
  the R-number printed; moving it would change the DPP-4, GLP-1 and Soliqua cards.

### 13f. Verification of the build

A 138,240-scenario grid (diabetes type including unrecorded, surgery type, HF, CKD, risk
factors, both fasting answers, surgery length, ketogenic diet, GLP-1 cutoff, and SGLT2i alone /
with semaglutide / with tirzepatide / with glargine) was run on the committed code and on the
build. Every SGLT2i badge was checked against a rule written from Mark's decisions rather than
from the code: zero disagreements. Every changed scenario fell in the two intended groups, and
no other card's output changed in any scenario. `sweep.js` now sweeps patients without diabetes
(42,120 scenarios) and asserts all three rules; each was mutation-tested after the colonoscopy
decision (restoring the major/cardiac-only scoping: 1,296 failures; removing the non-diabetic
exemption: 3,888; removing the colonoscopy exemption: 1,296).

**Clinical review of the build, 2026-09-24: nothing blocking.** One HIGH (the R1 citation for a
patient without diabetes fasting 12-24 h - fixed as a labelling note, 13b), three MEDIUM (the
colonoscopy cutoff dependence - decided by Mark, 13a; the clinician note paraphrasing the SPAQI
24 h sentence too broadly - now quoted verbatim with its heart-failure scope; the Hoque case
timing - corrected, 13b), two LOW (summary strip; Haziri speculation labelled). The reviewer
also noted Android runs an older SGLT2 model (holds T2DM major and cardiac by default) and has
none of this - out of scope by Mark's standing decision, recorded in the handoff.

**Second clinical review, 2026-09-24, of the fixes: safe to ship.** Confirmed every fix, including a co-treated T2DM colonoscopy patient who answers the 12 h question Yes still holding, and the continuing co-treated colonoscopy sheet being consistent. Three wording items, fixed before commit: the new flag for a patient without diabetes now names every trigger that still applies to them (insulin, A1c >8, DKA history) and carries the R7b clause only for major noncardiac surgery (for cardiac it contradicted the card's own monitoring text); a stale code comment corrected.

## Open items

1. Institutional definition of "minor procedure" vs "major noncardiac". The source defines neither.
2. Whether "3 days" in the source means 72 h or 3 missed doses — unresolvable from the source; 72 h adopted.
3. ~~CT surgery confirmation on the cardiac change.~~ **CLOSED 2026-08-12** - Mark adopted the guideline pathway without the written reply; the NP double-check flag is removed from the app.
4. 2024 AGA/ASA/ASMBS multisociety GLP-1 guidance — cited by the app, **not on disk, not read**.
5. ~~2023 ASA modular fasting update - needed to cite carbohydrate clear liquids correctly.~~
   **CLOSED 2026-08-13** - it was on disk all along and has now been read. See section 5.
6. Three remaining uncommitted 7/26 edits still need clinical sign-off (the morning-of string is now endorsed; the conservative-hold-when-unanswered default, the citation change, and the toggle relabeling are not).
7. Clinician override feature — settled in principle (per-session, resets; patient PDF notes instructions were clinician-reviewed without clinical detail; no audit trail of the original recommendation) but the UI has not been designed or discussed.
