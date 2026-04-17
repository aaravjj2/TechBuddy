# TechBuddy

> A calm, patient technology helper for senior citizens — spot scams, learn AI, and master the phone, with zero jargon and no sign-up required.

TechBuddy pairs a senior-first web experience with an instructor and admin console so community centers can measure impact across the full 36-month program, backed by 360 searchable planning briefs.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript 5, Tailwind CSS 3 |
| Database | Prisma 6 + SQLite (dev) / PostgreSQL (prod) |
| Auth | NextAuth v5 (Credentials provider) |
| AI | Anthropic `claude-sonnet-4-5` primary, Z.AI (`glm-4.6`) fallback |
| Testing | Playwright + `@axe-core/playwright` |
| CI/CD | GitHub Actions → Vercel |

## Local Development

```bash
# 1. Copy env (Prisma reads .env, Next.js reads .env.local)
cp .env.example .env.local && cp .env.example .env

# 2. Install with legacy peer deps (React 19 + NextAuth beta quirks)
npm install --legacy-peer-deps

# 3. Push schema + seed 360 artifact pages, test users, and sample metrics
npm run db:push && npm run db:seed

# 4. Start the dev server (http://localhost:3000)
npm run dev
```

Playwright targets port `3015` — see `playwright.config.ts`. Tests start the dev server automatically with `npm run dev -- -p 3015`.

## Running Tests

```bash
# Full E2E suite (Chromium)
npm run test:e2e

# Accessibility-focused smoke only
npm run test:a11y

# One spec file
npx playwright test tests/e2e/v1-api.spec.ts
npx playwright test tests/e2e/artifacts-gallery.spec.ts
npx playwright test tests/e2e/instructor-auth.spec.ts

# Multi-device (desktop + tablet + mobile)
npm run test:e2e:multidevice
```

All v1 API tests, artifact gallery tests, instructor tests, and home additions tests assume the database is seeded (`npm run db:seed`) and pick up the running dev server automatically.

## Environment Variables

| Variable | Required? | Default | Used by |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | `file:./dev.db` | Prisma (SQLite locally, Postgres in prod) |
| `NEXTAUTH_SECRET` | Yes | — | NextAuth JWT signing |
| `NEXTAUTH_URL` | Yes in prod | `http://localhost:3000` | NextAuth callback URLs |
| `ANTHROPIC_API_KEY` | Recommended | — | Primary AI provider (scam-check, practice, AI explainer) |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-4-5` | Pinned Anthropic model |
| `Z_AI_API_KEY` | Optional | — | Fallback AI provider |
| `Z_AI_BASE_URL` | No | `https://api.z.ai/api/coding/paas/v4/` | Z.AI endpoint override |

If both AI keys are missing, `/api/v1/health` returns `data.ai === "degraded"` and the UI gracefully degrades to a rule-based fallback.

## Architecture

```
Browser ──> Next.js App Router ──> API v1 Routes ──> Prisma ──> SQLite / PostgreSQL
                                         │
                                         └──> Anthropic (claude-sonnet-4-5) ↔ Z.AI fallback
```

Every v1 response is wrapped in a uniform envelope:

```jsonc
{ "data": { /* ... */ }, "meta": { "requestId": "...", "version": "v1", "timestamp": "..." } }
// or on error
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "requestId": "..." },
  "meta": { ... } }
```

Headers `x-request-id` and `x-api-version: v1` are present on every v1 response.

## Key Routes

- Public: `/`, `/scam-checker`, `/phone-help`, `/practice`, `/quick-tips`, `/emergency`, `/artifacts` ([360 monthly briefs](/artifacts)), `/accessibility`, `/sign-in`
- Instructor (auth required, role `INSTRUCTOR` or `ADMIN`): `/instructor/dashboard`, `/instructor/learners`, `/instructor/impact`, `/instructor/center`
- Admin: `/admin/impact`, `/admin/research`, `/admin/partners`, `/admin/governance`
- API v1: `/api/v1/health`, `/api/v1/artifacts`, `/api/v1/artifacts/[id]`, `/api/v1/telemetry` (instructor-only), `/api/v1/scam-check` (10/hr/IP), `/api/v1/analytics/{overview,learners,impact,milestone}`

## Seeded Test Accounts

| Role | Email | Password |
| --- | --- | --- |
| Instructor | `instructor@test.com` | `TestPass123` |
| Senior (learner) | `senior1@test.com` | `SeniorPass123` |

Seniors do not need to sign in to use any public feature — accounts only exist to demo instructor analytics.

## Contributing

Before pushing a change:

```bash
npm run lint
npm run typecheck
npm run verify:quick   # lint + typecheck + build
```

Husky is configured to run `lint-staged` on every commit so formatting and lint fixes stay automatic. See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Accessibility

TechBuddy exists for users who are most often excluded by "modern" product design. Every page is built to WCAG 2.1 AA — large targets, high contrast, keyboard-first navigation, and calm plain-language copy. Our CI blocks any merge that introduces a critical or serious axe-core violation, and the [accessibility statement](./app/accessibility/page.tsx) publishes how to contact a real human if something is still hard to use.

## Governance and Docs

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- QA matrix: [docs/QA-MATRIX.md](docs/QA-MATRIX.md)
- Release checklist: [docs/RELEASE-CHECKLIST.md](docs/RELEASE-CHECKLIST.md)
- Operations runbook: [docs/OPERATIONS-RUNBOOK.md](docs/OPERATIONS-RUNBOOK.md)
- Architecture summary: [docs/ARCHITECTURE-SUMMARY.md](docs/ARCHITECTURE-SUMMARY.md)
