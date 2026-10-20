// ─────────────────────────────────────────────────────────────
// AvisoSintoma.jsx — what "Add" connected a symptom to
//
// NEW (Ana's decision of 20 Oct 2026, docs/FUENTES-Y-DECISIONES.md §3c):
// after "Add", the AI has placed the symptom. This notice says where, with the
// reason for each connection, and lets the person undo it:
// - "Remove" takes one connection away (only while another one remains, so
//   the symptom never turns grey);
// - "Undo" removes a symptom that was just created.
// It stays until the person closes it (no timer, WCAG 2.2.1).
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import { diagnosticosDe } from '@nucleo/mapa.js'
import { ds } from '../ds/index.js'

// "A", "A and B", "A, B and C".
export function enumerar(nombres) {
  if (nombres.length <= 1) return nombres.join('')
  return `${nombres.slice(0, -1).join(', ')} and ${nombres[nombres.length - 1]}`
}

export default function AvisoSintoma({ mapa, aviso, onQuitar, onDeshacer, onCerrar }) {
  const { Button, IconButton, Icon } = ds()
  const caja = useRef(null)
  useEffect(() => { caja.current?.focus() }, [aviso.sintomaId])

  const sintoma = mapa.sintomas.find(s => s.id === aviso.sintomaId)
  if (!sintoma) return null
  const actuales = diagnosticosDe(mapa, sintoma.id)
  const filas = aviso.conexiones
    .map(c => ({ ...c, diagnostico: actuales.find(d => d.id === c.diagnosticoId) }))
    .filter(c => c.diagnostico)

  let titulo
  if (!aviso.fusionado) titulo = 'Added to your map'
  else if (filas.length > 0) titulo = 'Already on your map — connections added'
  else titulo = 'Already on your map'

  return (
    <section className="aviso-sintoma" role="status" aria-label={titulo} tabIndex={-1} ref={caja}>
      <div className="aviso-sintoma__cabeza">
        <div>
          <p className="sm-emphasis aviso-sintoma__titulo">{titulo}</p>
          <p className="sm-body-sm aviso-sintoma__palabras">“{sintoma.texto}”</p>
        </div>
        <IconButton label="Close" variant="ghost" size="sm" onClick={onCerrar}>
          <Icon name="close" size={14} color="var(--sm-ink-meta)" />
        </IconButton>
      </div>
      {filas.length > 0 && (
        <>
          <p className="sm-body-sm aviso-sintoma__resumen">Connected to {enumerar(filas.map(f => f.diagnostico.etiqueta))}.</p>
          <ul className="aviso-sintoma__lista">
            {filas.map(f => (
              <li key={f.diagnosticoId} className="aviso-sintoma__fila">
                <span className="conexion__punto" style={{ background: `var(--sm-dx-${f.diagnostico.slot}-base)` }} aria-hidden="true" />
                <span className="aviso-sintoma__texto">
                  <span className="sm-emphasis">{f.diagnostico.etiqueta}</span>
                  {f.razon && <span className="sm-quote">{f.razon}</span>}
                </span>
                {actuales.length > 1 && (
                  <Button variant="link" size="sm" onClick={() => onQuitar(sintoma.id, f.diagnosticoId)} aria-label={`Remove connection to ${f.diagnostico.etiqueta}`}>
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <p className="sm-support aviso-sintoma__nota">These are possibilities, not conclusions.</p>
        </>
      )}
      <div className="aviso-sintoma__acciones">
        {!aviso.fusionado && <Button variant="ghost" size="sm" onClick={() => onDeshacer(sintoma.id)}>Undo</Button>}
        <Button variant="secondary" size="sm" onClick={onCerrar}>Done</Button>
      </div>
    </section>
  )
}
