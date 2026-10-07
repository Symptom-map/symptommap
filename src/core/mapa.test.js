// Pruebas del núcleo del mapa. Se corren con:  node --test src/core/
// No necesitan instalar nada (usan el test runner que trae Node 20+).

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { asignarSlots, slotParaAgregar, separacionMinima } from './color.js'
import { MUNDO, FILA_Y, DISTANCIA_LIBRE } from './colocacion.js'
import {
  crearMapa, agregarDiagnostico, cambiarColor, coloresDisponibles, proponerColor, guardarPerfil,
  quitarDiagnostico, moverDiagnostico, agregarSintoma, aceptarSugerencia, conectar, desconectar,
  editarSintoma, borrarSintoma, moverSintoma, posicionesDiagnosticos, MAX_DIAGNOSTICOS,
  cajaSintoma, cajaDiagnostico, seCruzan,
} from './mapa.js'
import { construirVista } from './vista.js'

// ── Ayudas ────────────────────────────────────────────────────

function conDiagnosticos(etiquetas, slots = []) {
  let mapa = crearMapa()
  const ids = []
  etiquetas.forEach((etiqueta, i) => {
    const r = agregarDiagnostico(mapa, { etiqueta, slot: slots[i] })
    mapa = r.mapa
    ids.push(r.diagnosticoId)
  })
  return { mapa, ids }
}

function codigo(fn) {
  try { fn() } catch (e) { return e.codigo }
  return null
}

/**
 * Escenario aprobado: el mapa del hero del prototipo (ADHD, BPD
 * Borderline y C-PTSD en los colores 1, 4 y 8; 5 síntomas únicos y 3
 * compartidos) más un síntoma flotante escrito por la persona.
 */
function escenarioAprobado() {
  let { mapa, ids } = conDiagnosticos(['ADHD', 'BPD Borderline', 'C-PTSD'], [1, 4, 8])
  const [adhd, bpd, cptsd] = ids
  const sintomas = [
    ['Tasks pile up silently', [adhd]],
    ['Nausea when I wake up', [adhd]],
    ['Fear of being abandoned', [bpd]],
    ['Emotions hit without warning', [bpd]],
    ['Freeze during conflict', [cptsd]],
    ['Sleep falls apart', [adhd, cptsd]],
    ['Starting anything feels impossible', [adhd, bpd, cptsd]],
    ['Shame spirals fast', [bpd, cptsd]],
    ['Hard to explain to other people', []],
  ]
  for (const [texto, diagnosticoIds] of sintomas) {
    mapa = agregarSintoma(mapa, { texto, diagnosticoIds }).mapa
  }
  return { mapa, adhd, bpd, cptsd }
}

// ── Color (copia del design system) ───────────────────────────

test('color: reparto parejo al crear (Regla 01)', () => {
  assert.deepEqual(asignarSlots(3), [1, 4, 8])
  assert.deepEqual(asignarSlots(2), [1, 6])
})

test('color: separación garantizada del design system', () => {
  // El design system documenta 32° para 6–10 diagnósticos, pero la rueda
  // tiene un hueco de 28° entre Lime (118°) y Green (146°), así que el
  // mínimo real es 28°. Se prueba el valor real; la documentación del
  // design system debería corregirse.
  const garantia = { 2: 160, 3: 96, 4: 64, 5: 58, 6: 28, 7: 28, 8: 28, 9: 28, 10: 28 }
  for (const [n, grados] of Object.entries(garantia)) {
    assert.ok(separacionMinima(asignarSlots(Number(n))) >= grados, `n=${n}`)
  }
})

test('color: el propuesto es el hueco más amplio y nunca repite (Regla 02)', () => {
  assert.equal(slotParaAgregar([]), 1)
  assert.equal(slotParaAgregar([1]), 6)
  const ocupados = []
  for (let i = 0; i < 10; i++) ocupados.push(slotParaAgregar(ocupados))
  assert.deepEqual([...ocupados].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  assert.equal(slotParaAgregar(ocupados), null)
})

// ── Diagnósticos ──────────────────────────────────────────────

test('diagnóstico: si la persona no elige color, se usa el propuesto', () => {
  const { mapa } = conDiagnosticos(['ADHD', 'Autism', 'C-PTSD'])
  assert.deepEqual(mapa.diagnosticos.map(d => d.slot), [1, 6, 3])
})

test('diagnóstico: la persona puede elegir y cambiar el color, pero no repetir uno en uso', () => {
  const { mapa, ids } = conDiagnosticos(['ADHD', 'BPD'], [9, 2])
  assert.deepEqual(mapa.diagnosticos.map(d => d.slot), [9, 2])
  assert.equal(codigo(() => agregarDiagnostico(mapa, { etiqueta: 'C-PTSD', slot: 9 })), 'COLOR_EN_USO')
  assert.equal(codigo(() => agregarDiagnostico(mapa, { etiqueta: 'C-PTSD', slot: 11 })), 'COLOR_INVALIDO')
  const cambiado = cambiarColor(mapa, ids[0], 5)
  assert.equal(cambiado.diagnosticos[0].slot, 5)
  assert.equal(codigo(() => cambiarColor(mapa, ids[0], 2)), 'COLOR_EN_USO')
  assert.deepEqual(coloresDisponibles(mapa, ids[0]), [1, 3, 4, 5, 6, 7, 8, 9, 10])
})

test('diagnóstico: no se duplica (mismo nombre sin importar tildes o mayúsculas, o misma clave)', () => {
  let mapa = agregarDiagnostico(crearMapa(), { etiqueta: 'Ansiedad generalizada', claveCanonica: 'anxiety' }).mapa
  const porNombre = agregarDiagnostico(mapa, { etiqueta: '  ANSIEDAD generalizáda ' })
  assert.equal(porNombre.yaExistia, true)
  assert.equal(porNombre.mapa.diagnosticos.length, 1)
  const porClave = agregarDiagnostico(mapa, { etiqueta: 'Generalised anxiety', claveCanonica: 'anxiety' })
  assert.equal(porClave.yaExistia, true)
})

test(`diagnóstico: máximo ${MAX_DIAGNOSTICOS} por mapa`, () => {
  const { mapa } = conDiagnosticos(Array.from({ length: 10 }, (_, i) => 'Diagnóstico ' + i))
  assert.equal(mapa.diagnosticos.length, 10)
  assert.equal(codigo(() => agregarDiagnostico(mapa, { etiqueta: 'Uno más' })), 'LIMITE_DIAGNOSTICOS')
  assert.equal(proponerColor(mapa), null)
})

test('diagnóstico: el nombre no puede estar vacío', () => {
  assert.equal(codigo(() => agregarDiagnostico(crearMapa(), { etiqueta: '   ' })), 'ETIQUETA_VACIA')
})

test('las funciones nunca modifican el mapa que reciben', () => {
  const { mapa } = conDiagnosticos(['ADHD'])
  const antes = JSON.stringify(mapa)
  agregarDiagnostico(mapa, { etiqueta: 'BPD' })
  agregarSintoma(mapa, { texto: 'Algo', diagnosticoIds: [mapa.diagnosticos[0].id] })
  moverDiagnostico(mapa, mapa.diagnosticos[0].id, { x: 10, y: 10 })
  assert.equal(JSON.stringify(mapa), antes)
})

// ── Síntomas ──────────────────────────────────────────────────

test('síntoma: se guardan las palabras de la persona tal cual', () => {
  const { mapa, ids } = conDiagnosticos(['TDAH'])
  const r = agregarSintoma(mapa, { texto: '  Me cuesta EMPEZAR cosas… ', diagnosticoIds: ids })
  assert.equal(r.mapa.sintomas[0].texto, 'Me cuesta EMPEZAR cosas…')
  assert.equal(r.mapa.sintomas[0].origen, 'persona')
})

test('síntoma: el mismo texto no crea un segundo nodo; se suman las conexiones', () => {
  const { mapa, ids } = conDiagnosticos(['ADHD', 'C-PTSD'])
  const a = agregarSintoma(mapa, { texto: 'Sleep falls apart', diagnosticoIds: [ids[0]] })
  const b = agregarSintoma(a.mapa, { texto: 'sleep  falls apart!', diagnosticoIds: [ids[1]] })
  assert.equal(b.fusionado, true)
  assert.equal(b.mapa.sintomas.length, 1)
  assert.equal(b.mapa.conexiones.length, 2)
})

test('síntoma: no se puede conectar a un diagnóstico que no existe', () => {
  assert.equal(codigo(() => agregarSintoma(crearMapa(), { texto: 'Algo', diagnosticoIds: ['d99'] })), 'DIAGNOSTICO_NO_EXISTE')
})

test('sugerencia aceptada: queda marcada como sugerencia y solo se conecta a diagnósticos vigentes', () => {
  const { mapa, ids } = conDiagnosticos(['ADHD', 'BPD'])
  const r = aceptarSugerencia(mapa, { texto: 'Starting anything feels impossible', diagnosticoIds: [ids[0], 'd99'] })
  assert.equal(r.mapa.sintomas[0].origen, 'sugerencia')
  assert.deepEqual(r.mapa.conexiones.map(c => c.diagnosticoId), [ids[0]])
  assert.equal(codigo(() => aceptarSugerencia(mapa, { texto: 'X', diagnosticoIds: ['d99'] })), 'SUGERENCIA_SIN_DIAGNOSTICO')
})

test('síntoma: editar, conectar, desconectar y borrar', () => {
  let { mapa, ids } = conDiagnosticos(['ADHD', 'BPD'])
  mapa = agregarSintoma(mapa, { texto: 'Uno', diagnosticoIds: [ids[0]] }).mapa
  mapa = agregarSintoma(mapa, { texto: 'Dos' }).mapa
  const [uno, dos] = mapa.sintomas.map(s => s.id)

  assert.equal(codigo(() => editarSintoma(mapa, dos, { texto: 'uno' })), 'SINTOMA_DUPLICADO')
  mapa = editarSintoma(mapa, dos, { cuando: 'Por la noche', notas: 'Nota' })
  assert.equal(mapa.sintomas[1].cuando, 'Por la noche')

  mapa = conectar(mapa, uno, ids[1])
  mapa = conectar(mapa, uno, ids[1]) // repetir no duplica
  assert.equal(mapa.conexiones.filter(c => c.sintomaId === uno).length, 2)

  mapa = desconectar(mapa, uno, ids[0])
  mapa = desconectar(mapa, uno, ids[1])
  assert.ok(mapa.sintomas.find(s => s.id === uno), 'sin conexiones, el síntoma se conserva')

  mapa = borrarSintoma(mapa, uno)
  assert.equal(mapa.sintomas.length, 1)
  assert.equal(mapa.conexiones.some(c => c.sintomaId === uno), false)
})

// ── Quitar un diagnóstico (Functional Inventory §7) ───────────

test('quitar diagnóstico: aplica la tabla de reglas del inventario', () => {
  let { mapa, ids } = conDiagnosticos(['ADHD', 'C-PTSD'])
  const [adhd, cptsd] = ids
  mapa = guardarPerfil(mapa, adhd, { edad: 22, detonantes: ['Stress'] })
  mapa = aceptarSugerencia(mapa, { texto: 'Solo de ADHD (sugerido)', diagnosticoIds: [adhd] }).mapa
  mapa = aceptarSugerencia(mapa, { texto: 'Compartido (sugerido)', diagnosticoIds: [adhd, cptsd] }).mapa
  mapa = agregarSintoma(mapa, { texto: 'Mío, solo de ADHD', diagnosticoIds: [adhd], notas: 'Mis notas' }).mapa
  mapa = agregarSintoma(mapa, { texto: 'Mío, de C-PTSD', diagnosticoIds: [cptsd] }).mapa

  const despues = quitarDiagnostico(mapa, adhd)
  const textos = despues.sintomas.map(s => s.texto)

  assert.equal(textos.includes('Solo de ADHD (sugerido)'), false, 'el sugerido que solo dependía de él desaparece')
  assert.ok(textos.includes('Compartido (sugerido)'), 'el compartido se conserva')
  const mio = despues.sintomas.find(s => s.texto === 'Mío, solo de ADHD')
  assert.ok(mio, 'el escrito por la persona se conserva')
  assert.equal(mio.notas, 'Mis notas')
  assert.ok(textos.includes('Mío, de C-PTSD'), 'lo que no dependía de él no cambia')

  assert.equal(despues.conexiones.some(c => c.diagnosticoId === adhd), false)
  assert.equal(despues.perfiles[adhd], undefined, 'su perfil también se borra')

  const vista = construirVista(despues)
  assert.equal(vista.sintomas.find(s => s.texto === 'Mío, solo de ADHD').tipo, 'flotante')
  assert.equal(vista.sintomas.find(s => s.texto === 'Compartido (sugerido)').tipo, 'unico')

  // Volver a agregarlo no restaura conexiones antiguas.
  const readd = agregarDiagnostico(despues, { etiqueta: 'ADHD' })
  assert.equal(readd.mapa.conexiones.some(c => c.diagnosticoId === readd.diagnosticoId), false)
})

// ── Colocación ────────────────────────────────────────────────

test('colocación: mientras nadie mueva nada, los diagnósticos van en fila', () => {
  const { mapa } = conDiagnosticos(['A', 'B', 'C', 'D'])
  const pos = posicionesDiagnosticos(mapa).map(p => p.posicion)
  assert.ok(pos.every(p => p.y === FILA_Y))
  assert.ok(pos.every((p, i) => i === 0 || p.x > pos[i - 1].x))
})

test('colocación: lo que la persona mueve no salta de lugar al agregar algo nuevo', () => {
  let { mapa, ids } = conDiagnosticos(['A', 'B', 'C'])
  const antes = posicionesDiagnosticos(mapa)
  mapa = moverDiagnostico(mapa, ids[0], { x: 120, y: 400 })
  mapa = agregarDiagnostico(mapa, { etiqueta: 'D' }).mapa
  const despues = posicionesDiagnosticos(mapa)

  assert.deepEqual(despues[0].posicion, { x: 120, y: 400 })
  assert.deepEqual(despues[1].posicion, antes[1].posicion)
  assert.deepEqual(despues[2].posicion, antes[2].posicion)
  const nuevo = despues[3].posicion
  for (const p of despues.slice(0, 3)) {
    assert.ok(Math.hypot(p.posicion.x - nuevo.x, p.posicion.y - nuevo.y) >= DISTANCIA_LIBRE)
  }
})

test('colocación: arrastrar un síntoma solo cambia su lugar, no sus conexiones', () => {
  const { mapa } = escenarioAprobado()
  const id = mapa.sintomas[6].id
  const movido = moverSintoma(mapa, id, { x: 300.4, y: 200.6 })
  assert.deepEqual(movido.conexiones, mapa.conexiones)
  const v = construirVista(movido).sintomas.find(s => s.id === id)
  assert.deepEqual([v.x, v.y], [300, 201])
})

// ── Vista: el escenario aprobado ──────────────────────────────

test('vista: escenario aprobado — tipos de nodo, arcos iguales y una arista por diagnóstico', () => {
  const { mapa } = escenarioAprobado()
  const v = construirVista(mapa)

  assert.deepEqual(v.diagnosticos.map(d => [d.etiqueta, d.slot]), [['ADHD', 1], ['BPD Borderline', 4], ['C-PTSD', 8]])

  const porTipo = t => v.sintomas.filter(s => s.tipo === t).map(s => s.texto)
  assert.equal(porTipo('unico').length, 5)
  assert.deepEqual(porTipo('compartido'), ['Sleep falls apart', 'Starting anything feels impossible', 'Shame spirals fast'])
  assert.deepEqual(porTipo('flotante'), ['Hard to explain to other people'])

  const seg = t => v.sintomas.find(s => s.texto === t).segmentos
  assert.deepEqual(seg('Sleep falls apart'), [1, 8])
  assert.deepEqual(seg('Starting anything feels impossible'), [1, 4, 8])
  assert.deepEqual(seg('Shame spirals fast'), [4, 8])
  // Arcos iguales: solo se pasan los colores, nunca pesos.
  assert.ok(v.sintomas.every(s => s.segmentos === null || s.segmentos.every(x => Number.isInteger(x))))

  assert.equal(v.aristas.length, 5 + 2 + 3 + 2)
  const flotante = v.sintomas.find(s => s.tipo === 'flotante')
  assert.equal(v.aristas.some(a => a.sintomaId === flotante.id), false)
  assert.equal(v.cadena.length, 2)
})

test('vista: no existen relaciones síntoma → síntoma', () => {
  const { mapa } = escenarioAprobado()
  const v = construirVista(mapa)
  const diagIds = new Set(mapa.diagnosticos.map(d => d.id))
  assert.ok(v.aristas.every(a => diagIds.has(a.diagnosticoId)))
})

test('vista: todo queda dentro del mapa, sin nodos encimados y con su etiqueta', () => {
  const { mapa } = escenarioAprobado()
  const v = construirVista(mapa)
  const nodos = [...v.diagnosticos, ...v.sintomas]
  for (const n of nodos) {
    assert.ok(n.x >= 0 && n.x <= MUNDO.ancho && n.y >= 0 && n.y <= MUNDO.alto, `fuera del mapa: ${n.etiqueta || n.texto}`)
    assert.ok((n.etiqueta || n.texto).length > 0)
  }
  for (let i = 0; i < nodos.length; i++) {
    for (let j = i + 1; j < nodos.length; j++) {
      const d = Math.hypot(nodos[i].x - nodos[j].x, nodos[i].y - nodos[j].y)
      assert.ok(d >= 56, `encimados: ${nodos[i].etiqueta || nodos[i].texto} / ${nodos[j].etiqueta || nodos[j].texto}`)
    }
  }
})

test('vista: es determinista (el mismo mapa siempre se ve igual)', () => {
  assert.deepEqual(construirVista(escenarioAprobado().mapa), construirVista(escenarioAprobado().mapa))
})

test('vista: un mapa guardado y vuelto a cargar se ve igual', () => {
  const { mapa } = escenarioAprobado()
  const recargado = JSON.parse(JSON.stringify(mapa))
  assert.deepEqual(construirVista(recargado), construirVista(mapa))
})

test('vista: un mapa grande (5 diagnósticos, 25 síntomas) tampoco encima nodos', () => {
  let { mapa, ids } = conDiagnosticos(['ADHD', 'Autism', 'BPD', 'C-PTSD', 'Generalised anxiety'])
  const grupos = [[0], [1], [2], [3], [4], [0, 1], [1, 2], [0, 3], [2, 3, 4], []]
  for (let i = 0; i < 25; i++) {
    const g = grupos[i % grupos.length].map(j => ids[j])
    mapa = agregarSintoma(mapa, { texto: 'Síntoma ' + i, diagnosticoIds: g }).mapa
  }
  const v = construirVista(mapa)
  const nodos = [...v.diagnosticos, ...v.sintomas]
  let menor = Infinity
  for (let i = 0; i < nodos.length; i++) {
    const n = nodos[i]
    // El mapa puede crecer hacia abajo, pero todo queda dentro de sus límites.
    assert.ok(n.x >= v.limites.x && n.x <= v.limites.x + v.limites.ancho && n.y <= v.limites.y + v.limites.alto)
    for (let j = i + 1; j < nodos.length; j++) {
      menor = Math.min(menor, Math.hypot(n.x - nodos[j].x, n.y - nodos[j].y))
    }
  }
  assert.ok(menor >= 56, `distancia mínima ${menor.toFixed(0)}px`)
})

function etiquetasQueSeCruzan(v) {
  const cajas = [
    ...v.diagnosticos.map(d => ({ nombre: d.etiqueta, caja: cajaDiagnostico(d) })),
    ...v.sintomas.map(n => ({ nombre: n.texto, caja: cajaSintoma(n) })),
  ]
  const choques = []
  for (let i = 0; i < cajas.length; i++) {
    for (let j = i + 1; j < cajas.length; j++) {
      if (i < v.diagnosticos.length && j < v.diagnosticos.length) continue // diagnósticos entre sí: los controla la fila
      if (seCruzan(cajas[i].caja, cajas[j].caja)) choques.push(cajas[i].nombre + ' / ' + cajas[j].nombre)
    }
  }
  return choques
}

test('vista: en el escenario aprobado ninguna etiqueta se cruza con otra', () => {
  assert.deepEqual(etiquetasQueSeCruzan(construirVista(escenarioAprobado().mapa)), [])
})

test('vista: en un mapa grande (5 diagnósticos, 25 síntomas) ninguna etiqueta se cruza', () => {
  let { mapa, ids } = conDiagnosticos(['ADHD', 'Autism', 'BPD', 'C-PTSD', 'Generalised anxiety'])
  const grupos = [[0], [1], [2], [3], [4], [0, 1], [1, 2], [0, 3], [2, 3, 4], []]
  for (let i = 0; i < 25; i++) {
    mapa = agregarSintoma(mapa, { texto: 'Síntoma ' + i, diagnosticoIds: grupos[i % grupos.length].map(j => ids[j]) }).mapa
  }
  assert.deepEqual(etiquetasQueSeCruzan(construirVista(mapa)), [])
})

test('color: la persona puede cambiarlo después de crear el diagnóstico, y el mapa entero lo refleja', () => {
  const { mapa, adhd } = escenarioAprobado()
  const cambiado = cambiarColor(mapa, adhd, 10)
  assert.deepEqual(cambiado.conexiones, mapa.conexiones, 'cambiar el color no cambia las relaciones')
  const v = construirVista(cambiado)
  assert.equal(v.diagnosticos.find(d => d.id === adhd).slot, 10)
  assert.deepEqual(v.sintomas.find(s => s.texto === 'Starting anything feels impossible').segmentos, [10, 4, 8])
  assert.ok(v.aristas.filter(a => a.diagnosticoId === adhd).every(a => a.slot === 10))
  assert.ok(v.diagnosticos.filter(d => d.id !== adhd).every(d => d.slot !== 10), 'nadie más cambia de color')
})
