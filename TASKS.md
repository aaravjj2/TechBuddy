# TechBuddy — Task checklist

Constraints: Next.js 15 App Router, TypeScript, Tailwind only; fonts Lora + Source Sans 3; tokens in `globals.css`; API key server-only; prompts verbatim in `lib/prompts.ts`; min body 20px; min tap target 56px (Scam button 60px); Figma Code Connect before feature page UI.

---

## Phase 1 — Project scaffold and design system

- [x] **P1.1 — Next.js 15 + TypeScript + Tailwind project root**  
  **Deliverable:** `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config`, `next.config.ts` (or `.mjs`), `app/` entry.  
  **Done When:** `npm run dev` starts and `npm run build` succeeds (placeholder page OK).

- [x] **P1.2 — Global layout: fonts, lang, metadata**  
  **Deliverable:** `app/layout.tsx` with `lang="en"`, `next/font` for Lora + Source Sans 3, semantic structure.  
  **Done When:** Headings use Lora, body/UI use Source Sans 3; `lang` on `<html>`.

- [x] **P1.3 — Design tokens in globals**  
  **Deliverable:** `app/globals.css` with variables: `--color-bg`, `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`, `--color-accent-hover`, `--color-success`, `--color-danger`, `--color-warning`, `--color-surface-hover`; Tailwind theme extension or `@apply` patterns as needed.  
  **Done When:** Values match spec §3 exactly; base body ≥20px, line-height ≥1.7, letter-spacing +0.01em on body.

- [x] **P1.4 — App shell: max width and focus rings**  
  **Deliverable:** Shared layout wrapper or pattern (e.g. main `max-w-[800px] mx-auto`, padding). Global focus style: 3px ring using accent.  
  **Done When:** All routes use centered ≤800px content; focus visible on keyboard nav.

- [x] **P1.5 — Route tree stubs**  
  **Deliverable:** `app/page.tsx` (home); `app/scam-checker/page.tsx`; `app/what-is-ai/page.tsx`; `app/quick-tips/page.tsx`; `app/phone-help/page.tsx`; `app/phone-help/[topic]/page.tsx`; `app/practice/page.tsx`; `app/practice/[scenario]/page.tsx` — minimal placeholder copy.  
  **Done When:** Each path renders without error; links from home can reach each (stub links OK).

- [x] **P1.6 — API route shells**  
  **Deliverable:** `app/api/scam-check/route.ts`, `app/api/ai-chat/route.ts`, `app/api/practice/route.ts` exporting `POST` with placeholder or `501` JSON.  
  **Done When:** `npm run build` succeeds; POST targets exist for client typing.

- [x] **P1.7 — Env template**  
  **Deliverable:** `.env.example` with `ANTHROPIC_API_KEY=`.  
  **Done When:** README Phase 10 can reference it.

**Phase 1 gate:** Mark Phase 1 tasks done in `TASKS.md`; run `npm run build`.

---

## Phase 2 — Shared components

- [x] **P2.1 — `components/NavButton.tsx`**  
  **Deliverable:** Large rounded card button (min height ≥120px for home grid per spec), emoji + label props, ≥56px tap target, link or button variant.  
  **Done When:** Used on home; passes tap target and focus ring requirements.

- [x] **P2.2 — `components/ChatBubble.tsx`**  
  **Deliverable:** Assistant (left, soft blue) vs user (right, warm white) bubbles; accessible text.  
  **Done When:** Renders sample thread in isolation or Story-less demo page optional.

- [x] **P2.3 — `components/ReadAloud.tsx`**  
  **Deliverable:** Button triggering `window.speechSynthesis` for passed text; guards for SSR; ARIA label.  
  **Done When:** Works on client when mounted; no API key involved.

- [x] **P2.4 — `components/StepCard.tsx`**  
  **Deliverable:** “Step X of Y”, image slot, one instruction, Previous/Next controls (≥56px), optional `ReadAloud` integration.  
  **Done When:** Matches walkthrough format in spec §5 Feature 2.

- [x] **P2.5 — `components/ScamVerdict.tsx`**  
  **Deliverable:** SAFE / SCAM / SUSPICIOUS layouts (headline, explanation, warning_signs, action_steps, already_clicked per JSON); color + text/icon (not color-only).  
  **Done When:** Accepts typed result object from API shape §6.

- [x] **P2.6 — `components/TipCard.tsx`**  
  **Deliverable:** “Today’s Tip” layout: title, 2–3 sentences, optional action line.  
  **Done When:** Matches spec §5 Feature 5 format.

**Phase 2 gate:** Mark done; `npm run build`.

---

## Phase 3 — Feature: Scam Detector

- [x] **P3.0 — Figma Code Connect pass**  
  **Deliverable:** Code Connect / generated reference for `/scam-checker` screen.  
  **Done When:** Exported or saved mapping/snippets reviewed; adapted to Tailwind + components.

- [x] **P3.1 — Scam checker page UI**  
  **Deliverable:** `app/scam-checker/page.tsx`: textarea min-height 150px, placeholder example text, full-width “Check This Message” button **60px** height, loading/error states.  
  **Done When:** Composes only shared components + minimal layout primitives.

- [x] **P3.2 — Verdict + Read aloud + reset**  
  **Deliverable:** Renders `ScamVerdict` below form; “Read this to me” on verdict; “Check another message” resets form and result.  
  **Done When:** Matches spec §5 Feature 1 UX.

- [x] **P3.3 — Common scam examples accordion**  
  **Deliverable:** Accordion with 5–6 examples (Social Security, Medicare, grandchild, Amazon/Apple, lottery, etc.).  
  **Done When:** Expand/collapse keyboard-accessible; content plain language.

- [x] **P3.4 — Client integration with `/api/scam-check`**  
  **Deliverable:** `fetch` POST `{ message }`; parse JSON; display in `ScamVerdict`.  
  **Done When:** Works against Phase 1 shell; after Phase 8, works with real Claude.

**Phase 3 gate:** Mark done; `npm run build`.

---

## Phase 4 — Feature: What Is AI chat

- [x] **P4.0 — Figma Code Connect pass**  
  **Deliverable:** Code Connect reference for `/what-is-ai`.  
  **Done When:** Adapted to `ChatBubble` + layout.

- [x] **P4.1 — Chat page UI**  
  **Deliverable:** `app/what-is-ai/page.tsx`: message list, large input, **Send** labeled button (≥56px), suggested starter questions (spec list).  
  **Done When:** No clutter; starter questions before first send.

- [x] **P4.2 — Conversation logic**  
  **Deliverable:** Client state for messages; cap **20** turns (soft reset UX or block with friendly message); “Start over” clears chat.  
  **Done When:** Turn count enforced per spec.

- [x] **P4.3 — Read last message**  
  **Deliverable:** “Read last message to me” using `ReadAloud`.  
  **Done When:** Reads last assistant message.

- [x] **P4.4 — `/api/ai-chat` client integration**  
  **Deliverable:** POST messages array; handle SSE or unified response per Phase 8.  
  **Done When:** Streams or updates UI as spec §6 (streaming preferred).

**Phase 4 gate:** Mark done; `npm run build`.

---

## Phase 5 — Feature: Practice Mode

- [x] **P5.0 — Figma Code Connect pass**  
  **Deliverable:** References for `/practice` and `/practice/[scenario]`.  
  **Done When:** Adapted to components.

- [x] **P5.1 — Scenario list page**  
  **Deliverable:** `app/practice/page.tsx`: five scenarios (titles + short descriptions from spec).  
  **Done When:** Links to `[scenario]` slug; localStorage checkmarks for completed (read on mount).

- [x] **P5.2 — Scenario session page**  
  **Deliverable:** `app/practice/[scenario]/page.tsx`: setup screen, roleplay chat (`ChatBubble`), visible “End Practice” → debrief.  
  **Done When:** User can complete flow with API; `STOP PRACTICE` string handled in client message if typed.

- [x] **P5.3 — Debrief and navigation**  
  **Deliverable:** After debrief: “Try another scenario”; parse `phase` from API responses.  
  **Done When:** Matches spec §5 Feature 4.

- [x] **P5.4 — `/api/practice` client integration**  
  **Deliverable:** POST `scenario`, `messages`, `phase`.  
  **Done When:** Roleplay/debrief phases sync with server.

**Phase 5 gate:** Mark done; `npm run build`.

---

## Phase 6 — Feature: Phone Help walkthroughs

- [x] **P6.0 — Figma Code Connect pass**  
  **Deliverable:** References for topic list and step layout.  
  **Done When:** Adapted to `StepCard`.

- [x] **P6.1 — Static topic data**  
  **Deliverable:** `lib/phone-help.ts` (or similar): 8 topics, slugs, ordered steps (one sentence each), image paths under `public/phone-help/...`.  
  **Done When:** All topics from spec §5 Feature 2 covered.

- [x] **P6.2 — Topic list page**  
  **Deliverable:** `app/phone-help/page.tsx` lists topics with large tap targets.  
  **Done When:** Each links to `/phone-help/[topic]`.

- [x] **P6.3 — Dynamic walkthrough pages**  
  **Deliverable:** `[topic]/page.tsx` uses `StepCard`, progress bar, annotated images (placeholders acceptable if assets not final—filenames consistent); `ReadAloud` per step.  
  **Done When:** Full navigation through steps for all 8 topics.

**Phase 6 gate:** Mark done; `npm run build`.

---

## Phase 7 — Feature: Quick Tips

- [x] **P7.0 — Figma Code Connect pass**  
  **Deliverable:** Reference for `/quick-tips`.  
  **Done When:** Adapted to `TipCard`.

- [x] **P7.1 — `lib/tips.ts`**  
  **Deliverable:** Array of **20** tips (include spec samples + fill to 20).  
  **Done When:** Tip index = `dayOfYear % 20` (local timezone).

- [x] **P7.2 — Quick tips page**  
  **Deliverable:** `app/quick-tips/page.tsx` renders today’s tip via `TipCard`.  
  **Done When:** Matches spec §5 Feature 5.

**Phase 7 gate:** Mark done; `npm run build`.

---

## Phase 8 — API routes (production behavior)

- [x] **P8.1 — `lib/prompts.ts`**  
  **Deliverable:** Exact system strings: Scam (§5), AI explainer (§5), Practice (§5) with scenario interpolation.  
  **Done When:** Byte-for-byte match to spec (no paraphrase).

- [x] **P8.2 — `lib/claude.ts`**  
  **Deliverable:** Anthropic SDK wrapper; model `claude-sonnet-4-20250514`; server-only.  
  **Done When:** No key leakage to client bundles.

- [x] **P8.3 — `POST /api/scam-check`**  
  **Deliverable:** Validate body; call Claude with scam system prompt; parse strict JSON; return §6 shape; errors as JSON.  
  **Done When:** Scam page shows real verdicts.

- [x] **P8.4 — `POST /api/ai-chat` with SSE**  
  **Deliverable:** Stream assistant text (preferred §6).  
  **Done When:** What Is AI page receives streamed reply.

- [x] **P8.5 — `POST /api/practice`**  
  **Deliverable:** Inject `SCENARIO: {scenario_description}`; maintain roleplay vs debrief per messages and rules; return `{ reply, phase }`.  
  **Done When:** Practice flow completes including debrief.

**Phase 8 gate:** Mark done; `npm run build`; re-smoke Scam, AI, Practice pages.

---

## Phase 9 — Accessibility and polish

- [x] **P9.1 — `prefers-reduced-motion`**  
  **Deliverable:** Disable non-essential motion in CSS/Tailwind when `prefers-reduced-motion: reduce`.  
  **Done When:** Verified via devtools emulation.

- [x] **P9.2 — Images and icons**  
  **Deliverable:** Alt text on walkthrough images; `aria-label` on icon-only controls.  
  **Done When:** Spot-check all interactive and informative images.

- [x] **P9.3 — Home screen polish**  
  **Deliverable:** `app/page.tsx` matches spec §8: header, 2×2 grid + full-width Quick Tip, emojis, `NavButton`s.  
  **Done When:** Layout matches diagram; tap targets ≥56px (cards ≥120px height).

- [x] **P9.4 — Global audit pass**  
  **Deliverable:** Focus rings, contrast, no color-only status.  
  **Done When:** Manual pass on all five features + home.

**Phase 9 gate:** Mark done; `npm run build`.

---

## Phase 10 — README and submission prep

- [x] **P10.1 — `README.md`**  
  **Deliverable:** Structure per spec §12: tagline, what it does (5 bullets), why, stack, local run, screenshots section.  
  **Done When:** Clone → install → `.env.local` → dev steps work.

- [x] **P10.2 — `public/screenshots/`**  
  **Deliverable:** Placeholder or real PNGs + README embed paths.  
  **Done When:** At least 3 screenshot files referenced for submission.

- [x] **P10.3 — Submission checklist doc**  
  **Deliverable:** Short section in README or `SUBMISSION.md`: Devpost, Vercel, video link placeholders.  
  **Done When:** Matches spec §10 checklist items as trackable.

**Phase 10 gate:** Mark done; `npm run build`.
