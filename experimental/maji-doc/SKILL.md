---
name: maji-doc
description: Generate concise documentation from code. README, function docs, API references, architecture notes — written in plain language, with examples that work, no padding. Use when shipping or onboarding and you want docs that read fast and stay accurate.
---

# maji-doc — Concise Documentation Generator

A skill that reads code (file, module, project) and writes documentation that's actually useful — no padding, no platitudes, examples that work.

---

## When to Use

Type `maji-doc <target>` where target is:

- A file (`maji-doc src/auth.ts`)
- A folder (`maji-doc src/api/`)
- A whole project (`maji-doc .` — generates README)
- A function/class (`maji-doc src/utils.ts:debounce`)

---

## Output Types

### 1. README (project-level)

Sections in order:

```
# Project Name
1-sentence what-it-does

## Quick Start
3-step install + minimal usage

## Features
3-7 bullets — actual capabilities, not marketing

## Usage
1-2 concrete examples that work

## API / Reference
Public surface only

## License
```

### 2. Function/Class Docs

```
funcName(args) — 1-sentence purpose.

Args:
- arg1 (type) — what it is
- arg2 (type) — what it is

Returns: (type) — what comes back

Example:
[code, 3-5 lines]

Notes (if non-obvious):
- [edge case, gotcha, performance]
```

### 3. Architecture Notes

```
[Component] — what role it plays.

Inputs: where data comes in
Outputs: where data goes
Dependencies: what it needs to function
Failure modes: what breaks it
```

---

## Rules

- **Write WHY for non-obvious choices, never WHAT for obvious code**
- **Examples must run** — copy-paste should work without modification
- **Use plain English** — no "leverage", "utilize", "facilitate"
- **No padding** — drop "This function" / "It is responsible for..." preambles
- **Scope to public surface** — don't document private internals in API docs
- **Stay under 250 words per section** — if longer, split into sub-sections

---

## Anti-patterns Avoided

| ❌ Avoid | ✅ Do instead |
|---|---|
| "This function takes a number and returns a number" | `square(n) — returns n × n` |
| "Comprehensive guide to..." (then 5 paragraphs) | Quick start + reference link |
| Documenting auto-generated boilerplate | Skip; the code is the doc |
| "Please see the documentation" links to nothing | Either link to real doc or write it inline |
| Explaining what's visible in the code | Explain decisions hidden in the code |

---

## Example

**Input:**
```typescript
export async function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): Promise<T> {
  let timer: NodeJS.Timeout
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}
```

**Output:**
```
debounce(fn, ms) — wraps a function so it only fires after ms milliseconds of silence.

Args:
- fn (function) — function to debounce
- ms (number) — silence period in milliseconds

Returns: a debounced version of fn with the same signature.

Example:
const search = debounce((query) => fetchResults(query), 300)
input.addEventListener('input', e => search(e.target.value))
// fires once, 300ms after user stops typing

Notes:
- `this` binding is lost — use arrow functions or bind explicitly if needed
- Cancel pending call by reassigning the reference
```

---

## Composes With Other Skills

- `maji-explain` — for understanding code first
- `maji-review` — to spot undocumented public APIs
- `maji-mode` — token discipline applies (no padding)

---

## Customization

Common adjustments via fork:

- Add framework-specific sections (React component props, Next.js routes)
- Add team templates (e.g., RFC format, ADR format)
- Adjust tone (some teams want formal, some casual)

---

*`maji-doc` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By [MAJI](https://maji.org) · No Codes, Only Vibes.*
