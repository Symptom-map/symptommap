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
| Sitio | **www.symptommap.com.au** (antes symptommap.vercel.app, que ahora redirige) | symptommaproject.vercel.app |

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
| Interfaz nueva (v2) | **React + Vite**, en la carpeta `v2/` del mismo repo, usando los componentes del design system tal como vienen. Se publica en `/app/`; la app actual sigue en `/` hasta que la v2 esté lista | La regla "no React" y "no reescritura amplia" del handoff (§16) |
| Aspecto del síntoma compartido | Se usa el estilo del **respaldo** (symptommaproject.vercel.app): anillo **fino** dividido en arcos iguales con pequeños espacios entre colores, centro blanco amplio y un halo suave. **No** el anillo grueso del componente `SymptomNode` del design system. Se ajusta en la v2 al implementar el mapa (estilo propio en `v2/`, sin editar el design system) | El grosor del anillo de `SymptomNode` en el design system |
| Agentes de código | Claude Code y Codex comparten **un solo archivo de reglas**, `AGENTS.md` (`CLAUDE.md` lo importa). Nunca editan los mismos archivos al mismo tiempo: uno implementa y el otro revisa | — |

## 3. Decisiones del 11 de octubre de 2026

| Tema | Decisión |
|---|---|
| Inicio de sesión | **Supabase Auth** (no Cognito): mismo proyecto en Sydney, las reglas de seguridad de la base de datos lo usan directamente y borrar la cuenta borra todo en cascada. Si más adelante todo pasa a AWS, se migra (las personas tendrían que crear una contraseña nueva) |
| Verificación en dos pasos | **Opcional.** Se ofrece en "Protect your account" (con "Skip for now") y en Settings |
| Confirmar el correo al crear la cuenta | Se usa la pantalla **"Check your email"** del prototipo (código de 6 dígitos) como paso 3 de 3. En el prototipo esa pantalla solo aparecía al activar la verificación en dos pasos; sin confirmar el correo, cualquiera podría crear una cuenta con el correo de otra persona. **Confirmado por Ana (13 oct).** La verificación en dos pasos, cuando se construya, usará su propia pantalla ("Protect your account") y una app de autenticación, no el correo |

## 3b. Arquitectura de producción (decidida el 13 de octubre de 2026)

| Pieza | Decisión | Por qué |
|---|---|---|
| Interfaz | React + Vite (`v2/`) | Decidido el 8 oct |
| Sitio y funciones de servidor | **Vercel (Pro)**, funciones en `syd1` (Sydney) | Ya funciona; mudarlo a AWS tomaría semanas sin mejorar la privacidad. Vercel no guarda datos de salud: la función de AI no registra contenido |
| Base de datos y mapas | **Supabase, Sydney** | Funcionando desde el 9 oct |
| Cuentas | **Supabase Auth**, verificación en dos pasos opcional | Decidido el 11 oct |
| AI | **Claude a través de Amazon Bedrock, perfil de inferencia Australia** (Sydney + Melbourne), llamado desde la función de Vercel | Los datos de salud se procesan solo en Australia. Hoy la AI va directo a Anthropic (EE. UU.); se cambia antes de que entren personas reales |
| Correos | **Amazon SES, Sydney**, con remitente del dominio (`symptommap.com.au`) | Los correos de las personas no salen de Australia; reemplaza el correo de prueba de Supabase |

Reglas que vienen con esta arquitectura:
- La AI solo responde a personas con sesión iniciada (la función verifica el token de Supabase).
- Las claves de AWS tienen el permiso mínimo: invocar ese modelo y enviar correos, nada más. Viven solo en Vercel (variables de entorno), nunca en el navegador ni en el repo.
- Alerta de gasto en AWS y límite de gasto en la cuenta de Anthropic mientras se use.

Descartado por ahora: todo en AWS (Amplify/CloudFront + Lambda) y Cognito. Se puede revisar después del piloto.

## 4. Pendientes de decidir

- **Tipo de verificación en dos pasos.** El prototipo muestra un código por correo. Supabase Auth ofrece como segundo paso una app de autenticación (Google Authenticator, 1Password, etc.) o SMS, no un código por correo. Hay que elegir antes de construir "Protect your account".
- Recuperar la contraseña ("Forgot your password?"): el enlace está en el prototipo, la pantalla no.
- ~~Dominio final~~ → **www.symptommap.com.au** (12 oct 2026).
- Lista de diagnósticos para la v2: se parte de los 29 de la app actual (`src/js/data.js`). Falta que la revise la psicóloga (nombres, cuáles van, si se permite "otro") antes del piloto.
- Sugerencias de síntomas: hoy la AI las genera con su conocimiento general a partir de los diagnósticos y el perfil. Falta decidir si la psicóloga revisa ejemplos antes del piloto y si se agrega una lista inicial curada por diagnóstico.
