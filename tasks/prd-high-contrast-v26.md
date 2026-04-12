# PRD: High Contrast Mode Toggle — v26

## Problem
Some seniors have low vision and need higher contrast between text and backgrounds. The current color scheme has good contrast but could be enhanced further for users who need it. There's no way to increase contrast without changing device settings.

## Goal
Add a "High contrast" toggle button in the footer that switches to a high-contrast color scheme with darker borders, bolder text, and more distinct backgrounds.

## User
Senior with low vision who needs stronger visual contrast to read comfortably.

## Scope
MVP slice: Add a toggle in the footer that swaps CSS custom properties to high-contrast values.

## Acceptance Criteria
1. Footer shows a "High contrast" toggle button
2. Toggling switches to high-contrast colors (darker borders, stronger text, darker accent)
3. Setting persists in localStorage across visits
4. Layout works at 375px
5. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — low-vision seniors can read more easily
- **Feasibility: IMPROVED** — kiosk accessibility compliance
- **UI/UX Design: IMPROVED** — accessibility-first toggle
- **Requirements Met: UNCHANGED**
