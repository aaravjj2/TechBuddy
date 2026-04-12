# PRD: Breadcrumb Navigation — v24

## Problem
Sub-pages in the app (phone help topics, practice scenarios) have individual back links but no structured breadcrumb trail. Seniors can lose track of where they are in the app hierarchy, especially on a kiosk where they may not have browser navigation.

## Goal
Add a breadcrumb component to sub-pages that shows the navigation path (Home > Phone Help > WiFi) with clickable links at each level.

## User
Older adult deep in a phone help walkthrough who wants to quickly understand and navigate the app structure.

## Scope
MVP slice: Create a reusable Breadcrumb component and add it to phone help topic pages and practice scenario pages.

## Acceptance Criteria
1. Breadcrumb component shows navigation path with clickable links
2. Current page is shown as text (not a link) in the breadcrumb
3. Breadcrumb uses nav + aria-label for accessibility
4. Added to phone help topic page and practice scenario page
5. Layout works at 375px
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — clear navigation orientation
- **Feasibility: IMPROVED** — kiosk users see clear navigation path
- **UI/UX Design: IMPROVED** — standard breadcrumb pattern
- **Requirements Met: UNCHANGED**
