# PRD: Home Page Hero Enhancement — v10

## Problem
The home page hero just says "TechBuddy" and "Your technology helper" with a shield emoji. For judges evaluating the app in GenLink Hacks 2026, the purpose isn't immediately clear. There's no tagline explaining that this is a senior-focused app for scam detection and tech literacy. First-time visitors need to explore to understand what the app does.

## Goal
Enhance the home page hero with a descriptive tagline ("Learn to spot scams, understand AI, and use your phone with confidence") and add trust badges ("Free", "No login needed", "Large text").

## User
Judge at GenLink Hacks 2026 evaluating the app for the first time, or a senior center staff member deciding whether to deploy it.

## Scope
MVP slice: Modify `app/page.tsx` hero section only.

## Acceptance Criteria
1. Hero section shows descriptive tagline under the subtitle
2. Three trust badges appear below the tagline: "Free forever", "No login required", "Built for seniors"
3. Badges use accessible styling with proper contrast
4. Layout works at 375px mobile width
5. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — immediately communicates value proposition
- **Feasibility: IMPROVED** — judges and staff understand the app instantly
- **UI/UX Design: IMPROVED** — more polished, professional-looking home page
- **Requirements Met: IMPROVED** — stronger first impression for hackathon judges
