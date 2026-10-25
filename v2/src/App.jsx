// ─────────────────────────────────────────────────────────────
// App.jsx — flujo de la v2: cuenta → mapa guardado en la nube
//
// Orden del prototipo aprobado:
//   Sign up (1/3) → [Gate 18+] → Eligibility (2/3) → [Gate sin diagnóstico]
//   → Verify email (3/3) → Consent → mapa
//   Log in → (Verify email si el correo no estaba confirmado) → mapa
//
// Still to do in other tasks: "Protect your account" (optional two-step
// verification), the welcome walkthrough, password reset, AI suggestions and
// the detail panel.
// See docs/PRE-PILOT-CHECKLIST.md.
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react'
import { agregarDiagnostico, agregarSintoma, borrarSintoma, desconectar, diagnosticosDe, guardarPerfil, moverDiagnostico, moverSintoma, normalizar, ErrorMapa } from '@nucleo/mapa.js'
import { ds } from './ds/index.js'
import MapaVista from './mapa/MapaVista.jsx'
import BarraLateral from './mapa/BarraLateral.jsx'
import AgregarDiagnostico from './mapa/AgregarDiagnostico.jsx'
import PerfilDiagnostico from './perfil/PerfilDiagnostico.jsx'
import AgregarSintoma from './mapa/AgregarSintoma.jsx'
import AvisoSintoma from './mapa/AvisoSintoma.jsx'
import { preguntasPara } from './perfil/preguntas.js'
import {
  PantallaEntrar, PantallaRegistro, PantallaMenorDeEdad, PantallaElegibilidad,
  PantallaSinDiagnostico, PantallaVerificar, PantallaConsentimiento, PantallaOlvide, PantallaNuevaContrasena, MENSAJES,
} from './cuenta/Pantallas.jsx'
import { SIN_DIAGNOSTICO } from './cuenta/validar.js'
import {
  crearCuenta, confirmarCorreo, reenviarCodigo, entrar, salir,
  sesionActual, alCambiarSesion, leerCuenta, aceptarConsentimiento,
  pedirRestablecer, confirmarRestablecer, cambiarContrasena,
} from './nube/cuenta.js'
import { cargarMapa, guardarMapa } from './nube/mapa.js'
import { crearMapa } from '@nucleo/mapa.js'
import { MODO_PRUEBA_DISPONIBLE, activarModoPrueba, salirModoPrueba } from './prueba.js'

const ESPERA_GUARDADO_MS = 800

export default function App() {
  const [pantalla, setPantalla] = useState('cargando')
  const [sesion, setSesion] = useState(null)
  const [cuenta, setCuenta] = useState(null)
  const [registro, setRegistro] = useState(null) // datos del paso 1, solo en memoria
  const [correoPendiente, setCorreoPendiente] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [errorRegistro, setErrorRegistro] = useState('') // contraseña rechazada al crear la cuenta

  const irA = useCallback(destino => {
    setError('')
    setAviso('')
    setPantalla(destino)
  }, [])

  // Con sesión: lee la cuenta y decide si falta el consentimiento.
  const continuarConSesion = useCallback(async s => {
    setSesion(s)
    try {
      const datos = await leerCuenta()
      setCuenta(datos)
      irA(datos && !datos.consentimientoAceptado ? 'consentimiento' : 'mapa')
    } catch {
      setError('sin_conexion')
      setPantalla('entrar')
    }
  }, [irA])

  useEffect(() => {
    let activo = true
    sesionActual().then(s => {
      if (!activo) return
      if (s) continuarConSesion(s)
      else if (MODO_PRUEBA_DISPONIBLE && window.location.hash === '#prueba') { activarModoPrueba(); irA('prueba') }
      else irA(window.location.hash === '#create' ? 'registro' : 'entrar')
    })
    const dejar = alCambiarSesion(s => {
      if (!s && activo) { setSesion(null); setCuenta(null); irA('entrar') }
    })
    return () => { activo = false; dejar() }
  }, [continuarConSesion, irA])

  async function hacer(accion) {
    setOcupado(true)
    setError('')
    try {
      await accion()
    } catch (e) {
      setError(e.codigo || 'desconocido')
    } finally {
      setOcupado(false)
    }
  }

  // ── Acciones de cada pantalla ──
  const alEntrar = datos => hacer(async () => {
    try {
      await entrar(datos)
    } catch (e) {
      if (e.codigo !== 'correo_sin_confirmar') throw e
      setCorreoPendiente(datos.correo)
      await reenviarCodigo(datos.correo)
      irA('verificar')
      return
    }
    await continuarConSesion(await sesionActual())
  })

  function alTerminarPaso1(datos, edad) {
    setErrorRegistro('')
    setRegistro(datos)
    irA(edad < 18 ? 'menorDeEdad' : 'elegibilidad')
  }

  const alElegir = eleccion => {
    if (eleccion === SIN_DIAGNOSTICO) { setRegistro(null); irA('sinDiagnostico'); return }
    hacer(async () => {
      try {
        await crearCuenta({ nombre: registro.nombre, correo: registro.correo, contrasena: registro.contrasena })
      } catch (e) {
        // La contraseña se corrige en el paso 1, no aquí: se vuelve con ella vacía.
        if (e.codigo === 'contrasena_debil' || e.codigo === 'contrasena_filtrada') {
          setRegistro({ ...registro, contrasena: '', repetir: '' })
          irA('registro')
          setErrorRegistro(e.codigo)
          return
        }
        throw e
      }
      setCorreoPendiente(registro.correo)
      setRegistro(null) // la contraseña no se queda en memoria
      irA('verificar')
    })
  }

  const alVerificar = codigo => hacer(async () => {
    await confirmarCorreo({ correo: correoPendiente, codigo })
    await continuarConSesion(await sesionActual())
  })

  const alReenviar = () => hacer(async () => {
    await reenviarCodigo(correoPendiente)
    setAviso('We sent a new code.') // NUEVO: confirmación que el prototipo no mostraba
  })

  // ── Forgot your password? ──
  const alPedirRestablecer = correo => hacer(async () => {
    await pedirRestablecer(correo)
    setCorreoPendiente(correo)
    irA('restablecerCodigo')
  })

  const alReenviarRestablecer = () => hacer(async () => {
    await pedirRestablecer(correoPendiente)
    setAviso('We sent a new code.')
  })

  const alConfirmarRestablecer = codigo => hacer(async () => {
    await confirmarRestablecer({ correo: correoPendiente, codigo })
    irA('nuevaContrasena')
  })

  const alGuardarContrasena = contrasena => hacer(async () => {
    await cambiarContrasena(contrasena)
    await continuarConSesion(await sesionActual())
  })

  const alAceptar = () => hacer(async () => {
    await aceptarConsentimiento(sesion.user.id)
    setCuenta(c => ({ ...c, consentimientoAceptado: true }))
    irA('mapa')
  })

  const alSalir = async () => {
    await salir()
    setSesion(null)
    setCuenta(null)
    irA('entrar')
  }

  const comunes = { ocupado, error }
  return (
    <div className="app">
      {pantalla === 'cargando' && <div className="cuenta" aria-busy="true" />}
      {pantalla === 'entrar' && <PantallaEntrar {...comunes} onEntrar={alEntrar} onIrARegistro={() => irA('registro')} onOlvide={correo => { setCorreoPendiente(correo); irA('olvide') }}
        onPrueba={MODO_PRUEBA_DISPONIBLE ? () => { activarModoPrueba(); irA('prueba') } : undefined} />}
      {pantalla === 'olvide' && <PantallaOlvide {...comunes} inicial={correoPendiente} onEnviar={alPedirRestablecer} onVolver={() => irA('entrar')} />}
      {pantalla === 'restablecerCodigo' && <PantallaVerificar {...comunes} restablecer aviso={aviso} correo={correoPendiente} onVerificar={alConfirmarRestablecer} onReenviar={alReenviarRestablecer} />}
      {pantalla === 'nuevaContrasena' && <PantallaNuevaContrasena {...comunes} onGuardar={alGuardarContrasena} />}
      {pantalla === 'registro' && <PantallaRegistro inicial={registro} error={errorRegistro} onContinuar={alTerminarPaso1} onIrAEntrar={() => irA('entrar')} />}
      {pantalla === 'menorDeEdad' && <PantallaMenorDeEdad />}
      {pantalla === 'elegibilidad' && <PantallaElegibilidad {...comunes} onContinuar={alElegir} />}
      {pantalla === 'sinDiagnostico' && <PantallaSinDiagnostico />}
      {pantalla === 'verificar' && <PantallaVerificar {...comunes} aviso={aviso} correo={correoPendiente} onVerificar={alVerificar} onReenviar={alReenviar} />}
      {pantalla === 'consentimiento' && <PantallaConsentimiento {...comunes} onAceptar={alAceptar} />}
      {pantalla === 'mapa' && sesion && <MiMapa userId={sesion.user.id} nombre={cuenta?.nombre} onSalir={alSalir} />}
      {pantalla === 'prueba' && MODO_PRUEBA_DISPONIBLE && <MiMapa prueba onSalir={() => { salirModoPrueba(); window.history.replaceState(null, '', window.location.pathname); irA('entrar') }} />}
    </div>
  )
}

// ── The person's map, saved automatically ─────────────────────
// prueba: test mode (prueba.js) — the map starts empty and lives in memory only.
function MiMapa({ userId, nombre, onSalir, prueba = false }) {
  const { AppHeader, Button, InlineMessage } = ds()
  const [mapa, setMapa] = useState(null)
  const [problema, setProblema] = useState('')
  const [agregando, setAgregando] = useState(false) // "Add a diagnosis" window open
  const [errorAgregar, setErrorAgregar] = useState('')
  // Profile window: a new diagnosis waiting for its profile ({ datos }) or an existing one ({ id }).
  const [perfilAbierto, setPerfilAbierto] = useState(null)
  const [agregandoSintoma, setAgregandoSintoma] = useState(false)
  const [avisoSintoma, setAvisoSintoma] = useState(null) // what "Add" connected a symptom to
  const revision = useRef(null)
  const pendiente = useRef(null) // mapa que falta guardar
  const temporizador = useRef(null)
  const guardando = useRef(false)

  const recargar = useCallback(async () => {
    if (prueba) { setMapa(crearMapa()); return }
    try {
      const datos = await cargarMapa()
      revision.current = datos.revision
      setMapa(datos.mapa)
      setProblema('')
    } catch {
      setProblema('sin_conexion')
    }
  }, [prueba])

  useEffect(() => { recargar() }, [recargar])

  const guardarAhora = useCallback(async () => {
    clearTimeout(temporizador.current)
    if (guardando.current || !pendiente.current) return
    guardando.current = true
    const aGuardar = pendiente.current
    pendiente.current = null
    // Tras un error solo se vuelve a intentar si la persona cambió algo mientras
    // se guardaba. Nunca se reintenta solo en bucle (sin conexión, mapa demasiado
    // grande…): lo pendiente se guarda con el próximo cambio o al salir de la pestaña.
    let reintentar = true
    try {
      revision.current = await guardarMapa(userId, aGuardar, revision.current)
      setProblema('')
    } catch (e) {
      if (e.codigo === 'conflicto') {
        // Otra pestaña o dispositivo guardó antes: se muestra su versión.
        await recargar()
        setProblema('conflicto')
      } else {
        reintentar = pendiente.current !== null
        pendiente.current = pendiente.current || aGuardar
        setProblema(e.codigo || 'sin_conexion')
      }
    } finally {
      guardando.current = false
      if (pendiente.current && reintentar) temporizador.current = setTimeout(guardarAhora, ESPERA_GUARDADO_MS)
    }
  }, [userId, recargar])

  function cambiar(nuevo) {
    setMapa(nuevo)
    if (prueba) return // nothing is saved in test mode
    pendiente.current = nuevo
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(guardarAhora, ESPERA_GUARDADO_MS)
  }

  // Si la persona cambia de pestaña o cierra, se intenta guardar lo pendiente.
  useEffect(() => {
    const alOcultar = () => { if (document.visibilityState === 'hidden') guardarAhora() }
    document.addEventListener('visibilitychange', alOcultar)
    return () => document.removeEventListener('visibilitychange', alOcultar)
  }, [guardarAhora])

  function mover(tipo, id, posicion) {
    cambiar(tipo === 'diagnostico' ? moverDiagnostico(mapa, id, posicion) : moverSintoma(mapa, id, posicion))
  }

  // The core decides everything (colour, place, duplicates, the 10 limit).
  // A diagnosis that is already on the map is not added twice. A new one is
  // only added when its profile is saved (prototype: "Your diagnosis hasn’t
  // been added yet"), so this step only checks that it can be added.
  function agregar(datos) {
    try {
      const r = agregarDiagnostico(mapa, datos)
      setAgregando(false)
      setErrorAgregar('')
      if (!r.yaExistia) setPerfilAbierto({ datos })
    } catch (e) {
      if (!(e instanceof ErrorMapa)) throw e
      setErrorAgregar(e.codigo === 'LIMITE_DIAGNOSTICOS'
        ? 'You can add up to 10 diagnoses.'
        : 'This diagnosis could not be added. Please try again.')
    }
  }

  function guardarPerfilAbierto(perfil) {
    try {
      if (perfilAbierto.datos) {
        // Checked again against the current map (another tab may have changed it).
        const r = agregarDiagnostico(mapa, perfilAbierto.datos)
        if (!r.yaExistia) cambiar(guardarPerfil(r.mapa, r.diagnosticoId, perfil))
      } else {
        cambiar(guardarPerfil(mapa, perfilAbierto.id, perfil))
      }
    } catch (e) {
      if (!(e instanceof ErrorMapa)) throw e
    }
    setPerfilAbierto(null)
  }

  // What the profile window shows: the person's wording as the title and the
  // question set chosen by the internal key.
  const diagnosticoAbierto = perfilAbierto?.id ? mapa?.diagnosticos.find(d => d.id === perfilAbierto.id) : null
  const datosPerfil = perfilAbierto?.datos || diagnosticoAbierto

  // A symptom always arrives with at least one connection: chosen by the AI
  // ("Add") or kept by the person ("Analyse connections" / their own pick).
  // Wording that matches an existing symptom merges into it (core). After
  // "Add" a notice shows what it was connected to (Ana, 20 Oct 2026).
  function agregarSintomaConectado({ texto, cuando, conexiones, revisado }) {
    try {
      const vigentes = conexiones.filter(c => mapa.diagnosticos.some(d => d.id === c.diagnosticoId))
      // Connections it already had, when the wording merges into an existing symptom.
      const igual = mapa.sintomas.find(s => normalizar(s.texto) === normalizar(texto))
      const antes = igual ? diagnosticosDe(mapa, igual.id).map(d => d.id) : []
      const r = agregarSintoma(mapa, { texto, cuando, diagnosticoIds: vigentes.map(c => c.diagnosticoId) })
      cambiar(r.mapa)
      setAvisoSintoma(revisado ? null : {
        sintomaId: r.sintomaId,
        fusionado: r.fusionado,
        conexiones: vigentes.filter(c => !antes.includes(c.diagnosticoId)),
      })
    } catch (e) {
      if (!(e instanceof ErrorMapa)) throw e
    }
    setAgregandoSintoma(false)
  }

  function abrirAgregarSintoma() {
    setAvisoSintoma(null)
    setAgregandoSintoma(true)
  }

  function abrirAgregar() {
    setErrorAgregar('')
    setAgregando(true)
  }

  async function salirGuardando() {
    await guardarAhora()
    onSalir()
  }

  // NEW: saving messages the prototype did not show.
  const textoProblema = {
    conflicto: 'Your map changed in another window. We loaded the latest version.',
    demasiado_grande: 'Your map is too large to save. Remove something and try again.',
  }[problema] || (problema ? MENSAJES.sin_conexion : '')

  const titulo = prueba ? 'Test map' : nombre ? `${nombre}’s map` : 'My map'
  return (
    <>
      <AppHeader context={titulo} actions={<Button variant="ghost" size="sm" onClick={salirGuardando}>{prueba ? 'Leave test mode' : 'Log out'}</Button>} />
      <main className="app__principal app__principal--mapa">
        <h1 className="sr-only">{titulo}</h1>
        {mapa && <BarraLateral mapa={mapa} onAgregarDiagnostico={abrirAgregar} onAgregarSintoma={abrirAgregarSintoma} onEditarPerfil={id => setPerfilAbierto({ id })} />}
        <div className="lienzo">
          {mapa && mapa.diagnosticos.length === 0 && mapa.sintomas.length === 0 && (
            <div className="lienzo__vacio">
              <h2 className="sm-h2 lienzo__titulo">Your map starts empty, that’s normal</h2>
              <p className="sm-body lienzo__texto">Add a diagnosis you’ve already received and it becomes the first circle here.</p>
              <Button variant="primary" size="sm" onClick={abrirAgregar}>Add your first diagnosis</Button>
            </div>
          )}
          {mapa && (mapa.diagnosticos.length > 0 || mapa.sintomas.length > 0) && <MapaVista mapa={mapa} onMover={mover} />}
          {textoProblema && <div className="app__problema" role="alert"><InlineMessage tone={problema === 'conflicto' ? 'info' : 'error'}>{textoProblema}</InlineMessage></div>}
          {avisoSintoma && mapa && (
            <AvisoSintoma
              mapa={mapa}
              aviso={avisoSintoma}
              onQuitar={(sintomaId, diagnosticoId) => cambiar(desconectar(mapa, sintomaId, diagnosticoId))}
              onDeshacer={sintomaId => { cambiar(borrarSintoma(mapa, sintomaId)); setAvisoSintoma(null) }}
              onCerrar={() => setAvisoSintoma(null)}
            />
          )}
          {prueba
            ? <p className="app__aviso app__aviso--prueba" role="status">Test mode: nothing is saved and AI answers are examples</p>
            : <p className="app__aviso">Development preview</p>}
        </div>
        {agregando && mapa && (
          <AgregarDiagnostico mapa={mapa} error={errorAgregar} onAgregar={agregar} onCerrar={() => setAgregando(false)} />
        )}
        {agregandoSintoma && (
          <AgregarSintoma mapa={mapa} onAgregar={agregarSintomaConectado} onCerrar={() => setAgregandoSintoma(false)} />
        )}
        {perfilAbierto && datosPerfil && (
          <PerfilDiagnostico
            key={perfilAbierto.id || 'nuevo'}
            titulo={datosPerfil.etiqueta}
            preguntas={preguntasPara(datosPerfil.claveCanonica)}
            inicial={perfilAbierto.id ? mapa.perfiles[perfilAbierto.id] : null}
            primeraVez={!!perfilAbierto.datos}
            onGuardar={guardarPerfilAbierto}
            onOmitir={() => setPerfilAbierto(null)}
            onDescartar={() => setPerfilAbierto(null)}
          />
        )}
      </main>
    </>
  )
}
