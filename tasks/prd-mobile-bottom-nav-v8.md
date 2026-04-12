# PRD: Mobile Sticky Bottom Navigation — v8

## Problem
On mobile screens, TechBuddy's navigation is only accessible from the header "Home" button or the browser back button. Seniors on phones must scroll to the top to navigate between features. There's no persistent navigation — once you're deep in a feature, you must find the "Back to home" link to switch features.

## Goal
Add a sticky bottom navigation bar visible only on small screens (below 640px) with emoji icons for all 5 features. Provides one-tap access to any feature from anywhere in the app. Hidden on desktop/tablet where the header navigation suffices.

## User
Older adult using TechBuddy on a phone. Needs persistent navigation without scrolling or remembering to tap "Back to home."

## Scope
MVP slice: Create a MobileNav component and add it to RootLayout. Shows on screens < 640px, hidden above.

## Acceptance Criteria
1. Bottom nav appears only on screens below 640px wide
2. Shows 5 icons: Home, Scam Checker, Phone Help, AI Chat, Practice
3. Current page icon is visually highlighted
4. Each icon has a text label underneath
5. Does not overlap with page content (proper padding)
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — persistent navigation reduces frustration and cognitive load
- **Feasibility: IMPROVED** — mobile-first navigation is essential for phone users at senior centers
- **UI/UX Design: IMPROVED** — modern mobile navigation pattern
- **Requirements Met: UNCHANGED**
