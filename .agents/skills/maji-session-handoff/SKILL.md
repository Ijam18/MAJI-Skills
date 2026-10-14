---
name: maji-session-handoff
description: Keep work continuous across sessions, context compaction and repos. Boots the same working rules every session, checks connectors, saves state on demand (dated notes, plan progress, processes stopped), resumes from saved state, writes cross-repo handoff files with a data contract and OPEN/DONE status, and borrows patterns from sibling projects read-only. Use when the user says "save state", "save everything, continue later", "resume", "continue where we left off", "what's the status?", "hand this task to the other repo", "look at how project X does it", "who are you?" after compaction, or "my connector is missing". Malay triggers "save kerja sekarang", "sambung", "apa status sekarang?".
metadata:
  tier: workflow
  category: plan
  version: "1.0.0-lite"
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

1. **Boot the same rules.** Shared working rules live in ONE global file, loaded every session (Claude Code: `~/.claude/CLAUDE.md`, injected by a SessionStart hook.
2. **Check connectors.** List servers (Claude Code: `/mcp` or `claude mcp list`.
3. **Borrow from another project, read-only.** Spawn a read-only explore agent into the source repo (Claude Code: an Explore subagent.
4. **Save on demand.** On "save":
5. **Resume.** On "resume", "continue", "what's the status?": read the index, plan PROGRESS, `git status` and `git log -10`.
6. **Hand off across repos.** Write `handoffs/<date>-<slug>.md` in the TARGET repo (a folder, not the repo root):
7. **Maintain the config.** Measure real token usage from session logs before claiming savings.

## Composes with

maji-mode (shared rules to boot) · maji-jimat (compression mode to boot) · maji-propose (plan file and PROGRESS) · maji-dev-up (stop processes on save, restart on resume) · maji-summary (compress long notes) · maji-commit (commit notes and handoffs)

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

