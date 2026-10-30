# Supabase — SymptomMap's database

Project `symptommap` in the **Oceania (Sydney)** region (`ap-southeast-2`), SymptomMap organisation (Pro).

The migrations in `migrations/` are the exact history of what was applied to the database. **Applied migrations are never edited**: a new change is a new migration.

## Tables

| Table | What it stores | Notes |
|---|---|---|
| `cuentas` | Name, when 18+ was verified, when eligibility was approved, consent version and date | **No** date of birth and no eligibility answer (minimum data) |
| `mapas` | One JSON document per person, in the exact shape of the core (`src/core/mapa.js`) | `revision` goes up on every change (to detect edits from two tabs). At most ~500 KB |
| `uso_ai` | **How many** AI requests each person made per hour (never the text) | Cost brake: 15 per hour and 40 per 24 h per person, 500 per 24 h in total. Only used through `consumir_cuota_ai()` from `api/claude.js`; rows are deleted after 2 days |

## Security

- **Row Level Security** on every table: each person only sees and changes their own rows (`auth.uid() = user_id`). `uso_ai` has RLS with no policies, so nobody reads it directly. The app never creates rows: the database creates them at sign-up (see below).
- The `anon` role (no session) has no permissions at all.
- A map or an account cannot be deleted from the app directly: they are deleted **in cascade** when the user is deleted from `auth.users`, through `borrar_mi_cuenta()` ("Delete your account and data"), which only deletes the caller's own account.
- Timestamps, the consent time and `revision` are set by the database, not the client. The 18+ and eligibility timestamps cannot be changed later.
- The map rules (colours, connections, deleting diagnoses) live **only in the core**; the database stores, protects and limits the size.
- **Self-check:** `pruebas/autochequeo-rls.sql` tries what an attacker would (no session; reading, changing, taking over or deleting another person's map) and rolls everything back. Re-run it after every migration.

The public keys (project URL and *publishable key*) can be in the v2 code. **The `service_role` key never goes to the browser or the repo.**

## Creating the account (migration `20261011000000_cuentas_al_registrarse.sql`)

1. The person passes the 18+ and eligibility gates in the browser. The date of birth and the eligibility answer are **never sent**.
2. The app calls `signUp` with the email, password, name and two `true` flags.
3. A trigger on `auth.users` creates the `cuentas` row (with the server time) and the empty map, and removes that data from the Auth metadata. If it is missing, **the sign-up is rejected**.
4. Supabase sends a 6-digit code; it confirms the email and starts the session.

Consequence: creating people from the dashboard ("Add user") or by invitation **fails on purpose**. Test accounts are created from the app.

## Dashboard settings (not in the migrations)

In the Supabase dashboard → *Authentication*:

| Where | What | Why |
|---|---|---|
| *URL Configuration* → Site URL | `https://www.symptommap.com.au/app/` | Address used by the emails |
| *Emails* → *Confirm signup* | Paste `plantillas/confirmar-registro.html` (uses `{{ .Token }}`) | The app asks for a **code**, not a link |
| *Emails* → *Reset Password* | Paste `plantillas/reset-password.html` (uses `{{ .Token }}`), subject "SymptomMap Reset Password" (different from the sign-up email) | "Forgot your password?" asks for a **code**, not a link |
| *Sign In / Providers* → Email | "Confirm email" on · Email OTP Length = **6** · minimum password **8** | Matches the prototype screens |
| *Attack Protection* | Turn on leaked password protection | Rejects passwords found in known breaches |
| *Sessions* | Time-box user sessions = **144 hours**; no inactivity timeout | Sessions last up to 6 days (FUNCTIONAL-INVENTORY §1) |
| *Emails* → SMTP Settings | **Custom SMTP on (25 Oct 2026):** sender `noreply@symptommap.com.au`, name `SymptomMap`, host `email-smtp.ap-southeast-2.amazonaws.com`, port `587`, user/password of IAM user `symptommap-ses-smtp` (`docs/aws/README.md` §4). Email rate limit went from 2/h to 30/h | Emails leave from the domain, through Amazon SES in Sydney |

## Expected security advisor notices

Supabase → Advisors → Security shows these on purpose; anything else needs a look:
- `uso_ai`: RLS enabled, no policies — nobody reads it directly, only `consumir_cuota_ai()`.
- `consumir_cuota_ai()` and `borrar_mi_cuenta()`: security definer functions callable by signed-in people. Both only act on the caller (`auth.uid()`); anonymous callers cannot run them.

`borrar_mi_cuenta()` (migration `20261022000000_borrar_mi_cuenta.sql`) was run by Ana in the SQL editor on 25 Oct 2026, because the tool's approval prompt did not reach her.
