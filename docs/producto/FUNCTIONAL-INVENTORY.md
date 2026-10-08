# SymptomMap — MVP Functional Implementation Inventory

**Status:** UX frozen. `SymptomMap - Production Prototype.dc.html` is the approved MVP UX source of truth.
**Scope:** only behaviour that exists in that prototype today. No technology choices and no new features. Anything not needed to fix a bug is post-MVP.
**Classification key** (used in §14): **P** persistent user data · **T** temporary UI state · **D** derived data · **AI** AI-generated suggestion.

---

## 1. User account

| Feature | Required behaviour | Data / state | Dependencies | Edge cases |
|---|---|---|---|---|
| Create account (step 1 of 3) | Name, email, date of birth, password and confirmation. Continue is disabled until all are valid, and every blocking reason shows inline after the person interacts with the field. | name, email, dob (day/month/year), password hash | Eligibility (step 2), MFA (step 3) | No pre-filled values. Errors stay hidden until the field is touched. |
| Name | Required and trimmed. | `User.name` | Header label ("Return to {first name}'s map"), map title, PDF title | The first word of the name is used as the first name. |
| Email | Format check only, which does not prove the mailbox exists. Message: "Enter a valid email address." / "Enter your email address." | `User.email` | Login, MFA code delivery | Rejects `ana`, `ana@`, `@x.com`, `ana@x`, spaces, `..`. **Read-only after signup** in the MVP. |
| Date of birth | Day and Year are digit-only text fields (no number spinners, so scrolling can't change them). Month is a select. The age check runs only once a complete, real calendar date exists. Under 18 → age gate. | `User.dateOfBirth` | Age gate | Rejects 31 Feb, day 0, future dates, years that aren't 4 digits. Has no default value. |
| Password | Live checklist: 8+ characters · a number · upper and lower case. Each rule starts neutral (never red). Show/hide toggle. The confirmation must match. | password (hash only) | Change password | The checklist goes back to unmet if the person deletes characters. |
| Eligibility (step 2 of 3) | One radio answer: how the formal diagnosis was received. Nothing is selected by default, and Continue stays disabled until an answer is chosen. "No formal diagnosis" → its own gate. | `User.eligibilitySource` | Gates | Single choice only. Both gates offer only "Back to home". |
| Two-step login (step 3 of 3) | Optional. Choose "Set up" (6-digit email code) or "Skip for now". | `MFAConfiguration.enabled` | Email delivery | Starts **off**, and turns on only after a successful code verification. |
| Log in | Email (format) and password (required, no strength rules). Log in is disabled until both are present. MFA on → code challenge → map. MFA off → map. | — | Session, MFA | Invalid credentials are a separate server response from format validation. |
| Forgot password / reset | **Core production requirement; flow still to be built.** Request a reset with the account email → secure, time-limited reset mechanism → set a new password with the same checklist → the old password stops working → return to a safe login state. | reset token (time-limited, single use) | Email delivery | The prototype link goes nowhere. Detailed UI is not designed yet. |
| Send a new code | **Core production requirement.** Generates and emails a new code, invalidates the previous one, is rate-limited, and gives clear success or error feedback. | verification code (expiry, attempts) | Email delivery | The prototype action does nothing. |
| Log out | Settings → Sign out ends the session and returns to the public landing page with the signed-out header. | Session | Header state | The map data stays stored and comes back on the next login. |
| Session persistence | Up to 6 days on the same device. Closing the browser does not log the person out. No inactivity timeout or countdown. A new session requires email + password, then the code if MFA is on. | Session | — | (Agreed MVP rule; not visible in the UI.) |
| Change password | Current password, then new password with the same checklist, then confirmation. "Save new password" is disabled until all three are valid. Confirmation message: "Password updated." | password hash | Session | Wrong current password: "The current password doesn't look right." Mismatch: "The passwords don't match yet." |
| Account name editing | Pre-filled with the current name. Save is disabled until the name changes. Empty or over-60-character names are rejected. Saves inline with a success message. | `User.name` | Header, map title, PDF | — |
| Delete account and data | Destructive and confirmed in place ("Keep my map" / "Delete everything"). | everything owned by the user | §12 | This is the entry point only. What actually happens on deletion is still to be decided (§D). |

---

## 2. User session states

| State | Website header | Public pages | Map access | Settings | Return to map |
|---|---|---|---|---|---|
| Signed out | Logo · Log in · Create your map · Menu | Public versions | None | None | Not shown |
| Account creation (signup → MFA) | Logo · Home · Log in · Menu (no "Create your map") | — | None | None | Not shown |
| Signed in, no map | Logo · Settings · **Create your map** · Menu (no Log in) | Same header on Home, How it works, Why, Research, Our story | "Create your map" opens the empty map | Yes | Not shown; once a map exists, Create your map is replaced by Return to {name}'s map |
| Signed in, map in progress | Logo · Settings · **Return to {name}'s map** · Menu | Same header on every public page | Existing map | Yes | Shown on every public page; reopens the same map with its state intact |
| MFA off | — | — | Login → map | Shown as off with "Turn on" | — |
| MFA on | — | — | Login → code → map | Shown as on with a quiet "Turn off" behind a confirmation | — |
| MFA challenge required | Login header | — | Blocked until a valid 6-digit code | — | — |

- **Sticky header:** stays visible and shrinks from 88px to 68px on scroll without shifting the layout.
- **One internal component:** the header lives inside the prototype rather than in a separate file.

---

## 3. Map

| Field | Notes |
|---|---|
| owner | One map per user in the MVP. |
| name | Derived from the account name ("{first name}'s map"); not edited separately. |
| diagnoses | DiagnosisEntry list. Active entries only appear on the map. |
| symptoms | Symptom list, each with its origin. |
| connections | SymptomConnection list (symptom ↔ diagnosis). |
| node positions | x/y for each diagnosis and symptom, saved after every drag. |
| initial layout | New diagnoses start in a horizontal row, in the order they were added. The row is never re-arranged once the person moves something. |
| zoom | Workspace level; whether it's saved between sessions is still open (§D). |
| suggestion review state | Accepted and dismissed suggestion IDs, so dismissed ones don't come back. |
| timestamps | created/updated (useful for the export date and sync). |

Workspace rules:
- **Fits the screen:** fixed viewport; the left sidebar and right panel scroll internally.
- **Drag area:** almost the whole canvas, but nodes are kept out from under fixed controls (legend, zoom).
- **Lines:** connections redraw while dragging and are never clipped at the canvas edge.

---

## 4. Diagnosis lifecycle

| Step | Behaviour |
|---|---|
| Add | Type-first modal. Autocomplete starts at 3+ characters and covers English, Spanish, abbreviations and alternative wording. There's no default list. Own wording is always allowed. A colour is pre-selected (the next free one on the ring) and can be changed. "Add to my map" is disabled until text is entered. |
| Duplicate prevention | Checks **active** entries only. Adding one that's already on the map closes the modal and selects the existing node; no profile opens. |
| Profile (first time) | Opens straight away. Required fields are listed in §5. There's no Skip. Closing with × asks "Discard this diagnosis? Your diagnosis hasn't been added yet." → Keep editing / Discard diagnosis. Discard removes only the entry created by that Add. |
| Save | The entry becomes active on the map and in the sidebar. |
| Edit | Reopens the profile. Fields are optional here; Save and Skip are both available; "Something else?" (own words) is shown. |
| Delete | Asks for confirmation, then marks the entry as removed. Cleanup rules are in §7. |
| Re-add | A new active entry. The saved **profile** is pre-filled; old **connections** are not restored. Suggest symptoms offers fresh suggestions. |
| Colour | Stored on the entry. Keeps its slot on the ring and doesn't change when other diagnoses are added. |
| Display wording | Exactly what the person typed or picked. |
| Internal term | Optional canonical key, used only to choose profile questions and suggestions. |

---

## 5. Diagnosis profile

- **Required on first setup** (Save profile is disabled until all are done):
  - **Age at diagnosis:** digits only, whole number 1–120. Error: "Use a number between 1 and 120".
  - **Frequent triggers:** at least one trigger, either a suggested chip or one in the person's own words. Typing a trigger and pressing Enter or a comma turns it into a chip, kept in their exact wording and removable like the others. SymptomMap doesn't classify it.
  - **Most noticeable:** at least one answer in the diagnosis's pattern section (chips, or the free-text field for diagnoses without set options). If a diagnosis has no pattern section, this requirement doesn't apply.
- **Optional:**
  - Symptoms you already know you have (free text).
  - "Something else?" in own words (Edit only).
- **Helper line:** "This helps SymptomMap tailor suggestions more closely to your experience."
- **Selection types:**
  - Patterns that can coexist are multi-select.
  - A true mutually exclusive presentation (ADHD's main presentation) is single-select.
  - Nothing is ever pre-selected.
- **Profiles available:**
  - Specialised: ADHD, Autism, BPD, C-PTSD, Generalised anxiety, Anorexia nervosa, Bipolar disorder.
  - Everything else, including unrecognised wording, gets a generic fallback: own-words patterns, age, neutral triggers, known symptoms. Nothing diagnosis-specific is invented.
- **Display vs internal:** the profile title shows the person's wording, while the question set is chosen by the internal key.
- **Modal layout:** stays within the viewport; the header and footer stay put while the body scrolls.

---

## 6. Symptoms

| Field | Notes |
|---|---|
| wording | Exactly as written or accepted, in any language. Never rewritten. |
| When / how it shows up | Free text (multi-line). |
| Notes | Free text (multi-line). |
| origin | `user` (Add a symptom) or `suggested` (accepted from Suggest symptoms). |
| connections | 0..n active diagnoses. 0 = "Origin not placed yet". |
| suggestion decisions | Add or Doesn't fit, one at a time; nothing is ever added in bulk. |
| edit | Rename and edit both text fields from the detail panel. |
| delete | Confirmed. Removes the node and its connections. |

Add a symptom (modal):
- **Fields:** "What you experience" (3-line textarea) and "When or how does this usually show up?" (5-line textarea, optional). Both grow as the person types, up to a maximum height.
- **Actions:** **Analyse connections** or **Add without analysing**.
- **Never asked:** which diagnosis the symptom belongs to.
- **Duplicates:** wording that matches an existing symptom merges into it rather than creating a second node.

---

## 7. Graph relationships

- **Shared symptoms:** one symptom node can connect to many diagnoses, and a shared symptom is always a single node.
- **One line per diagnosis:** each connection uses that diagnosis's colour. Shared nodes split their ring evenly.
- **Not allowed:** percentages, weighting, line thickness for importance, confidence scores, or "dominant diagnosis" wording.
- **Dragging:** changes position only, never relationships.

What happens to symptoms when a diagnosis is deleted:

| Symptom | Result |
|---|---|
| Suggested, connected **only** to the deleted diagnosis | Removed (node, list entry, panels, position, notes). |
| Shared with another active diagnosis | Kept; only that one connection is removed. |
| Written by the person, last connection removed | Kept as "Origin not placed yet"; the wording and notes are preserved. |

Re-adding the diagnosis restores no old connections.

---

## 8. Terminology

- **Display:** the label always shows the person's exact wording.
- **Internal matching:** a canonical key is used only to find profile questions and suggestions, with accents and capitals ignored. Currently covered:
  - TDAH / Trastorno por déficit de atención e hiperactividad → ADHD
  - Autismo / TEA / Trastorno del espectro autista / ASD → Autism
  - Ansiedad generalizada / TAG / GAD → Generalised anxiety
  - TLP / BPD / Trastorno límite de la personalidad → Borderline
  - TEPT complejo → C-PTSD
  - Anorexia nerviosa → Anorexia nervosa
  - Trastorno bipolar → Bipolar disorder
- **Explicit selection can normalise; ambiguous free text is never guessed.** If the person **selects** a recognised result in autocomplete (for example "BPD — Borderline"), its canonical key is stored and the label stays as they chose. A typed acronym that wasn't selected (for example "BPD") is kept as their wording with **no** canonical key.
  - *Prototype gap to fix in production:* the prototype still matches typed "BPD" by name. Production must store the canonical key only when the person selects a result.
- **Ambiguous or unknown terms:** not guessed; kept as custom wording and given the generic profile. Suggestions show an honest empty state.
- **Mixed languages:** maps mixing Spanish and English are supported.
- **Not diagnosis:** normalisation never infers, renames or adds a diagnosis.

---

## 9. AI-assisted features

### A. Suggest symptoms

| | |
|---|---|
| Input | Active diagnoses (internal key + display wording) and saved profile answers. |
| Map context | Existing symptoms (to avoid duplicates) and earlier dismissals. |
| Output | Single-diagnosis and shared possibilities, each with hedged reasoning and source tags shown before adding. |
| Review | Each suggestion is added or dismissed individually; nothing is added in bulk or automatically. |
| Not allowed | Diagnosing, scores or percentages, adding to the map, inferring a new diagnosis, claiming causes. |
| Fallback | No tailored data → "No tailored suggestions are available for this term yet." / "You can still add something in your own words." + Add a symptom. A panel never opens blank. |
| MVP note | **Prototype behaviour only.** The built-in suggestion list is not production clinical logic or production data. Production must define the controlled knowledge source, the AI's role, terminology matching, multilingual behaviour, safety boundaries, and the fallback when there isn't enough evidence. |

### B. Analyse connections

| | |
|---|---|
| Input | The person's symptom wording (any language) and the optional When / how text. |
| Map context | Active diagnoses on the map. |
| Output | A list of possible diagnosis connections, each with a hedged one-liner. |
| Review | "Possible connections" modal: the person toggles each connection individually, then adds with the chosen connections or goes Back. There's no "Add unplaced" here; "Add without analysing" lives in the previous step. |
| Not allowed | Choosing for the person, adding silently, proposing diagnoses that aren't on the map. |
| Fallback | If nothing fits, the person goes back and adds the symptom on its own. |

---

## 10. Export

- **One flow:** choose what to include, choose the format, preview, then confirm. Message: "Nothing is exported until you confirm the preview."
- **What to include:**

| Option | Default | Data needed |
|---|---|---|
| Diagnosis names | On (off → "Diagnosis 1, 2, 3", keeping colours) | Entry labels + colours |
| Symptom labels | On (off → nodes without text) | Symptom wording |
| Symptom details | Off | When / how + Notes for each symptom |

- **Formats:**
  - **PDF:** page 1 is the map, a "How to read this map" legend and a not-diagnosis footer. Pages 2+ (only if details are included) hold the symptom details, three per page, with no entry split across pages. AI interpretations are never exported.
  - **PNG:** the map and a compact legend. If details were chosen, it shows "Symptom details are easier to include in PDF."
- **Every export needs:** positions, connections, the name and a timestamp.
- **Open:** final file generation and the PNG preview aren't designed.

---

## 11. Settings

| Section | Controls |
|---|---|
| Account | Name (Change → sub-page). Email is read-only: "Used to sign in and receive security codes." |
| Security | Password (Change → sub-page). Two-step login (Manage → off/on states, code to turn on, confirmation to turn off). |
| Privacy & your data | What SymptomMap stores · how information is used · AI & your data · your controls (export, review consent, access/questions, privacy policy, privacy contact) · delete account and data. |
| Navigation | Side tabs move between sections (Security scrolls to its group). "Back to your map" is always available. The header's Settings pill is hidden while inside Settings. |

---

## 12. Privacy / sensitive-data touchpoints

All of these involve information about the person's mental health or identity:

1. **Signup:** name, email, date of birth, password and the eligibility answer.
2. **Authentication:** login credentials, MFA codes and session tokens.
3. **Diagnosis storage:** diagnosis names, which are health information.
4. **Profile:** age at diagnosis, triggers, patterns and known symptoms.
5. **Symptoms:** the person's own wording, When / how and Notes.
6. **Relationships and positions:** how symptoms connect to diagnoses.
7. **AI requests:** Suggest symptoms and Analyse connections send map context and the person's wording.
8. **Export:** creates a copy outside SymptomMap, including notes if the person chooses.
9. **Account and data deletion.**
10. **Consent record:** what the person agreed to before using the map.

---

## 13. Conceptual entities (only what the prototype supports)

- **User**: name, email, dateOfBirth, eligibilitySource, createdAt.
- **Credential**: password hash, changedAt.
- **MFAConfiguration**: enabled, method = email code.
- **Session**: user, device, issuedAt, expiresAt (6 days).
- **ConsentRecord**: user, version, acceptedAt.
- **Map**: owner, viewport/zoom, createdAt, updatedAt.
- **DiagnosisEntry**: map, displayLabel, canonicalKey (optional), colourSlot, position, status (active / removed), order.
- **DiagnosisProfile**: entry, presentation/patterns, age, triggers (suggested + own words), knownSymptoms, ownWords. In the prototype it is kept after the entry is removed so it can pre-fill a re-add. **This means health information is kept after removal from the active map; how long is an open privacy decision.**
- **VerificationCode**: purpose (signup / login / reset), hash, expiresAt, attempts.
- **PasswordResetToken**: user, hash, expiresAt, usedAt.
- **Symptom**: map, wording, whenHow, notes, origin (user / suggested), position.
- **SymptomConnection**: symptom ↔ diagnosis entry. No weight.
- **SuggestionDecision**: suggestion, accepted/dismissed, timestamp.
- **ExportRequest** (transient): included options, format.

---

## 14. State vs persistent data

| Information | Class |
|---|---|
| Account fields, password hash, MFA setting, consent | P |
| Diagnosis entries, profiles, symptoms, connections, positions | P |
| Suggestion accept/dismiss decisions | P |
| Session | P (server) / T (client) |
| Form drafts, touched/error flags, password visibility, open modal/panel, selected node, tutorial step, menu open, header compaction | T |
| Export choices before confirming | T |
| Map title, "Return to {name}'s map", anonymised "Diagnosis N" labels, shared-node segments, sidebar split bars, PDF pagination, initial row layout, age (18+) | D |
| Suggested symptoms, connection proposals and their reasoning text, before the person accepts | AI |
| An accepted suggestion | becomes P (origin = suggested) |

---

# Classification

## A. Approved MVP product behaviour (in the prototype)

1. Account creation with validation, the eligibility gate and the age gate.
2. Log in with format validation; optional email MFA with a login challenge; sign out.
3. Header states: signed out · account creation · signed in, no map · signed in with a map.
4. Change password; account name edit; email read-only.
5. Diagnosis lifecycle, duplicate prevention and profile reuse.
6. First-time required profile: age, at least one trigger (suggested or own words), most noticeable.
7. Symptoms from both origins; Analyse connections; Suggest symptoms, reviewed one at a time.
8. Graph rules, dragging, saved positions, and deletion cleanup (§7).
9. Terminology display vs canonical key; English, Spanish and mixed user input.
10. Export with include options, anonymisation and a PDF preview.
11. Settings: Account, Security, Privacy & your data.
12. The "Delete account and data" entry point.

## B. Core production capabilities not fully prototyped

- Real email delivery for signup verification, MFA and password reset.
- Secure code generation, expiry, invalidation on resend, rate limiting and attempt limits. **The prototype code `482913` is prototype logic only and must never be used in production.**
- Password reset (request → time-limited token → new password → old one invalidated → safe login).
- A working "Send a new code" with success and error feedback.
- A secure authentication implementation: password hashing, 6-day sessions, session revocation on sign out and password change.
- Storing the canonical key only on explicit autocomplete selection (fixes the prototype's BPD gap).
- Real suggestion and analysis knowledge, replacing the built-in prototype list.
- Final PDF/PNG file generation and the PNG preview.
- Consent recording with versioning.

## C. Architecture / privacy decisions still open

- **Account deletion:** what is deleted; immediate or queued; backups and retention; authentication records; map, profiles, symptoms and notes; AI-related records; logs; any generated exports.
- **Profile retention after a diagnosis is removed:** the prototype keeps it so a re-add can be pre-filled, which means health information persists after removal. How long it is kept, and whether the person is told, needs a decision.
- AI processing location, retention, training use and data residency.
- The controlled clinical knowledge source and safety boundaries for suggestions and analysis.
- Whether zoom/viewport is saved between sessions.
- How export files are generated and delivered, and whether anything is kept on the server.

## D. True post-MVP features

- Changing email.
- Translating the product interface into Spanish (localisation). Spanish user input is already MVP.
- Shared or collaborative maps, public links, comments.
- Social sharing; formats other than PDF/PNG.
- Weighted or proportional relationships.
- Multiple maps per user.
- Mobile layouts.
- A diagnosis browser or category directory.
- Inferring diagnoses from symptoms (excluded permanently).

---

# Ready for Architecture

**Authentication**
- How passwords are hashed and how sessions are stored, issued and revoked (6-day rule).
- Verification-code and reset-token design: entropy, expiry, single use, invalidation on resend.
- Rate limits and attempt limits for login, codes and reset.
- Email delivery provider and sending domain.

**Data model**
- Confirm the entities in §13, including DiagnosisEntry status, profile reuse, symptom origin and unweighted connections.
- One map per user; how positions and the viewport are stored.
- Storing the canonical key only on explicit selection.

**Privacy / retention**
- Account deletion: scope, timing and backups.
- How long a removed diagnosis's profile is kept.
- Consent record and versioning.
- Data residency and compliance requirements (Australian and Victorian health-information rules), to be verified rather than assumed.

**AI / clinical knowledge**
- The controlled knowledge source for suggestions and the boundaries on what AI may do.
- What context is sent to AI and how it is minimised.
- Provider retention and training terms.
- Multilingual matching.
- The fallback when evidence is insufficient.

**Hosting / infrastructure**
- Region and hosting model for health data.
- Environments (development, staging, production).
- Backups and restore.

**Export generation**
- Generating files on the device vs on the server.
- Whether exports are stored at all.
- PDF pagination rules (§10) and PNG rendering.

**Security / monitoring**
- Encryption in transit and at rest (to be verified, not claimed).
- Audit logging that avoids storing health content.
- Error monitoring without sensitive payloads.
- Abuse protection on authentication endpoints.
