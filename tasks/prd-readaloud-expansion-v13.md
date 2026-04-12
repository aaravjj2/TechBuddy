# PRD: ReadAloud for Practice Debrief — v13

## Problem
After completing a practice scenario, seniors see a debrief with detailed feedback on their performance. This text can be long and dense — vision-impaired or low-literacy users have no way to have it read aloud. Every other major content area (scam results, phone steps, tips, AI chat) already has ReadAloud, but the practice debrief does not.

## Goal
Add ReadAloud button to the practice debrief screen so seniors can hear their performance feedback.

## User
Older adult who just completed a practice scenario and wants to understand how they did without reading dense text.

## Scope
MVP slice: Add a single ReadAloud button to the PracticeSession debrief view.

## Acceptance Criteria
1. Debrief view shows a "Read this to me" button
2. Tapping it reads the full debrief text aloud using Web Speech API
3. Button matches existing ReadAloud styling (min-h-[56px], rounded-xl, etc.)
4. Layout works at 375px
5. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — vision-impaired seniors can access practice feedback
- **Feasibility: IMPROVED** — consistent accessibility across all app sections
- **UI/UX Design: IMPROVED** — uniform ReadAloud presence across content areas
- **Requirements Met: UNCHANGED**
