# TechBuddy Performance Budget

Use this budget as a release guardrail for user-perceived speed.

## Core targets

- **LCP (Largest Contentful Paint):** <= 2.5s (mobile, p75)
- **INP (Interaction to Next Paint):** <= 200ms (mobile, p75)
- **CLS (Cumulative Layout Shift):** <= 0.1 (mobile, p75)
- **TTFB (Time to First Byte):** <= 800ms for key routes

## Route-level expectations

- `/` home page: fast first render, no major layout jumps.
- `/scam-checker`: input usable within 2 seconds on average network.
- `/phone-help`: navigation controls responsive on mobile.
- `/what-is-ai` and `/practice`: typing and send actions stay responsive.

## Verification workflow

1. Run `npm run verify` for correctness and regressions.
2. Enable `NEXT_PUBLIC_ENABLE_WEB_VITALS=true` in staging.
3. Collect at least one week of Web Vitals logs from `/api/web-vitals`.
4. Compare against targets before release.

## If a budget is exceeded

- Identify slow routes/components first.
- Reduce JavaScript shipped to the route.
- Avoid expensive re-renders during interaction.
- Re-test on mobile viewport before sign-off.
