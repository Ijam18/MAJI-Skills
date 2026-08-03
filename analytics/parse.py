"""
Parse Claude Code session JSONL logs into a single tidy table.

Usage:
    python parse.py [--start YYYY-MM-DD] [--end YYYY-MM-DD] [--out PATH]

Reads from ~/.claude/projects/*/*.jsonl by default.
Output: messages.parquet (one row per user/assistant message).
"""
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

DEFAULT_PROJECTS_DIR = Path.home() / ".claude" / "projects"

MODE_PATTERNS = {
    "jimat_on": re.compile(r"\bjimat\s+(on|penuh|ringan|ultra)\b", re.I),
    "jimat_off": re.compile(r"\bjimat\s+off\b", re.I),
    "dry_on": re.compile(r"\bdry\s+on\b", re.I),
    "dry_off": re.compile(r"\bdry\s+off\b", re.I),
    "answer_only_on": re.compile(r"\banswer-only\s+on\b", re.I),
    "answer_only_off": re.compile(r"\banswer-only\s+off\b", re.I),
}
SKILL_PATTERN = re.compile(
    r"\bmaji-(mode|commit|explain|debug|review|doc|test|refactor|summary|todo)\b",
    re.I,
)


def extract_text(msg) -> str:
    """Flatten a Claude message content into a single string for signal detection."""
    if isinstance(msg, str):
        return msg
    if isinstance(msg, dict):
        content = msg.get("content")
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            parts = []
            for c in content:
                if isinstance(c, dict):
                    if c.get("type") == "text":
                        parts.append(c.get("text", ""))
                    elif c.get("type") == "tool_use":
                        parts.append(f"[tool:{c.get('name', '')}]")
                elif isinstance(c, str):
                    parts.append(c)
            return "\n".join(parts)
    return ""


def parse_file(path: Path, project_label: str, start: datetime, end: datetime):
    rows = []
    try:
        with path.open("r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    d = json.loads(line)
                except json.JSONDecodeError:
                    continue

                if d.get("type") not in ("user", "assistant"):
                    continue

                ts = d.get("timestamp")
                if not ts:
                    continue
                try:
                    dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                except ValueError:
                    continue
                if not (start <= dt <= end):
                    continue

                msg = d.get("message") or {}
                text = extract_text(msg)
                role = d["type"]

                row = {
                    "ts": dt,
                    "date": dt.date().isoformat(),
                    "project": project_label,
                    "session": d.get("sessionId", ""),
                    "role": role,
                    "text_len": len(text),
                }

                if role == "assistant":
                    usage = msg.get("usage") or {}
                    row["model"] = msg.get("model", "")
                    row["input_tokens"] = usage.get("input_tokens", 0)
                    row["output_tokens"] = usage.get("output_tokens", 0)
                    row["cache_read"] = usage.get("cache_read_input_tokens", 0)
                    row["cache_creation"] = usage.get("cache_creation_input_tokens", 0)
                    row["mode_signals"] = ""
                    row["skill_invoked"] = ""
                else:
                    row["model"] = ""
                    row["input_tokens"] = 0
                    row["output_tokens"] = 0
                    row["cache_read"] = 0
                    row["cache_creation"] = 0
                    text_l = text.lower()
                    flags = [name for name, pat in MODE_PATTERNS.items() if pat.search(text_l)]
                    row["mode_signals"] = ",".join(flags)
                    skills = SKILL_PATTERN.findall(text_l)
                    row["skill_invoked"] = ",".join(skills) if skills else ""

                rows.append(row)
    except OSError as e:
        print(f"  ERROR reading {path.name}: {e}")
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--projects-dir", type=Path, default=DEFAULT_PROJECTS_DIR,
                        help="Root directory of Claude Code project session files.")
    parser.add_argument("--start", type=str, default="2026-01-01",
                        help="Inclusive start date (UTC).")
    parser.add_argument("--end", type=str, default=None,
                        help="Inclusive end date (UTC). Defaults to today.")
    parser.add_argument("--out", type=Path, default=Path("messages.parquet"),
                        help="Output Parquet path.")
    parser.add_argument("--anonymise-projects", action="store_true",
                        help="Replace project names with anon hashes (project_001 …).")
    args = parser.parse_args()

    start = datetime.fromisoformat(args.start).replace(tzinfo=timezone.utc)
    end_str = args.end or datetime.now(tz=timezone.utc).date().isoformat()
    end = datetime.fromisoformat(end_str).replace(tzinfo=timezone.utc)

    all_rows = []
    n_files = 0
    project_aliases: dict[str, str] = {}
    for project_dir in sorted(args.projects_dir.iterdir()):
        if not project_dir.is_dir():
            continue
        raw = project_dir.name
        if args.anonymise_projects:
            label = project_aliases.setdefault(raw, f"project_{len(project_aliases) + 1:03d}")
        else:
            label = raw
        for jsonl in project_dir.glob("*.jsonl"):
            n_files += 1
            all_rows.extend(parse_file(jsonl, label, start, end))

    df = pd.DataFrame(all_rows)
    if df.empty:
        print("No messages in window. Check --start / --end.")
        return

    df["total_input"] = df["input_tokens"] + df["cache_read"] + df["cache_creation"]
    df["total_tokens"] = df["total_input"] + df["output_tokens"]

    df.to_parquet(args.out, index=False)
    print(f"Parsed {n_files} files → {len(df):,} messages → {args.out}")

    print("\nRoles:")
    print(df.groupby("role").agg(n=("ts", "count"), out_tokens=("output_tokens", "sum")).to_string())


if __name__ == "__main__":
    main()
