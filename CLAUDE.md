# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Which repo is this

This is the **active** repo, `Symptom-map/symptommap` → symptommap.vercel.app (Vercel project `symptommap`).
Anything named `symptommaproject` is the **backup** (Vercel project and site symptommaproject.vercel.app, built from repo `Symptom-map/symptommap-dev`). **Never touch the backup.**
This repo was called `symptommaproject` until 8 Oct 2026.

## Read first

1. `docs/FUENTES-Y-DECISIONES.md` — which source is used for what (backup repo, this app, the Claude Design prototype, the design system) and the product decisions of 8 Oct 2026. It wins over any other document when they disagree.
2. `src/core/README.md` — the map core. **How nodes are generated lives only in `src/core/`.** Never re-implement node, colour, connection or placement rules inside UI code; call the core and draw what `construirVista()` returns.

Before and after any change that touches the map, run:

```sh
node --test src/core/mapa.test.js
```

## Running the App

There is no build step. The app is plain HTML + ES6 modules served statically.

To run locally, use any static file server from the project root:

```sh
npx serve .
# or
python -m http.server 8080
```

The Vercel serverless function (`api/claude.js`) requires an `ANTHROPIC_API_KEY` environment variable. For local dev, use Vercel CLI:

```sh
npx vercel dev
```

There is no linter and no package.json. The only tests are the map core tests (`node --test src/core/mapa.test.js`, Node 20+, nothing to install).

## Architecture

**Stack:** Vanilla JS (ES6 modules), HTML5 Canvas, CSS custom properties, Vercel serverless (Node.js), Claude API.

### Frontend Modules (`src/js/`)

| File | Responsibility |
|------|---------------|
| `main.js` | App entry point: constants, state bootstrap, canvas setup, event handlers, draw loop |
| `graph.js` | Canvas rendering: coordinate transforms (`worldToScreen`/`screenToWorld`), layout algorithm, node/edge drawing, hit testing |
| `state.js` | localStorage wrapper (`sm_state_v2`): `loadState()`, `saveState()`, `clearState()` |
| `data.js` | Diagnosis registry (`DIAG_MAP`) and default selection (`DEFAULT_SELECTED`) |
| `ai.js` | Claude API client: `suggestSymptoms()` and prompt builders for `es`/`en` locales |

### CSS Layers (`src/styles/`)

Load order matters — each layer depends on the previous:
1. `tokens.css` — all design tokens (colors, fonts, spacing) as CSS variables
2. `layout.css` — three-panel shell (topbar, left sidebar, canvas area, right detail panel), modals, legend widget
3. `components.css` — buttons, inputs, accordions, AI badge, toast notifications

### Backend (`api/claude.js`)

Vercel serverless function that proxies requests to `https://api.anthropic.com/v1/messages`. It exists solely to keep the API key server-side.

- The server, not the client, decides the model (`claude-sonnet-4-6`). The client may only send one user text message and a `max_tokens` value, which is capped at 1500.
- Only same-origin requests are accepted. This is not authentication; real per-user auth arrives with accounts.
- Never log request or response content: it is health information. Log status codes only.
- Functions run in `syd1` (Sydney), set in `vercel.json`. Note that Anthropic still processes the request outside Australia; moving AI to Amazon Bedrock (AU profile) is the planned fix.

### Public files (root)

| File | Purpose |
|------|---------|
| `404.html` | Custom not-found page (served automatically by Vercel). English, switches to neutral Spanish when the browser is in Spanish. `noindex` |
| `robots.txt` | Allows crawling; private routes are protected with `X-Robots-Tag: noindex`, not with `Disallow` |
| `sitemap.xml` | Public pages only |
| `llms.txt` | Plain description of SymptomMap for AI systems (public info only) |
| `assets/og-image.png` | 1200×630 social preview |
| `assets/fonts/` | Self-hosted Outfit and Plus Jakarta Sans (OFL), used by `404.html` |

All absolute URLs (`canonical`, `og:url`, `og:image`, sitemap, robots, llms.txt) use `https://symptommap.vercel.app`. Update them together when the final domain is chosen.

### State Shape

```js
{
  lang: 'es' | 'en',
  username: string,
  selectedDiags: string[],   // e.g. ['tda', 'tlp', 'an', 'aut']
  diagProfiles: {},          // per-diagnosis questionnaire answers
  nodes: [],                 // symptom/hub nodes with positions
  idCounter: number
}
```

Persisted in `localStorage` under key `sm_state_v2`.

### UI Structure

Three-panel layout loaded from `index.html`:
- **Left sidebar** — diagnosis list + symptom chips
- **Center canvas** — interactive graph (pan/zoom/drag, hub-and-spoke layout)
- **Right panel** — node detail editor (slides in on selection)

Three-step onboarding (language → name → how-it-works) runs on first visit.

### Domain Language

The codebase uses Spanish for domain concepts — use these terms in code and comments:
- **Diagnóstico / diag** — diagnosis hub node
- **Síntoma** — symptom leaf node
- **Arista** — graph edge/connection
- **Perfil** — per-diagnosis profile questionnaire
- **Mapa** — the graph visualization
