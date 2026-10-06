---
name: maji-repo-hygiene
description: One ritual to clean a repository before backup, handover or open-sourcing. Parallel audit of structure, dead code and assets, dependencies, secrets and personal data; deep-verify every removal candidate; restructure in small steps; purge leaked files from history (git filter-repo or a squash import) only after explicit approval; prove behaviour unchanged with the full suite; publish a clean snapshot or a private backup; finish with a dated list of keys to rotate. Use when a repo is messy, before making it public, before handing it to a new maintainer, after a secret or client data landed in git, or when a project folder has no .git. Triggers include 'clean up this repo', 'remove dead code', 'purge secrets from history', 'make this repo public', 'back up to GitHub', 'hand this over', 'kemas repo ni', 'buang dead code', 'nak publish public'.
---

# maji-repo-hygiene: Repo Hygiene Ritual

Audit, verify, clean, purge, prove, publish, rotate: in that order. Output: tidy structure with a README per folder, dead code removed with proof nothing changed, no secrets or personal data in tree or history (or a written decision not to rewrite), a backup or public snapshot, and a dated rotate list.

## When to use / when not

**Use:** before going public or turning a repo into a template · before handover to a new maintainer · a secret or personal data (user or student CSV, SQL dump, `.env*.bak`) is or was committed · repo bloated with dead assets, giant helper files, unused deps · a project folder has no `.git` at all.

**Not:** mid-feature (commit first; auditing a stale or dirty checkout produces false findings) · design refactors (use `maji-review`) · the leak is only in the last unpushed commit (amend it, rotate the key, no history rewrite).

## Steps

1. **Check the ground.** Does `.git` exist? Missing: `git init`, commit, and back up privately right away (step 10). Working tree clean, on latest main, earlier trim work committed (uncommitted trims get lost and redone). Audit the current checkout, not an old branch.
2. **Inventory in parallel.** Separate audit passes (subagents if your client has them): folder structure; dead code, views and routes; dead public assets and oversized images; dependencies; secrets (hardcoded keys, `.env*` variants, `*.bak`); personal data (CSV exports, SQL dumps, files under `public/`); history (`git log --all --stat -- <path>`). Tools: `git grep`, import graph, Python `ast` / `symtable`, `ruff`, a secret scanner such as gitleaks. Output one candidate list with evidence per item.
3. **Deep-verify every candidate.** Grep framework config and registration files, auto-discovered component folders, string-referenced routes, CI config, DB tables that act as sinks. Agents often mis-flag dependencies as "unused". A lockfile CI installs from is load-bearing even if it looks stray. "No reference found" is not proof for assets loaded by URL at runtime (map tiles, fonts): check server logs. Removing a debug call (`dd()`, `console.log`) without fixing the logic under it leaves the bug.
4. **Get decisions.** Present a numbered list: remove / keep / move. The owner answers by number. Nothing destructive without that answer.
5. **Restructure in stages.** `git mv` in small batches; update imports and tests after each batch; README per folder. Watch relative config paths (`..`) that break silently when a module moves into a subpackage, and request-time imports or decorators that move across modules. Commit per module (`type(module): ...`) so the folder listing tells the story.
6. **Remove and harden.** Delete verified dead code and assets, resize big images, move personal data out of `public/` into private storage (and check the live server is not still serving the old path). Hardcoded keys move to env or config; seed passwords live in env only. Optional optimisation: memoise hot helpers, eager-load, add DB indexes as migrations, drop unused libraries.
7. **Prove nothing changed.** Full suite: unit, integration, E2E (PHPUnit, Vitest, pytest, Playwright). For moved functions, snapshot output before and after must be identical. Start the app locally and click through.
8. **Purge history if a secret or personal data was ever committed.**
   - Backup first: `git bundle create ../<repo>-<date>.bundle --all`.
   - Install `git filter-repo` in a venv or with pipx (system Python may refuse under PEP 668).
   - `git filter-repo --invert-paths --path <file> --path <old path of same file>`. A file that lived at two paths needs both, or the first pass is only half done. filter-repo also removes the file from the working tree: copy out what you still need.
   - Alternative for a fresh remote: squash-import the current tree with no old history (one commit, or one per module).
   - Check you did not rewrite real collaborators' authorship or misattribute content.
9. **Force-push only after explicit approval.** Relax the branch ruleset, push, restore the ruleset. Record that every old clone is dead (re-clone or hard reset) and every commit hash cited in notes, issues or docs is now stale.
10. **Publish or back up.**
    - Private backup: `gh repo create <name> --private --source=. --push`.
    - Public: scan staged files (no `.env`, secrets, private PDFs, `node_modules`), single-commit snapshot (no technical history), a privacy contamination test (scan for a banned list of private names, paths, emails, keys), honest README, license. Web-UI-only settings (template repo, discussions) go on a list for the owner.
    - Handover: new remote becomes `origin`, old remote renamed with push disabled; push only the handover branch, never touch main; README setup, CHANGELOG, roadmap with a definition of done.
11. **Rotate list.** Every key that ever reached history, even after a purge: provider, where used, date found. A purge does not un-leak; only rotation does. Track it as an open item with a date and chase it after 7 days.
12. **Prevent recurrence.** Pre-commit hook blocking `*.bak`, `.env*` (except `.env.example`), SQL dumps and CSVs containing emails or ID numbers. `.gitignore` every env variant. Remember `.gitignore` does not protect already-tracked files: `git rm --cached`.

## Variants

- **Security pass (web app):** IDOR (scope queries to the owner or tenant), role gate per portal, API login requires a password, login throttle, upload validation, HTML purifier against XSS, CRLF guard on email headers, bounds on numeric input; RLS, private buckets with signed URLs, security headers and CSP. Lock each fix with a regression test.
- **Trim a legacy codebase:** parallel audits for dead assets, dead code and optimisations. For code you did not write, a bash audit kit (`--fix`, `--http`) plus a final audit report and a per-module status doc.
- **Public template:** snapshot, privacy test, license (e.g. AGPL), fork-first README.
- **Handover and close:** DB dump backup, bulk-close tickets, crons stay off, export a module or feature list, mark the project closed in notes.
- **Choosing not to rewrite:** the owner may accept leaked personal data staying in old history. Record the decision and residual risk (old remote, a server still serving the file).

## Pitfalls

| Failure | Guard |
|---|---|
| Key already in history; rotation depends on the owner and keeps slipping | Dated rotate list (step 11), chased weekly |
| `sed -i.bak` leaves `.bak` files with secrets that ride in on `git add -A` | Hook blocks `*.bak`; review `git diff --cached --name-only` |
| `.gitignore` added after the file was tracked | `git rm --cached`, then purge if it was pushed |
| Agent flags a used dependency as unused; load-bearing lockfile deleted | Deep-verify (step 3) before any removal |
| Earlier trim never committed, work lost | Commit per module as you go |
| Audit ran on a stale checkout, false findings | Fresh main, clean tree (step 1) |
| Reorg breaks coupling, lockfile or CI | Small `git mv` batches, suite after each |
| File existed at two paths; purge half done | Pass every historical path to filter-repo |
| filter-repo deleted the file from the working tree too | Copy needed files out before running |
| Force-push kills old clones, stales every hash in notes | Approval first; announce; update references |
| Real collaborator authorship rewritten by mistake | Check author map before force-push |
| `.git` vanished from a project, nobody noticed | Step 1 check; private backup remote |
| Destructive re-sync (`read-tree`) wipes work a new maintainer merged | After handover, sync only by PR or merge |
| DB password shared in chat | Rotate it |

## Done when

- [ ] Audit list produced, every candidate deep-verified, decisions recorded
- [ ] Structure tidy, README per folder, commits per module
- [ ] Full suite green; moved functions produce identical output
- [ ] No secrets or personal data in tree; history purged (or a written no-rewrite decision)
- [ ] Force-push approved; dead clones and stale hashes noted
- [ ] Private backup or public snapshot exists; privacy test passed
- [ ] Rotate list dated and handed to the owner
- [ ] Pre-commit guard in place

## Composes with

- `maji-mode`: Pre-Action Gate before every delete, history rewrite and force-push.
- `maji-review` for the security pass, `maji-commit` for per-module messages.
- `maji-ship` once the repo is clean and ready to go out.
- `maji-vendor-block` when cost trimming triggers the cleanup.

---

*`maji-repo-hygiene` is part of MAJI Skills · By MAJI · No Codes, Only Vibes.*
