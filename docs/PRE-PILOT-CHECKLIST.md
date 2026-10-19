# Pre-pilot checklist

Everything that must be done before the pilot (week of 23–27 November 2026). Tick items off here as they are finished, in the same PR as the work.

## Security
- [ ] **Self-check on a Vercel preview** (done by an agent, report attached to the PR):
  - open the site in a private window without logging in and list everything that loads;
  - check what every network request returns (DevTools → Network): no health data, no other person's data;
  - confirm every endpoint (`/api/claude`, Supabase REST and RPC) refuses requests without a valid session.
- [ ] **External security review** (1–2 hours) by someone who did not build the app — e.g. Dr. Ruwangi Fernando (VU, cybersecurity).
- [ ] Supabase security advisors: only the two expected notices for `uso_ai` / `consumir_cuota_ai()` (see `supabase/README.md`).
- [ ] Vercel Deployment Protection (Vercel Authentication) is on for previews.
- [ ] AWS: automatic cost stop — a Budgets action that removes Bedrock permission from `symptommap-vercel` at a set amount.
- [ ] Personal Anthropic API key deleted at console.anthropic.com (already removed from Vercel).
- [ ] No screenshots with preview links, emails or test data shared publicly.

## AI
- [x] Claude Sonnet 4.6 on Bedrock, AU profile, quota approved (19 Oct 2026).
- [x] AWS keys for `symptommap-vercel` in Vercel (Production and Preview).
- [x] Usage limit in Supabase (`consumir_cuota_ai()`, PR #11).
- [ ] End-to-end test on a preview: a real suggestion, then check the real cost per suggestion.

## Email
- [ ] Amazon SES (Sydney): verify `symptommap.com.au` (DKIM records in VentraIP DNS) and request production access.
- [ ] Supabase Auth custom SMTP through SES; logo in the email template.

## Product
- [ ] Fill the map in v2 (empty state, add diagnosis with autocomplete, symptoms).
- [ ] Forgot password.
- [ ] Delete account and data.
- [ ] One Lighthouse performance check on a preview.

## Housekeeping
- [ ] Translate the remaining Spanish documents and comments to English (rule in `AGENTS.md`).
