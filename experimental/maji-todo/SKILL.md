---
name: maji-todo
description: Extract and triage TODO/FIXME/HACK comments from a codebase. Categorize by urgency, group by file, identify stale TODOs older than threshold. Use during cleanup sprints, before releases, or when onboarding a new project.
---

# maji-todo — Codebase TODO Extractor

A skill that scans a codebase for TODO/FIXME/HACK comments and outputs a triaged list — by category, by file, by age. Helps you decide what to address vs what to delete.

---

## When to Use

Type `maji-todo <target>` where target is:

- Whole repo (`maji-todo .`)
- Subfolder (`maji-todo src/`)
- Specific file (`maji-todo src/auth.ts`)

Optional flags:

- `--stale` — only show TODOs older than 30 days (via git blame)
- `--owner <name>` — filter by author
- `--type <TODO|FIXME|HACK>` — filter by tag

---

## What Gets Captured

### Tag Categories (default)

| Tag | Meaning | Default urgency |
|---|---|---|
| `TODO` | Future work, not blocking | 🟢 Low |
| `FIXME` | Known bug, should fix | 🟡 Medium |
| `HACK` | Workaround, technical debt | 🟡 Medium |
| `XXX` | Mark of caution / surprise | 🟡 Medium |
| `BUG` | Confirmed bug | 🔴 High |
| `NOTE` | Important context | ⚪ Info |
| `WARNING` | Future hazard | 🟡 Medium |

### What's Captured

- Tag type
- File:line
- Comment text
- Author (via git blame)
- Age (days since first introduced)

---

## Output Format

```
[N] TODOs found in [target]

🔴 High Priority (BUG)
─────────────────────
src/auth.ts:42 — BUG: token refresh fails on Safari
  Author: ijam, 14 days ago

🟡 Medium Priority (FIXME, HACK, WARNING)
─────────────────────
src/api/users.ts:18 — FIXME: rate limiting not enforced
  Author: ijam, 32 days ago [STALE]

src/utils.ts:7 — HACK: monkey-patch for IE fallback (delete in 2026)
  Author: mung, 95 days ago [STALE]

🟢 Low Priority (TODO)
─────────────────────
src/ui/Modal.tsx:23 — TODO: extract animation logic
  Author: ijam, 5 days ago

src/utils.ts:14 — TODO: support locale strings
  Author: ijam, 60 days ago [STALE]

⚪ Info (NOTE)
─────────────────────
src/db.ts:1 — NOTE: connection pool size tuned for 100 concurrent
  Author: mung, 200 days ago

SUMMARY
- 1 high (BUG)
- 3 medium (FIXME, HACK, WARNING)
- 2 low (TODO)
- 1 info (NOTE)
- 4 stale (>30 days)
```

---

## Triage Recommendations

After listing, output a short triage section:

```
TRIAGE SUGGESTIONS

Address now:
- src/auth.ts:42 (BUG, 14 days) — confirmed Safari issue

Decide and act:
- src/utils.ts:7 (HACK, 95 days) — IE fallback; if IE no longer supported, delete
- src/api/users.ts:18 (FIXME, 32 days) — schedule or document why deferred

Convert or delete:
- src/utils.ts:14 (TODO, 60 days) — convert to issue, or delete if not actually planned
```

---

## Rules

- **Default scan ignores** `node_modules`, `dist`, `build`, `.git`, `vendor`
- **Code comments only** — skip TODOs in docs/markdown unless explicitly included
- **Group by tag**, then by urgency, then by file
- **Highlight stale TODOs** — those older than 30 days (configurable)
- **Don't auto-fix** — listing only; user decides action
- **Preserve exact comment text** — don't paraphrase

---

## Anti-patterns Avoided

| ❌ Avoid | ✅ Do instead |
|---|---|
| Suggesting "fix all TODOs" as the recommendation | Triage by urgency + age |
| Showing every TODO as equally important | Rank by tag type + age |
| Auto-deleting stale TODOs | List + recommend, don't act |
| Including TODOs in node_modules | Default exclude vendored code |
| Paraphrasing comment intent | Show exact text |

---

## Example Workflow

```bash
# Run before a release
maji-todo .

# See only high-priority items
maji-todo . --type FIXME,BUG

# Find stale items older than 60 days
maji-todo . --stale --age 60

# Focus on one author's TODOs
maji-todo . --owner mung
```

---

## Composes With

- `maji-debug` — for any BUG-tagged TODOs that need diagnosis
- `maji-refactor` — for HACK-tagged items requiring redesign
- `maji-review` — surface TODOs introduced in current PR
- `maji-mode` — token discipline applies

---

## Customization

- Add custom tags (some teams use `OPTIMIZE`, `SECURITY`, `DEPRECATED`)
- Adjust stale threshold (some teams = 14 days; others = 90 days)
- Add file extension filters (only scan `.ts`, `.tsx`, `.py`, etc.)
- Add output formats (Markdown, JSON for tooling integration)

---

*`maji-todo` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By [MAJI](https://maji.org) · No Codes, Only Vibes.*
