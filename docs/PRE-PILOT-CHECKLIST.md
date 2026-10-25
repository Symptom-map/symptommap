# Pre-pilot checklist

Everything that must be done before the pilot (week of 23–27 November 2026). Tick items off here as they are finished, in the same PR as the work. Ana's visual version (with the daily progress) is the "Camino al piloto" artifact; keep both in sync.

## Security
- [ ] **Self-check on a Vercel preview** (done by an agent, report attached to the PR):
  - open the site in a private window without logging in and list everything that loads;
  - check what every network request returns (DevTools → Network): no health data, no other person's data;
  - confirm every endpoint (`/api/claude`, Supabase REST and RPC) refuses requests without a valid session.
- [ ] **External security review** (1–2 hours) by someone who did not build the app — e.g. Dr. Ruwangi Fernando (VU, cybersecurity).
- [x] Supabase security advisors: only the expected notices — `uso_ai` (RLS, no policies), and `consumir_cuota_ai()` / `borrar_mi_cuenta()` (security definer, callable by signed-in people on purpose; see `supabase/README.md`). Checked 22 Oct 2026; re-check after every migration.
- [x] Vercel Deployment Protection (Vercel Authentication, Standard Protection) is on for previews (checked 20 Oct 2026).
- [x] AWS: automatic cost stop. The project's **monthly spend limit ($20)** in the AWS account menu pauses the project on its own (checked 22 Oct 2026, $0 spent). The Budgets action `DenyBedrockWhenOverBudget` at $17 is a second brake (status Standby). Budget alert emails to symptommap.project@gmail.com are **inactive**: Ana's Google sign-in role cannot verify email contacts (`notifications-contacts:*`), so check spending in that menu instead.
- [x] Personal Anthropic API key removed from this project's Vercel. It is **kept** at console.anthropic.com because the backup (symptommaproject) still uses it (Ana, 20 Oct 2026). Keep a low monthly spend limit on it; delete it when the backup no longer needs it.
- [ ] No screenshots with preview links, emails or test data shared publicly.
- [ ] **Sessions last up to 6 days** (FUNCTIONAL-INVENTORY §1): Supabase → Authentication → Sessions → *Time-box user sessions* = 144 hours; no inactivity timeout. Supabase plan is Pro (checked 23 Oct 2026). Ana does this in the dashboard.
- [x] CI on every PR: tests, site build, and a check that the production build has no test mode (`.github/workflows/tests.yml`, review of 23 Oct 2026).
- [ ] Branch protection on `main`: require the "Tests" check before merging (once the workflow is on `main`).
- [ ] Content-Security-Policy header in `vercel.json` (review of 23 Oct 2026; HSTS, X-Frame-Options, nosniff, Referrer-Policy and Permissions-Policy are already there).
- [ ] Check the map's structure when it is loaded, so a damaged map cannot break the screen (review of 23 Oct 2026; not a security issue — RLS already keeps maps apart).

## AI
- [x] Claude Sonnet 4.6 on Bedrock, AU profile, quota approved (19 Oct 2026).
- [x] AWS keys for `symptommap-vercel` in Vercel (Production and Preview).
- [x] Usage limit in Supabase (`consumir_cuota_ai()`, PR #11).
- [ ] End-to-end test on a preview: a real suggestion, then check the real cost per suggestion.

## Email
- [x] Amazon SES (Sydney): identity `symptommap.com.au` created with Easy DKIM (RSA 2048); 3 DKIM CNAMEs and `_dmarc` TXT (`v=DMARC1; p=none;`) added in VentraIP (19 Oct 2026).
- [x] SES shows the domain as **Verified** (DKIM success, 22 Oct 2026).
- [x] Request production access — sent 22 Oct 2026 (Transactional · https://www.symptommap.com.au · English). The form no longer asks for a use case; if AWS asks by email, reply with the text below.
- [ ] AWS approves production access (usually 1–2 business days).

<details><summary>Use case text for the production access request</summary>

> SymptomMap is a web app for adults to visually understand their own confirmed mental-health diagnoses. It is preparing a small university-funded pilot (Victoria University SSAF grant, about 20–30 participants, late November 2026); the public site currently shows a "Coming soon" page while the app is tested privately.
>
> We will only send transactional authentication emails through Supabase Auth (custom SMTP): a 6-digit code to confirm the email address at sign-up, and password reset emails. Emails are only sent to people who create an account themselves and request the code. There is no marketing, no newsletters and no purchased lists.
>
> Expected volume: under 500 emails per month. Bounces and complaints: we keep the SES account-level suppression list enabled, monitor the reputation metrics in the SES console, and remove any address that bounces or complains. The domain symptommap.com.au uses Easy DKIM and a DMARC record.

</details>
- [ ] Supabase Auth custom SMTP through SES; logo in the email template.

## Product
- [x] Add a diagnosis: empty map, sidebar, Add a diagnosis window (PR #13).
- [x] Visual polish layer for the app: pill buttons and softer windows (PR #14).
- [x] Diagnosis profile: first setup after adding, edit later from the sidebar (PR #15).
- [x] Add a symptom (the AI connects it on Add; Analyse connections to review first; manual pick when the AI finds nothing) and the symptoms list in the sidebar (PR #16).
- [ ] Try "Add a symptom" on a Vercel preview with real Bedrock (first real AI call).
- [ ] Tell the psychologist about the 20 Oct change to adding symptoms (FUENTES §3c).
- [ ] Suggest symptoms (AI, Bedrock), then the end-to-end cost check.
- [x] Detail panel (click a diagnosis or symptom): edit, connect, delete (PR #20). "Connected to" is new (not in the prototype); the last connection cannot be removed there.
- [ ] Psychologist reviews the profile questions and options (`v2/src/perfil/preguntas.js`), together with the diagnosis catalogue.
- [ ] Fill the map in v2 (empty state, add diagnosis with autocomplete, symptoms).
- [x] Forgot password: email → 6-digit code → new password, other devices logged out (PR #17). Needs the "Reset Password" email template in Supabase (`supabase/plantillas/reset-password.html`).
- [x] Delete account and data: Settings → Privacy & your data, wording approved by Ana (FUENTES §3d); `borrar_mi_cuenta()` created 25 Oct 2026 (Ana ran it in the SQL editor).
- [ ] Settings: account name, change password (FUNCTIONAL-INVENTORY §11).
- [ ] Optional two-step verification (FUNCTIONAL-INVENTORY §1).
- [ ] Welcome tutorial (keep the empty state minimal while it runs).
- [ ] Export: choose what to include, anonymise, PDF preview (FUNCTIONAL-INVENTORY §10).
- [x] Test mode without an account, on previews and local only (nothing saved; example AI answers) (PR #19).
- [ ] Copy review of every screen, and an accessibility pass.
- [ ] One Lighthouse performance check on a preview.

## Public site (when it opens)
- [ ] Breadcrumb on the public pages (e.g. Home › Our story, Home › Why SymptomMap), linking back to Home, with `BreadcrumbList` structured data for SEO. **Not inside the app**: in the map, profile and settings a simple Back is enough and a breadcrumb would add noise (Ana, 20 Oct 2026).
- [ ] Visual polish pass with Ana's references (see `docs/design/REFERENCES.md`).

## Housekeeping
- [ ] Translate the remaining Spanish documents and comments to English (rule in `AGENTS.md`).
