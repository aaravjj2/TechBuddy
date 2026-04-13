#!/bin/bash
# Ralph loop — project layout: ralph/prd.json, ralph/progress.txt, ralph/prompt.md
# Usage: ./scripts/ralph/ralph.sh [--tool amp|claude] [max_iterations]

set -e

TOOL="amp"
MAX_ITERATIONS=10

while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

if [[ "$TOOL" != "amp" && "$TOOL" != "claude" ]]; then
  echo "Error: Invalid tool '$TOOL'. Must be 'amp' or 'claude'."
  exit 1
fi

if ! command -v amp >/dev/null 2>&1 && [[ "$TOOL" == "amp" ]]; then
  echo "Note: amp not found; using claude instead."
  TOOL="claude"
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RALPH_DIR="$REPO_ROOT/ralph"
PRD_FILE="$RALPH_DIR/prd.json"
PROGRESS_FILE="$RALPH_DIR/progress.txt"
ARCHIVE_DIR="$RALPH_DIR/archive"
LAST_BRANCH_FILE="$RALPH_DIR/.last-branch"
PROMPT_FILE="$RALPH_DIR/prompt.md"

read_branch() {
  local f="$1"
  if command -v jq >/dev/null 2>&1; then
    jq -r '.branchName // empty' "$f" 2>/dev/null || true
  else
    python3 -c "import json,sys; d=json.load(open(sys.argv[1])); print(d.get('branchName') or '')" "$f" 2>/dev/null || true
  fi
}

if [ ! -f "$PRD_FILE" ]; then
  echo "Error: Missing $PRD_FILE"
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "Error: Missing $PROMPT_FILE (create it next to prd.json)"
  exit 1
fi

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(read_branch "$PRD_FILE")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    DATE=$(date +%Y-%m-%d)
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    echo "Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/" 2>/dev/null || true
    echo "   Archived to: $ARCHIVE_FOLDER"

    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

CURRENT_BRANCH=$(read_branch "$PRD_FILE")
if [ -n "$CURRENT_BRANCH" ]; then
  echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
fi

if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo "Starting Ralph — repo: $REPO_ROOT"
echo "Tool: $TOOL — Max iterations: $MAX_ITERATIONS"

for i in $(seq 1 "$MAX_ITERATIONS"); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Iteration $i of $MAX_ITERATIONS ($TOOL)"
  echo "==============================================================="

  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT=$(cat "$PROMPT_FILE" | amp --dangerously-allow-all 2>&1) || true
  else
    if ! command -v claude >/dev/null 2>&1; then
      echo "Error: claude CLI not found. Install it or use amp."
      exit 1
    fi
    OUTPUT=$(claude --dangerously-skip-permissions --print < "$PROMPT_FILE" 2>&1) || true
  fi
  printf '%s\n' "$OUTPUT"

  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "Ralph completed all tasks!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE for status."
exit 1
