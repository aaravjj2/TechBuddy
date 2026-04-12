# TechBuddy — Full Specification
### GenLink Hacks Submission · Apr 12–18, 2026

---

## 1. Project Overview

**Name:** TechBuddy  
**Tagline:** Your patient, always-available technology helper  
**Target User:** Senior citizens (65+), especially those attending GenLink senior centers  
**Core Mission:** Help seniors navigate smartphones, detect scams, and understand AI — directly aligned with GenLink's three stated mission pillars  
**Deployment Target:** Vercel (free domain, satisfies submission link requirement)  
**Stack:** Next.js 15 + TypeScript + Tailwind CSS + Claude API (claude-sonnet-4-20250514)

---

## 2. Judging Criteria Alignment

| Criterion | How TechBuddy Addresses It |
|---|---|
| Senior Citizen Impact | All 5 features map to GenLink's exact training curriculum (scams, smartphones, AI literacy) |
| Feasibility at a Senior Center | Web app, no install required, tablet/desktop optimized, zero login friction |
| UI/UX Design | Enforced accessibility-first design system: 24px+ fonts, high contrast, single action per screen |
| Requirements Met | GitHub repo, 2–3 min demo video, screenshots, deployed Vercel URL |

---

## 3. Design System

### Philosophy
Warm, calm, and trustworthy. Not clinical. Not infantilizing. Think "a patient grandchild who's a tech expert." The aesthetic is clean and soft — large cards, generous whitespace, warm neutrals with a single calm accent color. No dark mode by default (many seniors find it harder to read).

### Color Palette
```
--color-bg:           #FAFAF7       /* warm off-white */
--color-surface:      #FFFFFF       /* card backgrounds */
--color-border:       #E8E4DC       /* soft warm gray */
--color-text-primary: #1A1A18       /* near-black, warm */
--color-text-secondary: #6B6860     /* muted body text */
--color-accent:       #2D7DD2       /* calm trustworthy blue */
--color-accent-hover: #1E5FA3
--color-success:      #2E7D4F       /* scam = safe green */
--color-danger:       #C0392B       /* scam = danger red */
--color-warning:      #E67E22       /* scam = suspicious orange */
--color-surface-hover: #F0EDE6
```

### Typography
- **Display/Headings:** `Lora` (Google Fonts) — serif, warm, dignified. Not sterile.
- **Body/UI:** `Source Sans 3` (Google Fonts) — highly legible, designed for readability
- **Minimum body font size:** 20px
- **Heading sizes:** H1: 36px, H2: 28px, H3: 24px
- **Line height:** 1.7 minimum for body text
- **Letter spacing:** +0.01em on body for readability

### Spacing & Layout
- Minimum tap target size: 56px height (well above 44px WCAG standard)
- Card padding: 32px
- Home button grid: 2-column on desktop, 1-column on mobile
- Max content width: 800px centered (not full-width — reduces eye strain)
- All interactive elements have visible focus rings (3px, accent color)

### Accessibility
- `prefers-reduced-motion` respected — no animations if enabled
- All images have descriptive alt text
- ARIA labels on all icon buttons
- Color is never the only indicator (always paired with text/icon)
- `lang="en"` set on HTML element
- Read Aloud button uses `window.speechSynthesis` — available on all modern browsers, no API needed

---

## 4. Application Architecture

```
/
├── app/
│   ├── page.tsx                  # Home screen (5-button nav)
│   ├── scam-checker/
│   │   └── page.tsx              # Scam Detector
│   ├── phone-help/
│   │   ├── page.tsx              # Topic selection screen
│   │   └── [topic]/page.tsx      # Individual walkthrough
│   ├── what-is-ai/
│   │   └── page.tsx              # AI explainer chat
│   ├── practice/
│   │   ├── page.tsx              # Scenario selection
│   │   └── [scenario]/page.tsx   # Active roleplay
│   ├── quick-tips/
│   │   └── page.tsx              # Daily tip card
│   └── api/
│       ├── scam-check/route.ts   # Claude API: scam analysis
│       ├── ai-chat/route.ts      # Claude API: AI explainer
│       └── practice/route.ts     # Claude API: roleplay agent
├── components/
│   ├── NavButton.tsx             # Big home screen buttons
│   ├── ReadAloud.tsx             # TTS wrapper component
│   ├── ScamVerdict.tsx           # Verdict display (safe/danger/suspicious)
│   ├── ChatBubble.tsx            # Chat UI for AI explainer + practice
│   ├── StepCard.tsx              # Phone help walkthrough steps
│   └── TipCard.tsx               # Quick tip display
├── lib/
│   ├── claude.ts                 # Anthropic SDK wrapper
│   ├── prompts.ts                # All system prompts (centralized)
│   └── tips.ts                   # Static tips data
└── public/
    └── screenshots/              # For demo video and submission
```

---

## 5. Feature Specifications

---

### Feature 1: Scam Detector

**Route:** `/scam-checker`  
**Purpose:** Senior pastes or types suspicious content (text message, email snippet, phone call description). Claude analyzes it and returns a clear verdict.

#### UI Layout
- Large textarea (min 150px height): "Paste the suspicious message here, or describe what happened"
- Placeholder text with example: *"Example: 'Your Amazon account has been suspended. Click here to verify: amz-login.net'"*
- Single large "Check This Message" button (full width, 60px height)
- Results appear below in a verdict card

#### Verdict Card States
**SAFE (green):**
```
✅ This looks safe
[Explanation in 2–3 plain sentences]
[Optional: why it's safe]
```

**SCAM (red):**
```
🚨 This is a scam
[Explanation: what gave it away, in 2–3 plain sentences]
─────────────────
What to do right now:
• Do NOT click any links
• Do NOT call the number provided
• Delete the message
• If you already clicked: [specific next step]
```

**SUSPICIOUS (orange):**
```
⚠️ Be careful — this might be a scam
[Explanation of what's uncertain]
─────────────────
What to do:
• Don't respond yet
• Call the real company directly (use a number from their official website, not the one in the message)
```

#### Claude API Prompt (Scam Checker)
```
System:
You are a scam detection assistant for senior citizens. Your job is to analyze messages or situations described to you and determine if they are scams, safe, or suspicious.

Always respond in this exact JSON format:
{
  "verdict": "SCAM" | "SAFE" | "SUSPICIOUS",
  "headline": "One sentence verdict in plain English",
  "explanation": "2-3 sentences explaining why. Use simple language. No jargon.",
  "warning_signs": ["sign1", "sign2"] // only if SCAM or SUSPICIOUS
  "action_steps": ["step1", "step2", "step3"], // always include for SCAM/SUSPICIOUS
  "already_clicked": "What to do if they already clicked a link or gave info" // only for SCAM
}

Rules:
- Never use technical jargon
- Write like you're explaining to a 75-year-old who is not tech-savvy
- Be direct and clear about danger — don't soften SCAM verdicts
- For SAFE verdicts, briefly explain why it's legitimate
- Keep all text concise — seniors should not have to read large walls of text

User: [pasted message or description]
```

#### Additional UX Details
- "Read this to me" button on the verdict card
- "Check another message" button resets the form
- Below the form: a small "Common scam examples" accordion with 5–6 real examples seniors encounter (Social Security scam, Medicare scam, grandchild-in-trouble scam, fake Amazon/Apple alerts, lottery winner scam)

---

### Feature 2: Help Me With My Phone

**Route:** `/phone-help`  
**Purpose:** Step-by-step guided walkthroughs for common smartphone tasks. Static content, no AI needed — keeps it fast and reliable.

#### Topic List (Phase 1)
1. How to make a video call (FaceTime / Google Meet)
2. How to share a photo with family
3. How to update your apps
4. How to make text bigger on your screen
5. How to connect to WiFi
6. How to charge your phone correctly
7. How to mute or unmute yourself on a call
8. How to take a screenshot

#### Walkthrough Format
Each topic is a sequence of `StepCard` components:

```
Step 1 of 5
─────────────────────────────────
[Large screenshot or simple illustration]

Tap the green button that looks like a phone.
It is usually at the bottom of your screen.

[← Previous]          [Next Step →]
```

- Steps are numbered clearly ("Step 2 of 6")
- Each step has ONE instruction sentence
- Screenshots are annotated with large red circles/arrows pointing to the exact element
- "Read this step to me" button on each card
- Progress bar at top showing how far along they are

---

### Feature 3: What Is AI?

**Route:** `/what-is-ai`  
**Purpose:** An open-ended conversational chat where seniors can ask anything about AI — what it is, is it safe, can it lie, how do I use it — answered by Claude in the warmest, most patient voice possible.

#### UI Layout
- Clean chat interface, no clutter
- Chat bubbles: TechBuddy on left (soft blue), user on right (warm white)
- Large input box at bottom: "Ask anything about AI..."
- Send button is large and labeled "Send" (not just an arrow icon)
- Suggested starter questions displayed before first message:
  - "What even is AI?"
  - "Is AI safe to use?"
  - "Can AI lie to me?"
  - "How is AI different from Google?"
  - "Will AI take over the world?" *(seniors genuinely worry about this)*

#### Claude API Prompt (AI Explainer)
```
System:
You are TechBuddy, a warm and endlessly patient technology helper for senior citizens. You explain artificial intelligence in plain, simple language — no jargon whatsoever.

Your personality:
- Warm, calm, and reassuring
- Never condescending — you treat the user as intelligent, just unfamiliar with technology
- Use analogies to everyday things seniors know (libraries, phone operators, encyclopedias)
- Keep responses short: 3–5 sentences max unless the question genuinely requires more
- If a senior expresses fear or worry about AI, validate their concern before answering
- Never use these words: algorithm, model, neural network, parameters, LLM, inference, tokens

Example analogy style:
"Think of AI like a very well-read library assistant. It has read millions of books and can answer your questions quickly — but it doesn't actually understand things the way you do. It's a helpful tool, not a thinking person."

Always end responses with an optional follow-up question they might have, phrased as: "You might also be wondering: [question]?" — but only if it feels natural.
```

#### Additional UX
- "Start over" button clears the chat
- "Read last message to me" button
- Conversation capped at 20 turns to keep context window clean (soft reset prompt after 20)

---

### Feature 4: Practice Mode

**Route:** `/practice`  
**Purpose:** Interactive roleplay scenarios where Claude plays the scammer/bad actor and the senior practices the correct response. After the scenario, Claude debreifs what they did well and what to watch for.

#### Scenario List (Phase 1)
1. **Fake Tech Support Call** — "This is Microsoft. Your computer has a virus. We need remote access."
2. **Grandchild in Trouble** — "Grandma, it's me, I'm in jail and need bail money wired right now."
3. **Fake Amazon Alert** — Text message: "Your Amazon order has been flagged. Verify your account."
4. **Social Security Suspension** — "Your Social Security number has been suspended due to suspicious activity."
5. **Lottery Winner** — "Congratulations! You've won $50,000. Just pay the processing fee of $200."

#### Flow Per Scenario
1. **Setup screen:** Scenario title + brief description of what's about to happen. "In this practice, you'll get a phone call from someone pretending to be Microsoft tech support. Practice what you would say or do."
2. **Active roleplay:** Claude plays the scammer. Senior types their response. Conversation goes 3–5 turns.
3. **Debrief:** Claude breaks character and gives feedback:
   - What the senior did right
   - Any red flags they could watch for
   - The one key rule for this scam type

#### Claude API Prompt (Practice Mode)
```
System:
You are running a scam awareness training exercise for a senior citizen. You will play the role of a scammer in a safe, educational simulation.

SCENARIO: {scenario_description}

Rules for the roleplay phase:
- Stay in character as the scammer for up to 5 exchanges
- Use realistic scammer language and pressure tactics (urgency, fear, authority)
- Do NOT break character during the roleplay
- Keep your messages short (2–4 sentences) — realistic to how scammers actually speak

When the user types "STOP PRACTICE" OR after 5 exchanges, switch to DEBRIEF mode:

Debrief format:
"Great job practicing! Here's what happened:

✅ What you did well: [specific thing from their responses]
🔍 Watch out for: [the specific tactic used in this scenario]
💡 The golden rule: [one memorable rule for this scam type, e.g., 'Microsoft will NEVER call you unsolicited']"

Keep the debrief warm and encouraging — never critical. The goal is confidence, not shame.
```

#### Additional UX
- "End Practice" button always visible — stops roleplay and jumps to debrief
- After debrief: "Try another scenario" button
- Scenario completion tracked in localStorage — checkmarks appear on completed scenarios

---

### Feature 5: Quick Tips

**Route:** `/quick-tips`  
**Purpose:** A single-card daily tip about technology, safety, or AI. Simple. Takes 30 seconds to read.

#### Tip Format
```
💡 Today's Tip
─────────────────────────────────
[Tip title — large, friendly]

[2–3 sentence explanation in plain language]

[Optional: one action they can take right now]
```

#### Tips Content (20 tips rotating by day of year % 20)
Static array in `lib/tips.ts`. Sample tips:
- "Your bank will never text you asking for your password"
- "You can make text bigger on any website by pressing Ctrl and +"
- "AI assistants like ChatGPT don't actually 'know' you — they don't store your personal information between conversations"
- "If a website address starts with 'https://' it's more secure than one starting with just 'http://'"
- "You can hang up on any phone call that makes you feel uncomfortable — you don't owe anyone a conversation"
- "Free public WiFi (like at a coffee shop) is not secure — avoid typing passwords on it"
- "If someone claims to be your grandchild and needs money urgently, hang up and call your grandchild directly on their real number"

---

## 6. API Routes

### `/api/scam-check` (POST)
```typescript
Request:  { message: string }
Response: { verdict: "SCAM"|"SAFE"|"SUSPICIOUS", headline: string, explanation: string, warning_signs?: string[], action_steps?: string[], already_clicked?: string }
```

### `/api/ai-chat` (POST)
```typescript
Request:  { messages: {role: "user"|"assistant", content: string}[] }
Response: { reply: string }
// Streaming preferred for better UX — use SSE
```

### `/api/practice` (POST)
```typescript
Request:  { scenario: string, messages: {role: "user"|"assistant", content: string}[], phase: "roleplay"|"debrief" }
Response: { reply: string, phase: "roleplay"|"debrief" }
```

---

## 7. Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
```

All API calls go through Next.js API routes — the key is never exposed client-side.

---

## 8. Home Screen Layout

The home screen is the most important screen — seniors land here first.

```
┌─────────────────────────────────────┐
│  🛡️  TechBuddy                       │
│  Your technology helper              │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │  🚨         │  │  📱         │  │
│  │  Is This    │  │  Help With  │  │
│  │  a Scam?    │  │  My Phone   │  │
│  └─────────────┘  └─────────────┘  │
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │  🤖         │  │  🎯         │  │
│  │  What Is    │  │  Practice   │  │
│  │  AI?        │  │  Mode       │  │
│  └─────────────┘  └─────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  💡  Today's Quick Tip        │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

- Each button: full rounded card, 120px minimum height, large emoji icon + label
- Quick Tip is full-width at the bottom — lower priority, but gives the page life
- No hamburger menu, no footer navigation — everything is on this screen

---

## 9. Demo Video Script (2:30)

**0:00–0:20 — Hook**
Show the home screen. Voiceover: "Millions of seniors get scammed every year because they don't know what to look for. TechBuddy was built for GenLink's senior centers to change that."

**0:20–1:00 — Scam Detector hero demo**
Paste a realistic fake Amazon text. Show the red SCAM verdict appearing with clear action steps. Click "Read this to me." Show the text being read aloud.

**1:00–1:30 — Practice Mode**
Show the Fake Tech Support scenario. Show 2–3 exchanges. Jump to the debrief. Highlight the "golden rule" callout.

**1:30–2:00 — What Is AI? chat**
Type "Is AI safe to use?" Show the warm, plain-language response. Scroll to show the suggested follow-up question.

**2:00–2:20 — Phone Help walkthrough**
Briefly show the "How to make text bigger" walkthrough — 3 steps, screenshot annotations, single action per step.

**2:20–2:30 — Closing**
Back to home screen. "TechBuddy is ready to deploy at GenLink's senior centers today. Built for GenLink Hacks 2026."

---

## 10. Submission Checklist

- [ ] GitHub repository (public, clean README)
- [ ] 2–3 minute demo video (YouTube unlisted link)
- [ ] 3+ screenshots of the app
- [ ] Deployed Vercel URL
- [ ] Devpost submission write-up (lead with GenLink's mission, end with "built to be deployed at your senior centers")

---

## 11. Build Timeline

| Day | Focus | Done When |
|-----|-------|-----------|
| Day 1 (Apr 12) | Scaffold, design system, home screen, all routes stubbed | Home screen renders with all 5 buttons, correct fonts/colors |
| Day 2 (Apr 13) | Scam Detector end-to-end (UI + Claude API + verdict card) | Can paste a message and receive a formatted verdict |
| Day 3 (Apr 14) | What Is AI? chat + Practice Mode (both use chat UI component) | Both chats work with correct system prompts |
| Day 4 (Apr 15) | Phone Help walkthroughs + Quick Tips (static content) | All 8 walkthroughs navigable, tips rotating correctly |
| Day 5 (Apr 16) | Read Aloud integration, accessibility pass, mobile polish | TTS works on all key screens, tap targets pass 56px check |
| Day 6 (Apr 17) | Demo video, README, final polish, submit | Submitted on Devpost with all 4 requirements met |

---

## 12. README Structure (GitHub)

```markdown
# TechBuddy
> Your patient, always-available technology helper for senior citizens.

Built for GenLink Hacks 2026 — designed to deploy at GenLink's senior centers in Austin, TX.

## What It Does
[5 bullet points, one per feature]

## Why We Built It
[2 sentences connecting to GenLink's mission]

## Tech Stack
Next.js 15 · TypeScript · Tailwind CSS · Claude API (Anthropic) · Vercel

## Running Locally
\`\`\`bash
git clone [repo]
cd techbuddy
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY
npm run dev
\`\`\`

## Screenshots
[Embed 3 screenshots]
```

---

*TechBuddy — GenLink Hacks 2026*
