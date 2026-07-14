#!/usr/bin/env bash
# Friday content brief — {{CLIENT_NAME}}
# Reusable: pulls the top content gaps and stubs a brief for each in content-briefs.md.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$HERE")"
SETTINGS="$ROOT/settings.json"
GAP="$ROOT/content-strategy/content-gap.md"
BRIEFS="$ROOT/content-strategy/content-briefs.md"
DATE="$(date +%F)"

if command -v jq >/dev/null 2>&1; then
  CLIENT="$(jq -r '.client.name' "$SETTINGS")"
else
  CLIENT="$(grep -o '"name":[^,]*' "$SETTINGS" | head -1 | cut -d'"' -f4)"
fi

echo "== Friday content briefs :: $CLIENT :: $DATE =="
echo "Gaps:   $GAP"
echo "Briefs: $BRIEFS"
echo

echo "Checklist:"
echo "  - Review high-priority rows in content-strategy/content-gap.md"
echo "  - For each, ask Claude to expand the brief template in content-briefs.md"
echo "    using the target keyword, buyer AI prompts, and brand-voice.md"
echo "  - Assign an owner + due date in the brief queue"
echo "  - Confirm each brief targets at least one prompt from ai-visibility/buyer-queries.csv"
echo

# --- Optional: append a dated stub so nothing gets lost ---
if [ -w "$BRIEFS" ]; then
  {
    echo ""
    echo "<!-- brief stub generated $DATE -->"
    echo "### [Fill title] ($DATE)"
    echo "- **Target keyword:** …"
    echo "- **Buyer AI prompt(s):** …"
    echo "- **Status:** draft"
  } >> "$BRIEFS"
  echo "Appended a dated brief stub to content-briefs.md"
fi
