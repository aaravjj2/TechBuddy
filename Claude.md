# TechBuddy — Agent Context

## Stack

Next.js 15 App Router, TypeScript, Tailwind CSS, Z.ai OpenAI-compatible API (`lib/zai.ts`)

## Key Conventions

- All model calls go through `/app/api/*` route handlers only — never client-side
- API keys: `Z_AI_API_KEY` or `ZAI_API_KEY` (server-only); optional `Z_AI_BASE_URL`, `Z_AI_MODEL`
- Color tokens live in `app/globals.css` as CSS variables — never hardcode hex values in components
- Fonts: Lora (headings) + Source Sans 3 (body) via `next/font/google`
- Minimum tap target: 56px height. Minimum font size: 20px. These are hard requirements.
- All system prompts live in `lib/prompts.ts` — never inline them in route handlers

## Quality Checks

- `npm run verify` (lint, typecheck, build, Playwright E2E, multi-device smoke)
- `npm run verify:quick` when iterating quickly (lint, typecheck, build)

## Full Spec

`TechBuddy_Full_Spec.md` contains design tokens, component specs, API prompt text, and feature requirements. Treat it as source of truth.
