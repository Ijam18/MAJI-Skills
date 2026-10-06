---
name: maji-app-capture
description: Capture the real app (not mockups) with seeded demo data and turn it into a user manual PDF, an interactive click-through demo, a pitch or briefing deck, or poster and video assets. Syncs to the latest main, maps the real flow, seeds fictional data in a disposable DB, logs in per role with Playwright, captures @2x, annotates, builds the deliverable, then restores the DB and env. Never fabricates a flow. Use when someone says "make a user manual with screenshots", "screenshot every step", "build an interactive demo", "pitch deck with real screens", "use real app screenshots for the poster", or in casual Malay "ambil screenshot dari localhost", "buat manual guna playwright", "buatkan supademo".
---

# maji-app-capture: Real App Capture

Produce documentation and marketing assets from the app as it actually behaves. Final output: annotated screenshots or clips plus the deliverable (manual PDF, interactive demo, deck, poster assets), with the environment restored to its pre-capture state.

## When to use / when not

Use when:
- A client or team needs a per-role user manual, slide manual or guided demo.
- Posters, videos or decks must show the real UI, not AI mockups.
- The same capture has to be redone often (new release, new language).

Not for:
- Designing a new UI (use maji-ui-review first, capture after approval).
- Anything that would need real user data on screen.

## Steps

1. **Scope.** Audience, language, roles to cover, deliverable type, layout mix (full screenshot, feature grid, stats). Look at the previous deliverable of the same kind if one exists.
2. **Sync and map the real flow.** Pull latest main first. Read the code (routes, role guards, wizard steps) to map the actual flow; list every navigation step, including small ones (reset pages, confirmations). Never invent a flow. Keep a per-client glossary of role and feature names.
3. **Isolate.** Work in a clean `git worktree add --detach` or a local-only branch; the product repo must not change. Back up the DB (dump) or point at a disposable database. Keep build scripts and generated images in a fixed project folder, not a temp scratchpad.
4. **Seed demo data.** Fictional names checked against a deny-list of real organisations (plus a quick web search). Enough rows to show pagination. One record that stays consistent from first step to last. If the repo is receive-only, keep seed scripts outside it. Tools: framework seeders, `supabase db reset` + seed SQL, a `reset.sh`.
5. **Serve safely.** Production build on a loopback, disposable port, not the dev server (HMR makes captures slow and inconsistent). Freeze the clock to the publish date, enable reduced motion, hide demo badges and popups, switch the mail service to a no-op, intercept or block POSTs that would mutate data, point cloud disks and queues to local.
6. **Capture.** Playwright logs in per role with test accounts, sets phone or desktop viewport with `deviceScaleFactor: 2`, waits for idle, screenshots each step. Measure element rects straight from the DOM (`boundingBox()`) for annotation and hotspots. Drive the steps from a data file (`steps.mjs`: goto, fill, click, box, badge, caption) so reruns are one command.
7. **Annotate and build.**
   - Manual: PIL red boxes + numbered badges; HTML in the client's brand; Chromium `page.pdf()` (portrait manual or landscape slides) or reportlab; one PDF per role plus a master with cover and TOC.
   - Interactive demo: render opening, chapter, recap and closing cards to PNG; write storyboard, callouts and presenter script; the owner logs into the demo tool in their own browser and the agent attaches over CDP to upload steps one by one and set hotspots.
   - Deck: reportlab (PDF) or pptxgenjs (PPTX with speaker notes); honest status chips (Available / Partial / Next phase); placeholders where metrics do not exist yet.
   - Poster or video: export frames into the poster or film components.
8. **QA.** Contact sheet of every frame; read every PDF page (pdftoppm). Blur PII. Audit visible text for localhost URLs, old product names, stray brand words, dates that contradict the post date.
9. **Restore.** Restore the DB, revert env changes (app name, hot files, mail no-op), remove the worktree, stop the server. Confirm nothing is left behind.

## Variants

- **Per-role user manual** + master PDF (cover, TOC, FAQ).
- **Slide manual**: one step per page, landscape.
- **Interactive demo** with hotspots, chapters and SEO fields, in two languages.
- **Marketing capture**: phone screenshots and clips for posters and video.
- **Pitch or briefing deck** mixing real screens with generated photos.

## Pitfalls

- **Stale clone documented the wrong flow until a domain expert caught it.** Guard: pull main first and have a domain expert check the step list.
- **Flow in the manual does not match the system; reviewer rejects it.** Guard: every step must come from a real capture, never from memory.
- **A capture wizard sent real emails.** Guard: no-op the mail service during capture, revert after.
- **Blank screenshots (no demo data for that account or year).** Guard: seed test accounts and data before the first shot. If there is no DB dump and migrations cannot rebuild the schema, sort that out before planning captures.
- **Sample names match real organisations.** Guard: deny-list plus web search.
- **Dated badges (LIVE, Today) disagree with the post date.** Guard: freeze the clock.
- **Side effects left behind (env name, backup hot file, record state).** Guard: a restore checklist, run every time.
- **DB restore aborts on replication (GTID) lines.** Guard: strip them before import.
- **Interactive demo tool quirks.** Free plan limits (demo count, watermark, paywalled chapters), image replace corrupting a demo, drag reorder off by one, bulk upload scrambling order. Guard: duplicate instead of replace, select + insert-after, upload one at a time, back up before deleting old demos.
- **Automating a Google login or storing passwords.** Guard: the owner logs in; the agent only attaches. If another browser holds `127.0.0.1:9222`, use `[::1]:9222`.
- **Scratchpad wiped the build script and generated images.** Guard: fixed folder; recover images with `pdfimages` if needed.
- **`printToPDF` truncates slides; previews lack fonts.** Guard: set page size explicitly, check page count, render with metric-compatible fonts (Carlito for Calibri).
- **Tone drifts too casual or too stiff after revisions; wrong role names.** Guard: language per audience, glossary file read by every deliverable.
- **Too technical: bullets only, tiny screenshots.** Guard: big screenshots; one annotated feature map can beat fifteen steps.
- **Overclaiming (MFA, encryption, integrations that do not exist).** Guard: only claim what was captured.
- **Generated photos crop heads or get cultural details wrong.** Guard: review each image before placing it.
- **Local tooling hangs.** A REPL waits on stdin (`< /dev/null`), a single-threaded dev server drops logins (retry or multi-worker), the local DB gateway dies (stop and start the stack), the newest language runtime breaks the stack (pin the previous version).
- **Deck layout breaks.** Numbers overflow their boxes; some PDF libraries ignore alpha on shapes. Guard: read every rendered page, not just the first.

## Done when

- [ ] Flow mapped from latest main and checked against the real app
- [ ] Demo data fictional, consistent, paginated; no PII visible
- [ ] Every role and step captured at 2x; annotations aligned to DOM rects
- [ ] Deliverable built and every page or frame read
- [ ] Text audit clean (no localhost, old names, wrong dates, overclaims)
- [ ] DB and env restored, worktree removed, server stopped
- [ ] Build scripts saved in the project for the next rerun

## Composes with

- **maji-ui-review**: approve the UI before capturing it.
- **maji-code-video**: uses these captures as footage.
- **maji-brand-pdf**: renders and checks the manual or deck PDF.
- **maji-poster-batch**: places phone captures into poster layouts.
- **maji-mode**: discuss scope first; confirm before any DB restore.
- **maji-review**: check seed and capture scripts before they touch a database.

---

*`maji-app-capture` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
