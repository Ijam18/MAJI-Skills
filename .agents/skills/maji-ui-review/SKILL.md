---
name: maji-ui-review
description: Visual UI review loop for web apps and PWAs. Lock the brand or a native reference, build 2-3 clickable mockups, serve them to a real phone, tweak straight from the reviewer's screenshots, prove each change with headless desktop + mobile screenshots, then port in phases and polish copy, PWA, SEO and performance. Use when someone says "revamp this UI", "make it feel like a native app", "here's a screenshot, fix this", "make it mobile / PWA", "do a mockup first", "the page is slow", "remove the em-dashes", or in casual Malay "jom bincang UI ni", "buat mockup dulu", "tak cantik la, betulkan ni". Not for backend-only work or pixel-perfect handoff from a finished design file.
metadata:
  tier: workflow
  category: product
  version: "1.0.0-lite"
---

# maji-ui-review: UI Review Loop

Turn "it doesn't look right" into an approved, shipped UI. Final output: a UI the reviewer approved on a real device, with screenshot proof and a polish pass (copy, PWA, SEO, perf).

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Brand, Folders). If `me/overrides/maji-ui-review.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use when:
- A UI is being created or revamped and the reviewer judges visually (screenshots, phone).
- Small tweaks arrive as "screenshot + one line" ("move this", "remove that button").
- A web app must feel native on a phone or install as a PWA.
- A page is slow, or copy needs a tone / punctuation / language sweep.

Not for:
- Logic bugs with no visual symptom (use maji-debug).
- Approved pixel-perfect specs where no review loop is needed.

## Steps

1. **Lock the brand or the reference first.** Ask brand questions (audience, vibe, colours) or read the existing brand kit (PDF, Canva brand kit via Canva MCP).
2. **Mockup 2-3 concepts before wiring anything.** Desktop + mobile.
3. **Serve to a real phone.** LAN review (same Wi-Fi), `cloudflared tunnel --url http://localhost:3000` quick tunnel, or a Vercel preview.
4. **Tweak from screenshots.** Reviewer sends screenshot + short instruction.
5. **Prove it before saying done.** Playwright: log in with a test account, open the route, wait for network idle, screenshot desktop and mobile viewports.
6. **Port to the real app in phases** until the reviewer says the design is okay.
7. **Polish pass.**

## Composes with

- **maji-mode**: discuss mode for revamps; ask before deploys.
- **maji-app-capture**: real-app screenshots for posters, manuals and decks once the UI is approved.
- **maji-code-video**: promo video from the approved UI.
- **maji-debug**: when a visual bug survives one fix.
- **maji-ship**: preview deploy for phone review, then the gated production release.
- **maji-review** and **maji-commit**: review the diff, one commit per tweak.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-ui-review` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
