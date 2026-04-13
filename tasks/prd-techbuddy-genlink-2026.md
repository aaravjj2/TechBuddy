# PRD: TechBuddy for GenLink Hacks 2026 (MVP)

## 1. Introduction / Overview

**TechBuddy** is a web application built for **GenLink Hacks 2026**, intended for **deployment at GenLink senior centers in Austin, TX**. It helps **older adults** use technology with less fear: checking whether a message might be a scam, learning what AI is through a simple chat, practicing how to respond to scam scenarios, following step-by-step phone help, and reading a daily quick tip.

This PRD defines an **MVP**: every core area is **usable, trustworthy, and demonstrable** end-to-end on a **publicly reachable deployment**, optimized for **safety, privacy clarity, and plain language** for seniors—not for maximum feature depth or admin tooling.

---

## 2. Goals

- Give seniors a **single, calm entry point** (home menu) to all five experiences without accounts or passwords.
- Reduce harm from scams by making the **Scam Detector** outcome **clear** (safe / scam / suspicious) with **actionable steps** and optional read-aloud.
- Build **trust** through honest **privacy** language and predictable behavior (errors, retries, no dark patterns).
- Ensure **What Is AI** answers stay **simple, non-alarmist**, and appropriate for beginners.
- Let users **practice** scam conversations in a **safe simulation** with a clear end state (debrief).
- Support **Phone Help** with **large, readable** steps and **per-step visuals** (images may be placeholders in MVP if labeled honestly).
- Deliver **Quick Tips** as **one tip per day** (or equivalent deterministic behavior) without requiring AI for that path.
- Prove readiness with a **repeatable demo script** that passes on the **deployed production URL** before hackathon submission.

---

## 3. User Stories

### US-001: Home hub and navigation

**Description:** As an older adult, I want a simple home screen with large targets so that I can open the tool I need without hunting.

**Acceptance Criteria:**

- [ ] Home lists all five areas: Scam Detector, Phone Help, What Is AI, Practice Mode, Quick Tips (labels may vary slightly but intent is clear).
- [ ] Each entry is a **minimum 56px-tall** (or equivalent) tap target and uses **high-contrast**, readable type consistent with the app design tokens.
- [ ] User can return to home from each major flow without using the browser back button only (explicit “Home” or site header).
- [ ] Typecheck and lint pass for touched code.
- [ ] Verify in browser using dev-browser skill.

---

### US-002: Scam Detector — check and understand

**Description:** As an older adult, I want to paste or type a suspicious message and get a clear verdict so that I know what to do next.

**Acceptance Criteria:**

- [ ] User can submit text; system returns a structured result: **verdict** (safe / scam / suspicious), **headline**, **explanation**, and when applicable **warning signs**, **action steps**, and **if already clicked** guidance.
- [ ] The **first recommended action** is visually emphasized (e.g. “Do this first”) without duplicating it in the full list.
- [ ] On failure (network, server, bad response), user sees **plain-language** error text and a **Try again** path without losing their typed message where applicable.
- [ ] **Read aloud** is available for the verdict content (or clearly scoped portion).
- [ ] API key and model calls stay **server-side only** (no secrets in client bundle).
- [ ] Typecheck and lint pass.
- [ ] Verify in browser using dev-browser skill.

---

### US-003: What Is AI — guided chat

**Description:** As an older adult, I want to ask questions about AI in simple language so that I feel less confused or scared.

**Acceptance Criteria:**

- [ ] User can start from **suggested questions** or type their own.
- [ ] Replies stream or appear in **readable chunks** (no wall of tiny text); conversation respects a **reasonable turn limit** with a clear message when reached.
- [ ] System prompt enforces **ELI5**, **no fear-mongering**, and **no medical/legal/financial advice** (as defined in project prompts).
- [ ] On failure, user sees **friendly** messaging and **Try again**; failed sends do not wipe the user’s question from the input when appropriate.
- [ ] Typecheck and lint pass.
- [ ] Verify in browser using dev-browser skill.

---

### US-004: Practice Mode — safe roleplay

**Description:** As an older adult, I want to practice handling a scam-style conversation in a safe space so that I feel more prepared on a real call or message.

**Acceptance Criteria:**

- [ ] User can pick a **scenario** from a list and **start** practice.
- [ ] Chat clearly states the other side is **not a real person** before or at start.
- [ ] User can **end** practice (explicit control) and receives a **debrief** when the flow ends.
- [ ] On API failure, user sees **clear errors** and can **retry** without dead-ends.
- [ ] Typecheck and lint pass.
- [ ] Verify in browser using dev-browser skill.

---

### US-005: Phone Help — topic walkthroughs

**Description:** As an older adult, I want step-by-step phone instructions with pictures so that I can follow along on my device.

**Acceptance Criteria:**

- [ ] Topics are listed; each topic opens a **linear step-by-step** walkthrough.
- [ ] Each step shows **instruction text** and an **image** (or documented placeholder) with **meaningful alt text** for screen readers.
- [ ] Image paths follow a **predictable convention** (e.g. per topic and step index) so centers can swap in real screenshots later.
- [ ] Navigation between steps is obvious (next/back or equivalent) and usable on a phone-width viewport.
- [ ] Typecheck and lint pass.
- [ ] Verify in browser using dev-browser skill.

---

### US-006: Quick Tips — daily tip

**Description:** As an older adult, I want one short tip I can read quickly so that I learn something useful without starting a long task.

**Acceptance Criteria:**

- [ ] Quick Tips page shows **one tip** appropriate to “today” (date-based or deterministic rotation—document which).
- [ ] Tip text is **short**, **large type**, and avoids requiring AI calls for MVP (static or pre-authored list).
- [ ] Typecheck and lint pass.
- [ ] Verify in browser using dev-browser skill.

---

### US-007: Trust — privacy and plain language

**Description:** As an older adult (or family member), I want to understand what data leaves my device so that I feel safe using TechBuddy at a center.

**Acceptance Criteria:**

- [ ] A **Privacy** page exists, linked from the global header (except documented kiosk/minimal mode if used).
- [ ] Privacy copy states: **no accounts**; **messages go to your server and then to the AI provider** for scam check / AI chat / practice; **no selling data**; who to ask for more info (center / organizer).
- [ ] Reading level is approximately **sixth grade**; sentences are short.
- [ ] Typecheck and lint pass.
- [ ] Verify in browser using dev-browser skill.

---

### US-008: Center staff — printable one-pager

**Description:** As center staff, I want a printable summary so that I can place instructions next to a shared tablet or PC.

**Acceptance Criteria:**

- [ ] **For centers** page exists with a **Print** control and **print-friendly** layout (essential content prints; chrome hidden where possible).
- [ ] Page explains what TechBuddy is, how to open it, and the five areas at a high level.
- [ ] Typecheck and lint pass.
- [ ] Verify in browser using dev-browser skill (including print preview if feasible).

---

### US-009: Deployment and demo readiness

**Description:** As a hackathon team member, I want a stable public URL so that judges and centers can try TechBuddy without my laptop.

**Acceptance Criteria:**

- [ ] App is deployed to a **stable HTTPS URL** (e.g. Vercel or equivalent).
- [ ] **Environment variables** for AI and optional services are set on the host; **no secrets** in the repo.
- [ ] **Production build** completes without errors.
- [ ] **Demo script** (section below) completes successfully against the **deployed** URL.

---

## 4. Functional Requirements

- **FR-1:** The app MUST provide a **home** route listing all five core features with accessible navigation.
- **FR-2:** **Scam Detector** MUST call a **server API** that returns JSON matching the app’s scam result type; client MUST render verdict, explanation, warnings, actions, and optional “already clicked” text.
- **FR-3:** **What Is AI** MUST use **server-side** streaming or complete responses; client MUST handle errors and stream end without crashing.
- **FR-4:** **Practice Mode** MUST use a **server API** that returns **phase** (roleplay vs debrief) and **reply** text; client MUST reflect phase changes in the UI.
- **FR-5:** **Phone Help** MUST load topic metadata and steps from a **single source of truth** (e.g. module or data file) and render images from **public** URLs.
- **FR-6:** **Quick Tips** MUST NOT depend on live AI for MVP unless explicitly changed in a future PRD.
- **FR-7:** **Privacy** and **For centers** routes MUST be reachable from the standard header navigation (kiosk mode MAY hide non-essential links if documented).
- **FR-8:** Optional: **Rate limiting** MAY be enabled via **Upstash** (or equivalent) using **environment-based** configuration; if unset, APIs MUST still function.
- **FR-9:** Optional: **Plausible** (or similar) analytics MAY load only when a **public env flag/domain** is set.
- **FR-10:** **Web app manifest** SHOULD be present for installability / PWA-style use on center tablets (display, theme colors, name).

---

## 5. Non-Goals (Out of Scope) — MVP

- **Accounts, roles, or per-user saved history** (no login, no cloud user profiles).
- **Real-time moderation dashboard** or staff analytics beyond optional privacy-preserving page analytics.
- **Guaranteed legal compliance** beyond honest disclosure; not a substitute for counsel.
- **Native iOS/Android apps** (web only for MVP).
- **Full localization** (English-only MVP unless explicitly added later).
- **Replacing human staff** at centers; TechBuddy is **supplemental**.
- **Medical, legal, or financial advice** inside AI features (must remain out of scope per prompts).

---

## 6. Design Considerations

- **Audience:** Older adults at **GenLink senior centers in Austin, TX**; assume **variable vision and motor control**—large tap targets, high contrast, minimal clutter.
- **Tone:** Calm, respectful, **non-patronizing**; avoid fear-based messaging except where urgent (e.g. clear scam warning).
- **Reuse:** Shared **page shell**, **header**, **chat bubbles**, **read-aloud**, and **cards** where possible for consistency.
- **Kiosk / shared device:** Optional query param (e.g. `?kiosk=1`) MAY simplify chrome for fixed tablets; document behavior for staff.

---

## 7. Technical Considerations

- **Stack:** Next.js (App Router), TypeScript, Tailwind; **AI via Z.ai** (or documented successor) with **OpenAI-compatible** server calls; **no API keys in client code**.
- **Model behavior:** Some models return empty `content` with reasoning fields—server MUST normalize **assistant text** extraction for reliability.
- **Thinking / reasoning:** If the provider supports “thinking” modes, they SHOULD be **disabled** for latency and predictable JSON/text outputs where applicable.
- **Rate limits:** Prefer **server-side** limiting (Node routes) over Edge middleware if dependencies are Node-only.
- **Assets:** Phone Help images live under **`public/`**; replacing placeholders does not require code changes if naming convention is preserved.
- **GenLink deployment:** Centers need **one URL**; consider **bookmarking instructions** on the For centers page.

---

## 8. Success Metrics

- **Demo script (below)** passes **100%** on the **production URL** before submission.
- **Lighthouse / manual checks:** Critical user paths usable at **~375px width** without horizontal scroll breaking navigation (target: no blocking layout breaks).
- **Error paths:** For each AI-backed flow, at least one **forced failure** (e.g. airplane mode) shows **understandable** copy and a **recovery** action in manual testing.
- **Trust:** Privacy page linked and readable in **under 2 minutes** at default font sizes.

---

## 9. Demo Script (End-to-End on Deployed URL)

Run in order on the **deployed HTTPS URL** (not just `localhost`). Record or take screenshots as required for Devpost.

1. **Open home** — Confirm all five areas visible; tap each and confirm page loads.
2. **Scam Detector** — Paste sample suspicious text; confirm **verdict + explanation**; confirm **Do this first** (if steps returned) and **Read aloud** control present.
3. **What Is AI** — Send one starter question; confirm **reply** arrives; scroll readable.
4. **Practice Mode** — Start any scenario; send one user line; confirm **assistant** responds; use **End practice** or flow to **debrief** (whichever the scenario supports in one pass).
5. **Phone Help** — Open any topic; step through **first and last** step; confirm **images** load (placeholder ok).
6. **Quick Tips** — Confirm **one tip** displays.
7. **Privacy** — Open from header; confirm sections on **no accounts** and **data sent to AI** are visible.
8. **For centers** — Open page; trigger **Print** (or print preview); confirm layout is acceptable.

**Failure criteria:** Any step crashes, shows a blank screen, or exposes secrets (API keys) in the browser.

---

## 10. Open Questions

- **Exact GenLink branding:** Logo, colors, or copy required by the org beyond current TechBuddy tokens?
- **AI model choice:** Fixed model name per environment vs. configurable per deploy?
- **Spanish or bilingual** copy for Austin centers—needed for MVP or post-MVP?
- **Content ownership:** Who approves **Quick Tips** and **Practice** scenarios for accuracy and tone?
- **Offline / poor Wi-Fi:** Is an offline fallback (static tips only) required for centers, or is “check Wi-Fi” messaging enough for MVP?

---

## Appendix: Mapping to Your Answers

| Question | Your choice | PRD effect |
|----------|-------------|------------|
| Feature | **1D** — TechBuddy full app, GenLink Hacks 2026, Austin centers | Scope = all five modules + center deployment context |
| Primary goal | **2A** — Safety / trust | Emphasis on scam clarity, privacy, plain language, no fear-mongering AI |
| Target user | **3A** — Older adults | UX, reading level, tap targets, read-aloud |
| Scope | **4A** — MVP | Non-goals explicit; depth limited to shippable slice |
| Success | **5B** — Demo on deployed URL | US-009 + Demo Script section |

---

_Checklist (PRD skill): clarifying answers incorporated; stories small and testable; FRs numbered; non-goals defined; saved to `tasks/prd-techbuddy-genlink-2026.md`._
