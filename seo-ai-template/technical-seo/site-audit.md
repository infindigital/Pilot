# {{CLIENT_NAME}} — Technical SEO Audit

> **Purpose:** Crawlability, indexation, and Core Web Vitals issues for {{DOMAIN}}, with owners and status.
> Audited: {{DATE}}

## Issue log
| # | Issue | Severity | Pages affected | Fix | Owner | Status |
|---|-------|----------|----------------|-----|-------|--------|
| 1 | | high/med/low | | | | open/in-progress/done |

## Crawlability & indexation checklist
- [ ] `robots.txt` present and not blocking key paths — `https://{{DOMAIN}}/robots.txt`
- [ ] XML sitemap submitted in GSC and returns 200 — `https://{{DOMAIN}}/sitemap.xml`
- [ ] No unintended `noindex` on money pages
- [ ] Canonical tags correct (self-referencing where expected)
- [ ] No orphan pages in key sections
- [ ] Redirect chains / loops resolved (301, single hop)
- [ ] 404s from GSC Coverage triaged (fix / redirect / leave)
- [ ] HTTPS enforced, mixed content cleared
- [ ] Pagination / faceted URLs handled (params, canonical)
- [ ] hreflang correct (if multi-region)

## Core Web Vitals (targets from settings.json)
| Metric | Target | Mobile | Desktop | Status |
|--------|--------|--------|---------|--------|
| LCP | ≤ 2500 ms | | | |
| CLS | ≤ 0.1 | | | |
| INP | ≤ 200 ms | | | |

## On-page hygiene
- [ ] One H1 per page, descriptive
- [ ] Title tags unique, ≤ 60 chars, keyword-led
- [ ] Meta descriptions unique, ≤ 155 chars
- [ ] Image alt text present
- [ ] Internal linking to priority pages
- [ ] Structured data valid (see `schema.md`)
