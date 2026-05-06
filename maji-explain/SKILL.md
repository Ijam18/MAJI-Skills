---
name: maji-explain
description: Concise code or concept explainer. Lead with one-sentence answer, then layered detail only if useful. No padding, no "let me walk you through". Use when encountering unfamiliar code, library, error message, or concept and you want fast comprehension instead of a textbook lecture.
---

# maji-explain — Fast, Layered Explanations

A skill that explains code, concepts, errors, or libraries in 3 layers: 1-sentence answer → 1-paragraph detail → full deep-dive only on request. No "let me walk you through this", no "great question!".

---

## When to Use

Type `maji-explain <target>` where target is:

- A code snippet (`maji-explain function debounce...`)
- A library/concept (`maji-explain useEffect`)
- An error message (`maji-explain TypeError: cannot read...`)
- A pattern (`maji-explain dependency injection`)
- A file path (`maji-explain src/auth.ts`)

---

## The 3-Layer Format

### Layer 1 — One-sentence answer (always)

A direct answer to "what is this?" or "what does it do?". Max 25 words.

### Layer 2 — Brief context (always)

3-5 bullets covering:

- Key inputs/outputs (for code)
- Why it exists / problem it solves
- Common usage pattern
- Notable gotchas / edge cases

### Layer 3 — Deep dive (only on request)

Triggered by user follow-up: "explain more", "go deeper", "what about [specific aspect]".

Includes:

- Full mechanism
- Code walkthrough line-by-line (if applicable)
- Comparison with alternatives
- Internals / implementation notes

---

## Output Format

```
[Layer 1 — 1-sentence answer]

Key points:
• [bullet 1]
• [bullet 2]
• [bullet 3]
• [bullet 4]

Want deeper detail on [specific aspect]?
```

---

## Examples

### Example 1 — React `useEffect`

**Input:**
```
maji-explain useEffect
```

**Output:**
```
useEffect runs side effects after a React component renders, with optional dependency tracking.

Key points:
• Fires after the DOM updates, not during render
• Dependency array controls when it re-runs: [] = once on mount, [x] = when x changes, omitted = every render
• Return a function to clean up before next effect or unmount
• Common uses: data fetching, subscriptions, manual DOM manipulation
• Gotcha: stale closures — if you reference outer state without listing it in deps, you'll see old values

Want deeper detail on dependency arrays, cleanup timing, or the mental model?
```

### Example 2 — Error Message

**Input:**
```
maji-explain "TypeError: Cannot read properties of undefined (reading 'map')"
```

**Output:**
```
You're calling .map() on something that doesn't exist yet — likely an array that hasn't loaded.

Key points:
• Most common cause: data is fetched async; component renders before data arrives
• Quick fix: guard with `data?.map(...)` or default to `[]` (`(data ?? []).map(...)`)
• Better fix: check loading state before rendering the list
• Alternative: ensure your initial state is an array, not undefined
• If it's not async data, check upstream: where is the variable assigned? May be a typo or wrong key.

Want deeper detail on which fix fits your case (need to see the code)?
```

### Example 3 — Code Snippet

**Input:**
```
maji-explain
function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
```

**Output:**
```
debounce returns a wrapped version of fn that only fires after `ms` milliseconds of silence — repeated calls reset the timer.

Key points:
• Closure captures `timer` — each call to the outer function creates one independent debounced wrapper
• `clearTimeout` cancels the pending call; `setTimeout` schedules a new one
• Common uses: search input, resize handler, autosave on form change
• Gotcha: `this` binding lost — if fn relies on `this`, use `function` form and explicit binding
• Alternative: throttle (fires at most once per ms, regardless of call frequency)

Want deeper detail on the closure, throttle vs debounce, or RxJS equivalents?
```

---

## Anti-patterns Avoided

| ❌ Avoid | ✅ Do instead |
|---|---|
| "Great question! Let me explain..." | Lead with the answer |
| Walls of paragraphs before the point | Layered: 1 sentence → bullets → deep on request |
| "There are many things to consider here" | Pick the 3-5 most useful points |
| Explaining what user already knows from context | Skip background; address the specific ask |
| "I hope this helps!" closer | End with offer of deeper detail (only if useful) |
| Restating the input verbatim | Move directly to insight |

---

## Composes With `maji-mode`

`maji-mode` enforces token discipline; `maji-explain` is structured to fit that discipline naturally — layered output means user gets exactly the depth they need, not more.

---

## Customization

Common adjustments via fork:

- **Audience-specific depth** — for beginners, more bullets; for seniors, drop bullet 3
- **Domain-specific patterns** — add common React gotchas, common Rust patterns, etc.
- **Language preference** — translate output to user's preferred language
- **Code-only mode** — for explaining code, skip prose entirely; output annotated code

---

*`maji-explain` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By [MAJI](https://maji.org) · No Codes, Only Vibes.*
