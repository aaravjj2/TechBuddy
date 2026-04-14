# TechBuddy QA Matrix

Use this matrix before any release candidate.

## Device and browser coverage

| Class | Viewport | Browser |
|---|---|---|
| Mobile | 375x812 | Chrome Android-equivalent |
| Mobile | 390x844 | Safari iOS-equivalent |
| Tablet | 820x1180 | Chromium tablet profile |
| Tablet | 1024x1366 | Safari iPad-equivalent |
| Desktop | 1366x768 | Chrome |
| Desktop | 1920x1080 | Chrome/Edge equivalent |

## Core user journeys

1. Scam Detector flow from input to verdict and reset.
2. Phone Help topic selection and step navigation.
3. What Is AI chat with starter questions and follow-ups.
4. Practice mode scenario flow and debrief.
5. Quick Tips load and daily rotation behavior.

## Accessibility checks

- Keyboard-only navigation on all core pages.
- Visible focus rings on interactive elements.
- Skip link works and lands on main content.
- Tap targets meet minimum size.
- Error and status messages are not color-only.

## Verification command set

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e` (includes accessibility smoke specs in `tests/e2e/`)
- `npm run test:a11y` (axe-only, same routes; use when debugging a11y)
- `npm run test:e2e:multidevice` (pre-release gate: tablet + mobile + desktop)
- `npm run verify` (full local gate: all of the above in one command)

## Exit criteria

- All checks pass without critical regressions.
- No severity-1 accessibility defects.
- No blocker bugs in core user journeys.
