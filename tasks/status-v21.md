Iteration 21 — 2026-04-12

## What changed
Added a Next.js error.tsx boundary at the app root level. If any client component crashes during rendering, users see a friendly "Something went wrong" page with an emoji, plain-language explanation, "Try again" button, and "Go home" link instead of a blank white screen.

PRD: tasks/prd-error-boundary-v21.md
Branch: improvement/v21-error-boundary
All tests passing: YES (4/4)

## Judging criteria impact
- Senior Citizen Impact: IMPROVED — no blank screens on errors
- Feasibility: IMPROVED — kiosk resilience
- UI/UX Design: IMPROVED — graceful degradation
- Requirements Met: IMPROVED — production-ready error handling

## Next iteration focus (suggested)
PWA manifest — add service worker and manifest.json for kiosk install
