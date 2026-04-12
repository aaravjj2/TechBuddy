# PRD: Page-Specific Metadata — v17

## Problem
All pages share a single generic title and description from the root layout. When shared on social media or viewed in search results, every page looks the same — "TechBuddy — Your technology helper." This hurts discoverability and makes the hackathon submission less impressive.

## Goal
Add page-specific metadata (title, description, Open Graph tags) to each major page so they have distinct titles and descriptions when shared or indexed.

## User
Judge or reviewer viewing the deployed URL or sharing pages on social media.

## Scope
MVP slice: Add `metadata` exports to each page route (home, scam-checker, phone-help, what-is-ai, practice, quick-tips).

## Acceptance Criteria
1. Home page has distinct title and description
2. Scam Checker page has specific metadata about scam detection
3. Phone Help page has specific metadata about phone guides
4. What Is AI page has specific metadata about AI education
5. Practice page has specific metadata about practice scenarios
6. Quick Tips page has specific metadata about daily tips
7. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: UNCHANGED**
- **Feasibility: UNCHANGED**
- **UI/UX Design: IMPROVED** — professional appearance when shared
- **Requirements Met: IMPROVED** — better deploy quality, social sharing readiness
