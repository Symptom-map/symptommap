# Supabase — base de datos de SymptomMap

Proyecto `symptommap` en la región **Oceania (Sydney)** (`ap-southeast-2`), organización SymptomMap (Pro).

Las migraciones de `migrations/` son el historial exacto de lo que se aplicó a la base de datos. **No se editan las ya aplicadas**: un cambio nuevo es una migración nueva.

## Tablas

| Tabla | Qué guarda | Notas |
|---|---|---|
| `cuentas` | Nombre, cuándo se verificó 18+, cuándo se aprobó la elegibilidad, versión y fecha del consentimiento | **Sin** fecha de nacimiento ni respuesta de elegibilidad (datos mínimos) |
| `mapas` | Un documento JSON por persona, con la forma exacta del núcleo (`src/core/mapa.js`) | `revision` sube en cada cambio (para detectar ediciones desde dos pestañas). Máximo ~500 KB |
| `uso_ai` | **Cuántos** pedidos a la AI hizo cada persona por hora (nunca el texto) | Freno de costo: 15 por hora y 40 en 24 h por persona, 500 en 24 h en total. Solo se usa con `consumir_cuota_ai()` desde `api/claude.js`; las filas se borran a los 2 días |

## Seguridad

- **Row Level Security** en las dos tablas: cada persona solo ve y cambia lo suyo (`auth.uid() = user_id`). Desde la app no se crean filas: las crea la base de datos al registrarse (ver abajo).
- El rol `anon` (sin sesión) no tiene ningún permiso.
- No se puede borrar un mapa o una cuenta desde la app: se borran **en cascada** al borrar el usuario de `auth.users` ("Delete account and data"). Eso se hará con una función de servidor; nunca desde el navegador.
- Las marcas de tiempo, la hora del consentimiento y `revision` las pone la base de datos, no el cliente. Las marcas de 18+ y elegibilidad no se pueden cambiar después.
- Las reglas del mapa (colores, conexiones, borrado de diagnósticos) viven **solo en el núcleo**; la base de datos guarda, protege y limita el tamaño.

Las claves públicas (URL del proyecto y *publishable key*) pueden ir en el código de la v2. **La `service_role` key nunca va al navegador ni al repo.**

## Crear la cuenta (migración `20261011000000_cuentas_al_registrarse.sql`)

1. La persona pasa los gates de 18+ y elegibilidad en el navegador. La fecha de nacimiento y la respuesta de elegibilidad **nunca se envían**.
2. La app llama a `signUp` con el correo, la contraseña, el nombre y dos marcas `true`.
3. Un trigger en `auth.users` crea la fila de `cuentas` (con la hora del servidor) y el mapa vacío, y borra esos datos de la metadata de Auth. Si faltan, **rechaza el registro**.
4. Supabase envía un código de 6 dígitos; con él se confirma el correo y empieza la sesión.

Consecuencia: crear personas desde el panel ("Add user") o por invitación **falla a propósito**. Las cuentas de prueba se crean desde la app.

## Configuración del panel (no está en las migraciones)

En el panel de Supabase → *Authentication*:

| Dónde | Qué | Por qué |
|---|---|---|
| *URL Configuration* → Site URL | `https://www.symptommap.com.au/app/` | Dirección que usan los correos |
| *Emails* → *Confirm signup* | Pegar `plantillas/confirmar-registro.html` (usa `{{ .Token }}`) | La app pide un **código**, no un enlace |
| *Emails* → *Reset Password* | Paste `plantillas/reset-password.html` (uses `{{ .Token }}`), subject "Your SymptomMap code" | "Forgot your password?" asks for a **code**, not a link |
| *Sign In / Providers* → Email | "Confirm email" activado · largo del código (Email OTP Length) = **6** · contraseña mínima **8** | Coincide con las pantallas del prototipo |
| *Attack Protection* | Activar la protección de contraseñas filtradas | Rechaza contraseñas que aparecen en filtraciones conocidas |
| *Emails* → SMTP | **Antes del piloto:** un servidor de correo propio (con el dominio) | El correo de prueba de Supabase solo envía a los miembros del equipo y tiene un límite bajo por hora |
