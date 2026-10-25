// ─────────────────────────────────────────────────────────────
// PanelDetalle.jsx — the detail panel on the right of the map
//
// Approved prototype (panelDetail, .pt-sb): opens when the person selects a
// diagnosis or a symptom, on the map or in the sidebar.
//
// Symptom: its connections (SourceTag), "When / how does it show up?",
// "Your notes", "Edit name" and "Delete symptom" (asked first).
// Diagnosis: profile facts, connected symptoms, colour on the map,
// "Edit details" (the profile) and "Delete diagnosis" (asked first, saying
// how many symptoms go with it: Ana, 25 Oct 2026, FUENTES §3d).
//
// "Connected to" (approved by Ana, 25 Oct 2026; not in the prototype) lets the
// person add or remove a connection by hand, e.g. to correct the AI. A symptom
// is never left without a connection (FUENTES §3c–3d): the core refuses to
// remove the last one (desconectar / puedeDesconectar); deleting the symptom
// does that.
// "Suggest symptoms" is not shown until that feature exists.
//
// Every change goes through the core (src/core/mapa.js) in the parent.
// ─────────────────────────────────────────────────────────────

import { useEffect, useId, useRef, useState } from 'react'
import { coloresDisponibles, diagnosticosDe, puedeDesconectar, sintomasQueSeBorran } from '@nucleo/mapa.js'
import { ds } from '../ds/index.js'
import { preguntasPara } from '../perfil/preguntas.js'
import { nombreColor } from './AgregarDiagnostico.jsx'
import { barra } from './BarraLateral.jsx'

const SIN_DATO = 'Not set yet'

export default function PanelDetalle({ mapa, seleccion, onCerrar, onElegir, acciones }) {
  const { IconButton, Icon } = ds()
  const titulo = useRef(null)
  const diagnostico = seleccion.tipo === 'diagnostico' ? mapa.diagnosticos.find(d => d.id === seleccion.id) : null
  const sintoma = seleccion.tipo === 'sintoma' ? mapa.sintomas.find(s => s.id === seleccion.id) : null

  useEffect(() => { titulo.current?.focus() }, [seleccion.tipo, seleccion.id])
  // The selection can disappear (deleted here, or in another tab).
  useEffect(() => { if (!diagnostico && !sintoma) onCerrar() }, [diagnostico, sintoma, onCerrar])
  if (!diagnostico && !sintoma) return null

  return (
    <aside className="panel" aria-label={sintoma ? 'Symptom details' : 'Diagnosis details'}>
      <div className="panel__cabeza">
        <h2 className="sm-h3 panel__titulo" tabIndex={-1} ref={titulo}>{sintoma ? sintoma.texto : diagnostico.etiqueta}</h2>
        <IconButton label="Close panel" variant="ghost" onClick={onCerrar}>
          <Icon name="close" size={15} color="var(--sm-ink-meta)" />
        </IconButton>
      </div>
      {sintoma
        ? <DetalleSintoma key={sintoma.id} mapa={mapa} sintoma={sintoma} acciones={acciones} />
        : <DetalleDiagnostico key={diagnostico.id} mapa={mapa} diagnostico={diagnostico} acciones={acciones} onElegir={onElegir} />}
    </aside>
  )
}

// ── Symptom ───────────────────────────────────────────────────
function DetalleSintoma({ mapa, sintoma, acciones }) {
  const { SourceTag, TextField, Button, DiagnosisChip } = ds()
  const id = useId()
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState(sintoma.texto)
  const [errorNombre, setErrorNombre] = useState('')
  const [borrando, setBorrando] = useState(false)

  const conectados = diagnosticosDe(mapa, sintoma.id)
  const idsConectados = new Set(conectados.map(d => d.id))
  const diagnosticos = [...mapa.diagnosticos].sort((a, b) => a.orden - b.orden)

  function guardarNombre() {
    const error = acciones.editarSintoma(sintoma.id, { texto: nombre })
    if (error) return setErrorNombre(error)
    setEditando(false)
    setErrorNombre('')
  }

  function alternar(d) {
    if (!idsConectados.has(d.id)) acciones.conectar(sintoma.id, d.id)
    else if (puedeDesconectar(mapa, sintoma.id, d.id)) acciones.desconectar(sintoma.id, d.id)
  }

  return (
    <div className="panel__cuerpo">
      {conectados.length > 0 ? (
        <div className="panel__etiquetas">
          {conectados.map(d => <SourceTag key={d.id} label={d.etiqueta} slot={d.slot} />)}
        </div>
      ) : (
        // Only maps saved before 25 Oct 2026 can have a symptom without connections.
        <p className="sm-body-sm panel__nota">Not connected to a diagnosis. Connect it below, or delete it.</p>
      )}

      <div className="panel__bloque">
        <p className="sm-field-label" id={`${id}-con`}>Connected to</p>
        <div className="panel__conexiones" role="group" aria-labelledby={`${id}-con`}>
          {diagnosticos.map(d => {
            const unica = idsConectados.has(d.id) && !puedeDesconectar(mapa, sintoma.id, d.id)
            return (
              <DiagnosisChip
                key={d.id} label={d.etiqueta} slot={d.slot} compact
                selected={idsConectados.has(d.id)}
                aria-disabled={unica || undefined}
                title={unica ? 'A symptom keeps at least one connection. To remove it, delete the symptom.' : undefined}
                onClick={() => alternar(d)}
              />
            )
          })}
        </div>
        {conectados.length === 1 && <p className="sm-support panel__ayuda">A symptom keeps at least one connection. To remove it, delete the symptom.</p>}
      </div>

      <div className="panel__bloque">
        <label className="sm-field-label" htmlFor={`${id}-cuando`}>When / how does it show up?</label>
        <TextField id={`${id}-cuando`} multiline rows={3}
          placeholder="e.g. mostly in busy places, after conflict, when I haven’t slept well…"
          value={sintoma.cuando || ''} onChange={e => acciones.editarSintoma(sintoma.id, { cuando: e.target.value })} />
      </div>
      <div className="panel__bloque">
        <label className="sm-field-label" htmlFor={`${id}-notas`}>Your notes</label>
        <TextField id={`${id}-notas`} multiline rows={3}
          placeholder="e.g. what it feels like, what helps, or anything else you want to remember"
          value={sintoma.notas || ''} onChange={e => acciones.editarSintoma(sintoma.id, { notas: e.target.value })} />
      </div>

      {editando && (
        <div className="panel__bloque panel__confirmar">
          <TextField id={`${id}-nombre`} label="Symptom name" value={nombre} error={errorNombre}
            onChange={e => { setNombre(e.target.value); setErrorNombre('') }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); guardarNombre() } }} autoFocus />
          <div className="panel__botones">
            <Button variant="primary" size="sm" disabled={!nombre.trim()} onClick={guardarNombre}>Save name</Button>
            <Button variant="ghost" size="sm" onClick={() => { setEditando(false); setNombre(sintoma.texto); setErrorNombre('') }}>Cancel</Button>
          </div>
        </div>
      )}
      {borrando && (
        <div className="panel__bloque panel__confirmar" role="alert">
          <p className="sm-body-sm">Remove this symptom from your map? Your notes about it are removed too.</p>
          <div className="panel__botones">
            <Button variant="secondary" size="sm" onClick={() => setBorrando(false)}>Keep it</Button>
            <Button variant="link" onClick={() => acciones.borrarSintoma(sintoma.id)}>Remove</Button>
          </div>
        </div>
      )}
      {!editando && !borrando && (
        <div className="panel__enlaces">
          <Button variant="link" onClick={() => { setNombre(sintoma.texto); setEditando(true) }}>Edit name</Button>
          <Button variant="link" onClick={() => setBorrando(true)}>Delete symptom</Button>
        </div>
      )}
    </div>
  )
}

// ── Diagnosis ─────────────────────────────────────────────────
function DetalleDiagnostico({ mapa, diagnostico, acciones, onElegir }) {
  const { SymptomRow, Button, Icon } = ds()
  const id = useId()
  const [borrando, setBorrando] = useState(false)

  const preguntas = preguntasPara(diagnostico.claveCanonica)
  const perfil = mapa.perfiles[diagnostico.id] || {}
  const patron = [].concat(perfil.patron || []).concat(perfil.otro ? [perfil.otro] : []).filter(Boolean)
  const datos = [
    preguntas.patron && { label: preguntas.patron.label, valor: patron.join(' · ') || SIN_DATO },
    { label: 'Age at diagnosis', valor: perfil.edad || SIN_DATO },
    { label: 'Frequent triggers', valor: (perfil.desencadenantes || []).join(' · ') || SIN_DATO },
  ].filter(Boolean)

  const sintomas = mapa.sintomas.filter(s => mapa.conexiones.some(c => c.sintomaId === s.id && c.diagnosticoId === diagnostico.id))
  const colores = [...new Set([diagnostico.slot, ...coloresDisponibles(mapa, diagnostico.id)])].sort((a, b) => a - b)
  const seBorran = sintomasQueSeBorran(mapa, diagnostico.id)

  return (
    <div className="panel__cuerpo">
      <p className="sm-meta panel__tipo"><span className="conexion__punto" style={{ background: `var(--sm-dx-${diagnostico.slot}-base)` }} aria-hidden="true" />Diagnosis</p>

      <dl className="panel__datos">
        {datos.map(d => (
          <div key={d.label}>
            <dt className="sm-field-label">{d.label}</dt>
            <dd className="sm-body-sm">{d.valor}</dd>
          </div>
        ))}
      </dl>

      <div className="panel__bloque">
        <p className="sm-field-label">Connected symptoms</p>
        {sintomas.length === 0 ? (
          <p className="sm-support panel__ayuda">No symptoms connected yet.</p>
        ) : (
          <>
            <div className="barra__filas">
              {sintomas.map(s => {
                const slots = diagnosticosDe(mapa, s.id).map(d => d.slot)
                return <SymptomRow key={s.id} label={s.texto} slot={slots[0]} sources={slots} compact style={barra(slots)} onClick={() => onElegir({ tipo: 'sintoma', id: s.id })} />
              })}
            </div>
            <p className="sm-support panel__ayuda">A split bar means the symptom is shared with another diagnosis.</p>
          </>
        )}
      </div>

      <div className="panel__bloque">
        <p className="sm-field-label" id={`${id}-color`}>Colour on your map</p>
        <div className="agregar__colores" role="radiogroup" aria-labelledby={`${id}-color`}>
          {colores.map(n => (
            <button
              key={n} type="button" role="radio" aria-checked={diagnostico.slot === n}
              aria-label={nombreColor(n)} title={nombreColor(n)}
              className="agregar__color" data-on={diagnostico.slot === n ? '1' : '0'}
              style={{ background: `var(--sm-dx-${n}-tint)`, '--dx-base-elegido': `var(--sm-dx-${n}-base)` }}
              onClick={() => acciones.cambiarColor(diagnostico.id, n)}
            >
              {diagnostico.slot === n && <Icon name="check" size={15} color="var(--sm-ink)" />}
            </button>
          ))}
        </div>
      </div>

      <Button variant="secondary" size="sm" block onClick={() => acciones.editarPerfil(diagnostico.id)}>Edit details</Button>

      {borrando ? (
        <div className="panel__bloque panel__confirmar" role="alert">
          <p className="sm-body-sm"><strong>Remove {diagnostico.etiqueta}?</strong></p>
          {seBorran.length > 0 && (
            <p className="sm-body-sm">
              {seBorran.length === 1
                ? '1 symptom connected only to it will be removed too, with your notes about it.'
                : `${seBorran.length} symptoms connected only to it will be removed too, with your notes about them.`}
              {' '}Symptoms shared with another diagnosis stay.
            </p>
          )}
          <div className="panel__botones">
            <Button variant="secondary" size="sm" onClick={() => setBorrando(false)}>Keep it</Button>
            <Button variant="link" onClick={() => acciones.borrarDiagnostico(diagnostico.id)}>Remove</Button>
          </div>
        </div>
      ) : (
        <div className="panel__enlaces">
          <Button variant="link" onClick={() => setBorrando(true)}>Delete diagnosis</Button>
        </div>
      )}
    </div>
  )
}
