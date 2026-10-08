# SymptomMap — MVP Data Map

**Sources:** `SymptomMap - Production Prototype.dc.html` (approved MVP UX) and `SymptomMap - MVP Functional Inventory.md`.
**Scope:** what information the MVP creates, stores, reads, updates, deletes or processes temporarily. No technologies, vendors or retention periods are chosen here.

**Keys used throughout**

- **Persistence:** **P** persistent · **T** temporary (session / UI only) · **D** derived (computed, never stored as truth)
- **Sensitivity** (§7): **A** authentication / security · **B** basic personal · **C** sensitive health · **D** user-authored reflection · **E** AI / product suggestion (temporary) · **F** product / UI state · **G** generated export
- **Who changes it:** **U** user-editable · **S** system-managed

---

## 1. Data entities

| Entity | Purpose | Persistence |
|---|---|---|
| **User** | The account owner | P |
| **Credential** | Proof of identity for log in | P |
| **MFASetting** | Whether email two-step login is on | P |
| **VerificationCode** | Signup, login challenge and (to be built) reset codes | T (short-lived) |
| **PasswordResetToken** | Account recovery (core requirement, not prototyped) | T (short-lived) |
| **Session** | Signed-in continuity for up to 6 days on a device | P on the server, T on the client |
| **ConsentRecord** | What the person agreed to before using the map | P |
| **Map** | One per user; holds the graph | P |
| **DiagnosisEntry** | A diagnosis the person placed on their map | P |
| **DiagnosisProfile** | Answers about one diagnosis | P |
| **Symptom** | One experience on the map | P |
| **SymptomConnection** | Symptom ↔ diagnosis link | P |
| **SuggestionDecision** | Remembers dismissed (and accepted) suggestions so they aren't offered again | **Open decision** (§10) |
| **AISuggestion / ConnectionProposal** | Product or AI output before the person reviews it | T |
| **ExportJob** | Choices for one export and the resulting file | T for the choices; file storage is an open decision |

---

## 2. Fields and classifications

### 2.1 User / account

| Field | Req. | Persist. | Edit | Sens. | Notes |
|---|---|---|---|---|---|
| name | Required | P | U | B | Used in the header, map title and PDF |
| email | Required | P | S (read-only after signup) | B / A | Sign in and code delivery |
| dateOfBirth | Required | P | S | B | Used for the 18+ gate (see §9) |
| eligibilitySource | Required | P | S | C | How the formal diagnosis was received; on its own it implies the person has a diagnosis |
| accountCreatedAt | Required | P | S | F | — |
| accountState | Required | P | S | F | active / deletion-pending (deletion semantics open) |
| consentVersion + acceptedAt | Required | P | S | F | — |

### 2.2 Authentication / security

| Field | Req. | Persist. | Edit | Sens. |
|---|---|---|---|---|
| password (secure handling, never stored in plain text) | Required | P | U (Change password, reset) | A |
| passwordChangedAt | Required | P | S | A |
| mfaEnabled | Required (default off) | P | U | A |
| mfaMethod = email code | Required when on | P | S | A |
| verificationCode (+ purpose, expiry, attempts) | When issued | T | S | A |
| passwordResetToken (+ expiry, used) | When issued | T | S | A |
| session (+ device, issued, expiry, revoked) | Required while signed in | P (server) | S | A |
| loginAttempt / rate-limit counters | Required for production | T | S | A |

### 2.3 Map

| Field | Req. | Persist. | Notes |
|---|---|---|---|
| owner | Required | P | — |
| map name | — | **D** | Derived from the user's first name, so not stored |
| mapExists | — | **D** | True if it has at least one active diagnosis or symptom |
| createdAt / updatedAt | Required | P | updatedAt also feeds the export date |
| viewport / zoom | — | **Open** | Whether to keep between sessions isn't decided |
| initial row layout | — | D | Only used until the person moves a node |

### 2.4 DiagnosisEntry

| Field | Req. | Persist. | Edit | Sens. | Notes |
|---|---|---|---|---|---|
| id | Required | P | S | F | Instance id, not the terminology id |
| displayLabel | Required | P | U | C | Exactly as typed or selected |
| canonicalKey | Optional | P | S | C | Set **only** when the person picks a recognised autocomplete result |
| matchStatus | Required | P | S | F | selected-recognised / custom |
| colourSlot | Required | P | U | F | Fixed once assigned; changeable by the person |
| status | Required | P | S | F | active / removed |
| order | Required | P | S | F | Order added (drives the initial row) |
| position (x, y) | After first drag | P | U | F | — |
| profileRef | Optional | P | S | F | → DiagnosisProfile |

### 2.5 DiagnosisProfile

| Field | First-time | Edit | Source | Sens. |
|---|---|---|---|---|
| ageAtDiagnosis | **Required** (1–120) | Optional | User | C |
| mostNoticeable (patterns / presentation) | **Required** where the diagnosis has a pattern section | Optional | Chips the person picked, or free text for generic profiles | C |
| triggers.suggested[] | **At least one trigger in total** | Optional | Chips the person picked | C |
| triggers.own[] | (counts toward the above) | Optional | User wording, exact | C / D |
| knownSymptoms | Optional | Optional | User wording | C / D |
| somethingElse (own words) | Not shown | Optional | User wording | C / D |

### 2.6 Symptom

| Field | Req. | Persist. | Edit | Origin class | Sens. |
|---|---|---|---|---|---|
| id | Required | P | S | — | F |
| wording | Required | P | U | User-authored (also when it was accepted from a suggestion, because the person kept it) | C / D |
| origin | Required | P | S | `user` / `suggested` | F |
| whenHow | Optional | P | U | User-authored | D |
| notes | Optional | P | U | User-authored | D |
| position (x, y) | After first drag | P | U | — | F |
| createdAt / editedAt | Useful | P | S | — | F |
| sourceSuggestionId | Optional | **Open** | S | Product-suggested | F |
| AI "possible read" text | — | **T** | — | AI-generated | E |
| placed / unplaced | — | **D** | — | Derived from active connections | F |

### 2.7 Export choices

| Field | Persist. | Sens. |
|---|---|---|
| includeDiagnosisNames (default on) | T | F |
| includeSymptomLabels (default on) | T | F |
| includeSymptomDetails (default off) | T | F |
| format (PDF / PNG) | T | F |
| generated file | **Open** | G (contains C and D) |

---

## 3. Relationships

```
User 1 ── 1 Credential
User 1 ── 1 MFASetting
User 1 ── * Session
User 1 ── * ConsentRecord
User 1 ── 1 Map                (one map per user in MVP)
Map  1 ── * DiagnosisEntry     (active and removed)
DiagnosisEntry 1 ── 0..1 DiagnosisProfile
Map  1 ── * Symptom
Symptom * ── * DiagnosisEntry  via SymptomConnection
```

**SymptomConnection — minimum fields:** `symptomId`, `diagnosisEntryId`, `createdAt`, and optionally `createdVia` (user-chosen / accepted suggestion / Analyse connections).

- **No** weight, percentage, strength or confidence field.
- A shared symptom is **one** Symptom row with several connections, never duplicated symptom records.
- Shared-node segments and line colours are **derived** from the connections and each diagnosis's colour slot.
- Each connection only counts while its DiagnosisEntry is **active**.

---

## 4. Persistent vs temporary data

| Persistent (P) | Temporary (T) | Derived (D) |
|---|---|---|
| User, Credential, MFASetting, ConsentRecord | Form drafts, touched/error flags, password visibility | Map title, "Return to {name}'s map" |
| Session (server side) | Open modal / panel, selected node, menu open | Signed-in-with-map vs no-map header state |
| Map, DiagnosisEntry, DiagnosisProfile | Tutorial step, walkthrough step | Age and the 18+ result |
| Symptom, SymptomConnection, positions | Header compaction, scroll | Anonymised "Diagnosis N" labels |
| SuggestionDecision *(open)* | Verification codes, reset tokens, rate counters | Shared-node segments, sidebar split bars |
| | AI suggestions and connection proposals before review | Placed / unplaced, PDF pagination |
| | Export choices; the export file *(open)* | Initial row layout |

**Session states**

| State | Kind |
|---|---|
| signed out | T (no session) |
| signed in | P on the server, T on the client |
| signed in with no map / with a map | D (from the map's contents) |
| verification pending (signup) | T |
| MFA disabled / enabled | P |
| MFA challenge pending (login) | T, tied to a short-lived code |

---

## 5. AI input / output touchpoints

### 5A. Suggest symptoms

**Inputs that may be needed.** All are flagged sensitive; nothing here decides what is actually sent to a provider.

| Input | Sens. |
|---|---|
| diagnosis displayLabel(s) | C |
| canonicalKey(s) where present | C |
| profile: age, most noticeable, triggers (suggested + own) | C |
| existing symptom wording (to avoid duplicates) | C / D |
| current connections | C |
| dismissed suggestions | F |

**Output:** a set of possible symptoms, each with hedged reasoning and source diagnoses. Class **E**, temporary.

**Becomes persistent only when the person chooses "Add":** a new Symptom (`origin = suggested`) plus one SymptomConnection per source diagnosis.

**"Doesn't fit":** nothing is added to the map. Whether the dismissal is stored is open (§10).

### 5B. Analyse connections

**Inputs that may be needed:**

| Input | Sens. |
|---|---|
| the person's symptom wording, in any language | C / D |
| optional When / how | D |
| active diagnoses (labels and keys) | C |
| profiles, possibly | C |

**Output:** possible diagnosis links, each with a hedged one-liner. Class **E**, temporary.

**Becomes persistent only on "Add with N connections":** the Symptom (`origin = user`) plus the connections the person chose.

### 5C. "A possible read" (symptom detail)

Explanatory AI text. Class **E**: shown, never stored as map truth, and **never exported**.

**Core rule:** nothing produced by AI is product truth until the person adds or keeps it.

---

## 6. Deletion events

| Event | What the UI expects to disappear | Retention still undecided |
|---|---|---|
| **Delete symptom** | The node, its list row, its connections, position, When / how and Notes | Whether the deleted content stays in backups or logs, and for how long |
| **Delete diagnosis** | The node, sidebar row and all of its connections.<br>Suggested symptoms connected **only** to it are removed.<br>Shared symptoms keep their other connections.<br>Symptoms the person wrote lose the connection and stay as "Origin not placed yet". | **Whether the DiagnosisProfile is kept** (the prototype keeps it so a re-add is pre-filled), and how long the removed entry is kept |
| **Remove a connection** (as part of the above) | That one line | — |
| **Discard a new diagnosis** (× on first setup) | The entry created by that Add; nothing is saved | — |
| **Change password** | The old password stops working | Whether other sessions are revoked |
| **Sign out** | The current session | — |
| **Delete account and data** | Everything owned by the user | **Fully open:**<ul><li>scope</li><li>immediate or queued</li><li>backups</li><li>authentication records</li><li>map, profiles, symptoms and notes</li><li>AI-related records</li><li>logs</li><li>generated exports</li></ul> |

---

## 7. Sensitive-data map

| Category | Items |
|---|---|
| **A. Authentication / security** | password, passwordChangedAt, mfaEnabled, mfaMethod, verification codes, reset tokens, sessions, rate-limit counters |
| **B. Basic personal** | name, email, date of birth |
| **C. Sensitive health** | eligibility source, diagnosis labels and canonical keys, every DiagnosisProfile field, symptom wording, connections (which experience relates to which diagnosis) |
| **D. User-authored reflections** | When / how, Notes, own-words triggers, known symptoms, "Something else" |
| **E. AI / product suggestion (temporary)** | suggested symptoms, connection proposals, reasoning text, "A possible read" |
| **F. Product / UI state** | ids, colour slots, order, positions, status flags, timestamps, consent version, export choices, tutorial/UI flags |
| **G. Generated exports** | PDF / PNG files. These contain C, plus D when details are included. |

Positions and colours are F on their own, but they become part of a health record once they're attached to C.

---

## 8. Data-flow diagram (text)

```
USER
 │  name, email, DOB [B] · password [A] · eligibility [C]
 ▼
ACCOUNT ──► MFA on? ──► email code [A] (temporary)
 │
 │  consent [F]
 ▼
MAP (owner, timestamps)
 │
 ├─► DIAGNOSIS ENTRY   displayLabel / canonicalKey [C] · colour, order, position [F]
 │      └─► DIAGNOSIS PROFILE   age, most noticeable, triggers, known symptoms [C/D]
 │
 ├─► SYMPTOMS (user-written)   wording [C/D] · When / how, Notes [D]
 │
 ├─► AI-ASSISTED FEATURE   ◄── diagnoses, profiles, wording, connections [C/D] (input)
 │      └─► suggestions / proposals / reasoning [E] (temporary)
 │
 ├─► USER REVIEW   Add · Doesn't fit · choose connections
 │      └─► accepted → Symptom + SymptomConnection [C] (persistent)
 │          dismissed → (storage open)
 │
 ▼
SAVED MAP   entries · profiles · symptoms · connections · positions
 │
 ▼
EXPORT   options [T] ──► PDF / PNG [G]  (contains C, and D if details are on)
```

Sensitive information enters at:

- **signup:** B, A and C (eligibility);
- **diagnosis entry:** C;
- **profile:** C and D;
- **symptoms:** C and D;
- **AI request:** C and D leave the core store for processing;
- **export:** C and D leave SymptomMap as a file.

---

## 9. Data-minimisation candidates (flagged, nothing removed)

| Field | Question | Possible alternative |
|---|---|---|
| dateOfBirth | The MVP only needs to know the person is 18+. | Store an "age verified 18+" result and the check date instead of the full date of birth. |
| eligibilitySource | Is the exact answer needed after the gate is passed? | Store only "eligible", or keep the answer for audit. |
| DiagnosisProfile after diagnosis removal | Needed only to pre-fill a re-add. | Delete it when the diagnosis is removed, or keep it for a bounded period. |
| removed DiagnosisEntry rows | Needed only if a re-add should feel continuous. | Hard-delete the entry; keep only the profile, if anything. |
| SuggestionDecision (dismissals) | Only prevents repeat suggestions. | Keep it for the session only, or keep the id without content. |
| sourceSuggestionId on symptoms | Not visible in the UI. | Store only `origin = suggested`. |
| viewport / zoom | Convenience only. | Keep it on the device only. |
| Export files | The person downloads them. | Generate without storing on the server. |
| AI request / response logs | Not needed by the UI. | Don't keep them, or keep only content-free metadata. |
| canonicalKey | Needed for profile questions and suggestions. | Keep it; it's already minimal. |

---

## 10. Open decisions

1. **Profile retention after a diagnosis is deleted:** kept, deleted, or kept for a set period, and whether the person is told.
2. **Removed DiagnosisEntry:** keep a "removed" row or delete it outright.
3. **Account deletion semantics:** scope, timing, backups and logs (§6).
4. **Whether to store dismissed and accepted suggestions**, and in what form.
5. **Storing generated exports** (and if so, for how long).
6. **Saving viewport / zoom.**
7. **Full date of birth vs an 18+ result** (§9).
8. **Keeping the full eligibility answer vs just "eligible".**
9. **AI inputs:** which of the §5 inputs may actually leave the core store, and how they're minimised.
10. **AI output retention and logging.**
11. **Revoking other sessions on password change.**

---

## Architecture decisions unlocked by this data map

- **Data model:** the entities, fields and relationships in §1–§3 are complete for the MVP. The connection table has no weight; DiagnosisEntry status and canonical key are defined.
- **Classification-driven protection:** every field has a sensitivity class (A–G). Storage, encryption, access and logging can be designed per class.
- **Persistence boundaries:** what must be stored, what is only temporary, and what is derived is settled; temporary AI output stays separate from the saved map.
- **AI boundary:** inputs and outputs are listed per feature, so data minimisation and provider terms can be assessed before a provider is chosen.
- **Deletion design:** every deletion event and its open retention questions are listed (§6), ready for privacy review.
- **Minimisation review:** ten specific candidates (§9) are ready for the product owner to accept or reject.
- **Export path:** source data and the generated file are separated; only the question of storing files is left.
