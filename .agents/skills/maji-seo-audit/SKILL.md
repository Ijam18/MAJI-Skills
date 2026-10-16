---
name: maji-seo-audit
description: "Technical SEO audit of a live site with free tools only: crawlability, robots.txt and sitemaps, canonicals, status codes and redirect chains, a Core Web Vitals budget, structured data, metadata, internal links, image alt text, hreflang, HTTPS and AI-search visibility basics, delivered as a prioritised fix list where every item carries evidence. Use when someone says \"audit our SEO\", \"why is my site not on Google\", \"technical SEO check\", \"site health check\", \"check Core Web Vitals\", \"is our sitemap ok\", \"why don't AI answers mention us\", \"audit this client site before we quote\". Not for job listing markup (use maji-jobposting-seo) or visual redesign and copy polish (use maji-ui-review)."
metadata:
  tier: workflow
  category: web
  version: "1.0.0-lite"
---

# maji-seo-audit: Technical SEO Audit

Find what stops search engines and AI answer engines from reaching, reading and trusting a site. Final output: one audit file with a P0 to P3 fix list, each fix tied to a URL, the evidence and how to verify it, plus a one-paragraph owner summary.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Brand, Stack, Folders, Tools and credits). If `me/overrides/maji-seo-audit.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use for a client or own site before a quote, after a launch or migration, after a traffic drop, or on a quarterly health check.
- Use when the owner asks why the site is missing from search or from AI answers.
- Not for job pages and JobPosting markup (maji-jobposting-seo). Not for layout, copy or brand polish (maji-ui-review). Not for rank tracking or keyword research.

## Steps

1. **Scope and permission.** Confirm the domain, the 5 to 10 key templates (home, service, article, contact, listing) and whether you have Search Console or analytics access.
2. **Crawl gates.** Read `/robots.txt`: file exists, no `Disallow: /` left from staging, CSS and JS not blocked, a `Sitemap:` line present.
3. **Status codes and redirects.** For every key URL plus the `http://`, `www` and trailing-slash variants: one hop to the final 200, permanent moves are 301 or 308, no 302 for permanent moves, no chains or loops, deleted content returns 404 or 410 (not a 200 "not found" page, a soft 404), maintenance returns 503.
4. **Canonical and duplicates.** Each indexable page has one self-referencing absolute canonical on the final HTTPS host.
5. **Core Web Vitals budget.** Run PageSpeed Insights (free) or local Lighthouse on mobile for each template.
6. **Rendering and mobile.** Fetch the raw HTML: title, main heading, body text and links must exist without JavaScript, or content is at risk for crawlers that do not render.
7. **Metadata and structure.** Per template: a unique `<title>` and meta description, one `h1`, logical heading order, `lang` on `<html>`, Open Graph and social card tags, clean lowercase URLs.
8. **Structured data.** JSON-LD matching what is visible on the page: Organization or LocalBusiness on home, BreadcrumbList, Article, Product, Event or FAQPage where the content truly is that.
9. **International and HTTPS.** If more than one language: hreflang pairs are reciprocal, use valid codes, include `x-default`, and point to canonical URLs.
10. **AI-search visibility basics.** Check `robots.txt` for AI crawler user-agents and confirm the owner chose to allow or block each one on purpose.
11. **Prioritise and write up.** One row per issue in the table below.

## Composes with

- **maji-jobposting-seo**: job pages, JobPosting markup and job sitemaps.
- **maji-ui-review**: fixes for layout, copy, performance and accessibility found here.
- **maji-offer**: turn the fix list into a priced package.
- **maji-propose**: plan the fix waves for a large audit.
- **maji-brand-pdf**: render the client-facing audit report.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-seo-audit` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
