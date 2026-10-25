// ─────────────────────────────────────────────────────────────
// cuenta.js — crear cuenta, confirmar el correo, entrar y salir
//
// Datos mínimos (docs/FUENTES-Y-DECISIONES.md):
// - La fecha de nacimiento y la respuesta de elegibilidad se revisan en el
//   navegador y nunca se envían. Al registrarse solo viajan el nombre y dos
//   marcas "sí". La base de datos guarda cuándo se aprobaron (hora del servidor).
// - La cuenta y el mapa vacío los crea la base de datos al registrarse
//   (supabase/migrations/20261011000000_cuentas_al_registrarse.sql).
//
// Los errores se traducen a un código propio; nunca se registran en consola
// ni se envían a ningún servicio.
// ─────────────────────────────────────────────────────────────

import { supabase } from './cliente.js'

export const LARGO_CODIGO = 6
export const VERSION_CONSENTIMIENTO = '2026-10-v1'

export class ErrorCuenta extends Error {
  constructor(codigo) {
    super(codigo)
    this.codigo = codigo
  }
}

// Convierte el error de Supabase en uno de nuestros códigos.
function traducir(error) {
  const codigo = error?.code || ''
  if (codigo === 'invalid_credentials') return new ErrorCuenta('credenciales')
  if (codigo === 'email_not_confirmed') return new ErrorCuenta('correo_sin_confirmar')
  if (codigo === 'otp_expired' || codigo === 'otp_disabled') return new ErrorCuenta('codigo_invalido')
  if (codigo === 'same_password') return new ErrorCuenta('contrasena_igual')
  if (codigo === 'weak_password') {
    // 'pwned': aparece en filtraciones conocidas (protección de contraseñas filtradas de Supabase).
    const razones = error?.weak_password?.reasons || error?.reasons || []
    return new ErrorCuenta(razones.includes('pwned') ? 'contrasena_filtrada' : 'contrasena_debil')
  }
  if (codigo === 'over_email_send_rate_limit' || codigo === 'over_request_rate_limit') return new ErrorCuenta('demasiados_intentos')
  // A real network failure has status 0. Supabase server errors (500–530) also
  // arrive as AuthRetryableFetchError, but they are not the person's internet
  // (e.g. an email that could not be sent): say so instead.
  if (error?.status === 0) return new ErrorCuenta('sin_conexion')
  if (error?.status >= 500) return new ErrorCuenta('error_servidor')
  return new ErrorCuenta('desconocido')
}

/**
 * Crea la cuenta. Solo se llama después de pasar los gates de 18+ y elegibilidad.
 * Supabase envía un código de 6 dígitos al correo para confirmarlo.
 * Si el correo ya tiene cuenta, Supabase responde igual (para no revelar
 * qué correos están registrados) y no envía nada.
 */
export async function crearCuenta({ nombre, correo, contrasena }) {
  const { error } = await supabase.auth.signUp({
    email: correo.trim(),
    password: contrasena,
    options: { data: { nombre: nombre.trim(), mayor_de_edad: true, elegibilidad: true } },
  })
  if (error) throw traducir(error)
}

/** Confirma el correo con el código. Si es correcto, la persona queda con sesión. */
export async function confirmarCorreo({ correo, codigo }) {
  const { error } = await supabase.auth.verifyOtp({ email: correo.trim(), token: codigo, type: 'email' })
  if (error) throw traducir(error)
}

/** Envía un código nuevo para confirmar el correo. */
export async function reenviarCodigo(correo) {
  const { error } = await supabase.auth.resend({ type: 'signup', email: correo.trim() })
  if (error) throw traducir(error)
}

export async function entrar({ correo, contrasena }) {
  const { error } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: contrasena })
  if (error) throw traducir(error)
}

// ── Forgot your password? (6-digit code, like confirming the email) ──
// The "Reset Password" email template must show {{ .Token }}
// (supabase/plantillas/reset-password.html), so no link or redirect is needed.

/**
 * Sends a reset code. Supabase answers the same whether or not the email has
 * an account, so the screen never reveals which emails are registered.
 */
export async function pedirRestablecer(correo) {
  const { error } = await supabase.auth.resetPasswordForEmail(correo.trim())
  if (error) throw traducir(error)
}

/** Checks the reset code. If it is right, the person has a session to set a new password. */
export async function confirmarRestablecer({ correo, codigo }) {
  const { error } = await supabase.auth.verifyOtp({ email: correo.trim(), token: codigo, type: 'recovery' })
  if (error) throw traducir(error)
}

/** Saves the new password and logs out every other device (the old password may be known). */
export async function cambiarContrasena(contrasena) {
  const { error } = await supabase.auth.updateUser({ password: contrasena })
  if (error) throw traducir(error)
  await supabase.auth.signOut({ scope: 'others' })
}

/**
 * Deletes the signed-in person's account and everything in it
 * (supabase/migrations/20261022000000_borrar_mi_cuenta.sql), then clears the
 * session in this browser. Cannot be undone.
 */
export async function borrarMiCuenta() {
  const { error } = await supabase.rpc('borrar_mi_cuenta')
  if (error) throw new ErrorCuenta(error.code === 'PGRST301' || error.code === '28000' ? 'sin_sesion' : 'desconocido')
  await supabase.auth.signOut({ scope: 'local' })
}

export async function salir() {
  // 'local': cierra la sesión en este navegador aunque no haya conexión.
  await supabase.auth.signOut({ scope: 'local' })
}

/** Sesión actual (o null) y aviso cada vez que cambia. */
export async function sesionActual() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function alCambiarSesion(funcion) {
  const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => funcion(sesion))
  return () => data.subscription.unsubscribe()
}

/** Datos de la cuenta de la persona con sesión: nombre y si ya aceptó el consentimiento vigente. */
export async function leerCuenta() {
  const { data, error } = await supabase
    .from('cuentas')
    .select('nombre, consentimiento_version')
    .maybeSingle()
  if (error) throw traducir(error)
  if (!data) return null
  return { nombre: data.nombre, consentimientoAceptado: data.consentimiento_version === VERSION_CONSENTIMIENTO }
}

/** Guarda que la persona aceptó el consentimiento. La hora la pone el servidor. */
export async function aceptarConsentimiento(userId) {
  const { error } = await supabase
    .from('cuentas')
    .update({ consentimiento_version: VERSION_CONSENTIMIENTO })
    .eq('user_id', userId)
  if (error) throw traducir(error)
}
