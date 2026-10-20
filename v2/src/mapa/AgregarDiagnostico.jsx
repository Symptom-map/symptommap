// ─────────────────────────────────────────────────────────────
// AgregarDiagnostico.jsx — the "Add a diagnosis" window (approved prototype)
//
// - Free text: the person writes their diagnosis in their own words. The
//   catalogue only suggests names (catalogo.js); "Use “…”" keeps their words.
// - Colour: the core proposes one (proponerColor) and the person can pick any
//   colour that no other diagnosis uses (coloresDisponibles).
// - This component decides nothing about the map: it hands the choice to the
//   parent, which calls agregarDiagnostico() in the core.
//
// NEW (not shown in the prototype): combobox / radio-group semantics for
// screen readers, Escape to close and the message for the 10-diagnosis limit.
// ─────────────────────────────────────────────────────────────

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { coloresDisponibles, proponerColor, MAX_DIAGNOSTICOS } from '@nucleo/mapa.js'
import { ds } from '../ds/index.js'
import { buscarDiagnosticos, coincidenciaExacta } from './catalogo.js'

// The colour name comes from the design-system tokens (--sm-dx-N-name).
function nombreColor(slot) {
  const valor = getComputedStyle(document.documentElement).getPropertyValue(`--sm-dx-${slot}-name`)
  return valor.replace(/["']/g, '').trim() || `Colour ${slot}`
}

export default function AgregarDiagnostico({ mapa, error, onAgregar, onCerrar }) {
  const { Modal, TextField, Button, Icon, InlineMessage } = ds()
  const idCampo = useId()
  const idLista = useId()
  const campo = useRef(null)

  const [texto, setTexto] = useState('')
  const [elegido, setElegido] = useState(null) // catalogue entry picked from the list
  const [listaAbierta, setListaAbierta] = useState(false)
  const [cursor, setCursor] = useState(-1)
  const [slot, setSlot] = useState(() => proponerColor(mapa))

  const colores = useMemo(() => coloresDisponibles(mapa), [mapa])
  const lleno = mapa.diagnosticos.length >= MAX_DIAGNOSTICOS

  const sugerencias = useMemo(() => buscarDiagnosticos(texto), [texto])
  const exacta = coincidenciaExacta(texto)
  const mostrarPropio = !exacta && texto.trim().length > 0
  const total = sugerencias.length + (mostrarPropio ? 1 : 0)
  const abierta = listaAbierta && sugerencias.length + (mostrarPropio ? 1 : 0) > 0 && texto.trim().length >= 3

  useEffect(() => { campo.current?.querySelector('input')?.focus() }, [])

  useEffect(() => {
    // Escape closes the suggestion list first (teclear marks it as handled), then the window.
    const alTeclear = e => { if (e.key === 'Escape' && !e.defaultPrevented && !abierta) onCerrar() }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [abierta, onCerrar])

  function escribir(e) {
    setTexto(e.target.value)
    setElegido(null)
    setListaAbierta(true)
    setCursor(-1)
  }

  function elegir(sugerencia) {
    setTexto(sugerencia.etiqueta)
    setElegido(sugerencia)
    setListaAbierta(false)
    setCursor(-1)
  }

  function usarPropio() {
    setListaAbierta(false)
    setCursor(-1)
  }

  function teclear(e) {
    if (!abierta) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((cursor + 1) % total) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((cursor - 1 + total) % total) }
    else if (e.key === 'Enter' && cursor >= 0) {
      e.preventDefault()
      if (cursor < sugerencias.length) elegir(sugerencias[cursor])
      else usarPropio()
    } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setListaAbierta(false); setCursor(-1) }
  }

  function agregar(e) {
    e?.preventDefault()
    const etiqueta = texto.trim()
    if (!etiqueta || lleno) return
    // A name picked from the list, or typed exactly like a catalogue name, is
    // recognised (claveCanonica); the person's own words are kept as written.
    const reconocido = elegido || exacta
    onAgregar({ etiqueta, claveCanonica: reconocido ? reconocido.clave : null, slot })
  }

  const acciones = [
    <Button key="add" variant="primary" disabled={!texto.trim() || lleno} onClick={agregar}>Add to my map</Button>,
    <Button key="cancel" variant="ghost" onClick={onCerrar}>Cancel</Button>,
  ]

  const idOpcion = i => `${idLista}-${i}`
  return (
    <div className="capa">
      <Modal
        title="Add a diagnosis"
        description="Write the name of your diagnosis. SymptomMap can suggest related symptoms afterwards."
        width={460}
        onClose={onCerrar}
        actions={acciones}
      >
        <form className="agregar" onSubmit={agregar}>
          <div>
            <div className="agregar__campo" ref={campo}>
              <TextField
                id={idCampo}
                label="Diagnosis name"
                placeholder="e.g. Autism, generalised anxiety…"
                value={texto}
                onChange={escribir}
                onKeyDown={teclear}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={abierta}
                aria-controls={idLista}
                aria-activedescendant={abierta && cursor >= 0 ? idOpcion(cursor) : undefined}
              />
              {abierta && (
                <div className="agregar__lista" id={idLista} role="listbox" aria-label="Suggested names">
                  {sugerencias.map((s, i) => (
                    <button
                      key={s.clave}
                      id={idOpcion(i)}
                      type="button"
                      role="option"
                      aria-selected={cursor === i}
                      className="agregar__opcion"
                      data-on={cursor === i ? '1' : '0'}
                      onClick={() => elegir(s)}
                    >
                      <span className="agregar__punto" style={{ background: `var(--sm-dx-${slot}-base)` }} aria-hidden="true" />
                      <span className="agregar__nombre">{s.etiqueta}</span>
                    </button>
                  ))}
                  {mostrarPropio && (
                    <button
                      id={idOpcion(sugerencias.length)}
                      type="button"
                      role="option"
                      aria-selected={cursor === sugerencias.length}
                      className="agregar__opcion agregar__opcion--propia"
                      data-on={cursor === sugerencias.length ? '1' : '0'}
                      onClick={usarPropio}
                    >
                      Use “{texto.trim()}”
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="sm-support agregar__nota">Use the wording closest to what you were told professionally.</p>
          </div>

          <div>
            <p className="sm-field-label agregar__titulo-color" id={`${idCampo}-color`}>Colour on your map</p>
            <div className="agregar__colores" role="radiogroup" aria-labelledby={`${idCampo}-color`}>
              {colores.map(n => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={slot === n}
                  aria-label={nombreColor(n)}
                  title={nombreColor(n)}
                  className="agregar__color"
                  data-on={slot === n ? '1' : '0'}
                  style={{ background: `var(--sm-dx-${n}-tint)` }}
                  onClick={() => setSlot(n)}
                >
                  {slot === n && <Icon name="check" size={15} color="var(--sm-ink)" />}
                </button>
              ))}
            </div>
            <p className="sm-support agregar__nota agregar__nota--color">One is picked for you — change it if you like.</p>
          </div>

          {(lleno || error) && (
            <InlineMessage tone="error">
              {lleno ? `You can add up to ${MAX_DIAGNOSTICOS} diagnoses.` : error}
            </InlineMessage>
          )}
          <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>
    </div>
  )
}
