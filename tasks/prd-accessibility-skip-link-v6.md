# PRD: Accessibility Skip-to-Content Link — v6

## Problem
TechBuddy has no skip-to-content link. Keyboard and screen reader users must tab through the full navigation header on every page before reaching the main content. For a senior center kiosk where users may use keyboard navigation or assistive technology, this is a significant accessibility gap. WCAG 2.1 Level A requires bypass blocks (SC 2.4.1).

## Goal
Add a visually hidden skip-to-content link as the first focusable element on every page. When focused, it becomes visible with high-contrast styling. Pressing Enter scrolls to and focuses the main content area. Also add proper `main` landmark and heading hierarchy verification.

## User
Older adult using keyboard navigation, screen reader, or switch access device at a senior center kiosk.

## Scope
MVP slice: Add skip link to RootLayout, add `id="main-content"` to PageShell, add tabIndex to main content area for focus management.

## Acceptance Criteria
1. Skip link is the first focusable element on every page
2. Skip link is visually hidden by default, visible on focus with high contrast
3. Pressing Enter on skip link moves focus to main content
4. Skip link text reads "Skip to main content"
5. All pages have proper main landmark
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — keyboard and assistive tech users can navigate efficiently
- **Feasibility: IMPROVED** — meets WCAG accessibility standards required by many senior centers
- **UI/UX Design: IMPROVED** — demonstrates accessibility-first design to judges
- **Requirements Met: UNCHANGED**
