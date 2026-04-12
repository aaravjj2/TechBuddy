# PRD: Expanded Quick Tips Browser — v2

## Problem
The Quick Tips page (`/quick-tips`) shows only one tip per day using a day-of-year modulo. Judges and seniors see a single card and nothing else. The page feels thin — 19 tips are hidden behind a date rotation that a first-time visitor won't even notice. This wastes 95% of the content library on any given visit.

## Goal
Show all 20 tips on the Quick Tips page in a browsable card format, with today's tip highlighted at the top. Seniors can scroll through all tips in one session. The page becomes a real learning resource instead of a single-card teaser.

## User
Older adult visiting TechBuddy for the first time at a senior center. Wants to browse practical advice, not wait 20 days to see all tips.

## Scope
MVP slice: Modify the Quick Tips page and TipCard component only. Add a "Today's Tip" highlighted section at the top, then show all remaining tips below in a scrollable list. Keep the existing `getTipForDate` logic for highlighting.

## Acceptance Criteria
1. Page shows today's tip in a highlighted card at the top (border-accent, "Today's Tip" badge)
2. Below it, all 20 tips are shown in a browsable list (including today's tip repeated, or all others)
3. Each tip card shows title, body, and action (if present)
4. Read Aloud button is available on the highlighted tip
5. Page scrolls smoothly, works at 375px mobile width
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — Seniors get immediate access to all 20 tips, not just one per day
- **Feasibility: IMPROVED** — More content to engage with at a kiosk session = more value per visit
- **UI/UX Design: IMPROVED** — Richer, more complete-feeling page with clear visual hierarchy
- **Requirements Met: UNCHANGED**
