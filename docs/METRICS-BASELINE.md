# TechBuddy Baseline Metrics

Captured from current local validation runs.

## Engineering quality baseline

- Lint: pass
- Typecheck: pass
- Build: pass
- Primary E2E suite: pass (full `tests/e2e`, including axe accessibility smoke; ~`181` tests as of last `npm run verify`)
- Multi-device smoke: pass (`15` tests across desktop/tablet/mobile)
- CI: lint, typecheck, build, Playwright, then multi-device smoke; Dependabot enabled for npm + Actions

## Stability notes

- A known intermittent test around high contrast persistence may retry once and pass.
- CI keeps Playwright traces/reports for root-cause investigation when failures occur.

## Operational KPI starter set

- Build success rate
- E2E pass rate
- Flake rate by spec
- Incident count by severity (SEV-1/SEV-2/SEV-3)
- Time to recovery for production regressions

## Product KPI starter set

- Core flow completion rate:
  - Scam Detector
  - Phone Help walkthrough
  - What Is AI chat
  - Practice scenario start
- Device-class success rate (mobile/tablet/desktop)
- Accessibility defect count by release
