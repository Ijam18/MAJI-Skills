---
name: maji-poster-batch
description: Produce a batch of on-brand social media posters (feed 4:5, story 9:16) end to end. Lock brand and campaign first, generate AI people photos one at a time with a face reference and QA them, render text and logo overlays locally, write captions through writer, editor and skeptical checker, lint everything, collect pages in one review design, and export only after explicit approval. Use when someone says "make a poster batch", "8 posts for this week", "Instagram posters for the campaign", "festival post", "IG grid triptych", "story from this feed post" or "set up our brand kit for social". Malay triggers: "buat batch poster", "jom bincang campaign bulan ni", "poster raya untuk IG". Not for scheduling (use maji-meta-schedule) or video.
metadata:
  tier: workflow
  category: content
  version: "1.0.0-lite"
---

# Poster Batch Studio

Turn a locked brand and campaign into approved, export-ready posters plus captions. Final output: PNG per post (1080x1350 feed, 1080x1920 story), approved caption file, contact sheet, review pages in the design tool, calendar entries.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-poster-batch.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- **Use:** recurring content batches (about 8 posts per batch), festival or holiday posts, IG grid triptychs, stories reframed from feed posts, repurposing posts to a second channel, building a brand kit for a new account.
- **Not:** a single one-off poster (design it by hand), video or motion (some design-tool connectors reject MP4/MOV), print PDFs, or putting posts on the schedule (hand approved exports to `maji-meta-schedule`).

## Steps

1. **Connect the design tool.** Paste the design link, check the MCP list (Claude Code: `/mcp`.
2. **Lock house rules for the design tool** in a persistent rules or memory file: which design new pages go into (one review design per month works), stories in a separate design, a scratch design for exports.
3. **Lock art direction (discuss mode, no batch yet).** Gather style references and audit existing assets.
4. **Pick the campaign.** Research context (local news, holidays, monthly theme, product facts).
5. **Write batch copy** (one batch = 8 posts).
6. **Generate AI photos one at a time** (Canva MCP `generate-image`, or another image model; for an external model write an IP-safe prompt pack), portrait 4:5, respecting cooldown.
7. **Export full size** (via a scratch design) to a local `photos/` folder, then **QA**: face sheet at 200% against the reference, same face twice in a group = hard fail, age, fingers and shoes, heads not cropped, no back-facing poses or odd artifacts, no text, logos or real team colors, clothing against swatch.
8. **Render overlays locally** (Python PIL at 2x, Node sharp, or HTML plus a Playwright screenshot): headline, subtle CTA, footer logo, safe areas, text at least 24px.
9. **Lint before review:** em-dash, prices, superlatives, unsupported claims, promo and stale words, repeated names; pixel-check that the logo is not clipped.
10. **Captions:** several writers (different angles), one editor, one skeptical checker.
11. **Assemble the review.** Upload PNGs (`create-upload-url` then POST the bytes, keep each media ID), add pages to the review design, reset crop to 0/0 after every fill, merge, build a contact sheet.
12. **Approval gate.** Only on an explicit "approve" / "yes commit": commit the edit, export PNGs to `assets/exports/`, add each post to the calendar (feed, story, festival, triptych slots).
13. **Housekeeping.** Name scratch designs "(can delete)" and move them to a scratch folder for the user to bulk delete; move retired batches to an archive design; open a new design before 100 pages; re-read the page index before edits and target pages by page ID, not page number.

## Composes with

- `maji-mode`: discuss mode for direction and campaign; the Pre-Action Gate before merges and exports.
- `maji-meta-schedule`: schedules the approved exports and captions.
- `maji-app-capture`: supplies real product screenshots for app posters.
- `maji-review`: review the render and lint scripts when they change.

*`maji-poster-batch` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

