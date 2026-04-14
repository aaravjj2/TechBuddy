# TechBuddy Release Checklist

This checklist is required before any public release.

## 1) Product readiness

- [ ] Core feature set works end-to-end.
- [ ] UI remains simple and friendly for senior users.
- [ ] Multi-device usability verified against `docs/QA-MATRIX.md`.
- [ ] Updated screenshots captured for mobile, tablet, desktop.

## 2) Engineering readiness

- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:e2e` passes (includes accessibility smoke tests).
- [ ] `npm run test:e2e:multidevice` passes (or `npm run verify`, which runs both).

## 3) Security and operations

- [ ] Environment variables validated for production.
- [ ] No secrets committed to repository.
- [ ] API rate limit strategy confirmed.
- [ ] Monitoring/analytics configured for release.

## 4) Documentation and handoff

- [ ] `README.md` updated for current release behavior.
- [ ] `SUBMISSION.md` updated if launch process changed.
- [ ] Changelog/release notes drafted.
- [ ] Buyer/stakeholder package updated (`docs/BUYER-PACK.md`).
