// ─────────────────────────────────────────────────────────────
// api/claude.js — proxy mínimo hacia Claude
//
// Existe solo para que la API key nunca llegue al navegador.
// El servidor decide el modelo y el límite de tokens: el cliente
// solo puede enviar un mensaje de texto. Así nadie puede usar
// esta función para pedir otro modelo, respuestas enormes o
// herramientas que la app no usa.
//
// Privacidad: nunca registrar el contenido de la petición ni de
// la respuesta (contienen información de salud).
// ─────────────────────────────────────────────────────────────

const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS_TOPE = 1500      // el mayor valor que usa la app hoy
const MAX_CARACTERES = 20000      // tamaño máximo del mensaje

function error(res, status, mensaje) {
  return res.status(status).json({ error: { message: mensaje } })
}

// Acepta solo peticiones hechas desde la propia app (mismo origen).
// Bloquea que otros sitios usen esta función desde un navegador.
// No reemplaza la autenticación: llegará con las cuentas de usuario.
function esMismoOrigen(req) {
  const origen = req.headers.origin
  const host = req.headers['x-forwarded-host'] || req.headers.host
  if (!origen || !host) return false
  try {
    return new URL(origen).host === host
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return error(res, 405, 'Método no permitido')
  }

  if (!esMismoOrigen(req)) {
    return error(res, 403, 'Origen no permitido')
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return error(res, 500, 'El servicio de AI no está configurado')
  }

  // Validar la forma exacta que envía la app:
  // { messages: [{ role: 'user', content: '<texto>' }], max_tokens?: número }
  const body = req.body
  const mensajes = body && Array.isArray(body.messages) ? body.messages : null
  const unico = mensajes && mensajes.length === 1 ? mensajes[0] : null

  if (!unico || unico.role !== 'user' || typeof unico.content !== 'string') {
    return error(res, 400, 'Petición inválida')
  }
  if (unico.content.length === 0 || unico.content.length > MAX_CARACTERES) {
    return error(res, 413, 'El mensaje es demasiado largo')
  }

  const pedido = Number.isInteger(body.max_tokens) ? body.max_tokens : 1000
  const maxTokens = Math.min(Math.max(pedido, 1), MAX_TOKENS_TOPE)

  try {
    const respuesta = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: unico.content }],
      }),
    })

    const datos = await respuesta.json().catch(() => null)

    if (!respuesta.ok || !datos) {
      // Registrar solo el código, nunca el contenido.
      console.error('Claude API respondió', respuesta.status)
      const status = respuesta.status === 429 ? 429 : 502
      return error(res, status, 'La sugerencia no está disponible ahora. Intenta de nuevo en un momento.')
    }

    // Devolver solo lo que la app usa.
    return res.status(200).json({ content: datos.content || [] })
  } catch {
    console.error('No se pudo contactar a Claude API')
    return error(res, 502, 'La sugerencia no está disponible ahora. Intenta de nuevo en un momento.')
  }
}
