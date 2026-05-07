---
name: maji-test
description: Generate disciplined test cases. Focus on behaviour not implementation, cover edge cases without bloat, name tests for the case not the function. Use when writing tests for new code or filling gaps in coverage.
---

# maji-test — Disciplined Test Generation

A skill that generates tests focused on behaviour and edge cases, not on padding coverage numbers.

---

## When to Use

Type `maji-test <target>` where target is:

- A function (`maji-test src/utils.ts:parseDate`)
- A file (`maji-test src/auth.ts`)
- A failing scenario (`maji-test "user submits empty form"`)

---

## Test Structure (per case)

```
test('[case description in plain English]', () => {
  // Arrange
  [setup minimum needed state]

  // Act
  [single action being tested]

  // Assert
  [single behaviour being verified]
})
```

One test = one case = one assertion (where reasonable).

---

## Cases to Cover (in this order of priority)

### 1. Happy Path (always)

The normal expected use. If this breaks, the feature is unusable.

### 2. Edge Cases (often)

- Empty input (`""`, `[]`, `{}`, `null`, `undefined`)
- Boundary values (0, -1, max-int, very long strings)
- Type-coerced values (string `"0"` vs number `0`)
- Whitespace, special characters, unicode

### 3. Error Cases (when relevant)

- Invalid input (wrong type, missing required field)
- External service failures (timeout, 500 response)
- Concurrency issues (if applicable)

### 4. Integration (selectively)

- Cross-module behaviour
- Real DB / real API calls (sparingly — slow tests are ignored tests)

---

## Naming Convention

| ❌ Bad | ✅ Good |
|---|---|
| `test('login')` | `test('login returns user when credentials match')` |
| `test('parseDate works')` | `test('parseDate returns null for empty string')` |
| `test('submit')` | `test('submit shows error when email is invalid')` |

Pattern: `test('[subject] [behaviour] when [condition]')`.

---

## Rules

- **One assertion per test** (mostly) — if 3 assertions in one test, split if they verify different behaviours
- **No mock the world** — mock only what crosses a boundary (DB, network, time)
- **No snapshot tests for logic** — snapshots fine for stable UI; bad for behavioural tests
- **No testing private internals** — test through public surface
- **No setup that's bigger than the test** — extract to helpers if it bloats
- **Skip generated tests** — tests that just call the function and check it returned add zero value

---

## Output Format

```
[Filename]: target_test.ts (or .test.ts / .spec.ts per project convention)

[describe block name]

  ✓ test cases listed by priority:

  Happy path:
    - [case 1]
    - [case 2]

  Edge cases:
    - [empty input]
    - [boundary]
    - [special chars]

  Error cases:
    - [invalid input]
    - [external failure]

[Then: full code for selected cases]
```

User picks which cases to generate code for; not always all of them.

---

## Example

**Input:**
```
maji-test parseDate

function parseDate(input: string): Date | null {
  if (!input || typeof input !== 'string') return null
  const d = new Date(input)
  return isNaN(d.getTime()) ? null : d
}
```

**Output:**
```
src/utils/parseDate.test.ts

describe('parseDate')

  Happy path:
    - returns Date for valid ISO string
    - returns Date for valid date string

  Edge cases:
    - returns null for empty string
    - returns null for null input
    - returns null for undefined input
    - returns null for whitespace-only string

  Error cases:
    - returns null for malformed date string
    - returns null for non-string input (number, object)

Code (selected cases):

import { describe, it, expect } from 'vitest'
import { parseDate } from './parseDate'

describe('parseDate', () => {
  it('returns Date for valid ISO string', () => {
    const result = parseDate('2026-05-07')
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString().startsWith('2026-05-07')).toBe(true)
  })

  it('returns null for empty string', () => {
    expect(parseDate('')).toBeNull()
  })

  it('returns null for malformed date', () => {
    expect(parseDate('not-a-date')).toBeNull()
  })

  it('returns null for non-string input', () => {
    // @ts-expect-error testing runtime behaviour
    expect(parseDate(42)).toBeNull()
    // @ts-expect-error testing runtime behaviour
    expect(parseDate({ year: 2026 })).toBeNull()
  })
})
```

---

## Anti-patterns Avoided

| ❌ Avoid | ✅ Do instead |
|---|---|
| `test('it works')` | Specific case description |
| 100% coverage as the goal | Cover behaviours users hit; coverage is a side-effect |
| Mocking the function under test | Mock only boundaries (DB, time, network) |
| Tests that call the function and don't assert anything meaningful | Assert behaviour, not "no error thrown" |
| Snapshot tests for business logic | Explicit assertions; snapshots for stable UI only |
| One test that asserts 12 things | Split into 12 focused tests |

---

## Composes With

- `maji-debug` — when test fails, run debug protocol
- `maji-review` — verify tests cover the right behaviours
- `maji-mode` — token discipline applies (no preamble)

---

## Customization

- Adjust to your test framework (Jest, Vitest, Mocha, Playwright)
- Add team conventions (file naming, describe nesting depth)
- Add framework-specific patterns (React Testing Library, Cypress)

---

*`maji-test` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By [MAJI](https://maji.org) · No Codes, Only Vibes.*
