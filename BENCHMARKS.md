# Benchmarks

Honest, reproducible measurement of MAJI Skills' real-world impact.

## TL;DR

| Metric | Measured impact |
|---|---:|
| Mean output tokens per assistant message | **−18.2%** |
| 90th-percentile output tokens (long replies) | **−28.3%** |
| Additional reduction when Jimat mode is on | **−10.1%** mean / **−16.2%** P90 |
| Median output tokens (typical reply) | −3.3% (essentially flat) |

These are smaller than earlier README claims of 75% / 87%. The earlier figures were estimates; these numbers are from data.

## Window

| Field | Value |
|---|---|
| Sample size | 29,582 Claude Code messages |
| Projects covered | 21 |
| Calendar window | 1 May 2026 – 19 May 2026 |
| Skills activated | 7 May 2026 (Day 512) |
| Pre-cohort | 1–6 May (2,364 messages) |
| Post-cohort | 7–19 May (15,365 messages) |

## Real-world usage at scale (through 3 Aug 2026)

The −18% / −28% figures above come from the controlled May window. Since then the skills have run continuously across the maintainer's entire real workload. This is the honest **deployment footprint** — not a before/after, since every session after 7 May is post-activation:

| Field | Value |
|---|---:|
| Calendar span | 28 May – 3 Aug 2026 |
| Sessions | 3,502 |
| Projects | 145 |
| Assistant messages (billable) | 164,668 |
| **Total tokens** | **~48.84B** |
| — cache read | 47.10B (96%) |
| — cache creation | 1.55B |
| — output (generated) | 156.9M |
| — fresh input | 37.6M |

**Output-token distribution (full corpus):** mean **953** · median **356** · P90 **2,646** · P99 **7,944** · max 64,000. Same shape the May study found — short replies stay short; the long tail is where the discipline bites.

**Model mix (by message):** Opus 4.8 **82%** · Haiku 4.5 7% · Sonnet 5 3% · Opus 4.7 3% · Sonnet 4.6 2% · Fable 5 2%.

**Heaviest workloads (output tokens):** DigiCorp 62.5M · Suara-Malaysia 16.3M · MyTamiya 8.9M · MyOpinion 8.0M · ImelcLegacy 7.8M.

This is not a controlled comparison — it is scale-of-deployment evidence: the skills have been the maintainer's default operating discipline across ~2.5 months, 145 projects, and ~49 billion tokens.

## What was measured

For every assistant message we recorded:

- `input_tokens`
- `output_tokens`  ← primary metric
- `cache_read_input_tokens`
- `cache_creation_input_tokens`
- `model`
- `timestamp`
- session ID + active mode (default / jimat / dry / answer-only)

We compared distributions before vs after skills activation, and within the post-skills cohort, jimat-on vs default.

## Where the skills work

- **Long replies (P90)**: −28%. Multi-paragraph answers, big explanations, verbose closers — these get capped.
- **Mean across all replies**: −18%. Pulled down by the long-reply cap.
- **Median (typical reply)**: ~unchanged. Short answers had little to trim.

## Where the skills do *not* work

- **Tool call output** — JSON returned by tools is not compressed by token-discipline rules.
- **Code blocks** — code does not get re-flowed or shortened.
- **Single-sentence Q&A** — already short; nothing to remove.

## Jimat mode reality check

The global `CLAUDE.md` doctrine recommends `/jimat penuh` as always-on by default. In practice it was explicitly active in only **15.7%** of post-skills messages (2,409 out of 15,365). When active, the further compression is real (~10% mean / ~16% P90) but is concentrated on the long-reply tail. The *median* reply in jimat mode is actually slightly higher than default — a selection-bias artefact, since jimat tends to be toggled at the start of heavier tasks.

## Caveats

1. **No true control group.** Skills auto-load via `~/.claude/CLAUDE.md` from the activation date onwards.
2. **Cohort sizes differ.** Pre = 6 days · 2,364 messages. Post = 13 days · 15,365 messages.
3. **Workload composition is not constant.** Some weeks lean text, others lean code.
4. **`output_tokens` includes tool calls and code.** These are not compressible by the skills.
5. **One user, one period.** Other users on other workloads may see different numbers.

## Methodology

Four scripts. Self-contained. AGPL v3 licensed alongside the skills.

```
analytics/
├── parse.py           Extract messages from local Claude Code JSONL logs into a Parquet table.
├── analyze.py         Compute cohort + mode statistics and produce charts.
└── methodology.md     Step-by-step procedural notes.
```

Run order:

```bash
python parse.py     # writes messages.parquet
python analyze.py   # writes summary.json + charts/*.png
```

No data leaves your machine. The pipeline reads from `~/.claude/projects/` directly.

## Reproducing the numbers

1. Install the skills as described in the main README.
2. Use Claude Code normally for at least two weeks.
3. Clone this repo. `cd` into `analytics/`.
4. Run `parse.py` then `analyze.py`.
5. Inspect `summary.json` for your own pre/post or default/jimat breakdown.

Reported numbers will differ from this baseline depending on your workload mix.

## Disclosure

The author of this benchmark is also the maintainer of MAJI Skills. Numbers were measured from the maintainer's own usage logs. Independent replication is welcome — file a PR with your `summary.json` and we will aggregate community data over time.

## Versioning

| Version | Date | Notes |
|---|---|---|
| 1.0 | 19 May 2026 | First measured benchmark. Replaces earlier ~75%/~87% estimates. |
| 1.1 | 3 Aug 2026 | Added real-world usage-at-scale footprint: 3,502 sessions · 145 projects · 164,668 messages · ~48.84B tokens (28 May – 3 Aug). |
