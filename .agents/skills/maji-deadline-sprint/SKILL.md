---
name: maji-deadline-sprint
description: Run a fixed-date build sprint from brief to live demo. Lock scope into a coverage scoreboard, scaffold from an existing kit, seed realistic demo data, deploy early, then ship the demo pack (deck, narration, walkthrough video, QR card) and either quote the next phase or park with a resume point. Use for hackathons, tender or RFQ demos, client website sprints, event platforms and same-day pitch apps. Triggers include "hackathon this weekend", "demo before the tender closes", "build a pitch app by tomorrow", "client site in a week", "ship an MVP before the event", "jom buat demo untuk pitch", "kena siap sebelum event", "deploy cepat untuk client".
metadata:
  tier: workflow
  category: plan
  version: "1.0.0-lite"
---

# Deadline Sprint

Turn a brief with a hard date into a deployed demo plus pitch pack, then close with a quote or a parked resume point.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Ports, Tools and credits). If `me/overrides/maji-deadline-sprint.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use when:
- An event, tender, pitch or client launch has a fixed date and the scope is still loose.
- You need a working demo (not slides only) in 1 to 14 days.
- A second product can reuse the kit of a first one.

Not when:
- There is no date pressure: run a normal planned build.
- The ask is a fix or polish on a live product: use maji-debug or maji-review.
- The client is new and scope or payment is unknown: lock that first (step 1) or stop.

## Steps

1. **Lock scope in writing.** Turn the brief into one checklist: RFQ or tender becomes a coverage scoreboard per component; hackathon becomes the chosen track plus the judging rubric; client site becomes a sitemap.
2. **Pick the track once.** Set a pivot budget up front (for example one pivot, before the end of day 1).
3. **Scaffold from a kit, not from zero.** Reuse a sibling project's design kit (swap the accent color, keep the components) or gap-fill the team monorepo that already exists.
4. **Seed real-looking demo data.** Scrape public data (REST endpoint to JSON to your API) or seed personas per role (end user, admin, developer).
5. **Build by epic or by day, commit small.** One slice at a time (schema + auth, core flow, admin, extras).
6. **Deploy on day 1, not in the last hour.** Vercel, Fly.io, or a VPS with Docker Compose + GHCR images.
7. **Harden just enough.** Security headers/CSP, sitemap/robots, analytics, PWA manifest if it should install.
8. **Ship the demo pack.** Pick what the audience needs: deck PDF (Markdown + CSS via pandoc, weasyprint or Marp), narration script with timing cues for the slot (for example 4 minutes), a 60-second walkthrough video, a QR card to the live demo, or a formal letter requesting a presentation slot.
9. **Close the sprint.** Either quote the next phase by the modules already built (value per module, validity date), or freeze and park: write the resume point (branch, live URL, state, out-of-scope list, next 3 tasks) in the project notes.

## Composes with

- **maji-mode:** Pre-Action Gate for pivots, pushes and anything the client will see
- **maji-propose:** scope lock and plan before the build starts
- **maji-real-data:** sourced public data and seeds for the demo
- **maji-ship:** deploy gate, human-only production steps, live verification
- **maji-app-capture:** walkthrough video and deck from the real app
- **maji-offer:** next-phase quote by module
- **maji-session-handoff:** resume point when the sprint is parked
- **maji-test:** test kit for the main flow
- **maji-review:** pre-demo pass on the diff
- **maji-commit:** small commits per epic
- **maji-doc:** README and handover notes when the sprint closes

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

