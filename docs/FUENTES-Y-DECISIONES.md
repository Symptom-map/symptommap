# SymptomMap — Fuentes de verdad y decisiones

Leer antes de trabajar en SymptomMap, en cualquier herramienta (Claude, Claude Code, Codex, Claude Design). Las reglas para agentes de código están en `AGENTS.md`.
Existe para que nunca se mezclen las distintas versiones del proyecto.

Última actualización: 8 de octubre de 2026.

## 1. Qué es cada cosa y para qué se usa

**Regla fácil:** todo lo que diga `symptommaproject` es el **respaldo**; todo lo que diga `symptommap` (sin "project") es el **activo**.

| | Activo | Respaldo |
|---|---|---|
| Repo en GitHub | `Symptom-map/symptommap` | `Symptom-map/symptommap-dev` |
| Proyecto en Vercel | `symptommap` | `symptommaproject` |
| Sitio | symptommap.vercel.app | symptommaproject.vercel.app |

(El repo activo se llamaba `symptommaproject` hasta el 8 oct 2026; se renombró para que esa palabra solo signifique "respaldo".)

| Fuente | Dónde está | Para qué se usa | Para qué NO |
|---|---|---|---|
| **Respaldo** | Repo `symptommap-dev` → symptommaproject.vercel.app | Nada. Solo existe por si todo falla | **No se abre, no se copia, no se toca** |
| **App actual** | Repo `symptommap` → symptommap.vercel.app | Tres piezas que ya funcionan: la lista de 28 diagnósticos bilingüe (`data.js`), los prompts de AI (`ai.js`, adaptándolos a las reglas nuevas) y el proxy (`api/claude.js`) | Nada visual. Nada de cómo se colocan o dibujan los nodos (`graph.js` es el motor viejo) |
| **Núcleo del mapa** | `src/core/` en el repo `symptommap` | **Cómo se generan los nodos.** Única fuente para eso | — |
| **Prototipo** | Zip de Claude Design (`SymptomMap - Production Prototype.dc.html`) | Qué ve y qué hace la persona en cada pantalla, textos y flujo | Su código interno: listas de ejemplo, el código `482913`, la lógica de colores o de colocación. Fue hecho para diseñar y probar flujos, no para implementar |
| **Design system** | `_ds/` en el zip | Cómo se ve: colores, tipografía, componentes | — |
| **Documentos** | `docs/producto/` en el repo: HANDOFF, FUNCTIONAL-INVENTORY, DATA-MAP (copiados del proyecto de Claude Design el 8 oct 2026) | Reglas de producto y datos | Las decisiones de la sección 2 los reemplazan donde se contradicen |

**Regla de desempate:** este documento > handoff + inventario + Data Map > prototipo > app actual.

**Si algo de implementación no está claro en el prototipo, se le pregunta a Ana.** El prototipo no se diseñó pensando en el código.

## 2. Decisiones tomadas el 8 de octubre de 2026

Estas decisiones resuelven contradicciones entre los documentos del zip. Prevalecen sobre lo que digan el handoff, el inventario o el Data Map.

| Tema | Decisión | Reemplaza |
|---|---|---|
| Relaciones síntoma → síntoma ("consecuencias") | **Se eliminan.** Todo es síntoma ↔ diagnóstico (según las entrevistas con la psicóloga) | La función "Analizar origen" de la app actual (rombos y líneas punteadas) |
| Arcos de un síntoma compartido | **Siempre iguales** (50/50, 33/33/33). No se guarda ningún peso | Handoff §8 (70/30) |
| Color de un diagnóstico | **El sistema propone el más separado y la persona puede elegir otro** que no esté en uso, **al agregarlo y también después** (le da autonomía). Nada cambia de color solo | Handoff §10 ("selector de color rechazado") |
| Máximo de diagnósticos por mapa | **10** | El límite de 5 del prototipo |
| Almacenamiento | **En la nube** (no localStorage: los mapas se pierden al borrar caché) | localStorage de la app actual |
| Datos mínimos | Solo "18+ verificado" (no la fecha de nacimiento); solo que pasó el gate de elegibilidad; borrar un diagnóstico borra su perfil; los exports no se guardan; el zoom no se guarda; la AI nunca escribe directo en la base de datos | Data Map §9–§10 (candidatos abiertos) |
| Handoff | **No se reemplaza todavía.** Conviven la versión del proyecto (17 sep) y la del zip, que es más nueva | — |
| Agentes de código | Claude Code y Codex comparten **un solo archivo de reglas**, `AGENTS.md` (`CLAUDE.md` lo importa). Nunca editan los mismos archivos al mismo tiempo: uno implementa y el otro revisa | — |

## 3. Pendientes de decidir

- Arquitectura de producción (v2 nueva en el mismo repo y si se usa React para aprovechar los componentes del design system).
- Proveedor de autenticación y la relación entre MFA opcional y sesiones futuras.
- Dominio final (afecta canonical, sitemap y OG).
