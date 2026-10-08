# SymptomMap — Design System

**SymptomMap** is a self-understanding tool for people living with several mental health diagnoses at
once. A person adds the diagnoses they already have, arranges them by hand on a map, adds the symptoms
they recognise in their own words, and sees where those symptoms overlap. It is **not diagnosis and not
treatment** — it sits next to someone's care, never in place of it.

Independent project funded by the **Victoria University SSAF Grant**. Product language is Spanish
(Spain/LatAm neutral); documentation and token names are English. Built for Gen Z and neurodivergent
users: *clarity that doesn't overwhelm, warmth that doesn't infantilise.*

Guiding principle, carried over verbatim from the source system:

> **"Refined but warm."** A contained base that leaves room for colour and life to appear — without
> ever crowding it. If the base stays disciplined, everything added later reads as signal.

## Sources this was built from

This system is a **faithful import** of an existing SymptomMap design system, not a new design.

| Source | What was taken from it |
| --- | --- |
| **GitHub — [`Symptom-map/symptommaproject`](https://github.com/Symptom-map/symptommaproject)** (branch `main`) | The **product source of truth**: map structure and layout/hit logic (`src/js/graph.js`), state shape (`src/js/state.js`), the diagnosis registry (`src/js/data.js`), the three-panel IA and every panel/modal (`index.html`, `src/js/ui/*.js`), and the AI prompts + pending-suggestion flow (`src/js/ai.js`, `src/js/ui/reviewPanel.js`). Read, not copied: the prototype's own CSS (`src/styles/*`) is **not** the visual source — it is the styling this system replaces. Worth exploring further before building new SymptomMap screens. |
| `uploads/Diagnosis color assignment system/SymptomMap Design System.dc.html` (v1.2 "Lighter ink") | The whole system: colour, diagnosis colour + assignment algorithm, type/space/shape scales, all component states, iconography, logo rules, clinical safeguards, the reference screen |
| `uploads/.../assets/ic-head.png`, `ic-brain.png`, `ic-calendar.png` | Illustrative single-line artwork → `assets/illustrations/` |
| `uploads/.../assets/src-logo-current.png`, `symptommap_avatar_v2_light.png` | Previous/current avatar, kept for reference → `assets/brand/` |
| `uploads/.../uploads/Core Palette.png`, `Combinación 2.png` | Source palette exports (Coolors) → `assets/brand/source-core-palette.png` |
| `uploads/.../uploads/Instagram Story.png`, `_Blue Neon Business LinkedIn Banner.png` | Recruitment-campaign artwork → `assets/brand/` |
| Prototype screenshots in `uploads/.../uploads/` | Confirmation of the live map, sidebar, suggestion panel and diagnosis-profile modal |

### Approved changes since the import (revision 2)

The prototype is the visual source of truth; the system formalises it rather than reinterpreting it.
Five changes are approved on top of the uploaded source:

1. **Primary action is Cyan 400 `#48CAE4`** with a charcoal `#1A1A1A` label; hover and pressed are
   Cyan 500 `#00B4D8`. `#38B6FF` is gone, and so is every arbitrary blue — the **cyan scale is the
   single source of truth** for action colour and its states. No deep blue, no navy.
2. **Purple `#9D50BB` stays a brand accent** — wordmark, links, small highlights. It is no longer the
   focus ring and never appears in generic button interaction.
3. **Monospace is out of the product UI.** Sidebar labels, counts, source tags, metadata, form labels,
   captions and onboarding progress are all set in the UI face. `--sm-font-mono` survives for
   technical documentation only.
4. **Two typefaces:** Outfit (brand, headings, section titles) + Plus Jakarta Sans (body, UI labels,
   buttons, inputs, sidebar items, captions, metadata, tags, supporting text). Poppins, Calibri and
   JetBrains Mono are no longer part of the interface.
5. **No uppercase + wide-tracking convention.** Sentence case by default ("Mis diagnósticos", not
   "MIS DIAGNÓSTICOS"), natural tracking throughout.

---

## CONTENT FUNDAMENTALS

**Voice.** Second person singular, informal Spanish (*tú*, never *usted*). The product speaks *to* the
person about their own life, and never about them in the third person. Warm, matter-of-fact, unhurried.

**Casing.** Sentence case everywhere in prose and buttons ("Sugerir síntomas", "Guardar perfil",
"Lo tengo claro"). Mono utility labels are lowercase or uppercase with wide tracking
("mis diagnósticos", "MIS DIAGNÓSTICOS · 5"). No Title Case, no ALL CAPS in body copy.

**Emoji: never.** Not in the product, not in marketing surfaces built from this system.

**Copy rules for AI suggestions** — the most emotionally sensitive surface in the product:

- **Name the experience, not the label.** Describe what a day feels like; the diagnosis name is already
  on the chip.
- **Always hedged, never asserted.** "puede que", "a veces", "suele". No verb that diagnoses.
- **Always reversible.** One tap to dismiss, no consequence, no follow-up nudge.
- **No severity, no scores.** No percentages, no confidence numbers, no "grave"/"leve".
- **Never invalidating.** Rejecting a suggestion is a valid answer about someone's own life; the copy
  never argues back.
- **Plain words only.** If a term would appear in a clinical report and not in a conversation, rewrite it.

```
✓ "Puede que el rechazo te pese más de lo que parece desde fuera."
✕ "Presentas hipersensibilidad al rechazo, típica del TDAH."
✓ "¿Te suena? Tú decides si entra en tu mapa."
✕ "Confirma este síntoma para completar tu perfil."
✓ "Si no encaja, quítalo — no pasa nada."
✕ "Estás omitiendo un síntoma evidente de tu cuadro."
```

**Other copy patterns.** Placeholders are examples, never instructions ("ej. 16"). Error messages say
what a valid answer looks like ("Usa un número entre 0 y 99") and never blame. The clinical disclaimer
is two short paragraphs maximum — "a disclaimer nobody finishes reading protects nobody" — and is
friendly, not cautionary: no warning icons, no red, no "atención". Cyan and cream do the reassuring.

---

## VISUAL FOUNDATIONS

**Colour is four closed sets that never borrow from each other:** base (surface + text), brand & UI
(action), state (feedback), and diagnosis colour (the map). See `tokens/colors.css` and
`tokens/diagnosis.css`.

- **Base.** Warm cream `#FAF7F0` is the page and the map canvas; white `#FFFFFF` is every surface, and
  a white surface always has elevation. Charcoal `#1A1A1A` is **ink only — never a surface**; no navy
  returns through the back door. Body copy is warm slate `#57534E`, meta `#6B6560`, and `#A6A6A6` grey
  is fills and borders but never text.
- **Cyan scale — all interaction.** `050 #EAF8FB` lightest wash (secondary/input hover), `100 #CAF0F8`
  quiet surfaces and selected pills, `200 #ADE8F4` panel grounds, `300 #90E0EF` soft fills,
  **`400 #48CAE4` primary action**, `500 #00B4D8` hover, pressed and focus. Cyan fills always carry a
  charcoal label (8.6:1 on Cyan 400). The scale stops at the warm end: no mid or deep pure blue.
- **Purple brand accent.** `#9D50BB` for the wordmark gradient end, text links and small highlights —
  used selectively, never as a fill and never as a focus halo.
- **State.** `#16A34A` / `#DC2626` / `#D97706` with darker inks for text. Dark, saturated, and only on
  small rectangular affordances: inline messages, icons, toasts.
- **Diagnosis colour.** Ten light, soft hues on a fixed ring, each shipping `base` / `tint` / `ink`.
  Assigned **per map**, not per diagnosis, so one person's five nodes sit as far apart as possible.
  Separation is guaranteed: 2 diagnoses → 160°, 3 → 96°, 4 → 64°, 5 → 58°, 6–10 → 32°.
  Rule 01 even spread on create (`slot(i) = round(i × 10 / n)`), Rule 02 widest gap on add (nothing
  already on a map ever recolours), Rule 03 past ten go to a darker tier and render label-first,
  Rule 04 it never leaves the map. Cyan `#2DCBEC` is excluded from the ring and reserved for AI.
- **Keeping the two apart in practice:** state colour appears on small rectangular affordances —
  inline messages, validation borders, status badges. Diagnosis colour appears on nodes, chips, edges
  and source tags: light, soft and round. Neither borrows the other’s shape or placement.

**Type.** Two typefaces (`tokens/typography.css`, classes in `styles/base.css`): **Outfit** for the
brand, headings and major section titles; **Plus Jakarta Sans** for body, UI labels, buttons, inputs,
sidebar items, captions, metadata, tags and supporting text. Display 56/58 at −3% tracking, H1 40/46
at −2%, H2 28/35, H3 Jakarta 600 19/27, body 16.5/27, body-small 15.5/24, support 14.5/23, label
Jakarta 500 14.5, button Jakarta 600 15, field label 13.5, metadata 13 — all **sentence case with
natural tracking**. **Running text is emphasised with weight, never with colour.** Suggestion copy is
Jakarta *italic* 15.5px so it reads as something offered, not stated. No monospace in the interface.

**Spacing & layout.** One 4-point scale (4 → 96). Card padding 24–40, panel gutters 24, section rhythm
96–104, content max 1280. Sidebar 250px, side panel 290px, header 58px. Hit targets never below 44px.
When in doubt, go up a step: breathing room is the point.

**Shape.** Radius grows with the container: 12 inputs, 14 chips + small buttons, 16 buttons, 18 cards,
22 panels/modals/sheets, 999 pills/tags/counters, 50% nodes (perfect circles, always). Rounder reads
warmer, still not a pill. Line weight: 1px hairlines, 1.25px map connections, 1.5px node rings and
inputs, 2px focus ring.

**Elevation & borders.** Three steps, all warm charcoal at low alpha — cream never gets a grey shadow:
`01 rest` (rows, chips), `02 card` (panels), `03 modal`. Hover on the primary button is a soft warm
shadow (`0 6px 16px -8px`), not a lift or a scale. Cards are shadow + radius, never an outline and
never a coloured left border. Excessive outlines are a smell: one carrier per state.

**Backgrounds & imagery.** Flat warm cream and white; no gradient backgrounds, no textures, no
patterns. The **only gradient in the product** is cyan→purple on the wordmark, and it always means
"SymptomMap". Illustration is continuous single-line artwork in charcoal ink, one per view, at empty
states and section openers — never decorative. Transparency and blur appear only in the modal scrim
(warm cream at 72%, 2px blur); never a dark overlay.

**Interaction.** Hover changes the control’s own colour, never adds a ring: primary `#48CAE4` →
`#00B4D8`; secondary and inputs take the `#EAF8FB` wash with a warmer border; ghost takes a soft
charcoal wash. Pressed is Cyan 500 (or Cyan 100 on secondary). Disabled recedes (pale neutral fill,
grey label, **no** border) instead of outlining itself. **Selected is a tonal fill plus a small check
— never a ring, never a heavy border.** Keyboard focus belongs to the component: it holds the Cyan 500
state and adds a restrained charcoal inset stroke (`inset 0 0 0 1.5px rgba(26,26,26,.55)`) — visible
without a floating halo. Buttons are spacious: 46px min-height, 22–24px padding, and a label grows the
button (or goes full width) before it ever wraps. Transitions are short (≈160ms, ease) on colour,
border and shadow; nothing bounces, nothing slides, and map edges never animate into place.

**Accessibility.** WCAG 2.1 AA. Charcoal on cream 16.1:1; charcoal on Cyan 400 8.6:1 and on Cyan 500
6.4:1 (white on cyan fails and is **forbidden**); purple on cream 4.57:1; warm slate on cream 7.1:1. Every diagnosis ink
passes ≥5.3:1 on cream. Colour never carries meaning alone — every node keeps its label at every zoom
level, and shared symptoms are **segmented** — one arc per source diagnosis — as well as listing one
dot per source in the sidebar. A deuteranopia check is part of
reviewing any new diagnosis-colour work.

---

## ICONOGRAPHY

Two registers, one family, one colour each.

1. **Interface icons** — a hand-built 16-glyph set on a 24px grid, stroke 1.6, round caps and joins:
   `add, minus, close, expand, edit, search, info, alert, suggest, connect, node, date, fullscreen,
   accept, check, eye`. Shipped as `components/icons/Icon.jsx` (no icon font, no CDN dependency, no
   SVG sprite in the source system — these are the source's own inline paths, lifted verbatim).
   Colour by context: charcoal ink (default), AI cyan ink `#006C88`, error ink `#B91C1C`, grey when
   disabled. Icons always pair with a sentence-case label. Sizes: 26px in panels, 18px in buttons, 12–14px inside rows.
2. **Illustrative artwork** — continuous single-line drawings at stroke 2, 96–140px:
   `assets/illustrations/line-head.png` (mente), `line-brain.png` (diagnóstico),
   `line-calendar.png` (tiempo). Recoloured from the campaign coral to charcoal ink, because coral now
   means error and diagnosis semantics. One per view; never a decorative pattern.

**Never:** emoji anywhere; two colours inside one icon; filled, 3D or shadowed glyphs; a diagnosis
colour on a UI control; an icon carrying meaning without a label.

**Logo.** `assets/brand/logo-mark.svg` (full) and `logo-mark-flat.svg` (one-colour), plus
`components/brand/Logo.jsx`; `assets/brand/avatar-v2-light.png` is the original avatar artwork.
The mark is a small map: one person's diagnoses, connected, and it carries **no circular container** —
never add a coloured disc, badge or ring around it; on busy grounds use a neutral plate. Clear space
= 25% of the mark's diameter; minimum 24px full, 16px flat. Wordmark is Outfit 700 at −2.5% tracking
with the cyan→purple gradient (`#48CAE4` → `#9D50BB`); the in-app lockup splits it — "Symptom" in charcoal, "Map" in gradient.
Never re-space, re-weight or outline the wordmark; never put the gradient on the mark or on UI.
`assets/brand/avatar-previous.png` is kept only as the historical reference (its grey gradient
dissolved on white and its blue ring fought the nodes — both removed).

---

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | Global entry point — nothing but `@import` lines. Consumers link this one file. |
| `thumbnail.html` | The system's tile on the homepage |
| `ui_kits/app/` | **UI kit** — click-through recreation of the map workspace (plus a superseded onboarding sketch). Has its own `README.md`. |
| `tokens/fonts.css` | Outfit + Plus Jakarta Sans loading and family tokens |
| `tokens/colors.css` | Base/neutrals, cyan scale, purple accent, semantic states, AI, aliases |
| `tokens/diagnosis.css` | The ten-colour ring (base/tint/ink/hover/selected/halo) + map chrome |
| `tokens/typography.css` | Type scale tokens |
| `tokens/spacing.css` | 4-point scale + layout constants |
| `tokens/shape.css` | Radius, line weight, icon stroke, control heights |
| `tokens/elevation.css` | The three shadow steps + hover shadow |
| `styles/base.css` | Page reset, link colours, focus ring, and the named **text styles** (`.sm-hero`, `.sm-h1`…`.sm-caption`) |
| `styles/components.css` | The component class layer every component and card uses |
| `guidelines/*.html` | Foundation specimen cards (Colors, Diagnosis, Type, Spacing, Shape, Brand) |
| `components/**` | 22 React components, each with `.d.ts` props contract and `.prompt.md` usage note |
| `cards-review.html` | Contact sheet of every registered card — a review aid, not part of the system |
| `SKILL.md` | Agent-Skills entry point for using this system outside this workspace |

### Components

| Group | Components |
| --- | --- |
| `components/buttons` | `Button` (primary · secondary · ghost · link; md/sm, wrap), `IconButton` (outline · ghost) |
| `components/forms` | `TextField` (text · password · search · number, + error/disabled/focus), `Select`, `PillSelect`, `Radio`, `Checkbox`, `CodeInput` |
| `components/surfaces` | `Card` (card · panel · rest · calm · quiet · flush), `Eyebrow`, `Modal` |
| `components/feedback` | `Badge` (neutral · ai · success · error), `Count`, `InlineMessage` |
| `components/navigation` | `AppHeader`, `SidebarGroup`, `MapControls`, `MapStatus` |
| `components/map` | `DiagnosisNode`, `SymptomNode` (single-colour dot for one diagnosis; **segmented** — one weighted arc per diagnosis — when shared), `Connection` + `ConnectionLayer`, `DiagnosisChip`, `SymptomRow`, `SourceTag`, `SuggestionCard`, and `diagnosisColor.js` (the assignment algorithm: `RING`, `dxVars`, `assignSlots`, `addSlot`, `ringDistance`, `minSeparation`) |
| `components/onboarding` | `StepCard` — a structurally neutral step shell (optional progress, optional media). The real onboarding is designed separately. |
| `components/brand` | `Logo` (lockup · wordmark · flat · mark · mark-flat) |
| `components/icons` | `Icon`, `ICON_NAMES` |

Diagnosis-coloured components take a `slot` prop (ring position 1–10) or `suggested` for AI cyan, and
resolve colour through the local `--dx-*` custom properties — so a component never hard-codes a
diagnosis hue.

### Intentional additions

The uploaded system defines these only implicitly; they follow its existing grammar and are flagged
so nobody mistakes them for source material.

- `Radio` / `Checkbox` — the source uses single-select pills. Built on the input grammar: 20px control,
  1.5px warm border, Cyan 400 fill with a **charcoal** mark when checked.
- `TextField type="password"` and `type="search"` — the source shows only plain text inputs; these add
  a leading magnifier / trailing reveal inside the same 44px, radius-12 shell.
- `CodeInput` — verification code, requested for import; mono cells on the input grammar.
- `Icon` — a wrapper around the source's own inline glyph paths, so the set has one API.
- `Eyebrow`, `Count`, `MapStatus` — names for patterns the source uses repeatedly without naming.

### UI kits

`ui_kits/app/` — a click-through recreation of the product, composed from the components above and
built by reading the prototype's code (not its screenshots).

| Screen | Built from |
| --- | --- |
| **Map workspace** (`index.html`, `map-workspace.html`) | `index.html` three-panel shell + `src/js/graph.js` (hub/symptom/shared/floating node kinds, one edge per source diagnosis, the neutral chain between diagnoses, zoom) + `src/js/ui/leftPanel.js` (diagnosis list, filter, add-symptom form, symptom list) + `src/js/ui/rightPanel.js` (detail, notes, intersection, user-initiated analysis) + `src/js/ui/reviewPanel.js` (pending suggestions) + `src/js/ui/modals.js` (per-diagnosis profile, add a diagnosis) |
| **Onboarding** (`onboarding.html`) | **Exploratory sketch, not the approved flow.** The current product flow is account creation → eligibility → MFA → onboarding → disclaimer/consent → empty map, with name and email collected before onboarding; onboarding is being designed separately. Kept for reference only — do not build screens from it |

The kit's `README.md` lists what is clickable and every deliberate departure from the prototype
(assigned diagnosis colour instead of a picker, no monospace chrome, AI that never writes into the
map). Map structure and relationship logic — including the prototype's **curved relationship edges**
— are preserved; `Connection` takes a signed `curve` in px, and flattening a relationship edge is a
product decision requiring approval, not a styling call.

### Prototype alignment (revision 3)

Prototype screenshots (`uploads/Screenshot 2026-06-22 012355.png`, `Screenshot 2026-08-25 211629.png`,
`symptommap_avatar_v2_light.png`) are the source of truth for **product** questions — map structure,
diagnosis/symptom relationships, connection and overlap logic, information architecture, core
interaction patterns and brand character. The improved Design System remains the source of truth for
**visual execution** — buttons, inputs, controls, typography, spacing, cards, hover/focus, borders,
shadows, navigation and polish. Same product logic, better interface execution.

Changed in this pass, nothing else:

- The blue circular container introduced around the logo mark is **removed**; the original mark now
  sits directly on cream, white or a neutral plate.
- `TutorialCard` is replaced by the neutral **`StepCard`**. The "three cards of orientation, one of
  honesty" sequence, mandatory illustrations and icon-led tutorial cards are **not** SymptomMap
  patterns; onboarding will be designed separately as a real product walkthrough.
- The map specimen now shows a symptom shared by **three** diagnoses with one edge per source, making
  the prototype's overlap behaviour explicit. Node anatomy, sizes, halos, edge weights, chip logic and
  diagnosis-colour assignment are unchanged from the prototype.

### Shared symptoms are segmented nodes (product rule)

One diagnosis → a small single-colour symptom dot. **Two or more → a segmented node**: one arc per
connected diagnosis, in that diagnosis's ring colour, around a white core. Never a generic
multicolour ring, never flattened to one colour.

- No relative weighting known → divide the circle equally (50/50, 33/33/33).
- One diagnosis more prominent → its arc takes proportionally more (70/30, 50/25/25).

`SymptomNode` takes `segments` — ring positions (`[1, 4]`) or weighted segments
(`[{slot:1,weight:7},{slot:4,weight:3}]`). This is a **visual product rule**: it holds in every
mockup even though the weighting logic is not implemented in the prototype yet, so mockups pass
plausible weights rather than waiting for real data. In the UI kit, `insomnio` is 70/30 and
`disociación bajo estrés` is 50/25/25, so unequal proportions are visible on the map itself.
Edge weight follows segment weight: the diagnosis owning more of the circle draws the heavier line.

### Known gaps

- **Fonts load from Google Fonts** (Outfit, Plus Jakarta Sans) — both are open licence, so no
  substitution is needed. Poppins, Calibri/Carlito and JetBrains Mono were removed in revision 2.
- No dark theme exists, by design: nothing dark is ever a surface in SymptomMap.
- The UI kit recreates the **map workspace**. Settings, export/share, account and the English locale
  are not recreated — the prototype has no designed version of them.
- `Radio` and `Checkbox` now live in one file each (`components/forms/Radio.jsx`, `Checkbox.jsx`);
  the earlier combined `Choice.jsx` is gone. The props contract is unchanged.
- **Onboarding is not designed in this system.** The current flow is account creation → eligibility →
  MFA → onboarding → disclaimer/consent → empty map, with name and email collected before onboarding.
  `ui_kits/app/Onboarding.jsx` and `onboarding.html` are a superseded exploratory sketch, not an
  approved pattern. `StepCard` stays a neutral shell — do not read an icon-card onboarding system
  into it, and do not read this sketch as the flow.
