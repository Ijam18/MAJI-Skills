---
name: maji-refactor
description: Scope-guarded refactoring. Define target → identify minimum diff → preserve behaviour → verify with tests. Pre-Action Gate prevents scope drift into unrelated improvements. Use when you want a targeted refactor that does not turn into a 50-file rewrite.
---

# maji-refactor — Scope-Guarded Refactoring

A skill that refactors code without sliding into "while I was there" syndrome.

---

## When to Use

Type `maji-refactor <target>: <intent>` where:

- target = file/function/module
- intent = the specific refactor goal

Examples:
- `maji-refactor src/auth.ts: extract token logic into separate module`
- `maji-refactor UserList component: switch from class to function with hooks`
- `maji-refactor src/api/: consolidate duplicate fetch helpers`

---

## The Refactor Protocol

### Step 1 — Define Scope

Write down explicitly:

- **What changes:** [files / functions / modules]
- **What stays the same:** [behaviour, public API, return shapes]
- **Out of scope:** [adjacent improvements I'll resist]

### Step 2 — Identify Minimum Diff

Find the smallest set of changes that achieves the intent. If diff exceeds expectation:

- Re-question scope
- Split into multiple refactors

### Step 3 — Pre-Action Gate

Before writing the refactor:

1. Are tests covering the behaviour I'm preserving?
2. If not, write tests FIRST (so the refactor has a safety net).
3. Will my refactor change any public API? If yes, document the migration.
4. Are there callers I haven't checked? If yes, list them.

### Step 4 — Apply Diff

- Touch only files in scope
- Preserve naming where possible (rename only when necessary)
- Keep diff readable in PR review

### Step 5 — Verify

- Run tests — all pass
- Diff is what was promised
- No "while I was there" changes

---

## Anti-patterns Avoided

| ❌ Avoid | ✅ Do instead |
|---|---|
| Refactor + new feature in same change | Two separate commits |
| Renaming variables for taste | Rename only if it adds clarity for future readers |
| Reformatting whole file while editing one function | Touch only what must change |
| Updating dependencies during a refactor | Separate task |
| "I noticed this could also be improved..." | Note it for later, don't include |
| Refactor that breaks backward compat without notice | Document migration path explicitly |

---

## Output Format

```
SCOPE
- Changes: [files/functions]
- Preserved: [behaviour/API]
- Out of scope: [things I won't touch]

DIFF
[code changes, file by file]

VERIFICATION
- Tests run: [pass/fail]
- Behaviour preserved: [evidence]
- Public API changed: [yes/no — if yes, migration]

MIGRATION (if API changed)
[for each caller: how to update]
```

---

## Example

**Input:**
```
maji-refactor src/auth.ts: extract token validation into separate function
```

**Output:**
```
SCOPE
- Changes: src/auth.ts (login function)
- New file: src/auth/validate-token.ts
- Preserved: login() public signature and return shape
- Out of scope: error handling refactor, token refresh, password hashing review

DIFF

src/auth/validate-token.ts (new)
─────────────────────────────────
+ export function validateToken(token: string): boolean {
+   if (!token || typeof token !== 'string') return false
+   try {
+     const decoded = jwt.verify(token, process.env.JWT_SECRET!)
+     return !!decoded
+   } catch {
+     return false
+   }
+ }

src/auth.ts
─────────────────────────────────
+ import { validateToken } from './auth/validate-token'
- // 8 lines of inline token validation
+ if (!validateToken(token)) return null

VERIFICATION
- Tests: src/auth.test.ts — 12 passing (no changes needed)
- Behaviour preserved: same return for invalid/valid tokens
- Public API: login() unchanged

MIGRATION
None — internal refactor only.
```

---

## When NOT to Use This Skill

- For one-line tweaks (just edit it)
- For genuine rewrites (different protocol — separate planning needed)
- When you don't have tests and can't add them (refactor without safety = guess-and-check)

---

## Composes With

- `maji-test` — write missing tests before refactor
- `maji-review` — verify refactor preserved behaviour
- `maji-debug` — if tests fail post-refactor, run debug protocol
- `maji-mode` — token discipline

---

## Customization

- Add framework-specific refactor patterns (React class→hooks, Redux→Zustand)
- Add team conventions for naming during refactor
- Adjust scope strictness — some teams allow adjacent cleanup, others enforce strict surgical

---

*`maji-refactor` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
