---
name: maji-commit
description: Generate a concise commit message from the current git diff. Conventional commits format (feat/fix/refactor/etc). Use when staged changes are ready to commit and you want Claude to write the message instead of typing it manually.
---

# maji-commit — Auto-generate Commit Messages

A skill that reads your staged or unstaged git diff and writes a clean commit message in conventional commits format. No manual typing, no overthinking the wording.

---

## When to Use

Type `maji-commit` (or `commit message?`) after running `git diff` or `git diff --staged`. Claude reads the diff, infers the change, outputs a commit message you can copy-paste.

---

## Input → Output

**Input:** Current staged/unstaged diff in the working directory.

**Output:** A single commit message string in conventional commits format.

```
<type>(<scope>): <subject>

[optional body — only if change is non-obvious]
```

---

## Format Rules

### Type (required)

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code restructure, no behaviour change |
| `chore` | Tooling, deps, config |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `test` | Tests added or changed |
| `perf` | Performance improvement |
| `build` | Build system, packaging |
| `ci` | CI/CD changes |

### Scope (optional)

A noun describing the affected area: `auth`, `api`, `ui`, `db`, etc. Use when it adds clarity. Skip when scope is obvious or change spans multiple areas.

### Subject

- Imperative mood ("add", "fix", "remove" — not "added", "fixes", "removed")
- Lowercase first letter
- No period at end
- ≤ 72 characters
- Describe **what changed**, not how

### Body (only when needed)

Skip if subject is clear. Include only when:
- Non-obvious decision needs explaining
- Breaking change (prefix body with `BREAKING CHANGE:`)
- Multiple loosely-related changes (rare — usually means split into multiple commits)

---

## Examples

### Single-line commits (most common)

```
feat(auth): add Google OAuth flow
fix(dashboard): resolve search input race condition
refactor(api): extract user service from controller
chore: update dependencies to latest stable
docs(readme): add installation troubleshooting section
test(auth): add login flow integration tests
```

### Commits with body (less common)

```
fix(payment): handle webhook retry idempotency

Stripe sends duplicate webhook events on retry. Previous
implementation processed each, causing double-charges.
Now check event ID against processed log before handling.
```

```
refactor(db): switch from raw SQL to Drizzle ORM

BREAKING CHANGE: Query helpers in lib/db.ts now return
Drizzle query builders instead of raw rows. Callers must
update to use .execute() or .all() pattern.
```

---

## Anti-patterns to Avoid

| ❌ Avoid | ✅ Better |
|---|---|
| `Updated stuff` | `feat(api): add user search endpoint` |
| `Fixed bug` | `fix(auth): handle expired token refresh` |
| `Various changes` | Split into multiple commits with specific messages |
| `WIP` | Skip the commit; or use `chore: wip [reason]` if must |
| `Final changes` | Describe what the changes do, not their finality |
| `Updated dependencies and added some features` | Split: `chore: update deps` + `feat(x): add y` |

---

## Workflow

1. User stages changes: `git add ...`
2. User runs `git diff --staged` (optional, for review)
3. User invokes `maji-commit` in Claude
4. Claude reads diff via tool call (Bash `git diff --staged`)
5. Claude outputs commit message
6. User copy-pastes into `git commit -m "..."` or commits directly

If using Claude Code with permissions, Claude can run `git commit -m "<generated>"` directly when authorized.

---

## Customization

Some teams use additional types or scopes. To customize, fork this skill and edit the type table above. Common additions:

- `revert` — reverting a previous commit
- `merge` — merge commit (rarely needed)
- `wip` — work-in-progress (discouraged; signals incomplete commit hygiene)

To match your team's style, also adjust:
- Subject case rules (some teams prefer Sentence case, not lowercase)
- Subject length (some prefer ≤ 50 chars for terminal display)
- Body required vs optional

---

## Composes With `maji-mode`

When `maji-mode` is active, `maji-commit` inherits its token discipline — no preamble like "Here's your commit message:", just the deliverable. Output is the commit string and nothing else.

---

*`maji-commit` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By [MAJI](https://maji.org) · No Codes, Only Vibes.*
