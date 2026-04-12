# PRD: Loading Skeletons — v18

## Problem
When navigating to the AI Chat, Practice, Scam Checker, or Phone Help pages, there's a brief flash of empty content before the page renders. This is especially noticeable on slower connections or at kiosks. A loading skeleton gives immediate visual feedback.

## Goal
Add `loading.tsx` files to each route that shows a skeleton placeholder matching the page layout while the actual content loads.

## User
Older adult navigating between pages who sees immediate feedback instead of a blank screen.

## Scope
MVP slice: Add loading.tsx to the 4 main feature routes.

## Acceptance Criteria
1. /scam-checker shows a skeleton while loading
2. /phone-help shows a skeleton while loading
3. /what-is-ai shows a skeleton while loading
4. /practice shows a skeleton while loading
5. Skeletons match the general shape of the real page (heading + content area)
6. Skeletons use accessible aria-busy attributes
7. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — no blank screens, feels more responsive
- **Feasibility: IMPROVED** — kiosk experience feels polished
- **UI/UX Design: IMPROVED** — professional loading states
- **Requirements Met: UNCHANGED**
