---
name: maji-vendor-block
description: Playbook for when a cloud vendor blocks you instead of your code breaking. Tell billing or quota failures (paused database, API or scraping spend cap, host refusing deploys, CI minutes exhausted) apart from real bugs, check bills and caps first, pick the cheapest fallback (local stack, free-tier Postgres, temporary Postgres, self-hosted tool), cut over behind a dormant flag, backfill every table the app reads, verify, stop the old compute, then trim cost with caps, cadence and kill switches. Use when the app suddenly shows 'Failed to fetch', pages hang on loading, a scrape returns 0 results, deploys return 403, or CI jobs fail in 2 seconds. Triggers include 'database paused', 'quota exceeded', 'out of credits', 'find a free alternative', 'move off this host', 'cut cloud costs', 'kenapa data hilang', 'bil tak bayar', 'cari alternatif free'.
metadata:
  tier: workflow
  category: ship
  version: "1.0.0-lite"
---

# maji-vendor-block: When a Vendor Blocks You

Keep the app running when a provider pauses, caps or blocks you, without losing data and without a temporary fallback silently becoming permanent. Output: working fallback (or restored original) with every table backfilled and verified, restore notes, a return date, and cost guards.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Tools and credits). If `me/overrides/maji-vendor-block.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

**Use:** sudden failures that smell like billing (see step 1) · a planned move off a provider for cost, reliability or architecture · spend creeping up and needing caps.

**Not:** the error reproduces against a healthy service (use `maji-debug`) · a normal release (use `maji-ship`).

## Steps

1. **Name the symptom.** Billing failures look like code bugs.
2. **Check bills and caps before touching code.** Provider dashboard status, balance API, your own budget gate (per-key or per-actor), usage pages.
3. **Pick the cheapest fallback that keeps work moving,** and set a return-to-original date now.
4. **Stand up the target by script, not by hand.** Keep the script in the repo.
5. **Wire the switch dormant.** New DSN or engine behind env flags that default OFF; a compatibility shim for old callers if the API surface changes.
6. **Backfill EVERY table the app reads, not just the big one.** List tables from queries and models, tables the app creates at runtime, and tables downstream consumers read (other services via mirror or FDW).
7. **Verify.** Health endpoint reports DB ok; per-table row counts match the source; protected endpoints return 401, not 500; the UI shows real data; scans return real results (not 0, not fabricated).
8. **Guard the env swap.** Gitignore every env variant (`.env.*.cloud`, `.env.local.*`) BEFORE creating it.
9. **Stop the old compute for real.** Machines, containers, local stacks (`supabase stop`, `brew services stop`).
10. **Trim cost so it does not recur.** Rolling 30-day cap per key or actor with a budget gate checked before each call; kill switch for the most expensive sources; stretch cadence by tier; audit table sizes and prune data; right-size VMs and DB compute (never below OOM); budget watchdog alerts at 80% and 95%; prefer reliable providers over free caps for critical paths; confirm data freshness still holds.
11. **Restore or decide on the return date.** Original back: repoint DSN, backfill the delta, verify, stop the fallback.

## Composes with

- `maji-debug` once billing is ruled out.
- `maji-ship` to deploy the cutover and verify live.
- `maji-repo-hygiene` if a secret leaked during the env swap, or for cost-driven dead code removal.
- `maji-scheduled-job` for the mirror sync, health probe and budget watchdog jobs.
- `maji-mode`: Pre-Action Gate before stopping old compute or deleting data.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-vendor-block` is part of MAJI Skills · By MAJI · No Codes, Only Vibes.*
