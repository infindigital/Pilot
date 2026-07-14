# {{CLIENT_NAME}} — AI Citations Tracker

> **Purpose:** Where ChatGPT, Perplexity, Gemini (and AI Overviews) cite {{CLIENT_NAME}}, and for which prompts.
> Run the scan weekly via `automations/wednesday-citations.sh`. Last scan: {{DATE}}

## Citation log
| Date | Engine | Prompt | Cited? | Position in answer | Source URL cited | Sentiment |
|------|--------|--------|--------|--------------------|------------------|-----------|
| {{DATE}} | ChatGPT | | yes/no | | | pos/neu/neg |

## Summary
- **Prompts tested:** —
- **Prompts where we appear:** — ( —% )
- **Most-cited page:** —
- **Engines citing us:** —

## Gaps → actions
- Prompt "…" — we're absent, competitor X is cited. Action: [create/upgrade page, add FAQ schema] → track in `content-strategy/content-gap.md`.

## How to test (manual, repeatable)
1. Ask each engine every prompt in `buyer-queries.csv`.
2. Record whether {{CLIENT_NAME}} is named and which URL (if any) is cited.
3. Note sentiment and any factual errors → log errors in `perception.md`.
