---
name: maji-meta-schedule
description: Schedule approved Instagram and Facebook feed posts, stories and reels through Meta Business Suite by driving the user's already logged-in browser with Playwright over CDP. Calendar becomes a queue, every first run of a post type is a dry run, the agent clicks Schedule (never Publish now), verifies each post in Planner and keeps a JSON ledger. Covers posts beyond the 29-day window, edits to scheduled posts, and a manual posting pack fallback. Use when someone says "schedule these posts", "queue this week on IG and FB", "put the batch into Business Suite", "change the caption on a scheduled post" or "what is still unscheduled?". Malay triggers: "jom schedule post minggu ni", "sambung FB", "tolong tukar caption post yang dah schedule". Not for designing posts (use maji-poster-batch).
metadata:
  tier: workflow
  category: content
  version: "1.0.0-lite"
---

# Meta Business Suite Scheduler

Move approved posts from a calendar into Meta Business Suite with the user at the keyboard for login and browser prompts. Final output: posts scheduled and verified in Planner, a ledger row per post, screenshot evidence.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-meta-schedule.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- **Use:** daily volume that is painful by hand (e.g. 2 feed + stories on IG and 2 FB posts a day), recurring campaigns, bulk edits to scheduled posts.
- **Not:** fully unattended overnight posting (in practice those runs mostly failed without the user present), pinning posts or editing link in bio (phone app only), posts more than 29 days out (queue them, see step 10), anything needing the account password.

## Steps

1. **Calendar as data.** Set cadence and fixed slots per channel (e.g.
2. **Login stays with the user.** The user logs into Meta once in a dedicated browser profile (Chrome, Brave, Edge) started with remote debugging on a fixed port.
3. **Access check script** before every run: logged in, correct business ID.
4. **Build the queue** with a plan script then `build-queue`, guarding em-dash, promo words and stale words.
5. **Dry run first.** `DRY=1` on one item with a screenshot before the first real Schedule of each type (feed, story, reel, profile edit).
6. **Wave script** (Playwright `connectOverCDP`): open the composer, upload media one file at a time and check order, paste caption and alt text, set date and time, untick the other platform in "Post to", write the ledger row as `UNVERIFIED`, then click **Schedule**.
7. **Do not touch the tab** while "Scheduling your post" is showing.
8. **Verify in Planner** , not the Scheduled list.
9. **Retry and report.** A redo-wave re-runs only failed rows.
10. **Beyond 29 days.** Put the item in `deferred.json` with `notBefore` = post time minus 29 days plus about 35 minutes.
11. **Morning reminder** (the only part that proved reliable unattended): check the next 7 days against the minimum cadence (e.g.
12. **Edits after scheduling.** Find the post by ledger key plus a unique caption fragment (36 chars, or 24, no emoji).

## Composes with

- `maji-poster-batch`: produces the approved PNGs, captions and calendar this skill schedules.
- `maji-mode`: scheduling is visible to others, so run the Pre-Action Gate before every real wave.
- `maji-scheduled-job`: install, guard, alert on and retire the deferred job and the morning reminder.
- `maji-debug`: when a wave or job fails, diagnose before re-running.
- `maji-review`: review wave and ledger scripts when they change.

*`maji-meta-schedule` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

