// ─────────────────────────────────────────────────────────────
// App.jsx — flujo de la v2: cuenta → mapa guardado en la nube
//
// Orden del prototipo aprobado:
//   Sign up (1/3) → [Gate 18+] → Eligibility (2/3) → [Gate sin diagnóstico]
//   → Verify email (3/3) → Consent → mapa
//   Log in → (Verify email si el correo no estaba confirmado) → mapa
//
// Pendiente en otras tareas: "Protect your account" (verificación en dos pasos,
// opcional), el walkthrough de bienvenida, recuperar la contraseña y editar el
// mapa (agregar diagnósticos y síntomas). Ver docs/FUENTES-Y-DECISIONES.md.
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react'
import { moverDiagnostico, moverSintoma } from '@nucleo/mapa.js'
import { ds } from './ds/index.js'
import MapaVista from './mapa/MapaVista.jsx'
import {
  PantallaEntrar, PantallaRegistro, PantallaMenorDeEdad, PantallaElegibilidad,
  PantallaSinDiagnostico, PantallaVerificar, PantallaConsentimiento, MENSAJES,
} from './cuenta/Pantallas.jsx'
import { SIN_DIAGNOSTICO } from './cuenta/validar.js'
import {
  crearCuenta, confirmarCorreo, reenviarCodigo, entrar, salir,
  sesionActual, alCambiarSesion, leerCuenta, aceptarConsentimiento,
} from './nube/cuenta.js'
import { cargarMapa, guardarMapa } from './nube/mapa.js'

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
    setRegistro(datos)
    irA(edad < 18 ? 'menorDeEdad' : 'elegibilidad')
  }

  const alElegir = eleccion => {
    if (eleccion === SIN_DIAGNOSTICO) { setRegistro(null); irA('sinDiagnostico'); return }
    hacer(async () => {
      await crearCuenta({ nombre: registro.nombre, correo: registro.correo, contrasena: registro.contrasena })
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
      {pantalla === 'entrar' && <PantallaEntrar {...comunes} onEntrar={alEntrar} onIrARegistro={() => irA('registro')} />}
      {pantalla === 'registro' && <PantallaRegistro inicial={registro} onContinuar={alTerminarPaso1} onIrAEntrar={() => irA('entrar')} />}
      {pantalla === 'menorDeEdad' && <PantallaMenorDeEdad />}
      {pantalla === 'elegibilidad' && <PantallaElegibilidad {...comunes} onContinuar={alElegir} />}
      {pantalla === 'sinDiagnostico' && <PantallaSinDiagnostico />}
      {pantalla === 'verificar' && <PantallaVerificar {...comunes} aviso={aviso} correo={correoPendiente} onVerificar={alVerificar} onReenviar={alReenviar} />}
      {pantalla === 'consentimiento' && <PantallaConsentimiento {...comunes} onAceptar={alAceptar} />}
      {pantalla === 'mapa' && sesion && <MiMapa userId={sesion.user.id} nombre={cuenta?.nombre} onSalir={alSalir} />}
    </div>
  )
}

// ── El mapa de la persona, con guardado automático ────────────
function MiMapa({ userId, nombre, onSalir }) {
  const { AppHeader, Button, InlineMessage } = ds()
  const [mapa, setMapa] = useState(null)
  const [problema, setProblema] = useState('')
  const revision = useRef(null)
  const pendiente = useRef(null) // mapa que falta guardar
  const temporizador = useRef(null)
  const guardando = useRef(false)

  const recargar = useCallback(async () => {
    try {
      const datos = await cargarMapa()
      revision.current = datos.revision
      setMapa(datos.mapa)
      setProblema('')
    } catch {
      setProblema('sin_conexion')
    }
  }, [])

  useEffect(() => { recargar() }, [recargar])

  const guardarAhora = useCallback(async () => {
    clearTimeout(temporizador.current)
    if (guardando.current || !pendiente.current) return
    guardando.current = true
    const aGuardar = pendiente.current
    pendiente.current = null
    try {
      revision.current = await guardarMapa(userId, aGuardar, revision.current)
      setProblema('')
    } catch (e) {
      if (e.codigo === 'conflicto') {
        // Otra pestaña o dispositivo guardó antes: se muestra su versión.
        await recargar()
        setProblema('conflicto')
      } else {
        pendiente.current = pendiente.current || aGuardar // se reintenta en el próximo cambio
        setProblema(e.codigo || 'sin_conexion')
      }
    } finally {
      guardando.current = false
      if (pendiente.current) temporizador.current = setTimeout(guardarAhora, ESPERA_GUARDADO_MS)
    }
  }, [userId, recargar])

  function cambiar(nuevo) {
    setMapa(nuevo)
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

  async function salirGuardando() {
    await guardarAhora()
    onSalir()
  }

  // NUEVO: mensajes de guardado que el prototipo no mostraba.
  const textoProblema = {
    conflicto: 'Your map changed in another window. We loaded the latest version.',
    demasiado_grande: 'Your map is too large to save. Remove something and try again.',
  }[problema] || (problema ? MENSAJES.sin_conexion : '')

  const titulo = nombre ? `${nombre}’s map` : 'My map'
  return (
    <>
      <AppHeader context={titulo} actions={<Button variant="ghost" size="sm" onClick={salirGuardando}>Log out</Button>} />
      <main className="app__principal">
        <h1 className="sr-only">{titulo}</h1>
        {mapa && <MapaVista mapa={mapa} onMover={mover} />}
        {textoProblema && <div className="app__problema" role="alert"><InlineMessage tone={problema === 'conflicto' ? 'info' : 'error'}>{textoProblema}</InlineMessage></div>}
        <p className="app__aviso">Development preview</p>
      </main>
    </>
  )
}
