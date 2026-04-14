# TechBuddy Architecture Summary

## Application shape

- **Framework:** Next.js 15 App Router
- **UI:** React + Tailwind CSS
- **Language:** TypeScript
- **Deployment target:** Vercel-compatible Node runtime

## Route groups

- `/` home and feature entry points
- `/scam-checker` scam analysis flow
- `/phone-help` and `/phone-help/[topic]` guided tutorials
- `/what-is-ai` conversational AI learning
- `/practice` and `/practice/[scenario]` roleplay practice
- `/quick-tips` daily tips experience

## API routes

- `/api/scam-check`
- `/api/ai-chat`
- `/api/practice`

All model/API calls are server-side through route handlers.

## Shared UI primitives

- `PageShell` for page framing
- `NavButton` for large home navigation targets
- `ChatBubble`, `ReadAloud`, `StepCard`, `TipCard` for core experiences
- `MobileNav`, `Footer`, and accessibility controls (high contrast, font size)

## Quality and release guardrails

- Lint + typecheck + build + Playwright E2E
- Multi-device smoke suite for desktop/tablet/mobile confidence
- CI artifacts for post-failure debugging
- Release and QA checklists in `docs/`
