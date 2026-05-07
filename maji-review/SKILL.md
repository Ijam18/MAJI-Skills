---
name: maji-review
description: Disciplined code review skill. Outputs structured feedback grouped by severity (critical/important/style/suggestion) with file:line references. No preamble, no padding, evidence-first. Use when reviewing a PR, diff, or file and you want focused actionable feedback instead of a wall of comments.
---

# maji-review — Disciplined Code Review

A skill that reviews code (PR, diff, single file, or directory) and outputs structured feedback grouped by severity. No "Great work overall!" preamble. No trailing "let me know if you'd like to discuss". Just findings.

---

## When to Use

Type `maji-review <target>` where target is:

- A file path (`maji-review src/auth.ts`)
- A diff (`maji-review` after `git diff`)
- A PR URL (`maji-review https://github.com/...`)
- A range (`maji-review src/`)

Claude reads the target and outputs grouped feedback.

---

## Output Format

```
[Summary line: total findings + count by severity]

🔴 Critical (N findings)
──────────────────────
file:line — [issue]
  Why: [1-sentence reason]
  Fix: [code snippet or pattern]

🟡 Important (N findings)
──────────────────────
[same format]

🟢 Style (N findings)
──────────────────────
[same format]

💡 Suggestion (N findings)
──────────────────────
[same format]

[Footer: 1 line — overall verdict + recommended next action]
```

---

## Severity Categories

### 🔴 Critical (must fix before merge)

- Bugs that cause incorrect behaviour
- Security vulnerabilities (SQL injection, XSS, exposed secrets, etc.)
- Code that crashes or throws unhandled errors
- Broken types / failed compilation
- Race conditions, deadlocks
- Data loss / corruption risks

### 🟡 Important (should fix, may merge with follow-up)

- Edge cases not handled
- Missing input validation at system boundaries
- Performance issues likely to bite at scale
- Missing tests for new logic
- Tight coupling / poor abstraction
- Confusing names that hide intent
- Missing error handling on external calls

### 🟢 Style (nitpick — fix if convenient)

- Inconsistent formatting (when no auto-formatter set)
- Naming convention mismatch
- Comment hygiene (WHY-only rule)
- Import organization
- Unused imports / variables (when not auto-flagged)

### 💡 Suggestion (alternative worth considering)

- Different pattern that may be cleaner
- Library/utility user might not know about
- Refactor opportunity (only when impact is clear)
- Performance optimization (only when needed)

---

## Rules — What Maji Review Does NOT Do

- ❌ Comment on every line — only meaningful findings
- ❌ "Great work overall!" preamble
- ❌ "Let me know if you'd like to discuss" trailer
- ❌ Suggest sweeping refactors when scope was a single file
- ❌ Fabricate issues to seem thorough
- ❌ Repeat the same issue across many lines (group it)
- ❌ Use vague comments like "consider improving this" — be specific
- ❌ Recommend changes without an example fix or pattern reference

---

## Examples

### Example 1 — Authentication file

**Input:**
```typescript
// src/auth.ts
export async function login(email, password) {
  const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`)
  if (user.password === password) {
    return { token: 'abc123' }
  }
  return null
}
```

**Output:**
```
3 findings: 🔴 2 critical, 🟡 1 important.

🔴 Critical (2)
──────────────
src/auth.ts:3 — SQL injection via string interpolation
  Why: User-supplied email goes directly into raw SQL.
  Fix: Use parameterized query: db.query('SELECT * FROM users WHERE email = ?', [email])

src/auth.ts:4 — Plaintext password comparison
  Why: Passwords must never be stored or compared in plaintext.
  Fix: Hash with bcrypt/argon2 at registration; compare with bcrypt.compare(password, user.passwordHash)

🟡 Important (1)
──────────────
src/auth.ts:5 — Static token, not user-bound
  Why: Returns the same token for every login; not a session.
  Fix: Generate signed JWT or session token tied to user.id and expiry.

Verdict: Block merge. Fix critical findings before any other work on this file.
```

### Example 2 — Clean code

**Input:** [reasonable React component]

**Output:**
```
1 finding: 💡 1 suggestion.

💡 Suggestion (1)
──────────────
src/components/Button.tsx:18 — Variant prop could use union type
  Why: 'primary' | 'secondary' | 'ghost' as string is fine; using a union type gives autocomplete + compile errors on typos.
  Fix: type ButtonVariant = 'primary' | 'secondary' | 'ghost'; props: { variant: ButtonVariant }

Verdict: Ship. Suggestion is optional polish.
```

---

## Pre-Action Gate

Before suggesting destructive refactors, run the gate:

1. Was the user asking for a focused review, or a sweeping refactor?
2. Does my suggestion stay within the scope they presented?
3. If I propose a refactor, do I have all context (callers, tests, dependencies) to be sure?
4. If user follows my suggestion and it breaks something, what's the cost?

If unsure → mark as 💡 Suggestion (not 🟡 Important), and note the assumption.

---

## Composes With `maji-mode`

When `maji-mode` is active, `maji-review` inherits its token discipline:

- No preamble ("Here's my review:")
- No padding phrases
- Lead with summary count
- One-sentence reasons (not paragraphs)
- Code snippets for fixes (concrete, not abstract)
- Single-line verdict at end

---

## Customization

Common adjustments via fork:

- **Add domain-specific severity** (e.g., 🟣 Security as separate category)
- **Add team-specific style rules** (line length, naming conventions)
- **Adjust pickiness** — some teams want every nitpick, others want only critical
- **Add language-specific patterns** (e.g., common React anti-patterns)

To customize, edit the severity categories table and rules section above.

---

## Workflow Integration

Pair with git workflow:

```bash
# Review your own diff before pushing
git diff --staged | claude "maji-review"

# Review a PR before merging
claude "maji-review https://github.com/owner/repo/pull/42"

# Review a specific file in detail
claude "maji-review src/critical-flow.ts"
```

---

*`maji-review` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
