Iteration 29 — 2026-04-12

## What changed
Added "Print this guide" button on phone help topic pages. When printing, all UI chrome is hidden and all steps are shown in sequence with clean formatting. Uses native `window.print()` and a `.print-only` CSS class for the print view.

PRD: tasks/prd-print-guide-v29.md
Branch: improvement/v29-print-guide
All tests passing: YES (164/164)

## Judging criteria impact
- Senior Citizen Impact: IMPROVED — printable guides for offline use
- Feasibility: IMPROVED — leverages native browser print
- UI/UX Design: IMPROVED — clean print output shows polish
- Requirements Met: UNCHANGED
