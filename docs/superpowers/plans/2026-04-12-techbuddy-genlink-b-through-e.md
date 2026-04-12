# TechBuddy — GenLink priorities (B–E) implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen senior impact, feasibility, UI/UX, trust/safety, and optional center deployment patterns—**without** the submission package (deploy, demo video, screenshots, Devpost), which ships ~1 day before the hackathon due date.

**Architecture:** Add thin shared chrome (`SiteHeader` with Home), dedicated static-ish routes (`/privacy`, `/for-centers`), client-side resilience (retry + clearer API errors), scam-result hierarchy (one primary action), optional analytics via env-driven script injection, optional Upstash rate limiting behind env vars (no-op when unset). Phone-help assets stay in `public/phone-help/` with data-driven paths in `lib/phone-help.ts`.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind only (existing). Optional: `@upstash/ratelimit` + `@upstash/redis` when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` exist. Optional: Plausible or similar via `NEXT_PUBLIC_ANALYTICS_SCRIPT` / domain env (no new runtime deps if using inline script URL).

---

## File map (create / modify)

| Path | Responsibility |
|------|----------------|
| `components/SiteHeader.tsx` | Top bar: Home link + optional short title; used inside `PageShell` or layout |
| `components/PageShell.tsx` | Wrap children with `SiteHeader` above main |
| `app/privacy/page.tsx` | Plain-language privacy + “what we send to Z.ai” |
| `app/for-centers/page.tsx` | Printable staff one-pager; `print:` Tailwind utilities |
| `components/scam/ScamCheckerForm.tsx` | Retry, structured error, primary “next step” block from first `action_steps[0]` |
| `components/ApiErrorBanner.tsx` | Reusable alert + retry callback (optional extract from scam first) |
| `lib/phone-help.ts` | Per-step `imageSrc` pointing at distinct files under `public/phone-help/` |
| `public/phone-help/*.png` or `.jpg` | Real or stock-style step images (one file per step minimum viable) |
| `middleware.ts` | Rate limit POST `/api/*` when Upstash env present |
| `app/layout.tsx` | Optional analytics `<Script>`; link to privacy in metadata or footer region |
| `app/globals.css` | `@media print` tweaks for `/for-centers` if needed |

---

### Task 1: Site header + Home on every screen

**Files:**
- Create: `components/SiteHeader.tsx`
- Modify: `components/PageShell.tsx`

- [ ] **Step 1: Add `SiteHeader`**

Create `components/SiteHeader.tsx`:

```tsx
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <Link
        href="/"
        className="inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-xl border border-border bg-surface px-5 font-display text-[22px] text-text-primary hover:bg-surface-hover"
      >
        Home
      </Link>
      <p className="text-body text-text-secondary">TechBuddy</p>
    </header>
  );
}
```

- [ ] **Step 2: Compose in `PageShell`**

At top of `PageShell` children, render `<SiteHeader />` before `{children}`.

- [ ] **Step 3: Verify**

Run: `npm run build`  
Expected: success, no TS errors.

- [ ] **Step 4: Commit**

```bash
git add components/SiteHeader.tsx components/PageShell.tsx
git commit -m "feat: persistent Home header on all pages"
```

---

### Task 2: Privacy page (trust / what is sent to AI)

**Files:**
- Create: `app/privacy/page.tsx`
- Modify: `components/SiteHeader.tsx` or `PageShell` — no change if shell already wraps
- Modify: `app/layout.tsx` metadata `description` optional

- [ ] **Step 1: Create `/privacy`**

Create `app/privacy/page.tsx` using `PageShell`, sections: (1) No accounts; (2) Messages you type are sent to our server and then to Z.ai to generate answers; (3) We do not sell data; (4) For questions contact the center / organizer. Keep language 6th-grade reading level.

- [ ] **Step 2: Link from footer row in `SiteHeader`**

Add second link: `Privacy` → `/privacy` with same min-height as Home.

- [ ] **Step 3: Run `npm run build`**

Expected: PASS.

- [ ] **Step 4: Commit** — `feat: add privacy page and header link`

---

### Task 3: For centers — printable one-pager

**Files:**
- Create: `app/for-centers/page.tsx`

- [ ] **Step 1: Staff-facing content**

Bullets: what TechBuddy is; URL (placeholder `YOUR_DEPLOYED_URL`); no login; works on tablet; five features one line each; “contact GenLink for support.” Use `font-display` headings, `max-w-content`, `className="print:bg-white print:text-black"` on main wrapper.

- [ ] **Step 2: Add “Print this page” button**

`onClick={() => window.print()}` in a `"use client"` wrapper component `PrintButton.tsx` in same file or `components/PrintButton.tsx`, `min-h-[56px]`.

- [ ] **Step 3: Link from `SiteHeader`**

`For centers` → `/for-centers`.

- [ ] **Step 4: `npm run build` + commit** — `feat: printable staff page for senior centers`

---

### Task 4: Scam checker — API error, retry, primary next step

**Files:**
- Modify: `components/scam/ScamCheckerForm.tsx`

- [ ] **Step 1: Track `attempt` or `retryKey` state**

When `submit` fails (network or non-OK JSON), set `error` string from `error` field or generic message; show a **Retry** button (`min-h-[56px]`) that clears error and calls `submit()` again without clearing `message`.

- [ ] **Step 2: Primary action block below `ScamVerdict`**

If `result.action_steps?.length`, render a highlighted box: “Do this first:” + `result.action_steps[0]`. Remaining steps stay in `ScamVerdict` list or dedupe by skipping index 0 in list (choose one; avoid duplicate first step).

- [ ] **Step 3: Manual test**

Run dev server, turn off network or wrong API key once → see error + Retry; restore key → success.

- [ ] **Step 4: `npm run build` + commit** — `feat: scam checker retry and primary action step`

---

### Task 5: What Is AI + Practice — shared API error pattern

**Files:**
- Modify: `components/what-is-ai/AIChatPanel.tsx`
- Modify: `components/practice/PracticeSession.tsx`

- [ ] **Step 1: AI chat**

On `fetch` failure or `!res.ok` before stream, set error state with friendly copy (“Check your connection or try again in a moment”). Add **Try again** button that clears error and does not clear messages (optional) or clears last failed send—prefer keep messages and retry last user send (minimal: clear error only).

- [ ] **Step 2: Practice**

Same pattern on `callApi` failure: show Retry that re-invokes last action if feasible; at minimum show error + dismiss.

- [ ] **Step 3: `npm run build` + commit** — `feat: friendlier API errors on chat and practice`

---

### Task 6: Phone help — distinct images per step

**Files:**
- Modify: `lib/phone-help.ts`
- Create: multiple files under `public/phone-help/` (e.g. `video-call-1.jpg` … or reuse numbered placeholders)

- [ ] **Step 1: Naming convention**

Use pattern `/phone-help/{topicSlug}-{stepIndex}.png` (1-based index) so paths are predictable.

- [ ] **Step 2: Update `PHONE_HELP_TOPICS`**

Replace repeated `PLACEHOLDER` with computed paths per step index in a small helper `stepImage(slug, i)` returning `/phone-help/${slug}-${i + 1}.png`.

- [ ] **Step 3: Add image files**

Export 8–24 placeholder PNGs (can duplicate one real photo with different names) so no 404s; replace with real annotated screenshots later without code changes.

- [ ] **Step 4: `npm run build` + commit** — `feat: per-step phone help image paths`

---

### Task 7: Rate limiting (optional Upstash)

**Files:**
- Create: `middleware.ts`
- Modify: `package.json` (optional deps)
- Modify: `.env.example`

- [ ] **Step 1: Install (when using Upstash)**

```bash
npm install @upstash/ratelimit @upstash/redis
```

- [ ] **Step 2: `middleware.ts`**

If `!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN`, `return NextResponse.next()` for all.

Else: for `request.nextUrl.pathname.startsWith('/api/')` and method POST, use `ratelimit.limit(ip)` (IP from `request.headers.get('x-forwarded-for') ?? 'unknown'`). On limit, return `429` JSON `{ error: 'Too many requests. Please wait a minute.' }`.

Limiter config example: `slidingWindow(1, '60 s')` and `analytics: false` to reduce noise.

- [ ] **Step 3: Document in `.env.example`**

```
# Optional rate limits for /api/*
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 4: `npm run build` + commit** — `feat: optional Upstash rate limit for API routes`

---

### Task 8: Analytics (env-only script)

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Conditional Script**

If `process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, render `next/script` with `src={https://plausible.io/js/script.js}` and `data-domain={domain}` (use env). If unset, render nothing.

- [ ] **Step 2: `.env.example`**

```
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

- [ ] **Step 3: `npm run build` + commit** — `feat: optional Plausible analytics via env`

---

### Task 9: PWA manifest + kiosk query (optional)

**Files:**
- Create: `app/manifest.ts` (Next.js metadata API) or `public/manifest.webmanifest`
- Modify: `app/layout.tsx` icons optional
- Create: `components/KioskChrome.tsx` — if `useSearchParams().get('kiosk')==='1'`, hide `SiteHeader` links except Home, or hide Privacy/For centers only

- [ ] **Step 1: `app/manifest.ts`**

Export default `metadata` manifest: `name: 'TechBuddy'`, `short_name`, `display: 'standalone'`, `start_url: '/'`, theme color from `--color-accent`.

- [ ] **Step 2: Kiosk mode**

Client wrapper: when `kiosk=1`, render minimal header (Home only). Wrap app content from `layout` or `PageShell`—prefer `PageShell` reading `useSearchParams` (must be client component split: `PageShellClient`).

- [ ] **Step 3: `npm run build` + commit** — `feat: web manifest and optional kiosk query param`

---

## Self-review

**1. Spec coverage (B–E vs plan)**  
- **B** Staff one-pager + printable → Task 3; offline/error → Tasks 4–5; analytics → Task 8; multilingual → **gap** (defer: high scope; add only if GenLink confirms need).  
- **C** Home → Task 1; scam hierarchy → Task 4; phone images → Task 6; spacing audit → implicit in new buttons (56px); full-page audit → **gap** (add manual QA checklist in README later, not blocking).  
- **D** Privacy → Task 2; rate limit → Task 7.  
- **E** PWA/kiosk → Task 9.

**2. Placeholder scan:** No TBD steps; image task uses concrete path convention.

**3. Type consistency:** `PageShell` may need to become client component for Task 9 `useSearchParams`—split into `PageShell.tsx` (server) importing `PageShellInner.tsx` (client) only if kiosk is implemented; alternatively pass `kiosk` from a small client layout wrapper.

---

## Execution handoff

**Plan complete and saved to** `docs/superpowers/plans/2026-04-12-techbuddy-genlink-b-through-e.md`.

**Execution options:**

1. **Subagent-driven (recommended)** — Fresh subagent per task, review between tasks.  
2. **Inline execution** — Run tasks in this session in order with `npm run build` after each task group.

**Which approach do you want?**

---

## Deferred (bucket A — do ~1 day before deadline)

- Vercel deploy + env vars  
- Real screenshots → `public/screenshots/`  
- 2–3 min demo video  
- Devpost submission text  
Tracked separately from this plan.
