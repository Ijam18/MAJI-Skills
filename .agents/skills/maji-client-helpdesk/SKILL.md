---
name: maji-client-helpdesk
description: Answer client and stakeholder questions from the real running system, turn recurring questions into tracked tickets, mine tickets into self-serve fixes and an FAQ, and close the support season with backup and handover. Use when a client, helpdesk team or user group asks about a live app, when a chat group needs to become a ticket queue, when repeated tickets should become FAQ pages or guides, or when a project is being closed or handed to a successor. Triggers include "help me answer this client question", "is this feature in the system", "turn the group chat into tickets", "build an FAQ from our tickets", "close the project and hand it over", "tolong jawab soalan ni", "check dekat localhost dulu", "tutup projek ni".
metadata:
  tier: workflow
  category: business
  version: "1.0.0-lite"
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

1. **Take the question as it is.** Paste it from the helpdesk or stakeholder, or ingest a group with a bot: create the bot (BotFather for Telegram), turn privacy mode off, get the chat id with a one-off poll, set a webhook secret.
2. **Sync before you answer (receive-only).** `git fetch`, stash local work, `git merge --ff-only origin/main`, `git stash pop --index`.
3. **Check the real behaviour.** Grep the route, query or datatable, filter and policy behind the question; reproduce it on localhost; screenshot with Playwright when it helps.
4. **Answer short, in the asker's language.** Exists or not, where it is in the UI, the steps, a screenshot.
5. **Ticket what repeats.** IDs like `HD-YYYY-NNNN`.
6. **Schedule only with guards.** Hourly job: drain updates, ingest, auto-ticket, link, enrich with a small fast model.
7. **Mine the tickets.** Categorise (10 to 15 categories, in the users' language), find the top issues and one canonical solution for each.
8. **Ship self-serve fixes and the FAQ.** Build what users keep asking staff to do for them (password reset, check own email or status, certificate banner, remove duplicate entries, self-registration).
9. **Close the season or project.** Archive old tickets by date, back up the database first (mysqldump / pg_dump), then bulk close tickets, keep the cron off, and record "project closed" with the date in the project notes.

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

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

