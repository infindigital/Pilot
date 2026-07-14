#!/usr/bin/env bash
# Monday ranking check — {{CLIENT_NAME}}
# Reusable: reads client config from ../settings.json. Wire in your rank-tracking API where marked.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$HERE")"
SETTINGS="$ROOT/settings.json"
DATE="$(date +%F)"

# --- read config (jq if present, else grep fallback) ---
if command -v jq >/dev/null 2>&1; then
  CLIENT="$(jq -r '.client.name'   "$SETTINGS")"
  DOMAIN="$(jq -r '.client.domain' "$SETTINGS")"
  DROP="$(jq -r '.thresholds.ranking_drop_alert_positions' "$SETTINGS")"
else
  CLIENT="$(grep -o '"name":[^,]*' "$SETTINGS" | head -1 | cut -d'"' -f4)"
  DOMAIN="$(grep -o '"domain":[^,]*' "$SETTINGS" | head -1 | cut -d'"' -f4)"
  DROP=3
fi

echo "== Monday ranking check :: $CLIENT ($DOMAIN) :: $DATE =="
echo "Tracked keywords: $ROOT/your-site/keywords.csv"
echo

# --- TODO: plug in your rank tracker (Ahrefs/SEMrush/SerpAPI/GSC API) here ---
# Example shape:
#   curl -s "https://api.yourtracker.com/rankings?domain=$DOMAIN" \
#     | jq -r '.keywords[] | [.keyword,.position,.change] | @tsv'
echo "[!] No rank-tracker API wired in yet. Edit $0 to connect one."
echo

echo "Checklist:"
echo "  - Pull current positions for all keywords in your-site/keywords.csv"
echo "  - Flag any keyword that dropped >= $DROP positions vs last week"
echo "  - Update current_position column in keywords.csv"
echo "  - Update reporting/seo-dashboard.md (keywords in top 3 / top 10)"
echo "  - Note movers in reporting/weekly-report.md"
