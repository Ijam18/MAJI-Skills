---
name: maji-propose
description: Discuss-first planning loop for any non-trivial change. Survey read-only, write ONE plan with numbered options (exactly one recommended, cost and risk on each, a one-line glossary for internal terms), let the user pick by number, then execute in waves with tests, a status heartbeat after every wave without being asked, and a local commit per wave. Saying "proceed" during planning locks the plan only and is never permission to code. Use when the user says "propose a plan", "let's discuss first", "do a full audit", "what's left in the backlog?", "test kit and audit before deploy", "resume the plan", "pick up where we left off", "add this to the plan", "should we build or buy X", "write an ADR", or asks for your honest opinion on the project.
metadata:
  tier: workflow
  category: plan
  version: "1.0.0-lite"
---

# Propose: Numbered Plan, Waves, Heartbeat

Turn a vague ask into one approved plan, then ship it wave by wave. Final output: a plan file the user approved by number, plus tested, committed waves with a status report after each.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Ports, Tools and credits). If `me/overrides/maji-propose.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use:
- Any change bigger than one obvious edit: feature, refactor, audit, migration, framework upgrade, pre-deploy check.
- User asks for the backlog, the status, or your honest opinion on the project.
- User is in discuss mode ("let's discuss", "propose").

Not:
- One-line fix with a clear spec: just do it (errors go to maji-debug).
- User already handed a locked spec plus an explicit build signal.
- Pure "what is X?" questions: maji-explain.

## Steps

1. **Enter planning.** Turn on plan mode (Claude Code: plan mode.
2. **Survey read-only, in parallel.** Spawn read-only agents per dimension (correctness, security, performance, accessibility, test coverage) or per module (Claude Code: Agent subagents.
3. **Verify every finding adversarially.** A second pass tries to refute each finding against the code.
4. **Write ONE plan file** (e.g.
5. **Ask by number.** Ask with a structured question (Claude Code: AskUserQuestion.
6. **Lock, do not build.** "proceed", "ok", "go" during planning = plan locked.
7. **Execute in waves, P0 first.** Within a severity, order by impact against effort (high impact, low effort first).
8. **Heartbeat after every wave, unasked.** Post the status block below (plus a push notification if your client has one).
9. **Commit per wave** locally, only on a green gate.
10. **Resume or append from the file.** After a compaction or a new session, read the plan file, report done / pending / blocked counts and restart at the first `[ ]` item; no re-explaining needed.

## Composes with

maji-mode (decision modes, Pre-Action Gate) · maji-explain ("what does X mean?") · maji-review (review inside a wave) · maji-debug (failures mid-wave) · maji-test (regression tests) · maji-commit (per-wave commits) · maji-dev-up (run the app to check a wave) · maji-session-handoff (save PROGRESS, resume next session) · maji-ship (deploy after the last wave)

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-propose` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
