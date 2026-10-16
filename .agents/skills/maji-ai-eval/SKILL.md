---
name: maji-ai-eval
description: "Evaluate an LLM feature from real evidence: collect and sample real traces, read them and open-code failures, group notes into a failure taxonomy with counts, fix obvious prompt gaps, write code checks first and binary LLM-judge prompts only where code cannot decide, validate each judge against human labels, freeze a golden set, gate prompt and model changes in CI, and keep eval cost bounded. Use when an AI feature feels unreliable, before changing a prompt or model, or when someone asks how good the AI is. Triggers: \"evaluate the AI feature\", \"error analysis on these traces\", \"why does the chatbot fail\", \"build an eval set\", \"write an LLM judge\", \"is the judge trustworthy\", \"regression test the prompt\", \"can we switch models safely\". Not for scoring profiles against jobs (use maji-match-rubric) or for live error and spend monitoring (use maji-observe)."
metadata:
  tier: workflow
  category: product
  version: "1.0.0-lite"
---

# maji-ai-eval: Evaluate an LLM Feature

Replace "the AI feels off" with named failure modes, counted, checked automatically and guarded on every change. Final output: a failure taxonomy with counts, code checks and validated judges per mode, a frozen golden set, and a CI gate that blocks a prompt or model change that regresses.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Tools and credits, Folders). If `me/overrides/maji-ai-eval.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use when an AI feature (chat, extraction, summary, classifier, agent) ships or is about to, and nobody can say how often it fails or how.
- Use before any prompt, model or retrieval change, so the change is judged against the same set.
- Not for match scoring with have / partial / missing labels (maji-match-rubric). Not for uptime, error alerts or spend caps (maji-observe).

## Steps

1. **Collect real traces.** Export inputs, outputs, tool calls and metadata (model, prompt version, latency, user segment) from logs or the tracer, to a local JSONL outside the repo.
2. **Inventory before tooling.** Read 5 to 10 records.
3. **Sample for diversity, not volume.** Cluster on a few cheap features (length, task type, tool count, outcome) and take one or two per cluster, plus about a third random picks the clustering might miss.
4. **Open-code the failures.** Read each record fully and write a free-text note on the first thing that went wrong, in plain words ("ignored the date filter", "invented a policy number").
5. **Build the taxonomy.** Group notes into named failure modes, each with a one-line definition, a count and two example record ids.
6. **Fix spec gaps before evaluating.** If a mode exists because the prompt never asked for the behaviour (format, language, refusal rule), fix the prompt first.
7. **Code checks first.** For each remaining mode ask: can code decide it?
8. **LLM judge only where code cannot decide.** One judge per failure mode, never one holistic judge.
9. **Validate the judge against humans.** Label traces Pass/Fail by hand for that mode.
10. **Freeze a golden set.** Labelled records covering every mode plus normal passes, versioned in the repo (pseudonymised) or in private storage with a pointer.
11. **Regression gate.** One command (`npm run eval` or `pytest evals/`) runs code checks on every case and judges on the cases that need them, prints pass rate per mode, and exits non-zero when a mode drops below its baseline.
12. **Bound the eval cost.** Code checks run on everything; judges run on the golden set and a small production sample.

## Composes with

- `maji-match-rubric`: same golden-set and labelling discipline, specialised for match scoring.
- `maji-observe`: supplies production traces and carries the daily eval pass rate into the digest.
- `maji-ship` for the CI gate, `maji-propose` before a model switch, `maji-debug` for a single failing case.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-ai-eval` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
