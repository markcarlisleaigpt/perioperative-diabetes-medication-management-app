# SGLT2i Preoperative Management — Implementation Spec

**Status:** Ready for implementation
**Target:** Web app only
**Owner:** Mark Carlisle, MD
**Primary source:** Oprea et al., perioperative SGLT2i management algorithm (Figure 2, panels a–d)

---

## 1. Scope

This module generates **preoperative, before–day-of-surgery** medication instructions only.

### In scope
The top row of each Oprea panel: the "Preoperative before DOS" instruction, issued days in advance, delivered to the patient as a written instruction.

### Explicitly out of scope
Do not implement, and do not surface to the patient:

- **Preoperative DOS** row (including R5 "postpone procedure") — this is a day-of decision made in pre-op holding by the assessing clinician. The app never runs at that moment.
- **Intraoperative** row — eDKA monitoring, prophylactic dextrose/insulin, intraoperative glucose targets.
- **Postoperative** row — including R9 monitoring and R10 resumption guidance.
- **Emergency surgery** — the app addresses scheduled procedures only.

> **Note on R10 (resume once normal oral intake):** patient-facing, but belongs on a discharge instruction, not a preoperative one. Out of scope for this module. Do not merge it into the pre-op PDF.

---

## 2. Inputs

### Required

| Field | Type | Values |
|---|---|---|
| `procedureCategory` | enum | `minor` \| `majorNoncardiac` \| `veryLowCarbDiet` \| `cardiac` |
| `hasT2DM` | bool | — |
| `hasHfOrCkd` | bool | heart failure **or** chronic kidney disease |
| `prolongedPostopFastingAnticipated` | bool | — |
| `sglt2iAgent` | enum | `ertugliflozin` \| `other` (drives 3-day vs 4-day hold) |
| `surgeryDate` | date | used to compute the stop date |

### Optional — risk-factor override inputs

| Field | Type | Values |
|---|---|---|
| `hba1c` | double? | null = not supplied |
| `insulinRegimen` | enum? | `none` \| `basalOnly` \| `basalBolusOrPrandial` \| null |

**Both are optional by design.** If left blank, no override fires and base panel logic stands. The clinician chooses whether to supply them and can see the recommendation change when they do.

### Already captured by the app

The following are existing inputs — do not rebuild them, wire into what exists:

- Specific SGLT2i agent the patient takes (drives the 3-day vs 4-day hold)
- Heart failure and CKD status
- Anticipated prolonged postoperative fasting

### Procedure category determination

`veryLowCarbDiet` is triggered by a preoperative diet of **<50 g carbohydrate/day** (i.e. ketogenic), commonly a pre-bariatric diet. This is a diet-based category, not a surgery-type category — it takes precedence over `minor` / `majorNoncardiac` when present.

**Diet start date:** the panel c T2DM instruction is anchored to the start of the diet. Scout whether a diet start date is already captured. If it is, use it. If not, anchor to the surgery date and include a written caution in the patient instruction that the medication must be stopped when the low-carbohydrate diet begins — do not add a new intake field in this pass.

---

## 3. Base recommendation logic

Derived from the "Preoperative before DOS" row of each panel.

### Panel a — Minor surgery or procedures
Applies with or without T2DM.

- **Continue SGLT2i (R1)**
- Minimize preoperative NPO time for carbohydrates
- Recommend 50–100 g carbohydrates/day

### Panel b — Major noncardiac surgery

**With T2DM:**
- Continue if HF or CKD **(R1)**
- Consider continuing if no HF or CKD **(R2)**
- **Stop for 3 days (4 days for ertugliflozin) if prolonged postoperative fasting anticipated (R4)**
- Minimize preoperative NPO time for carbohydrates; 50–100 g carbohydrates/day

**Without T2DM:**
- Continue **(R1)**
- Consider stopping for 3 days (4 for ertugliflozin) if prolonged postoperative fasting anticipated **(R4)**
- Minimize preoperative NPO time for carbohydrates; >50 g carbohydrates/day

### Panel c — Prolonged very low carbohydrate diet (e.g. bariatric)

**With T2DM:**
- **Stop SGLT2i at the start of the very low carbohydrate diet (R3)**

**Without T2DM:**
- **Stop SGLT2i for 3 days (4 days for ertugliflozin) (R3)**

> **Implementation emphasis:** the T2DM instruction here is anchored to the diet start date, not the surgery date. This is the single most error-prone instruction in the set and the one where the app has the most leverage — a patient who stops correctly here never reaches the R5 postpone scenario. Compute and display an explicit calendar date. Give this instruction visual prominence in the PDF.

### Panel d — Cardiac surgery

**With T2DM:**
- Stop for 3 days (4 for ertugliflozin) if no HF or CKD **(R3)**
- Continue if HF or CKD **(R1)**
- Minimize preoperative NPO time for carbohydrates

**Without T2DM:**
- Continue **(R1)**
- Minimize NPO time

---

## 4. Risk-factor override

> ### ⚠ INSTITUTIONAL EXTENSION — NOT FROM ORPEA ET AL.
> This rule is an institutional decision and has no R-number in the source publication. Label it as such in code comments, in the clinician-facing view, and in any documentation distributed to residents or the preoperative clinic. When the source guideline is updated, this is the logic to re-examine first.

### Rule

If **either** of the following is true:

- `insulinRegimen` is `basalOnly` or `basalBolusOrPrandial`
- `hba1c` > 8.0

then **override the base recommendation to HOLD** — 3 days, or 4 days for ertugliflozin — **regardless of HF/CKD status**.

### Rationale (for code comment and clinician view)

Both criteria are established risk factors for perioperative SGLT2i-associated ketoacidosis. The source algorithm's response to elevated risk is intensified **eDKA monitoring**, which is a day-of-surgery and postoperative resource this application cannot provision from a preoperative instruction. Holding is the risk-mitigating action the application *can* guarantee. The clinician, who knows whether monitoring is available, may override.

### Interaction with R1 (continue if HF or CKD)

The override applies **even when HF or CKD is present**. When it does, the clinician view must state explicitly that the override is acting against an R1 "continue" recommendation, so the reviewing clinician knows what is being traded. Do not suppress the hold; do not hide the conflict.

Supporting reasoning, for the clinician note: SGLT2i cardiorenal benefit accrues over months to years, so a 3-day perioperative interruption is not a meaningful loss of disease-modifying therapy, whereas a missed euglycemic DKA is a catastrophic and characteristically under-recognized event.

### Applies within this module only

This is one drug-class module inside a larger perioperative medication app. Confine changes to the SGLT2i pathway; do not alter shared intake, PDF, or routing code in ways that affect other medication classes without flagging it first.

### HbA1c staleness

The source provides no guidance on how recent an HbA1c must be. **Do not implement an automatic staleness cutoff.** The field is optional and clinician-entered; the clinician decides whether the value they have is current enough to use. Consider displaying the value the clinician entered back to them in the clinician view for confirmation.

---

## 5. Outputs

Two distinct artifacts from one evaluation. They must not be merged.

### 5.1 Patient-facing PDF

**One unambiguous instruction.** Either continue, or hold with explicit calendar dates.

Requirements:

- No risk-factor discussion. No mention of HbA1c, insulin, eDKA, or monitoring.
- No conditionals. The patient cannot evaluate whether monitoring is available; do not ask them to.
- Explicit dates ("Stop taking [drug] on [date]"), never relative intervals ("stop 3 days before").
- Name the specific medication the patient takes, not the drug class.
- Legibility per the PDF requirements: large base type, high contrast, generous line spacing, plain-language headings, minimal visual subdivision. Assume an older reader.

### 5.2 Clinician-facing view

Displays:

1. **Base recommendation** with its R-number(s) from the source algorithm
2. **Applied override**, if any, clearly marked as an institutional extension
3. **Named trigger** — which specific risk factor fired (insulin regimen, HbA1c value, or both)
4. **Conflict flag** when the override acts against an R1 continue in an HF/CKD patient
5. **Alternative note:** perioperative eDKA monitoring is an alternative to holding where monitoring capability exists
6. **Override control** — returns to the base recommendation, per the clinician override feature

---

## 6. Clinician override behavior

Per the clinician-override feature. Open questions to settle before implementation:

- [ ] Does an override persist, or is it per-session?
- [ ] Does the patient PDF indicate the instruction was clinician-modified?
- [ ] Is the original algorithmic recommendation retained anywhere in the record?

The patient PDF must render identically in structure whether or not an override was applied — a single clear instruction either way.

---

## 7. Implementation notes

- **Date arithmetic:** ertugliflozin is 4 days; all other SGLT2i are 3 days. Do not hardcode 3.
- **Panel c date anchor:** for T2DM patients, anchor to diet start date, not surgery date. This requires collecting the diet start date when `veryLowCarbDiet` is selected.
- **Verification:** all encoded logic in sections 3 and 4 must be checked against the source figure by `clinical-reviewer` before release.
- **Nothing reaches the chart.** No output of this module is filed to the medical record or routed to the day-of surgical team. The clinician view is read on screen; the patient PDF goes to the patient. Do not build integration, export, or persistence assuming otherwise.
- **Traceability:** every output string that derives from the source algorithm should carry its R-number in code. Every output that does not should be marked as an institutional extension.

---

## 8. Deferred / not in this pass

- Postoperative resumption instructions (R10) as a separate discharge artifact
- Clinician-facing perioperative eDKA monitoring flag routed to the day-of team or the chart
- Any audit trail of overridden recommendations
- A dedicated diet start date field, if not already present
- Automated medication list ingestion
- Native mobile build target
