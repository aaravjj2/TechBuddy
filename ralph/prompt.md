# Ralph iteration (TechBuddy)

You are running inside the **TechBuddy** repo at the workspace root.

## Files

- `ralph/prd.json` — user stories with `passes` and `priority`
- `ralph/progress.txt` — append a one-line note after each story you finish

## One iteration — do exactly this

1. Read `ralph/prd.json`. Pick the **lowest `priority`** story where **`passes` is false**. If none, output this exact line on its own line: `<promise>COMPLETE</promise>` and stop.

2. Implement only that story. Meet every **acceptance criterion** (code changes in the repo).

3. Run **`npm run build`** from the repo root. Fix failures until it passes.

4. If the story touches UI, briefly verify the relevant route in the browser (or note what blocked you).

5. Set that story’s **`passes` to `true`** in `ralph/prd.json` (valid JSON). Do not change other stories’ `passes` unless you also completed them.

6. Append to `ralph/progress.txt`: `YYYY-MM-DD HH:MM — US-XXX — done` (use the real story id).

7. If **all** stories now have `"passes": true`, also output: `<promise>COMPLETE</promise>`

## Rules

- One story per iteration only.
- Keep API keys server-side; never commit secrets.
- Do not edit this prompt file unless the user asked you to.
