// ─────────────────────────────────────────────────────────────
// AgregarSintoma.jsx — the "Add a symptom" window
//
// Approved prototype, changed by Ana's decision of 20 Oct 2026
// (docs/FUENTES-Y-DECISIONES.md §3c):
// - "What you experience" and the optional "When or how does this usually
//   show up?", both in the person's own words, growing as they type.
// - Never asks which diagnosis the symptom belongs to.
// - "Add": the AI connects it to the diagnoses on the map it may relate to;
//   the parent then shows what it was connected to, with a way to remove each.
// - "Analyse connections": the same possibilities are shown first ("Possible
//   connections") and the person keeps the ones that feel true.
// - There is no "Add without analysing": a symptom is never left grey. If the
//   AI finds nothing or is unavailable, the person picks the diagnoses here.
//
// The parent adds it with the core (agregarSintoma), which merges wording
// that matches an existing symptom instead of creating a second node.
// ─────────────────────────────────────────────────────────────

import { useEffect, useId, useRef, useState } from 'react'
import { ds } from '../ds/index.js'
import { pedirAI } from '../nube/ai.js'
import { promptConexiones, leerConexiones, MAX_TOKENS_CONEXIONES } from './conexiones.js'

// Grows a textarea with its text, up to its CSS max-height.
function crecer(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight + 3}px`
}

const ELEGIR = 'Choose the diagnoses this feels connected to.'
const SIN_SUGERENCIAS = {
  vacia: `SymptomMap didn’t find a clear connection. ${ELEGIR}`,
  demasiados_intentos: `You’ve reached the suggestion limit for now. ${ELEGIR}`,
  no_disponible: `Suggestions aren’t available right now. ${ELEGIR}`,
}

export default function AgregarSintoma({ mapa, onAgregar, onCerrar }) {
  const { Modal, Button } = ds()
  const id = useId()
  const que = useRef(null)
  const abierta = useRef(true)
  const [texto, setTexto] = useState('')
  const [cuando, setCuando] = useState('')
  const [buscando, setBuscando] = useState(null) // 'agregar' | 'analizar' while waiting for the AI
  // Review step: { sugeridas: [{ diagnosticoId, razon }], motivo } — motivo is set when there are no suggestions.
  const [revision, setRevision] = useState(null)
  const [elegidos, setElegidos] = useState([])

  const diagnosticos = [...mapa.diagnosticos].sort((a, b) => a.orden - b.orden)

  useEffect(() => { que.current?.focus(); return () => { abierta.current = false } }, [])
  useEffect(() => {
    const alTeclear = e => { if (e.key === 'Escape' && !e.defaultPrevented) onCerrar() }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [onCerrar])

  const vacio = !texto.trim()

  async function buscar(modo) {
    if (vacio || buscando) return
    setBuscando(modo)
    let sugeridas = []
    let motivo = null
    try {
      const respuesta = await pedirAI(promptConexiones({ texto, cuando, diagnosticos }), MAX_TOKENS_CONEXIONES)
      sugeridas = leerConexiones(respuesta, diagnosticos)
      if (sugeridas.length === 0) motivo = 'vacia'
    } catch (e) {
      motivo = e?.codigo === 'demasiados_intentos' ? 'demasiados_intentos' : 'no_disponible'
    }
    if (!abierta.current) return
    setBuscando(null)
    if (modo === 'agregar' && sugeridas.length > 0) {
      onAgregar({ texto: texto.trim(), cuando: cuando.trim(), conexiones: sugeridas, revisado: false })
      return
    }
    // "Analyse connections" keeps what the AI found selected; the person unticks what doesn't fit.
    setElegidos(sugeridas.map(s => s.diagnosticoId))
    setRevision({ sugeridas, motivo })
  }

  function alternar(diagnosticoId) {
    setElegidos(e => (e.includes(diagnosticoId) ? e.filter(x => x !== diagnosticoId) : [...e, diagnosticoId]))
  }

  function agregarElegidos() {
    if (elegidos.length === 0) return
    const razones = new Map(revision.sugeridas.map(s => [s.diagnosticoId, s.razon]))
    const conexiones = diagnosticos.filter(d => elegidos.includes(d.id)).map(d => ({ diagnosticoId: d.id, razon: razones.get(d.id) || null }))
    onAgregar({ texto: texto.trim(), cuando: cuando.trim(), conexiones, revisado: true })
  }

  if (revision) {
    const sugeridos = new Set(revision.sugeridas.map(s => s.diagnosticoId))
    const razon = new Map(revision.sugeridas.map(s => [s.diagnosticoId, s.razon]))
    const fila = d => <FilaConexion key={d.id} diagnostico={d} razon={razon.get(d.id)} elegido={elegidos.includes(d.id)} onAlternar={() => alternar(d.id)} />
    const otros = diagnosticos.filter(d => !sugeridos.has(d.id))
    const n = elegidos.length
    return (
      <div className="capa">
        <Modal
          title={revision.motivo ? 'Where does this fit?' : 'Possible connections'}
          description={revision.motivo ? SIN_SUGERENCIAS[revision.motivo] : 'These are possibilities, not conclusions. Keep the ones that feel true.'}
          width={520}
          onClose={onCerrar}
          actions={[
            n > 0 && <Button key="add" variant="primary" onClick={agregarElegidos}>{`Add with ${n} ${n === 1 ? 'connection' : 'connections'}`}</Button>,
            <Button key="back" variant="ghost" onClick={() => setRevision(null)}>Back</Button>,
          ].filter(Boolean)}
        >
          <div className="conexiones">
            <div className="conexiones__palabras">
              <p className="sm-field-label">Your words</p>
              <p className="sm-body-sm">{texto.trim()}</p>
            </div>
            {revision.sugeridas.length > 0 && <div className="conexiones__lista">{diagnosticos.filter(d => sugeridos.has(d.id)).map(fila)}</div>}
            {otros.length > 0 && (
              <div className="conexiones__grupo">
                {revision.sugeridas.length > 0 && <p className="sm-field-label">Also on your map</p>}
                <div className="conexiones__lista">{otros.map(fila)}</div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <div className="capa">
      <Modal
        title="Add a symptom"
        description="Add something you experience in your own words. You don’t need to know where it comes from yet."
        width={480}
        onClose={onCerrar}
        actions={[
          <Button key="add" variant="primary" disabled={vacio || !!buscando} onClick={() => buscar('agregar')}>
            {buscando === 'agregar' ? 'Adding…' : 'Add'}
          </Button>,
          <Button key="analyse" variant="ghost" disabled={vacio || !!buscando} onClick={() => buscar('analizar')}>
            {buscando === 'analizar' ? 'Analysing…' : 'Analyse connections'}
          </Button>,
        ]}
      >
        <div className="sintoma" aria-busy={!!buscando}>
          <label className="sintoma__campo" htmlFor={`${id}-que`}>
            <span className="sm-field-label">What you experience</span>
            <textarea
              id={`${id}-que`} ref={que} className="sintoma__texto" rows={3} readOnly={!!buscando}
              placeholder="e.g. I shut down in noisy places…"
              value={texto} onChange={e => { setTexto(e.target.value); crecer(e.target) }}
            />
          </label>
          <label className="sintoma__campo" htmlFor={`${id}-cuando`}>
            <span className="sm-field-label">When or how does this usually show up? (optional)</span>
            <textarea
              id={`${id}-cuando`} className="sintoma__texto sintoma__texto--largo" rows={5} readOnly={!!buscando}
              placeholder="e.g. After a long day with people, I find it harder to speak and need to be somewhere quiet."
              value={cuando} onChange={e => { setCuando(e.target.value); crecer(e.target) }}
            />
          </label>
          <p className="sm-support sintoma__ayuda" role="status">
            {buscando
              ? 'Looking at the diagnoses on your map…'
              : 'Add connects it to the diagnoses on your map it may relate to, and you can remove any. Analyse connections lets you review them first.'}
          </p>
        </div>
      </Modal>
    </div>
  )
}

// One diagnosis the person can keep or leave out (prototype .pt-airow).
function FilaConexion({ diagnostico, razon, elegido, onAlternar }) {
  const { Icon } = ds()
  return (
    <button type="button" className="conexion" data-on={elegido ? '1' : '0'} aria-pressed={elegido} onClick={onAlternar}>
      <span className="conexion__punto" style={{ background: `var(--sm-dx-${diagnostico.slot}-base)` }} aria-hidden="true" />
      <span className="conexion__texto">
        <span className="sm-emphasis conexion__nombre">{diagnostico.etiqueta}</span>
        {razon && <span className="sm-quote conexion__razon">{razon}</span>}
      </span>
      <Icon name={elegido ? 'check' : 'add'} size={16} color="var(--sm-ink-meta)" />
    </button>
  )
}
