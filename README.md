# TechBuddy

> Your patient, always-available technology helper for senior citizens.

Built for GenLink Hacks 2026 — designed to deploy at GenLink senior centers in Austin, TX.

## What It Does

- **Scam Detector** — Paste suspicious messages; get a clear safe, scam, or suspicious verdict with plain-language next steps.
- **Help With My Phone** — Step-by-step walkthroughs for common smartphone tasks (video calls, photos, WiFi, screenshots, and more).
- **What Is AI?** — A calm chat that explains artificial intelligence without jargon.
- **Practice Mode** — Safe roleplay against common scam scripts, with an encouraging debrief afterward.
- **Quick Tips** — One short tip per day about safety, devices, and AI.

## Why We Built It

Seniors deserve technology help that feels respectful and calm—not rushed or condescending. TechBuddy matches GenLink’s focus on scams, smartphones, and AI literacy in one simple web app that works on tablets and desktops without installing anything.

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS · Z.ai (OpenAI-compatible chat API) · Vercel

## Product Quality Targets

- **Multi-device support** — mobile, tablet, and desktop layouts must all be usable and readable.
- **Simple and friendly UX** — large tap targets, plain language, and calm interaction patterns.
- **Appealing interface** — clear visual hierarchy, accessible contrast, and consistent components.
- **Ship readiness** — repeatable CI checks, documented setup, and production deployment path.

## Running Locally

```bash
git clone https://github.com/aaravjj2/TechBuddy.git
cd TechBuddy
npm install
cp .env.example .env.local
# Add Z_AI_API_KEY (or ZAI_API_KEY) to .env.local.
# If requests fail, set Z_AI_BASE_URL to the coding endpoint from .env.example.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Required:

- `Z_AI_API_KEY` (or `ZAI_API_KEY`)

Optional:

- `Z_AI_BASE_URL`
- `Z_AI_MODEL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_ENABLE_CLIENT_TELEMETRY`
- `NEXT_PUBLIC_ENABLE_WEB_VITALS`

See `.env.example` for descriptions.

## Scripts

- `npm run dev` — start local development server
- `npm run lint` — run lint checks
- `npm run build` — production build
- `npx playwright test` — run end-to-end tests
- `npm run test:a11y` — run accessibility smoke tests

## Testing and CI

- Full local gate: `npm run verify` (lint, typecheck, build, E2E, multi-device smoke)
- Faster check: `npm run verify:quick` (lint, typecheck, build only)
- GitHub Actions runs the same quality steps plus multi-device smoke; uploads `playwright-report` and `test-results` on every run.

Accessibility:

- Axe scans run as part of the main E2E suite; `npm run test:a11y` runs them alone.

## Screenshots

- [Home](public/screenshots/home.png)
- [Scam checker](public/screenshots/scam-checker.png)
- [What Is AI?](public/screenshots/what-is-ai.png)

## Submission checklist

See [SUBMISSION.md](SUBMISSION.md) for Devpost, Vercel, demo video links, and final checks.

## Governance and Support

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- QA matrix: [docs/QA-MATRIX.md](docs/QA-MATRIX.md)
- Release checklist: [docs/RELEASE-CHECKLIST.md](docs/RELEASE-CHECKLIST.md)
- Buyer pack template: [docs/BUYER-PACK.md](docs/BUYER-PACK.md)
- Operations runbook: [docs/OPERATIONS-RUNBOOK.md](docs/OPERATIONS-RUNBOOK.md)
- Architecture summary: [docs/ARCHITECTURE-SUMMARY.md](docs/ARCHITECTURE-SUMMARY.md)
- Metrics baseline: [docs/METRICS-BASELINE.md](docs/METRICS-BASELINE.md)
- Performance budget: [docs/PERFORMANCE-BUDGET.md](docs/PERFORMANCE-BUDGET.md)
