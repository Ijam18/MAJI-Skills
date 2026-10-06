# How each agent picks up this kit

Checked against official docs in October 2026. Tools change fast; if something here is out of date, open an issue.

All five tools support the open [Agent Skills](https://agentskills.io/specification) format: a folder with a `SKILL.md` whose frontmatter has `name` (same as the folder) and `description`. They differ in which folders they scan and which instruction file they read first.

| Agent | Instruction file it reads | Skill folders it scans (workspace) | User-level skill folder | Notes |
|---|---|---|---|---|
| Claude Code | `CLAUDE.md` (this kit's `CLAUDE.md` imports `AGENTS.md`). `AGENTS.md` alone is read only when no `CLAUDE.md` exists. | `.claude/skills` (here a link to `.agents/skills`) | `~/.claude/skills` | Linked skill folders work. Skills are picked by description or called as `/skill-name`. |
| Cursor | `AGENTS.md`, plus `.cursor/rules/*.mdc` | `.agents/skills`, `.cursor/skills`, and for compatibility `.claude/skills` | `~/.agents/skills`, `~/.cursor/skills` | No built-in memory since 2.1, so learning lives in `me/` files. |
| Antigravity | `AGENTS.md` or `GEMINI.md` (rules from all scopes are combined) | `.agents/skills` (legacy `.agent/skills`) | `~/.gemini/config/skills` (app and IDE) | Confidence medium: docs are newer and thinner. |
| Codex CLI | `AGENTS.md` only (not `CLAUDE.md`), walking from the git root down to the current folder | `.agents/skills` | `~/.agents/skills` | Instruction files are capped at about 32 KiB in total. |
| Gemini CLI | `GEMINI.md` by default. This kit adds `.gemini/settings.json` so it reads `AGENTS.md` instead. | `.agents/skills` or `.gemini/skills` | `~/.gemini/skills` or `~/.agents/skills` | |

## Why the kit is laid out this way
- **`.agents/skills/` holds every skill once.** Four of the five tools scan it directly.
- **`.claude/skills` is a link** to the same folder, for Claude Code.
- **`AGENTS.md` is the single hub.** `CLAUDE.md` imports it, and `.gemini/settings.json` points Gemini CLI at it, so there is one source of truth.
- **Personal files are plain files in `me/`**, not each tool's built-in memory. Built-in memory differs per tool, is local to one machine, and Cursor has none.

## Sources
- Claude Code: [memory and CLAUDE.md](https://code.claude.com/docs/en/memory) · [skills](https://code.claude.com/docs/en/skills)
- Codex: [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) · [skills](https://learn.chatgpt.com/docs/build-skills)
- Cursor: [skills](https://cursor.com/docs/skills) · [rules](https://cursor.com/docs/context/rules)
- Antigravity: [skills](https://antigravity.google/docs/skills/) · [rules](https://antigravity.google/docs/rules/)
- Gemini CLI: [skills](https://geminicli.com/docs/cli/skills/) · [GEMINI.md and context files](https://geminicli.com/docs/cli/gemini-md/)
