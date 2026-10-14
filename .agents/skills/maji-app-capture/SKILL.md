---
name: maji-app-capture
description: Capture the real app (not mockups) with seeded demo data and turn it into a user manual PDF, an interactive click-through demo, a pitch or briefing deck, or poster and video assets. Syncs to the latest main, maps the real flow, seeds fictional data in a disposable DB, logs in per role with Playwright, captures @2x, annotates, builds the deliverable, then restores the DB and env. Never fabricates a flow. Use when someone says "make a user manual with screenshots", "screenshot every step", "build an interactive demo", "pitch deck with real screens", "use real app screenshots for the poster", or in casual Malay "ambil screenshot dari localhost", "buat manual guna playwright", "buatkan supademo".
metadata:
  tier: workflow
  category: product
  version: "1.0.0-lite"
---

# maji-app-capture: Real App Capture

Produce documentation and marketing assets from the app as it actually behaves. Final output: annotated screenshots or clips plus the deliverable (manual PDF, interactive demo, deck, poster assets), with the environment restored to its pre-capture state.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Brand, Folders). If `me/overrides/maji-app-capture.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use when:
- A client or team needs a per-role user manual, slide manual or guided demo.
- Posters, videos or decks must show the real UI, not AI mockups.
- The same capture has to be redone often (new release, new language).

Not for:
- Designing a new UI (use maji-ui-review first, capture after approval).
- Anything that would need real user data on screen.

## Steps

1. **Scope.** Audience, language, roles to cover, deliverable type, layout mix (full screenshot, feature grid, stats).
2. **Sync and map the real flow.** Pull latest main first.
3. **Isolate.** Work in a clean `git worktree add --detach` or a local-only branch; the product repo must not change.
4. **Seed demo data.** Fictional names checked against a deny-list of real organisations (plus a quick web search).
5. **Serve safely.** Production build on a loopback, disposable port, not the dev server (HMR makes captures slow and inconsistent).
6. **Capture.** Playwright logs in per role with test accounts, sets phone or desktop viewport with `deviceScaleFactor: 2`, waits for idle, screenshots each step.
7. **Annotate and build.**
8. **QA.** Contact sheet of every frame; read every PDF page (pdftoppm).
9. **Restore.** Restore the DB, revert env changes (app name, hot files, mail no-op), remove the worktree, stop the server.

## Composes with

- **maji-ui-review**: approve the UI before capturing it.
- **maji-code-video**: uses these captures as footage.
- **maji-brand-pdf**: renders and checks the manual or deck PDF.
- **maji-poster-batch**: places phone captures into poster layouts.
- **maji-mode**: discuss scope first; confirm before any DB restore.
- **maji-review**: check seed and capture scripts before they touch a database.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-app-capture` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
