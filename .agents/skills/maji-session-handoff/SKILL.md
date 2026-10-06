---
name: maji-session-handoff
description: Keep work continuous across sessions, context compaction and repos. Boots the same working rules every session, checks connectors, saves state on demand (dated notes, plan progress, processes stopped), resumes from saved state, writes cross-repo handoff files with a data contract and OPEN/DONE status, and borrows patterns from sibling projects read-only. Use when the user says "save state", "save everything, continue later", "resume", "continue where we left off", "what's the status?", "hand this task to the other repo", "look at how project X does it", "who are you?" after compaction, or "my connector is missing". Malay triggers "save kerja sekarang", "sambung", "apa status sekarang?".
metadata:
  tier: workflow
  category: plan
  version: "1.0.0"
---

# Session Handoff: Boot, Save, Resume, Hand Off

Nothing gets lost between sessions, compactions or repos. Final output: up-to-date notes plus plan PROGRESS, a short resume report, or a handoff file another session can act on and close.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders, Ports, Tools and credits). If `me/overrides/maji-session-handoff.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use:
- Opening a session in any repo, after compaction, or after days or weeks away.
- "save", "stop for today", before a reboot or a long risky operation.
- Work that spans two repos or two agent sessions.
- Building something by borrowing a pattern from another of the user's projects.
- A connector or MCP server is missing, duplicated or failing.

Not:
- One-off questions inside a single session.
- Planning new work (maji-propose) or starting the app (maji-dev-up).

## Steps

1. **Boot the same rules.** Shared working rules live in ONE global file, loaded every session (Claude Code: `~/.claude/CLAUDE.md`, injected by a SessionStart hook. Other agents: a global AGENTS.md, Cursor user rules or the agent's own rules file, plus a manual check at session start that the rules loaded). Project notes hold project state only, never a copy of the rules. If the repo ships its own agent persona or house rules that conflict, name the conflict and ask which wins. Then load the active skills and compression mode.
2. **Check connectors.** List servers (Claude Code: `/mcp` or `claude mcp list`. Other agents: the agent's own MCP settings screen). Hosted connectors usually load only at session start: reload the window or open a new session after adding one. Remove a local server that duplicates and hides a hosted one. Desktop-app MCP servers must be enabled in the app's own preferences and the app must be running before the session starts; check the address they bind to (some listen on IPv6 `[::1]` only). Prove each with one cheap read call (list, balance, search) and note the setup in project notes.
3. **Borrow from another project, read-only.** Spawn a read-only explore agent into the source repo (Claude Code: an Explore subagent. Other agents: read the source repo yourself, read-only). Extract the pattern (UI, pipeline, data shape). Trace data to the table it is written to, not only the import graph. Adapt to the current concept, do not clone it. Record what was borrowed. If an instruction really belongs to the other repo, flag it before acting.
4. **Save on demand.** On "save":
   - update project notes, one file per topic (status, rules learned, gotchas), each with `last_verified: YYYY-MM-DD`
   - add a one-line pointer per file to the notes index; keep the index under a size cap (Claude Code: a SessionStart hook can warn when it is crossed. Other agents: a manual size check at session start), merge or archive when it grows
   - update PROGRESS in the plan file: shipped, in progress, waiting on user, blocked
   - keep an open-items list (rotate a password, renew a key) so they get closed
   - keep runbooks inside the repo, not in temp or home folders
   - stop processes this session started (dev servers, browsers, containers, background jobs) when asked
   - report what was saved in three lines
5. **Resume.** On "resume", "continue", "what's the status?": read the index, plan PROGRESS, `git status` and `git log -10`. Check any claim older than about 30 days against the code before repeating it. Report done / next / blocked in five lines, then continue the next item.
6. **Hand off across repos.** Write `handoffs/<date>-<slug>.md` in the TARGET repo (a folder, not the repo root):
   ```
   STATUS     OPEN | IN PROGRESS | BLOCKED (on what) | DONE (commit or evidence)
   FROM       origin repo or session
   TASK       3-5 bullets
   CONTRACT   tables, columns, types, endpoints the origin depends on
   RESOURCES  ports, browser profiles, databases this task will hold
   VERIFY     exact command or query that proves it works
   ```
   Deliver it with a message tool (Claude Code: SendMessage, after ListAgents finds the target. Other agents: the user relays one line: "read handoffs/<file>"). The target marks DONE with evidence; the origin runs VERIFY, then continues its backlog. Any contract change (column rename, type change) gets a new handoff to every consumer.
7. **Maintain the config.** Measure real token usage from session logs before claiming savings. Keep one installed copy of each skill (global vs project vs repo) and re-sync after merges. Add a new skill only when there is evidence it gets used. Prefer narrow permission rules over blanket shell access. If the skills repo has a protected main, every change goes through a PR.

## Variants

- **Bootstrap a team repo:** rules file, notes folder, agent house rules as Markdown (not a PDF export agents cannot read). Personal notes stay out of git so the whole team does not see them. Avoid vendoring large frameworks into many repos; copies drift from upstream.
- **Re-entry after weeks away:** resume each active repo in turn and refresh one cross-project map; date every entry, snapshots go stale fast.
- **Port a feature from a sibling project:** the source stays the engine, this repo the display. Lock scope, data source and layout by numbered question first. Cross-database reads (foreign tables, replicas) cannot be indexed from the reader: cache heavy queries, avoid per-row lateral joins, coerce numeric strings to numbers. Verify with live data and a screenshot.
- **Connector setup only:** add, reload, dedupe, one test call, note.
- **Semantic recall:** embed notes into a local vector store on a schedule; after any reboot or config reset, check the schedule (cron, launchd) is actually installed.

## Pitfalls

| Real failure | Guard |
|---|---|
| Rules and voice drift after compaction ("who are you?") | Global rules file loaded every session (Claude Code: SessionStart hook. Other agents: a manual check at session start); re-read after compaction. |
| Rules rewritten by hand in every repo | One global source; project notes hold state only. |
| Repo-local persona clashes with the shared rules | Name the conflict, user decides. |
| User acts as a manual message bus; only 1 of 4 handoff files ever marked DONE; handoffs scattered in the repo root | STATUS field, `handoffs/` folder, message tool. |
| A column rename in one repo silently breaks the other | CONTRACT section + new handoff on every change. |
| Origin cannot verify until the target deploys or backfills | Mark BLOCKED with the dependency; check it on resume. |
| Two sessions grab the same port, browser profile or DB | RESOURCES section in the handoff. |
| Stale notes contradict reality (marked "deferred" for months) | `last_verified` + re-verify claims older than ~30 days. |
| Compaction truncates detail mid-task | Save before long operations; PROGRESS lives in the plan file. |
| Runbook kept outside the repo disappears | Runbooks committed in the repo. |
| Processes keep running after the session ends | Save stops what this session started. |
| Open items (rotate a password) never closed | Open-items list read on every resume. |
| Connector missing mid-session; local server hides the hosted one; CLI not on PATH inside the IDE extension | Reload, dedupe, test call; call the CLI by full path. |
| Borrowed result too close to the source, or wrong because it followed imports instead of data | Adapt the concept; trace to the sink table. |
| First port has the wrong focus (lists people where the source tracks issues); a UI badge overclaims; mocked tests hide a broken cross-DB seam | Re-read how the source frames it; verify on live data; labels must match what the code does. |
| Many separate memory systems and vendored frameworks per repo; personal notes committed for the whole team | One notes system per repo; personal notes git-ignored. |
| Inflated token-saving claims | Measure from logs first. |
| Notes index bloats past the size limit | Size cap; merge and archive. |

## Done when

- [ ] Session started with the shared rules loaded and no persona conflict
- [ ] Every connector needed today answered a test call
- [ ] Save wrote dated notes, index lines, plan PROGRESS, open items, and stopped this session's processes
- [ ] Resume report lists done / next / blocked, stale claims re-verified
- [ ] Every handoff has STATUS, CONTRACT, RESOURCES, VERIFY and ends DONE with evidence the origin verified

## Composes with

maji-mode (shared rules to boot) · maji-jimat (compression mode to boot) · maji-propose (plan file and PROGRESS) · maji-dev-up (stop processes on save, restart on resume) · maji-summary (compress long notes) · maji-commit (commit notes and handoffs)
