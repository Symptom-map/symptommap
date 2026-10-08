# Supabase — base de datos de SymptomMap

Proyecto `symptommap` en la región **Oceania (Sydney)** (`ap-southeast-2`), organización SymptomMap (Pro).

Las migraciones de `migrations/` son el historial exacto de lo que se aplicó a la base de datos. **No se editan las ya aplicadas**: un cambio nuevo es una migración nueva.

## Tablas

| Tabla | Qué guarda | Notas |
|---|---|---|
| `cuentas` | Nombre, cuándo se verificó 18+, cuándo se aprobó la elegibilidad, versión y fecha del consentimiento | **Sin** fecha de nacimiento ni respuesta de elegibilidad (datos mínimos) |
| `mapas` | Un documento JSON por persona, con la forma exacta del núcleo (`src/core/mapa.js`) | `revision` sube en cada cambio (para detectar ediciones desde dos pestañas). Máximo ~500 KB |

## Seguridad

- **Row Level Security** en las dos tablas: cada persona solo ve, crea y cambia lo suyo (`auth.uid() = user_id`).
- El rol `anon` (sin sesión) no tiene ningún permiso.
- No se puede borrar un mapa o una cuenta desde la app: se borran **en cascada** al borrar el usuario de `auth.users` ("Delete account and data"). Eso se hará con una función de servidor; nunca desde el navegador.
- Las marcas de tiempo y `revision` las pone la base de datos, no el cliente.
- Las reglas del mapa (colores, conexiones, borrado de diagnósticos) viven **solo en el núcleo**; la base de datos guarda, protege y limita el tamaño.

Las claves públicas (URL del proyecto y *publishable key*) pueden ir en el código de la v2. **La `service_role` key nunca va al navegador ni al repo.**
