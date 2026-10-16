---
name: maji-ship
description: Gated ship-to-production workflow. Local first, full gate (typecheck, lint, test, build), PR with green CI, database migration before code, then every production step the agent is blocked from or should not run (db push, prod deploy, secrets, prod SQL) handed to a human as copy-ready commands, followed by live verification, lockdown and a recorded rollback target. Use when a change is ready to leave the laptop, when a migration must reach prod, when going live on a new host, when backfilling prod data, or when a 'deploy failed' email or a down site shows up right after a release. Triggers include 'ship this', 'deploy to prod', 'open a PR and merge', 'go live', 'apply the migration to prod', 'why did the deploy fail', 'write a post-mortem', 'what went wrong', 'log this failure'.
metadata:
  tier: workflow
  category: ship
  version: "1.0.0-lite"
---

# maji-ship: Gated Ship to Production

Move a change from local to verified-live production in the right order, with every irreversible prod step run by a human and checked by the agent afterwards. Output: merged PR, live deployment verified by status codes and smoke test, deployment id and rollback target recorded.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Tools and credits). If `me/overrides/maji-ship.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

**Use:** change done locally and headed for main or prod · schema migration must reach prod · first go-live on a host · prod data backfill after a code fix · "deploy failed" email, 401, hang or down site right after a release.

**Not:** repo policy is local-only or receive-only (client repo: pull only, never touch main) · deploy freeze window · DB paused or quota hit (use `maji-vendor-block`) · secret or personal data found in the diff or history (run `maji-repo-hygiene` first).

## Steps

1. **Read the repo's ship policy first.** Policies differ per repo: local-only until the owner says "deploy", never push main, auto-push, receive-only.
2. **One task, one worktree, one branch.** `git worktree add ../<repo>-wt/<task> -b <task> origin/main` from fresh main.
3. **Local gate.** Typecheck (`tsc --noEmit` is the real gate if the build ignores type errors), lint, unit tests, production build.
4. **Stage on purpose.** Review `git diff --cached --name-only`; secret-scan the staged diff.
5. **Commit, PR, watch CI.** Conventional commit (`maji-commit`), `gh pr create`, `gh run watch` until green.
6. **Database before code.** Migrations forward-only, idempotent where possible, committed (a migration applied only by hand is missing from history and later needs `migration repair`).
7. **Hand off gated steps as copy-ready commands.** Steps the agent is blocked from or must not do (prod `db push`, `vercel deploy --prod`, prod SQL, setting secrets, dashboard clicks, billing) become: exact command with working directory and account scope (`--scope`), a SQL block, a dashboard link with exact field names, or one `go-live.sh` (DB dry run, pause, migrate, deploy, smoke, print deployment id).
8. **Verify live.** `vercel ls` / `inspect` / `logs` or `flyctl releases`: confirm the URL is the NEW deployment (an old deployment serving 404 looks like prod).
9. **Lock down after first go-live.** Audit routes for missing auth and IDOR, tighten RLS, turn on deployment protection, firewall rules, bot protection, rate limits.
10. **Record.** Deployment id, rollback target, migrations applied, manual items still open.
11. **Post-incident note (only when something broke).** On a failure signal (crash, rollback, failed migration, leaked secret, data loss, hours lost on a dead end) ask once: "Worth a post-mortem?" No: log nothing, move on.

## Composes with

- `maji-mode`: Pre-Action Gate before push, merge, force-push or any prod step.
- `maji-commit` for the message, `maji-review` before the PR, `maji-debug` for red CI or a failed deploy.
- `maji-vendor-block` when the cause is a paused DB, quota or billing cap.
- `maji-repo-hygiene` when a secret or personal data turns up in the diff or history.
- `maji-ui-review` for the live review on a real phone after deploy; `maji-scheduled-job` for prod crons.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-ship` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
