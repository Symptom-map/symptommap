# Map core (`src/core/`)

The heart of SymptomMap: which nodes exist, how they relate, what colour they are and where they appear.

**It does not touch the DOM, the canvas, React or storage.** It takes a map (a JSON object) and returns a new map. The interface (the current app or v2) only calls these functions and draws what `construirVista()` returns. That way, changing the interface or where the data is stored cannot break how nodes are generated.

| File | What it does |
|---|---|
| `mapa.js` | Operations: add or remove diagnoses, colour, symptoms, connections, accepted suggestions, moving nodes |
| `vista.js` | Turns the map into nodes and edges ready to draw |
| `colocacion.js` | Where each node appears (rules from the approved prototype) |
| `color.js` | Exact copy of the design system colour algorithm. **Do not edit it here** |
| `mapa.test.js` | Tests, including the approved scenario |

## Running the tests

```sh
node --test src/core/mapa.test.js
```

Nothing to install (it uses the Node 20+ test runner). **Before changing anything about the map, the tests must pass; after the change, too.**

## Basic use

```js
import { crearMapa, agregarDiagnostico, agregarSintoma } from './src/core/mapa.js'
import { construirVista } from './src/core/vista.js'

let mapa = crearMapa()
const r = agregarDiagnostico(mapa, { etiqueta: 'ADHD' })       // proposed colour
mapa = r.mapa
mapa = agregarSintoma(mapa, { texto: 'Hard to get started', diagnosticoIds: [r.diagnosticoId] }).mapa

const vista = construirVista(mapa)
// vista.diagnosticos → DiagnosisNode   (slot, etiqueta, x, y)
// vista.sintomas     → SymptomNode     (tipo, slot, segmentos, texto, x, y)
// vista.aristas      → Connection      (slot, x1, y1, x2, y2, curva)
// vista.cadena       → neutral Connection between diagnoses
// vista.limites      → for "fit to screen" with the zoom
```

Errors are thrown as `ErrorMapa` with a `codigo` (`LIMITE_DIAGNOSTICOS`, `COLOR_EN_USO`, `SINTOMA_DUPLICADO`…) so the interface can show the right text in each language.

## Rules it covers

- Node types: diagnosis, single-source symptom, shared symptom (one arc per diagnosis, **always equal parts**) and floating (only in maps saved before 25 Oct 2026; new symptoms always have at least one connection).
- One edge for each diagnosis of a symptom. **There are no symptom → symptom relations.**
- Colour: the system proposes the most distinct one; the person can choose another that is not in use, when adding the diagnosis and later. Nothing changes colour on its own.
- At most 10 diagnoses. A diagnosis or symptom with the same text is not duplicated.
- The person's words are stored exactly as written.
- Removing a diagnosis deletes its profile and every symptom connected only to it (Ana, 25 Oct 2026, `docs/FUENTES-Y-DECISIONES.md` §3d; replaces FUNCTIONAL-INVENTORY §7). Shared symptoms keep their other connections. `sintomasQueSeBorran()` says which ones before the person confirms.
- Dragging changes the position, never the relations. Whatever the person moves does not jump back.
- Deterministic: the same map always looks the same (no `Math.random`). Labels do not cross.
- The AI never calls these functions on its own: `aceptarSugerencia` is always an action the person takes.
