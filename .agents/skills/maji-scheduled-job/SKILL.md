---
name: maji-scheduled-job
description: Install a recurring job that cannot fail silently, and sweep what piles up. Pick a runner (launchd, cron, Vercel cron, GitHub Actions, scheduled cloud machine, pg_cron), register it, add preflight checks, lock, retries and alerts, ship a pruner in the same change, then verify real output. Also covers diagnosing "it keeps failing" and the safe sweep ritual (read-only audit, keep/stop/remove by bucket, move-only, manifest, retire with a re-enable note). Triggers include "set up a cron job", "keep this always up to date", "the job keeps failing", "my machine is slow, what can I close", "clean up my files", "audit log for this job", "tamper-evident log of what the agent did".
metadata:
  tier: workflow
  category: ship
  version: "1.0.0-lite"
---

# maji-scheduled-job: Scheduled Job + Housekeeping

Ships a recurring job as one unit (runner + schedule + guard + alert + pruner + retire path), and gives a safe ritual for sweeping files, processes and cloud clutter.

---

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Tools and credits). If `me/overrides/maji-scheduled-job.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

**Use** for anything that must run repeatedly without you remembering: scrapes, data refresh, deferred publishing, audits, watchdogs, monthly tidy. Also when a job "keeps failing" or the machine is heavy.

**Not** for a one-off task (just run it), or for a job whose only failure signal would be a log nobody reads: add the alert or do not ship it.

---

## Steps

1. **Write the job script** (sh / py / mjs).
2. **Pick the runner.**
3. **Register.**
4. **Preflight inside the job.** Secrets present, login session valid, correct account, permissions granted.
5. **Guards.** Lock file so a manual run and a scheduled run never clash; max attempts per item; timeout; stale-PID detection; an end date or self-exit for batch jobs.
6. **Alert.** Desktop notification (`osascript`) and a chat bot (Telegram Bot API) on: failure, a gap in upcoming work, session expiry, data older than its freshness threshold.
7. **Pruner in the same change.** Log rotation by size, retention for every table the job grows, move-only + manifest for file jobs.
8. **Registry.** One file listing label, runner, schedule, owner, status and how to re-enable.
9. **Verify.** Trigger manually, read the log and exit code, confirm the output actually landed (rows, posts, files), then watch the first two scheduled runs.

## Composes with

- **maji-mode**: Pre-Action Gate before stopping processes, retiring jobs or emptying trash.
- **maji-real-data**: the scrape or import a job keeps fresh.
- **maji-video-transcribe**: schedule only once it runs headless.
- **maji-debug**: when the job keeps failing and the log is not enough.
- **maji-commit**: commit the job, plist and registry together.
- **maji-meta-schedule**: the deferred-publishing job that runs it nightly.
- **maji-ship**: cloud cron routes ship through the same gates as any other code.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-scheduled-job` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
