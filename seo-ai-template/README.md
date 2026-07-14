# SEO + AI SEO — Client Growth System

A **reusable template** for running SEO and AI-search (GEO) visibility work for any client, with Claude.
Copy this whole folder once per client and fill in the placeholders — the structure stays the same, only the data changes.

> Based on the "SEO + AI SEO done with Claude" workflow. Everything here is client-agnostic:
> replace the `{{PLACEHOLDER}}` tokens and you have a ready-to-run engagement.

---

## How to use it for a new client

1. **Copy the folder** and name it after the client:
   ```bash
   cp -r seo-ai-template clients/acme-co
   ```
2. **Fill in the tokens.** Every file uses the same placeholders (see below). A quick find-and-replace gets you 80% of the way:
   ```bash
   cd clients/acme-co
   grep -rl '{{CLIENT_NAME}}' . | xargs sed -i 's/{{CLIENT_NAME}}/Acme Co/g'
   ```
3. **Drop in the data.** Export Google Search Console into `gsc-data/`, list target keywords in `your-site/keywords.csv`.
4. **Configure `settings.json`** — thresholds, cadence, and which AI engines to track.
5. **Run the automations** (`automations/*.sh`) on the schedule that suits the client (Mon/Wed/Fri by default).
6. **Report** from `reporting/` weekly.

## Placeholder tokens (used everywhere)

| Token | Meaning | Example |
|-------|---------|---------|
| `{{CLIENT_NAME}}` | Client / brand name | Acme Co |
| `{{DOMAIN}}` | Primary domain | acme.com |
| `{{PRIMARY_MARKET}}` | Main geo / market | United States |
| `{{PRODUCT_CATEGORY}}` | What they sell / the "tool" category | project management software |
| `{{DATE}}` | Report / snapshot date | 2026-07-14 |
| `{{OWNER}}` | Who runs the account | your name |

## Folder map

| Folder / file | Purpose |
|---------------|---------|
| `your-site/` | Purpose & rules for the SEO growth system |
| `gsc-data/` | Google Search Console data analysis |
| `technical-seo/` | Technical SEO audit and fixes |
| `ai-visibility/` | AI search (ChatGPT / Perplexity / Gemini) visibility tracking |
| `competitors/` | Competitor gap analysis |
| `content-strategy/` | Content strategy and planning |
| `reporting/` | Reporting and KPI tracking |
| `automations/` | Automation and monitoring scripts |
| `settings.json` | Preferences, thresholds, and configurations |

## Weekly rhythm (default)

- **Monday** — `automations/monday-rankings.sh` → ranking check
- **Wednesday** — `automations/wednesday-citations.sh` → AI citation scan
- **Friday** — `automations/friday-briefs.sh` → content brief generation
- **End of week** — update `reporting/weekly-report.md`
