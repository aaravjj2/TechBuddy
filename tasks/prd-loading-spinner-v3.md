# PRD: Accessible Loading Spinner Component — v3

## Problem
All API-calling buttons in TechBuddy show loading state as text-only changes ("Checking…", "Sending…", "Starting…"). There is no visual animation indicating progress. For seniors with cognitive delays or poor vision, a text-only change can be invisible — the page appears frozen. Judges evaluating UI/UX polish will notice the absence of loading indicators.

## Goal
Create a reusable `Spinner` component with CSS animation and aria attributes. Apply it to all loading states across ScamCheckerForm, AIChatPanel, PracticeSession, and StepCard. Every loading state shows both the spinner and descriptive text.

## User
Older adult waiting for an API response. Needs clear visual feedback that something is happening and the app hasn't frozen.

## Scope
MVP slice: One new `Spinner` component, applied to 3 existing components' loading states.

## Acceptance Criteria
1. New `components/Spinner.tsx` with animated CSS spinner, `aria-label`, and `role="status"`
2. ScamCheckerForm: loading state shows spinner + "Checking…" text
3. AIChatPanel: streaming state shows spinner + "Sending…" text
4. PracticeSession: loading state shows spinner + "Starting…" / "Sending…" text
5. Spinner respects `prefers-reduced-motion` (stops animation)
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — clear visual feedback prevents confusion/fear that app is broken
- **Feasibility: IMPROVED** — kiosk users see activity, don't walk away thinking it crashed
- **UI/UX Design: IMPROVED** — professional polish with animated loading indicators
- **Requirements Met: UNCHANGED**
