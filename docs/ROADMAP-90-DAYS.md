# TechBuddy 90-Day Productization Roadmap

This roadmap assumes continuous execution over 12 weeks.

## Product north star

Deliver a multi-device, simple, friendly, and appealing TechBuddy experience that is stable enough to ship and credible enough for acquisition-style evaluation.

## Already landed in the repo (foundation track)

These items are in place and should be extended, not re-scaffolded:

- `npm run verify` — lint, typecheck, build, full Playwright E2E, multi-device smoke; `npm run verify:quick` for faster feedback.
- CI aligned with the above, Playwright HTML report + trace artifacts, Dependabot for npm and GitHub Actions.
- Axe accessibility smoke tests on core routes; accent tokens adjusted for WCAG contrast on links and primary buttons.
- Optional Plausible analytics and optional client error telemetry (`NEXT_PUBLIC_ENABLE_CLIENT_TELEMETRY`) to `/api/client-error`.
- High-contrast mode applied before first paint when saved in `localStorage`.
- First-visit onboarding checklist on the home page; mobile nav tap targets tightened.
- Operational docs: `docs/OPERATIONS-RUNBOOK.md`, `docs/ARCHITECTURE-SUMMARY.md`, `docs/METRICS-BASELINE.md`, `docs/QA-MATRIX.md`, `docs/BUYER-PACK.md`, `docs/RELEASE-CHECKLIST.md`.

## Definition of done (end of 90 days)

- Core flows work consistently on mobile, tablet, and desktop.
- Accessibility and readability standards are enforced in CI and QA.
- Release process is repeatable with traceable quality evidence.
- Product includes buyer-facing proof assets (demo, docs, reliability metrics).

## Month 1 (Weeks 1-4): Foundation and reliability

### Week 1
- Finalize repo hardening (governance docs, templates, CI artifacts).
- Establish device/browser QA matrix.
- Baseline KPIs: page load, error rate, test pass rate.

### Week 2
- Add TypeScript `typecheck` script and include it in CI.
- Expand Playwright coverage for primary flows on mobile + desktop.
- Add API error handling consistency checks across all user-facing features.

### Week 3
- Accessibility pass 1: focus states, keyboard nav, semantic landmarks, alt text coverage.
- Readability pass 1: copy simplification and senior-friendly phrasing audit.
- Add regression checklist for every release.

### Week 4
- Performance pass 1: optimize largest routes/components and remove render bottlenecks.
- Add production monitoring basics (analytics + error logging strategy).
- Milestone demo: stable MVP with evidence pack.

**Month 1 exit criteria**
- CI green for 7 consecutive days.
- >= 90% pass rate on E2E suite.
- No critical accessibility blockers in core flows.

## Month 2 (Weeks 5-8): UX quality and multi-device polish

### Week 5
- Mobile-first layout refinements (navigation, spacing, typography scaling).
- Tablet UX pass (landscape and portrait ergonomics).

### Week 6
- Friendly interaction pass: loading states, empty states, error recovery wording.
- Improve visual consistency: buttons, cards, spacing rhythm, icon treatment.

### Week 7
- Add guided onboarding hints for first-time users.
- Add quality-of-life affordances for seniors (clear back paths, explicit labels, calm feedback).

### Week 8
- Conduct cross-device QA sweep with bug burn-down.
- Capture updated screenshots and draft polished demo script.

**Month 2 exit criteria**
- All core flows validated on target device matrix.
- UX review confirms simple/friendly/appealing standard.
- Medium-or-higher usability bugs reduced to zero.

## Month 3 (Weeks 9-12): Ship readiness and buyer package

### Week 9
- Security and resilience pass (rate limiting behavior, dependency scan, failure-mode checks).
- Document operational runbook for incidents and rollback.

### Week 10
- Finalize release checklist and versioning discipline.
- Add stakeholder-facing metrics summary template.

### Week 11
- Build acquisition-ready package:
  - Product overview one-pager
  - Architecture summary
  - QA evidence pack
  - Demo video and screenshots

### Week 12
- End-to-end launch rehearsal and bug fix sprint.
- Freeze release candidate and publish handoff bundle.

**Month 3 exit criteria**
- Release candidate passes lint/build/e2e and manual QA.
- Buyer pack is complete, current, and review-ready.
- Product can be demonstrated confidently across devices.

## Device QA matrix (minimum)

- Mobile: iPhone-class viewport, Android-class viewport
- Tablet: iPad-class viewport (portrait + landscape)
- Desktop: 1366px+ viewport (Chrome, Edge/Safari equivalent coverage)

## Core success metrics

- Build success rate
- E2E pass rate
- Crash/error rate on key flows
- Time-to-complete core tasks (Scam check, Phone help, AI chat, Practice)
- Accessibility defect count by severity
