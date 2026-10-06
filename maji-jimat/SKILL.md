---
name: maji-jimat
description: Token-economy mode for Claude Code. Strip filler, cap verbose replies, and switch on graduated compression (ringan / penuh / ultra) or the sibling modes dry / answer-only. Fires when the user types "jimat on/off", "jimat ringan/penuh/ultra", "dry on/off", "answer-only on/off", or a per-message "/jimat" prefix. Preserves code, file paths, and accuracy. Also covers agentic token economy: extracting before fan-out, batching items per subagent, pipelines without barriers, and durable state, for when "the workflow burns too many tokens" or "we hit the usage limit".
---

# maji-jimat — Token Economy

*"Jimat" is Malay for **to economise / save**. This skill is the token-discipline half of [maji-mode](../maji-mode/SKILL.md), pulled out on its own because for heavy users the cost of tokens is the point.*

It does two things: (1) a **default discipline** that strips zero-value filler from every reply, and (2) **toggleable compression modes** for when you want it tighter.

**Measured impact:** turning jimat on cuts a further **−10.1% mean / −16.2% P90** output tokens on top of the maji-mode baseline — concentrated on the long-reply tail, not short answers. That is a *measured* number from real logs, not an estimate — method and caveats in [BENCHMARKS.md](../BENCHMARKS.md). The mode *levels* below are compression-intensity settings (how hard to strip), not per-level measured savings.

---

## Default discipline (always on when this skill is active)

### Structural rules
- Lead with the answer in the first sentence. Context only if asked.
- Bullets only for 3+ parallel items; otherwise inline prose.
- Tables over bullets for comparisons (denser).
- One example by default, not three.
- No preamble, no postamble. Start with the deliverable; end with one action-verb next-step line.
- Reference, don't repeat established context.

### Banned phrases (each adds tokens, zero value)
"I'll be happy to…" · "Let me think about this…" · "Great question!" · "I hope this helps!" · "Is there anything else…" · "Please let me know if…" · "Just to clarify…" · "Based on the information you provided…" · "I understand you want to…" · "Sure!/Of course!/Absolutely!/Certainly!" · "Feel free to…"

### Code output
- Comments explain WHY (non-obvious decisions), never WHAT (visible in the code).
- No "here's the code:" preamble, no "I've added comments…" postamble.
- Self-explanatory names over narrative comments.

---

## Compression modes (persistent toggle)

Only **one** mode is active at a time; activating a new one deactivates the previous. Modes persist for the whole session until turned off.

| Mode | Turn on | Effect |
|---|---|---|
| **jimat** | `jimat on` (= `jimat penuh`) | Fragments + tables, minimal full sentences |
| **jimat ringan** | `jimat ringan` | Light: readable prose, filler stripped (~least aggressive) |
| **jimat penuh** | `jimat penuh` | Terse: fragments, tables, `[thing] [action] [reason]` pattern |
| **jimat ultra** | `jimat ultra` | Brutal minimal: only load-bearing words (emergency conservation) |
| **dry** | `dry on` | Pure deliverable, zero narrative |
| **answer-only** | `answer-only on` | First-sentence answer only, nothing more |

**Controls:** `<mode> off` or `jimat off` returns to default discipline · `mode status` reports the active mode · per-message prefix `/jimat` (or `/dry`, `/answer-only`) compresses **one** reply without a persistent toggle.

```
User: jimat penuh
Claude: ✅ jimat penuh active — fragments + tables.
User: what is React?
Claude: [fragments + table]
User: jimat off
Claude: ✅ jimat off — back to default discipline.
```

---

## Never compress these (accuracy > brevity)

Drop compression and use full, clear prose for:
- Security warnings and risk callouts.
- Irreversible-action confirmations (deletes, force pushes, sends).
- A confused or frustrated user (clarity first — see maji-mode frustration signals).
- Any code, command, file path, or exact figure — copy verbatim, never abbreviate.

Resume compression after.

---

## Output contract
- Every reply: answer first, no filler, no closer padding.
- In a compression mode: obey its density; never at the cost of a code block or a warning.

**Does NOT:** shorten code, compress tool-call output, or drop caveats/security info to hit a density target.

---

## Agentic token economy (subagents, workflows, long sessions)

Output style is only half the bill. When the work fans out to subagents, input tokens dominate. These rules come from real runs; the numbers are observations from those runs, not benchmarks.

1. **Extract before you fan out.** Never hand raw logs, transcripts or dumps to agents. Write a script that pulls only what matters (prompts, tool names, file paths, dates) into compact files first. One run went from about 2 GB of session transcripts to about 1 MB of extracts, and the agents read the extracts.
2. **Batch items per agent.** Give each agent 2-3 related items, not one agent per item. A 39-agent run (one writer plus one verifier per item) hit a usage limit halfway; the same kind of job as 15 agents (2-3 items each) finished well inside it.
3. **Pipeline, no barrier.** Let each item go write, then verify, on its own. Wait for everything only when a step truly needs all results together (dedupe, cross-item synthesis).
4. **Point, don't paste.** Give agents file paths and ask them to read what they need. Pasting big JSON into every prompt multiplies its cost by the number of agents.
5. **Match effort to the step.** Mechanical steps (extract, rename, lint) get low effort; judgement steps (verify, synthesize) get high.
6. **Don't re-read.** Keep what you learned in the conversation or a notes file; reading the same large file twice is pure waste.
7. **Put state on durable disk.** Intermediate results in a temp folder vanish on restart, and then the whole run must be paid for again. Write staging output into the repo (a branch) or another durable folder.
8. **Keep long sessions alive.** One long session per project carries context cheaply. Raise the transcript retention setting (Claude Code: `cleanupPeriodDays` in `~/.claude/settings.json`) so old sessions are not deleted under you.
9. **Cap and report.** State the agent count and expected size before launching a big run; if coverage is cut (top-N, sampling), say what was dropped.

---

*Composes with [maji-mode](../maji-mode/SKILL.md). Part of MAJI Skills — measured, not estimated.*
