# AWS — Bedrock (AI) y SES (correos)

Decisión del 13 oct 2026: ver `docs/FUENTES-Y-DECISIONES.md` §3b. Todo en la región **Asia Pacific (Sydney) `ap-southeast-2`**.

**Nunca** se pegan claves en el repo, en el chat ni en el navegador. Las claves viven solo en Vercel (Settings → Environment Variables).

## 1. Cuenta (una vez)
1. Crear la cuenta en aws.amazon.com y activar **MFA** en el usuario raíz.
2. Elegir la región **Asia Pacific (Sydney)**.
3. Billing → **Budgets** → "Monthly cost budget" → **$20** → alerta al correo.

## 2. Bedrock (Claude en Australia)
1. Bedrock → **Model catalog** → un modelo **Anthropic Claude Sonnet** → completar el formulario de *use case* (una vez por cuenta).
2. Bedrock → **Cross-region inference** → filtrar por `au.` → anotar el **ID del perfil** del modelo a usar (por defecto el código usa `au.anthropic.claude-sonnet-4-5-20250929-v1:0`).
3. Probarlo una vez en **Playground** con ese perfil (así queda habilitado).

## 3. Usuario para Vercel (permiso mínimo)
IAM → Users → Create user `symptommap-vercel` (sin acceso a la consola) → Add permissions → **Create inline policy** (JSON):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SoloClaudeEnAustralia",
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": [
        "arn:aws:bedrock:ap-southeast-2:*:inference-profile/au.anthropic.*",
        "arn:aws:bedrock:ap-southeast-2::foundation-model/anthropic.*",
        "arn:aws:bedrock:ap-southeast-4::foundation-model/anthropic.*"
      ]
    }
  ]
}
```

Luego: Security credentials → **Create access key** → "Application running outside AWS". Copiar las dos claves **directo a Vercel**:

| Variable | Valor | Entornos |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | la clave de acceso | Production y Preview |
| `AWS_SECRET_ACCESS_KEY` | la clave secreta | Production y Preview |
| `AWS_REGION` | `ap-southeast-2` | Production y Preview |
| `BEDROCK_MODELO` | solo si se usa otro perfil `au.` | Production y Preview |

Con esas variables, `api/claude.js` usa Bedrock. Es el único proveedor: la clave personal de Anthropic (`ANTHROPIC_API_KEY`) se retiró el 14 oct 2026 y no se vuelve a usar.

## 4. SES (correos desde el dominio) — tarea siguiente
Verificar `symptommap.com.au` en SES (registros DKIM en el DNS de VentraIP), pedir salida del modo de prueba ("production access") y conectar Supabase Auth con las credenciales SMTP de SES.
