# PRD: Tappable Scam Example Cards — v1

## Problem
The Scam Checker page has 6 example scam descriptions at the bottom, but they are read-only `<details>` elements. Seniors — especially at kiosk tablets — must manually type or paste a message to check it. This is a significant friction barrier for the target audience.

## Goal
Make each example scam card tappable so that tapping it auto-fills the textarea with the scam description and optionally auto-submits the check. This reduces the interaction to a single tap instead of reading, remembering, typing, and submitting.

## User
Older adult using TechBuddy at a senior center kiosk or personal tablet. May have limited dexterity and find typing difficult. Wants to see how the scam checker works without effort.

## Scope
MVP slice: Modify the `ScamCheckerForm` component's example section only. Each example card gets a "Check this example" button (or the whole card becomes tappable) that fills the textarea and triggers the scam check API call.

## Acceptance Criteria
1. Each example scam card has a visible "Check this" button/tap target (min 56px height)
2. Tapping it fills the textarea with the example body text
3. The scam check automatically submits (no second tap needed)
4. The page scrolls to the result after it loads
5. The "Check another message" button resets everything cleanly
6. All existing functionality (manual typing, reset, read-aloud) still works
7. Build passes, lint passes, all new tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — Removes typing barrier, lets seniors explore scam detection with zero effort
- **Feasibility: IMPROVED** — Makes kiosk/tablet use much more realistic — one tap vs. multi-step typing
- **UI/UX Design: IMPROVED** — More interactive, feels polished and intentional
- **Requirements Met: UNCHANGED**
