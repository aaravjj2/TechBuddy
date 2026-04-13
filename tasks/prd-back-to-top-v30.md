# PRD: Back to Top Button — v30

## Problem
Seniors often scroll far down pages (especially quick tips, phone help, practice scenarios). Scrolling back up requires repeated swipes or mouse wheeling, which is difficult for users with arthritis or motor impairments.

## Goal
Add a floating "Back to Top" button that appears after scrolling down 400px. Uses smooth scroll and respects prefers-reduced-motion.

## User
Senior with arthritis or limited dexterity who has scrolled down a long page.

## Scope
MVP slice: Floating scroll-to-top button on all pages.

## Acceptance Criteria
1. Button appears after scrolling 400px down
2. Clicking scrolls to top smoothly
3. Button hidden when near top of page
4. Respects prefers-reduced-motion (instant scroll)
5. 56px minimum touch target
6. Not visible on screen readers when hidden (aria-hidden)
7. Mobile viewport — button doesn't overlap bottom nav
8. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — reduces physical effort for navigation
- **Feasibility: IMPROVED** — simple, proven pattern
- **UI/UX Design: IMPROVED** — standard accessibility feature
- **Requirements Met: UNCHANGED**
