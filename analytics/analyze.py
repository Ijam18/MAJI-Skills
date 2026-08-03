"""
Compute MAJI Skills impact statistics from messages.parquet.

Usage:
    python analyze.py [--data PATH] [--skills-launch YYYY-MM-DD] [--out-json PATH] [--charts-dir DIR]

Produces:
    summary.json   — pre/post + default/jimat aggregates
    charts/*.png   — three reference charts (timeline, cohort box, mode box)

This is the same procedure used to generate the figures in BENCHMARKS.md.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import pandas as pd
import seaborn as sns

BLACK = "#000000"
GRAPHITE = "#1A1A1A"
STEEL = "#868686"
BLUE = "#0066FF"
LIGHT_GRAY = "#ECECEC"

sns.set_style("whitegrid", {"axes.edgecolor": GRAPHITE, "grid.color": "#ECECEC"})
plt.rcParams.update({
    "font.family": ["Montserrat", "Helvetica Neue", "Arial"],
    "axes.titleweight": "bold",
    "axes.titlecolor": BLACK,
    "axes.labelcolor": GRAPHITE,
    "xtick.color": GRAPHITE,
    "ytick.color": GRAPHITE,
})


def tag_active_mode(df: pd.DataFrame) -> pd.DataFrame:
    """Walk each session chronologically and tag every assistant message
    with the mode active at time-of-send, based on prior user toggles."""
    df = df.sort_values(["session", "ts"]).reset_index(drop=True)
    df["active_mode"] = "default"
    state_by_session: dict[str, str] = {}
    for i, row in df.iterrows():
        sid = row["session"]
        state = state_by_session.setdefault(sid, "default")
        if row["role"] == "user":
            sig = row["mode_signals"]
            if "jimat_on" in sig:
                state = "jimat"
            elif "jimat_off" in sig:
                state = "default"
            elif "dry_on" in sig:
                state = "dry"
            elif "dry_off" in sig:
                state = "default"
            elif "answer_only_on" in sig:
                state = "answer_only"
            elif "answer_only_off" in sig:
                state = "default"
            state_by_session[sid] = state
        df.at[i, "active_mode"] = state
    return df


def cohort_summary(df: pd.DataFrame, launch: pd.Timestamp):
    a = df[df.role == "assistant"].copy()
    a["cohort"] = np.where(a["ts"] < launch, "pre", "post")
    return a.groupby("cohort").agg(
        n_messages=("output_tokens", "count"),
        median_output=("output_tokens", "median"),
        mean_output=("output_tokens", "mean"),
        p90_output=("output_tokens", lambda x: x.quantile(0.9)),
        total_output=("output_tokens", "sum"),
        total_input=("total_input", "sum"),
    )


def mode_summary(df: pd.DataFrame, launch: pd.Timestamp):
    post = df[(df.role == "assistant") & (df.ts >= launch)].copy()
    return post.groupby("active_mode").agg(
        n_messages=("output_tokens", "count"),
        median_output=("output_tokens", "median"),
        mean_output=("output_tokens", "mean"),
        p90_output=("output_tokens", lambda x: x.quantile(0.9)),
        total_output=("output_tokens", "sum"),
    )


def chart_daily(df: pd.DataFrame, launch: pd.Timestamp, out: Path):
    a = df[df.role == "assistant"].copy()
    a["date"] = pd.to_datetime(a["date"])
    daily = a.groupby("date").agg(output=("output_tokens", "sum")).reset_index()

    fig, ax = plt.subplots(figsize=(11, 4.6))
    launch_naive = launch.tz_localize(None) if launch.tzinfo else launch
    colors = [STEEL if d < launch_naive else BLACK for d in daily["date"]]
    ax.bar(daily["date"], daily["output"] / 1e6, color=colors, width=0.78, edgecolor="none")
    ax.axvline(launch_naive, color=BLUE, linestyle="--", linewidth=2)
    ax.set_ylabel("Output tokens (millions)")
    ax.set_xlabel("")
    ax.xaxis.set_major_locator(mdates.DayLocator(interval=2))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%d %b"))
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.set_title("Daily output token burn (pre = gray, post = black)")
    plt.tight_layout()
    plt.savefig(out, dpi=150, bbox_inches="tight")
    plt.close()


def chart_cohort_box(df: pd.DataFrame, launch: pd.Timestamp, out: Path):
    a = df[df.role == "assistant"].copy()
    a["cohort"] = np.where(a["ts"] < launch, "pre-skills", "post-skills")
    fig, ax = plt.subplots(figsize=(7, 4.2))
    sns.boxplot(
        data=a, x="cohort", y="output_tokens", hue="cohort",
        palette={"pre-skills": STEEL, "post-skills": BLACK},
        showfliers=False, ax=ax, legend=False,
    )
    ax.set_ylabel("Output tokens / assistant message")
    ax.set_xlabel("")
    ax.set_title("Reply length distribution — pre vs post skills")
    plt.tight_layout()
    plt.savefig(out, dpi=150, bbox_inches="tight")
    plt.close()


def chart_mode_box(df: pd.DataFrame, launch: pd.Timestamp, out: Path):
    post = df[(df.role == "assistant") & (df.ts >= launch)].copy()
    fig, ax = plt.subplots(figsize=(7, 4.2))
    order = [m for m in ["default", "jimat", "dry", "answer_only"] if m in post["active_mode"].unique()]
    sns.boxplot(
        data=post, x="active_mode", y="output_tokens", hue="active_mode",
        order=order,
        palette=[STEEL, BLUE, BLACK, GRAPHITE][:len(order)],
        showfliers=False, ax=ax, legend=False,
    )
    ax.set_ylabel("Output tokens / assistant message")
    ax.set_xlabel("Active mode")
    ax.set_title("Reply length by mode (post-skills period)")
    plt.tight_layout()
    plt.savefig(out, dpi=150, bbox_inches="tight")
    plt.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=Path("messages.parquet"))
    parser.add_argument("--skills-launch", type=str, default="2026-05-07",
                        help="Date skills were activated. Used to split pre/post cohorts.")
    parser.add_argument("--out-json", type=Path, default=Path("summary.json"))
    parser.add_argument("--charts-dir", type=Path, default=Path("charts"))
    args = parser.parse_args()

    df = pd.read_parquet(args.data)
    df = tag_active_mode(df)
    launch = pd.Timestamp(args.skills_launch, tz="UTC")

    cohort = cohort_summary(df, launch)
    mode = mode_summary(df, launch)

    print("Cohort summary (pre vs post skills):")
    print(cohort.to_string())
    print("\nMode summary (post-skills):")
    print(mode.to_string())

    args.charts_dir.mkdir(exist_ok=True)
    chart_daily(df, launch, args.charts_dir / "01-daily.png")
    chart_cohort_box(df, launch, args.charts_dir / "02-cohort.png")
    chart_mode_box(df, launch, args.charts_dir / "03-mode.png")

    summary = {
        "skills_launch": args.skills_launch,
        "cohort": cohort.to_dict(orient="index"),
        "mode": mode.to_dict(orient="index"),
    }
    args.out_json.write_text(json.dumps(summary, indent=2, default=str), encoding="utf-8")
    print(f"\nSummary → {args.out_json}")
    print(f"Charts  → {args.charts_dir}/")


if __name__ == "__main__":
    main()
