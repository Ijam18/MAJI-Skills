---
name: maji-deadline-sprint
description: Run a fixed-date build sprint from brief to live demo. Lock scope into a coverage scoreboard, scaffold from an existing kit, seed realistic demo data, deploy early, then ship the demo pack (deck, narration, walkthrough video, QR card) and either quote the next phase or park with a resume point. Use for hackathons, tender or RFQ demos, client website sprints, event platforms and same-day pitch apps. Triggers include "hackathon this weekend", "demo before the tender closes", "build a pitch app by tomorrow", "client site in a week", "ship an MVP before the event", "jom buat demo untuk pitch", "kena siap sebelum event", "deploy cepat untuk client".
---

# Deadline Sprint

Turn a brief with a hard date into a deployed demo plus pitch pack, then close with a quote or a parked resume point.

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

1. **Lock scope in writing.** Turn the brief into one checklist: RFQ or tender becomes a coverage scoreboard per component; hackathon becomes the chosen track plus the judging rubric; client site becomes a sitemap. Ask clarifying questions now, in one round. For a paying client, put scope and payment phases on one page and get a yes before building. Name the entity that signs letters and quotes, and keep it the same throughout. Team sprint: written deliverable and deadline per member before kickoff, and match roles to proven skill (a designer is not automatically the frontend implementer).
2. **Pick the track once.** Set a pivot budget up front (for example one pivot, before the end of day 1). A later pivot means re-running step 1, not drifting silently.
3. **Scaffold from a kit, not from zero.** Reuse a sibling project's design kit (swap the accent color, keep the components) or gap-fill the team monorepo that already exists. Common kits: Next.js + Supabase + Vercel, or Hono + Postgres on a VPS. Client work: apply the client's brand (logo, favicon, palette, font) from their guideline. Content that rarely changes stays file-backed; add a database only for data or login. Record the data-layer choice.
4. **Seed real-looking demo data.** Scrape public data (REST endpoint to JSON to your API) or seed personas per role (end user, admin, developer). Use invented names, never real people or organisations. Reserve an ID range for demo records so they are easy to find and purge. Show value props, not raw counts ("1 registered user" screams demo).
5. **Build by epic or by day, commit small.** One slice at a time (schema + auth, core flow, admin, extras). Before every demo checkpoint run the test kit: unit + E2E on the main flow (Vitest + Playwright), a production build, and a brand-words test (banned and required wording). A pre-push hook that runs the local CI catches the rest. Commit and push only when the owner says.
6. **Deploy on day 1, not in the last hour.** Vercel, Fly.io, or a VPS with Docker Compose + GHCR images. Set Root Directory and framework explicitly for monorepos, keep secret references out of `vercel.json`, redeploy after changing env vars, attach the domain to the right project, create the project from a clean worktree, smoke test the live URL on a phone. The human enters sensitive env vars, pushes production database migrations and creates admin accounts; the agent never pipes keys. Then the owner tests on their own phone; fix what they hit (failed scans, sign-out, sideways scroll) before building the demo pack.
7. **Harden just enough.** Security headers/CSP, sitemap/robots, analytics, PWA manifest if it should install. Check what HSTS `includeSubDomains` does to other subdomains before enabling it. Camera or QR scanner features need HTTPS and often fail inside in-app browsers, so test in the real browser on a real phone. Event apps: capacity limits and duplicate-email checks in the database, signed upload URLs, confirmation email, all before registration opens.
8. **Ship the demo pack.** Pick what the audience needs: deck PDF (Markdown + CSS via pandoc, weasyprint or Marp), narration script with timing cues for the slot (for example 4 minutes), a 60-second walkthrough video, a QR card to the live demo, or a formal letter requesting a presentation slot. A landing page can double as the pitch (sections + "Try now").
9. **Close the sprint.** Either quote the next phase by the modules already built (value per module, validity date), or freeze and park: write the resume point (branch, live URL, state, out-of-scope list, next 3 tasks) in the project notes. Run a 15-minute retro either way: what to reuse, what to drop.

## Variants

- **2-day hackathon:** PRD + dev plan, build, deploy, 4-minute pitch. Lock the track early. Build for real users, not for the judges' checklist.
- **AI media hackathon:** tactical brief from rules, rubric and time plan; timestamped live notes on event day (type / source / note / why it matters / next action); prompt pack by timestamp (A-roll / B-roll). Productize the prompt system afterwards.
- **Tender or RFQ demo:** coverage percentage per component in the scoreboard; mock external integrations (national ID login, government gateways) and list them as out of scope.
- **Same-day spin-off pitch:** clone the first product's kit with a new accent and a demo data store, deploy to a new domain.
- **Client site or catalog:** sitemap to pages to live on the client's domain, client owns the code. A catalog adds product photo intake (for example a chat bot, with OCR and vision categorisation), staged UX passes (sticky bar, skeletons, 404, sort, search), inventory admin, CSV/QR export and a full SEO pass (OG cards, JSON-LD).
- **Event platform:** event site from data (programme, zones, exhibitors), multi-audience registration with reference numbers and email confirmation, admin panel, day-of check-in; audit and harden before registration opens.
- **SaaS from zero to live (about 2 weeks):** same steps, with epics per day and a deploy at the end of day 1.
- **Demo-first pitch:** build until demoable, then present live to the stakeholders, collect feedback and quote by module. Only with an existing relationship; otherwise quote first. Start the next phase only after written approval.

## Pitfalls

| Failure seen | Guard |
|---|---|
| Track or concept pivoted twice in one day | Pivot budget (step 2); re-lock scope on every pivot |
| Built first, quoted after; provider entity differed between letter and quote | Scope + payment on one page before build; one entity on all documents |
| Demo presented, then no record of acceptance or payment | Written approval and payment phase before any next-phase work |
| Teammate roles mismatched; deliverables unclear | Written deliverable + deadline per member; vet with portfolio + a small skill test |
| Force-push to a team branch wiped a teammate's 8 commits | Never force-push shared branches; feature branch, no-ff merge to dev, main untouched; commit only when the owner says |
| First deploy failed: secret refs in `vercel.json`, wrong Root Directory or framework, env not applied until redeploy, missing env crashed at runtime, domain on the wrong project | Step 6 checklist; verify the live URL, not the build log |
| Merge markers left in a Dockerfile; API URL wrong per branch; HSTS `includeSubDomains` broke a subdomain | Grep for `<<<<<<<` and per-env URLs before deploy; check every subdomain before HSTS |
| QR scanner failed on a phone inside an in-app browser | HTTPS only; test in the real browser on a real device |
| Event postponed but the date was hardcoded in the countdown and JSON-LD | Dates live in one config value |
| Reference numbers off by one day (UTC vs local time) | Generate dates in the event's timezone; test around midnight |
| Ambitious feature built, then dropped | Scoreboard must-haves first; extras only after deploy is green |
| UI read as a demo: raw counts, rainbow gradients, footer visible before scroll, emoji rendering differently per device | Value-prop copy, one accent, full-viewport layout, one icon set |
| Phone page scrolled sideways (hidden table still wide); role-guard race on load | Test at phone width; wait for auth state before redirecting |
| Weak demo admin password | Rotate after the pitch; never store credentials in files |
| Stale dev caches during the crunch | Clear the build cache before the final run |
| Event parked with no retro, later cancelled | Step 9 retro + resume point, always |
| Backend swapped mid-sprint | Decide the data layer in step 3 and write it down |

## Done when

- [ ] Scoreboard exists and every item is done, mocked, or marked out of scope
- [ ] Live URL works on a real phone, with demo data and no real personal data
- [ ] Tests and production build are green on the deployed commit
- [ ] Secrets were set by the human only; demo credentials rotated after the pitch
- [ ] Demo pack delivered (deck, narration, video, QR as needed)
- [ ] Next-phase quote sent (work resumes only on written approval), or resume point + retro written

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
