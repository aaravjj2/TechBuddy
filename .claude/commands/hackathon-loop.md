# /hackathon-loop
Run the following steps in an infinite loop until the user says "stop" or "exit".

**CRITICAL CONTEXT**: This is GenLink Hacks — technology literacy for senior citizens.
Deadline: April 18, 2026 @ 7:00am EDT. Every iteration must move closer to winning.

---

**Before each iteration:**
- Read ./loop-logs/summary-*.md to recall all previous iteration memory
- Track iteration number (increment from last summary found, or start at 1)
- Check DEPLOY_URL.txt for current live deployment URL

---

## STEP 1 — PRD (Product Requirements Document)

Read ./prd.md if it exists. Write an improved, more detailed PRD to ./prd.md.

Use **sequential-thinking MCP** for architectural decisions.
Use **context7 MCP** to verify tech stack choices are current.

The PRD must target GenLink Hacks judging criteria:
- Genuinely helps senior citizens with technology literacy
- Feasible and fully working
- Accessible (large fonts, high contrast, simple UI)
- Creative and innovative approach
- Measurable real-world impact
- Polished demo-ready experience

PRD must include: Problem Statement, User Personas (specific senior citizens),
User Stories (5+), Tech Stack with rationale, Implementation Phases,
Success Metrics, Accessibility Plan, Demo Script outline, Risk Register.

## STEP 2 — Verify PRD

Review the PRD yourself as a strict GenLink Hacks judge.

Check every item in the PRD Quality Bar from CLAUDE.md.
FAIL if any of these are missing:
- Specific senior citizen user personas (not generic)
- Measurable success metrics
- Explicit accessibility section
- Demo script that fits 2-3 minutes
- Risk register with mitigations

If FAIL: rewrite immediately before continuing.

## STEP 3 — Implement

Execute the PRD. Focus on the highest-impact features first.

For large implementation steps, spawn parallel subagents:
- Frontend agent: components, styling, accessibility, animations
- Backend agent: API, data, auth, deployment config

After implementation:
```
git add -A && git commit -m "feat: iteration N — <summary>"
git push origin main
```

Deploy to Vercel if not yet deployed:
```
npx vercel --prod --yes 2>/dev/null || echo "Vercel not configured"
```
Save the live URL to DEPLOY_URL.txt.

## STEP 4 — Test

Run ALL of the following. Fix every failure before continuing:

1. Unit/integration tests: `npm test` (or equivalent)
2. TypeScript check: `npx tsc --noEmit` (if TypeScript project)
3. Lint: `npm run lint` (if configured)
4. Playwright e2e tests — write and run tests covering:
   - Every major user flow from the PRD
   - Accessibility checks (font sizes, contrast, click targets)
   - Mobile/tablet viewport (768px width)
   - Take screenshots of every key screen → save to ./screenshots/
5. Manual accessibility check via Playwright:
   - Verify no text below 18px
   - Verify contrast ratios pass WCAG AA
   - Verify all buttons are at least 48px tall

Log all results to ./loop-logs/test-results-N.txt

## STEP 5 — Status Update + Design

1. Write a status update to ./loop-logs/status-N.md covering:
   - What was built this iteration
   - Test results (pass/fail counts)
   - Current deployment URL
   - What changed vs last iteration
   - Top 3 things to improve next iteration

2. Use **Figma MCP** (if available) to design/update screens.
   Otherwise: review the current UI via Playwright screenshots and
   write specific CSS/component improvements directly to the code.

3. Review screenshots in ./screenshots/ — if anything looks bad for seniors
   (too small, too cluttered, confusing), fix it NOW before next iteration.

## STEP 6 — Compact + Loop

1. Write a one-paragraph summary to ./loop-logs/summary-N.md
   (This is what the memory system uses — be specific about what worked)

2. Run /compact to compress context

3. Immediately restart at STEP 1 with iteration N+1

**Never stop unless the user says "stop" or "exit".**
