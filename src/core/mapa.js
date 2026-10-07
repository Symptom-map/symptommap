// ─────────────────────────────────────────────────────────────
// mapa.js — núcleo del mapa: qué nodos existen y cómo se relacionan
//
// Este módulo es el corazón de SymptomMap. No toca el DOM, el canvas,
// React ni el almacenamiento: recibe un mapa y devuelve un mapa nuevo.
// La interfaz (la actual o la v2) solo llama a estas funciones y dibuja
// lo que devuelve vista.js. Así, cambiar la interfaz o el lugar donde se
// guardan los datos no puede romper cómo se generan los nodos.
//
// Fuentes de las reglas:
//   - Handoff §7 (lógica del mapa) y §8 (síntomas compartidos)
//   - MVP Functional Inventory §6 (síntomas) y §7 (relaciones)
//   - MVP Data Map §2–§3 (entidades)
//   - Decisiones del 8 oct 2026:
//       · no existen relaciones síntoma → síntoma (todo es síntoma)
//       · los arcos de un síntoma compartido son siempre iguales
//       · la persona puede elegir el color de un diagnóstico
//       · máximo 10 diagnósticos por mapa
//       · borrar un diagnóstico borra también su perfil
//
// Forma del mapa:
// {
//   version: 1,
//   diagnosticos: [{ id, etiqueta, claveCanonica, slot, orden, posicion }],
//   perfiles:     { [diagnosticoId]: { ...respuestas } },
//   sintomas:     [{ id, texto, origen, cuando, notas, posicion }],
//   conexiones:   [{ sintomaId, diagnosticoId }],
//   siguienteId:  número
// }
// posicion es null mientras la persona no haya movido el nodo: en ese
// caso se calcula (ver posicionesDiagnosticos / posicionesSintomas).
// origen: 'persona' (lo escribió la persona) | 'sugerencia' (lo aceptó
// de "Suggest symptoms"). Una sugerencia aceptada sigue siendo de la
// persona: la conservó ella.
// ─────────────────────────────────────────────────────────────

import { slotParaAgregar } from './color.js'
import { xEnFila, FILA_Y, MUNDO, lugarLibre, lugarEnAbanico } from './colocacion.js'

export const MAX_DIAGNOSTICOS = 10
// Ancho reservado para la etiqueta de un síntoma (el SymptomNode del
// design system parte la etiqueta en hasta 2 líneas de 120 px).
export const ANCHO_ETIQUETA = 120
export const ORIGENES = ['persona', 'sugerencia']

export class ErrorMapa extends Error {
  constructor(codigo, mensaje) {
    super(mensaje || codigo)
    this.name = 'ErrorMapa'
    this.codigo = codigo
  }
}

// ── Utilidades ────────────────────────────────────────────────

/** Normaliza un texto para comparar: sin tildes, mayúsculas ni signos. */
export function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
}

function copiar(mapa) {
  return structuredClone(mapa)
}

function nuevoId(mapa, prefijo) {
  const id = prefijo + mapa.siguienteId
  mapa.siguienteId += 1
  return id
}

function buscarDiagnostico(mapa, id) {
  const d = mapa.diagnosticos.find(x => x.id === id)
  if (!d) throw new ErrorMapa('DIAGNOSTICO_NO_EXISTE')
  return d
}

function buscarSintoma(mapa, id) {
  const s = mapa.sintomas.find(x => x.id === id)
  if (!s) throw new ErrorMapa('SINTOMA_NO_EXISTE')
  return s
}

function validarSlot(mapa, slot, diagnosticoId = null) {
  if (!Number.isInteger(slot) || slot < 1 || slot > 10) throw new ErrorMapa('COLOR_INVALIDO')
  const enUso = mapa.diagnosticos.some(d => d.slot === slot && d.id !== diagnosticoId)
  if (enUso) throw new ErrorMapa('COLOR_EN_USO')
}

// ── Mapa ──────────────────────────────────────────────────────

export function crearMapa() {
  return { version: 1, diagnosticos: [], perfiles: {}, sintomas: [], conexiones: [], siguienteId: 1 }
}

/** Diagnósticos de un síntoma, en el orden en que se agregaron al mapa. */
export function diagnosticosDe(mapa, sintomaId) {
  const ids = mapa.conexiones.filter(c => c.sintomaId === sintomaId).map(c => c.diagnosticoId)
  return mapa.diagnosticos.filter(d => ids.includes(d.id)).sort((a, b) => a.orden - b.orden)
}

// ── Diagnósticos ──────────────────────────────────────────────

/** El color que el sistema propone para el próximo diagnóstico (Regla 02). */
export function proponerColor(mapa) {
  return slotParaAgregar(mapa.diagnosticos.map(d => d.slot))
}

/** Colores que la persona puede elegir para un diagnóstico (los que no usa otro). */
export function coloresDisponibles(mapa, diagnosticoId = null) {
  const usados = mapa.diagnosticos.filter(d => d.id !== diagnosticoId).map(d => d.slot)
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(s => !usados.includes(s))
}

/**
 * Agrega un diagnóstico. Si ya existe (misma clave reconocida o mismo
 * nombre), no lo duplica: devuelve el existente con yaExistia = true.
 * slot es opcional: si la persona no eligió color, se usa el propuesto.
 */
export function agregarDiagnostico(mapaOriginal, { etiqueta, claveCanonica = null, slot } = {}) {
  const texto = String(etiqueta || '').trim()
  if (!texto) throw new ErrorMapa('ETIQUETA_VACIA')

  const existente = mapaOriginal.diagnosticos.find(d =>
    (claveCanonica && d.claveCanonica === claveCanonica) || normalizar(d.etiqueta) === normalizar(texto))
  if (existente) return { mapa: mapaOriginal, diagnosticoId: existente.id, yaExistia: true }

  if (mapaOriginal.diagnosticos.length >= MAX_DIAGNOSTICOS) throw new ErrorMapa('LIMITE_DIAGNOSTICOS')

  const mapa = copiar(mapaOriginal)
  const slotFinal = slot == null ? proponerColor(mapa) : slot
  validarSlot(mapa, slotFinal)

  // Si la persona ya ordenó su mapa, el nuevo busca un lugar libre y
  // queda fijo ahí; si no, se calcula en la fila.
  const ordenado = mapa.diagnosticos.some(d => d.posicion)
  const posicion = ordenado ? lugarLibre(posicionesDiagnosticos(mapa).map(p => p.posicion)) : null

  const orden = mapa.diagnosticos.reduce((m, d) => Math.max(m, d.orden + 1), 0)
  const id = nuevoId(mapa, 'd')
  mapa.diagnosticos.push({ id, etiqueta: texto, claveCanonica: claveCanonica || null, slot: slotFinal, orden, posicion })
  return { mapa, diagnosticoId: id, yaExistia: false }
}

/** La persona elige otro color para un diagnóstico (no puede repetir uno en uso). */
export function cambiarColor(mapaOriginal, diagnosticoId, slot) {
  const mapa = copiar(mapaOriginal)
  const d = buscarDiagnostico(mapa, diagnosticoId)
  validarSlot(mapa, slot, diagnosticoId)
  d.slot = slot
  return mapa
}

export function guardarPerfil(mapaOriginal, diagnosticoId, perfil) {
  const mapa = copiar(mapaOriginal)
  buscarDiagnostico(mapa, diagnosticoId)
  mapa.perfiles[diagnosticoId] = structuredClone(perfil || {})
  return mapa
}

/**
 * Quita un diagnóstico del mapa (Functional Inventory §7):
 * - se borran sus conexiones y su perfil;
 * - un síntoma sugerido que solo dependía de él desaparece;
 * - un síntoma compartido conserva sus otras conexiones;
 * - un síntoma escrito por la persona se conserva aunque quede sin
 *   conexiones ("Origin not placed yet"), con su texto y notas.
 * Volver a agregar el diagnóstico no restaura conexiones antiguas.
 */
export function quitarDiagnostico(mapaOriginal, diagnosticoId) {
  const mapa = copiar(mapaOriginal)
  buscarDiagnostico(mapa, diagnosticoId)

  const afectados = mapa.conexiones.filter(c => c.diagnosticoId === diagnosticoId).map(c => c.sintomaId)
  mapa.diagnosticos = mapa.diagnosticos.filter(d => d.id !== diagnosticoId)
  mapa.conexiones = mapa.conexiones.filter(c => c.diagnosticoId !== diagnosticoId)
  delete mapa.perfiles[diagnosticoId]

  const sinConexion = id => !mapa.conexiones.some(c => c.sintomaId === id)
  const eliminar = new Set(
    mapa.sintomas.filter(s => afectados.includes(s.id) && s.origen === 'sugerencia' && sinConexion(s.id)).map(s => s.id)
  )
  mapa.sintomas = mapa.sintomas.filter(s => !eliminar.has(s.id))
  return mapa
}

/** La persona arrastra un diagnóstico. Solo cambia su lugar, nunca sus relaciones. */
export function moverDiagnostico(mapaOriginal, diagnosticoId, { x, y }) {
  const mapa = copiar(mapaOriginal)
  buscarDiagnostico(mapa, diagnosticoId)
  // La primera vez que la persona ordena su mapa, todos los diagnósticos
  // quedan fijos donde estaban, para que nada salte de lugar después.
  if (!mapa.diagnosticos.some(d => d.posicion)) {
    for (const p of posicionesDiagnosticos(mapa)) {
      mapa.diagnosticos.find(d => d.id === p.id).posicion = p.posicion
    }
  }
  mapa.diagnosticos.find(d => d.id === diagnosticoId).posicion = { x: Math.round(x), y: Math.round(y) }
  return mapa
}

// ── Síntomas ──────────────────────────────────────────────────

/**
 * Agrega un síntoma con las palabras de la persona (nunca se reescriben).
 * Si ya hay un síntoma con el mismo texto, no se crea otro: se le suman
 * las conexiones nuevas (fusionado = true).
 */
export function agregarSintoma(mapaOriginal, { texto, diagnosticoIds = [], origen = 'persona', cuando = '', notas = '' } = {}) {
  const palabras = String(texto || '').trim()
  if (!palabras) throw new ErrorMapa('TEXTO_VACIO')
  if (!ORIGENES.includes(origen)) throw new ErrorMapa('ORIGEN_INVALIDO')

  const mapa = copiar(mapaOriginal)
  const ids = [...new Set(diagnosticoIds)]
  ids.forEach(id => buscarDiagnostico(mapa, id))

  const existente = mapa.sintomas.find(s => normalizar(s.texto) === normalizar(palabras))
  if (existente) {
    for (const id of ids) {
      if (!mapa.conexiones.some(c => c.sintomaId === existente.id && c.diagnosticoId === id)) {
        mapa.conexiones.push({ sintomaId: existente.id, diagnosticoId: id })
      }
    }
    return { mapa, sintomaId: existente.id, fusionado: true }
  }

  const id = nuevoId(mapa, 's')
  mapa.sintomas.push({ id, texto: palabras, origen, cuando: String(cuando), notas: String(notas), posicion: null })
  ids.forEach(diagnosticoId => mapa.conexiones.push({ sintomaId: id, diagnosticoId }))
  return { mapa, sintomaId: id, fusionado: false }
}

/**
 * La persona elige "Add" en una sugerencia. Solo se conecta a los
 * diagnósticos que siguen en el mapa. La AI nunca llama a esta función
 * por su cuenta: siempre es una acción de la persona.
 */
export function aceptarSugerencia(mapa, { texto, diagnosticoIds = [] } = {}) {
  const vigentes = diagnosticoIds.filter(id => mapa.diagnosticos.some(d => d.id === id))
  if (vigentes.length === 0) throw new ErrorMapa('SUGERENCIA_SIN_DIAGNOSTICO')
  return agregarSintoma(mapa, { texto, diagnosticoIds: vigentes, origen: 'sugerencia' })
}

export function conectar(mapaOriginal, sintomaId, diagnosticoId) {
  const mapa = copiar(mapaOriginal)
  buscarSintoma(mapa, sintomaId)
  buscarDiagnostico(mapa, diagnosticoId)
  if (!mapa.conexiones.some(c => c.sintomaId === sintomaId && c.diagnosticoId === diagnosticoId)) {
    mapa.conexiones.push({ sintomaId, diagnosticoId })
  }
  return mapa
}

/** Quita una conexión. El síntoma se conserva aunque quede sin conexiones. */
export function desconectar(mapaOriginal, sintomaId, diagnosticoId) {
  const mapa = copiar(mapaOriginal)
  buscarSintoma(mapa, sintomaId)
  mapa.conexiones = mapa.conexiones.filter(c => !(c.sintomaId === sintomaId && c.diagnosticoId === diagnosticoId))
  return mapa
}

export function editarSintoma(mapaOriginal, sintomaId, cambios = {}) {
  const mapa = copiar(mapaOriginal)
  const s = buscarSintoma(mapa, sintomaId)
  if (cambios.texto !== undefined) {
    const palabras = String(cambios.texto).trim()
    if (!palabras) throw new ErrorMapa('TEXTO_VACIO')
    const repetido = mapa.sintomas.some(o => o.id !== sintomaId && normalizar(o.texto) === normalizar(palabras))
    if (repetido) throw new ErrorMapa('SINTOMA_DUPLICADO')
    s.texto = palabras
  }
  if (cambios.cuando !== undefined) s.cuando = String(cambios.cuando)
  if (cambios.notas !== undefined) s.notas = String(cambios.notas)
  return mapa
}

export function borrarSintoma(mapaOriginal, sintomaId) {
  const mapa = copiar(mapaOriginal)
  buscarSintoma(mapa, sintomaId)
  mapa.sintomas = mapa.sintomas.filter(s => s.id !== sintomaId)
  mapa.conexiones = mapa.conexiones.filter(c => c.sintomaId !== sintomaId)
  return mapa
}

/** La persona arrastra un síntoma. Solo cambia su lugar, nunca sus relaciones. */
export function moverSintoma(mapaOriginal, sintomaId, { x, y }) {
  const mapa = copiar(mapaOriginal)
  buscarSintoma(mapa, sintomaId).posicion = { x: Math.round(x), y: Math.round(y) }
  return mapa
}

// ── Posiciones ────────────────────────────────────────────────

/** Posición de cada diagnóstico: la que eligió la persona o la de la fila. */
export function posicionesDiagnosticos(mapa) {
  const ordenados = [...mapa.diagnosticos].sort((a, b) => a.orden - b.orden)
  const ordenado = ordenados.some(d => d.posicion)
  const salida = []
  ordenados.forEach((d, i) => {
    let posicion
    if (!ordenado) posicion = { x: xEnFila(i, ordenados.length), y: FILA_Y }
    else posicion = d.posicion || lugarLibre(salida.map(p => p.posicion))
    salida.push({ id: d.id, posicion })
  })
  return salida
}

/**
 * Posición de cada síntoma: la que eligió la persona o, si no la movió,
 * en abanico debajo de sus diagnósticos. Los síntomas que comparten
 * exactamente los mismos diagnósticos se reparten en el mismo abanico.
 */
export function posicionesSintomas(mapa, posDiagnosticos = posicionesDiagnosticos(mapa)) {
  const porId = Object.fromEntries(posDiagnosticos.map(p => [p.id, p.posicion]))

  // Espacio que ocupa cada nodo con su etiqueta. Los lugares ya tomados
  // son los diagnósticos y los síntomas que la persona movió.
  const ocupados = [
    ...posDiagnosticos.map(p => cajaDiagnostico(p.posicion)),
    ...mapa.sintomas.filter(s => s.posicion).map(s => cajaSintoma(s.posicion)),
  ]
  const libre = p => {
    const c = cajaSintoma(p)
    return ocupados.every(o => !seCruzan(o, c))
  }

  const siguientePorGrupo = {}
  return mapa.sintomas.map(s => {
    if (s.posicion) return { id: s.id, posicion: s.posicion }
    const diags = diagnosticosDe(mapa, s.id)
    const centros = diags.map(d => porId[d.id])
    const grupo = diags.map(d => d.id).join('+')

    // Siguiente lugar del abanico de su grupo; si choca con otro nodo o
    // etiqueta, prueba el siguiente lugar del mismo abanico.
    let k = siguientePorGrupo[grupo] || 0
    let posicion = lugarEnAbanico(centros, k)
    for (let intento = 0; intento < 60 && !libre(posicion); intento++) {
      k += 1
      posicion = lugarEnAbanico(centros, k)
    }
    // Si el abanico se llenó, busca en todo el mapa el lugar libre más
    // cercano a sus diagnósticos.
    if (!libre(posicion)) posicion = lugarLibreMasCercano(lugarEnAbanico(centros, 0), libre, ocupados)
    siguientePorGrupo[grupo] = k + 1
    ocupados.push(cajaSintoma(posicion))
    return { id: s.id, posicion }
  })
}

/** Caja aproximada de un síntoma: el punto y su etiqueta (2 líneas, 120 px) debajo. */
export function cajaSintoma(p) {
  return { x1: p.x - ANCHO_ETIQUETA / 2, x2: p.x + ANCHO_ETIQUETA / 2, y1: p.y - 14, y2: p.y + 46 }
}

/** Caja de un diagnóstico (círculo de 46 px de radio más un margen). */
export function cajaDiagnostico(p) {
  return { x1: p.x - 52, x2: p.x + 52, y1: p.y - 52, y2: p.y + 52 }
}

export function seCruzan(a, b) {
  return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2
}

/**
 * Recorre el mapa en una cuadrícula y devuelve el lugar libre más
 * cercano a `cerca`. Cuando el área inicial se llena, el mapa crece
 * hacia abajo (la interfaz tiene zoom y desplazamiento; vista.limites
 * indica hasta dónde llega). Determinista.
 */
function lugarLibreMasCercano(cerca, libre, ocupados) {
  let mejor = null
  let mejorDistancia = Infinity
  let respaldo = cerca
  let respaldoHolgura = -1
  for (let y = 90; y <= MUNDO.alto * 4; y += 20) {
    for (let x = 70; x <= MUNDO.ancho - 70; x += 20) {
      const p = { x, y }
      if (libre(p)) {
        const d = Math.hypot(x - cerca.x, y - cerca.y)
        if (d < mejorDistancia) { mejorDistancia = d; mejor = p }
      } else if (!mejor) {
        const holgura = Math.min(...ocupados.map(o => Math.hypot(x - (o.x1 + o.x2) / 2, y - (o.y1 + o.y2) / 2)))
        if (holgura > respaldoHolgura) { respaldoHolgura = holgura; respaldo = p }
      }
    }
  }
  return mejor || respaldo
}
