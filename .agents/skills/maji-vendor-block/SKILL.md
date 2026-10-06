---
name: maji-vendor-block
description: Playbook for when a cloud vendor blocks you instead of your code breaking. Tell billing or quota failures (paused database, API or scraping spend cap, host refusing deploys, CI minutes exhausted) apart from real bugs, check bills and caps first, pick the cheapest fallback (local stack, free-tier Postgres, temporary Postgres, self-hosted tool), cut over behind a dormant flag, backfill every table the app reads, verify, stop the old compute, then trim cost with caps, cadence and kill switches. Use when the app suddenly shows 'Failed to fetch', pages hang on loading, a scrape returns 0 results, deploys return 403, or CI jobs fail in 2 seconds. Triggers include 'database paused', 'quota exceeded', 'out of credits', 'find a free alternative', 'move off this host', 'cut cloud costs', 'kenapa data hilang', 'bil tak bayar', 'cari alternatif free'.
metadata:
  tier: workflow
  category: ship
  version: "1.0.0"
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

   | Symptom | Likely vendor cause |
   |---|---|
   | `Failed to fetch`, NXDOMAIN on the DB host | Hosted DB project paused |
   | Every page stuck on its loading state | Backing DB paused |
   | `ERR_CONNECTION_REFUSED` on a local DB port | Local container runtime or stack down |
   | Scrape returns 0 items, "free mode", "check credits" | Spend cap or balance reached |
   | Deploy returns 403 on create-release | Host account blocked |
   | CI job fails in about 2s, no runner logs | CI minutes or billing cap |
   | AI scorer returns 0 | Free-tier token cap |

2. **Check bills and caps before touching code.** Provider dashboard status, balance API, your own budget gate (per-key or per-actor), usage pages. Rule out the input too: share links and short links that redirect to a login page also return 0. Billing is the owner's call (pay, wait or fall back): ask.
3. **Pick the cheapest fallback that keeps work moving,** and set a return-to-original date now.
   - Local DB stack (e.g. `supabase start` on Docker, OrbStack or colima, analytics off), seeded or mirrored from prod.
   - Free-tier serverless Postgres (e.g. Neon) plus hobby hosting.
   - Small temporary Postgres on a VM host (e.g. Fly Postgres).
   - Self-hosted replacement for a paid API (yt-dlp, a Playwright scraper).
4. **Stand up the target by script, not by hand.** Keep the script in the repo. Size it for the backfill, not idle load (a 256MB Postgres crash-looped on a ~260k-row backfill; start at 512MB). Apply every migration (through a proxy or tunnel plus `psql` if needed). Fix provider quirks as new migrations: role grants for `SET ROLE` are not automatic on some hosts; RLS needs explicit grants; a runner that wraps all migrations in one transaction breaks `CREATE INDEX CONCURRENTLY`.
5. **Wire the switch dormant.** New DSN or engine behind env flags that default OFF; a compatibility shim for old callers if the API surface changes. Keep code DSN-agnostic so restore is a repoint. Respect hobby-tier limits (function max duration around 60s, image proxy size caps).
6. **Backfill EVERY table the app reads, not just the big one.** List tables from queries and models, tables the app creates at runtime, and tables downstream consumers read (other services via mirror or FDW). Recreate unique indexes, or upserts fail silently. Bulk insert, resumable. FDW across a tunnel too slow (16 rows took 7s): materialise a snapshot table instead.
7. **Verify.** Health endpoint reports DB ok; per-table row counts match the source; protected endpoints return 401, not 500; the UI shows real data; scans return real results (not 0, not fabricated).
8. **Guard the env swap.** Gitignore every env variant (`.env.*.cloud`, `.env.local.*`) BEFORE creating it. Back up the original env outside the repo and write restore steps in project notes. DB URLs with passwords never go in chat; if one did, rotate.
9. **Stop the old compute for real.** Machines, containers, local stacks (`supabase stop`, `brew services stop`). Provisioned disk does not auto-shrink: resize or delete it.
10. **Trim cost so it does not recur.** Rolling 30-day cap per key or actor with a budget gate checked before each call; kill switch for the most expensive sources; stretch cadence by tier; audit table sizes and prune data; right-size VMs and DB compute (never below OOM); budget watchdog alerts at 80% and 95%; prefer reliable providers over free caps for critical paths; confirm data freshness still holds. Hold infra resizes until an active outage is over. Review bills monthly.
11. **Restore or decide on the return date.** Original back: repoint DSN, backfill the delta, verify, stop the fallback. Or adopt the fallback officially and document the architecture. Never let it drift.

## Variants

- **Scraper connector returns 0:** check the cap first, then link shape (share, short, redirect links); test the actor with a canonical permalink; resolve links per platform at the entry point; swap actor, cascade, retry on empty (also when a platform change breaks an actor, e.g. it returns only root posts). Reject actors that return demo or someone else's data (validate post URL and date). No logged-in cookies (ban risk). Add a probe script.
- **CI minutes exhausted:** deploy with the host CLI directly until the quota resets.
- **Host blocked mid go-live:** hobby host plus serverless Postgres; run migrations manually on every schema change.
- **Local stack per project:** unique ports per project; stop stacks after use (dozens of idle DB containers will slow any laptop); if the gateway hangs, stop and start the stack.
- **Cost trim without an outage:** caps, cadence, kill switch, right-size, in that order, each verified against freshness.

## Pitfalls

| Failure | Guard |
|---|---|
| Billing block debugged as a code bug for hours | Step 1 table and step 2 before any code change |
| Backfill only the big table, other screens empty ("where did my data go") | Table inventory from code and consumers (step 6) |
| Fallback DB too small, OOM crash-loop during backfill | Size for the backfill; batch inserts |
| Runtime-created tables lose unique indexes, upserts fail silently | Recreate indexes, then compare counts |
| Consumer table missing from the sync list, refreezes at cutover | Include downstream readers in the inventory |
| Cross-network FDW too slow | Materialise a snapshot |
| `permission denied to set role` on new host | Explicit grants as a migration |
| Env file with real secrets nearly committed during the swap | Gitignore variants before creating them |
| "No reference" grep deletes a live asset during cleanup (map broke) | Check runtime URL loads and server logs first |
| Cap hit mid-campaign, scans silently return nothing | Watchdog alerts; raise caps before known peaks |
| Free LLM tier cap zeroes a scorer during an outage | Pay for the critical path |
| `statement_timeout` kills a big delete on a direct connection | Delete in batches |
| Storage upload limit blocks a large re-upload | Raise the limit before the migration |
| Local stacks clash on ports | Unique port block per project |
| Temporary fallback quietly becomes permanent | Return date set at step 3, revisited at step 11 |

## Done when

- [ ] Cause confirmed as billing, quota or block (not code) with evidence
- [ ] Owner chose pay, wait or fall back
- [ ] Target stood up by script, all migrations applied, quirks fixed as migrations
- [ ] Every table the app and its consumers read backfilled; counts match
- [ ] Health ok, 401 not 500, UI shows real data
- [ ] Env backup and restore steps written; no secret committed or in chat
- [ ] Old compute stopped; disk resized or deleted
- [ ] Caps, kill switch and 80/95% alerts in place; return date set

## Composes with

- `maji-debug` once billing is ruled out.
- `maji-ship` to deploy the cutover and verify live.
- `maji-repo-hygiene` if a secret leaked during the env swap, or for cost-driven dead code removal.
- `maji-scheduled-job` for the mirror sync, health probe and budget watchdog jobs.
- `maji-mode`: Pre-Action Gate before stopping old compute or deleting data.

---

*`maji-vendor-block` is part of MAJI Skills · By MAJI · No Codes, Only Vibes.*
