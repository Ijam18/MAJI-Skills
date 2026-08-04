<div align="center">

# 🛠 MAJI Skills

### Most token-saving claims are guesses. We measured ours — and corrected them.

A small set of Claude Code skills that enforce a working discipline: say the outcome, pick a decision mode, stop when you're frustrated, confirm before anything destructive. We shipped claiming big token savings. Then we measured. The real number is smaller — and we published it.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-0066FF.svg)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-000000.svg)](https://docs.claude.com/en/docs/claude-code)
[![Impact: Measured, not estimated](https://img.shields.io/badge/Impact-Measured%2C%20not%20estimated-0066FF.svg)](./BENCHMARKS.md)

[**⬇️ Install**](#-install) · [**📊 Read the benchmark**](./BENCHMARKS.md) · [**🧪 The skills**](#-the-skills)

</div>

---

## The honest pitch

We originally launched claiming **75% / 87% token savings**. Those were estimates. They did not survive measurement.

The real, measured impact from **29,582 Claude Code messages** over 19 days:

| Metric | Measured impact |
|---|---:|
| Mean output tokens per message | **−18.2%** |
| 90th-percentile (long replies) | **−28.3%** |
| Median (typical short reply) | **−3.3%** (essentially flat) |
| Extra reduction with Jimat mode on | −10.1% mean / −16.2% P90 |

Full method, caveats, and the scripts that produced these numbers: **[BENCHMARKS.md](./BENCHMARKS.md)**.

So if you came for a headline token percentage, that's it: modest, real, and honestly the least interesting thing about these skills. The value is elsewhere.

---

## What the skills actually do well

The token math caps *verbose* replies — long answers get ~28% shorter, short ones barely move. But the reason to install this isn't the byte count. It's four failure modes it removes from your day:

- **Scope-drift guards.** You ask Claude to fix a typo; it refactors three files you never mentioned. A **Pre-Action Gate** forces a stop before anything destructive or scope-expanding — force pushes, branch deletes, "while I was in there" rewrites. You review before it happens, not after.

- **Frustration detection.** When you say *"that's not right"*, default behaviour is variant 2, variant 3, variant 4. Here, a frustration signal **halts** and asks what you actually want instead of doubling down. One clean pivot beats five guesses.

- **Decision modes.** Every prompt is read as **discuss / build / pause / pivot**. "Let's proceed phase by phase" stays a *plan*, not 11 surprise commits. The ambiguity that costs you rework gets resolved up front.

- **A portable, consistent discipline.** It's one plain-text file. The same operating posture rides along on **any project, any language, any stack** — and the core patterns (outcome-first, decision modes, frustration signals, banned padding) transfer to a raw system prompt too. You stop re-explaining your working style every session.

That consistency is the actual product. The −18% is a side effect.

---

## Where it does *not* help (measured, stated plainly)

- **Short Q&A** — already short, nothing to trim (median moves ~3%).
- **Tool-call output** — JSON from tools isn't compressed.
- **Code blocks** — code isn't re-flowed or shortened.

If your workload is mostly short questions or code generation, expect the discipline benefits (scope, frustration, pivots) but little token change. We'd rather you know that before installing.

---

## 🧪 The skills

**6 core** — the highest-frequency dev workflows. **5 experimental** — not yet validated by sustained real-world use.

### Core

| Skill | What it does | Frequency |
|---|---|---|
| **[maji-mode](./maji-mode/SKILL.md)** | Foundation discipline: outcome-first, decision modes, frustration signals, Pre-Action Gate. Install this first. | Every session |
| **[maji-jimat](./maji-jimat/SKILL.md)** | Token economy: strips filler + graduated compression (`jimat` / `dry` / `answer-only`). Where the measured token savings actually come from. | Every session |
| **[maji-commit](./maji-commit/SKILL.md)** | Reads your git diff, writes a conventional-commits message. | Daily |
| **[maji-explain](./maji-explain/SKILL.md)** | Layered explanations: one-sentence answer → bullets → deep dive on request. | Daily |
| **[maji-debug](./maji-debug/SKILL.md)** | 5-step protocol: symptom → hypothesis → verify → gate → minimum-change fix. | Per task |
| **[maji-review](./maji-review/SKILL.md)** | Code review grouped by severity with `file:line` refs. No preamble. | Per task |

Everything else inherits `maji-mode`'s posture (no preamble, banned padding phrases, action-verb endings), so they compose rather than conflict.

### Experimental

`maji-test` · `maji-doc` · `maji-refactor` · `maji-summary` · `maji-todo` — see [`experimental/`](./experimental).

A skill graduates to core when daily/weekly use is proven **and** at least one external contribution (PR, issue, testimonial) validates it. We won't promote on speculation.

---

## 📦 Install

**Recommended — user-level (applies to every project):**

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/Ijam18/MAJI-Skills.git
cp -r MAJI-Skills/maji-mode ~/.claude/skills/
```

**Project-level (single repo):**

```bash
mkdir -p ./.claude/skills
git clone https://github.com/Ijam18/MAJI-Skills.git
cp -r MAJI-Skills/maji-mode ./.claude/skills/
```

**Always-on (loaded every session):** append `maji-mode/SKILL.md` to `~/.claude/CLAUDE.md`.

```bash
git clone https://github.com/Ijam18/MAJI-Skills.git
cat MAJI-Skills/maji-mode/SKILL.md >> ~/.claude/CLAUDE.md
```

Then start a session and type `/maji-mode` (or let user-level skill discovery auto-load it).

**Uninstall:** `rm -rf ~/.claude/skills/maji-mode` (or remove the appended section from `CLAUDE.md`). No telemetry, no phone-home — it's a static markdown file Claude reads locally.

---

## Why you can trust the numbers

Three reasons, all checkable:

1. **We published the measurement pipeline.** Two scripts (`parse.py`, `analyze.py`) plus `methodology.md`, AGPL-licensed alongside the skills. They read your local `~/.claude/projects/` logs, write a Parquet table and a `summary.json`, and never send data anywhere (`parse.py --anonymise-projects` even strips project names). You can **reproduce your own before/after** in about two weeks of normal use. See [BENCHMARKS.md § Reproducing the numbers](./BENCHMARKS.md#reproducing-the-numbers).

2. **We corrected our own overclaim in public.** The 75%/87% figures are gone, replaced with −18% / −28% and a versioned changelog explaining why. The benchmark lists its own caveats first: no true control group, one user, one period, cohort sizes differ, `output_tokens` includes uncompressible code and tool calls.

3. **We show the deployment footprint honestly labelled.** Since activation the skills have run continuously across the maintainer's real workload — **3,502 sessions, 145 projects, 164,668 messages, ~48.84B tokens** (28 May – 3 Aug 2026). We call that what it is: **scale-of-deployment evidence, not a controlled comparison.** It proves the discipline is livable day-to-day at scale; it does not re-prove the −18%. Both matter; we don't blur them.

Disclosure: the benchmark author is also the maintainer, measuring their own logs. Independent replication is welcome — open a PR with your `summary.json` and we'll aggregate community data over time (see [ROADMAP.md](./ROADMAP.md)).

---

## Who this is for

Solo founders, indie hackers, vibe-coders, and senior devs using Claude as a pair programmer — anyone who loses more time to scope creep and re-explaining their style than to raw token count. Casual weekend tinkerers may find the overhead exceeds the benefit; that's a fair call to make.

---

## Contributing

PRs welcome. A pattern earns a place if it's **universal** (not tied to one project/language), **token-neutral-or-positive**, **explainable in two sentences**, and **backed by a real failure mode it prevents**. Bonus points for a `summary.json` showing measured effect. See [ROADMAP.md](./ROADMAP.md) for where this is headed.

---

## License

**AGPL v3** — strong copyleft. Use, modify, and redistribute freely; derivatives and network-served modifications must also be AGPL v3 and source-available. See [LICENSE](./LICENSE).

---

## About MAJI

MAJI (Malaysia Artificial Joint Institute) is an applied-AI movement that ships tools and teaches building over consuming. Origin: Malaysia. Audience: anyone, anywhere.

→ LinkedIn: [Zarul Izham (Ijam)](https://www.linkedin.com/in/zarulijam/) · Threads: [@_zarulijam](https://www.threads.com/@_zarulijam)

Tag the repo when you share it — happy to feature builders using `maji-mode` in the wild.
