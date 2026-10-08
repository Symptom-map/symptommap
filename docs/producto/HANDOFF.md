# SymptomMap — Current Product & Design Handoff

Persistent project reference. Written at the end of the "UI mockups" session (17 Sep 2026).
Status labels used throughout: **APPROVED** · **NEEDS REFINEMENT** · **PENDING DECISION** · **DO NOT CHANGE**.

---

## 1. Product definition and positioning

**APPROVED.** SymptomMap is a self-understanding tool for adults living with more than one
diagnosed mental health condition. A person adds the diagnoses they **already have** from a
qualified health professional, places them on a map, adds the symptoms and experiences they
recognise **in their own words**, and sees where those symptoms overlap.

- It is **not diagnosis and not treatment**. It sits next to someone's care, never in place of it.
- Positioning line in use: *"Not a self-diagnosis tool. A self-understanding tool."*
- Three named uses, in this order: understand yourself → explain your experience to someone you
  trust → bring it into therapy as visual support.
- Audience: **adults aged 18+ living with multiple confirmed mental health diagnoses.** The UX
  should particularly accommodate neurodivergent users, people experiencing high cognitive load,
  and people who find explaining overlapping diagnoses difficult. Neurodivergence is an important
  accessibility and design consideration — **not** an eligibility requirement and not an exclusive
  target audience. *Clarity that doesn't overwhelm, warmth that doesn't infantilise.*
- Independent project, funded by the **Victoria University SSAF Grant**.
- Research figures currently used on the landing page (exploratory SymptomMap research with people
  living with multiple confirmed diagnoses): **9/10** saw their diagnoses as connected; **7/10**
  found their experience difficult to explain; **8/10** would use a visual tool to explain it to
  someone else; **8/10** would use it during a difficult moment. Sample is **N = 10 eligible
  participants — confirmed, not pending.** **NEEDS REFINEMENT** — only the exact wording of the
  methodology/source note on the landing page.

**Language — PENDING DECISION.** The final production language strategy has **not** been formally
closed. Spanish (Spain/LatAm neutral, informal *tú*, never *usted*) is frequently used in project
discussion and in the earlier prototype; the current mockups were explicitly requested in **English**.
Documentation and token names are English. Neither is yet the definitive production language — do
not state one as settled. Also pending: whether a Spanish set of the same screens is produced for
testing.

---

## 2. Approved user flow

**APPROVED — DO NOT CHANGE the order.**

```
landing
  → sign up (name, email, date of birth, password)         [step 1 of 3]
      └─ under 18 → age gate (dead end, supportive exit)
  → eligibility check (who diagnosed you)                   [step 2 of 3]
      └─ "no formal diagnosis" → diagnosis gate (dead end, supportive exit)
  → protect your account / MFA offer                        [step 3 of 3]
      └─ set up → email code verification
      └─ skip for now → straight to onboarding
  → onboarding walkthrough (3 steps)
  → disclaimer + consent (single checkbox)
  → empty map (first run)
  → map workspace
```

Name and email are collected **before** onboarding. Onboarding is a **product walkthrough**, not a
marketing sequence. Both gates are genuine dead ends for this version — a single `Back to home`
action plus a supportive pointer to real-world support, and never a workaround into the product.

---

## 3. Design system decisions currently approved

Source of truth for **visual execution**: the bound **SymptomMap Design System**
(`_ds/symptommap-design-system-dfef9e76-4f03-48c2-85c7-e8878d801432/`). Load its bundle and compose
its components — never restyle raw HTML to imitate them.

**Two classes of rule live in this section — read the labels.**

- **Approved product decisions** (DO NOT CHANGE): the separation of the four colour sets, the
  primary action colour, the typography direction (two typefaces, sentence case, no monospace), the
  brand/logo direction, and the accessibility floor.
- **Current Design System specification** — authoritative for building today, but implementation
  detail rather than a permanent product decision: exact scale values, every individual shadow
  value, fixed panel widths, the icon-set count, exact microinteraction and animation restrictions.
  Follow them; flag them for review rather than treating them as immutable.

### Colour — four closed sets that never borrow from each other

**APPROVED product decision · DO NOT CHANGE** the set separation and the primary action colour.
The individual step values are the current Design System specification.

| Set | Values |
| --- | --- |
| Base | Page + map canvas warm cream `#FAF7F0`; every surface white `#FFFFFF` (a white surface always has elevation); charcoal `#1A1A1A` is **ink only, never a surface**; body warm slate `#57534E`; meta `#6B6560`; grey `#A6A6A6` is fills and borders but **never text** |
| Cyan scale — all interaction | `050 #EAF8FB` · `100 #CAF0F8` · `200 #ADE8F4` · `300 #90E0EF` · **`400 #48CAE4` primary action** · `500 #00B4D8` hover / pressed / focus |
| Purple brand accent | `#9D50BB` — wordmark gradient end, text links, small highlights. Never a fill, never a focus halo |
| State | success `#16A34A` · error `#DC2626` · warning `#D97706`, with darker inks for text. Only on small rectangular affordances |
| Diagnosis colour | Ten light hues on a fixed ring, each with `base`/`tint`/`ink`. Assigned **per map**. Cyan `#2DCBEC` is excluded from the ring and reserved for AI |

- Cyan fills **always** carry a charcoal `#1A1A1A` label. White on cyan **fails contrast and is
  forbidden**.
- `#38B6FF` is gone. No deep blue, no navy, no arbitrary blue anywhere.
- State colour = small rectangular affordances. Diagnosis colour = nodes, chips, edges, source tags
  (light, soft, round). Neither borrows the other's shape or placement.

### Typography

**APPROVED product decision · DO NOT CHANGE** the typography direction: two typefaces, sentence
case, no monospace. The exact scale values below are the current Design System specification.

- **Outfit** — brand, headings, major section titles.
- **Plus Jakarta Sans** — body, UI labels, buttons, inputs, sidebar items, captions, metadata, tags,
  supporting text.
- Scale: display 56/58 at −3% tracking · H1 40/46 at −2% · H2 28/35 · H3 Jakarta 600 19/27 · body
  16.5/27 · body-small 15.5/24 · support 14.5/23 · label Jakarta 500 14.5 · button Jakarta 600 15 ·
  field label 13.5 · metadata 13.
- **Sentence case everywhere**, natural tracking. No Title Case, no ALL CAPS in body copy, no
  uppercase + wide-tracking convention ("Mis diagnósticos", not "MIS DIAGNÓSTICOS").
- Running text is emphasised with **weight, never colour**.
- AI suggestion copy is Jakarta **italic 15.5px** — it reads as something offered, not stated.
- **Monospace is out of the product UI.** Poppins, Calibri/Carlito and JetBrains Mono are not part
  of the interface. `--sm-font-mono` survives for technical documentation only.

### Shape, spacing, elevation, interaction

**Current Design System specification** — authoritative for building today; the individual values
below (shadow values, fixed panel widths, transition and microinteraction rules) are implementation
detail, not independently approved permanent product rules.

- Radius grows with the container: 12 inputs · 14 chips + small buttons · 16 buttons · 18 cards ·
  22 panels/modals/sheets · 999 pills/tags/counters · 50% nodes (perfect circles, always).
- Line weight: 1px hairlines · **1.25px map connections** · 1.5px node rings and inputs · 2px focus.
- One 4-point scale (4 → 96). Card padding 24–40 · panel gutters 24 · section rhythm 96–104 ·
  content max 1280. **Sidebar 250px · side panel 290px · header 58px.** Hit targets never below 44px.
- Three warm-charcoal shadow steps (`01 rest`, `02 card`, `03 modal`); cream never gets a grey
  shadow. Cards are shadow + radius — **never an outline, never a coloured left border**.
- Buttons: **46px min-height**, 22–24px padding. A label grows the button (or goes full width)
  before it ever wraps.
- Hover changes the control's own colour and **never adds a ring**: primary `#48CAE4` → `#00B4D8`;
  secondary and inputs take the `#EAF8FB` wash with a warmer border; ghost takes a soft charcoal
  wash. Primary hover shadow is `0 6px 16px -8px` — not a lift, not a scale.
- Pressed = Cyan 500 (Cyan 100 on secondary). Disabled **recedes** (pale neutral fill, grey label,
  **no border**) rather than outlining itself.
- **Selected is a tonal fill plus a small check — never a ring, never a heavy border.**
- Focus belongs to the component: Cyan 500 state + `inset 0 0 0 1.5px rgba(26,26,26,.55)`. No
  floating halo, and **purple is never the focus ring**.
- Transitions ≈160ms ease on colour, border, shadow. Nothing bounces, nothing slides, and
  **map edges never animate into place**.

### Brand / logo

**APPROVED product decision · DO NOT CHANGE.** `assets/brand/logo-mark.svg` (full) and `logo-mark-flat.svg`
(one-colour), via `components/brand/Logo.jsx` — the **only approved logo reference**.

- The mark is a small map: one person's diagnoses, connected.
- **No circular container. Ever.** No coloured disc, badge or ring around it; on busy grounds use a
  neutral plate. (The blue circular container that was added at one point is **rejected and
  removed**.)
- Clear space = 25% of the mark's diameter. Minimum 24px full, 16px flat.
- Wordmark: Outfit 700 at −2.5% tracking with the cyan→purple gradient (`#48CAE4` → `#9D50BB`).
  In-app lockup splits it: "Symptom" charcoal, "Map" gradient.
- Never re-space, re-weight or outline the wordmark. Never put the gradient on the mark or on UI.
- The cyan→purple wordmark gradient is **the only gradient in the product**.
- `assets/brand/avatar-previous.png` is historical reference only.

### Accessibility

**APPROVED product decision.** WCAG 2.1 AA. Charcoal on cream 16.1:1 · charcoal on Cyan 400 8.6:1 · on Cyan 500
6.4:1 · purple on cream 4.57:1 · warm slate on cream 7.1:1. Every diagnosis ink ≥5.3:1 on cream.
Colour never carries meaning alone: **every node keeps its label at every zoom level**, and shared
symptoms are segmented as well as listing one dot per source in the sidebar. Deuteranopia check is
part of reviewing any new diagnosis-colour work.

---

## 4. Usability test build (Friday session) — FROZEN

**Status (26 Sep 2026):** the test build is frozen as the tested artefact. All refinement now happens
in `SymptomMap - Production Prototype.dc.html`, created from the test build (which was the master plus
only approved refinements) with test-only content removed. The pre-test master stays for history.
Open decisions carried into production: Login A vs B, Landing A vs B, the placeholder suggestion
content (needs a reviewed production source), and the fixed prototype verification code.


`SymptomMap - Usability Test Prototype.dc.html` is a **separate copy** of the master prototype, made
for the moderated test of one task: *"Create an account and build your first SymptomMap."*
The master (`SymptomMap Prototype.dc.html`) is untouched and stays the design source of truth.

What differs from the master, and only this:

- **No prototype chrome.** The screen tab bar is gone and the onboarding A/B/C layout switcher is
  removed — onboarding is locked to approved layout A. Nothing was added to help the participant
  pass: no instructions, arrows or test tooltips.
- **The map starts genuinely empty and is built by the participant.** Diagnoses, symptoms and AI
  suggestions are no longer fixed sample data. Adding a diagnosis puts a real node on the map (up to
  five), positions re-lay-out as the map grows, and each add pre-selects a ring colour not already in
  use. Autocomplete covers ADHD, Autism, Generalised anxiety, BPD — Borderline and C-PTSD (plus the
  wider list), 3+ characters only, with the participant's own wording always allowed.
- **Suggestions follow the map.** The Suggest symptoms panel is rebuilt from whichever diagnoses were
  added (two per diagnosis, plus one genuinely shared suggestion once two exist), and
  *Analyse connections* offers exactly those diagnoses — so the participant is never asked to know
  where a symptom comes from.
- **Shared symptoms arise naturally.** Picking two diagnoses in the AI review, or accepting the
  shared suggestion, produces one symptom node with one connection per diagnosis at equal visual
  status — unweighted, per §8.
- **Onboarding is A then C, in sequence** (test build). A (pre-map walkthrough) teaches the model
  with a real product surface per step: add-diagnosis modal → sidebar with first symptoms + Suggest /
  Add a symptom → the full connected map. C starts after consent on the real empty map as a 4-step,
  action-driven coach (Add diagnosis → Suggest symptoms → Add a symptom → select a node → Finish);
  each step advances on the real action, steps 2–3 can be skipped, and "Skip tutorial" never removes
  anything the participant made.
- Everything past the critical path (Settings, privacy, export, PDF/PNG) is still reachable but was
  not prepared for the test.

Path a participant can complete by clicking, verified end to end: landing → create account →
eligibility → MFA or skip → onboarding → consent → empty map → add diagnosis → add a second →
add symptoms → review suggested connections → populated map with visible overlap → explore
(select, detail panel, legend, zoom).

---

## 5. Website structure and landing page

Built at 1440 inside `SymptomMap Prototype.dc.html`. The marketing site is **five destinations**, not
one long landing page. Screens: `landing`, `how`, `why`, `research`, `about`.

**APPROVED — shared site chrome (`SiteHeader.dc.html`)**
- Header is **Logo · `Log in` · `Create your map` · `Menu ☰`** — no category nav bar, no utility strip.
  The strip lines ("Independent project / Funded by the Victoria University SSAF Grant" and "Not a
  diagnosis. Not treatment.") were **removed from the header**; the grant line lives in the footer
  and at the foot of the menu panel, the disclaimer line in the footer.
- `Menu` opens a full-width white panel under the header listing the destinations as large Outfit
  titles with one-line notes (How it works · Why SymptomMap · Research · Our story); the active one
  is purple, hover nudges right. Selecting one navigates and closes the panel. The primary CTA stays
  visible at all times.
- Every page ends with the same footer: logo · grant line · "Making comorbidity visible · Not a
  diagnosis. Not treatment."
- The header lives in its own child Design Component and is imported by each page — edit it there.

**APPROVED — Landing (short, visual, low scroll)**
1. Hero — headline, one-line subhead, `Create your map` + `Log in`, and the positioning line
   **"Not a self-diagnosis tool. A self-understanding tool."** set in emphasis weight with a cyan
   dot. The map card is white with a single cream frame, the graph at .84 and **`MapStatus` reading
   "Ana's map" inside the frame** — the "3 diagnoses · 10 symptoms · 3 shared" count is **removed**
   (too dense for a hero).
2. The questions, on a soft-green wash, **as a person speaking**: a large decorative opening quote
   mark, the headline question, then the inner monologue as **one quoted block** (curly quotes around
   all four lines, line breaks, a 2px Cyan 300 rule at the left, no bullets and no dashes — the
   em-dash version was rejected). Then a short purple rule, the statement *"SymptomMap turns those
   questions into something you can actually see."* and a `Create your map` CTA — **never a card.**
3. **Build your map in three simple steps** — **stays above the research content**, and stays at
   **three** steps: *Add your confirmed diagnoses · Add what you experience · Explore the
   connections*. Three cream frames with a hairline (not white shadowed cards) holding **real product
   surfaces**: the diagnosis list panel, the symptom list with colour-coded source dots, and the
   two-hub / shared-node graph. Labels are a plain purple icon + `Step 01/02/03`.
   **Removed for good:** "You start with what you already know. The map grows from there."
4. **What the map actually gives you** — open on cream: four icon + value lines on the left, and on
   the right a **layered composition of three real panels** (symptom list, symptom detail with source
   tags and 70/30 weighting, AI suggestion panel with Add / Doesn't fit) overlapping at different
   depths with the three elevation steps. This is the product-proof section; keep real UI here.
5. **Three ways people use their map** — on white: an **organic blob-framed photo** with a Cyan 100
   backing shape (never a perfect square) beside *Understand yourself · Explain your experience ·
   Bring it into therapy*, each with a plain icon and a coloured top rule (cyan / purple / green),
   plus `Why SymptomMap`.
6. Research preview — varied rhythm rather than four equal stats: one large 9/10 card, three
   rule-topped stats at unequal spans and offsets, and the "Where this comes from" block with
   `Read the research` in the last cell.
7. Founder — the short quote and one line of origin, `Read our story`, beside a **founder card**:
   blob-framed portrait over a Cyan 100 shape, **Ana Pieters · Founder · LinkedIn · Cyber Security
   Certificate**. Warm and credible; the fuller story stays on `about`.
8. Closing CTA on Cyan 050 + badges, then the footer.

### 4a. "Where this comes from" block — APPROVED, understated

A hairline rule, the label **Where this comes from**, then three plain meta lines, nothing else:
SymptomMap user research / Adults living with more than one confirmed mental health diagnosis /
Survey responses, reviewed with input from a psychologist. **Do not turn it into a card, a badge row
or a citation style.** It appears under the research content it supports on both `landing` and
`research`.

### 4b. Internal pages — APPROVED structure

- **How it works** — six numbered cards (create account · confirm eligibility · protect account ·
  short walkthrough · build your map · explore the connections), then a *"What you end up with"*
  panel showing the real map with a three-item legend, then a CTA band.
- **Why SymptomMap** — the questions quote (green wash) · *"Overlap is the part nobody explains"*
  with the two-hub graph · *"What the map actually gives you"*: three **real surfaces** (diagnosis
  list, colour-coded symptom list, symptom detail panel with source tags and weighting) in a
  **staggered, unequal row** · a two-column open pair (self-understanding / support for the
  conversation) with coloured top rules · a full-height photo band. **No illustration cards** — the
  `line-head` / `line-calendar` artwork was removed from this page; product UI is the imagery.
- **Research** — the four stats, then *"What people told us"* as **four asymmetric insight blocks**
  on a 12-column grid (two on tinted grounds, two open with a 2px coloured top rule, unequal spans
  and vertical offsets, a coloured marker dot + "Finding 0n" per block) — **not a divider-line list
  and not four identical cards** — then the "Where this comes from" block.
- **Our story** — portrait slot + the founder quote and the fuller story (four short paragraphs),
  then three columns: independent / SSAF-funded · reviewed with professionals · yours to control.

### 4c. Editorial composition rules — APPROVED

The site must not read as a generated SaaS page.
- **A card needs a reason to be a card.** Reserve modal/card styling for auth, gates and forms; the
  marketing pages use open sections on cream, tinted full-bleed bands, and hairline-framed product
  panels instead.
- Vary composition section to section: alternate open and contained, change content width by
  purpose, let hierarchy come from scale, placement and whitespace. No repeating three-column
  feature grids, no identical padding/radius/shadow across sections, no icon-in-circle feature chips.
- Symmetry only where the content is genuinely parallel (the three steps, the four stats).
- **One illustration language.** Product UI is the primary visual material; photography only where a
  human moment adds meaning (the `image-slot` placeholders), always in **organic blob frames with a
  Cyan 100 backing shape** — no perfect squares. Do not mix line-art illustration styles into the
  website sections.
- **Icons: the Design System's own 16-glyph set only** (24px grid, 1.6 stroke, round caps — the
  Iconoir register the brief asks for). Plain icons beside or above their label; **no icon-in-circle
  chips**, no second icon family, no emoji.
- Klenico is a **quality and rhythm reference only** — organic image framing, restrained accents,
  calm medical-wellbeing tone. Never copy its layouts, colours or branding.
- `joinviolet.com` is a second **quality and rhythm reference only** — editorial pacing, natural
  spacing, varied section layouts, product storytelling, confident whitespace, few cards. Never copy
  its layouts, colours, typography, shapes, illustrations or section structure.
- **Soft green supporting accent (NEW — ratify into the Design System).** `--sm-accent-green:#6fbf95`
  and `--sm-accent-green-wash:#eff7f2`, defined locally in the prototype, used only as an occasional
  section wash and marker dot alongside cyan and purple. It is **not** a diagnosis colour and **not**
  a state colour; diagnosis hues still never leave the map.

**Colour discipline on the site.** Cyan scale for action and quiet grounds, purple for eyebrows,
numbers, the active nav item and small accent dots, cream/white alternation for rhythm. The colour
"life" on the page comes from **real map graphics** (diagnosis ring hues) — diagnosis colour is never
used as page decoration, and state colours never appear as accents.

**PENDING DECISION**
- Real photography for the three `image-slot` placeholders (`landing-people`, `why-people`,
  `about-founder`, plus `landing-founder`) and a real founder portrait.
- Whether the four research stats should be cut to three.
- Whether the footer carries real legal/contact links.

---

## 5. Authentication / eligibility / MFA

All at 1440 in `SymptomMap Prototype.dc.html`. **APPROVED behaviour:**

**Sign up — step 1 of 3.** Name · email · date of birth (day / month select / year) · password ·
confirm password. Password rules are shown as a live three-item list (≥8 characters · includes a
number · includes upper and lower case) using success ink for met rules and meta grey for unmet —
**not** red, and not a strength meter. Supporting line under DOB: *"SymptomMap is currently designed
for adults aged 18 and over."* Progress is three 20×3px bars + "Step 1 of 3".

**Age gate (under 18).** Reached when DOB implies under 18. Info icon in a Cyan 050 disc, headline
*"SymptomMap is currently for adults aged 18 and over."*, explanation that this version was designed
and researched with adults, then a divider and a support line pointing to a trusted adult, family
doctor or youth helpline. **Single action: `Back to home`.** `Back to registration` and `Return to
log in` are **removed** — they read as a way back in. Keep the supportive explanatory copy.
**DO NOT CHANGE**: this is a dead end. No bypass into account creation, no "continue anyway".

**Eligibility — step 2 of 3.** Single question: *"How did you receive your formal mental health
diagnosis?"* Options, in this order: Psychiatrist · Psychologist · GP / Medical doctor · Other
qualified health professional · **I have not received a formal diagnosis from a qualified health
professional**.

**Eligibility screen — APPROVED against the user's reference capture. DO NOT RESTYLE.**
560px white card on cream at 56px padding, logo above it; progress bars + "Step 2 of 3"; 33px
headline; the question in body; **five full-width stacked rounded rows** (radius 14, white, 1px
hairline, 17/20px padding, 12px apart) with the circular selector on the left; the selected row is a
**soft Cyan 050 fill with no visible border** and the filled cyan radio; full-width `Continue`
directly below, and **nothing after it**. Layout, spacing and proportion changes need approval.

**Diagnosis gate.** Reached only by the last option. Same composition as the age gate: *"A formal
diagnosis is needed to build a map."*, plus short supportive guidance that someone who suspects a
mental health condition can speak with a qualified health professional. **Single action: `Back to
home`.** `Back to the check` and `Read more about SymptomMap` are **removed**.
**DO NOT CHANGE**: also a real dead end — no workaround into the product.

**Protect your account — step 3 of 3. APPROVED.** Reason first: *"Your map can hold sensitive mental
health information. A second step when you log in keeps it yours."* Primary `Set up two-step log in`,
ghost `Skip for now`, footnote *"You can turn this on later in Settings."*
**MFA is offered, never forced. Skipping must not degrade the product or nag later** — MFA is **not**
universally mandatory once someone has chosen to skip setup. **Email verification code is the current
MVP MFA design.**

**PENDING DECISION — MFA.** The long-term relationship between *optional MFA setup during
registration* and *MFA challenges on future authenticated sessions* is still unresolved.
Authenticator app and SMS are **not** part of the current MVP design and must not be introduced
unless explicitly approved.

**Email code verification.** Six-cell `CodeInput`, masked address (`a••••@example.com`), resend
link. In the prototype `482913` passes and any other complete code shows the error *"That code
doesn't look right. Try the newest one we sent."* Error copy says what a valid answer looks like and
never blames.

**Log in.** Email + password, `Forgot your password?` right-aligned, primary full-width `Log in`,
`Create one` link.

**Gate icon treatment — APPROVED against the user's reference capture. DO NOT REPLACE.**
Both gates (and any similar informational gate) use the same accent: a **76px pale Cyan 050 disc**
with a centred 28px line `alert` icon in AI ink, a small **purple dot at the upper right** and a
slightly larger **Cyan 400 dot at the lower left**, both just outside the disc. Soft, friendly,
never a warning triangle and never red.

**Gate / auth card spacing — APPROVED.** Gated and auth cards are deliberately airy: gate cards
540px wide at 60px padding, MFA 560px at 56/60px, code verification 520px at 56px, with ~32px under
the icon disc, ~20px under the headline, ~40px under the body and a 44px gap before the divider.
When in doubt go up a step — cramped text blocks are a defect on these screens.

**Session behaviour — APPROVED for MVP.**
- An authenticated session may remain active for **up to 6 days on the same device**.
- Closing the browser or tab does **not** automatically log the user out.
- **No short inactivity timeout** (nothing in the 30–60 minute range).
- **No stressful countdowns**, and no "your session is about to expire" warnings.
- **Manual logout invalidates the session immediately.**
- When a new authenticated session is required, the path is:
  **email + password → email verification code, if MFA is configured → My Map.**
- Security-triggered reauthentication may also invalidate or recheck the session.
- Sensitive account actions may require reauthentication even while the normal session remains valid.

**PENDING DECISION**
- The MFA questions listed above (registration-time setup vs future session challenges).
- Password reset screens are not designed.

---

## 6. Onboarding

**APPROVED — DO NOT CHANGE** that it is a product walkthrough, the three-step mental model
(diagnoses → symptoms and experience → connections), that it leads to disclaimer/consent, or that it
must not become generic icon cards. **Structure and meaning are approved. Copy may receive minor
editorial refinement during the final UI polish pass, as long as the meaning and sequence remain
unchanged.** Three steps, in this order:

1. **Add your confirmed diagnoses** — "You can build your map gradually — you don't need to add
   everything at once."
2. **Add what you experience** — "Add symptoms and experiences in your own words." Plus: "If you
   want help getting started, you can ask SymptomMap for suggestions and choose which ones to keep."
3. **Explore how things connect** — "As your map grows, you can see where symptoms and experiences
   overlap."

It is a **product walkthrough**. **DO NOT** turn it back into marketing slides, icon-led tutorial
cards, or the "three cards of orientation, one of honesty" sequence — those are explicitly rejected
(see §10). Visual execution may be refined; structure, sequence and meaning may not.

**Layout — APPROVED. Decision closed: Layout A.**

- **A — split copy + building map. APPROVED as the official 3-step onboarding experience.** Copy
  left, live map right; the map **builds progressively across the three screens** (step 1 diagnoses
  only → step 2 single-source symptoms → step 3 shared symptoms appear). Sequence stays
  diagnoses → symptoms/experience → connections.
- **B — three-step rail. Not selected for the MVP.** Preserved only as an archived design
  exploration. **Not part of the approved product flow** — do not build from it.
- **C — coached first run. Not rejected, repurposed.** No longer an onboarding layout; it is now a
  separate first-run interaction pattern inside My Map (see below).

### First-run guidance in My Map — APPROVED as a separate pattern

After **Onboarding → Disclaimer / Consent → Empty My Map**, contextual coach marks / spotlight
guidance may use the Layout C concept to introduce the real workspace.

- Its purpose is to teach **specific actions inside the real map**: where to add the first diagnosis,
  where to add symptoms, how the map changes, how to select a node or a connection.
- It must be **lightweight and skippable**.
- **Do not repeat the explanatory content of onboarding.**

The distinction, and it matters: **Onboarding A teaches the mental model. First-run guidance C
teaches the interface.**

Also **APPROVED**: onboarding is skippable (`Skip the walkthrough`) and leads to consent, never
straight to the map.

**Consent screen — APPROVED.** Two short paragraphs, single checkbox *"I've read this and I
understand"*, primary `Go to my map` disabled until checked, footnote that the full disclaimer lives
in Settings. **DO NOT CHANGE**: two short paragraphs maximum, friendly not cautionary — no warning
icons, no red, no "attention". *"A disclaimer nobody finishes reading protects nobody."*

---

## 7. Map — product logic that must not be altered

**DO NOT CHANGE.** The prototype (`Symptom-map/symptommaproject`, branch `main`, `src/js/graph.js`,
`state.js`, `data.js`, `src/js/ui/*.js`, `src/js/ai.js`) and the attached map/prototype screenshots
are the source of truth for **product** logic. The design system is the source of truth for
**visual execution**. Same product logic, better interface execution.

- **Three-panel IA**: 250px left sidebar (diagnoses + symptoms) · map canvas · 290–340px right panel
  (detail, or the AI review panel) · 58px app header.
- **Node kinds**: diagnosis hub (large circle, tint fill, 1.5px ring) · symptom of one diagnosis
  (small single-colour dot) · **shared symptom (segmented — see §8)** · **floating symptom** with no
  diagnosis attached (dashed grey, sits on its own).
- **One edge per source diagnosis.** A symptom shared by three diagnoses draws three edges. Edges
  are **curved** — `Connection` takes a signed `curve` in px. **Flattening a relationship edge is a
  product decision requiring approval, not a styling call.**
- Diagnosis hubs are joined to each other by a **neutral chain**, not a diagnosis-coloured edge.
- **Edge weight following segment weight is PENDING DECISION, not approved** — see §8. The current
  prototype draws it that way as an exploration only.
- **Every node keeps its label at every zoom level.** Labels must not be hidden behind the legend or
  collide with each other at any zoom step (verified at 0.6 / 1.0 / 1.3 in the current prototype).
- Diagnoses are **placed by hand** by the person; the map is theirs.
- **Diagnosis colour is assigned per map, not per diagnosis**, so one person's nodes sit as far
  apart as possible. Rule 01 even spread on create (`slot(i) = round(i × 10 / n)`) · Rule 02 widest
  gap on add, and **nothing already on a map ever recolours** · Rule 03 past ten go to a darker tier
  and render label-first · Rule 04 diagnosis colour **never leaves the map**. Guaranteed separation:
  2 → 160°, 3 → 96°, 4 → 64°, 5 → 58°, 6–10 → 32°.
- **Do not simplify the map into a generic network graph.** It is a specific structure with specific
  node kinds, curved per-source edges and segmented shared nodes.
- Map controls: zoom in / zoom out (prototype range 0.6–1.3), fullscreen. A **legend** ("How to read
  the map") is dismissible and explains: diagnosis · symptom of one · shared (one arc per diagnosis)
  · origin not placed yet.

**Current mockup scenario — APPROVED for this round:** 3 diagnoses (ADHD slot 1 · BPD Borderline
slot 4 · C-PTSD slot 8), 10 symptoms, 3 shared, 1 floating — the "smaller, clearer overlap" case
requested for these mockups. The denser 5-diagnosis scenario from the screenshots is still valid
product behaviour and may be needed later.

---

## 8. Shared symptom node behaviour

**APPROVED · DO NOT CHANGE.** This is a **visual product rule** and holds in every mockup even
though the weighting logic is not implemented in the prototype yet.

- One diagnosis → a small **single-colour** symptom dot.
- Two or more → a **segmented node**: one arc per connected diagnosis, in that diagnosis's ring
  colour, around a white core. **Never a generic multicolour ring. Never flattened to one colour.**
- No relative weighting known → divide the circle equally (50/50, 33/33/33).
- One diagnosis more prominent → its arc takes proportionally more (70/30, 50/25/25).
- `SymptomNode` takes `segments`: ring positions (`[1, 4]`) or weighted segments
  (`[{slot:1,weight:7},{slot:4,weight:3}]`).
- Mockups pass **plausible** weights rather than waiting for real data.
- The sidebar lists **one dot per source** for the same symptom, so the relationship survives
  without colour vision.
- In the current prototype: "Shame spirals fast" 50/50 (BPD + C-PTSD) · "Sleep falls apart" 70/30
  (ADHD + C-PTSD) · "Starting anything feels impossible" 50/25/25 (ADHD + BPD + C-PTSD).

**Proportional prominence is communicated by segment size inside the shared symptom node — that is
the approved carrier.**

**PENDING DECISION**
- **Reinforcing prominence with edge thickness or opacity.** "Edge weight follows segment weight" is
  **not approved**; it may prove useful later, but for now it is an exploration in the prototype only.
- Where the weight comes from.
- Whether users set it manually.
- Whether AI may suggest it.
- Whether users can edit it.

Until those are settled, weights in mockups are illustrative only.

---

## 9. AI suggestions — user-controlled behaviour

**APPROVED · DO NOT CHANGE.**

- Suggestions are **user-initiated**: the person presses `Suggest symptoms`. Nothing is generated
  unprompted.
- **AI never writes into the map.** Suggestions sit in a pending review panel until the person adds
  them. Copy states it: *"Nothing is on your map until you add it."*
- Each suggestion card carries: the experience in plain words, a hedged explanation, its source
  diagnosis tags, and two actions — **`Add`** and **`Doesn't fit`**.
- **Rejection is a valid answer about someone's own life.** One tap, no consequence, no follow-up
  nudge, and the copy never argues back: *"If one doesn't fit, drop it — no follow-up."*
- Suggested items use **AI cyan `#2DCBEC`** (and AI ink `#006C88` for icon/text), which is excluded
  from the diagnosis ring precisely so AI never looks like a diagnosis.
- AI-related copy is always marked with the `AI` badge (`tone="ai"`) and set in Jakarta italic.

**Copy rules for AI suggestions — DO NOT CHANGE:**
- Name the experience, not the label — the diagnosis name is already on the chip.
- Always hedged, never asserted ("puede que", "a veces", "suele" / "may", "sometimes", "often").
  No verb that diagnoses.
- **No severity, no scores, no percentages, no confidence numbers.**
- Never invalidating.
- Plain words only: if a term would appear in a clinical report and not in a conversation, rewrite
  it.

---

## 10. Explicitly rejected — and why

**DO NOT reintroduce any of these.**

| Rejected | Why |
| --- | --- |
| Marketing slides or generic tutorial cards as onboarding | Onboarding is an approved **product walkthrough**; tutorial cards teach the interface instead of building the person's map |
| `TutorialCard`, and the "three cards of orientation, one of honesty" sequence | Not SymptomMap patterns. Replaced by the structurally neutral `StepCard`; do not read an icon-card onboarding system into it |
| `ui_kits/app/onboarding.html` + `Onboarding.jsx` | **Superseded exploratory sketch, not the approved flow.** Reference only — do not build screens from it |
| Blue circular container around the logo mark | The mark carries no container; the ring fought the map nodes |
| Previous avatar (`avatar-previous.png`) in product use | Its grey gradient dissolved on white and its blue ring fought the nodes |
| `#38B6FF`, deep blue, navy, any arbitrary blue | The cyan scale is the single source of truth for action colour |
| White text on cyan | Fails contrast. Charcoal labels only |
| Monospace chrome (sidebar labels, counts, tags, metadata, progress) | Removed in revision 2 — clinical and cold |
| Poppins, Calibri/Carlito, JetBrains Mono | Not part of the interface |
| Uppercase + wide tracking as a convention | Sentence case, natural tracking |
| Simplifying the map into a generic network graph | Destroys node kinds, per-source curved edges and overlap behaviour |
| Flattening a shared symptom to one colour, or a generic multicolour ring | Segmented arcs are the approved product rule |
| Merging visual ideas from all uploaded screens indiscriminately | Most recent approved screens are the direction; older screens explain flow and behaviour only |
| A colour picker for diagnosis colour | Colour is assigned per map by the algorithm |
| Emoji, anywhere | Not in the product, not in marketing built from this system |
| Dark theme | By design: nothing dark is ever a surface in SymptomMap |

---

## 11. Visual preferences and patterns to avoid

**Mixed status — read the classification in §3.** The character rules here are approved product
decisions: no gradient backgrounds, no dark overlays, no coloured left-border accents, illustration
is single-line charcoal artwork used sparingly, an icon never carries meaning without a label, emoji
never. The specific numbers and microinteraction restrictions (stroke weights, icon sizes, the
16-glyph count, scrim values, animation prohibitions) are the **current Design System
specification** — follow them, and flag them for review rather than treating them as immutable.

- No gradient backgrounds, textures or patterns. Flat warm cream and white only. The wordmark
  gradient is the single exception.
- No dark overlays. Transparency and blur appear **only** in the modal scrim — warm cream at 72%,
  2px blur.
- Cards: shadow + radius. **No outline, no coloured left-border accent.**
- One state carrier per state — "excessive outlines are a smell".
- Hover never adds a ring; selected never uses a ring or heavy border.
- Illustration is **continuous single-line artwork in charcoal ink**, stroke 2, 96–140px, **one per
  view**, at empty states and section openers — never decorative, never a pattern. Available:
  `line-head.png` (mind), `line-brain.png` (diagnosis), `line-calendar.png` (time).
- Icons: the 16-glyph 24px-grid set, stroke 1.6, round caps. One colour per icon; **an icon never
  carries meaning without a label**. 26px in panels, 18px in buttons, 12–14px in rows. Never filled,
  3D or shadowed; never a diagnosis colour on a UI control.
- Nothing bounces or slides; map edges never animate into place.
- Placeholders are examples, never instructions ("e.g. 16").
- When in doubt on spacing, go up a step.

---

## 12. Files and assets — what is a source of truth

### This project
| Path | Status |
| --- | --- |
| `SiteHeader.dc.html` | Shared site header + SSAF utility strip, imported by every website page |
| `SymptomMap Prototype.dc.html` | **The current deliverable.** Click-through prototype, 1440, all screens. Working file |
| `assets/line-brain.png` | Copied from the design system for the empty-map state |
| `_ds/symptommap-design-system-dfef9e76-.../` | **SOURCE OF TRUTH — visual execution.** Bound design system; load `_ds_bundle.js` and compose its components |
| `uploads/Landing page review v1.2 (4)/SymptomMap Landing v2.dc.html` | **SOURCE OF TRUTH — approved landing structure and copy** (most recent approved screen) |
| `uploads/Landing page review v1.2 (4)/SymptomMap Auth Screens v2.dc.html` | **SOURCE OF TRUTH — approved auth flow structure and copy** (most recent approved screen) |
| `uploads/Landing page review v1.2 (4)/uploads/Diagnosis color assignment system.pdf` | Reference for the colour-assignment rules |
| `uploads/Landing page review v1.2 (4)/uploads/Screenshot 2026-09-14 234801.png` | Prototype screenshot — map behaviour reference |
| `uploads/Landing page review v1.2 (4)/uploads/stitch_symptommap_landing_page/` | Older "Warm Clinical Map" landing exploration — **flow/behaviour reference only, not visual direction** |

### Design system repo (`/projects/dfef9e76-4f03-48c2-85c7-e8878d801432/`)
- `tokens/*.css`, `styles/base.css`, `styles/components.css` — tokens and text styles.
- `components/**` — 22 components, each with a `.d.ts` props contract and a `.prompt.md` usage note.
- `components/map/diagnosisColor.js` — `RING`, `dxVars`, `assignSlots`, `addSlot`, `ringDistance`,
  `minSeparation`. **The assignment algorithm. Do not reimplement.**
- `ui_kits/app/` — click-through recreation of the **map workspace**: reliable. Its
  `onboarding.html` / `Onboarding.jsx` are **superseded** (see §10).
- `assets/brand/logo-mark.svg`, `logo-mark-flat.svg` — **the only approved logo reference.**

### Product code
- GitHub `Symptom-map/symptommaproject`, branch `main` — **SOURCE OF TRUTH for product logic**
  (map structure, state shape, diagnosis registry, three-panel IA, AI prompts, pending-suggestion
  flow). Its own CSS (`src/styles/*`) is **not** the visual source — that is what the design system
  replaces. **Not currently connected to this project**; connecting it would let future work match
  real structure and state.

---

## 13. Final vs provisional

**FINAL (APPROVED / DO NOT CHANGE)**
- Product definition, positioning and the not-diagnosis boundary.
- The full flow order (§2), including both gates as dead ends.
- Design-system **product decisions**: the four-set colour separation, the cyan-400 primary, the
  two-typeface + sentence-case direction, no monospace, the brand/logo direction, the accessibility
  floor. (Exact scales, shadow values, fixed panel widths, icon count and microinteraction rules are
  the **current Design System specification** — authoritative today, not immutable. See §3.)
- Map product logic (§7), diagnosis-colour assignment, per-source curved edges, labels at every zoom.
- Segmented shared-symptom rule, with segment size as the carrier of prominence (§8).
- AI behaviour and copy rules (§9).
- Onboarding **structure, sequence and meaning** (§6) — copy may still receive minor editorial
  refinement in the final polish pass.
- **Onboarding layout: A** (split copy + building map), with Layout C repurposed as separate
  first-run guidance inside My Map and Layout B archived (§6).
- Session policy for MVP: 6-day same-device session, no short inactivity timeout, no expiry
  countdowns, immediate invalidation on manual logout (§5).
- Consent screen approach.
- The rejected list (§10) and the avoid list (§11).

**PROVISIONAL**
- Landing research section (stat count + methodology wording), nav anchor order, origin-story
  attribution, footer contents.
- The MFA relationship between registration-time setup and future session challenges (§5). Email
  code is the MVP design; authenticator app and SMS are out of scope unless approved.
- Password reset, Settings, export/share, account screens — **not designed at all**.
- Where proportional segment weight comes from, whether users set it manually, whether AI may
  suggest it, whether users can edit it, and whether edge thickness/opacity reinforces it.
- **Production language strategy** — not closed. Mockups are English; Spanish is used in project
  discussion. No Spanish screen set produced yet.
- The "Add a diagnosis" and "Add a symptom" sheets — buttons exist, sheets do not.
- Mobile: nothing designed. This round is desktop 1440 only.

---

## 14. Current task and exact next steps

**Where things stand.** `SymptomMap Prototype.dc.html` is a working desktop-1440 click-through
prototype covering every screen listed in §2, built from design-system components with the bundle
loaded, with flow and copy taken from the approved v2 screens and re-executed in the current visual
language. Verified: no console errors; all 13 prototype-chrome tabs fit the 58px bar; no node label
hidden by the legend or colliding at zoom 0.6 / 1.0 / 1.3; the legend is suppressed during the
coached walkthrough so it cannot sit under the coach card; the layout switcher lives on the
walkthrough screens themselves, not in the global chrome.

**Current stage: final UI refinement before development handoff.** These mockups should **not** yet
be treated as final implementation specifications. The process is:
**UI refinement → final visual approval → implementation handoff → Claude Code.**
The current goal is to remove remaining ambiguity before development begins.

**Next steps, in order:**

1. **Reconcile the prototype with the closed layout decision:** keep Layout A as the onboarding
   screen, re-frame the C screens as post-consent first-run guidance in My Map (action-teaching, not
   mental-model copy), and archive B out of the click-through.
2. **Build the two missing sheets**: "Add a diagnosis" (with the assignment algorithm picking the
   colour — no picker) and "Add a symptom" (free text in the person's own words, with which
   diagnoses it attaches to, and the option to attach none → a floating node).
3. **Settle the session/MFA rules** (§5 PENDING) and design password reset.
4. **Decide the landing research section** (stat count + methodology line) and the nav anchor order.
5. **Close the production language strategy**, then produce the matching screen set if these are
   going into user testing.
6. Optional but valuable: **connect the `Symptom-map/symptommaproject` repo** so the next pass can
   match real state and structure instead of the brief.

**Do not, without explicit approval:** change the flow order, soften either gate, restyle anything
against §3, simplify the map, flatten a shared symptom, let AI write into the map, or reinterpret
the onboarding into tutorial cards.

---

## 15. Design exploration workflow

For future UI decisions that are **not already approved**, Claude Design is encouraged to propose
**2–3 genuinely distinct design directions** rather than only executing the first suggested layout.
Especially useful for: new screens · new interactions · layout decisions · empty states · contextual
guidance · complex map-related UI.

Requirements:

- All proposals must respect the approved SymptomMap Design System and product logic.
- Proposals may vary composition, hierarchy and interaction approach.
- **Do not reopen decisions already marked APPROVED / DO NOT CHANGE.**
- **Clearly label explorations as PROPOSAL / NOT YET APPROVED.**
- **Do not silently incorporate a proposal into this handoff as a final decision.**
- Once one direction is selected, update the handoff and **archive the alternatives.**

The purpose is to expand the design space while keeping a clear line between exploration and
approved product decisions.

---

## 16. Current codebase migration status

**IN PROGRESS.** The existing SymptomMap prototype is still being migrated and reorganised into the
VS Code development project. Design work may continue independently, but **implementation must not
assume that the current repository structure is final.**

Until the migration is complete:

- **Prototype behaviour remains the source of truth** for existing product logic.
- **The Design System remains the source of truth** for visual execution.
- **The UI mockups define the intended final interface.**
- **Claude Code must not perform a broad product rewrite**, and must not replace map logic simply to
  match the mockups.

Development should begin **incrementally, after a stable migration baseline has been established.**
