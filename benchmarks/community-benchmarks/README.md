# community-benchmarks/

Contributed `summary.json` files — one per person — measuring MAJI Skills on **their own** logs.

Each file is the output of [`analytics/analyze.py`](../analytics/analyze.py) plus a little metadata (`contributor`, `window`, `note`). [`analytics/aggregate.py`](../analytics/aggregate.py) reads everything here and regenerates [`../COMMUNITY-BENCHMARKS.md`](../COMMUNITY-BENCHMARKS.md).

## Add yours

Full steps: [CONTRIBUTING-BENCHMARKS.md](../CONTRIBUTING-BENCHMARKS.md). In short:

1. Use the skills normally for ~2 weeks.
2. `cd analytics && python parse.py && python analyze.py` → produces `summary.json`.
3. Copy `_template.json` → `<your-handle>.json`, paste in your `cohort`/`mode` blocks, fill `contributor`/`window`/`note`.
4. Open a PR with just that one file.

## Privacy

`summary.json` is **aggregate statistics only — no message text, no code, no file contents.** `parse.py --anonymise-projects` also strips project names. Nothing here identifies your work; it's counts and token medians.

## The rule

We publish every contribution, **including ones where the skills made you more verbose.** No cherry-picking, no averaging away the disagreement. Honest data or nothing.

*(Files starting with `_`, like `_template.json`, are ignored by the aggregator.)*
