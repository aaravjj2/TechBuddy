# PRD: Print-Friendly Guides — v29

## Problem
Seniors often want to print step-by-step phone help guides to follow along offline. Currently, printing includes the nav, footer, mobile bottom bar, and other UI chrome — making the printed page cluttered and wasteful.

## Goal
Add a "Print this guide" button on phone help walkthrough pages. When printing, hide all chrome (nav, footer, bottom bar, buttons) and show only the step-by-step content with a clean title.

## User
Senior who wants a printed copy of a phone help guide to follow at their own pace.

## Scope
MVP slice: Print button on phone help topic pages with clean print styles.

## Acceptance Criteria
1. "Print this guide" button visible on phone help topic pages (e.g., /phone-help/wifi)
2. Button uses window.print() to trigger browser print dialog
3. Print CSS hides: MobileNav, Footer, high contrast toggle, font size controls, skip link, breadcrumbs, back links, ReadAloud buttons, and the print button itself
4. Printed output shows: guide title, each step with step number and instructions
5. Mobile viewport — button is still accessible
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — printable guides for offline use
- **Feasibility: IMPROVED** — leverages native browser print
- **UI/UX Design: IMPROVED** — clean print output shows polish
- **Requirements Met: UNCHANGED**
