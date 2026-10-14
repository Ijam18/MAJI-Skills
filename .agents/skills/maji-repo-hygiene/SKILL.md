---
name: maji-repo-hygiene
description: One ritual to clean a repository before backup, handover or open-sourcing. Parallel audit of structure, dead code and assets, dependencies, secrets and personal data; deep-verify every removal candidate; restructure in small steps; purge leaked files from history (git filter-repo or a squash import) only after explicit approval; prove behaviour unchanged with the full suite; publish a clean snapshot or a private backup; finish with a dated list of keys to rotate. Use when a repo is messy, before making it public, before handing it to a new maintainer, after a secret or client data landed in git, or when a project folder has no .git. Triggers include 'clean up this repo', 'remove dead code', 'purge secrets from history', 'make this repo public', 'back up to GitHub', 'hand this over', 'kemas repo ni', 'buang dead code', 'nak publish public'.
metadata:
  tier: workflow
  category: ship
  version: "1.0.0-lite"
---

# maji-repo-hygiene: Repo Hygiene Ritual

Audit, verify, clean, purge, prove, publish, rotate: in that order. Output: tidy structure with a README per folder, dead code removed with proof nothing changed, no secrets or personal data in tree or history (or a written decision not to rewrite), a backup or public snapshot, and a dated rotate list.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Tools and credits). If `me/overrides/maji-repo-hygiene.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

**Use:** before going public or turning a repo into a template · before handover to a new maintainer · a secret or personal data (user or student CSV, SQL dump, `.env*.bak`) is or was committed · repo bloated with dead assets, giant helper files, unused deps · a project folder has no `.git` at all.

**Not:** mid-feature (commit first; auditing a stale or dirty checkout produces false findings) · design refactors (use `maji-review`) · the leak is only in the last unpushed commit (amend it, rotate the key, no history rewrite).

## Steps

1. **Check the ground.** Does `.git` exist?
2. **Inventory in parallel.** Separate audit passes (Claude Code: one subagent per pass.
3. **Deep-verify every candidate.** Grep framework config and registration files, auto-discovered component folders, string-referenced routes, CI config, DB tables that act as sinks.
4. **Get decisions.** Present a numbered list: remove / keep / move.
5. **Restructure in stages.** `git mv` in small batches; update imports and tests after each batch; README per folder.
6. **Remove and harden.** Delete verified dead code and assets, resize big images, move personal data out of `public/` into private storage (and check the live server is not still serving the old path).
7. **Prove nothing changed.** Full suite: unit, integration, E2E (PHPUnit, Vitest, pytest, Playwright).
8. **Purge history if a secret or personal data was ever committed.**
9. **Force-push only after explicit approval.** Relax the branch ruleset, push, restore the ruleset.
10. **Publish or back up.**
11. **Rotate list.** Every key that ever reached history, even after a purge: provider, where used, date found.
12. **Prevent recurrence.** Pre-commit hook blocking `*.bak`, `.env*` (except `.env.example`), SQL dumps and CSVs containing emails or ID numbers.

## Composes with

- `maji-mode`: Pre-Action Gate before every delete, history rewrite and force-push.
- `maji-review` for the security pass, `maji-commit` for per-module messages.
- `maji-ship` once the repo is clean and ready to go out.
- `maji-vendor-block` when cost trimming triggers the cleanup.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-repo-hygiene` is part of MAJI Skills · By MAJI · No Codes, Only Vibes.*
