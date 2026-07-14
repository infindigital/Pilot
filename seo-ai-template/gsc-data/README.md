# GSC Data — {{CLIENT_NAME}}

Drop raw Google Search Console exports here. Two staples:

- **`queries.csv`** — Performance → Queries → last 28 days → Export.
- **`pages.csv`** — Performance → Pages → last 28 days → Export.

## Analysis prompts for Claude
- "From `queries.csv`, list striking-distance keywords (position 5–15, impressions > {{min}}) and the page each should map to."
- "From `pages.csv`, flag pages with high impressions but CTR below the `target_ctr_pct` in `settings.json` — these need title/meta rewrites."
- "Compare this export to last month's and summarize clicks/impressions/position deltas for `your-site/overview.md`."

> Keep one dated copy per pull if you want history, e.g. `queries-2026-07-14.csv`.
