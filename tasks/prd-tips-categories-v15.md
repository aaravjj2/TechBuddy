# PRD: Quick Tips Category Badges — v15

## Problem
The Quick Tips page shows 20 tips in a flat unsorted list. Seniors must scroll through all of them to find tips relevant to their situation (e.g., scam-related vs phone skills vs online safety). There's no way to quickly identify what a tip is about.

## Goal
Add simple category labels to each tip (Scam Safety, Phone Skills, Online Safety, Privacy) so seniors can scan and find relevant tips faster. Add filter buttons at the top to show only tips in a chosen category.

## User
Older adult browsing tips who wants to find scam-related advice specifically, without scrolling through phone tips.

## Scope
MVP slice: Add a `category` field to tips data, display category badges on each tip card, and add filter buttons.

## Acceptance Criteria
1. Each tip has a category: "Scam Safety", "Phone Skills", "Online Safety", or "Privacy"
2. Category badge is shown on each TipCard
3. Filter buttons at top of "All tips" section let users show only one category
4. "All" filter is default and shows everything
5. Filter works on both desktop and 375px mobile
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — seniors find relevant tips faster
- **Feasibility: IMPROVED** — kiosk users can filter by concern
- **UI/UX Design: IMPROVED** — organized content with category filters
- **Requirements Met: UNCHANGED**
