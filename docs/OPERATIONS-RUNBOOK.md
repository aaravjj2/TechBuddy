# TechBuddy Operations Runbook

## Purpose

Provide a fast, repeatable response process for incidents and release blockers.

## Severity levels

- **SEV-1:** Core user journeys unavailable (home navigation, scam checker, phone help).
- **SEV-2:** Major degradation (slow responses, one feature unusable, widespread UI breakage).
- **SEV-3:** Minor defects or localized regressions with workaround.

## Immediate response flow

1. Confirm issue scope (which routes, which device classes).
2. Reproduce locally with `npm run dev` and targeted Playwright tests.
3. Roll back recent release if user impact is severe.
4. Open incident issue and assign owner.
5. Patch, verify, deploy, and post incident summary.

## Verification commands during incident

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`
- `npm run test:e2e:multidevice` for device-specific issues

## Common failure playbooks

### Build failure

- Run `npm run typecheck` and `npm run build` locally.
- Inspect latest workflow artifact logs.
- Fix compile/type errors first before test work.

### E2E failures

- Re-run failing spec file locally.
- Inspect `playwright-report` and `test-results` artifacts.
- Determine flaky vs deterministic failure.

### Production regression

- Validate routes from `docs/QA-MATRIX.md`.
- Capture screenshots and browser/version details.
- Add regression test before marking fixed.

## Release rollback

1. Re-deploy previous known good build.
2. Verify core routes manually.
3. Announce temporary rollback status.
4. Create root-cause issue with remediation plan.
