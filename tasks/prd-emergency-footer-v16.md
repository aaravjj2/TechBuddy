# PRD: Emergency Resources Footer — v16

## Problem
TechBuddy has no visible emergency contact information. If a senior realizes they've been scammed while using the app, or feels scared, there is no immediate path to real help. A kiosk deployment would require visible emergency resources.

## Goal
Add a footer to every page with real scam-reporting phone numbers and resources (FTC, AARP Fraud Watch Network, 988 Suicide & Crisis Lifeline) so help is always one scroll away.

## User
Older adult who just realized they may have been scammed and needs to talk to a real person.

## Scope
MVP slice: Add a global footer component with 3-4 emergency resource links/numbers.

## Acceptance Criteria
1. Footer appears on every page via layout
2. Footer shows 3+ real helpline resources with phone numbers
3. Phone numbers are tappable tel: links on mobile
4. Footer is visually distinct from page content (border-top, muted background)
5. Layout works at 375px
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — real help numbers available at all times
- **Feasibility: IMPROVED** — kiosk requirement for emergency contacts met
- **UI/UX Design: IMPROVED** — professional trust signals in footer
- **Requirements Met: IMPROVED** — demonstrates real-world applicability
