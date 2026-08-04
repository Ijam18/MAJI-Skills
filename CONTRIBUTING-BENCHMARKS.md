# Contributing a benchmark

The numbers in [BENCHMARKS.md](./BENCHMARKS.md) are from one person's logs (n = 1). The single most useful thing you can do for this project is turn that into **n > 1** — run the same pipeline on **your** Claude Code logs and PR the result.

We publish every contribution, **including ones where the skills made your replies longer.** That's the point: honest data beats a flattering average.

## What you need

- The skills installed (see the main [README](./README.md)) and used for **~2 weeks** of normal work, so there's enough signal.
- Python with `pandas` + `pyarrow` (for `parse.py`) and `matplotlib` + `seaborn` (for `analyze.py`'s charts). The aggregator itself is standard-library only.

## Steps

```bash
git clone https://github.com/Ijam18/MAJI-Skills.git
cd MAJI-Skills/analytics

# 1. Extract your local logs into a table (privacy: --anonymise-projects
#    strips project names; nothing leaves your machine).
python parse.py --anonymise-projects

# 2. Compute cohort + mode stats. Pass the date you installed the skills so it
#    can split pre/post. No pre-skills history? That's fine — the jimat-vs-default
#    delta still counts.
python analyze.py --skills-launch YYYY-MM-DD
#    → writes summary.json
```

Then:

3. Copy [`community-benchmarks/_template.json`](./community-benchmarks/_template.json) to `community-benchmarks/<your-handle>.json`.
4. Paste the `cohort` and `mode` blocks from your `summary.json` into it.
5. Fill in `contributor` (a handle or an anonymous id — your call), `window` (rough dates), and `note` (workload mix, e.g. "mostly Python, jimat on heavy days").
6. **Do not** commit `messages.parquet`, `summary.json`, or `charts/` — they're gitignored, and the parquet holds your real message text. Only the small hand-made `<your-handle>.json` goes in the PR.
7. Open a PR with that one file. A maintainer runs `python analytics/aggregate.py` to regenerate [COMMUNITY-BENCHMARKS.md](./COMMUNITY-BENCHMARKS.md).

## What we're looking for

- **Honesty over flattery.** If your median went up, report it. That entry is more valuable than a good one.
- **A stated window and workload note** so readers can weigh it (a code-heavy fortnight and a docs-heavy one won't match — expected).
- **No message content.** Only the aggregate `summary.json` numbers.

## Privacy, precisely

`summary.json` contains: message *counts*, and median / mean / P90 *output-token* values per cohort and per mode. It does **not** contain any message text, code, file paths, or (with `--anonymise-projects`) project names. You can read the whole file before you PR it — it's a few dozen numbers.
