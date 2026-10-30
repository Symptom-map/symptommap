// ─────────────────────────────────────────────────────────────
// Pantallas.jsx — pantallas de cuenta del prototipo aprobado
//
// Textos, orden y componentes salen de `SymptomMap - Production Prototype`
// (pantallas Login, Sign up, Gate 18+, Eligibility, Gate no diagnosis,
// Verify email y Consent). Aquí no se decide nada del producto: solo se
// conectan esas pantallas con Supabase (ver src/nube/).
//
// Textos que el prototipo no tenía y hubo que agregar (marcados "NUEVO") son
// mensajes de error reales: credenciales incorrectas, sin conexión, etc.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import { ds } from '../ds/index.js'
import { correoValido, reglasContrasena, revisarNacimiento, MESES, ELEGIBILIDAD } from './validar.js'
import { LARGO_CODIGO } from '../nube/cuenta.js'
import { MODO_PRUEBA_DISPONIBLE } from '../prueba.js'

// NUEVO: mensajes para errores que el prototipo no mostraba.
export const MENSAJES = {
  credenciales: 'That email and password don’t match. Try again.',
  codigo_invalido: 'That code doesn’t look right. Try the newest one we sent.',
  demasiados_intentos: 'Too many attempts. Wait a minute and try again.',
  sin_conexion: 'We couldn’t connect. Check your internet and try again.',
  error_servidor: 'Something went wrong on our side. Please try again in a few minutes.',
  contrasena_debil: 'Choose a stronger password.',
  contrasena_filtrada: 'This password has appeared in a data breach, so it isn’t safe to use. Choose a different one.',
  contrasena_igual: 'Choose a password you haven’t used for SymptomMap before.',
  contrasena_actual: 'That isn’t your current password. Try again.',
  desconocido: 'Something went wrong. Try again.',
}

function Panel({ ancho = 520, children }) {
  const { Card } = ds()
  return (
    <div className="cuenta">
      <Card variant="panel" className="cuenta__panel" style={{ maxWidth: ancho }}>{children}</Card>
    </div>
  )
}

function Pasos({ actual, total = 3, etiqueta }) {
  return (
    <div className="cuenta__pasos">
      <span className="cuenta__barras" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => <span key={i} className={i < actual ? 'is-on' : ''} />)}
      </span>
      <span className="sm-eyebrow">{etiqueta || `Step ${actual} of ${total}`}</span>
    </div>
  )
}

// NEW: a success message on the login screen (e.g. after deleting the account).
function InlineMessageExito({ texto }) {
  const { InlineMessage } = ds()
  return <InlineMessage tone="success">{texto}</InlineMessage>
}

function MensajeError({ codigo }) {
  const { InlineMessage } = ds()
  if (!codigo) return null
  return <div className="cuenta__mensaje" role="alert"><InlineMessage tone="error">{MENSAJES[codigo] || MENSAJES.desconocido}</InlineMessage></div>
}

// Campo de contraseña con el botón de ojo del prototipo (.pt-pw / .pt-pweye).
export function CampoContrasena({ id, label, placeholder, value, error, onChange }) {
  const { TextField, Icon } = ds()
  const [visible, setVisible] = useState(false)
  return (
    <div className="campo-contrasena">
      <TextField id={id} label={label} type={visible ? 'text' : 'password'} placeholder={placeholder}
        value={value} error={error} onChange={onChange} autoComplete={id === 'li-pw' || id.endsWith('-actual') ? 'current-password' : 'new-password'} />
      <button type="button" className="campo-contrasena__ojo" aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible} onClick={() => setVisible(v => !v)}>
        <Icon name="eye" size={15} color={visible ? 'var(--sm-ink)' : 'var(--sm-ink-meta)'} />
      </button>
    </div>
  )
}

// ── Login ─────────────────────────────────────────────────────
export function PantallaEntrar({ ocupado, error, aviso, onEntrar, onIrARegistro, onOlvide, onPrueba }) {
  const { TextField, Button } = ds()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [tocado, setTocado] = useState({ correo: false, contrasena: false })
  const correoOk = correoValido(correo)
  const listo = correoOk && contrasena !== ''

  function enviar(e) {
    e.preventDefault()
    if (!listo) return setTocado({ correo: true, contrasena: true })
    onEntrar({ correo, contrasena })
  }

  return (
    <Panel>
      <form onSubmit={enviar} noValidate>
        <h1 className="sm-h1 cuenta__titulo">Welcome back</h1>
        <p className="sm-body cuenta__intro">Log in to continue exploring your SymptomMap.</p>
        <TextField id="li-email" label="Email" type="email" placeholder="e.g. ana@example.com" autoComplete="email"
          value={correo} onChange={e => setCorreo(e.target.value)} onBlur={() => setTocado(t => ({ ...t, correo: true }))}
          error={tocado.correo && correo.trim() !== '' && !correoOk ? 'Enter a valid email address.' : ''} />
        <div className="cuenta__espacio" />
        <CampoContrasena id="li-pw" label="Password" placeholder="Your password" value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          error={tocado.contrasena && contrasena === '' ? 'Enter your password.' : ''} />
        <div className="cuenta__olvide">
          <a href="#reset" onClick={e => { e.preventDefault(); onOlvide(correo) }}>Forgot your password?</a>
        </div>
        {aviso ? <div className="cuenta__mensaje" role="status"><InlineMessageExito texto={aviso} /></div> : null}
        <MensajeError codigo={error} />
        <div className="cuenta__accion">
          <Button type="submit" variant="primary" block disabled={!listo || ocupado}>Log in</Button>
        </div>
        <p className="sm-body-sm cuenta__pie">Don’t have an account? <a href="#create" onClick={e => { e.preventDefault(); onIrARegistro() }}>Create one</a></p>
        {/* Previews and local only (prueba.js): never shown in production. */}
        {MODO_PRUEBA_DISPONIBLE && onPrueba && (
          <p className="sm-support cuenta__pie cuenta__pie--meta">
            <a href="#prueba" onClick={e => { e.preventDefault(); onPrueba() }}>Try without an account (test mode)</a>
          </p>
        )}
      </form>
    </Panel>
  )
}

// ── Sign up · Step 1 of 3 ─────────────────────────────────────
// `error`: si Supabase rechazó la contraseña al crear la cuenta, la persona vuelve
// aquí (con la contraseña vacía) y el mensaje aparece junto al campo.
export function PantallaRegistro({ inicial, error, onContinuar, onIrAEntrar }) {
  const { TextField, Select, Icon, Button } = ds()
  const [f, setF] = useState(inicial || { nombre: '', correo: '', dia: '', mes: '', anio: '', contrasena: '', repetir: '' })
  const [tocado, setTocado] = useState({})
  const poner = campo => e => setF(v => ({ ...v, [campo]: e.target.value }))
  const soloDigitos = (campo, largo) => e => setF(v => ({ ...v, [campo]: String(e.target.value).replace(/\D/g, '').slice(0, largo) }))

  const correoOk = correoValido(f.correo)
  const nacimiento = revisarNacimiento({ dia: f.dia, mes: f.mes, anio: f.anio })
  const reglas = reglasContrasena(f.contrasena)
  const valido = f.nombre.trim() !== '' && correoOk && nacimiento.valida && reglas.every(r => r.ok) && f.repetir !== '' && f.repetir === f.contrasena
  const errorNacimiento = nacimiento.error && (tocado.anio || tocado.dia || (f.dia && f.mes && f.anio)) ? nacimiento.error : ''

  function enviar(e) {
    e.preventDefault()
    if (valido) onContinuar(f, nacimiento.edad)
  }

  return (
    <Panel ancho={560}>
      <form onSubmit={enviar} noValidate>
        <Pasos actual={1} />
        <h1 className="sm-h1 cuenta__titulo cuenta__titulo--paso">Create your SymptomMap account</h1>
        <p className="sm-body cuenta__intro">A few details to create and protect your account.</p>
        <TextField id="su-name" label="Name" placeholder="e.g. Ana" autoComplete="given-name" maxLength={80} value={f.nombre} onChange={poner('nombre')} />
        <div className="cuenta__espacio" />
        <TextField id="su-email" label="Email address" type="email" placeholder="e.g. ana@example.com" autoComplete="email"
          value={f.correo} onChange={poner('correo')} onBlur={() => setTocado(t => ({ ...t, correo: true }))}
          error={tocado.correo && f.correo.trim() !== '' && !correoOk ? 'Enter a valid email address.' : ''} />
        <fieldset className="cuenta__nacimiento">
          <legend className="sm-field-label">Date of birth</legend>
          <div className="cuenta__fecha">
            <TextField id="su-dia" aria-label="Day" type="text" inputMode="numeric" autoComplete="off" maxLength={2} placeholder="Day"
              value={f.dia} onChange={soloDigitos('dia', 2)} onBlur={() => setTocado(t => ({ ...t, dia: true }))} error={errorNacimiento ? ' ' : ''} />
            <Select id="su-mes" aria-label="Month" placeholder="Month" options={MESES} required value={f.mes} onChange={poner('mes')}
              className={f.mes ? '' : 'is-vacio'} />
            <TextField id="su-anio" aria-label="Year" type="text" inputMode="numeric" autoComplete="off" maxLength={4} placeholder="Year"
              value={f.anio} onChange={soloDigitos('anio', 4)} onBlur={() => setTocado(t => ({ ...t, anio: true }))} error={errorNacimiento ? ' ' : ''} />
          </div>
          {errorNacimiento ? (
            <p className="sm-support cuenta__error-fecha" role="alert"><Icon name="alert" size={14} color="var(--sm-error-ink)" />{errorNacimiento}</p>
          ) : null}
          <p className="sm-support cuenta__nota">SymptomMap is currently designed for adults aged 18 and over.</p>
        </fieldset>
        <CampoContrasena id="su-pw" label="Password" placeholder="At least 8 characters" value={f.contrasena} onChange={poner('contrasena')}
          error={error && f.contrasena === '' ? MENSAJES[error] || MENSAJES.contrasena_debil : ''} />
        <ul className="cuenta__reglas">
          {reglas.map(r => (
            <li key={r.etiqueta} className={'sm-support' + (r.ok ? ' is-ok' : '')}><span aria-hidden="true" />{r.etiqueta}</li>
          ))}
        </ul>
        <div className="cuenta__espacio" />
        <CampoContrasena id="su-pw2" label="Confirm password" placeholder="Repeat your password" value={f.repetir} onChange={poner('repetir')}
          error={f.repetir && f.repetir !== f.contrasena ? 'The passwords don’t match yet.' : ''} />
        <div className="cuenta__accion">
          <Button type="submit" variant="primary" block disabled={!valido}>Continue</Button>
        </div>
        <p className="sm-body-sm cuenta__pie">Already have an account? <a href="#login" onClick={e => { e.preventDefault(); onIrAEntrar() }}>Log in</a></p>
      </form>
    </Panel>
  )
}

// ── Gates (18+ y sin diagnóstico) ─────────────────────────────
function Gate({ titulo, texto, apoyo }) {
  const { Icon, Button } = ds()
  return (
    <Panel ancho={540}>
      <div className="gate">
        <span className="gate__icono" aria-hidden="true"><Icon name="alert" size={28} color="var(--sm-ai-ink)" /></span>
        <h1 className="sm-h2 gate__titulo">{titulo}</h1>
        <p className="sm-body gate__texto">{texto}</p>
        <Button variant="secondary" onClick={() => { window.location.href = '/' }}>Back to home</Button>
        <div className="gate__linea" />
        <p className="sm-support gate__apoyo">{apoyo}</p>
      </div>
    </Panel>
  )
}

export function PantallaMenorDeEdad() {
  return <Gate titulo="SymptomMap is currently for adults aged 18 and over."
    texto="This version has been designed and researched with adults, so we can’t create a profile for you at this time."
    apoyo="If you need mental health support right now, please reach out to a trusted adult, your family doctor, or a youth helpline in your area." />
}

export function PantallaSinDiagnostico() {
  return <Gate titulo="A formal diagnosis is needed to build a map."
    texto="SymptomMap is designed for people who have already received a mental health diagnosis from a qualified health professional."
    apoyo="If you think a mental health condition may fit your experience, consider speaking with a qualified health professional." />
}

// ── Eligibility · Step 2 of 3 ─────────────────────────────────
// La respuesta elegida nunca se envía: solo se usa para decidir el paso siguiente.
export function PantallaElegibilidad({ ocupado, error, onContinuar }) {
  const { Radio, Button } = ds()
  const [eleccion, setEleccion] = useState('')
  return (
    <Panel ancho={560}>
      <Pasos actual={2} />
      <h1 className="sm-h1 cuenta__titulo cuenta__titulo--paso">A quick eligibility check</h1>
      <fieldset className="cuenta__opciones">
        <legend className="sm-body cuenta__intro">How did you receive your formal mental health diagnosis?</legend>
        {ELEGIBILIDAD.map(opcion => (
          <Radio key={opcion} label={opcion} name="eligibility" checked={eleccion === opcion}
            onChange={() => setEleccion(opcion)} className="cuenta__opcion" />
        ))}
      </fieldset>
      <MensajeError codigo={error} />
      <div className="cuenta__accion cuenta__accion--amplia">
        <Button variant="primary" block disabled={!eleccion || ocupado} onClick={() => onContinuar(eleccion)}>{ocupado ? 'Creating your account…' : 'Continue'}</Button>
      </div>
    </Panel>
  )
}

// ── Verify email · Step 3 of 3 ────────────────────────────────
// En el prototipo esta pantalla viene después de "Set up two-step log in".
// Aquí confirma el correo al crear la cuenta (ver docs/FUENTES-Y-DECISIONES.md).
// Also used for "Forgot your password?" (restablecer): no steps, and the
// wording never says whether the email has an account.
export function PantallaVerificar({ correo, ocupado, error, aviso, onVerificar, onReenviar, restablecer = false }) {
  const { CodeInput, Button, InlineMessage } = ds()
  const [codigo, setCodigo] = useState('')
  const [incompleto, setIncompleto] = useState(false)

  function enviar(e) {
    e.preventDefault()
    if (codigo.length < LARGO_CODIGO) return setIncompleto(true)
    onVerificar(codigo)
  }

  // Mejora de accesibilidad sin tocar el design system: pegar el código
  // completo y pasar solo a la casilla siguiente o anterior.
  function pegar(e) {
    const digitos = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, LARGO_CODIGO)
    if (!digitos) return
    e.preventDefault()
    setCodigo(digitos)
  }
  function moverFoco(e) {
    const celda = e.target
    if (!celda.classList?.contains('sm-code__cell')) return
    if (e.type === 'input' && celda.value) celda.nextElementSibling?.focus()
    if (e.type === 'keydown' && e.key === 'Backspace' && !celda.value) celda.previousElementSibling?.focus()
  }

  const mensaje = error ? MENSAJES[error] || MENSAJES.desconocido : incompleto && codigo.length < LARGO_CODIGO ? 'Enter all 6 digits of the code.' : ''

  return (
    <Panel>
      <form onSubmit={enviar} noValidate>
        {!restablecer && <Pasos actual={3} />}
        <h1 className="sm-h2 cuenta__titulo-verificar">Check your email</h1>
        <p className="sm-body-sm cuenta__enviado">{restablecer ? 'If there’s an account for this email, we sent a 6-digit code to' : 'We sent a 6-digit code to'}</p>
        <p className="sm-emphasis cuenta__correo">{ocultarCorreo(correo)}</p>
        <div onPaste={pegar} onInput={moverFoco} onKeyDown={moverFoco}>
          <CodeInput length={LARGO_CODIGO} value={codigo} error={mensaje} onChange={v => { setCodigo(v.replace(/\D/g, '')); setIncompleto(false) }} />
        </div>
        <div className="cuenta__accion cuenta__accion--codigo">
          <Button type="submit" variant="primary" block disabled={ocupado}>{restablecer ? 'Continue' : 'Verify and continue'}</Button>
        </div>
        {aviso ? <div className="cuenta__mensaje" role="status"><InlineMessage tone="success">{aviso}</InlineMessage></div> : null}
        <p className="sm-support cuenta__pie cuenta__pie--meta">Didn’t get it? <a href="#resend" onClick={e => { e.preventDefault(); onReenviar() }}>Send a new code</a></p>
      </form>
    </Panel>
  )
}

// ── Forgot your password? ─────────────────────────────────────
// NEW: the prototype has the link but no screens (HANDOFF: "Password reset
// screens are not designed"). Built from the existing account screens:
// email → 6-digit code (PantallaVerificar) → new password with the same checklist.
export function PantallaOlvide({ inicial = '', ocupado, error, onEnviar, onVolver }) {
  const { TextField, Button } = ds()
  const [correo, setCorreo] = useState(inicial)
  const [tocado, setTocado] = useState(false)
  const correoOk = correoValido(correo)

  function enviar(e) {
    e.preventDefault()
    if (!correoOk) return setTocado(true)
    onEnviar(correo.trim())
  }

  return (
    <Panel>
      <form onSubmit={enviar} noValidate>
        <h1 className="sm-h1 cuenta__titulo">Reset your password</h1>
        <p className="sm-body cuenta__intro">Enter the email you use for SymptomMap and we’ll send you a 6-digit code.</p>
        <TextField id="rs-email" label="Email" type="email" placeholder="e.g. ana@example.com" autoComplete="email"
          value={correo} onChange={e => setCorreo(e.target.value)} onBlur={() => setTocado(true)}
          error={tocado && correo.trim() !== '' && !correoOk ? 'Enter a valid email address.' : ''} />
        <MensajeError codigo={error} />
        <div className="cuenta__accion">
          <Button type="submit" variant="primary" block disabled={!correoOk || ocupado}>{ocupado ? 'Sending…' : 'Send code'}</Button>
        </div>
        <p className="sm-body-sm cuenta__pie"><a href="#login" onClick={e => { e.preventDefault(); onVolver() }}>Back to log in</a></p>
      </form>
    </Panel>
  )
}

export function PantallaNuevaContrasena({ ocupado, error, onGuardar }) {
  const { Button } = ds()
  const [contrasena, setContrasena] = useState('')
  const [repetir, setRepetir] = useState('')
  const reglas = reglasContrasena(contrasena)
  const valido = reglas.every(r => r.ok) && repetir !== '' && repetir === contrasena

  function enviar(e) {
    e.preventDefault()
    if (valido) onGuardar(contrasena)
  }

  return (
    <Panel>
      <form onSubmit={enviar} noValidate>
        <h1 className="sm-h1 cuenta__titulo">Choose a new password</h1>
        <p className="sm-body cuenta__intro">You’ll use it to log in from now on. Other devices will be logged out.</p>
        <CampoContrasena id="rs-pw" label="New password" placeholder="At least 8 characters" value={contrasena}
          onChange={e => setContrasena(e.target.value)} error={error ? MENSAJES[error] || MENSAJES.desconocido : ''} />
        <ul className="cuenta__reglas">
          {reglas.map(r => (
            <li key={r.etiqueta} className={'sm-support' + (r.ok ? ' is-ok' : '')}><span aria-hidden="true" />{r.etiqueta}</li>
          ))}
        </ul>
        <div className="cuenta__espacio" />
        <CampoContrasena id="rs-pw2" label="Confirm new password" placeholder="Repeat your password" value={repetir}
          onChange={e => setRepetir(e.target.value)} error={repetir && repetir !== contrasena ? 'The passwords don’t match yet.' : ''} />
        <div className="cuenta__accion">
          <Button type="submit" variant="primary" block disabled={!valido || ocupado}>{ocupado ? 'Saving…' : 'Save new password'}</Button>
        </div>
      </form>
    </Panel>
  )
}

export function ocultarCorreo(correo = '') {
  const [usuario, dominio] = correo.trim().split('@')
  if (!dominio) return correo
  return usuario.slice(0, 1) + '••••@' + dominio
}

// ── Consent ───────────────────────────────────────────────────
export function PantallaConsentimiento({ ocupado, error, onAceptar }) {
  const { Checkbox, Button } = ds()
  const [acepto, setAcepto] = useState(false)
  return (
    <Panel ancho={600}>
      <p className="sm-eyebrow cuenta__ceja">One last thing</p>
      <h1 className="sm-h1 cuenta__titulo cuenta__titulo--consentimiento">SymptomMap sits next to your care, not in place of it</h1>
      <p className="sm-body cuenta__parrafo">It works with diagnoses you already have from a qualified health professional. It doesn’t diagnose, it doesn’t treat, and nothing here replaces the people who support you.</p>
      <p className="sm-body cuenta__intro">Your map is yours. You add what you recognise, you remove what doesn’t fit, and you decide who ever sees it.</p>
      <Checkbox label="I’ve read this and I understand" checked={acepto} onChange={() => setAcepto(v => !v)} />
      <MensajeError codigo={error} />
      <div className="cuenta__accion">
        <Button variant="primary" block disabled={!acepto || ocupado} onClick={onAceptar}>Go to my map</Button>
      </div>
      <p className="sm-support cuenta__pie cuenta__pie--meta">You can read the full disclaimer any time in Settings.</p>
    </Panel>
  )
}
