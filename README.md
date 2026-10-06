<div align="center">

# 🛠 MAJI Skills

### Skills for AI agents, built from real work.

A working discipline plus playbooks distilled from real, repeated work: planning, shipping, documents, images, video, social media and sales. Every skill is a plain `SKILL.md` that Claude Code, Cursor, Antigravity, Codex and Gemini CLI can read, and each one adapts to your own context.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-0066FF.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-SKILL.md-000000.svg)](https://agentskills.io)
[![Impact: Measured, not estimated](https://img.shields.io/badge/Impact-Measured%2C%20not%20estimated-0066FF.svg)](./benchmarks/BENCHMARKS.md)

[**Quickstart**](#quickstart) · [**What's inside**](#whats-inside) · [**How your agent learns**](#how-your-agent-learns) · [**Benchmarks**](./benchmarks/BENCHMARKS.md)

</div>

---

## Quickstart

```bash
git clone https://github.com/Ijam18/MAJI-Skills.git my-agent
```

1. Open `my-agent` in your agent (Claude Code, Cursor, Antigravity, Codex or Gemini CLI). It reads [`AGENTS.md`](./AGENTS.md) and finds every skill in [`.agents/skills/`](./.agents/skills) on its own.
2. Say **"run maji-setup"**. Your agent asks a few questions (voice, stack, brand, folders, tools) and saves your answers to `me/profile.md`.
3. Work as usual. Ask for a plan, a PDF, a poster batch or a deploy, and the agent picks the matching skill and follows it.

**Already have an agent folder?** Clone the kit inside it and link it in:

```bash
git clone https://github.com/Ijam18/MAJI-Skills.git <your-folder>/.maji-skills
<your-folder>/.maji-skills/scripts/setup.sh <your-folder>      # Windows: scripts\setup.ps1 <your-folder>
```

---

## What's inside

Every skill is a folder with one `SKILL.md`: when to use it, the steps, the pitfalls that actually happened, and a done-when checklist. The full list with one line each is in [`AGENTS.md`](./AGENTS.md).

| Area | Skills |
|---|---|
| Discipline (apply first) | `maji-mode` · `maji-jimat` |
| Setup and learning | `maji-setup`* · `maji-learn`* |
| Plan and run work | `maji-propose` · `maji-session-handoff` · `maji-dev-up` · `maji-deadline-sprint` |
| Code | `maji-commit` · `maji-debug` · `maji-explain` · `maji-review` · `maji-test`* · `maji-doc`* · `maji-refactor`* · `maji-todo`* |
| Ship and maintain | `maji-ship` · `maji-repo-hygiene` · `maji-vendor-block` · `maji-scheduled-job` |
| Product and UI | `maji-ui-review` · `maji-app-capture` |
| Content and media | `maji-brand-kit` · `maji-image-gen` · `maji-poster-batch` · `maji-video-gen` · `maji-code-video` · `maji-video-transcribe` · `maji-meta-schedule` |
| Documents and sales | `maji-brand-pdf` · `maji-doc-fill-sign` · `maji-offer` · `maji-client-helpdesk` · `maji-outreach`* |
| Data and writing | `maji-real-data` · `maji-summary`* |

\* experimental: useful, not yet validated by sustained use outside one owner. How skills move between tiers: [`docs/TIERS.md`](./docs/TIERS.md).

---

## How your agent learns

Everything personal lives in files your agent reads and writes, inside your folder. None of it is committed, so updates never conflict with it.

| File | What it holds | Who writes it |
|---|---|---|
| `me/profile.md` | Your voice, language, stack, brand, folders, allowed tools, money and tax details | `maji-setup` (start from [`profile.example.md`](./profile.example.md)) |
| `me/overrides/<skill>.md` | How one skill should behave differently for you | You or your agent |
| `.agents/skills/my-<name>/` | New skills your agent builds from work you repeat | `maji-learn` |
| `me/learned.md` | A short dated log of what was learned and where it went | Your agent |

Every skill starts with **Step 0**: read the profile sections it needs, apply your override if there is one, and ask once if something is missing.

---

## Works with

| Agent | Reads the hub | Finds skills in |
|---|---|---|
| Claude Code | `CLAUDE.md` (imports `AGENTS.md`) | `.claude/skills` (a link to `.agents/skills`) |
| Cursor | `AGENTS.md` | `.agents/skills` |
| Antigravity | `AGENTS.md` | `.agents/skills` |
| Codex CLI | `AGENTS.md` | `.agents/skills` |
| Gemini CLI | `AGENTS.md` (via `.gemini/settings.json`) | `.agents/skills` |

Sources and details per tool: [`docs/tools.md`](./docs/tools.md). On Windows, git may check out `.claude/skills` as a plain file; run `scripts\setup.ps1` or enable `core.symlinks`.

---

## Updating

```bash
git pull --ff-only
```

Your `me/` folder and `my-*` skills are gitignored, so a pull never touches them. What changed: [`CHANGELOG.md`](./CHANGELOG.md).

**Upgrading from v1:** skills moved from the repo root, `experimental/` and `workflows/` into `.agents/skills/`. If you copied skills with `cp -r`, delete the old copies and use the quickstart above. If you symlinked them, point the links at `.agents/skills/<name>`.

---

## Measured, not estimated

We first claimed 75% / 87% token savings. Those were estimates and they did not survive measurement. Measured over **29,582 Claude Code messages** in 19 days:

| Metric | Measured impact |
|---|---:|
| Mean output tokens per message | **−18.2%** |
| 90th percentile (long replies) | **−28.3%** |
| Median (typical short reply) | **−3.3%** (essentially flat) |
| Extra reduction with `maji-jimat` on | −10.1% mean / −16.2% P90 |

The number is the least interesting part. The real value is the discipline: a Pre-Action Gate against scope drift, frustration detection that stops instead of guessing again, and decision modes that keep a plan a plan. Short Q&A, tool output and code blocks barely change.

Method, caveats and the scripts to reproduce it on your own logs: [`benchmarks/BENCHMARKS.md`](./benchmarks/BENCHMARKS.md). The benchmark author is also the maintainer, measuring their own logs; independent replication is welcome ([`benchmarks/CONTRIBUTING-BENCHMARKS.md`](./benchmarks/CONTRIBUTING-BENCHMARKS.md)).

---

## Contributing

PRs welcome. A skill earns a place if it is **universal** (not tied to one project), **explainable in two sentences**, and **backed by a real failure it prevents**. Run `node scripts/lint-skills.mjs` and `node scripts/build-index.mjs` before opening a PR. Roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## License

**AGPL v3.** Use, modify and redistribute freely; derivatives and network-served modifications must also be AGPL v3 and source-available. See [LICENSE](./LICENSE).

## About MAJI

MAJI (Malaysia Artificial Joint Institute) is an applied-AI movement that ships tools and teaches building over consuming. Origin: Malaysia. Audience: anyone, anywhere.

LinkedIn: [Zarul Izham (Ijam)](https://www.linkedin.com/in/zarulijam/) · Threads: [@_zarulijam](https://www.threads.com/@_zarulijam)
