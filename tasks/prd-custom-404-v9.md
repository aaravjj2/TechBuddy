# PRD: Senior-Friendly 404 Not Found Page — v9

## Problem
The default Next.js 404 page is a generic "This page could not be found" with no navigation back to the app. For seniors at a kiosk who accidentally tap a wrong link or mistype a URL, this is a dead end — they may think the app is broken and walk away.

## Goal
Create a custom `not-found.tsx` page with large text, a friendly message, a clear explanation ("The page you looked for doesn't exist"), and a prominent "Go Home" button that's at least 56px tall.

## User
Older adult who ended up on a non-existent page and needs a clear way back.

## Scope
MVP slice: Create `app/not-found.tsx` with senior-friendly error page.

## Acceptance Criteria
1. Custom 404 page appears for all non-existent routes
2. Shows friendly emoji and "Page not found" heading
3. Explains what happened in plain language
4. Has a "Go Home" button (min 56px height) linking to /
5. Uses PageShell for consistent layout
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — seniors never hit a dead end
- **Feasibility: IMPROVED** — robust error handling makes kiosk deployment reliable
- **UI/UX Design: IMPROVED** — polished error page instead of generic fallback
- **Requirements Met: UNCHANGED**
