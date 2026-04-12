# PRD: Practice Mode Progress Summary — v5

## Problem
The Practice Mode page (`/practice`) shows 5 scenario cards but gives no sense of progress or achievement. Seniors who complete scenarios see a checkmark on each card, but there's no summary showing overall progress ("You've completed 3 out of 5!"). Judges evaluating "Senior Citizen Impact" want to see engagement features that motivate continued learning.

## Goal
Add a progress summary card at the top of the Practice Mode page showing: completed count, total count, a visual progress bar, and an encouraging message. When all 5 scenarios are completed, show a celebration message.

## User
Older adult who has practiced some scam scenarios. Wants to see their progress and feel motivated to complete more.

## Scope
MVP slice: Modify the PracticeScenarioList component to include a progress summary card at the top.

## Acceptance Criteria
1. Progress card appears at top of `/practice` page
2. Shows "You've completed X of 5 practice scenarios"
3. Visual progress bar fills based on completion percentage
4. When all 5 completed, shows celebration message "Great job! You've completed all practice scenarios!"
5. Progress bar uses accessible aria attributes
6. Works at 375px mobile width
7. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — gamification motivates continued scam awareness training
- **Feasibility: IMPROVED** — engagement features make kiosk sessions more productive
- **UI/UX Design: IMPROVED** — clear progress visualization
- **Requirements Met: UNCHANGED**
