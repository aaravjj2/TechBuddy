# TechBuddy

> Your patient, always-available technology helper for senior citizens.

Built for GenLink Hacks 2026 — designed to deploy at GenLink senior centers in Austin, TX.

## What It Does

- **Scam Detector** — Paste suspicious messages; get a clear safe, scam, or suspicious verdict with plain-language next steps.
- **Help With My Phone** — Step-by-step walkthroughs for common smartphone tasks (video calls, photos, WiFi, screenshots, and more).
- **What Is AI?** — A calm chat that explains artificial intelligence without jargon.
- **Practice Mode** — Safe roleplay against common scam scripts, with an encouraging debrief afterward.
- **Quick Tips** — One short tip per day about safety, devices, and AI.

## Why We Built It

Seniors deserve technology help that feels respectful and calm—not rushed or condescending. TechBuddy matches GenLink’s focus on scams, smartphones, and AI literacy in one simple web app that works on tablets and desktops without installing anything.

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS · Z.ai (OpenAI-compatible chat API) · Vercel

## Running Locally

```bash
git clone <your-repo-url>
cd Techbuddy
npm install
cp .env.example .env.local
# Add Z_AI_API_KEY (or ZAI_API_KEY). If requests fail, try Z_AI_BASE_URL for the coding endpoint (see .env.example).
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Screenshots

Embed these in your README or Devpost submission:

- [Home](public/screenshots/home.png)
- [Scam checker](public/screenshots/scam-checker.png)
- [What Is AI?](public/screenshots/what-is-ai.png)

Replace the placeholder PNGs with full-size captures before submitting.

## Submission checklist

See [SUBMISSION.md](SUBMISSION.md) for Devpost, Vercel, demo video links, and final checks.
