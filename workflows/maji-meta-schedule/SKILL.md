---
name: maji-meta-schedule
description: Schedule approved Instagram and Facebook feed posts, stories and reels through Meta Business Suite by driving the user's already logged-in browser with Playwright over CDP. Calendar becomes a queue, every first run of a post type is a dry run, the agent clicks Schedule (never Publish now), verifies each post in Planner and keeps a JSON ledger. Covers posts beyond the 29-day window, edits to scheduled posts, and a manual posting pack fallback. Use when someone says "schedule these posts", "queue this week on IG and FB", "put the batch into Business Suite", "change the caption on a scheduled post" or "what is still unscheduled?". Malay triggers: "jom schedule post minggu ni", "sambung FB", "tolong tukar caption post yang dah schedule". Not for designing posts (use maji-poster-batch).
---

# Meta Business Suite Scheduler

Move approved posts from a calendar into Meta Business Suite with the user at the keyboard for login and browser prompts. Final output: posts scheduled and verified in Planner, a ledger row per post, screenshot evidence.

## When to use / when not

- **Use:** daily volume that is painful by hand (e.g. 2 feed + stories on IG and 2 FB posts a day), recurring campaigns, bulk edits to scheduled posts.
- **Not:** fully unattended overnight posting (in practice those runs mostly failed without the user present), pinning posts or editing link in bio (phone app only), posts more than 29 days out (queue them, see step 10), anything needing the account password.

## Steps

1. **Calendar as data.** Set cadence and fixed slots per channel (e.g. feed midday + evening, recap story, companion story, weekly reel). Reserve festival slots. Cross-channel rules: second channel at least 3 days after the first, reruns only after 30+ days. Keep a bench of approved spare posts for gaps. Generate `posts.json`.
2. **Login stays with the user.** The user logs into Meta once in a dedicated browser profile (Chrome, Brave, Edge) started with remote debugging on a fixed port. The agent never asks to re-login and never touches passwords.
3. **Access check script** before every run: logged in, correct business ID. Exit with distinct codes (e.g. 3 = logged out, 4 = wrong business) so callers can stop early.
4. **Build the queue** with a plan script then `build-queue`, guarding em-dash, promo words and stale words. Hold items whose image is not ready; held items only release after re-running plan + queue.
5. **Dry run first.** `DRY=1` on one item with a screenshot before the first real Schedule of each type (feed, story, reel, profile edit).
6. **Wave script** (Playwright `connectOverCDP`): open the composer, upload media one file at a time and check order, paste caption and alt text, set date and time, untick the other platform in "Post to", write the ledger row as `UNVERIFIED`, then click **Schedule**. Never click Publish now or Share now.
7. **Do not touch the tab** while "Scheduling your post" is showing. Close spare tabs between runs.
8. **Verify in Planner**, not the Scheduled list. Load Planner with the browser timezone emulated to Pacific. Flip each ledger row to `verified`.
9. **Retry and report.** A redo-wave re-runs only failed rows. Status questions are answered from the ledger, not from memory.
10. **Beyond 29 days.** Put the item in `deferred.json` with `notBefore` = post time minus 29 days plus about 35 minutes. A scheduled job (launchd, cron, Task Scheduler) runs only while the screen is unlocked: access check, lock against manual runs, desktop notification "click Allow in the browser", redo-wave, ledger update, max 3 attempts per entry. Unload the job when the queue is empty.
11. **Morning reminder** (the only part that proved reliable unattended): check the next 7 days against the minimum cadence (e.g. 2 feed + 1 story, FB 2 a day) and notify the user to start a run.
12. **Edits after scheduling.** Find the post by ledger key plus a unique caption fragment (36 chars, or 24, no emoji). `DRY=1` first. Use the matching flow: edit caption, replace media, shift date, delete. Stories cannot be edited or re-dated: delete and schedule again. Verify by reopening Edit Post. Log to `edited.json`, `replaced.json`, `deleted.json`.

Ledger row shape (one per post, written before the Schedule click):

```json
{ "uniqueKey": "2026-11-03-feed-a", "type": "feed", "channels": ["ig"],
  "at": "2026-11-03T12:30:00+08:00", "files": ["p041.png"],
  "captionHead": "First 36 chars of the caption", "status": "UNVERIFIED",
  "notBefore": null, "attempts": 0 }
```

## Variants

- **Second-channel wave (FB only):** separate calendar and queue, a `fb_enabled` kill switch, dry run, untick IG in "Post to".
- **Profile setup or rebrand:** browser script with dry run for bio (max 150 chars), name, cover, profile image; save and screenshot. Anything that asks for a password the user types.
- **Multi-frame story:** one key with several files; each frame becomes its own story item.
- **Triptych:** schedule tile 3, then 2, then 1, five minutes apart; the user pins them in the app.
- **Manual posting pack (fallback):** an HTML page with local post time, "schedule from" date (29 days before), Download image and Copy caption buttons, and a Scheduled tick saved in the browser. Fill placeholders (name, handle) before handing it over. Becomes stale once automation takes over.
- **Graph API route:** possible (API app, tunnel, polling job), but the source workflow pivoted to the native composer and left the API path inactive.

## Pitfalls

| Failure | Guard |
|---|---|
| Browser asks to Allow every CDP connection, 180 s timeout; 403 after many tries | Dedicated profile per account on a fixed port; run waves while the user is present; nightly jobs failed on the nights nobody clicked |
| Tabs frozen by the browser's memory saver hang the attach | Run a wake-tabs step before attaching, or exclude the site from memory saver |
| Piled-up tabs hang CDP; high machine load or a locked screen causes timeouts | Close tabs each run; run waves when the machine is idle and unlocked |
| Navigating the tab while "Scheduling your post" shows loses the post | Wait for the composer to close before any navigation |
| Schedule button greys out outside 20 minutes to 29 days ahead (docs may say 75 days) | Defer queue with `notBefore` |
| Planner fetches by Pacific time, so users far ahead of it miss some day cards (Sunday not drawn before ~15:00 at UTC+8) | Emulate Pacific timezone when verifying |
| Held items (image missing, banned word in the art) leave holes in the calendar | Fill from the bench or a rerun; re-run plan + queue to release fixed items |
| Scheduled list shows "Something went wrong" and lazy-loads | Verify in Planner only |
| Carousel order follows upload completion, not selection | Upload one by one and check order |
| "Post to" defaults to FB + IG | Untick explicitly; kill switch per channel; dry run |
| Story composer defaults to Share now; edit dialogs show Publish now | Hard-code the Schedule path; never target Publish buttons |
| Caption ending in a hashtag opens a suggestion menu; search fails on emoji | Dismiss the menu before continuing; search with emoji-free fragments |
| Two captions with the same opening make search hit the wrong post | Unique opening per caption plus a ledger key |
| After two deletes Planner treats a click as "create post"; thumbnails stale after media swap | Reload Planner between deletes; verify by reopening Edit Post |
| Scheduled stories cannot be edited; some get stuck in Planner | Delete and recreate; report stuck ones to the user |
| A job removed its own entries after a new ledger column broke an end-of-line `grep` | Parse ledgers as JSON, never grep columns |
| Dedicated profile logged out, so the job opens the browser every 30 min for nothing | Access check exit codes stop the run and alert |
| Job kept running after the batch ended | Auto unload when the queue is empty |
| Name changes: IG limits to once per 14 days, Page name asks for password; Page settings sit in an iframe that reloads after every Edit | Plan names once; hand password steps to the user; re-locate fields after each save |
| Nightly job failed two nights running and nobody knew until the morning check | Recommended: alert on `UNVERIFIED` rows older than 1 hour, a 7-day gap, or job exit != 0; rotate job logs |

## Done when

- [ ] Every queued item is in the ledger as `verified` with a Planner check
- [ ] No Publish now / Share now was clicked
- [ ] Each post type had a dry run with a screenshot before its first real Schedule
- [ ] Items past 29 days sit in the deferred queue with `notBefore`, and the job or reminder is loaded
- [ ] Next 7 days meet the minimum cadence, or the gap is reported to the user
- [ ] Spare tabs closed; jobs with an empty queue unloaded

## Composes with

- `maji-poster-batch`: produces the approved PNGs, captions and calendar this skill schedules.
- `maji-mode`: scheduling is visible to others, so run the Pre-Action Gate before every real wave.
- `maji-scheduled-job`: install, guard, alert on and retire the deferred job and the morning reminder.
- `maji-debug`: when a wave or job fails, diagnose before re-running.
- `maji-review`: review wave and ledger scripts when they change.

*`maji-meta-schedule` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
