# MAJI Skills — Analytics

Reproducible measurement of skill impact on your own usage.

```bash
python parse.py                              # → messages.parquet
python analyze.py --skills-launch YYYY-MM-DD # → summary.json + charts/
```

Required: `pandas`, `pyarrow`, `matplotlib`, `seaborn`.

```bash
pip install pandas pyarrow matplotlib seaborn
```

See [methodology.md](./methodology.md) for the exact procedure and
[../BENCHMARKS.md](../BENCHMARKS.md) for the numbers measured on the maintainer's
own usage.

## Anonymising before sharing

If you want to share your `summary.json` for community benchmark aggregation:

```bash
python parse.py --anonymise-projects
```

Project folder names become `project_001`, `project_002`, … in the output.
The summary contains only aggregate statistics — no message text.
