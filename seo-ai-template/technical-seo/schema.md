# {{CLIENT_NAME}} — Structured Data / Schema

> **Purpose:** Schema markup for rich results **and** to make {{CLIENT_NAME}} easier for AI engines to cite.
> Validate everything at https://validator.schema.org and Google's Rich Results Test.

## Schema coverage
| Page type | Schema type | Status | Notes |
|-----------|-------------|--------|-------|
| Home | Organization | | logo, sameAs, contactPoint |
| Product / tool | Product / SoftwareApplication | | offers, aggregateRating |
| Blog post | Article / BlogPosting | | author, datePublished |
| FAQ | FAQPage | | powers AI answers & rich results |
| Reviews | Review / AggregateRating | | |
| Breadcrumbs | BreadcrumbList | | |

## Organization block (fill and paste into `<head>`)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{{CLIENT_NAME}}",
  "url": "https://{{DOMAIN}}",
  "logo": "https://{{DOMAIN}}/logo.png",
  "description": "{{CLIENT_NAME}} is a {{PRODUCT_CATEGORY}} for [audience].",
  "sameAs": [
    "https://www.linkedin.com/company/…",
    "https://x.com/…"
  ]
}
```

## FAQPage block (great for AI citations)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is {{CLIENT_NAME}}?",
      "acceptedAnswer": { "@type": "Answer", "text": "…" }
    }
  ]
}
```

## AI-citation tips
- Answer buyer questions in clear, quotable sentences (see `ai-visibility/buyer-queries.csv`).
- Keep an up-to-date facts/stats block on the homepage — AI engines lift these.
- Use FAQPage schema on pages that target question queries.
