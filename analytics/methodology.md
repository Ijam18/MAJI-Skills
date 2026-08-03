# Methodology

The exact procedure used to produce the figures in [BENCHMARKS.md](../BENCHMARKS.md).

## 1. Data source

Claude Code stores every conversation as one JSONL file per session under
`~/.claude/projects/<project-key>/<session-id>.jsonl`.

Each line is one event. The events of interest are:

- `type: "user"` — a prompt typed by you. May contain mode toggle signals like `jimat on`.
- `type: "assistant"` — a reply from Claude. Carries the `usage` object with token counts.

## 2. Extraction (`parse.py`)

For every assistant message we capture:

| Field | Meaning |
|---|---|
| `input_tokens` | New input tokens for this turn (not cached) |
| `output_tokens` | Generated reply length — the primary metric |
| `cache_read` | Tokens served from cache |
| `cache_creation` | Tokens written to cache |
| `model` | Model ID at time of generation |
| `timestamp` | ISO-8601, UTC |

For every user message we record any mode signals matched against:

```
jimat on | jimat penuh | jimat ringan | jimat ultra | jimat off
dry on   | dry off
answer-only on | answer-only off
```

and any explicit skill invocations matching `maji-(mode|commit|explain|debug|review|doc|test|refactor|summary|todo)`.

Output: `messages.parquet` — one row per user/assistant event.

## 3. Mode tagging (`analyze.py: tag_active_mode`)

Mode state is tracked per session and starts as `default`. When a user message
contains a matching toggle, the state changes for all subsequent assistant
messages in the same session until an opposing toggle.

This means a single `jimat on` user message marks every subsequent assistant
message in that session as `active_mode = jimat`, until either `jimat off` or
the session ends.

## 4. Cohort split

| Cohort | Condition |
|---|---|
| `pre`  | `ts < skills_launch` |
| `post` | `ts >= skills_launch` |

Default skills_launch = `2026-05-07` — the date the global `~/.claude/CLAUDE.md`
was patched to auto-load `maji-mode` patterns.

## 5. Metrics

Per cohort and per mode, three statistics are computed on `output_tokens`:

- `median` — typical reply
- `mean` — sensitive to outliers; captures the long-tail effect
- `p90` — 90th percentile, the long replies

Percentage deltas are reported relative to the comparison baseline (pre for
cohort comparison, default for mode comparison).

## 6. Charts

Three charts are produced:

- `01-daily.png` — daily output tokens; pre bars in gray, post in black, blue dashed line at launch.
- `02-cohort.png` — box plot, output tokens by cohort.
- `03-mode.png` — box plot, output tokens by active mode (post-skills period only).

## 7. Reproducing

```bash
cd analytics/
python parse.py                              # → messages.parquet
python analyze.py --skills-launch 2026-05-07 # → summary.json + charts/
```

Replace `--skills-launch` with the date you started using MAJI Skills.

## 8. Known limitations

1. **No true control group.** Skills auto-load once installed at user-level. There is no parallel cohort using the same workload without skills.
2. **Cohort sizes are unequal.** Naturally — you cannot measure both windows simultaneously.
3. **Workload composition varies.** Token counts conflate skill effect with task type (code-heavy vs prose-heavy weeks).
4. **`output_tokens` includes uncompressible content.** Tool calls and code blocks count toward the total but are not affected by skills rules.
5. **Mode tagging requires explicit toggles.** If you treat `/jimat penuh` as ambient default (per the doctrine), but never type it, the data will say `default` for every message.

These caveats are why we report ranges (18–28%) rather than a single hero number.

## 9. Privacy

All processing happens locally. The pipeline:

- Reads only from `~/.claude/projects/`
- Writes only to the working directory (`messages.parquet`, `summary.json`, `charts/`)
- Does not send anything over the network
- Optionally anonymises project names with `--anonymise-projects` (replaces folder names with `project_001`, `project_002`, …)

Nothing is uploaded. If you publish your `summary.json` as part of a community
benchmark contribution, that is your choice — it contains aggregate statistics
only, no message text.
