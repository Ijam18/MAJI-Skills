---
name: maji-scheduled-job
description: Install a recurring job that cannot fail silently, and sweep what piles up. Pick a runner (launchd, cron, Vercel cron, GitHub Actions, scheduled cloud machine, pg_cron), register it, add preflight checks, lock, retries and alerts, ship a pruner in the same change, then verify real output. Also covers diagnosing "it keeps failing" and the safe sweep ritual: read-only audit, keep/stop/remove by bucket, move-only, manifest, retire with a re-enable note. Triggers: "set up a cron job", "keep this always up to date", "the job keeps failing", "my machine is slow, what can I close", "clean up my files". Malay: "set cron job", "banyak kali failed la", "kemaskan fail".
metadata:
  tier: workflow
  category: ship
  version: "1.0.0"
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

**A. Install**

1. **Write the job script** (sh / py / mjs). Idempotent, supports `--dry-run`, exits non-zero on any failure, including partial failure (one source skipped counts as failed).
2. **Pick the runner.**
   - Local (launchd LaunchAgent on macOS, cron or systemd timer on Linux) only when it truly needs your machine: a browser session or local files. It runs only while the machine is on, often only while unlocked, and needs the right OS permissions.
   - Cloud for anything that must be reliable: Vercel cron (route `/api/cron/<job>`), GitHub Actions `schedule`, a scheduled cloud machine (supercronic), `pg_cron` for DB-side work such as refreshing materialized views or retention.
3. **Register.**
   - launchd: plist with `StartCalendarInterval` or `StartInterval`, `StandardOutPath` / `StandardErrorPath`, absolute paths; `plutil -lint`; `launchctl bootstrap gui/$(id -u) <plist>`; `launchctl kickstart` once to test.
   - crontab: absolute paths for every binary and script.
   - Cloud cron: auth **fail-closed** (reject when the secret env var is empty, not just when it mismatches); set max duration; add the route to an auth test matrix.
4. **Preflight inside the job.** Secrets present, login session valid, correct account, permissions granted. Fail loudly on the first missing one.
5. **Guards.** Lock file so a manual run and a scheduled run never clash; max attempts per item; timeout; stale-PID detection; an end date or self-exit for batch jobs.
6. **Alert.** Desktop notification (`osascript`) and a chat bot (Telegram Bot API) on: failure, a gap in upcoming work, session expiry, data older than its freshness threshold. Alert on state transitions (UP to DOWN), not every tick. Prefer one watcher that reads every job's log and exit code over one watcher per job.
7. **Pruner in the same change.** Log rotation by size, retention for every table the job grows, move-only + manifest for file jobs. A generator without a pruner is not done.
8. **Registry.** One file listing label, runner, schedule, owner, status and how to re-enable.
9. **Verify.** Trigger manually, read the log and exit code, confirm the output actually landed (rows, posts, files), then watch the first two scheduled runs.

**B. Diagnose** ("failed many times", "data not latest", "machine is slow")

Read the log and exit code first, then `launchctl list | grep <label>`, `crontab -l`, `docker ps`, `top -l 1`, `sysctl vm.swapusage`, `lsof -iTCP -sTCP:LISTEN`. Usual causes: secret not set, session expired, missing OS permission, a prompt waiting for a click, machine locked or overloaded, an upstream tool that changed.

**C. Sweep and retire**

Read-only audit → propose keep / stop / remove by bucket → ask per bucket → move-only (`mv -n`) or stop (`launchctl bootout`, `supabase stop`, `brew services stop`, `docker stop`) → plist to a `retired/` folder, crontab backed up → manifest or rollback log → note how to re-enable. Before retiring a queue job, list what is still pending in it.

---

## Variants

- **Deferred publishing:** items beyond a platform's scheduling window wait in a queue with `notBefore`; job every 30 min; morning reminder when the next 7 days have gaps.
- **Hourly scrape to keep a feed fresh:** count results per source per run; a skipped source is an alert.
- **Cloud data refresh:** many cron routes plus `pg_cron`; when the bill climbs, lower frequency and split fast / slow tiers.
- **Ops watchdog:** quick and deep uptime checks, data freshness, weekly audit, budget alerts at 80% / 95%.
- **Daily invariants audit:** CRITICAL exits non-zero and alerts; fix through migrations, not manual edits.
- **Event-window job:** a high-frequency summary behind an env flag, switched on only for the event window and off after.
- **Auto-commit while an agent session is active:** hooks refresh a marker (Claude Code: SessionStart and Stop hooks. Other agents: refresh the marker by hand at session start); skip when only generated files changed; self-exit when the marker is stale.
- **Monthly file tidy:** move-only by extension, archive old screenshots, manifest, `--dry-run` first.
- **Cloud drive or design tool clean-up:** no bulk or delete API, so move clutter into a "scratch (safe to delete)" folder and let the owner delete once; when a design hits its page limit, start a second one with a page index and re-read the index before editing by page id.

---

## Pitfalls

| Failure seen in real runs | Guard |
|---|---|
| Unattended run waits for a browser "Allow" click and times out every night | Dedicated browser profile with a persistent session; preflight fails fast |
| Tidy job hit "Operation not permitted", processed 0 files, no alert | Grant the runner the OS permission; treat 0 processed as failure |
| Job "ran" but only one of four sources worked for weeks (missing session file) | Per-source counts; alert on any skip |
| Cloud cron failed 178 times because a secret was never set | Preflight secret check plus alert on the first failure |
| Logs and tables grew without bound | Rotation and retention shipped with the job |
| Paused job never resumed; crontab empty when a job should run | Registry with status, reviewed when touching any job |
| Queue job retired with posts still pending | List pending items before `bootout` |
| Job broke itself after a column was added to its state file (line-based grep) | Parse structured fields (e.g. `jq 'has(...)'`), not line positions |
| Frozen browser tabs (memory saver) make automation attach hang | Wake or reload tabs before attaching |
| Batch job left loaded after the batch ended | End date or self-exit |
| Cron auth open when the secret is empty | Fail-closed check + test |
| Bot polling returns 409 while a webhook is active on the same bot | One mode per bot token |
| Uptime monitor saw HTTP 200 while data was frozen for 43 hours | Freshness check, not only up/down |
| Old local job still writing to prod after moving to cloud | Retire the old runner during cutover |
| State kept in `/tmp` lost on every deploy | Persist state in DB or a volume |
| Containers with restart policy come back; `kill $PIDS` silently failed in zsh | Stop through the tool (`supabase stop`); use `xargs` |
| Swap stays high after clean-up | Reboot is the only fix; say so |
| Agent or editor sessions in closed windows keep running (GBs of RAM, full CPU) and restart dev servers and DB stacks | Stop the orphan host process first, then the services it spawned |
| Frequent cron keeps the hosted DB from idling; bill climbs | Lower frequency, split fast / slow tiers |
| Sensitive files (env, legal, personal folders) swept along in a bulk move | Exclude them from the tidy; audit sharing permissions on cloud drives |
| Drive API moves one file per call; Empty Trash cannot be undone; shared files are not yours | Chunk moves, ask before emptying, skip non-owned files |

---

## Done when

- [ ] Job exits non-zero on full or partial failure, and an alert actually fired in a test
- [ ] Preflight covers secrets, session and permissions
- [ ] Lock, retry limit and timeout in place
- [ ] Pruner (rotation / retention / manifest) shipped in the same change
- [ ] Registry entry written, including how to re-enable
- [ ] Manual trigger plus first two scheduled runs produced real output

---

## Composes with

- **maji-mode**: Pre-Action Gate before stopping processes, retiring jobs or emptying trash.
- **maji-real-data**: the scrape or import a job keeps fresh.
- **maji-video-transcribe**: schedule only once it runs headless.
- **maji-debug**: when the job keeps failing and the log is not enough.
- **maji-commit**: commit the job, plist and registry together.
- **maji-meta-schedule**: the deferred-publishing job that runs it nightly.
- **maji-ship**: cloud cron routes ship through the same gates as any other code.

---

*`maji-scheduled-job` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
