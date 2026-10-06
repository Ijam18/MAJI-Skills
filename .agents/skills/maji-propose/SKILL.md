---
name: maji-propose
description: Discuss-first planning loop for any non-trivial change. Survey read-only, write ONE plan with numbered options (exactly one recommended, cost and risk on each, a one-line glossary for internal terms), let the user pick by number, then execute in waves with tests, a status heartbeat after every wave without being asked, and a local commit per wave. Saying "proceed" during planning locks the plan only and is never permission to code. Use when the user says "propose a plan", "let's discuss first", "do a full audit", "what's left in the backlog?", "test kit and audit before deploy", or asks for your honest opinion on the project. Malay triggers "jom bincang dulu", "apa lagi backlog?", "buat 1 sampai 5".
metadata:
  tier: workflow
  category: plan
  version: "1.0.0"
---

# Propose: Numbered Plan, Waves, Heartbeat

Turn a vague ask into one approved plan, then ship it wave by wave. Final output: a plan file the user approved by number, plus tested, committed waves with a status report after each.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Ports, Tools and credits). If `me/overrides/maji-propose.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use:
- Any change bigger than one obvious edit: feature, refactor, audit, migration, framework upgrade, pre-deploy check.
- User asks for the backlog, the status, or your honest opinion on the project.
- User is in discuss mode ("let's discuss", "propose", "jom bincang").

Not:
- One-line fix with a clear spec: just do it (errors go to maji-debug).
- User already handed a locked spec plus an explicit build signal.
- Pure "what is X?" questions: maji-explain.

## Steps

1. **Enter planning.** Turn on plan mode (Claude Code: plan mode. Other agents: Cursor Ask/Plan, or state "planning, no code yet" and keep the plan as a numbered list in chat). Restate the product goal in one line so a misunderstanding surfaces now, not after the build.
2. **Survey read-only, in parallel.** Spawn read-only agents per dimension (correctness, security, performance, accessibility, test coverage) or per module (Claude Code: Agent subagents. Other agents: run the same read-only passes sequentially, one dimension at a time). Cap concurrency (roughly CPU cores minus two) so the machine stays usable. For a backlog ask, read the plan file, project notes, `git status` and open PRs.
3. **Verify every finding adversarially.** A second pass tries to refute each finding against the code. Agents overclaim ("dependency unused", wrong counts). Only confirmed findings enter the plan.
4. **Write ONE plan file** (e.g. `plans/<slug>.md`) in the locked format below: findings by severity P0..P3 or numbered options, exactly one recommended, cost and risk on every option, a glossary line for every internal term.
5. **Ask by number.** Ask with a structured question (Claude Code: AskUserQuestion. Other agents: a numbered plan in chat, then wait for the user's pick). Accept short answers: "1 3", "do 1 to 5, skip 6, I'll check 7", "go with your recommendation". If the user asks "what does X mean?", answer in one line plus cost and risk, then re-ask. Echo the chosen IDs back before locking.
6. **Lock, do not build.** "proceed", "ok", "go" during planning = plan locked. It is NOT permission to write code. Reply "Plan locked. Start wave 1?" and wait for an explicit build signal.
7. **Execute in waves, P0 first.** Per wave: re-check each item still applies (the table to drop may already be gone), fix, add one regression test per fix, run targeted tests plus typecheck and lint (`tsc --noEmit`, eslint). Use the stack's kit: Vitest, Playwright, pytest, PHPUnit or Pest. Full e2e only on the last wave or when asked.
8. **Heartbeat after every wave, unasked.** Post the status block below (plus a push notification if your client has one). The user should never need to type "what's the status?".
9. **Commit per wave** locally, only on a green gate. Update PROGRESS in the plan file: shipped, next, waiting on user. Push or open a PR only when the user says so.

### Plan format (locked)

```
GOAL        one line
CONTEXT     2-3 bullets the survey confirmed
OPTIONS
  1. <name>  (RECOMMENDED)  cost: <hours / files / money>  risk: <what can break>
  2. <name>                 cost: ...                       risk: ...
WAVES       W1: P0 items + tests, then commit · W2: ... · W3: ...
OWNER-ONLY  what only the user can do (domain, keys, prod OAuth, billing)
GLOSSARY    <term>: one plain line each
ASK         Reply with numbers.
```

### Heartbeat format

```
WAVE 2/4 DONE · tests 48/48 green · typecheck ok · commit a1b2c3d
shipped   items 3, 4
next      wave 3: items 5, 6
blocked   item 7 waits on you (API key)
```

## Variants

- **Test kit + full audit before deploy:** map the stack and existing tests, add unit (Vitest), e2e (Playwright, chromium + webkit) and a11y layers, run once to record flaky tests and gaps, then audit by severity and plan fix waves. The QA pass does not touch production code; fixes go in their own wave.
- **Backlog by number:** list done / pending / blocked with stable IDs, user picks numbers, execute, update the list.
- **Spec first, then phases:** check the inputs first (design exports not 0-byte placeholders, labels right, the right client brand), spec or PRD, resolve contradictions in ADRs (`docs/adr/000N-*.md`), user locks decisions D1..Dn, conformance tests before implementation, one commit per phase, short retro at the end.
- **Multi-agent review, fix only confirmed:** parallel reviewers (Claude Code: subagents. Other agents: run the reviewers sequentially), adversarial verify, security and PII first, a regression test locks every fix, report the green count.
- **Major framework upgrade:** scope doc with verdict and effort, strengthen the test net first, pin the platform version in the lockfile, bump atomically, back up lock files every phase, clear compiled caches, remove stale published vendor assets that shadow new routes. If production runs an older runtime than you can test locally, build assets off-server, pin the runtime (`.nvmrc`) and write DEPLOY-NOTES.
- **Prototype scoping (3D, maps, interactive):** concept, audience, signature feature, the real moat (not the graphics); lock stack and data licence; roadmap in hours; scaffold P0 plus a test kit with a no-WebGL fallback before heavy features. Never lock core content behind the interactive part. Adding light/dark to an existing app is a semantic colour migration (hundreds of hardcoded colours), not a token swap: cost it that way.
- **Honest-opinion checkpoint:** strengths, risks, focus; ask who uses it and who pays. If it turns into a pivot, record the parked state of the old track first.
- **Plan that must not touch the product repo:** measure with what already exists (UTM links, existing analytics), keep experiments in a local worktree, no push.

## Pitfalls

| Real failure | Guard |
|---|---|
| "proceed" during planning taken as permission to code; scope extrapolated; plan rejected many times in one session | Step 6: proceed locks the plan only. Ask before wave 1. |
| User polls "what's the status?" over and over | Heartbeat after every wave, unasked. |
| Plan too long, many options when one was wanted | Exactly one RECOMMENDED; alternatives one line each. |
| Internal terms (tier, phase, zero-ops, probe) unexplained; raw internal codes leak into user-facing UI | Glossary line per term; plain labels in UI. |
| Agents mis-flag; vacuous tests that cannot fail; a mutation check "passes" because the replace matched nothing | Adversarial verify; break each new test once and watch it fail. |
| Full e2e every wave is slow, heats the machine, tests go flaky under load | Targeted specs per wave, full suite at the end. |
| Build passes but tests do not typecheck; a commit landed on a red gate | Typecheck and lint in the gate. Never commit red. |
| Short numeric answers mismatch after the list changed | Stable IDs; echo chosen items back. |
| Backlog scattered across plan, notes and TODOs | One plan file is the source of truth. |
| Owner-only items (domain, keys, prod OAuth) block release for weeks | OWNER-ONLY list, repeated in every heartbeat. |
| Drift from the original scope; over-trimming things the user still wanted | Touch only listed items; ask before removing anything else. |
| Plan too big, user says "drop it all, one at a time" | Small waves, each fits one review. |
| Fix without a regression test regresses silently | One regression test per fix. |
| Tests mock the DB, so stateful seams (foreign tables, cron, RLS) stay unproven while the suite is green | One live-harness check per seam, or list it as unproven in the heartbeat. |
| Tests hit real external APIs (minutes per run); login throttling and two suites sharing one test DB make e2e flaky | Blank external keys in test config, in-memory cache for tests, one suite per test DB at a time. |
| A long multi-agent run is cut by a session or rate limit | Agents write findings to files on disk; resume from those files. |
| A generated agent script breaks on an apostrophe inside a single-quoted string | Pass text via files or template strings, never inline single quotes. |
| Frustration signal after a plan | Pivot; do not iterate the rejected plan. |

## Done when

- [ ] Plan file has numbered options, exactly one RECOMMENDED, cost + risk on each, glossary
- [ ] User picked by number; chosen IDs echoed back
- [ ] Explicit build signal received after the plan was locked
- [ ] Every wave: targeted tests + typecheck green, regression test per fix, local commit
- [ ] Heartbeat posted after every wave without being asked
- [ ] PROGRESS updated: shipped, next, waiting on user, owner-only

## Composes with

maji-mode (decision modes, Pre-Action Gate) · maji-explain ("what does X mean?") · maji-review (review inside a wave) · maji-debug (failures mid-wave) · maji-test (regression tests) · maji-commit (per-wave commits) · maji-dev-up (run the app to check a wave) · maji-session-handoff (save PROGRESS, resume next session) · maji-ship (deploy after the last wave)
