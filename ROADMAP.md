# ROADMAP

> Status: reviving from dormancy (last active May 2026). Solo maintainer. No funding, no team, no deadline pressure. This roadmap is deliberately small.

MAJI Skills launched claiming 75% / 87% token savings. Those numbers were estimates and they did not survive measurement. The honest figure — measured from 29,582 real messages — is **−18.2% mean / −28.3% on long replies (P90)**, with the typical (median) reply essentially unchanged. That correction is already landed in [BENCHMARKS.md](./BENCHMARKS.md) and the [README](./README.md).

This roadmap is about what comes after the correction. The bet: **the honesty is the product.** Most AI-tooling repos inflate. This one measured, was wrong, and said so in public with the pipeline attached. That is rarer than a token percentage and harder to fake.

---

## Where we actually stand (no spin)

| Signal | Reality |
|---|---|
| GitHub stars | 17 |
| Forks | 1 |
| External contributions | 0 |
| Benchmark sample | n = 1 user, 1 period |
| Maintainer footprint | 3,502 sessions · 145 projects · ~48.84B tokens (28 May – 3 Aug 2026) |
| Skills | 6 core, 5 experimental |
| Last commit before revival | May 2026 |

Two facts sit in tension and both are true: the skills are **heavily used by one person** (real, sustained, 2.5-month deployment) and **barely validated by anyone else** (n=1, single-digit forks). The whole roadmap is about closing that second gap without ever reopening the first mistake.

---

## Non-goal (the one that governs everything)

**No inflated claims. Ever again.**

This is not a soft preference — it is the project's reason to exist post-correction. Concretely:

- No headline number that isn't backed by a committed, runnable script and a stated sample size.
- No dropping the caveats to make a cleaner tagline. The caveats (`n=1`, no control group, uneven cohorts, uncompressible tool/code tokens) ship *with* the number, every time.
- No "up to X%" phrasing that quotes the best case as if it were typical. If median is flat, we say median is flat.
- If a future measurement makes the skills look *worse*, that gets published too — same channel, same prominence.
- Marketing copy inherits the benchmark's honesty, not the other way around. If a promo post can't survive someone actually running `analytics/`, it doesn't go out.

The moment this project trades honesty for reach, it loses the only thing that distinguishes it. Guard it like the core asset it is.

---

## Sharpening the value prop (away from token %)

The −18% number is real but it is **not the reason to install this.** It's a side effect. Leading with it invited the "that's not much" reaction and set up the original overclaim. The genuine value is behavioural, and it barely shows up in an output-token histogram:

| What actually helps | Skill mechanism | Why token % can't see it |
|---|---|---|
| **Scope-drift prevention** | Pre-Action Gate + decision modes — "proceed" in a discussion context ≠ start coding | Prevents work that never gets typed. The tokens *saved* are the 11 commits you didn't have to `git reset`. |
| **Frustration detection** | STOP-RECONSIDER — on "that's not right", pivot instead of iterating variant 2, 3, 4 | Saves round-trips and rage-quits, not reply length. |
| **Consistency / portability** | One discipline that travels across 145 projects, any language, any stack | *Durability of a working habit*, not a per-message metric. |

The honest reframe: **MAJI Skills is a portable working discipline for Claude Code that stops the three failure modes that actually cost you time — scope creep, doomed iteration loops, and destructive surprises.** The token trim is a measured, modest bonus, not the pitch. The benchmark stays — as *proof the maintainer measures honestly*, not as the hook.

**Open honesty question:** scope-drift and frustration-recovery are the real value but the current benchmark can't measure them. Either we find a proxy (e.g. rate of `git reset --hard` / revert commits per session, pre vs post) or we state plainly that these benefits are argued-and-anecdotal, not measured — and never dress anecdote up as data. Leaning toward the latter until a real proxy is validated.

---

## Path forward

### 1. External validation — make the number n > 1

Every figure currently rests on one person's logs. The highest-leverage move is turning `n=1` into aggregated, honest, multi-user data — and the pipeline already exists ([`analytics/`](./analytics)), privacy-safe by design: it reads only `~/.claude/projects/` locally, `summary.json` contains **aggregate statistics only (no message text)**, and `parse.py --anonymise-projects` strips project names.

- Add `CONTRIBUTING-BENCHMARKS.md` (docs only): install → use normally 2+ weeks → run `parse.py` + `analyze.py` → PR your `summary.json`.
- Accept `summary.json` files into a `community-benchmarks/` folder. Each keeps its own sample size and caveats. **No averaging away the disagreement** — if someone measures +5% (skills made them *more* verbose), that entry stays visible.
- Realistic bar: even **3–5 external `summary.json` files** moves this from "one guy's logs" to "a small honest dataset" — a claim almost no competing repo can make.

### 2. A "community benchmarks" aggregation (the honest-proof artifact)

Once contributions exist:

- A generated `COMMUNITY-BENCHMARKS.md` listing every contributed run as a row (anon id, sample size, window, mean/median/P90 delta, mode) plus a whole-dataset roll-up with `N contributors`, `total messages`, and the **spread** (min/max, not just mean).
- A small `analytics/aggregate.py` that reads `community-benchmarks/*.json` and emits the table + a distribution chart.
- The roll-up is allowed to be unflattering. That unflinching table *is* the marketing asset: **"the AI-skills repo that publishes its community's real numbers, including the bad ones."**

### 3. Skill polish (small, earned, no bloat)

Keep the frozen-until-validated discipline. Do not add skills to look busy.

- **Promote on evidence only.** The 5 experimental skills graduate to core on the stated bar: owner daily use + 1 external signal + 30 days. `maji-summary` is a candidate to *retire* — its README already admits it overlaps with default Claude behaviour. Honest pruning counts as progress.
- **Tighten the 5 core skills** to lead with the behaviour they enforce (scope guard / frustration halt / structure), not a token claim. Give each one an explicit "Output contract" + "Does NOT" line; dedupe the repeated boilerplate into a shared `CONVENTIONS.md`.
- **Fix the small overclaims.** `maji-todo` describes `--stale`/`--owner`/age flags it doesn't ship, and calls `git blame` output "first introduced" when it's last-touched — either ship the command or reword. Consistent with the non-goal.
- **Verify portability, don't just assert it.** If we claim patterns transfer beyond Claude Code, test it and document what survives — or downgrade to "the *patterns* are portable; the auto-routing is Claude Code-specific."

### 4. Promotion — honest angles, zero hype

The distribution problem is real (17 stars, dormant). But the recovery narrative is *more* shareable than the original overclaim:

- **The correction post.** "I launched claiming 75% token savings. I measured. It was 18%. Here's the pipeline, here's the data, here's what I got wrong." A public before/after on your own overclaim is a strong dev-audience story. Link BENCHMARKS.md, not a landing page.
- **The behaviour story, not the number.** Lead with the scope-drift / frustration examples. "Claude committed 11 times when I said 'let's discuss'" is more relatable than any percentage.
- **The call to replicate.** "Run this on your own logs and PR the result — I'll publish it even if it makes my skills look bad." That invitation *is* the credibility, and it doubles as the growth loop (Path 1).

---

## Not on the roadmap

- A website, a landing page, a paid tier, or a "Pro" version.
- New skills added for optics rather than proven need.
- Any number that can't be reproduced by a stranger running `analytics/` on their own machine.

Small, honest, reproducible. That's the whole plan.
