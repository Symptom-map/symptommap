// ─────────────────────────────────────────────────────────────
// vista.js — lo que la interfaz tiene que dibujar
//
// Convierte un mapa en una lista de nodos y aristas listos para
// pintar con los componentes del design system (DiagnosisNode,
// SymptomNode, Connection) o con cualquier otro motor de dibujo.
// No dibuja nada: solo calcula.
//
// Tipos de nodo (Handoff §7):
//   diagnóstico  → círculo grande con su color
//   'unico'      → síntoma de un diagnóstico: punto de un color
//   'compartido' → síntoma de 2 o más: un arco por diagnóstico, en
//                  partes iguales (decisión 8 oct 2026: sin pesos)
//   'flotante'   → síntoma sin diagnóstico ("Origin not placed yet")
//
// Aristas: una por cada diagnóstico de un síntoma, curva, del color de
// ese diagnóstico. Los diagnósticos se unen entre sí con una cadena
// neutral (sin color de diagnóstico).
// ─────────────────────────────────────────────────────────────

import { diagnosticosDe, posicionesDiagnosticos, posicionesSintomas } from './mapa.js'
import { curvaArista, MUNDO } from './colocacion.js'

export function construirVista(mapa) {
  const posDiag = posicionesDiagnosticos(mapa)
  const posPorDiag = Object.fromEntries(posDiag.map(p => [p.id, p.posicion]))
  const posPorSintoma = Object.fromEntries(posicionesSintomas(mapa, posDiag).map(p => [p.id, p.posicion]))
  const diagPorId = Object.fromEntries(mapa.diagnosticos.map(d => [d.id, d]))

  const diagnosticos = posDiag.map(({ id, posicion }) => ({
    id,
    etiqueta: diagPorId[id].etiqueta,
    slot: diagPorId[id].slot,
    x: posicion.x,
    y: posicion.y,
  }))

  const sintomas = []
  const aristas = []

  for (const s of mapa.sintomas) {
    const diags = diagnosticosDe(mapa, s.id)
    const tipo = diags.length === 0 ? 'flotante' : diags.length === 1 ? 'unico' : 'compartido'
    const p = posPorSintoma[s.id]
    sintomas.push({
      id: s.id,
      texto: s.texto,
      origen: s.origen,
      tipo,
      diagnosticoIds: diags.map(d => d.id),
      // Color del punto (único) o null (flotante usa el gris neutro).
      slot: tipo === 'unico' ? diags[0].slot : null,
      // Un arco por diagnóstico, siempre en partes iguales.
      segmentos: tipo === 'compartido' ? diags.map(d => d.slot) : null,
      x: p.x,
      y: p.y,
    })

    diags.forEach((d, i) => {
      const desde = posPorDiag[d.id]
      aristas.push({
        sintomaId: s.id,
        diagnosticoId: d.id,
        slot: d.slot,
        x1: desde.x, y1: desde.y,
        x2: p.x, y2: p.y,
        curva: curvaArista(i, diags.length),
      })
    })
  }

  const cadena = diagnosticos.slice(0, -1).map((d, i) => ({
    desdeId: d.id,
    hastaId: diagnosticos[i + 1].id,
    x1: d.x, y1: d.y,
    x2: diagnosticos[i + 1].x, y2: diagnosticos[i + 1].y,
  }))

  // Rectángulo que contiene todo el mapa, para que la interfaz pueda
  // ajustar el zoom ("ver todo"). Nunca es más chico que el área base.
  const xs = [0, MUNDO.ancho, ...diagnosticos.map(d => d.x), ...sintomas.map(s => s.x)]
  const ys = [0, MUNDO.alto, ...diagnosticos.map(d => d.y), ...sintomas.map(s => s.y + 46)]
  const limites = { x: Math.min(...xs), y: Math.min(...ys), ancho: Math.max(...xs) - Math.min(...xs), alto: Math.max(...ys) - Math.min(...ys) }

  return { diagnosticos, sintomas, aristas, cadena, limites }
}
