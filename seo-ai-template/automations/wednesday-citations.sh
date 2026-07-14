#!/usr/bin/env bash
# Wednesday AI citation scan — {{CLIENT_NAME}}
# Reusable: iterates the buyer prompts and reminds you (or your API) to test each AI engine.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$HERE")"
SETTINGS="$ROOT/settings.json"
PROMPTS="$ROOT/ai-visibility/buyer-queries.csv"
DATE="$(date +%F)"

if command -v jq >/dev/null 2>&1; then
  CLIENT="$(jq -r '.client.name' "$SETTINGS")"
  ENGINES="$(jq -r '.ai_engines_tracked | join(", ")' "$SETTINGS")"
else
  CLIENT="$(grep -o '"name":[^,]*' "$SETTINGS" | head -1 | cut -d'"' -f4)"
  ENGINES="ChatGPT, Perplexity, Gemini, AI Overviews"
fi

echo "== Wednesday AI citation scan :: $CLIENT :: $DATE =="
echo "Engines to test: $ENGINES"
echo "Prompts: $PROMPTS"
echo

# --- TODO: automate via each engine's API where available; otherwise run manually ---
echo "For each prompt below, ask every engine and record: appeared? cited URL? sentiment?"
echo "----------------------------------------------------------------------------------"
if [ -f "$PROMPTS" ]; then
  awk -F',' 'NR>1 && $0 !~ /^#/ && $1 != "" { print "  - " $1 }' "$PROMPTS"
fi
echo

echo "Then:"
echo "  - Log results in ai-visibility/citations.md (date=$DATE)"
echo "  - Record any factual errors in ai-visibility/perception.md"
echo "  - Update AI citation share in reporting/seo-dashboard.md"
echo "  - Send prompts we're absent from to content-strategy/content-gap.md"
