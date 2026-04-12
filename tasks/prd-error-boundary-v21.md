# PRD: React Error Boundary — v21

## Problem
If any client component crashes during rendering (e.g., AI chat panel, practice session), the entire page goes blank with no feedback. Seniors have no way to recover or understand what happened. A kiosk deployment cannot tolerate blank white screens.

## Goal
Add a React error boundary wrapper around the main content area that catches rendering errors and shows a friendly "Something went wrong" message with a "Try again" button.

## User
Older adult who encounters an unexpected error and needs a clear recovery path.

## Scope
MVP slice: Create a single ErrorBoundary component and wrap the PageShell content.

## Acceptance Criteria
1. Error boundary catches rendering errors in child components
2. Error state shows friendly message ("Something went wrong")
3. Error state has "Try again" button that resets the boundary
4. Error state has "Go home" link
5. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — no blank screens on errors
- **Feasibility: IMPROVED** — kiosk resilience
- **UI/UX Design: IMPROVED** — graceful degradation
- **Requirements Met: IMPROVED** — production-ready error handling
