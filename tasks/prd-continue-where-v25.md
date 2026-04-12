# PRD: Continue Where You Left Off — v25

## Problem
When seniors return to TechBuddy, the home page looks the same every time. There's no indication of what they've already explored or where they left off. Seniors with memory difficulties benefit from a clear "pick up where you left off" prompt.

## Goal
Add a "Welcome back! Continue where you left off" card to the home page that shows the last section they visited, using localStorage.

## User
Returning senior who wants to quickly pick up where they left off.

## Scope
MVP slice: Track last visited section in localStorage and show a card on the home page linking to it.

## Acceptance Criteria
1. Home page shows "Continue where you left off" card if user has visited a section before
2. Card shows the section name and links to it
3. First-time visitors see no card (nothing visited yet)
4. Uses localStorage for persistence
5. Layout works at 375px
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — helps seniors with memory difficulties
- **Feasibility: IMPROVED** — better kiosk return experience
- **UI/UX Design: IMPROVED** — personalized home page
- **Requirements Met: UNCHANGED**
