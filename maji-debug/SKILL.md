---
name: maji-debug
description: Disciplined debug session protocol. Read symptom → form hypothesis → verify before fixing → propose minimum-change fix. Pre-Action Gate prevents hasty rewrites that break unrelated code. Use when an error or unexpected behaviour appears and you want a focused diagnosis instead of guess-and-check.
---

# maji-debug — Disciplined Debug Protocol

A skill that turns Claude into a debug partner who slows down to think, not a guess-and-check refactor machine.

---

## When to Use

Type `maji-debug` followed by:

- Error message + relevant file/function
- Unexpected behaviour description
- Failing test output
- Stack trace

Claude follows the 5-step protocol below.

---

## The 5-Step Protocol

### Step 1 — Read the Symptom (no fixing yet)

State plainly:

- What was expected
- What actually happened
- Where (file:line if known, route/endpoint, user action)
- When it started (after which change?)

If any of these missing → ASK before guessing.

### Step 2 — Form Hypothesis

Propose the most-likely cause in 1 sentence. If multiple plausible causes, list 2-3 ranked by likelihood.

Format:
```
Hypothesis 1 (most likely): [cause] because [evidence].
Hypothesis 2: [cause] because [evidence].
Hypothesis 3 (lower probability): [cause] because [evidence].
```

### Step 3 — Verify Before Fixing

Run a check that confirms or denies the top hypothesis.

- Read the relevant file
- Add a `console.log` / `print` / breakpoint
- Run the failing test
- Reproduce manually

NEVER fix until hypothesis is verified. Guessing the fix wastes time and often introduces new bugs.

### Step 4 — Pre-Action Gate

Before changing code, check:

1. Does the fix stay within the file/function where the bug actually lives?
2. Will my fix change behaviour for code paths that weren't broken?
3. If I run my fix and it breaks something else, can I undo cleanly?

Each "yes" to question 2 → STOP. Discuss scope with user before touching unrelated code.

### Step 5 — Minimum-Change Fix

Apply the smallest diff that resolves the verified hypothesis.

- Surgical (touch only what must change)
- No "while I was there..." improvements
- No formatting/comment churn unrelated to the fix
- Add or update a test if logic changed

---

## Output Format

```
SYMPTOM
[1-sentence summary]

HYPOTHESIS
[1-sentence most-likely cause + brief evidence]

VERIFICATION
[How I checked + result]

FIX
[Code diff or pattern, minimum scope]

WHY
[1-sentence reasoning — what this fix does and why it's safe]
```

---

## Anti-patterns Avoided

| ❌ Avoid | ✅ Do instead |
|---|---|
| "Try this and see if it works" | Verify hypothesis first, then fix |
| Refactoring entire file when bug is on line 42 | Touch only line 42 (or its immediate scope) |
| Fixing 3 bugs at once | Fix one bug per cycle, commit, then move to next |
| Suggesting a library swap as a "fix" | Library swaps are refactors, not bug fixes |
| Adding `try/catch` without diagnosing root cause | Catch silences symptoms; find why it threw |
| "It's probably a race condition" without evidence | State as hypothesis, then verify with logs/test |

---

## Example Session

**User input:**
```
maji-debug — login form throws "Cannot read property 'email' of undefined"
File: src/auth/login.ts
```

**Claude output:**
```
SYMPTOM
TypeError on src/auth/login.ts when login form submits — accessing user.email on undefined.

HYPOTHESIS
Most likely: API response shape changed and user object is now nested under user.data.
Evidence: line 14 reads response.user.email; if response shape is { data: { user: {...} } }, this would throw.

VERIFICATION
Reading src/auth/login.ts:14 + src/api/types.ts...
Confirmed: api/types.ts line 8 shows LoginResponse type wraps user under data field.

FIX
src/auth/login.ts:14
- const email = response.user.email
+ const email = response.data.user.email

WHY
Aligns with current LoginResponse type. No other paths affected — this line is the only consumer.
```

---

## Composes With `maji-mode` and `maji-review`

- `maji-mode` ensures terse output (no padding, banned phrases)
- `maji-review` can run after fix to verify no regressions introduced
- `maji-commit` writes the commit message after fix is verified

---

## Customization

Common adjustments via fork:

- Add language-specific debug patterns (Rust borrow checker, Python async, etc.)
- Add framework-specific patterns (React rendering bugs, Next.js hydration)
- Adjust verification thresholds (some teams require failing test before fix)
- Add severity-based escalation (production bug = different protocol)

---

*`maji-debug` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By [MAJI](https://maji.org) · No Codes, Only Vibes.*
