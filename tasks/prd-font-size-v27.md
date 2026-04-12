# PRD: Font Size Controls — v27

## Problem
The app uses a 20px base font which is good, but some seniors need even larger text. There's no in-app way to increase font size without changing device settings.

## Goal
Add "A+" and "A-" buttons in the footer next to the high contrast toggle that increase/decrease the base font size. Setting persists in localStorage.

## User
Senior who needs larger text to read comfortably.

## Scope
MVP slice: Add font size controls to the footer.

## Acceptance Criteria
1. Footer shows "A+" and "A-" buttons
2. Tapping "A+" increases base font size by 2px (up to 28px max)
3. Tapping "A-" decreases by 2px (down to 16px min)
4. Default is 20px (unchanged)
5. Setting persists in localStorage
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — adjustable text for all vision levels
- **Feasibility: IMPROVED** — kiosk accessibility
- **UI/UX Design: IMPROVED** — customizable readability
- **Requirements Met: UNCHANGED**
