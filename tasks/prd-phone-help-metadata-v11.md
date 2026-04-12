# PRD: Phone Help Topic Metadata — v11

## Problem
The Phone Help landing page shows 8 topic titles but gives no indication of how long each walkthrough is or how many steps it involves. Seniors can't judge whether they have time to start a topic. This uncertainty may prevent them from starting at all.

## Goal
Add step count ("3 steps") and estimated time ("~2 min") badges to each phone help topic card. This lets seniors make informed decisions about which walkthrough to start.

## User
Older adult browsing phone help topics, deciding whether they have time to complete one.

## Scope
MVP slice: Modify the phone help topic list to show step count and estimated time.

## Acceptance Criteria
1. Each topic card shows step count badge ("X steps")
2. Each topic card shows estimated time badge ("~Y min", calculated as ~30 seconds per step)
3. Badges are visually consistent with the trust badges on the home page
4. Layout works at 375px
5. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — seniors can manage their time and set expectations
- **Feasibility: IMPROVED** — kiosk users know how long each walkthrough takes
- **UI/UX Design: IMPROVED** — informative topic cards instead of bare titles
- **Requirements Met: UNCHANGED**
