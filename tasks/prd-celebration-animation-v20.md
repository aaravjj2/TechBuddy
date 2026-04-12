# PRD: Completion Celebration Animation — v20

## Problem
When seniors complete a phone help walkthrough or practice scenario, the completion screen appears statically. Adding a brief, tasteful animation reinforces their sense of accomplishment and makes the app feel more polished and rewarding.

## Goal
Add a subtle CSS animation (scale + color fade) to the completion checkmark in both the phone help "You did it!" card and the practice debrief. The animation should respect prefers-reduced-motion.

## User
Older adult who just completed a guide or scenario and deserves a small reward moment.

## Scope
MVP slice: Add CSS keyframe animation to existing completion elements. No new components.

## Acceptance Criteria
1. Phone help "You did it!" checkmark animates on appearance (scale bounce)
2. Animation respects prefers-reduced-motion (no animation for users who prefer it)
3. Animation is brief (< 1 second) and non-distracting
4. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — celebratory moment builds confidence
- **Feasibility: UNCHANGED**
- **UI/UX Design: IMPROVED** — polished micro-interaction
- **Requirements Met: UNCHANGED**
