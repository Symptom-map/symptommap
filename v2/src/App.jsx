// ─────────────────────────────────────────────────────────────
// App.jsx — primera pantalla de la v2
//
// Por ahora muestra el mapa del escenario aprobado, generado por el núcleo
// y dibujado con los componentes del design system. Se puede arrastrar y
// hacer zoom. Todavía no hay cuentas ni almacenamiento: nada se guarda.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import { moverDiagnostico, moverSintoma } from '@nucleo/mapa.js'
import { ds } from './ds/index.js'
import MapaVista from './mapa/MapaVista.jsx'
import { mapaDeEjemplo } from './mapa/ejemplo.js'

export default function App() {
  const { AppHeader } = ds()
  const [mapa, setMapa] = useState(mapaDeEjemplo)

  function mover(tipo, id, posicion) {
    setMapa(actual => (tipo === 'diagnostico' ? moverDiagnostico(actual, id, posicion) : moverSintoma(actual, id, posicion)))
  }

  return (
    <div className="app">
      <AppHeader context="Example map" />
      <main className="app__principal">
        <h1 className="sr-only">Example map</h1>
        <MapaVista mapa={mapa} onMover={mover} />
        <p className="app__aviso">Development preview · nothing is saved yet</p>
      </main>
    </div>
  )
}
