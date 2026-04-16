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
