# PRD: Chat Input Keyboard Submit — v19

## Problem
The AI chat and practice mode text inputs are `<textarea>` elements that don't submit when the user presses Enter. Seniors used to messaging apps expect Enter to send. Currently they must find and tap the Send button every time.

## Goal
Add Enter-to-submit support to the AI chat and practice mode inputs. Shift+Enter should still create a new line.

## User
Older adult typing a question who expects Enter to work like sending a text message.

## Scope
MVP slice: Add onKeyDown handlers to AI chat and practice textareas.

## Acceptance Criteria
1. AI chat input submits on Enter (without Shift)
2. Practice input submits on Enter (without Shift)
3. Shift+Enter creates a new line in both inputs
4. Build passes, lint passes, all tests pass
5. Also commit the uncommitted lint fix in AIChatPanel.tsx

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — familiar messaging behavior
- **Feasibility: IMPROVED** — keyboard-friendly kiosk/tablet input
- **UI/UX Design: IMPROVED** — standard messaging convention
- **Requirements Met: UNCHANGED**
