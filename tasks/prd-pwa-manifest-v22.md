# PRD: PWA Manifest — v22

## Problem
The app has no web app manifest, so it can't be installed on tablets or kiosks as a standalone app. For a senior center deployment, the app should be installable and look like a native app.

## Goal
Add a manifest.json with app name, icons, theme color, and display mode so the app is installable as a PWA on tablets and kiosks.

## User
Senior center staff setting up a tablet kiosk who wants to install TechBuddy as a standalone app.

## Scope
MVP slice: Add manifest.json and link it in the layout. Generate simple SVG icons.

## Acceptance Criteria
1. manifest.json exists with name, short_name, icons, theme_color, background_color
2. display is set to "standalone"
3. Manifest is linked in the layout head
4. App is installable on Chrome (manifest detected)
5. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: UNCHANGED**
- **Feasibility: IMPROVED** — installable on kiosk tablets
- **UI/UX Design: IMPROVED** — native-like standalone experience
- **Requirements Met: IMPROVED** — deployable as a standalone app
