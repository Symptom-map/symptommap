# SymptomMap — Sources of truth and decisions

Read this before working on SymptomMap, in any tool (Claude, Claude Code, Codex, Claude Design). The rules for coding agents are in `AGENTS.md`.
It exists so the different versions of the project never get mixed up.

Last updated: 31 October 2026 (translated into English; the decisions are unchanged).

## 1. What each thing is and what it is used for

**Easy rule:** anything that says `symptommaproject` is the **backup**; anything that says `symptommap` (without "project") is the **active** one.

| | Active | Backup |
|---|---|---|
| GitHub repo | `Symptom-map/symptommap` | `Symptom-map/symptommap-dev` |
| Vercel project | `symptommap` | `symptommaproject` |
| Site | **www.symptommap.com.au** (formerly symptommap.vercel.app, which now redirects) | symptommaproject.vercel.app |

(The active repo was called `symptommaproject` until 8 Oct 2026; it was renamed so that word only means "backup".)

| Source | Where it is | What it is used for | What it is NOT used for |
|---|---|---|---|
| **Backup** | Repo `symptommap-dev` → symptommaproject.vercel.app | Nothing. It only exists in case everything fails | **Not opened, not copied, not touched** |
| **Current app** | Repo `symptommap` → symptommap.vercel.app | Three pieces that already work: the bilingual list of 28 diagnoses (`data.js`), the AI prompts (`ai.js`, adapted to the new rules) and the proxy (`api/claude.js`) | Nothing visual. Nothing about how nodes are placed or drawn (`graph.js` is the old engine) |
| **Map core** | `src/core/` in the `symptommap` repo | **How nodes are generated.** The only source for that | — |
| **Prototype** | Claude Design zip (`SymptomMap - Production Prototype.dc.html`) | What the person sees and does on each screen, copy and flow | Its internal code: sample lists, the `482913` code, the colour or placement logic. It was built to design and test flows, not to implement |
| **Design system** | `_ds/` in the zip | How it looks: colours, typography, components | — |
| **Documents** | `docs/producto/` in the repo: HANDOFF, FUNCTIONAL-INVENTORY, DATA-MAP (copied from the Claude Design project on 8 Oct 2026) | Product and data rules | The decisions in section 2 replace them where they contradict |

**Tie-break rule:** this document > handoff + inventory + Data Map > prototype > current app.

**If something about implementation is unclear in the prototype, ask Ana.** The prototype was not designed with the code in mind.

## 2. Decisions made on 8 October 2026

These decisions resolve contradictions between the documents in the zip. They take precedence over the handoff, the inventory or the Data Map.

| Topic | Decision | Replaces |
|---|---|---|
| Symptom → symptom relations ("consequences") | **Removed.** Everything is symptom ↔ diagnosis (based on the interviews with the psychologist) | The current app's "Analyse origin" feature (diamonds and dashed lines) |
| Arcs of a shared symptom | **Always equal** (50/50, 33/33/33). No weight is stored | Handoff §8 (70/30) |
| Colour of a diagnosis | **The system proposes the most distinct one and the person can choose another** that is not in use, **when adding it and later** (it gives autonomy). Nothing changes colour on its own | Handoff §10 ("colour picker rejected") |
| Maximum diagnoses per map | **10** | The prototype's limit of 5 |
| Storage | **In the cloud** (not localStorage: maps are lost when the cache is cleared) | The current app's localStorage |
| Minimum data | Only "18+ verified" (not the date of birth); only that the eligibility gate was passed; deleting a diagnosis deletes its profile; exports are not stored; the zoom is not stored; the AI never writes directly to the database | Data Map §9–§10 (open candidates) |
| Handoff | **Not replaced yet.** The project version (17 Sep) and the zip version, which is newer, coexist | — |
| New interface (v2) | **React + Vite**, in the `v2/` folder of the same repo, using the design-system components as they come. Published at `/app/`; the current app stays at `/` until v2 is ready | The handoff's "no React" and "no broad rewrite" rule (§16) |
| Look of the shared symptom | Uses the **backup's** style (symptommaproject.vercel.app): a **thin** ring split into equal arcs with small gaps between colours, a wide white centre and a soft halo. **Not** the thick ring of the design system's `SymptomNode` component. Adjusted in v2 when implementing the map (own style in `v2/`, without editing the design system) | The ring thickness of `SymptomNode` in the design system |
| Coding agents | Claude Code and Codex share **a single rules file**, `AGENTS.md` (`CLAUDE.md` imports it). They never edit the same files at the same time: one implements and the other reviews | — |

## 3. Decisions of 11 October 2026

| Topic | Decision |
|---|---|
| Sign-in | **Supabase Auth** (not Cognito): same project in Sydney, the database security rules use it directly and deleting the account deletes everything in cascade. If everything moves to AWS later, it can be migrated (people would have to create a new password) |
| Two-step verification | **Optional.** Offered in "Protect your account" (with "Skip for now") and in Settings |
| Confirming the email when creating the account | Uses the prototype's **"Check your email"** screen (6-digit code) as step 3 of 3. In the prototype that screen only appeared when turning on two-step verification; without confirming the email, anyone could create an account with someone else's email. **Confirmed by Ana (13 Oct).** Two-step verification, when built, will use its own screen ("Protect your account") and an authenticator app, not email |

## 3b. Production architecture (decided on 13 October 2026)

| Piece | Decision | Why |
|---|---|---|
| Interface | React + Vite (`v2/`) | Decided on 8 Oct |
| Site and server functions | **Vercel (Pro)**, functions in `syd1` (Sydney) | Already works; moving it to AWS would take weeks without improving privacy. Vercel stores no health data: the AI function does not log content |
| Database and maps | **Supabase, Sydney** | Working since 9 Oct |
| Accounts | **Supabase Auth**, optional two-step verification | Decided on 11 Oct |
| AI | **Claude through Amazon Bedrock, Australia inference profile** (Sydney + Melbourne), called from the Vercel function | Health data is processed only in Australia. (Before this, the AI went straight to Anthropic in the US; switched on 14 Oct 2026, before any real people) |
| Email | **Amazon SES, Sydney**, with a sender on the domain (`symptommap.com.au`) | People's emails don't leave Australia; replaces Supabase's test email (done 25 Oct 2026) |

Rules that come with this architecture:
- The AI only answers people who are signed in (the function checks the Supabase token).
- The AWS keys have the least privilege: invoke that model and send email, nothing else. They live only in Vercel (environment variables) and, for email, in Supabase — never in the browser or the repo.
- A spending limit in AWS, and a spending limit on the Anthropic account while it is used (only the backup uses it now).

Ruled out for now: everything on AWS (Amplify/CloudFront + Lambda) and Cognito. Can be revisited after the pilot.

## 3c. Adding a symptom (decided by Ana on 20 October 2026)

This replaces FUNCTIONAL-INVENTORY §6 ("Add without analysing") and §9B, and the prototype rule "the AI never writes to the map" for this one action.

| Topic | Decision | Why |
|---|---|---|
| "Add without analysing" | **Removed.** A symptom the person adds is never left grey ("Origin not placed yet") | A grey symptom with no connections is confusing later |
| **Add** | The person decides to add the symptom; **the AI places it**, connecting it to the diagnoses already on their map that it may relate to. A notice then says what it was connected to, with a one-line reason for each, and lets the person remove a connection (while another remains) or undo the whole symptom | Placing the symptom is the core of the tool; if the person has to decide every connection, the tool doesn't lighten anything |
| **Analyse connections** | Shows the same possibilities first ("Possible connections"), already selected; the person keeps the ones that feel true, can add other diagnoses on the map, and adds or goes Back | For people who want to review before anything is added |
| Limits on the AI | Only diagnoses already on the map (never a new one, never inferring a diagnosis); hedged wording; no percentages, scores or certainty; minimum context (the symptom wording, the optional "when / how" text and the diagnoses on the map, sent by number, never ids, name or email) | Product principles in `AGENTS.md` |
| When the AI finds nothing or is unavailable | The person chooses the diagnoses from their map ("Where does this fit?"). The symptom is added only with at least one connection | So a symptom is never grey |
| Grey symptoms | ~~Only when a diagnosis is deleted~~ → **never** since 25 Oct 2026 (§3d) | — |

No separate validation needed: this is Ana's own product decision (31 Oct 2026). The psychologist will see it when Ana shows her the prototype.

## 3d. Deleting things, and connecting by hand (decided by Ana on 25 Oct 2026)

These replace FUNCTIONAL-INVENTORY §7 (what happens to symptoms when a diagnosis is deleted).

| Topic | Decision | Why |
|---|---|---|
| Deleting a diagnosis | Every symptom connected **only** to it is deleted too, with its notes, whoever wrote it. A symptom shared with another diagnosis stays, connected to the other one (e.g. meltdown on ADHD and ASD: delete ASD → meltdown stays on ADHD) | Grey, unplaced symptoms confuse people. There are no grey symptoms any more |
| Confirmation | "Remove ADHD?" — and, when it applies, "3 symptoms connected only to it will be removed too, with your notes about them. Symptoms shared with another diagnosis stay." → Keep it / Remove | The person knows what goes before confirming |
| "Connected to" in the symptom panel | Kept (not in the prototype): the person can add or remove a connection by hand, e.g. to correct the AI after closing the "Added to your map" notice. The last connection cannot be removed there; deleting the symptom does that | Corrections without new rules |
| Deleting the account | From Settings → Privacy & your data. "Delete your account and data? This deletes your account and everything in it: your diagnoses, profiles, symptoms and notes. For your security, SymptomMap doesn't keep any of it. If you want to use SymptomMap again, you'll create a new account and start from zero. This can't be undone." → Keep my account / Delete. Immediate and complete (database cascade). No typed "DELETE" for now (two steps already; typing adds friction) — revisit after the pilot | Clear and honest. Supabase backups expire after 7 days; the privacy page says so |

## 3e. Small screens (decided by Ana on 26 Oct 2026, refined on 31 Oct 2026)

| Topic | Decision | Why |
|---|---|---|
| Phone version | **Not part of the pilot.** The pilot is for large screens; the rule is screen width, not device type (no detecting iPhone, iPad or Android) | The map needs its own phone prototype, thought through properly; there is no time to do it well before the pilot |
| Narrow screens (under 700 px) | The app shows "SymptomMap works on a computer for now" with the link to open on a computer and a "Copy link" button. There is **no** way past it ("Continue anyway" was removed on 31 Oct 2026). Tablets wider than 700 px go straight in | No squeezed, broken map as a first impression |

## 4. Still to decide

- **Type of two-step verification.** The prototype shows a code by email. As a second step, Supabase Auth offers an authenticator app (Google Authenticator, 1Password, etc.) or SMS, not a code by email. This must be chosen before building "Protect your account" (§3 above already leans towards an authenticator app).
- ~~"Forgot your password?"~~ → built on 20 Oct 2026 with a 6-digit code, like confirming the email (no screens were designed; it reuses the account screens).
- ~~Final domain~~ → **www.symptommap.com.au** (12 Oct 2026).
- Diagnosis catalogue for the autocomplete ("Add a diagnosis"): the person can always write their diagnosis in their own words; the catalogue only suggests names (English, Spanish, abbreviations) and chooses the profile questions. There are 29 today (`src/js/data.js`); Ana considers that too few. Proposal: expand it from ICD-11 (WHO, mental health chapter) with DSM-5-TR synonyms, and have the psychologist review it before the pilot. **Pending.**
- Symptom suggestions: today the AI generates them from its general knowledge, based on the diagnoses and the profile. Still to decide whether the psychologist reviews examples before the pilot and whether to add an initial curated list per diagnosis.
