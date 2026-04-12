# PRD: Phone Help Walkthrough Completion — v12

## Problem
When a senior reaches the last step of a phone help walkthrough, the "Next Step" button is simply disabled. There is no visual confirmation that they've completed the guide — no celebration, no summary, no clear next action. This leaves users uncertain whether they're done.

## Goal
Add a completion state to the phone help walkthrough that appears after the user finishes the last step. Show a congratulatory message, a "You did it!" heading, and clear next-step options (try another topic, go home).

## User
Older adult who just completed a phone help walkthrough (e.g., "How to connect to WiFi") and wants confirmation they succeeded.

## Scope
MVP slice: Add a completion view to the PhoneWalkthrough component that shows after the last step's "Done" button is tapped.

## Acceptance Criteria
1. Last step shows "Done" button instead of "Next Step →"
2. Tapping "Done" transitions to a completion card with congratulatory message
3. Completion card shows topic title with "Complete" badge
4. Completion card offers "Try another topic" and "Back to home" links
5. Completion card has a subtle celebratory visual (green accent, checkmark)
6. Layout works at 375px
7. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — seniors get clear confirmation of task completion, building confidence
- **Feasibility: IMPROVED** — kiosk users see a definitive endpoint, not a dead end
- **UI/UX Design: IMPROVED** — complete user flow with clear start, middle, and end
- **Requirements Met: UNCHANGED**
