---
name: maji-poster-batch
description: Produce a batch of on-brand social media posters (feed 4:5, story 9:16) end to end. Lock brand and campaign first, generate AI people photos one at a time with a face reference and QA them, render text and logo overlays locally, write captions through writer, editor and skeptical checker, lint everything, collect pages in one review design, and export only after explicit approval. Use when someone says "make a poster batch", "8 posts for this week", "Instagram posters for the campaign", "festival post", "IG grid triptych", "story from this feed post" or "set up our brand kit for social". Malay triggers: "buat batch poster", "jom bincang campaign bulan ni", "poster raya untuk IG". Not for scheduling (use maji-meta-schedule) or video.
metadata:
  tier: workflow
  category: content
  version: "1.0.0"
---

# Poster Batch Studio

Turn a locked brand and campaign into approved, export-ready posters plus captions. Final output: PNG per post (1080x1350 feed, 1080x1920 story), approved caption file, contact sheet, review pages in the design tool, calendar entries.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-poster-batch.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- **Use:** recurring content batches (about 8 posts per batch), festival or holiday posts, IG grid triptychs, stories reframed from feed posts, repurposing posts to a second channel, building a brand kit for a new account.
- **Not:** a single one-off poster (design it by hand), video or motion (some design-tool connectors reject MP4/MOV), print PDFs, or putting posts on the schedule (hand approved exports to `maji-meta-schedule`).

## Steps

1. **Connect the design tool.** Paste the design link, check the MCP list (Claude Code: `/mcp`. Other agents: the agent's own MCP settings screen). If the connector is missing, re-authenticate and reload the window; connectors load only at session start. Do not add a second local server for the same tool: it can shadow the hosted connector and may lack image generation. Read the design for its page index and brand kits.
2. **Lock house rules for the design tool** in a persistent rules or memory file: which design new pages go into (one review design per month works), stories in a separate design, a scratch design for exports.
3. **Lock art direction (discuss mode, no batch yet).** Gather style references and audit existing assets. Produce a few concepts, judge them (brand, business, production), run an adversarial critique. Make 1 to 2 sample posters. The user reacts: pivot fully or lock. Write `brand.json` (palette, fonts, logo footer, card style, CTA) plus don'ts (real IP, claims, rejected styles).
4. **Pick the campaign.** Research context (local news, holidays, monthly theme, product facts). Offer 3 strategy options, each with big idea, tagline, sample caption and art direction. User picks one.
5. **Write batch copy** (one batch = 8 posts). Fact-check every claim against a `facts.json` and a never-claim list. User approves copy before any art.
6. **Generate AI photos one at a time** (Canva MCP `generate-image`, or another image model; for an external model write an IP-safe prompt pack), portrait 4:5, respecting cooldown. Reference prep: approved source photos only, crop to the face, upload as reference media. Prompt rules: identity from the face reference only (not its clothes or background), clothing colors in words, pose, framing, empty space for text, "no text or logos". For crowds, describe each person's face shape, expression, body type and hair, mix ethnicities, and use a tight age band ("clearly 20 to 28").
   ```text
   Person matching the face reference (identity only, ignore its clothes and background).
   Wearing a [color] [garment], [pose], [framing], plain area at [top/bottom] for text.
   Natural light, photo-real, 4:5. No text, no logos, no real team colors.
   ```
7. **Export full size** (via a scratch design) to a local `photos/` folder, then **QA**: face sheet at 200% against the reference, same face twice in a group = hard fail, age, fingers and shoes, heads not cropped, no back-facing poses or odd artifacts, no text, logos or real team colors, clothing against swatch. Regenerate by changing only the failing clause; add any new rule to the rules file at once.
8. **Render overlays locally** (Python PIL at 2x, Node sharp, or HTML plus a Playwright screenshot): headline, subtle CTA, footer logo, safe areas, text at least 24px. Flatten to one PNG per post.
9. **Lint before review:** em-dash, prices, superlatives, unsupported claims, promo and stale words, repeated names; pixel-check that the logo is not clipped.
10. **Captions:** several writers (different angles), one editor, one skeptical checker. Auto-lint: hook under 110 chars, body under 700, 2 to 3 hashtags, one link, unique opening line (the first ~36 chars must differ between posts so later search finds the right one). Language and register follow the channel.
11. **Assemble the review.** Upload PNGs (`create-upload-url` then POST the bytes, keep each media ID), add pages to the review design, reset crop to 0/0 after every fill, merge, build a contact sheet. Text review goes on a private review page; the user cannot see your scratch files.
12. **Approval gate.** Only on an explicit "approve" / "yes commit": commit the edit, export PNGs to `assets/exports/`, add each post to the calendar (feed, story, festival, triptych slots). Confirming a merge is not approval to schedule: ask separately.
13. **Housekeeping.** Name scratch designs "(can delete)" and move them to a scratch folder for the user to bulk delete; move retired batches to an archive design; open a new design before 100 pages; re-read the page index before edits and target pages by page ID, not page number.

## Variants

- **Monthly template engine:** rows in a month file (templates such as quiz, chat POV, tips, this-or-that, hot take, list), a month lint (names, facts, repeats), flat render, one weekly review, a bench of approved spare posts to fill gaps.
- **Festival posts:** list upcoming festivals, user picks, design about 2 weeks ahead, have a native speaker check any language you are not fluent in, reserve the slot; dates past the scheduler window go to a deferred queue.
- **Triptych:** make your own version of any example (do not copy it), render one master strip (about 3105x1350), compute grid math (profile grid crops 3:4 out of 4:5, plan seam overlap), cut 3 tiles at 4:5 (uploading 3:4 triggers an auto-crop warning), schedule tiles 3, 2, 1 five minutes apart; pinning happens in the phone app only.
- **Story from feed:** reframe 4:5 into a 9:16 safe zone (keep content between y=250 and y=1580); types: recap, companion, "new post", "next up", education card, special.
- **Second-channel repurpose:** new strategy and captions in that channel's register, at least 3 days after the original, hold posters carrying banned words.
- **Brand kit:** start from the user's favorite design, extract tokens, build a brand guide page and a text-kit master; derive profile picture and cover (keep inside the cover safe area).
- **Real products:** white-balance shelf photos, match fabric swatches, cut out products before compositing.
- **Regulated niches (insurance, finance):** education-only copy, no promo or provider names, a word guard per language; keep the disclaimer in a pinned post and the page About instead of every caption.
- **Zero-budget growth plan:** channels plus UTM links and platform insights to measure; ideas that need product changes are parked, not merged into the product repo.

## Pitfalls

| Failure | Guard |
|---|---|
| Image generation cooldown (3 to 6 min); parallel calls fail on quota; upload URLs are rate-limited too | Queue one at a time; optionally run the queue overnight so photos are ready for morning review |
| Connector missing, or OAuth needs a human click (non-interactive sessions cannot); MCP config scoped to one project | User authenticates, reload, new session; re-add per project or use the account-level connector |
| Design edit transaction expires after about 1 hour | Commit after each change |
| Fill operations auto-zoom the image box and clip the footer logo | Reset crop to 0/0 after every fill; pixel-check logo; already scheduled posts need a media swap |
| Display fonts render 10 to 14% wider/lower in the design tool than in local Chromium | Flatten text into the PNG; use the design tool for review only |
| Design tool API cannot set font family or letter spacing | Keep editable text inside a text-kit master page, or flatten text locally |
| Long alt text with placeholder text makes the edit fail without applying | Keep alt text short and final; re-read the page after editing |
| Preview thumbnails are tiny (about 199px) | QA full size on a temporary page then cancel the edit, or QA the export |
| Each merge is one call and needs user confirmation | Plan merges up front and tell the user how many confirms are coming |
| No delete API, 100-page cap, no MP4/MOV; editing by page number hits the wrong page after pages move | Scratch folder, archive design, second design with its own page index; target page IDs |
| Same face in group shots; a "20 to 35" brief lets mid-30s faces through | Hard-fail duplicates even after scheduling; tighten the age band; check each face crop |
| Mixing references of two different people gives a wrong face | One reference per identity |
| Real team names, crests or colors slip into samples | Deny-list of real names, fresh-name generator, `names-used.json` with a 30-day no-repeat rule |
| Copy in the local language comes out stiff or try-hard; claims exceed product facts | Writer/editor/checker loop with register examples; every claim traced to `facts.json` |
| Promo-word guard ran before exempt terms were stripped, so it flagged valid captions | Strip exempt terms first, then run the promo check |
| Full style pivots throw away finished batches | Lock direction on 1 to 2 samples before the full batch; retire old assets explicitly |
| Generic font pairs (condensed display + mono) read as "AI made" | Choose fonts during the brand lock, not after |
| Memes overused | Max 1 per post, on roughly 60% of posts, never covering text |
| Poster reads like the wrong genre (e.g. a match result) | Put the purpose of the account in every brief |
| Image rules change mid-campaign | Update prompts and the QA checklist together |

## Done when

- [ ] `brand.json`, don'ts and house rules saved where the next session will read them
- [ ] Every photo passed face, age, pose and IP QA
- [ ] Every PNG passed copy lint and the logo pixel check
- [ ] Captions passed writer, editor, checker and auto-lint
- [ ] User said "approve" in this session for this batch
- [ ] PNGs exported, calendar slots filled, scratch designs moved to the scratch folder

## Composes with

- `maji-mode`: discuss mode for direction and campaign; the Pre-Action Gate before merges and exports.
- `maji-meta-schedule`: schedules the approved exports and captions.
- `maji-app-capture`: supplies real product screenshots for app posters.
- `maji-review`: review the render and lint scripts when they change.

*`maji-poster-batch` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
