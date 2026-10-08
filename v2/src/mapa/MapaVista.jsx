// ─────────────────────────────────────────────────────────────
// MapaVista.jsx — dibuja un mapa con los componentes del design system
//
// No decide nada sobre los nodos: llama a construirVista() del núcleo
// (src/core) y dibuja lo que devuelve. Arrastrar un nodo solo le avisa al
// componente padre (onMover), que usa moverDiagnostico / moverSintoma.
// ─────────────────────────────────────────────────────────────

import { useMemo, useRef, useState } from 'react'
import { construirVista } from '@nucleo/vista.js'
import { ds } from '../ds/index.js'

const TAM_DIAGNOSTICO = 74
const TAM_SINTOMA = 17
const TAM_SINTOMA_COMPARTIDO = 26
const ZOOM_MIN = 0.5
const ZOOM_MAX = 2

// Un síntoma flotante ("Origin not placed yet") usa el gris neutro del design system.
const ESTILO_FLOTANTE = { '--dx-base': 'var(--sm-grey)', '--dx-halo': 'transparent' }

export default function MapaVista({ mapa, onMover }) {
  const { DiagnosisNode, SymptomNode, Connection, ConnectionLayer, MapControls } = ds()
  const vista = useMemo(() => construirVista(mapa), [mapa])
  const [zoom, setZoom] = useState(1)
  const [desplazamiento, setDesplazamiento] = useState({ x: 0, y: 0 })
  const [arrastre, setArrastre] = useState(null) // { tipo, id, dx, dy }
  const contenedor = useRef(null)

  const { limites } = vista

  // Coordenadas del puntero → coordenadas del mapa (descontando zoom y desplazamiento).
  function aMapa(evento) {
    const caja = contenedor.current.getBoundingClientRect()
    return {
      x: (evento.clientX - caja.left - desplazamiento.x) / zoom + limites.x,
      y: (evento.clientY - caja.top - desplazamiento.y) / zoom + limites.y,
    }
  }

  function empezarArrastre(evento, tipo, id, x, y) {
    evento.stopPropagation()
    evento.currentTarget.setPointerCapture(evento.pointerId)
    const p = aMapa(evento)
    setArrastre({ tipo, id, dx: p.x - x, dy: p.y - y, x, y })
  }

  function moverArrastre(evento) {
    if (!arrastre) return
    const p = aMapa(evento)
    setArrastre({ ...arrastre, x: p.x - arrastre.dx, y: p.y - arrastre.dy })
  }

  function terminarArrastre() {
    if (!arrastre) return
    onMover?.(arrastre.tipo, arrastre.id, { x: arrastre.x, y: arrastre.y })
    setArrastre(null)
  }

  // Mover el lienzo arrastrando el fondo.
  const [paneo, setPaneo] = useState(null)
  function empezarPaneo(evento) {
    evento.currentTarget.setPointerCapture(evento.pointerId)
    setPaneo({ x: evento.clientX - desplazamiento.x, y: evento.clientY - desplazamiento.y })
  }
  function moverPaneo(evento) {
    if (paneo) setDesplazamiento({ x: evento.clientX - paneo.x, y: evento.clientY - paneo.y })
    else moverArrastre(evento)
  }
  function terminarPaneo() {
    if (paneo) setPaneo(null)
    else terminarArrastre()
  }

  // Mientras se arrastra, se dibuja en la posición provisional (sin tocar el mapa).
  const posicion = (tipo, id, x, y) =>
    arrastre && arrastre.tipo === tipo && arrastre.id === id ? { x: arrastre.x, y: arrastre.y } : { x, y }

  const posDiag = Object.fromEntries(vista.diagnosticos.map(d => [d.id, posicion('diagnostico', d.id, d.x, d.y)]))
  const posSint = Object.fromEntries(vista.sintomas.map(s => [s.id, posicion('sintoma', s.id, s.x, s.y)]))

  return (
    <div
      ref={contenedor}
      className="mapa"
      onPointerDown={empezarPaneo}
      onPointerMove={moverPaneo}
      onPointerUp={terminarPaneo}
      onPointerCancel={terminarPaneo}
    >
      <div
        className="mapa__mundo"
        style={{
          width: limites.ancho,
          height: limites.alto,
          transform: `translate(${desplazamiento.x}px, ${desplazamiento.y}px) scale(${zoom})`,
        }}
      >
        <ConnectionLayer width={limites.ancho} height={limites.alto} viewBox={`${limites.x} ${limites.y} ${limites.ancho} ${limites.alto}`}>
          {vista.cadena.map(c => {
            const a = posDiag[c.desdeId], b = posDiag[c.hastaId]
            return <Connection key={'cadena-' + c.desdeId} x1={a.x} y1={a.y} x2={b.x} y2={b.y} variant="neutral" />
          })}
          {vista.aristas.map(a => {
            const d = posDiag[a.diagnosticoId], s = posSint[a.sintomaId]
            return (
              <Connection
                key={a.sintomaId + '-' + a.diagnosticoId}
                x1={d.x} y1={d.y} x2={s.x} y2={s.y}
                slot={a.slot}
                variant="diagnosis"
                curve={a.curva}
                style={{ strokeOpacity: 0.88, strokeWidth: 1.9 }}
              />
            )
          })}
        </ConnectionLayer>

        {vista.diagnosticos.map(d => {
          const p = posDiag[d.id]
          return (
            <div
              key={d.id}
              className="mapa__nodo"
              style={{ left: p.x - limites.x, top: p.y - limites.y, transform: 'translate(-50%, -50%)' }}
              onPointerDown={e => empezarArrastre(e, 'diagnostico', d.id, p.x, p.y)}
            >
              <DiagnosisNode label={d.etiqueta} slot={d.slot} size={TAM_DIAGNOSTICO} />
            </div>
          )
        })}

        {vista.sintomas.map(s => {
          const p = posSint[s.id]
          const tam = s.tipo === 'compartido' ? TAM_SINTOMA_COMPARTIDO : TAM_SINTOMA
          return (
            <div
              key={s.id}
              className="mapa__nodo mapa__nodo--sintoma"
              style={{ left: p.x - limites.x, top: p.y - limites.y - tam / 2 }}
              onPointerDown={e => empezarArrastre(e, 'sintoma', s.id, p.x, p.y)}
            >
              <SymptomNode
                label={s.texto}
                slot={s.slot ?? 1}
                size={tam}
                shared={s.tipo === 'compartido'}
                segments={s.segmentos ?? undefined}
                style={s.tipo === 'flotante' ? ESTILO_FLOTANTE : undefined}
              />
            </div>
          )
        })}
      </div>

      <div className="mapa__controles" onPointerDown={e => e.stopPropagation()}>
        <MapControls
          onZoomIn={() => setZoom(z => Math.min(ZOOM_MAX, +(z + 0.1).toFixed(2)))}
          onZoomOut={() => setZoom(z => Math.max(ZOOM_MIN, +(z - 0.1).toFixed(2)))}
        />
      </div>
    </div>
  )
}
