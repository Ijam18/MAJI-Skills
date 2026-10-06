---
name: maji-ship
description: Gated ship-to-production workflow. Local first, full gate (typecheck, lint, test, build), PR with green CI, database migration before code, then every production step the agent is blocked from or should not run (db push, prod deploy, secrets, prod SQL) handed to a human as copy-ready commands, followed by live verification, lockdown and a recorded rollback target. Use when a change is ready to leave the laptop, when a migration must reach prod, when going live on a new host, when backfilling prod data, or when a 'deploy failed' email or a down site shows up right after a release. Triggers include 'ship this', 'deploy to prod', 'open a PR and merge', 'go live', 'apply the migration to prod', 'why did the deploy fail', 'jom deploy', 'push ke prod', 'dah boleh live ke'.
---

# maji-ship: Gated Ship to Production

Move a change from local to verified-live production in the right order, with every irreversible prod step run by a human and checked by the agent afterwards. Output: merged PR, live deployment verified by status codes and smoke test, deployment id and rollback target recorded.

## When to use / when not

**Use:** change done locally and headed for main or prod · schema migration must reach prod · first go-live on a host · prod data backfill after a code fix · "deploy failed" email, 401, hang or down site right after a release.

**Not:** repo policy is local-only or receive-only (client repo: pull only, never touch main) · deploy freeze window · DB paused or quota hit (use `maji-vendor-block`) · secret or personal data found in the diff or history (run `maji-repo-hygiene` first).

## Steps

1. **Read the repo's ship policy first.** Policies differ per repo: local-only until the owner says "deploy", never push main, auto-push, receive-only. Keep it in one in-repo file (e.g. `SHIP.md`) with the exact commands. No policy found: ASK. Default to local only.
2. **One task, one worktree, one branch.** `git worktree add ../<repo>-wt/<task> -b <task> origin/main` from fresh main. Parallel sessions on one checkout weld unrelated commits together. Prune worktrees after merge.
3. **Local gate.** Typecheck (`tsc --noEmit` is the real gate if the build ignores type errors), lint, unit tests, production build. Build with the host's package manager and a frozen lockfile (`pnpm install --frozen-lockfile`). Always build locally for risky PRs (dependency bumps, import changes).
4. **Stage on purpose.** Review `git diff --cached --name-only`; secret-scan the staged diff. Never stage `*.bak`, `.env*` variants, SQL dumps or CSVs with personal data. Avoid `git add -A` after `sed -i.bak`. `git add A B badpath` can abort without staging A and B: re-check the list.
5. **Commit, PR, watch CI.** Conventional commit (`maji-commit`), `gh pr create`, `gh run watch` until green. Red CI: fix, do not re-run hoping. Merge only on an explicit "merge": `gh pr merge --squash`. Do not delete the branch before the PR is MERGED (early delete closes the PR). Squash 409 means main moved: rebase, re-run CI.
6. **Database before code.** Migrations forward-only, idempotent where possible, committed (a migration applied only by hand is missing from history and later needs `migration repair`). Apply to local, test and E2E databases, run the suite; validate a fresh migrate on a scratch DB and re-check settings that a fresh seed resets. For prod: dump first, list pending migrations with a dry run (`supabase db push --dry-run`), apply, then deploy code. Indexes ship as migrations too. Content renames: deploy code first, then reseed.
7. **Hand off gated steps as copy-ready commands.** Steps the agent is blocked from or must not do (prod `db push`, `vercel deploy --prod`, prod SQL, setting secrets, dashboard clicks, billing) become: exact command with working directory and account scope (`--scope`), a SQL block, a dashboard link with exact field names, or one `go-live.sh` (DB dry run, pause, migrate, deploy, smoke, print deployment id). Runbooks and scripts live in the repo. The human pastes secrets into their own terminal or host env, never into chat, then replies "done".
8. **Verify live.** `vercel ls` / `inspect` / `logs` or `flyctl releases`: confirm the URL is the NEW deployment (an old deployment serving 404 looks like prod). `curl -s -o /dev/null -w '%{http_code}'` on health and key routes: judge status codes, not bodies; protected routes must return 401, not 500. Grep the served JS chunk for a string from this change (`curl --compressed`). Playwright smoke, read-only, real browser and phone UA (API-style requests can hit a firewall 429). Count rows for data changes.
9. **Lock down after first go-live.** Audit routes for missing auth and IDOR, tighten RLS, turn on deployment protection, firewall rules, bot protection, rate limits. Test from outside: bot blocked, normal user fine. Write down what was set and by whom.
10. **Record.** Deployment id, rollback target, migrations applied, manual items still open. Update the runbook; strike steps that are done.

## Variants

- **Owner-run deploy from a ship worktree:** release check first (clean branch, bundle budget, build in a throwaway worktree), fast-forward the deploy branch, `git -C <ship-worktree> checkout --detach <sha>`; human runs `db push` then `vercel deploy --prod` from that clean tree.
- **Container host (e.g. Fly):** Dockerfile plus config with a release command that runs migrations; import secrets with the host CLI. CI deploy shows "skipped": trigger it (`gh workflow run`). CI minutes exhausted: deploy with the host CLI (refresh an expired CLI auth token first). Deploys restart machines: never deploy while a long job runs; `/tmp` is wiped.
- **Third-party dashboard setup** (Supabase, Stripe, Resend, bot tokens): finish all code first (schema, seed, webhook handler), write `SETUP_<VENDOR>.md` with exact field names, ship mock-data fallback so the app runs without the backend, verify after (webhook info, test signup, login).
- **Prod backfill or re-score:** ship the code fix first (future writes), back up affected columns to CSV (id, old, new), dry-run the row count, get approval that names the table, run inside the container (pass scripts base64-encoded, not heredoc), with an advisory lock, bulk writes (not per-row `executemany`), `ORDER BY`, resumable on NULL; escape literal `%` as `%%` in driver-parameterised SQL. No deploys while it runs. Verify counts, re-run the audit.
- **Deploy-failed triage:** pull the failing log (`vercel ls`, `gh run view`), classify: lockfile drift, dependency-bot bump, preview missing Production-only env, bundler import error. Minimum fix, green CI, close superseded PRs.
- **Down / 401 / hang after deploy:** health, logs, DNS. Every page stuck loading = backing DB paused (`maji-vendor-block`). 401 on admin routes with a write-only "sensitive" secret: rotate to one new value in host env and CI secret, redeploy with explicit scope. Hang or 500: pooler pipelining, timeouts, function region far from the DB. A logged status code of 0 is not proof of a hang.

## Pitfalls

| Failure | Guard |
|---|---|
| Pushed to main, or opened a PR on a local-only repo | Step 1 policy file; default local-only |
| Auto-merge passed while the host build failed | Make the host build a required check; build locally first |
| Lockfile drift (npm vs pnpm, two lockfiles) | One package manager, one lockfile, frozen install everywhere |
| Host config `buildCommand` bypasses package scripts; pnpm skips pre/post hooks | Read host config before trusting a local green |
| Preview deploys fail on missing env, failure emails pile up | Scope env to Preview or disable previews; it is not a code bug |
| Agent blocked from prod commands, inconsistently, even after approval | Do not retry around it: hand off copy-ready (step 7) |
| App deployed before its migration, prod broken | DB first, written in runbook order |
| Seed runs only on empty tables; corrected facts never reach existing DBs | Ship data fixes as a migration or gated backfill |
| Migrate on app start throws every cold start (non-idempotent `CREATE TYPE`) | Migrate in the release step; idempotent DDL |
| ORM snapshot out of sync; generator re-emits already-applied SQL | Read generated SQL before applying |
| Secret typed into the wrong env (shared server file, wrong scope) | Handoff names the exact target env and scope |
| Rotations and manual migrations postponed then forgotten; runbook outside repo lost | Runbook in repo, open-items list, re-check each session |
| Secret or DB password pasted in chat | Treat as leaked: rotate |
| CLI deploys to the wrong account or team | Always pass `--scope` / org explicitly |
| CLI-created project defaults to framework "Other", serves 404 | Pin the framework |
| Deploy from a subfolder doubles the root directory | Deploy from repo root |
| Git integration not installed for the repo owner, push never deploys | Confirm a new deployment actually appeared |
| Deploy "skipped" silently, prod keeps old bundle; deployment skew 404s old chunks | Grep the served chunk; check releases list |
| CI jobs fail in 2s with no runner | Billing or minutes cap, not code: check billing first |
| Firewall too strict, real users blocked | Test from outside as a normal user |

## Done when

- [ ] Repo ship policy read and followed
- [ ] Local gate green, CI green, PR merged on an explicit OK
- [ ] Migrations committed, prod backed up, DB applied before code
- [ ] Gated steps run by a human from copy-ready commands; no secret in chat or repo
- [ ] Live verified: new deployment id, status codes, smoke, served chunk, row counts
- [ ] Lockdown checked (first go-live)
- [ ] Deployment id, rollback target and open items recorded; runbook updated

## Composes with

- `maji-mode`: Pre-Action Gate before push, merge, force-push or any prod step.
- `maji-commit` for the message, `maji-review` before the PR, `maji-debug` for red CI or a failed deploy.
- `maji-vendor-block` when the cause is a paused DB, quota or billing cap.
- `maji-repo-hygiene` when a secret or personal data turns up in the diff or history.
- `maji-ui-review` for the live review on a real phone after deploy; `maji-scheduled-job` for prod crons.

---

*`maji-ship` is part of MAJI Skills · By MAJI · No Codes, Only Vibes.*
