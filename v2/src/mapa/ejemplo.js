// Mapa de ejemplo: el escenario aprobado del prototipo (el mismo que usan
// las pruebas del núcleo). Se construye con las funciones del núcleo, igual
// que lo hará la persona desde la interfaz.

import { crearMapa, agregarDiagnostico, agregarSintoma } from '@nucleo/mapa.js'

function construir() {
  let mapa = crearMapa()
  const ids = []
  for (const [etiqueta, slot] of [['ADHD', 1], ['BPD Borderline', 4], ['C-PTSD', 8]]) {
    const r = agregarDiagnostico(mapa, { etiqueta, slot })
    mapa = r.mapa
    ids.push(r.diagnosticoId)
  }
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
  return mapa
}

export const mapaDeEjemplo = construir()
