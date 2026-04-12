# PRD: Phone Help Image Fallback — v4

## Problem
The Phone Help walkthrough (`/phone-help/[topic]`) displays step-by-step images via `<img>` tags pointing to `/phone-help/{slug}-{n}.png`. These images don't exist in the public directory — they're referenced but never created. When the browser gets a 404, it shows a broken image icon. For seniors, this looks like the app is broken and erodes trust.

## Goal
Add an `onError` fallback to the `<img>` in `StepCard` that replaces broken images with a clean, accessible SVG placeholder illustration. The fallback shows a simple phone icon with "Follow the steps below" text. No broken image icons ever appear.

## User
Older adult following a phone help walkthrough. The image should help, not confuse. When an image is unavailable, a clear placeholder keeps the experience smooth.

## Scope
MVP slice: Modify `StepCard` component to handle image load errors gracefully. No new images needed.

## Acceptance Criteria
1. StepCard img has onError handler that swaps to a placeholder
2. Placeholder is an inline SVG with a phone icon + instruction text
3. Placeholder has same dimensions as the image area
4. No broken image icons ever visible to the user
5. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — no confusing broken icons, maintains trust
- **Feasibility: IMPROVED** — app works gracefully even without illustrations
- **UI/UX Design: IMPROVED** — polished fallback instead of browser default broken icon
- **Requirements Met: UNCHANGED**
