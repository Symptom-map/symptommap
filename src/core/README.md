# Núcleo del mapa (`src/core/`)

El corazón de SymptomMap: qué nodos existen, cómo se relacionan, de qué color son y dónde aparecen.

**No toca el DOM, el canvas, React ni el almacenamiento.** Recibe un mapa (un objeto JSON) y devuelve un mapa nuevo. La interfaz (la actual o la v2) solo llama a estas funciones y dibuja lo que devuelve `construirVista()`. Así, cambiar la interfaz o el lugar donde se guardan los datos no puede romper cómo se generan los nodos.

| Archivo | Qué hace |
|---|---|
| `mapa.js` | Operaciones: agregar o quitar diagnósticos, color, síntomas, conexiones, sugerencias aceptadas, mover nodos |
| `vista.js` | Convierte el mapa en nodos y aristas listos para dibujar |
| `colocacion.js` | Dónde aparece cada nodo (reglas del prototipo aprobado) |
| `color.js` | Copia exacta del algoritmo de color del design system. **No modificar aquí** |
| `mapa.test.js` | Pruebas, incluido el escenario aprobado |

## Correr las pruebas

```sh
node --test src/core/mapa.test.js
```

No hay que instalar nada (usa el test runner de Node 20+). **Antes de cambiar cualquier cosa del mapa, las pruebas tienen que pasar; después del cambio, también.**

## Uso básico

```js
import { crearMapa, agregarDiagnostico, agregarSintoma } from './src/core/mapa.js'
import { construirVista } from './src/core/vista.js'

let mapa = crearMapa()
const r = agregarDiagnostico(mapa, { etiqueta: 'ADHD' })       // color propuesto
mapa = r.mapa
mapa = agregarSintoma(mapa, { texto: 'Me cuesta empezar', diagnosticoIds: [r.diagnosticoId] }).mapa

const vista = construirVista(mapa)
// vista.diagnosticos → DiagnosisNode   (slot, etiqueta, x, y)
// vista.sintomas     → SymptomNode     (tipo, slot, segmentos, texto, x, y)
// vista.aristas      → Connection      (slot, x1, y1, x2, y2, curva)
// vista.cadena       → Connection neutral entre diagnósticos
// vista.limites      → para "ver todo" con el zoom
```

Los errores se lanzan como `ErrorMapa` con un `codigo` (`LIMITE_DIAGNOSTICOS`, `COLOR_EN_USO`, `SINTOMA_DUPLICADO`…) para que la interfaz muestre el texto adecuado en cada idioma.

## Reglas que cubre

- Tipos de nodo: diagnóstico, síntoma único, compartido (un arco por diagnóstico, **siempre en partes iguales**) y flotante.
- Una arista por cada diagnóstico de un síntoma. **No existen relaciones síntoma → síntoma.**
- Color: el sistema propone el más separado; la persona puede elegir otro que no esté en uso, al agregar el diagnóstico y también después. Nada cambia de color solo.
- Máximo 10 diagnósticos. Un diagnóstico o un síntoma con el mismo texto no se duplica.
- Las palabras de la persona se guardan tal cual.
- Quitar un diagnóstico sigue la tabla del Functional Inventory §7 y borra su perfil.
- Arrastrar cambia el lugar, nunca las relaciones. Lo que la persona mueve no salta de lugar.
- Determinista: el mismo mapa siempre se ve igual (sin `Math.random`). Las etiquetas no se cruzan.
- La AI nunca llama a estas funciones por su cuenta: `aceptarSugerencia` es siempre una acción de la persona.
