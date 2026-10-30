# AWS — Bedrock (AI) and SES (email)

Decision of 13 Oct 2026: see `docs/FUENTES-Y-DECISIONES.md` §3b. Everything in the **Asia Pacific (Sydney) `ap-southeast-2`** region.

Keys are **never** pasted into the repo, the chat or the browser. The Bedrock credentials live only in Vercel (Settings → Environment Variables); the SES SMTP credentials live only in Supabase (SMTP Settings).

## 1. Account (once)
1. Create the account at aws.amazon.com and turn on **MFA** for the root user.
2. Choose the **Asia Pacific (Sydney)** region.
3. Cost brake: the project's **monthly spend limit ($20)** in the account menu pauses the project on its own; a Budgets action blocks Bedrock at $17 (see `docs/PRE-PILOT-CHECKLIST.md`).

## 2. Bedrock (Claude in Australia)
1. Bedrock → **Model catalog** → an **Anthropic Claude Sonnet** model → fill in the *use case* form (once per account).
2. Bedrock → **Cross-region inference** → filter by `au.` → note the model's **profile ID** (by default the code uses `au.anthropic.claude-sonnet-4-6`, Claude Sonnet 4.6, the same model the app used before. If the ID shown is different, put it in `BEDROCK_MODELO`).
3. Try it once in the **Playground** with that profile (that enables it).

## 3. User for Vercel (least privilege)
IAM → Users → Create user `symptommap-vercel` (no console access) → Add permissions → **Create inline policy** (JSON), policy name `ClaudeAustraliaOnly`. Everything named inside AWS is in English:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ClaudeAustraliaOnly",
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

Then: Security credentials → **Create access key** → "Application running outside AWS". Copy both keys **straight into Vercel** and store `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as **Secret** environment variables (Vercel's type for keys since 24 Aug 2026; a Secret cannot be read back from the dashboard after saving, only replaced):

| Variable | Value | Environments |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | the access key | Production and Preview |
| `AWS_SECRET_ACCESS_KEY` | the secret key | Production and Preview |
| `AWS_REGION` | `ap-southeast-2` | Production and Preview |
| `BEDROCK_MODELO` | only if another `au.` profile is used | Production and Preview |

With those variables, `api/claude.js` uses Bedrock. It is the only provider: the personal Anthropic key (`ANTHROPIC_API_KEY`) was retired on 14 Oct 2026 and is not used again.

**To rotate them** (e.g. after a provider incident): create a new access key for `symptommap-vercel`, replace both values in Vercel, redeploy, check one AI request works on a preview, then deactivate and delete the old key.

## 4. SES (emails from the domain) — done 25 Oct 2026
- Identity `symptommap.com.au` in SES Sydney (`ap-southeast-2`), Easy DKIM, verified 22 Oct 2026. DKIM CNAMEs and `_dmarc` TXT live in VentraIP DNS.
- Out of the sandbox (production access) since 25 Oct 2026.
- SMTP credentials: IAM user **`symptommap-ses-smtp`**, created from SES → SMTP settings → **IAM SMTP credentials** (not "Mail Manager SMTP", which is for receiving mail and is billed separately). The console wizard did not attach its group policy (Ana's Google sign-in role), so the user has one inline policy instead, **`SymptomMapSesSend`**: `ses:SendRawEmail` only on `arn:aws:ses:ap-southeast-2:287238357784:identity/symptommap.com.au` (it can only send from that domain).
- The SMTP user name and password were pasted straight from AWS into Supabase; they are not stored anywhere else.
- **To rotate them** (review of 25 Oct 2026): create a new SES SMTP credential set (SES → SMTP settings → Create SMTP credentials → *IAM SMTP credentials*), or derive a new SMTP password from a new IAM access key of `symptommap-ses-smtp` following AWS's "Obtaining Amazon SES SMTP credentials" procedure. Make sure the user that sends has the `SymptomMapSesSend` policy (a new user from the wizard may get no policy, as on 25 Oct). Update Supabase → SMTP Settings, send a test code (Forgot your password?) and check it arrives, then delete the old access key / credential.
- Supabase settings: `supabase/README.md`.
