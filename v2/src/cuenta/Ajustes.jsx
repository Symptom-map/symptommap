// ─────────────────────────────────────────────────────────────
// Ajustes.jsx — Settings (approved prototype "Settings · B",
// "Settings · change name", "Settings · change password" and
// "Settings · privacy"), only the parts that work today:
// - Account: name (Change → "Change your name") and email (read only).
// - Security: password (Change → "Change your password": current password,
//   new one with the same checklist, other devices logged out).
// - Privacy & your data: "Delete your account and data", confirmed in place
//   with the wording Ana approved on 25 Oct 2026
//   (docs/FUENTES-Y-DECISIONES.md §3d). Deletion is immediate and complete:
//   borrar_mi_cuenta() in Supabase deletes the account and, in cascade,
//   everything in it.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { ds } from '../ds/index.js'
import { CampoContrasena, MENSAJES, ocultarCorreo } from './Pantallas.jsx'
import { reglasContrasena } from './validar.js'

const LARGO_NOMBRE = 80

export default function Ajustes({ nombre, correo, onVolver, onBorrarCuenta, onCambiarNombre, onCambiarContrasena, onOlvide }) {
  const [vista, setVista] = useState('inicio') // 'inicio' | 'nombre' | 'contrasena'
  const volverAAjustes = () => setVista('inicio')
  if (vista === 'nombre') return <CambiarNombre nombre={nombre} onGuardar={onCambiarNombre} onVolver={volverAAjustes} onMapa={onVolver} />
  if (vista === 'contrasena') return <CambiarContrasena onGuardar={onCambiarContrasena} onOlvide={onOlvide} onVolver={volverAAjustes} onMapa={onVolver} />
  return <Inicio nombre={nombre} correo={correo} onVolver={onVolver} onBorrarCuenta={onBorrarCuenta} onIr={setVista} />
}

function Inicio({ nombre, correo, onVolver, onBorrarCuenta, onIr }) {
  const { Button, InlineMessage } = ds()
  const titulo = useRef(null)
  const [confirmando, setConfirmando] = useState(false)
  const [borrando, setBorrando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { titulo.current?.focus() }, [])

  async function borrar() {
    setBorrando(true)
    setError('')
    try {
      await onBorrarCuenta()
    } catch (e) {
      setError(MENSAJES[e?.codigo] || MENSAJES.desconocido)
      setBorrando(false)
    }
  }

  return (
    <div className="ajustes">
      <div className="ajustes__contenido">
        <Button variant="link" onClick={onVolver}>Back to your map</Button>
        <h1 className="sm-h1 ajustes__titulo" tabIndex={-1} ref={titulo}>Settings</h1>

        <section className="ajustes__seccion" aria-labelledby="aj-cuenta">
          <h2 className="sm-h3" id="aj-cuenta">Account</h2>
          <dl className="ajustes__datos">
            <div className="ajustes__fila">
              <div>
                <dt className="sm-field-label">Name</dt>
                <dd className="sm-body">{nombre || '—'}</dd>
              </div>
              <Button variant="link" onClick={() => onIr('nombre')} aria-label="Change your name">Change</Button>
            </div>
            <div>
              <dt className="sm-field-label">Email</dt>
              <dd className="sm-body">{ocultarCorreo(correo)}</dd>
              <dd className="sm-support ajustes__ayuda">Used to sign in and receive security codes.</dd>
            </div>
          </dl>
        </section>

        <section className="ajustes__seccion" aria-labelledby="aj-seguridad">
          <h2 className="sm-h3" id="aj-seguridad">Security</h2>
          <dl className="ajustes__datos">
            <div className="ajustes__fila">
              <div>
                <dt className="sm-field-label">Password</dt>
                <dd className="sm-body">••••••••</dd>
              </div>
              <Button variant="link" onClick={() => onIr('contrasena')} aria-label="Change your password">Change</Button>
            </div>
          </dl>
        </section>

        <section className="ajustes__seccion" aria-labelledby="aj-privacidad">
          <h2 className="sm-h3" id="aj-privacidad">Privacy &amp; your data</h2>
          <div className="ajustes__borrar">
            <p className="sm-emphasis ajustes__subtitulo">Delete your account and data</p>
            <p className="sm-support ajustes__ayuda">This removes your diagnoses, symptoms and notes.</p>
            {!confirmando ? (
              <div><Button variant="link" onClick={() => setConfirmando(true)}>Delete account and data</Button></div>
            ) : (
              <div className="ajustes__confirmar" role="alert">
                <p className="sm-body-sm"><strong>Delete your account and data?</strong></p>
                <p className="sm-body-sm">
                  This deletes your account and everything in it: your diagnoses, profiles, symptoms and notes.
                  For your security, SymptomMap doesn’t keep any of it. If you want to use SymptomMap again,
                  you’ll create a new account and start from zero. This can’t be undone.
                </p>
                {error && <InlineMessage tone="error">{error}</InlineMessage>}
                <div className="panel__botones">
                  <Button variant="secondary" size="sm" disabled={borrando} onClick={() => { setConfirmando(false); setError('') }}>Keep my account</Button>
                  <Button variant="link" disabled={borrando} onClick={borrar}>{borrando ? 'Deleting…' : 'Delete'}</Button>
                </div>
              </div>
            )}
            <p className="sm-support ajustes__ayuda">Backup copies of the database are erased automatically within 7 days.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

// Shared frame of the sub-pages: "Back to your map", "Settings", the title.
function Subpagina({ titulo, texto, onVolver, onMapa, children }) {
  const { Button } = ds()
  const h1 = useRef(null)
  useEffect(() => { h1.current?.focus() }, [])
  return (
    <div className="ajustes">
      <div className="ajustes__contenido">
        <div className="ajustes__migas">
          <Button variant="link" onClick={onMapa}>Back to your map</Button>
          <Button variant="link" onClick={onVolver}>Settings</Button>
        </div>
        <h1 className="sm-h1 ajustes__titulo" tabIndex={-1} ref={h1}>{titulo}</h1>
        <p className="sm-body ajustes__intro">{texto}</p>
        <div className="ajustes__seccion">{children}</div>
      </div>
    </div>
  )
}

function CambiarNombre({ nombre, onGuardar, onVolver, onMapa }) {
  const { TextField, Button, InlineMessage } = ds()
  const [valor, setValor] = useState(nombre || '')
  const [guardado, setGuardado] = useState('')
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const limpio = valor.trim()
  const listo = limpio.length > 0 && limpio.length <= LARGO_NOMBRE && limpio !== (nombre || '').trim()

  async function guardar(e) {
    e.preventDefault()
    if (!listo) return
    setOcupado(true)
    setError('')
    try {
      await onGuardar(limpio)
      setGuardado(limpio)
    } catch (err) {
      setError(MENSAJES[err?.codigo] || MENSAJES.desconocido)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <Subpagina titulo="Change your name" texto="This is the name SymptomMap uses across your account and map." onVolver={onVolver} onMapa={onMapa}>
      <form onSubmit={guardar} noValidate className="ajustes__form">
        <TextField id="aj-nombre" label="Name" placeholder="e.g. Ana" autoComplete="given-name" maxLength={LARGO_NOMBRE}
          value={valor} onChange={e => { setValor(e.target.value); setGuardado('') }}
          error={valor !== '' && !limpio ? 'Write your name.' : ''} />
        {guardado && <div role="status"><InlineMessage tone="success">Saved. Your map now shows {guardado}.</InlineMessage></div>}
        {error && <div role="alert"><InlineMessage tone="error">{error}</InlineMessage></div>}
        <div className="panel__botones">
          <Button type="submit" variant="primary" disabled={!listo || ocupado}>{ocupado ? 'Saving…' : 'Save changes'}</Button>
          <Button variant="ghost" onClick={onVolver}>Cancel</Button>
        </div>
      </form>
    </Subpagina>
  )
}

function CambiarContrasena({ onGuardar, onOlvide, onVolver, onMapa }) {
  const { Button, InlineMessage } = ds()
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [repetir, setRepetir] = useState('')
  const [error, setError] = useState('')
  const [guardada, setGuardada] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const reglas = reglasContrasena(nueva)
  const listo = actual !== '' && reglas.every(r => r.ok) && repetir !== '' && repetir === nueva

  async function guardar(e) {
    e.preventDefault()
    if (!listo) return
    setOcupado(true)
    setError('')
    try {
      await onGuardar({ actual, nueva })
      setGuardada(true)
      setActual(''); setNueva(''); setRepetir('')
    } catch (err) {
      setError(err?.codigo || 'desconocido')
    } finally {
      setOcupado(false)
    }
  }

  const errorActual = error === 'contrasena_actual' || error === 'credenciales' ? MENSAJES.contrasena_actual : ''
  const errorNueva = ['contrasena_debil', 'contrasena_filtrada', 'contrasena_igual'].includes(error) ? MENSAJES[error] : ''
  const otro = error && !errorActual && !errorNueva ? (MENSAJES[error] || MENSAJES.desconocido) : ''

  return (
    <Subpagina titulo="Change your password" texto="Choose a new password for your SymptomMap account." onVolver={onVolver} onMapa={onMapa}>
      <form onSubmit={guardar} noValidate className="ajustes__form">
        <CampoContrasena id="aj-pw-actual" label="Current password" placeholder="Your current password" value={actual}
          error={errorActual} onChange={e => { setActual(e.target.value); setGuardada(false); if (errorActual) setError('') }} />
        <div><Button variant="link" onClick={onOlvide}>Forgot your password?</Button></div>
        <CampoContrasena id="aj-pw-nueva" label="New password" placeholder="At least 8 characters" value={nueva}
          error={errorNueva} onChange={e => { setNueva(e.target.value); setGuardada(false); if (errorNueva) setError('') }} />
        <ul className="cuenta__reglas">
          {reglas.map(r => (
            <li key={r.etiqueta} className={'sm-support' + (r.ok ? ' is-ok' : '')}><span aria-hidden="true" />{r.etiqueta}</li>
          ))}
        </ul>
        <CampoContrasena id="aj-pw-repetir" label="Confirm new password" placeholder="Repeat your new password" value={repetir}
          error={repetir && repetir !== nueva ? 'The passwords don’t match yet.' : ''} onChange={e => { setRepetir(e.target.value); setGuardada(false) }} />
        {guardada && <div role="status"><InlineMessage tone="success">Password updated. Other devices have been logged out.</InlineMessage></div>}
        {otro && <div role="alert"><InlineMessage tone="error">{otro}</InlineMessage></div>}
        <div className="panel__botones">
          <Button type="submit" variant="primary" disabled={!listo || ocupado}>{ocupado ? 'Saving…' : 'Save new password'}</Button>
          <Button variant="ghost" onClick={onVolver}>Cancel</Button>
        </div>
      </form>
    </Subpagina>
  )
}
