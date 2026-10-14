---
name: maji-dev-up
description: Bring a project up on localhost reliably and take it down cleanly. Checks the port, starts dependencies (container runtime, local Supabase or database), starts the dev server, waits until it answers before opening the browser, separates environment faults from code bugs when an error is pasted, and frees a slow machine by measuring and stopping stale processes. Use when the user says "start it on localhost", "restart dev", "run it on port 3020", "pull the latest and run it", pastes a raw console error such as "Failed to fetch", or says "my laptop is slow, what can I close?". Malay triggers "start dekat localhost", "restart balik port", "macbook berat sangat".
metadata:
  tier: workflow
  category: plan
  version: "1.0.0-lite"
---

# Dev Up: Localhost Runtime

A running app on a confirmed-live localhost URL, then a clean shutdown. Final output: a URL and port that answered a real request, the port and start command recorded in notes, and a before/after report when cleaning up.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Ports, Tools and credits). If `me/overrides/maji-dev-up.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use:
- First thing in a session: "start on localhost", "restart dev".
- A pasted raw error, dev overlay or screenshot from the running app.
- Machine slow, swap high, fans loud during dev.
- Pulling a receive-only upstream repo to run, test or demo it.

Not:
- Production deploys (maji-ship).
- A bug already isolated to one function: go straight to maji-debug.

## Steps

1. **Check the port.** `lsof -nP -iTCP:<port> -sTCP:LISTEN`.
2. **Sync if receive-only.** For a repo you only consume: `git fetch`, `git stash`, `git merge --ff-only origin/main`, `git stash pop --index`.
3. **Start dependencies.** Container runtime first (OrbStack, Docker Desktop, Colima).
4. **Start the app by stack.** `pnpm dev`, `npm run dev`, `php artisan serve --port=<port>`, `vite`.
5. **Wait, then open.** `until curl -sf -o /dev/null http://localhost:<port>; do sleep 1; done; open http://localhost:<port>`.
6. **Report and record.** One line: URL, port, how to stop.
7. **Triage a pasted error: environment before code.** Probe health first:
8. **Machine heavy: measure, ask, stop, re-measure.** Also run this before a heavy session (e2e, browser automation, many agents).
9. **Down.** At session end stop everything this session started: dev servers, DB stack, tunnels, background jobs.

## Composes with

maji-debug (code-side errors once env is ruled out) · maji-propose (run the app to check each wave) · maji-session-handoff (record ports, stop processes on save) · maji-mode (ask before stopping anything the user may need) · maji-ship (when local is green and it is time to deploy)

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

