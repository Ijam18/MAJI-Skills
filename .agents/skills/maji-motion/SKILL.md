---
name: maji-motion
description: "Build, fix and review web motion that feels physical and premium in Next.js, React, CSS or Framer Motion: decide whether it should animate at all, wire motion tokens (easing, durations, enter longer than exit, press scale), use springs without overshoot by default, animate composite-only properties, ship reduced-motion and interruption with the animation, and run a motion review with a findings table. Use when someone says \"animate this\", \"add a transition\", \"make it feel smoother\", \"the animation is janky\", \"it drops frames\", \"review the motion\", \"audit the animations\", \"add motion tokens\", \"make the drawer feel native\". Not for token and lint setup across the whole UI (use maji-token-lint) or the full visual review loop (use maji-ui-review)."
metadata:
  tier: workflow
  category: product
  version: "1.0.0-lite"
---

# maji-motion: Physical, Premium Web Motion

Every animation earns its place, uses the shared tokens, runs on the compositor and can be interrupted. Final output: the motion code (or a deliberate "no animation" call) plus a findings table when reviewing existing motion.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Brand, Folders). If `me/overrides/maji-motion.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use when building a transition, drawer, toast, dropdown, press state or gesture, when motion feels slow, cheap or janky, or before shipping a UI pass.
- Use in review mode on a diff, a page or a whole codebase (read-only; findings first, fixes when asked).
- Not for defining the full token set and lint guards (maji-token-lint), nor for layout, copy and colour critique (maji-ui-review).

## Steps

1. **Gate: should it animate at all?** Rate frequency.
2. **Name the purpose in one word:** feedback, spatial (where it came from or went), state, continuity (bridging a jarring change), explanation or delight (rare tier only).
3. **Use the tokens, extend never fork.** If the repo already has motion tokens (maji-token-lint), use them.
4. **Pick the cheapest tool.** CSS transition for hover, press and class toggles; `@starting-style` for enter without JS; CSS animation for predetermined motion that plays while the page is busy (route change, fetch, hydration); WAAPI for programmatic control; Framer Motion only for springs, layout, exit-on-unmount and gestures.
5. **Animate composite-only properties.** `transform` and `opacity`; `clip-path` for reveals; `height` tolerated only for accordions.
6. **Springs without overshoot by default.** `{ type: "spring", bounce: 0, duration: 0.4 }` for UI.
7. **Interruption.** Anything triggered rapidly (toast, toggle, drawer) uses transitions or springs, never keyframes, so it retargets from the current value.
8. **Reduced motion and pointer gating ship with it.** `@media (prefers-reduced-motion: reduce)` swaps movement for a short opacity crossfade (fewer and gentler, not zero); `useReducedMotion()` in Framer Motion.
9. **Stagger and press.** Group entrances stagger 30-80ms per item and never block interaction.
10. **Verify by feel and by frames.** Play at 2-5x duration in the DevTools Animations panel, record the Performance panel for long tasks and dropped frames, test gestures on a real mid-range phone (120Hz gives an 8ms frame budget).

## Composes with

- **maji-token-lint**: owns the motion tokens and fails builds on `transition-all` and arbitrary durations.
- **maji-ui-review**: the wider visual pass this motion review plugs into.
- **maji-pwa**: press feedback and touch gating for the installed app.
- **maji-native-wrap**: sheet and gesture motion inside the store app.
- **maji-review**: severity-grouped review when motion is one part of a bigger diff.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-motion` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
