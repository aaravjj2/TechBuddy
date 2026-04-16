#!/usr/bin/env bash
# Block credential leaks
if git diff --cached --name-only | grep -qE '\.(env|key|pem)$|creds\.md'; then
  echo "BLOCKED: Attempting to commit sensitive files"
  exit 1
fi
# Warn on large files
git diff --cached --name-only | while read f; do
  if [ -f "$f" ] && [ $(wc -c < "$f") -gt 500000 ]; then
    echo "WARNING: $f is over 500KB — intentional?"
  fi
done
