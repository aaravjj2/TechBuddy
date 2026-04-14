# GenLink Hacks 2026 — submission checklist

Use this list before you submit on Devpost.

- [ ] **GitHub repository** — Public repo, clean history, this README visible at root.
- [ ] **Deployed URL** — Vercel (or similar) production link; set `Z_AI_API_KEY` (and optional `Z_AI_BASE_URL` / `Z_AI_MODEL`) in project env (never commit secrets).
- [ ] **Demo video (2–3 minutes)** — Upload to YouTube as unlisted and paste the final link in your Devpost entry.
- [ ] **Screenshots** — At least 3 real screenshots in `public/screenshots/` (`home.png`, `scam-checker.png`, `what-is-ai.png`).
- [ ] **Devpost write-up** — Lead with GenLink’s mission; end with “built to be deployed at your senior centers.”
- [ ] **Verification run** — Confirm `npm run lint`, `npm run build`, and `npx playwright test` all pass locally before submission.

Optional: link to this file or paste the checklist into your Devpost notes.
