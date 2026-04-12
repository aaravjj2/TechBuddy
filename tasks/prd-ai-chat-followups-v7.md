# PRD: AI Chat Follow-up Suggestions — v7

## Problem
The "What Is AI?" chat shows 5 static starter questions, but after the AI responds, there are no follow-up suggestions. Seniors must think of their own next question, which creates a cognitive barrier. Many seniors don't know what to ask next and may leave the chat feeling their question wasn't fully answered.

## Goal
Show 3 contextual follow-up question suggestions after each AI response. These are drawn from a curated pool of common AI questions that naturally follow from the conversation topics. This reduces cognitive load and encourages deeper learning.

## User
Older adult who just got an answer about AI and wants to learn more but doesn't know what to ask next.

## Scope
MVP slice: Add a pool of follow-up questions to AIChatPanel. After each AI response, show 3 random suggestions from the pool. Tapping one sends it as the next message.

## Acceptance Criteria
1. After each AI response, 3 follow-up question buttons appear
2. Follow-up questions are drawn from a curated pool of 15+ questions
3. Tapping a follow-up sends it as the next user message
4. Follow-ups disappear while streaming a new response
5. Follow-ups do not repeat until all have been shown
6. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: IMPROVED** — reduces cognitive load, encourages deeper AI literacy learning
- **Feasibility: IMPROVED** — guided conversation is more productive for kiosk sessions
- **UI/UX Design: IMPROVED** — feels conversational and engaging, not just a blank input box
- **Requirements Met: UNCHANGED**
