---
name: maji-dev-up
description: Bring a project up on localhost reliably and take it down cleanly. Checks the port, starts dependencies (container runtime, local Supabase or database), starts the dev server, waits until it answers before opening the browser, separates environment faults from code bugs when an error is pasted, and frees a slow machine by measuring and stopping stale processes. Use when the user says "start it on localhost", "restart dev", "run it on port 3020", "pull the latest and run it", pastes a raw console error such as "Failed to fetch", or says "my laptop is slow, what can I close?". Malay triggers "start dekat localhost", "restart balik port", "macbook berat sangat".
---

# Dev Up: Localhost Runtime

A running app on a confirmed-live localhost URL, then a clean shutdown. Final output: a URL and port that answered a real request, the port and start command recorded in notes, and a before/after report when cleaning up.

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

1. **Check the port.** `lsof -nP -iTCP:<port> -sTCP:LISTEN`. Kill only the specific stale PID (`lsof -ti:<port> | xargs kill`), never a broad `pkill -f next` that hits other projects. Take ports from one registry file (project, app port, DB port) so two projects never share 3000.
2. **Sync if receive-only.** For a repo you only consume: `git fetch`, `git stash`, `git merge --ff-only origin/main`, `git stash pop --index`. Summarise new commits and migrations. No edits on main, no push, no new branch. Run migrations and an idempotent seed only when the user says so.
3. **Start dependencies.** Container runtime first (OrbStack, Docker Desktop, Colima). Local Supabase: `supabase start` with unique ports per project in `supabase/config.toml`; otherwise MySQL or Postgres via docker or `brew services`, with named volumes. Fill `.env.local` from the CLI output, then migrate and seed demo data (receive-only repo: only on the user's word, step 2). Hosted DB: the owner gives the project ref, you `supabase link`, the owner runs `db push` to production. Never paste DB URLs or keys into chat.
4. **Start the app by stack.** `pnpm dev`, `npm run dev`, `php artisan serve --port=<port>`, `vite`. Pass the port by env (`PORT=3020 pnpm dev`), not `pnpm dev -- -p 3020` (some setups read `-p` as a directory). Pin runtime versions (`.nvmrc`, an older PHP when the default is too new). Add any dev-only env flag the app's local guard needs. Prefer Turbopack or Vite over webpack dev when memory is tight. Run it in the background with absolute paths so a wrong cwd cannot drop a stray `package.json` in a parent folder.
5. **Wait, then open.** `until curl -sf -o /dev/null http://localhost:<port>; do sleep 1; done; open http://localhost:<port>`. Never open the browser before the port answers.
6. **Report and record.** One line: URL, port, how to stop. Save port and start command in project notes.
7. **Triage a pasted error: environment before code.** Probe health first:
   - hosted DB paused or unpaid: `Failed to fetch`, `ERR_NAME_NOT_RESOLVED`
   - container runtime or local DB down: `ERR_CONNECTION_REFUSED` on the DB port; gateway stuck: `supabase stop && supabase start`
   - 403 or 404: often an auth gate or an old deploy, not code
   - stale service worker serving old data after restart: unregister it, a hard refresh is not enough
   - port clash or a stale process blocking the next start

   Only then: hypothesis, verify (curl, server log, psql, headless Playwright probe), minimum fix, re-verify yourself before asking the user to reload. Save the gotcha in notes.
8. **Machine heavy: measure, ask, stop, re-measure.** Also run this before a heavy session (e2e, browser automation, many agents). Snapshot `top -l 1`, `sysctl vm.swapusage`, `memory_pressure`, `lsof -iTCP -sTCP:LISTEN`, `docker ps`, `brew services list`, `launchctl list`, `crontab -l` (Linux: `free -h`, `systemctl list-units`). Classify keep vs stop: other projects' dev servers and DB stacks, runaway editor extension hosts, orphaned agent sessions from closed windows, idle daemons and cron jobs. Ask the scope ("keep this project, the rest on demand"). Stop with `supabase stop`, `brew services stop`, `launchctl bootout`, `kill`. Re-measure, report before/after, note how to re-enable each.
9. **Down.** At session end stop everything this session started: dev servers, DB stack, tunnels, background jobs.

## Variants

- **Dev vs ops vs demo:** dev = hot reload while building; ops = build once and serve without reload for long-running jobs or live operation (do not edit files while the user operates it); demo = quick tunnel (`cloudflared tunnel --url http://localhost:<port>`) pointed at the single-port server that serves both UI and API.
- **Phone on LAN:** run the single-port server bound to `0.0.0.0`, open the machine's LAN IP.
- **Hosted DB paused or unpaid:** point env at the local stack, or move temporarily to another Postgres host (e.g. Neon; grant RLS roles explicitly). Audit table sizes before paying for more compute.
- **Pull upstream + full suite before a demo or manual:** step 2, then the whole test suite (raise the memory limit for PHP runners). Note tests that only fail locally (e.g. cloud storage) so nobody chases them.
- **Launcher dashboard:** one local page that lists projects and starts or stops each on its registered port (port via `PORT` env, wait for the port before returning the URL).
- **Pasted-error auto-route:** a prompt hook sends a pasted dev-overlay error (starts with an error-type heading) straight to maji-debug after the env probe.

## Pitfalls

| Real failure | Guard |
|---|---|
| Port clash between projects | Port registry; `lsof` before every start. |
| Stale dev servers, dozens of DB containers and orphaned agent sessions keep running after windows close | Step 9 down; orphan check in step 8. |
| Same error pasted again and again because the cause was environment (paused DB) | Health probe before any code change. |
| Fix declared done unverified; user repeats "still failing" | Reproduce and verify yourself first. |
| Browser opened before the server was ready, blank page | `until curl` loop. |
| `-- -p` port flag misparsed | `PORT` env. |
| Default runtime too new for a dependency; test runner OOM at default memory | Pin versions; raise the test memory limit. |
| Large upstream pull overwrites local-only setup | Stash first; keep local-only setup out of tracked files. |
| Hot reload kills long fetches; `networkidle` hangs under HMR during captures | Ops mode or a built server for long jobs and screenshots. |
| Tunnel to the dev port 404s on API; quick tunnel dies when the machine sleeps | Tunnel the single-port server; keep the machine awake while demoing. |
| A build while dev is running clobbers the build folder (`.next`) | Stop dev or build to a separate dir. |
| Local `next start` with a CSP that upgrades insecure requests breaks fetches over http | Drop that directive for local http. |
| zsh does not word-split `$PIDS`, kill silently does nothing | Pipe through `xargs kill`. |
| Removing a DB container without a volume loses data | Named volumes; confirm before `docker rm`. |
| Containers with restart policies and VM runtimes respawn; swap does not shrink without a reboot | `supabase stop` instead of kill, quit the runtime; advise a reboot when swap stays high. |
| DB credentials pasted into chat | Env files only. |
| Port or proxy-rewrite drift silently 500s one service | Registry is the only source of ports; curl each service after start. |
| Webpack dev plus huge source literals (large dictionary files) thrash RAM | Turbopack or Vite dev; watch dev-server memory. |
| A fresh migration wipes config rows (e.g. current term or year), login redirect loops | Re-seed config rows after every `migrate:fresh`. |
| High load makes browser automation and tests time out or flake | Step 8 before heavy runs. |

## Done when

- [ ] Port checked, no clash, registry updated
- [ ] Dependencies up; app URL answered `curl` before the browser opened
- [ ] URL, port and stop command reported and saved in notes
- [ ] Pasted error classified env vs code, fixed minimally, verified before handing back
- [ ] Slow-machine cleanup reported before/after with re-enable notes
- [ ] Session end: everything this session started is stopped

## Composes with

maji-debug (code-side errors once env is ruled out) · maji-propose (run the app to check each wave) · maji-session-handoff (record ports, stop processes on save) · maji-mode (ask before stopping anything the user may need) · maji-ship (when local is green and it is time to deploy)
