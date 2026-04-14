# TechBuddy Repo Hardening + 90-Day Productization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repository buyer-ready and execution-ready, then deliver a 3-month path to a multi-device, simple, friendly, appealing, and shippable product.

**Architecture:** Complete GitHub repo foundations first (documentation, contribution flow, CI + artifacts, templates), then harden verification and define a 12-week product roadmap with measurable quality gates. Keep scope focused on production trust signals and reliability over net-new risky features.

**Tech Stack:** Next.js 15, TypeScript, Tailwind, Playwright, GitHub Actions.

---

## File map

- Create: `.github/workflows/ci.yml`
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Create: `.github/pull_request_template.md`
- Create: `.github/CODEOWNERS`
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `SECURITY.md`
- Create: `docs/ROADMAP-90-DAYS.md`
- Modify: `README.md`
- Modify: `SUBMISSION.md`

---

### Task 1: Remove placeholders and complete README

**Files:**
- Modify: `README.md`
- Modify: `SUBMISSION.md`

- [ ] Replace all placeholder language (`<your-repo-url>`, screenshot placeholders, “add URL here”) with production-ready instructions and a clear “what’s still needed” checklist.
- [ ] Add sections for setup, environment, scripts, testing, deployment expectations, and support/security links.
- [ ] Ensure README positions TechBuddy as a credible multi-device product (desktop/tablet/mobile support target and UX principles).

---

### Task 2: Add standard open-source/project trust docs

**Files:**
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `SECURITY.md`

- [ ] Add a permissive license suitable for showcase/acquisition-readiness.
- [ ] Add contribution workflow, branch/PR expectations, and local verification steps.
- [ ] Add a code of conduct with reporting path.
- [ ] Add security policy + vulnerability disclosure process.

---

### Task 3: Add GitHub collaboration scaffolding

**Files:**
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Create: `.github/pull_request_template.md`
- Create: `.github/CODEOWNERS`

- [ ] Add issue templates that capture reproduction steps, device/browser details, and accessibility impact.
- [ ] Add PR template with test evidence, UI screenshots, and risk checklist.
- [ ] Add CODEOWNERS placeholder ownership for core paths.

---

### Task 4: Add CI workflow with artifacts

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] Trigger on PRs and pushes to `main`.
- [ ] Run install, lint, build, and Playwright tests.
- [ ] Upload artifacts for failures and diagnostic output (`playwright-report`, `test-results`) so debugging is fast.
- [ ] Keep workflow resilient when optional test outputs are absent.

---

### Task 5: Verify thoroughly and close gaps

- [ ] Run local validation: `npm run lint`, `npm run build`, `npx playwright test`.
- [ ] Fix any breakages introduced by hardening changes.
- [ ] Run linter diagnostics for edited files and resolve introduced issues.

---

### Task 6: Define 12-week productization roadmap

**Files:**
- Create: `docs/ROADMAP-90-DAYS.md`

- [ ] Build a week-by-week roadmap with outcomes, not just tasks.
- [ ] Include explicit tracks for:
  - Multi-device reliability and responsive QA matrix.
  - Simplicity/friendliness and visual polish.
  - Ship readiness (analytics, support flows, reliability, release process).
  - Buyer-readiness signals (documentation, demo assets, stability metrics).
- [ ] Add measurable acceptance criteria per phase.

---

## 90-Day execution shape (high-level)

- **Month 1 (Foundation):** stabilize repo quality and release process; remove trust blockers; baseline multi-device testing.
- **Month 2 (Experience):** improve UI friendliness, readability, onboarding clarity, and perceived quality on all target devices.
- **Month 3 (Ship + Buyer Pack):** finalize reliability, monitoring, polished demos, docs, and acquisition-ready package.

---

## Success criteria

- Repo has no obvious placeholders in critical docs.
- CI runs on every PR with actionable artifact outputs.
- Governance docs and contribution flow are present and clear.
- A concrete 12-week roadmap exists with device UX + ship-readiness metrics.
- Local verification passes after all changes.
