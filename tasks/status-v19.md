Iteration 19 — 2026-04-12

## What changed
Added Enter-to-submit support to the AI chat and practice mode text inputs. Pressing Enter sends the message; Shift+Enter creates a new line. Also committed the uncommitted lint fix from v7 (adding pickSuggestions to useCallback deps in AIChatPanel.tsx).

PRD: tasks/prd-keyboard-submit-v19.md
Branch: improvement/v19-keyboard-submit
All tests passing: YES (5/5)

## Judging criteria impact
- Senior Citizen Impact: IMPROVED — familiar messaging behavior
- Feasibility: IMPROVED — keyboard-friendly input
- UI/UX Design: IMPROVED — standard messaging convention
- Requirements Met: UNCHANGED

## Next iteration focus (suggested)
Confetti/celebration animation on practice scenario completion
