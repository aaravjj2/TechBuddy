# TechBuddy — Agent Context

## Stack
Next.js 15 App Router, TypeScript, Tailwind CSS, Gemini Flash API (`@google/generative-ai`)

## Key Conventions
- All Gemini API calls go through /app/api/* route handlers only — never client-side
- GEMINI_API_KEY read via process.env.GEMINI_API_KEY
- Color tokens live in globals.css as CSS variables — never hardcode hex values in components
- Fonts: Lora (headings) + Source Sans 3 (body) via next/font/google
- Minimum tap target: 56px height. Minimum font size: 20px. These are hard requirements.
- All system prompts live in lib/prompts.ts — never inline them in route handlers

## Quality Checks
- npm run typecheck (tsc --noEmit)
- npm run build
- Both must pass before marking any story passes: true

## Full Spec
TechBuddy_Full_Spec.md contains all design tokens, component specs, API prompt text, and feature requirements. Treat it as source of truth.