# PRD: Phone Help Step Navigation Dots — v14

## Problem
The phone help walkthrough shows a linear progress bar and "Step X of Y" label, but there are no clickable step indicators. Seniors who want to jump to a specific step must tap "Previous" repeatedly. There is also no visual indication of which steps have been completed vs which are upcoming.

## Goal
Add clickable step indicator dots below the progress bar that allow direct navigation to any step. Visually distinguish completed, current, and upcoming steps.

## User
Older adult partway through a phone help walkthrough who wants to revisit an earlier step.

## Scope
MVP slice: Add step dot indicators to the StepCard component.

## Acceptance Criteria
1. Step dots appear below the progress bar showing one dot per step
2. Current step dot is highlighted (accent color, larger or filled)
3. Completed step dots are subtly different from upcoming dots
4. Clicking a dot navigates directly to that step
5. Dots meet 56px touch target (with padding)
6. Layout works at 375px
7. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — easier navigation reduces frustration
- **Feasibility: IMPROVED** — kiosk users can jump to any step instantly
- **UI/UX Design: IMPROVED** — standard pagination pattern with accessibility
- **Requirements Met: UNCHANGED**
