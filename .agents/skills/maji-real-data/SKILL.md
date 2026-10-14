---
name: maji-real-data
description: Replace placeholder or invented data with real, sourced, dated data. Audit sources, pull (search, API, scraper, chat export, client file), verify every claim, strip PII, dedupe, enrich, then seed idempotently to local first with source_url + verified_at per row, and report what was and was not found. Use when building an app, demo, deck, poster or outreach list that must show real facts. Triggers: "use real data", "find it on the internet", "official sources only", "don't make up numbers", "scrape X into a directory", "import the client's spreadsheet", "turn this channel into a catalog". Malay: "cari dekat internet", "aku nak data sebenar", "jangan reka data".
metadata:
  tier: workflow
  category: data
  version: "1.0.0-lite"
---

# maji-real-data: Find, Scrape, Verify, Enrich, Seed

Turns "make it real" into a verified dataset (JSON, CSV or DB rows) where every row carries its source and date, seeded to local first, plus an honest found / not-found report.

---

## Step 0: your context

Read `me/profile.md` if it exists (Tools and credits, Folders). If `me/overrides/maji-real-data.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

**Use** when the output will be shown to people as fact: app content, demo catalogs, maps, decks, posters, outreach directories, client portals fed by the client's own files.

**Not** for synthetic test fixtures, data already verified this week, or production schema changes (that is a migration, not a seed). If a source's licence forbids scraping, ask for an export or an official API instead.

---

## Steps

1. **Scope.** Entity, fields, area, time window, consumer (app, deck, CSV), and how fresh it must be.
2. **Audit each source first.** Classify: clean fetch (REST, CSV, RSS, WordPress REST API, open-data portal) · bot-protected (WAF 403, anti-bot: needs a stealth fetcher) · login-gated (session or cookies) · client-rendered with no API.
3. **Pull, cheapest reliable path first.** Web search / fetch → hosted scraper actor (check balance and cap before the run) → self-hosted fallback: Scrapling (StealthyFetcher), Playwright with a saved `storageState`, Telethon for chat channels, OCR for text inside images, `openpyxl` in read-only mode for client spreadsheets.
4. **Verify every claim.** Open the source behind each fact and tag it `CONFIRMED` / `NOT_SUPPORTED` / `PII` / `DEAD_LINK`.
5. **Clean and enrich.** Normalize (phone, names, locality), dedupe on a stable natural key, enrich profiles, filter noise (generic search pulls in pro clubs, news and brand pages: filter by thresholds).
6. **PII guard.** Raw files stay local and gitignored.
7. **Preview, then seed.** `--dry-run` is the default and prints New / Existing / Skipped / Error.
8. **Report.** Counts per status, sources with dates, and an explicit "not found" list.

## Composes with

- **maji-mode**: Pre-Action Gate before any hosted write or destructive clean-up.
- **maji-scheduled-job**: keep the dataset fresh on a schedule, with alerts when a source goes quiet.
- **maji-video-transcribe**: when the source is video rather than text.
- **maji-debug**: when a scraper returns 0 or a seed fails.
- **maji-review**: review seed and import scripts before they run.
- **maji-ship**: when the seed must reach a hosted database, go through its gates.
- **maji-app-capture** · **maji-deadline-sprint**: both need realistic demo data; this skill supplies it.
- **maji-brand-pdf**: when the found / not-found report goes out as a PDF.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-real-data` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
