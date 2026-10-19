---
name: maji-responsive-audit
description: Audit and fix a web page or component for every screen size. Checks mobile-first layout, dynamic viewport units, safe-area insets, 44px touch targets, fluid type, container queries, responsive images, horizontal overflow and mobile form inputs at 320, 375, 768, 1024 and 1440 px, then reports findings by severity with file:line and the fix. Use when asked to "make this responsive", "fix the mobile layout", "check it on phone", or before shipping a new page.
metadata:
  tier: core
  category: frontend
  version: "1.0.0"
---

# maji-responsive-audit: Every Screen, Checked

A skill that checks a page or component at real widths, finds what breaks, and fixes it with the smallest change. Framework-neutral; examples use Tailwind classes, the same rules apply to plain CSS.

---

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders). If `me/overrides/maji-responsive-audit.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to Use

- "Make this page responsive", "fix the mobile layout", "it looks broken on my phone"
- Before shipping a new page or component
- After a design change that touched layout, type sizes or images

Target: a file, a route, a component, or "all" (every route under the app folder).

---

## Steps

1. **Scope.** List the files for the target route or component, including layouts and shared components it renders.
2. **Look at it.** If the app runs locally, capture screenshots at **320, 375, 768, 1024 and 1440 px** wide (Playwright or the browser's device toolbar). If it does not run, audit the code alone and say so in the report.
3. **Check the ten rules below** against the code and the screenshots.
4. **Report** findings grouped by severity, each with `file:line`, the broken width and the fix.
5. **Fix** with the smallest change that keeps the design. Re-capture the same widths and compare.

---

## The ten rules

1. **Mobile first.** Base styles are for the smallest screen; larger screens are layered on with min-width breakpoints (`md:flex-row`), not undone with max-width overrides.
2. **Dynamic viewport units.** Full-height sections use `dvh` (`min-h-dvh`), not `vh` / `h-screen`, so mobile browser bars don't cause gaps or overflow.
3. **Safe areas.** Fixed headers, bottom bars and sticky buttons pad with `env(safe-area-inset-*)`; the page has `viewport-fit=cover` when it draws edge to edge.
4. **Touch targets at least 44 x 44 px**, with at least 8 px between neighbouring targets. Small icons get padding, not a bigger icon.
5. **Fluid type.** Headings scale with `clamp()` (for example `clamp(1.75rem, 4vw + 1rem, 3rem)`); body text never drops below 16 px on phones.
6. **Container queries** for components that live in different column widths (cards in a sidebar and in a grid), instead of guessing from the viewport.
7. **Images and media.** Responsive `srcset` / `sizes` (or the framework image component), `aspect-ratio` instead of fixed width and height, video and iframes in an aspect-ratio box.
8. **No horizontal scroll.** Long strings get `overflow-wrap: anywhere` or truncation; wide tables scroll inside their own wrapper; flex and grid children that must shrink get `min-width: 0`.
9. **Mobile forms.** Inputs at 16 px or larger (stops iOS zoom on focus), the right `inputmode` and `autocomplete`, errors shown under the field, submit button clear of the home bar.
10. **Motion and preferences.** Animations respect `prefers-reduced-motion`; nothing essential is hidden on small screens (restructure instead of `hidden md:block` for real content).

---

## Report format

```
Responsive audit: <target>   widths checked: 320 375 768 1024 1440

🔴 Breaks (content lost, overflow, unusable)
- app/pricing/page.tsx:42 at 320px: plan cards overflow, page scrolls sideways
  fix: grid-cols-1 base, md:grid-cols-3; add min-w-0 to the card

🟡 Degraded (works, but hard to use)
- components/Nav.tsx:18 at 375px: menu icon target is 28px
  fix: p-2 on the button (44px target)

🟢 Polish
- app/page.tsx:9: hero uses h-screen
  fix: min-h-dvh

Summary: 1 breaks, 1 degraded, 1 polish. Fixed: 3. Re-checked at all widths.
```

---

## Rules

- **Measure, don't guess:** a finding names the width where it breaks.
- **Smallest fix:** change classes or one CSS rule; don't restructure a component that only needs `min-w-0`.
- **No screen-size JavaScript** for layout (no `window.innerWidth` in render, no resize listeners for breakpoints); CSS handles it and avoids hydration mismatches.
- **Don't add a responsive library** for what media and container queries already do.
- **Leave design-system primitives alone:** wrap them if a page needs different behaviour.

---

## Pitfalls

| Failure | Guard |
|---|---|
| Audit only at desktop and one phone | Always the five widths, 320 included |
| Fix at one width breaks another | Re-capture all widths after every fix |
| Content hidden on mobile to "fix" layout | Restructure; hide only decoration |
| iOS zooms into every input | 16 px minimum input font size |
| Sideways scroll from one long URL | `overflow-wrap: anywhere` on user text |

---

## Done when

- [ ] All five widths checked (or the report says why not)
- [ ] Every finding has file:line, width and fix
- [ ] Fixes applied and re-checked at every width
- [ ] No horizontal scroll at 320 px

---

*`maji-responsive-audit` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
