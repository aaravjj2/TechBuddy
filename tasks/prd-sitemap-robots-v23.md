# PRD: Robots.txt and Sitemap — v23

## Problem
The app has no robots.txt or sitemap.xml, which means search engines can't efficiently discover and index the pages. For a hackathon submission, this is a professional touch that shows deploy-readiness.

## Goal
Add a robots.txt and a dynamic sitemap.xml via Next.js conventions.

## User
Search engine crawler discovering TechBuddy pages.

## Scope
MVP slice: Add robots.txt and sitemap.ts to the app directory.

## Acceptance Criteria
1. /robots.txt is accessible and allows all crawlers
2. /robots.txt references the sitemap
3. /sitemap.xml is accessible and lists all 6 main pages
4. Build passes, lint passes, all tests pass

## Judging Criteria Impact
- **Senior Citizen Impact: UNCHANGED**
- **Feasibility: UNCHANGED**
- **UI/UX Design: UNCHANGED**
- **Requirements Met: IMPROVED** — deploy quality, search engine discoverability
