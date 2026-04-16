#!/usr/bin/env bash
# ============================================================
#  ONE-SHOT TECHBUDDY SETUP — GenLink Hacks
#  Run from inside ~/Aarav/TechBuddy (or wherever you cloned it)
#  Installs: MCPs, skills, hooks, CLAUDE.md, slash command
# ============================================================
set -euo pipefail

echo "🚀 TechBuddy Hackathon Loop Setup"
echo "🎯 Target: GenLink Hacks (deadline Apr 18 @ 7am EDT)"
echo "=================================================="

# ── 1. Directory structure ─────────────────────────────────
echo "📁 Creating directory structure..."
mkdir -p .claude/commands
mkdir -p .claude/hooks
mkdir -p .claude/skills
mkdir -p loop-logs
mkdir -p .github/workflows

# ── 2. Install MCPs ────────────────────────────────────────
echo "🔌 Installing MCP servers..."

claude mcp add github --scope project -- npx @modelcontextprotocol/server-github || echo "⚠ github MCP failed - add GITHUB_PERSONAL_ACCESS_TOKEN to env"
claude mcp add playwright --scope project -- npx @anthropic-ai/mcp-playwright || echo "⚠ playwright MCP failed"
claude mcp add memory --scope user -- npx -y @modelcontextprotocol/server-memory || echo "⚠ memory MCP failed"
claude mcp add context7 --scope user -- npx -y @upstash/context7-mcp || echo "⚠ context7 MCP failed"
claude mcp add sequential-thinking --scope user -- npx -y @modelcontextprotocol/server-sequential-thinking || echo "⚠ sequential-thinking MCP failed"

echo "✅ MCPs installed. Active list:"
claude mcp list

# ── 3. Install Playwright browsers ────────────────────────
echo "🎭 Installing Playwright browsers..."
npx playwright install chromium 2>/dev/null || echo "⚠ playwright install failed - run manually: npx playwright install"

# ── 4. Write CLAUDE.md ────────────────────────────────────
echo "📝 Writing CLAUDE.md..."
cat > CLAUDE.md << 'CLAUDEMD'
# CLAUDE.md — TechBuddy Agent OS
# GenLink Hacks: Technology Literacy for Senior Citizens
# Deadline: April 18, 2026 @ 7:00am EDT — TIME IS CRITICAL

## 🎯 Mission
Win GenLink Hacks by building the best possible app/website/game that
promotes technology literacy for senior citizens.

Hackathon: https://genlink-hacks.devpost.com/
Repo: https://github.com/aaravjj2/TechBuddy
Prize pool: $32,000+

## ⚠️ Submission Requirements (MUST HIT ALL)
- [ ] GitHub repository with clean, documented code
- [ ] 2-3 minute demo video (record with Playwright screenshots as basis)
- [ ] Screenshots of the app in the submission
- [ ] Live link deployed on Vercel or Netlify (FREE, get this early)

## 🏆 What Judges Care About (GenLink Hacks)
1. Does it genuinely help senior citizens with tech literacy?
2. Is it feasible — does it actually work and demo well?
3. Is it accessible — large fonts, simple UI, no jargon, high contrast?
4. Innovation — is the approach creative?
5. Impact — how many seniors could realistically benefit?
6. Polish — does the demo video and app look professional?

## 🧠 Karpathy Principles (Non-Negotiable)
1. **Think Before Coding** — state assumptions, surface ambiguities, never barrel forward wrong
2. **Simplicity First** — 100 lines > 1000. No unnecessary abstractions. Delete dead code.
3. **Surgical Changes** — touch ONLY code relevant to the task
4. **Verify Everything** — never claim success without proof. Run it. Check it.

## 🔁 Default Behavior: Hackathon Loop
When started with no specific task, run `/hackathon-loop` immediately.
The loop runs FOREVER until the user says "stop".

## 🔌 Active MCPs
- github — PRs, issues, commits
- playwright — browser testing, screenshots for demo
- memory — persistent knowledge graph across iterations
- context7 — real-time library docs
- sequential-thinking — deep PRD/architecture reasoning

## ✅ Definition of Done (Each Iteration)
- [ ] prd.md updated and judge-verified
- [ ] Code committed to git with clear message
- [ ] All tests passing (zero failures)
- [ ] App deployed to Vercel/Netlify (update DEPLOY_URL.txt)
- [ ] Playwright screenshots saved to ./screenshots/
- [ ] Status log written to ./loop-logs/status-N.md

## 🎨 UI/UX Standards for Senior Citizens
- Font size minimum 18px, prefer 20-24px
- High contrast (WCAG AAA preferred, AA minimum)
- Large click targets (minimum 48x48px)
- No jargon — plain English everywhere
- Simple navigation — never more than 2 levels deep
- Error messages must be friendly and instructive, never technical
- Voice/audio support where possible
- Works on tablet (many seniors use iPads)

## 🛑 Anti-Patterns (Never Do)
- Never skip tests to save time
- Never commit without running the pre-commit hook
- Never let context exceed 75% without /compact
- Never claim deployed without verifying the live URL loads
- Never use small fonts or complex UI patterns

## 📝 Commit Convention
feat: iteration N — <one-line summary>
CLAUDEMD

echo "✅ CLAUDE.md written"

# ── 5. Write hackathon-loop slash command ─────────────────
echo "⚙️  Writing .claude/commands/hackathon-loop.md..."
cat > .claude/commands/hackathon-loop.md << 'LOOPMD'
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
LOOPMD

echo "✅ Slash command written"

# ── 6. Write pre-commit hook ──────────────────────────────
echo "🪝 Writing hooks..."
cat > .claude/hooks/pre-commit.sh << 'HOOKMD'
#!/usr/bin/env bash
# Block credential leaks
if git diff --cached --name-only | grep -qE '\.(env|key|pem)$|creds\.md'; then
  echo "BLOCKED: Attempting to commit sensitive files"
  exit 1
fi
# Warn on large files
git diff --cached --name-only | while read f; do
  if [ -f "$f" ] && [ $(wc -c < "$f") -gt 500000 ]; then
    echo "WARNING: $f is over 500KB — intentional?"
  fi
done
HOOKMD
chmod +x .claude/hooks/pre-commit.sh

# ── 7. Write .mcp.json for team sharing ───────────────────
echo "🗂️  Writing .mcp.json..."
cat > .mcp.json << 'MCPJSON'
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-playwright"]
    }
  }
}
MCPJSON

# ── 8. Create screenshots dir + placeholder ───────────────
mkdir -p screenshots
touch screenshots/.gitkeep
touch DEPLOY_URL.txt

# ── 9. Create initial prd.md skeleton ─────────────────────
if [ ! -f prd.md ]; then
cat > prd.md << 'PRDMD'
# TechBuddy PRD — GenLink Hacks
## Status: INITIAL SKELETON — Loop will improve this

### Problem Statement
Senior citizens (65+) face significant barriers to technology literacy.
TechBuddy aims to bridge this gap through [TO BE DEFINED BY LOOP].

### Target Users
- Primary: Adults 65-85 with limited tech experience
- Secondary: Family members helping seniors learn technology

### Core Value Proposition
[TO BE DEFINED BY LOOP]

### Tech Stack
[TO BE DECIDED BY LOOP — use context7 MCP to verify choices are current]

### Success Metrics
- [TO BE DEFINED]

### Accessibility Requirements
- Font size: minimum 18px
- Contrast: WCAG AA minimum
- Click targets: 48x48px minimum
- Plain English throughout
PRDMD
fi

# ── 10. Summary ────────────────────────────────────────────
echo ""
echo "=================================================="
echo "✅ SETUP COMPLETE"
echo "=================================================="
echo ""
echo "📁 Structure created:"
echo "   CLAUDE.md              ← Agent OS"
echo "   prd.md                 ← PRD (loop will improve)"
echo "   .mcp.json              ← Shared MCP config"
echo "   .claude/commands/      ← Slash commands"
echo "   .claude/hooks/         ← Auto-enforced hooks"
echo "   loop-logs/             ← Iteration logs"
echo "   screenshots/           ← Playwright screenshots"
echo "   DEPLOY_URL.txt         ← Live deployment URL"
echo ""
echo "🔌 MCPs installed (verify with: claude mcp list)"
echo ""
echo "⚠️  REMINDER: Deadline is April 18 @ 7am EDT"
echo "   That means RUN THE LOOP NOW."
echo ""
echo "▶  To start the loop:"
echo "   1. cd into this directory"
echo "   2. Run: claude"
echo "   3. Type: /hackathon-loop"
echo ""
echo "🛑 To stop: type 'stop' in Claude Code"
