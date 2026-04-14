# Contributing to TechBuddy

Thanks for helping improve TechBuddy.

## Development setup

1. Fork and clone the repository.
2. Install dependencies: `npm install`
3. Copy environment template: `cp .env.example .env.local`
4. Start locally: `npm run dev`

## Branch and PR workflow

- Create a focused branch from `main`.
- Keep PRs small and scoped to one concern.
- Link related issue(s) in the PR description.
- Include screenshots for UI changes across at least one mobile and one desktop view.

## Quality checks (required)

Fast path (types + build only):

- `npm run verify:quick`

Full path (matches CI and release expectations):

- `npm run verify` — lint, typecheck, build, full Playwright E2E, then multi-device smoke.

Targeted:

- `npm run test:a11y` — axe accessibility smoke on core routes
- `npm run test:e2e:multidevice` — desktop/tablet/mobile smoke only

## Code style expectations

- Follow existing TypeScript and Tailwind conventions in this repo.
- Preserve accessibility requirements (minimum tap targets, readable copy, keyboard support).
- Keep senior-friendly UX principles central: simple, calm, and clear.

## Documentation updates

If behavior, setup, or delivery process changes, update:

- `README.md`
- `SUBMISSION.md` (if launch/submission flow changes)
- relevant docs under `docs/`
