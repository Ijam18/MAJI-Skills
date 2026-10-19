---
name: maji-typescript-strict
description: TypeScript type-safety discipline for agents editing .ts and .tsx files. Never write `as any`; reach for a type guard, a schema parse at the boundary, `satisfies`, `unknown`, or an exhaustive `never` check instead; keep unavoidable casts inside one typed wrapper. Also audits a file or folder for existing `any`, unsafe casts and non-null assertions, and fixes them in order of risk. Use whenever writing TypeScript, when type errors are being silenced, or when asked to "clean up the types" or "remove the any".
metadata:
  tier: core
  category: dev
  version: "1.0.0"
---

# maji-typescript-strict: No `any`, No Silent Casts

A skill that keeps type checking switched on. `as any` turns off every check on a value and on everything derived from it, so a single cast can hide a whole class of bugs. This skill replaces each one with something the compiler can still verify.

---

## Step 0: your context

Read `me/profile.md` if it exists (Stack). If `me/overrides/maji-typescript-strict.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to Use

- Any time you write or edit `.ts` / `.tsx` code
- A type error is about to be "fixed" with a cast
- "Clean up the types", "remove the any", "why is TypeScript not catching this?"

---

## The core rule: never `as any`

Instead, in this order:

| # | Situation | Use |
|---|---|---|
| 1 | You can check the shape at runtime | **Type guard**: `typeof`, `in`, `instanceof`, or `function isUser(x: unknown): x is User` |
| 2 | Data crosses a boundary (JSON, fetch, storage, env, query params, form data) | **Schema parse** with your validator (zod, valibot): `const user = UserSchema.parse(json)` |
| 3 | You want a literal checked against a type without widening it | **`satisfies`**: `const routes = { home: "/" } satisfies Record<string, string>` |
| 4 | You don't know the type yet | **`unknown`**, then narrow with 1 or 2 |
| 5 | A `switch` / `if` chain must cover every case | **Exhaustive check**: `default: { const _x: never = value; throw new Error(...) }` |
| 6 | A library's types are wrong or missing | **Fix the type upstream**: a local `.d.ts` augmentation, a patch, or a typed re-export |
| 7 | Already validated and nothing above fits | `as unknown as T`, once, with a one-line comment saying what validated it |

If a cast is truly unavoidable (untyped third-party glue), put it inside **one typed wrapper function** and comment the constraint. The rest of the code calls the wrapper and never sees `any`.

---

## Also watch

- **Non-null assertions (`x!`):** narrow instead (`if (!x) return`), or make the type non-optional at the source.
- **`// @ts-ignore`:** use `// @ts-expect-error <reason>` so it fails loudly once the error is gone.
- **Implicit `any`:** untyped function parameters, `catch (e)` used as an object (narrow with `e instanceof Error`), `JSON.parse` results passed straight on.
- **Index access:** with `noUncheckedIndexedAccess`, `arr[i]` is `T | undefined`; check it rather than cast it.
- **Recommended tsconfig flags:** `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes` (turn on one at a time in older codebases).

---

## Audit mode

`audit <file or folder>`:

1. Search for `as any`, `: any`, `<any>`, `as unknown as`, `!` non-null assertions, `@ts-ignore`, `@ts-nocheck`.
2. Rank by risk: boundary data (API, storage, env) first, then shared utilities, then local code.
3. For each finding, give `file:line`, the replacement from the table and the reason.
4. Fix in that order, running the type checker (`tsc --noEmit` or the project's typecheck script) after each batch.

```
TypeScript audit: src/   12 findings

High (boundary data)
- src/api/client.ts:31  `res.json() as any` → parse with OrderSchema
- src/lib/env.ts:8      `process.env.KEY!` → validate env once at startup

Medium (shared code)
- src/utils/merge.ts:14  `(a as any)[k]` → generic with keyof T

Low (local)
- src/ui/Table.tsx:52  `// @ts-ignore` → @ts-expect-error with reason, or fix the prop type

Typecheck after fixes: 0 errors
```

---

## Rules

- **The type checker is the test:** run it after every change; a fix that adds errors elsewhere is not a fix.
- **Validate at the edge, trust inside:** parse once where data enters, pass typed values from there on.
- **Don't widen to make an error go away:** `string` to fix a union mismatch hides the same bug as a cast.
- **No new dependency** just to remove one cast; use the validator the project already has, or a type guard.

---

## Pitfalls

| Failure | Guard |
|---|---|
| `as any` replaced by `as unknown as T` everywhere | That's the last option, only after validation |
| Schema and type drift apart | Derive the type from the schema (`z.infer<typeof Schema>`) |
| `catch (e: any)` | `catch (e)` then `e instanceof Error` |
| Strict flags switched on all at once in a big repo | One flag at a time, fix, commit |

---

## Done when

- [ ] No new `any`, `as any`, `@ts-ignore` or unexplained `!`
- [ ] Boundary data is parsed, not cast
- [ ] The type checker passes with zero errors
- [ ] Any remaining cast lives in one commented wrapper

---

*`maji-typescript-strict` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
