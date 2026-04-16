# TechBuddy PRD — GenLink Hacks 2026
## Status: ACTIVE — Iteration 1

---

## 1. Problem Statement

**73% of adults 65+ own a smartphone, but only 26% feel confident using it.** Senior citizens face a crisis of technology literacy: they are targeted by scammers (adults 60+ lose $3.4 billion annually to fraud), struggle with basic phone tasks, and feel embarrassed asking for help. Existing resources are either too technical, assume prior knowledge, or are buried behind paywalls and logins.

TechBuddy solves this by being a **free, no-login, patient technology teacher** that speaks plain English and never judges. It combines AI-powered scam detection, step-by-step phone tutorials, an AI explainer that answers questions without jargon, and interactive practice scenarios — all designed from the ground up for seniors with accessibility as a core requirement, not an afterthought.

**Why this matters:** TechBuddy doesn't just teach technology — it restores confidence and independence for the most vulnerable digital citizens.

---

## 2. User Personas

### Margaret, 72 — Retired School Teacher, Dallas TX
- Uses email daily but confused by "the cloud," app updates, and video calls
- Gets 3-5 scam emails per week and isn't sure which are real
- Wants to video call her granddaughter at college but is afraid she'll "press the wrong button"
- **Key need:** Step-by-step guides she can follow at her own pace, scam detection she trusts

### Robert, 68 — Widower, Rural Ohio
- Wife handled all the technology; now he's alone with a smartphone he barely understands
- His children set up his phone but he doesn't want to keep calling them for help
- Feels embarrassed asking "stupid questions" about basic tasks
- **Key need:** A judgment-free space to learn at his own pace, with voice read-aloud so he doesn't strain his eyes

### Dorothy, 78 — Lives Alone, Miami FL
- Gets daily robocalls and text scams targeting her Medicare and Social Security
- Lost $200 to a fake tech support scam last year
- Wants to protect herself but doesn't know what the warning signs are
- **Key need:** Instant scam checking tool, practice scenarios to build scam detection skills

### Frank, 71 — Recently Retired Factory Worker, Pittsburgh PA
- Kids gave him his first smartphone for his birthday; it's overwhelming
- Doesn't know how to connect to WiFi, share photos, or install apps
- Large hands with some arthritis — needs big buttons and simple taps
- **Key need:** Very simple phone tutorials with visual illustrations, large touch targets

### Betty & Harold, 75/77 — Married Couple, Portland OR
- Want to learn together — Betty is more comfortable with tech and helps Harold
- Interested in understanding "this AI thing everyone talks about"
- Take classes at the local senior center and want something to practice with at home
- **Key need:** AI explainer in plain language, progress tracking they can share with their instructor

---

## 3. User Stories

1. **As Margaret**, I want to paste a suspicious email into TechBuddy so I can instantly know if it's a scam, so I don't have to call my son every time I'm unsure.

2. **As Robert**, I want to follow step-by-step visual guides for making video calls so I can see my granddaughter's face without feeling embarrassed about asking for help.

3. **As Dorothy**, I want to practice identifying scam calls and messages in a safe environment so I can build the confidence to protect myself without fear of making a real mistake.

4. **As Frank**, I want all buttons and text to be large and easy to tap so I can use the app even with my arthritis, without getting frustrated and giving up.

5. **As Betty**, I want to ask "What is AI?" in my own words and get a clear, jargon-free answer so I can understand what my grandchildren are talking about without feeling left out.

6. **As Harold**, I want to hear the instructions read aloud to me so I can follow along without having to squint at the screen or remember every step.

7. **As Margaret**, I want to see my progress — which tutorials I've completed, which scams I've practiced — so I can feel a sense of accomplishment and know what to learn next.

8. **As Dorothy**, I want to know exactly what to do RIGHT NOW if I think I've been scammed, so I have a clear emergency plan instead of panicking.

9. **As Frank**, I want TechBuddy to work on my iPad too, because that's what I use most often at home, and I want the same simple experience on both devices.

10. **As Betty & Harold**, I want to print out the phone tutorials as a physical reference guide so we can keep them next to the phone and follow along even when the app isn't open.

---

## 4. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) | SSR for fast initial load, static generation for tutorial pages, API routes for AI features |
| UI | React 19 + Tailwind CSS 3.4 | Utility-first CSS enables rapid iteration; React 19 for latest features |
| Typography | Lora (headings) + Source Sans 3 (body) | Lora is warm and readable; Source Sans 3 is optimized for screen legibility at large sizes |
| AI Backend | ZAI API (OpenAI-compatible) | Powers scam checker, AI explainer chat, and practice mode feedback |
| Rate Limiting | Upstash Redis | Serverless-friendly rate limiting to protect AI API costs |
| Analytics | Plausible Analytics | Privacy-first, no cookies, GDPR compliant — critical for senior trust |
| Testing | Playwright | E2E tests for accessibility, multi-device, and core user flows |
| Deployment | Vercel | Zero-config Next.js hosting, automatic SSL, global CDN |
| PWA | Next.js manifest | Installable on home screens, works offline for cached content |

---

## 5. Implementation Phases

### Phase 1 — Core (COMPLETE)
- [x] Next.js project scaffold with App Router
- [x] Scam Checker with AI-powered analysis
- [x] Phone Help with 8 step-by-step visual guides
- [x] AI Explainer chat ("What Is AI?")
- [x] Practice Mode with interactive scam scenarios
- [x] Quick Tips with daily highlighted tip
- [x] Read Aloud on scam results
- [x] High contrast mode toggle
- [x] Font size controls
- [x] Skip-to-content link
- [x] Mobile bottom navigation
- [x] Print-friendly guides
- [x] Back to top button
- [x] Loading skeletons for every page
- [x] Error boundary with friendly messages
- [x] PWA manifest and icons
- [x] SEO metadata for all pages
- [x] First-visit checklist
- [x] Continue where you left off
- [x] Breadcrumb navigation
- [x] Privacy policy page
- [x] For community centers page
- [x] Web vitals telemetry
- [x] Client error telemetry

### Phase 2 — Progress & Emergency (COMPLETE)
- [x] Progress badge system — earn badges for completing tutorials, practice scenarios, and daily tips
- [x] "I've Been Scammed" emergency page with clear step-by-step actions and real phone numbers
- [x] More phone help topics: password safety, two-factor authentication, installing apps
- [x] More practice scenarios: Medicare, romance, refund, government grant scams (10 total)
- [x] Badge summary on home page

### Phase 3 — Voice & Onboarding (THIS ITERATION)
- [ ] Voice read-aloud on ALL pages (not just scam results)
- [ ] Improved onboarding flow — guided 60-second walkthrough for first-time visitors
- [ ] Topic difficulty indicators (Beginner / Intermediate)

### Phase 4 — Polish & Demo (FINAL ITERATION)
- [ ] Demo video script and recording
- [ ] Screenshot proof pack for submission
- [ ] Final accessibility audit (WCAG AAA target)
- [ ] Performance optimization (Lighthouse 95+)
- [ ] Community center kiosk mode refinements
- [ ] Submission documentation

---

## 6. Success Metrics

| Metric | Target | How Measured |
|--------|--------|-------------|
| Accessibility | WCAG AA on all pages, AAA on core flows | Playwright a11y tests + axe-core |
| Font size compliance | No text below 18px anywhere | Automated CSS audit |
| Click target compliance | All interactive elements ≥48x48px | Playwright layout assertions |
| Page load time | <3s on 3G connection | Lighthouse performance score ≥90 |
| Scam checker accuracy | Correctly identifies known scam patterns | Manual testing with 20+ scam examples |
| Practice completion rate | Users complete at least 3/5 scenarios (tracked in localStorage) | Client-side progress tracking |
| Zero JS errors | No unhandled exceptions in any user flow | Playwright console message checks |
| Mobile/tablet support | All features work at 768px viewport | Multi-device Playwright tests |
| Print quality | All phone tutorials print cleanly with no clutter | Visual inspection + CSS print rules |
| Demo video length | 2-3 minutes exactly | Recording timer |

---

## 7. Accessibility Plan

### Visual Accessibility
- **Font sizes:** Minimum 18px body text, 24px+ headings, user-adjustable via font size controls
- **Contrast:** WCAG AA minimum (4.5:1 for text, 3:1 for large text), AAA preferred (7:1)
- **High contrast mode:** Toggle available on every page, persists via localStorage
- **Color independence:** No information conveyed by color alone (always paired with text/icons)

### Motor Accessibility
- **Click targets:** Minimum 48x48px on all interactive elements, 56px preferred
- **Keyboard navigation:** Full keyboard support with visible focus indicators
- **Skip links:** Skip to main content on every page
- **No hover-dependent interactions:** All features accessible via tap/click

### Cognitive Accessibility
- **Plain English:** No technical jargon anywhere — all content written at 6th grade reading level
- **Simple navigation:** Maximum 2 levels deep, always visible breadcrumbs and back links
- **Progressive disclosure:** Complex topics broken into steps, revealed one at a time
- **Error messages:** Friendly and instructive, never technical ("Check your Wi-Fi and tap Try again" not "Network error ECONNREFUSED")
- **Consistent layout:** Same page structure across all sections

### Auditory Accessibility
- **Read aloud:** Text-to-speech on scam results (extending to all pages)
- **No audio-only content:** All audio paired with text

### Assistive Technology
- **Screen reader:** Semantic HTML, ARIA labels, landmark regions
- **Voice control:** All interactive elements have visible text labels (no icon-only buttons)

---

## 8. Demo Script (2-3 minutes)

**0:00 — Hook (15 seconds)**
"Meet Dorothy. She's 78, lives alone, and gets 5 scam calls a week. Last year she lost $200 to a fake tech support pop-up. TechBuddy is her patient, free technology teacher that helps her stay safe and confident."

**0:15 — Home Page (20 seconds)**
Show TechBuddy's clean, large-font home page. Point out the 5 feature cards: Scam Checker, Phone Help, AI Explainer, Practice Mode, Quick Tips. Highlight "Free forever, no login required."

**0:35 — Scam Checker (40 seconds)**
Paste a real scam email example ("Your Amazon account has been suspended..."). Show the AI instantly analyzing it, displaying the verdict with warning signs highlighted and clear action steps. Tap "Read this to me" to demonstrate voice read-aloud.

**1:15 — Phone Help (30 seconds)**
Navigate to Phone Help. Show the 8+ step-by-step guides. Open "How to make a video call" — walk through the visual steps. Point out the print button for creating physical reference cards.

**1:45 — Practice Mode (30 seconds)**
Enter Practice Mode. Start a "Social Security scam" scenario. Show how the user makes choices and gets friendly feedback at the end. Point out the progress bar showing completion.

**2:15 — AI Explainer (20 seconds)**
Ask "What is a password manager?" in plain language. Show the streaming response in jargon-free English. Emphasize: "No question is too simple."

**2:35 — Accessibility Showcase (25 seconds)**
Toggle high contrast mode on. Show font size controls working. Show the skip-to-content link via keyboard. Switch to tablet viewport (768px) — everything still works perfectly.

**3:00 — Close**
"TechBuddy is free, requires no login, and works on any device. It helps seniors like Dorothy stay safe online, learn at their own pace, and regain their digital independence. Thank you."

---

## 9. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| AI API goes down during demo | Medium | Critical | Scam checker has example pre-loads that work without API; fallback error message is friendly |
| Vercel deployment fails | Low | Critical | Deploy early in iteration; keep local dev server as backup for demo |
| Accessibility fails judge review | Low | High | Automated Playwright a11y tests catch violations before submission |
| Demo video too long/short | Medium | Medium | Script is timed to 3 minutes; rehearse with timer before recording |
| Senior user can't navigate | Low | High | First-visit checklist guides users; mobile bottom nav is always visible |
| Font sizes too small on judge's screen | Low | High | Minimum 18px enforced; font size controls let users increase further |
| Content too technical/jargon-heavy | Medium | Medium | All text reviewed against "plain English" standard; reading level checked |
| App doesn't work on tablet | Low | Medium | Multi-device Playwright tests validate 768px viewport |
| Rate limiting blocks legitimate users | Low | Medium | Generous rate limits (10 req/min); friendly error messages when hit |
| Loss of localStorage progress | Medium | Low | Progress is nice-to-have, not critical; clear messaging about browser data |

---

## 10. Competitive Differentiation

| Feature | TechBuddy | Typical Senior Tech Sites |
|---------|-----------|--------------------------|
| Price | Free, no login | Often paid courses |
| Scam Detection | AI-powered, instant | Static lists of tips |
| Phone Tutorials | Step-by-step with illustrations | Text-heavy, no visuals |
| AI Chat | Plain language, no jargon | FAQ pages |
| Practice Mode | Interactive with feedback | Read-only content |
| Voice Read-Aloud | Built-in, one tap | Not available |
| Accessibility | WCAG AA+, adjustable fonts | Basic responsive design |
| Print Support | Clean print CSS on tutorials | Print-unfriendly |
| Progress Tracking | Badges and completion stats | None |
| PWA Install | Add to home screen | Not installable |

---

## 11. Impact Statement

**Realistic reach:** There are 56 million adults 65+ in the US alone. TechBuddy is designed to work for anyone with a web browser — no downloads, no accounts, no cost.

**For community centers:** The `/for-centers` page and kiosk mode (`?kiosk=1`) make TechBuddy deployable in libraries, senior centers, and community halls with a single URL.

**For families:** TechBuddy gives adult children a resource to share with aging parents — "Just go to techbuddy.app and it will help you" — instead of being the perpetual tech support line.

**For the internet:** Every senior who learns to spot a scam through TechBuddy is one fewer victim. Every senior who learns to video call is one fewer person feeling isolated.
