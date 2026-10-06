---
name: maji-client-helpdesk
description: Answer client and stakeholder questions from the real running system, turn recurring questions into tracked tickets, mine tickets into self-serve fixes and an FAQ, and close the support season with backup and handover. Use when a client, helpdesk team or user group asks about a live app, when a chat group needs to become a ticket queue, when repeated tickets should become FAQ pages or guides, or when a project is being closed or handed to a successor. Triggers include "help me answer this client question", "is this feature in the system", "turn the group chat into tickets", "build an FAQ from our tickets", "close the project and hand it over", "tolong jawab soalan ni", "check dekat localhost dulu", "tutup projek ni".
metadata:
  tier: workflow
  category: business
  version: "1.0.0"
---

# Client Helpdesk

Answer from the real system, not from memory; turn questions into tickets, tickets into self-serve fixes and an FAQ, and end with a clean close.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Brand, Money and tax, Folders, Voice and language). If `me/overrides/maji-client-helpdesk.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use when:
- A stakeholder or helpdesk pastes a question about a live system you maintain or receive from upstream.
- A chat group (Telegram, WhatsApp, Slack) keeps asking the same things and needs tracking.
- Ticket volume justifies an FAQ, guides and self-serve features.
- A support season or project ends and needs backup, ticket close and handover.

Not when:
- The question is a live bug with a stack trace: use maji-debug.
- The ask is to change upstream code or push: that is a separate, approved build task.

## Steps

1. **Take the question as it is.** Paste it from the helpdesk or stakeholder, or ingest a group with a bot: create the bot (BotFather for Telegram), turn privacy mode off, get the chat id with a one-off poll, set a webhook secret. For history: chat export, import, then classify each message (question / info / chatter) in every language the group uses.
2. **Sync before you answer (receive-only).** `git fetch`, stash local work, `git merge --ff-only origin/main`, `git stash pop --index`. Summarise what changed (log, new migrations, new features). Migrate and seed only with an explicit OK, and only with idempotent seeders. Run localhost on a dedicated port with the pinned runtime version, then the full suite (Pest/PHPUnit, Vitest, Playwright). No edits on main, no push, no new branch.
3. **Check the real behaviour.** Grep the route, query or datatable, filter and policy behind the question; reproduce it on localhost; screenshot with Playwright when it helps.
4. **Answer short, in the asker's language.** Exists or not, where it is in the UI, the steps, a screenshot. Add steps the owner can follow to verify it personally. If it does not exist, say so and log a feature request; do not build it inside the answer.
5. **Ticket what repeats.** IDs like `HD-YYYY-NNNN`. Order matters: convert questions to tickets, link each conversation and its resolution, and only then delete chatter. Enrich titles and categories with an LLM in batches (for example 150 per batch) using the prompt rule "facts from the question only", and hand-check a sample of each batch before accepting it. Triage from a dashboard with KPIs (open, resolved, by category).
6. **Schedule only with guards.** Hourly job: drain updates, ingest, auto-ticket, link, enrich with a small fast model. Absolute paths in crontab, a timeout on every model call, and a liveness check that alerts when the poller or the cron stops. Any pause gets a date, an owner and a resume condition.
7. **Mine the tickets.** Categorise (10 to 15 categories, in the users' language), find the top issues and one canonical solution for each. Write an improvement plan ordered by ticket volume, each fix with an estimate of how many tickets it removes.
8. **Ship self-serve fixes and the FAQ.** Build what users keep asking staff to do for them (password reset, check own email or status, certificate banner, remove duplicate entries, self-registration). Distil solutions into an FAQ seeder that feeds a public FAQ page and an admin FAQ manager. Produce an issue guide PDF per audience (Markdown to PDF via pandoc or weasyprint) and a common-issues report. Test every fix (unit + E2E).
9. **Close the season or project.** Archive old tickets by date, back up the database first (mysqldump / pg_dump), then bulk close tickets, keep the cron off, and record "project closed" with the date in the project notes. Handover pack: README setup, CHANGELOG, a successor roadmap (for example 12 weeks with a definition of done), deploy notes, and a module/feature list PDF.

## Variants

- **Answer-only:** steps 2 to 4, for occasional stakeholder questions on a system you receive but do not own.
- **Chat group to ticket ops:** steps 1, 5 and 6 for a busy season; retire the job explicitly when the season ends.
- **Tickets to self-serve:** steps 7 and 8 on an existing ticket table, when repeat questions are eating staff time.
- **Close-only:** step 9 when the client ends the engagement; backup, close, jobs off, notes updated, nothing else.
- **Two-way sync with a project tool** (ClickUp, Linear, Jira): treat it as unproven until you see a full round trip working in production.
- **Handover to a successor:** squash-import the tree without old history if that history is unrelated or holds leaked keys or PII; make the new host `origin` and keep the old remote with push disabled; audit and remove dead code and assets; prove it still works (full suite + localhost); one commit per module (`type(module): ...`) so the file listing shows what each module touched; push the successor's branch only, main untouched.

## Pitfalls

| Failure seen | Guard |
|---|---|
| Local copy behind main gave a wrong answer | Step 2 sync before every answer |
| Default runtime too new for a dependency; port clash with another local project; test run out of memory at the default limit | Pin the runtime version, one port per project, raise the memory limit for the suite; document known local-only test failures |
| A large pull (100+ commits) overwrote local-only setup | Stash and list local-only files before merging |
| Dev server hot reload kept screenshots from reaching network idle | Capture against a production build, or wait on a selector |
| Bot polling returned 409 because the prod webhook used the same bot | One bot per environment, or webhook only |
| Crontab without the absolute CLI path (got wrong 4 times) | Absolute paths; test the line with an empty environment |
| Background poller died silently | Liveness check that alerts |
| Large model endpoint hung | Timeout + small model for enrichment |
| First enrich prompt invented details in 7% of titles | "Facts from the question only" + sample check per batch |
| Auto tickets kept raw titles until enrichment ran | Use the raw question as the fallback title; run enrich right after ingest |
| Catch-all "Other" category held hundreds of tickets nobody could act on | Re-cluster it; cap its share before planning |
| Bot auto-reply in a community group was unwelcome | Ask the group owner before any bot posts |
| Cron paused and never resumed before the project closed | Pause with an owner and a resume date |
| PII CSV left in old repo history; prod may still serve it from a public folder | Squash-import, purge public files, check the live URL |
| Re-syncing with `read-tree` can wipe the successor's merged work | Never re-sync after handover; merge instead |
| Force push changed every hash; notes still pointed at old hashes | Force push only with owner approval; update notes after any history rewrite |

## Done when

- [ ] Every answer cites a code path or a localhost check on a synced main
- [ ] Upstream main untouched: no edits, no push, no new branch during answer work
- [ ] Missing features logged as requests, not silently built
- [ ] Every scheduled job is live with a liveness alert, paused with an owner and resume date, or explicitly retired
- [ ] Tickets have IDs, categories and a hand-checked enrichment sample
- [ ] Improvement plan ranks fixes by ticket volume; shipped fixes are tested
- [ ] FAQ page and guide PDF cover the top issues
- [ ] On close: backup taken before bulk close, jobs off, handover docs pushed, project marked closed

## Composes with

- **maji-mode:** Pre-Action Gate before migrate, push, force push or bulk close
- **maji-debug:** when a question turns out to be a real bug
- **maji-dev-up:** localhost on its own port before checking behaviour
- **maji-scheduled-job:** the hourly ingest job with preflight, timeouts and alerts
- **maji-repo-hygiene:** dead-code audit and history purge before handover
- **maji-brand-pdf:** issue guide and module list PDFs
- **maji-explain:** plain-language answer drafts
- **maji-summary:** ticket and chat digests
- **maji-doc:** README, CHANGELOG and handover docs
- **maji-test:** tests for each self-serve fix
