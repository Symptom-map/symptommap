# SymptomMap — Agent instructions

Shared instructions for every coding agent in this repository (Claude Code reads them through `CLAUDE.md`; Codex reads this file directly). Keep all shared rules **here only**, so the agents never drift apart.

Talk to Ana in **neutral Latin American Spanish** ("tú", never "vos" or Argentine voseo). Code, comments and commit messages may be in Spanish or English; use the Spanish domain terms below.

## Which repo is this

This is the **active** repo, `Symptom-map/symptommap` → https://www.symptommap.com.au (Vercel project `symptommap`; `symptommap.com.au` and `symptommap.vercel.app` redirect there).
Anything named `symptommaproject` is the **backup** (Vercel project and site symptommaproject.vercel.app, built from repo `Symptom-map/symptommap-dev`). **Never touch the backup.**
This repo was called `symptommaproject` until 8 Oct 2026.

## Read first

1. `docs/FUENTES-Y-DECISIONES.md` — which source is used for what, and the product decisions of 8 Oct 2026. **It wins over every other document when they disagree** (e.g. colours are user-changeable and arcs are always equal, even though the handoff says otherwise).
2. `src/core/README.md` — the map core. **How nodes are generated lives only in `src/core/`.** Never re-implement node, colour, connection or placement rules inside UI code; call the core and draw what `construirVista()` returns.
3. Product documents in `docs/producto/` (copied from the Claude Design project): `HANDOFF.md` (approved UX, design system, map rules), `FUNCTIONAL-INVENTORY.md` (what the MVP does), `DATA-MAP.md` (data, sensitivity, deletion). They describe the approved UX; the 8 Oct decisions above override them.

The Claude Design prototype (`SymptomMap - Production Prototype.dc.html`) lives outside this repo. Use it for what the person sees and does, **never for its internal code** (sample lists, the `482913` code, colour or placement logic). If something about implementation is unclear in the prototype, **ask Ana** — it was built to design and test flows, not as code.

Before and after any change that touches the map, run:

```sh
node --test src/core/mapa.test.js
```

## Product principles

SymptomMap is a visual **self-understanding** tool for adults (18+) with more than one mental-health diagnosis confirmed by a professional. It is **not** a diagnostic tool, a treatment tool, a symptom tracker or a clinical decision system.

**AI suggests possibilities; the person decides what represents their experience.**

Do not, unless Ana explicitly asks:
- redesign screens, add features or change the approved flow;
- change map semantics (no symptom → symptom relations, no weights, percentages or confidence levels);
- infer diagnoses from symptoms (excluded permanently);
- rewrite the person's own words.

If implementation exposes an accessibility, security, functional or browser issue the prototype did not show, **flag it** instead of inventing a redesign. Never make product decisions silently.

## Sensitive health data

Diagnoses, symptoms, triggers, notes and anything the person writes are **sensitive health information**.

- Never put health information in logs, analytics, error tracking or session replay. Log status codes only.
- Never expose secrets or API keys client-side.
- Never send account identity (name, email, ids) to the AI.
- Do not add new persistent storage of health data without checking `docs/FUENTES-Y-DECISIONES.md` and `docs/producto/DATA-MAP.md`.

## AI rules (MVP)

- No clinical RAG, no vector database, no clinical ontology. Lightweight terminology aliases are fine.
- Send only the minimum health context needed.
- The AI never writes to the map or the database. A suggestion becomes part of the map only when the person accepts it (`aceptarSugerencia` in the core).

## Working style

Ana has ADHD: keep tasks to 1–3 hours, finish what you start, and leave no loose ends between sessions.

Before changing code:
1. Read the relevant documents above.
2. `git status` and recent `git log`. **If there are changes you did not make, stop and report them** — they may be Ana's or another agent's work.
3. Make the smallest safe change; preserve existing behaviour unless the task changes it.
4. Test it, then report what changed and anything left open.

Never push to `main`, merge, force-push or delete branches unless Ana asks. Work on a branch and open a PR.

## Working with other agents (Claude Code and Codex)

The repository is the shared memory: these instructions, `docs/`, Git history and PRs. Agents do not talk to each other.

- Never assume another agent's uncommitted changes are safe to overwrite.
- Never let two agents edit the same files at the same time. One implements; the other reviews.
- For parallel work on separate tasks, use separate branches or git worktrees.
- `CURRENT-TASK.md` (root), when it exists, says what is being worked on now, by whom, and what is done. Read it first; update it when you finish.

---

## Running the app

The repo has two apps, published together by Vercel as one site:

| Path | What | Where the code is |
|---|---|---|
| `/` | Current app (in production) | Root: `index.html`, `src/js/`, `src/styles/` (plain HTML + ES modules, no build) |
| `/app/` | **v2** (React + Vite), being built | `v2/` |

```sh
# Current app
python -m http.server 8080            # from the repo root

# v2
cd v2 && npm install && npm run dev   # http://localhost:5173/app/

# Full site exactly as Vercel builds it (current app + v2 → dist/)
npm run build:sitio --prefix v2
```

**The public site is closed ("Coming soon") since 13 Oct 2026.** In Vercel production (www.symptommap.com.au) the build publishes only `proximamente.html`, as `/` and as the 404, and `api/claude.js` answers 503. Vercel preview deployments (protected, team only) still build the full site: that is where the app is tested. To open the site: Vercel → Settings → Environment Variables → `SITIO_ABIERTO = si` (Production) and redeploy. To check the closed build locally: `SITIO_SIMULAR_CERRADO=si npm run build:sitio --prefix v2`.

Vercel runs `npm ci --prefix v2` and `npm run build:sitio --prefix v2` and publishes `dist/` (see `vercel.json`). `v2/scripts/construir-sitio.mjs` copies only a whitelist of public files from the root, so `docs/`, `AGENTS.md` and `node_modules` are never published. **If the current app needs a new public file, add it to that whitelist.** `api/claude.js` needs the AWS variables in `docs/aws/README.md`; for local dev use `npx vercel dev`.

Tests: `npm test --prefix v2` (map core + account validation; Node 20+). Database: `supabase/README.md` (migrations, account creation trigger, dashboard settings).

## Architecture (current app)

**Decided 8 Oct 2026:** the new interface (v2) is built with **React + Vite** in `v2/`, in this same repo, using the design-system components as they come from Claude Design. The current app stays in production at `/` until v2 is ready to replace it. Do not rewrite the current app; new work goes into `v2/`.

### v2 (`v2/`)

| File | Responsibility |
|------|---------------|
| `src/main.jsx` | Entry: exposes `window.React`, loads the design system bundle, mounts the app |
| `src/ds/` | Design system copied from Claude Design (tokens, styles, `_ds_bundle.js`). **Do not edit**; replace it when the design system changes. `ds()` returns its components |
| `src/mapa/MapaVista.jsx` | Draws a map: calls `construirVista()` and renders `DiagnosisNode`, `SymptomNode`, `Connection`. Drag and zoom |
| `src/App.jsx` | Flow: log in / sign up (prototype screens) → the person's map, saved automatically |
| `src/cuenta/` | Account screens from the prototype (`Pantallas.jsx`) and their pure validation rules (`validar.js`, tested) |
| `src/nube/` | Supabase: `cliente.js` (public URL + publishable key), `cuenta.js` (sign up, 6-digit code, log in/out, consent), `mapa.js` (load/save with `revision`). The map is never stored in the browser |
| `scripts/construir-sitio.mjs` | Builds the full site into `dist/` |

The core is imported from `../src/core` through the `@nucleo` alias; v2 never copies or re-implements it. The design-system bundle logs a harmless error for its own demo UI kit (`ui_kits/app/App.jsx`); ignore it.

**Stack of the current app:** Vanilla JS (ES6 modules), HTML5 Canvas, CSS custom properties, Vercel serverless (Node.js), Claude API.

### Map core (`src/core/`)

| File | Responsibility |
|------|---------------|
| `mapa.js` | Operations: diagnoses (colour, max 10, no duplicates), symptoms, accepted suggestions, connections, removal rules, moving nodes |
| `vista.js` | Turns a map into nodes and edges ready to draw |
| `colocacion.js` | Where each node appears (deterministic) |
| `color.js` | Exact copy of the design system colour algorithm — do not edit here |
| `mapa.test.js` | Tests, including the approved scenario |

The core is wired into v2 (`v2/src/mapa/MapaVista.jsx`), not into the current app.

### Frontend modules (`src/js/`, current app)

| File | Responsibility |
|------|---------------|
| `main.js` | Entry point: state bootstrap, canvas setup, event handlers, draw loop |
| `graph.js` | Old canvas engine. Do not modify; it will be replaced by drawing from `src/core/` |
| `state.js` | localStorage wrapper (`sm_state_v2`) |
| `data.js` | Diagnosis registry (`DIAG_MAP`, 28 bilingual diagnoses) |
| `ai.js` | Claude API client and prompts (es/en) |

CSS layers in `src/styles/`, in load order: `tokens.css` → `layout.css` → `components.css`.

### Backend (`api/claude.js`)

Proxy to Claude that keeps every key server-side. Helpers live in `api/_ai/` (the `_` prefix keeps them from becoming functions; tests run with `npm test --prefix v2`).

- **Requires a Supabase session** (`Authorization: Bearer <access token>`; checked against Supabase Auth in `_ai/sesion.js`). v2 calls it through `v2/src/nube/ai.js`. The old app at `/` has no accounts, so its AI no longer works.
- **Only Amazon Bedrock, AU inference profile** (`_ai/bedrock.js`, signed with `_ai/firma.js`, no dependencies), using `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` from Vercel. Without them it answers 503. There is no direct Anthropic API path any more (Ana's personal key was retired on 14 Oct 2026; never add one back). Setup: `docs/aws/README.md`.
- The client may only send one user text message and a `max_tokens` value (capped at 1500).
- Same-origin requests only.
- Never log request or response content.
- Runs in `syd1` (Sydney, `vercel.json`); the AI itself runs in Sydney/Melbourne through Bedrock. Emails move to Amazon SES (Sydney). See `docs/FUENTES-Y-DECISIONES.md` §3b.

### Public files (root)

| File | Purpose |
|------|---------|
| `404.html` | Custom not-found page; English, neutral Spanish when the browser is in Spanish. `noindex` |
| `robots.txt` | Allows crawling; private routes use `X-Robots-Tag: noindex`, not `Disallow` |
| `sitemap.xml` | Public pages only |
| `llms.txt` | Plain description of SymptomMap for AI systems (public info only) |
| `assets/og-image.png` | 1200×630 social preview |
| `assets/fonts/` | Self-hosted Outfit and Plus Jakarta Sans (OFL) |

All absolute URLs use `https://www.symptommap.com.au` (domain bought at VentraIP on 12 Oct 2026; DNS hosted at VentraIP). If it ever changes, update `index.html`, `sitemap.xml`, `robots.txt`, `llms.txt`, the redirect in `vercel.json` and the Supabase Site URL together.

### Domain language

Use these Spanish terms in code and comments:
- **Diagnóstico / diag** — diagnosis node
- **Síntoma** — symptom node
- **Arista** — edge/connection
- **Perfil** — per-diagnosis profile
- **Mapa** — the map
