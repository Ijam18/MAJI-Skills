---
name: maji-real-data
description: Replace placeholder or invented data with real, sourced, dated data. Audit sources, pull (search, API, scraper, chat export, client file), verify every claim, strip PII, dedupe, enrich, then seed idempotently to local first with source_url + verified_at per row, and report what was and was not found. Use when building an app, demo, deck, poster or outreach list that must show real facts. Triggers: "use real data", "find it on the internet", "official sources only", "don't make up numbers", "scrape X into a directory", "import the client's spreadsheet", "turn this channel into a catalog". Malay: "cari dekat internet", "aku nak data sebenar", "jangan reka data".
---

# maji-real-data: Find, Scrape, Verify, Enrich, Seed

Turns "make it real" into a verified dataset (JSON, CSV or DB rows) where every row carries its source and date, seeded to local first, plus an honest found / not-found report.

---

## When to use / when not

**Use** when the output will be shown to people as fact: app content, demo catalogs, maps, decks, posters, outreach directories, client portals fed by the client's own files.

**Not** for synthetic test fixtures, data already verified this week, or production schema changes (that is a migration, not a seed). If a source's licence forbids scraping, ask for an export or an official API instead.

---

## Steps

1. **Scope.** Entity, fields, area, time window, consumer (app, deck, CSV), and how fresh it must be. Add `source_url`, `verified_at` and `licence` to the field list before writing any code.
2. **Audit each source first.** Classify: clean fetch (REST, CSV, RSS, WordPress REST API, open-data portal) · bot-protected (WAF 403, anti-bot: needs a stealth fetcher) · login-gated (session or cookies) · client-rendered with no API. Note licence, attribution rule and rate limit for each.
3. **Pull, cheapest reliable path first.** Web search / fetch → hosted scraper actor (check balance and cap before the run) → self-hosted fallback: Scrapling (StealthyFetcher), Playwright with a saved `storageState`, Telethon for chat channels, OCR for text inside images, `openpyxl` in read-only mode for client spreadsheets. Cache raw responses and make the scraper resumable from a checkpoint.
4. **Verify every claim.** Open the source behind each fact and tag it `CONFIRMED` / `NOT_SUPPORTED` / `PII` / `DEAD_LINK`. Keep only `CONFIRMED`. For big sets, fan out one agent per batch and spot-check a sample yourself.
5. **Clean and enrich.** Normalize (phone, names, locality), dedupe on a stable natural key, enrich profiles, filter noise (generic search pulls in pro clubs, news and brand pages: filter by thresholds). Re-express outside content in your own words; store facts, not copied marketing text or rehosted images.
6. **PII guard.** Raw files stay local and gitignored. Docs and memory describe the schema, never rows. Verify with aggregates only (count, coverage), never by echoing rows. Demographics become counts. Do not store ID numbers you do not need. Check row-level security / role gates before any hosted write.
7. **Preview, then seed.** `--dry-run` is the default and prints New / Existing / Skipped / Error. Writes are idempotent (upsert on a unique key, or delete-by-batch-id then insert). Local DB first; hosted only on an explicit decision, behind an env guard that refuses prod unless a flag is passed. Or deliver CSV / JSON / a short report.
8. **Report.** Counts per status, sources with dates, and an explicit "not found" list. Never fill a gap with an invented number; mark unverified rows `Provisional` or leave them out.

---

## Variants

- **Research for content** (deck, poster, plan): steps 1, 3, 4, 5, 8. Output a source table, no seed.
- **Outreach directory from social platforms:** hosted actor or a search API, dedupe, CSV; add a scheduled refresh if it must stay current.
- **Open data for a demo catalog:** REST / open-data portal into JSON in the repo, flagged `Provisional`. If the site is client-rendered with no API, keep a hand-curated seed and use the scraper only for enrichment.
- **Chat channel to catalog or news feed:** export new messages since the last checkpoint, classify posts, group albums by group id, OCR product codes from images, split collage images, upload media + rows idempotently (skip existing). A scheduled sync should only stage drafts; a person fact-checks each entry against the original post before it publishes.
- **Old drive folders or legacy site to a new site:** import scripts emit manifests and entries; optimize images before they touch git.
- **Client spreadsheet / CSV into a DB:** read-only parse, preview, idempotent import, aggregate verify, row-level security.
- **Geo + demographics:** extract boundary GeoJSON, amenities from OSM Overpass (with attribution), demographics aggregated to counts only.
- **Contact worklist in a shared spreadsheet:** normalize + dedupe, one tab per area, a separate `__test` tab for write tests.

---

## Pitfalls

| Failure seen in real runs | Guard |
|---|---|
| Hosted scraper over cap or suspended; actor silently returns 0 rows | Check balance first; treat 0 rows as failure, not success |
| Discovery hidden behind login; your own cookies risk an account ban | Prefer official or search APIs; tell the user logged-out crawling is weak |
| Invented or stale facts (unsourced figures, late results shown as current, rescheduled events) | Every row has `source_url` + `verified_at`; re-verify time-sensitive rows right before deploy |
| Most channel posts have no caption (around 4%), collages hide items, parser drops caption-less albums | Infer category from group id and neighbouring messages; split collages; never drop media silently |
| Script hits prod by mistake; minors' data in a live DB with wrong row-level security = breach | Local-only default, explicit flag for hosted, policy check before import |
| Cookies, API keys or DB passwords pasted into chat or plaintext key files | OS keychain or gitignored env file; rotate anything that leaked |
| Import crashes on re-run (unique key), duplicates around 50% | Upsert on natural key; dedupe count is part of verify |
| Third-party IDs or numbering differ from the official source | Join on official code or name, label by name |
| WAF 403, anti-bot, client-only rendering; portal rate limit of a few requests per minute | Stealth fetcher or hand-curated seed; server-side cache |
| Licence traps: restricted boundary datasets, OSM attribution, CC-BY-SA credit, image rehosting | Record licence per source at step 2; show credit where required |
| Destructive clean-up in the wrong order lost linked replies | Link or derive first, delete last |
| Image rename or format conversion between deploy and reseed broke dozens of URLs | Verify every referenced asset exists after conversion |
| Raw image exports bloated the repo to hundreds of MB | Compress first; originals stay out of git |
| Too few free-licence images; blurry or over-zoomed images get rejected | Free-licence sources first (e.g. Wikimedia Commons), map aerial tiles as fallback; check sharpness before use |
| Two parallel data models for the same list caused double counting | One source of truth |
| Spreadsheet answer labels not mapped (variant spellings lost every "yes"); `COUNTIFS` inside `ARRAYFORMULA` gives `#VALUE!`; a write test erased live entries | Map vocabulary explicitly; use `BYROW` + `LAMBDA`; test on a scratch tab |
| Scraper borrowing another project's virtualenv | Give the scraper its own environment |

---

## Done when

- [ ] Every row has `source_url`, `verified_at` and licence noted
- [ ] Nothing below `CONFIRMED` remains (or it is marked `Provisional`)
- [ ] No PII in git, docs, logs or chat output; verification shown as aggregates
- [ ] Seed is idempotent: a second run reports 0 new, 0 errors
- [ ] Written to local first; hosted write only if explicitly approved
- [ ] Report lists found, not found, and sources with dates

---

## Composes with

- **maji-mode**: Pre-Action Gate before any hosted write or destructive clean-up.
- **maji-scheduled-job**: keep the dataset fresh on a schedule, with alerts when a source goes quiet.
- **maji-video-transcribe**: when the source is video rather than text.
- **maji-debug**: when a scraper returns 0 or a seed fails.
- **maji-review**: review seed and import scripts before they run.
- **maji-ship**: when the seed must reach a hosted database, go through its gates.
- **maji-app-capture** · **maji-deadline-sprint**: both need realistic demo data; this skill supplies it.
- **maji-brand-pdf**: when the found / not-found report goes out as a PDF.

---

*`maji-real-data` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
