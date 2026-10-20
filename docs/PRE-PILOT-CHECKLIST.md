# Pre-pilot checklist

Everything that must be done before the pilot (week of 23–27 November 2026). Tick items off here as they are finished, in the same PR as the work.

## Security
- [ ] **Self-check on a Vercel preview** (done by an agent, report attached to the PR):
  - open the site in a private window without logging in and list everything that loads;
  - check what every network request returns (DevTools → Network): no health data, no other person's data;
  - confirm every endpoint (`/api/claude`, Supabase REST and RPC) refuses requests without a valid session.
- [ ] **External security review** (1–2 hours) by someone who did not build the app — e.g. Dr. Ruwangi Fernando (VU, cybersecurity).
- [ ] Supabase security advisors: only the two expected notices for `uso_ai` / `consumir_cuota_ai()` (see `supabase/README.md`).
- [x] Vercel Deployment Protection (Vercel Authentication, Standard Protection) is on for previews (checked 20 Oct 2026).
- [ ] AWS: automatic cost stop — a Budgets action that removes Bedrock permission from `symptommap-vercel` at a set amount.
- [x] Personal Anthropic API key removed from this project's Vercel. It is **kept** at console.anthropic.com because the backup (symptommaproject) still uses it (Ana, 20 Oct 2026). Keep a low monthly spend limit on it; delete it when the backup no longer needs it.
- [ ] No screenshots with preview links, emails or test data shared publicly.

## AI
- [x] Claude Sonnet 4.6 on Bedrock, AU profile, quota approved (19 Oct 2026).
- [x] AWS keys for `symptommap-vercel` in Vercel (Production and Preview).
- [x] Usage limit in Supabase (`consumir_cuota_ai()`, PR #11).
- [ ] End-to-end test on a preview: a real suggestion, then check the real cost per suggestion.

## Email
- [x] Amazon SES (Sydney): identity `symptommap.com.au` created with Easy DKIM (RSA 2048); 3 DKIM CNAMEs and `_dmarc` TXT (`v=DMARC1; p=none;`) added in VentraIP (19 Oct 2026).
- [ ] SES shows the domain as **Verified** (can take up to 72 h).
- [ ] Then request production access (SES → Get set up → Request production access). The button stays disabled until the domain is verified. Form: Transactional · https://www.symptommap.com.au · English · use case text below.

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
- [ ] Detail panel (click a diagnosis or symptom): edit, connect, delete.
- [ ] Psychologist reviews the profile questions and options (`v2/src/perfil/preguntas.js`), together with the diagnosis catalogue.
- [ ] Fill the map in v2 (empty state, add diagnosis with autocomplete, symptoms).
- [x] Forgot password: email → 6-digit code → new password, other devices logged out (PR #17). Needs the "Reset Password" email template in Supabase (`supabase/plantillas/reset-password.html`).
- [ ] Delete account and data.
- [ ] One Lighthouse performance check on a preview.

## Public site (when it opens)
- [ ] Breadcrumb on the public pages (e.g. Home › Our story, Home › Why SymptomMap), linking back to Home, with `BreadcrumbList` structured data for SEO. **Not inside the app**: in the map, profile and settings a simple Back is enough and a breadcrumb would add noise (Ana, 20 Oct 2026).
- [ ] Visual polish pass with Ana's references (see `docs/design/REFERENCES.md`).

## Housekeeping
- [ ] Translate the remaining Spanish documents and comments to English (rule in `AGENTS.md`).
