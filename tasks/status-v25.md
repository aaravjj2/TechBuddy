Iteration 25 — 2026-04-12

## What changed
Added a "Continue where you left off" card to the home page. When a returning user visits the home page, they see a card linking to the last section they visited (scam checker, phone help, AI chat, practice, or quick tips). Uses localStorage for persistence via a RouteTracker client component. First-time visitors don't see the card.

PRD: tasks/prd-continue-where-v25.md
Branch: improvement/v25-continue-where
All tests passing: YES (5/5)

## Judging criteria impact
- Senior Citizen Impact: IMPROVED — helps seniors with memory difficulties pick up where they left off
- Feasibility: IMPROVED — better kiosk return experience
- UI/UX Design: IMPROVED — personalized home page
- Requirements Met: UNCHANGED

## Next iteration focus (suggested)
High contrast mode toggle for vision accessibility
