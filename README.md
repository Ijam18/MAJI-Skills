<div align="center">

# 🛠 MAJI Skills

### **Stop repeating yourself to Claude.**

Four patterns that make Claude listen the first time. Save **~75% tokens**. Ship without rework. Free.

[![License: MIT](https://img.shields.io/badge/License-MIT-A88838.svg)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-8B1A1A.svg)](https://docs.claude.com/en/docs/claude-code)
[![Methodology](https://img.shields.io/badge/Methodology-No%20Codes%2C%20Only%20Vibes-0A0A0A.svg)](https://maji.org)

[**⬇️ Install in 30 seconds**](#-installation) · [**⭐ Star this repo**](https://github.com/Ijam18/MAJI-Skills) · [**🔗 Share on LinkedIn**](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2FIjam18%2FMAJI-Skills)

</div>

---

## 🎯 Why You Should Use MAJI Skills

Every Claude Code session, you're fighting the same battles:

- 😩 Claude **extrapolates beyond what you asked** — fixes the typo AND refactors three files you didn't want touched
- 💸 Token bills creep up because Claude responds with **paragraphs of preamble** before the actual answer
- 🔁 You have to **re-explain your working style every session** — Claude forgets you want bullets, not essays
- 🚨 Claude treats "let's discuss this" as "let's build it now" — and you delete 11 commits to recover
- 😤 When you say *"that's not right"*, Claude tries variant 2, variant 3 — instead of stopping to ask what you actually want

**MAJI Skills fix all of this** with a discipline layer that activates on every prompt.

> *"This is the closest thing to having a senior dev who actually reads your message before responding."*

### What you get in 30 seconds:

✅ Claude recognises **outcome-first prompts** and skips the padding
✅ **Decision modes** — discuss / build / pause / pivot — eliminate ambiguity
✅ **Frustration signals halt Claude** instead of doubling down
✅ **Pre-Action Gate** prevents destructive surprises (force pushes, scope creep)
✅ **~75% token savings** per exchange — banned padding phrases, compression modes, table-first output
✅ Works on **any project, any language, any stack**
✅ Free, MIT licensed, no signup, no telemetry

[**→ Install now**](#-installation) · [**→ See real before/after examples**](#-real-beforeafter-examples)

---

## 📖 Background

A growing collection of Claude skills that make AI collaboration **tighter, faster, and less wasteful**.

These skills are derived from the actual working patterns of **[Zarul Izham (Ijam)](https://www.linkedin.com/in/zarulijam/)** — Founder of MAJI — built and refined over thousands of Claude Code sessions. The patterns aren't theoretical: each one solves a real failure mode encountered when shipping daily with AI.

By [MAJI](https://maji.org) · *No Codes, Only Vibes.*

---

## ✨ Skills in this Repo

### `maji-mode` — Claude Collaboration Discipline

A discipline layer between you and Claude. Activates 4 patterns that make Claude listen properly the first time — saving tokens, reducing rework, and preventing scope drift.

[→ Read the full skill](./maji-mode/SKILL.md)

---

### `maji-commit` — Auto-generate Commit Messages

Reads your git diff and writes a clean commit message in conventional commits format. No manual typing, no overthinking the wording.

```
You stage changes → type "maji-commit" → Claude outputs:
feat(auth): add Google OAuth flow
```

Composes with `maji-mode` for terse, no-preamble output.

[→ Read the full skill](./maji-commit/SKILL.md)

---

### `maji-review` — Disciplined Code Review

Reviews a PR, diff, or file and outputs structured feedback grouped by severity. No "Great work overall!" preamble. No trailing "let me know if you'd like to discuss". Just findings.

```
3 findings: 🔴 2 critical, 🟡 1 important.

🔴 Critical (2)
──────────────
src/auth.ts:3 — SQL injection via string interpolation
src/auth.ts:4 — Plaintext password comparison

🟡 Important (1)
──────────────
src/auth.ts:5 — Static token, not user-bound

Verdict: Block merge. Fix critical findings first.
```

Composes with `maji-mode` for evidence-first output.

[→ Read the full skill](./maji-review/SKILL.md)

---

## 🧠 How `maji-mode` Works

```mermaid
flowchart TD
    A[User Prompt] --> B{maji-mode<br/>active?}
    B -->|No| Z[Standard Claude<br/>response]
    B -->|Yes| C[Read prompt fully]
    C --> D{Identify<br/>Decision Mode}

    D -->|Discuss| E[Plan + ask<br/>clarifying questions]
    D -->|Build| F[Pre-Action Gate]
    D -->|Pause| G[Stop. Wait.]
    D -->|Pivot| H[Strip + redirect.<br/>NO iteration.]

    F --> I{All 4 gate<br/>checks pass?}
    I -->|No| J[ASK before acting]
    I -->|Yes| K[Execute]

    E --> L[Output]
    K --> L
    G --> L
    H --> L
    J --> L

    L --> M{Frustration<br/>signal detected?}
    M -->|Yes| N[STOP. Reconsider.<br/>Don't iterate.]
    M -->|No| O[End with action verb.<br/>Offer next step.]
    N --> C

    style A fill:#F5F1EA,stroke:#0A0A0A,color:#0A0A0A
    style B fill:#A88838,stroke:#0A0A0A,color:#FFFFFF
    style D fill:#A88838,stroke:#0A0A0A,color:#FFFFFF
    style F fill:#8B1A1A,stroke:#0A0A0A,color:#FFFFFF
    style I fill:#8B1A1A,stroke:#0A0A0A,color:#FFFFFF
    style M fill:#8B1A1A,stroke:#0A0A0A,color:#FFFFFF
    style N fill:#8B1A1A,stroke:#0A0A0A,color:#FFFFFF
    style J fill:#A88838,stroke:#0A0A0A,color:#FFFFFF
```

The 4 patterns:

1. **Outcome before context** — say what you want, Claude responds; rationale optional
2. **Mode-tagged prompts** — discuss / build / pause / pivot — Claude treats them differently
3. **Frustration recognition** — when you signal "wrong direction", Claude halts instead of doubling down
4. **Pre-action confirmation** — destructive or scope-expanding actions need explicit OK

---

## 📊 Decision Modes Visualised

```mermaid
flowchart LR
    P[User Prompt] --> M{Decision Mode}
    M -->|"discuss first<br/>propose plan<br/>what do you think"| D[💬 DISCUSS<br/>Plan + clarify]
    M -->|"proceed<br/>ship<br/>approve"| B[⚙️ BUILD<br/>Execute]
    M -->|"hold on<br/>wait<br/>pause"| P2[⏸️ PAUSE<br/>Stop & wait]
    M -->|"drop X<br/>start over<br/>change direction"| PV[🔄 PIVOT<br/>Strip + redirect]

    style P fill:#F5F1EA,stroke:#0A0A0A
    style M fill:#0A0A0A,stroke:#0A0A0A,color:#FFFFFF
    style D fill:#A88838,stroke:#0A0A0A,color:#FFFFFF
    style B fill:#8B1A1A,stroke:#0A0A0A,color:#FFFFFF
    style P2 fill:#3A3A3A,stroke:#0A0A0A,color:#FFFFFF
    style PV fill:#A88838,stroke:#0A0A0A,color:#FFFFFF
```

---

## 🚀 Why use these skills?

| Benefit | What changes for you |
|---|---|
| ⚡ **Less rework** | Claude stops extrapolating wrong scope |
| 🚄 **Faster shipping** | Outcome-first prompts get answers in 1 turn instead of 3 |
| 💰 **Saves tokens** | Leaner exchanges = less context burned, lower API cost |
| 🛑 **Frustration aware** | Claude halts and reconsiders when you signal "wrong direction" |
| 🎯 **Decision modes** | Explicit discuss/build/pause/pivot — no ambiguity |
| 🚧 **Pre-Action Gate** | Risky ops need confirmation before execution |
| 🌐 **Universal** | Works across any project, any domain |
| 📈 **Compounds** | Teaches you to prompt better — works even outside Claude |

---

## 🎥 See It In Action

> *Demo recording coming soon — a 60-second screen capture showing `maji-mode` + `maji-commit` + `maji-review` in a real Claude Code session, side-by-side comparison with baseline Claude.*

For now, see the before/after examples below.

---

## 🎬 Real Before/After Examples

<details>
<summary><strong>📌 Example 1 — Building a Feature</strong></summary>

```mermaid
sequenceDiagram
    actor U as User
    participant C as Claude
    rect rgb(245, 220, 220)
    Note over U,C: WITHOUT maji-mode
    U->>C: "Hey, I'm thinking maybe we could add a<br/>search feature, what do you think?"
    C->>U: "Great idea! Several considerations:<br/>algorithms, indexing... should I explore first?"
    U->>C: "Sure, I guess..."
    C->>U: "I found these options... which sounds best?"
    Note over U,C: 3 messages, nothing shipped
    end

    rect rgb(220, 245, 220)
    Note over U,C: WITH maji-mode
    U->>C: "Add search to dashboard. Discuss first."
    C->>U: "Client-side filter or full-text DB?<br/>Recommend client-side. Approve?"
    U->>C: "Approve"
    C->>U: ✅ Implementation done
    end
```

**Saved:** ~1500 tokens, 3 round-trips, mental overhead.

</details>

<details>
<summary><strong>📌 Example 2 — The "Proceed" Trap</strong></summary>

**Without maji-mode**
> User: *"Let's proceed phase by phase, plan stories and epics"*
> Claude: *[scaffolds 10 stories, runs npm install, commits 11 times]*
> User: *"Wait, what are you doing?"* → has to delete everything.

**With maji-mode**
> User: *"Let's proceed phase by phase, plan stories and epics"*
> Claude: *"Reading 'proceed' in discussion context — continuing to plan, not building yet."*
> No surprise commits.

**Saved:** ~3 hours and a deleted repo.

</details>

<details>
<summary><strong>📌 Example 3 — Aesthetic Mismatch</strong></summary>

**Without maji-mode**
> User: *"That doesn't look right"*
> Claude: *"Let me try a different color scheme..."* [makes 5 changes]
> User: *"Still wrong"*
> Claude: *"Let me try yet another approach..."* [user rage-quits]

**With maji-mode**
> User: *"Not the right vibe"*
> Claude: *"STOP — pivoting completely instead of iterating. Show me 1-2 reference sites with the look you want, or describe in 5 words."*
> User: *"Linear style — minimal, dark, generous spacing"* → clean pivot.

**Saved:** Massive frustration + 5+ wasted attempts.

</details>

<details>
<summary><strong>📌 Example 4 — Destructive Action</strong></summary>

**Without maji-mode**
> User: *"Clean up old branches"*
> Claude: *[force-deletes branches, resets remote tracking, some unmerged work disappears]*

**With maji-mode**
> User: *"Clean up old branches"*
> Claude: *"Pre-Action Gate: destructive op detected. Found 12 branches. Show list before delete?"*
> User reviews → surgical cleanup, no surprise loss.

**Saved:** Lost work prevention. Trust preserved.

</details>

<details>
<summary><strong>📌 Example 5 — Token Burn</strong></summary>

**Without maji-mode** (~200 tokens of padding alone)
> "Great question! That's a really thoughtful approach. Let me think through this carefully and consider the various angles. I appreciate you bringing this up. Here's what I'm thinking..."

**With maji-mode**
> "3 options. Recommend (b). Reason: ships fastest. [table]"

**Saved:** Across 50 messages = ~10,000 tokens = real $.

</details>

---

## 💸 Token Economy Math

```mermaid
xychart-beta
    title "Token Cost Per Session"
    x-axis ["Without maji-mode", "With maji-mode", "+ /jimat mode"]
    y-axis "Tokens per exchange" 0 --> 700
    bar [600, 150, 80]
```

| Item | Without `maji-mode` | With `maji-mode` | + `/jimat` mode |
|---|---|---|---|
| Avg prompt+response | ~600 tokens | ~150 tokens | ~80 tokens |
| Savings per exchange | — | **~75%** | **~87%** |
| 100-message session | — | ~45,000 tokens saved | ~52,000 tokens saved |
| Power user (5 sessions/day) | — | **~$20/day** saved on Pro tier | **~$23/day** saved |

### Where the savings come from:

| Source | Reduction |
|---|---|
| Banned padding phrases (e.g., "Great question!", "I hope this helps!") | ~10-15% |
| Tables over bullet lists | ~5-8% |
| No restating user's context | ~10% |
| Single example default (not three) | ~15-20% |
| Code comment discipline (WHY not WHAT) | ~10% (when code involved) |
| Compression modes (`/dry`, `/jimat`, `/answer-only`) | ~30-40% additional |

---

## 📦 Installation

<details>
<summary><strong>Option 1 — User-level (recommended, applies to all projects)</strong></summary>

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/Ijam18/MAJI-Skills.git
cp -r MAJI-Skills/maji-mode ~/.claude/skills/
```

</details>

<details>
<summary><strong>Option 2 — Project-level (single project only)</strong></summary>

```bash
mkdir -p ./.claude/skills
git clone https://github.com/Ijam18/MAJI-Skills.git
cp -r MAJI-Skills/maji-mode ./.claude/skills/
```

</details>

<details>
<summary><strong>Option 3 — Always-on (loaded every session, every project)</strong></summary>

Append the contents of `maji-mode/SKILL.md` to your `~/.claude/CLAUDE.md` file:

```bash
git clone https://github.com/Ijam18/MAJI-Skills.git
cat MAJI-Skills/maji-mode/SKILL.md >> ~/.claude/CLAUDE.md
```

</details>

---

## ▶️ Usage

After installation, invoke at the start of any Claude Code session:

```
/maji-mode
```

Or it auto-activates via Claude's skill discovery if installed at user-level.

To verify it's active, your prompts should feel:
- More direct (less preamble)
- Better at scope (Claude asks before extrapolating)
- Token-aware (shorter responses by default)

---

## 👥 Who benefits most

| User type | Benefit fit |
|---|---|
| 🚀 Solo founders + indie hackers | High |
| 🌊 Vibe-coders (no formal CS) | **Highest** |
| 👨‍💻 Senior devs using AI as pair programmer | High |
| 🎨 Designers using Claude for code | High |
| 🎓 Teaching contexts | High |
| 🛠 Casual / weekend tinkerers | Lower (overhead may exceed benefit) |

---

## ❓ FAQ

<details>
<summary><strong>How do I verify maji-mode is actually active?</strong></summary>

After install, type `verify maji-mode` in your Claude Code session. You should get a one-line confirmation showing 4 active patterns + current compression mode. If Claude responds with generic text instead, the skill isn't loaded — re-check install path.

</details>

<details>
<summary><strong>Does this slow Claude down?</strong></summary>

No. The patterns reduce response length, which means Claude streams faster. You'll feel it especially on `/dry` and `/jimat` modes.

</details>

<details>
<summary><strong>Will this work with Cursor / Continue / other AI tools?</strong></summary>

The skill format is Claude Code-specific, but **the patterns are universal**. Copy `maji-mode/SKILL.md` content into Cursor's `.cursor/rules` or Continue's system prompt and most patterns transfer. Decision modes, frustration signals, and banned phrases work with any LLM.

</details>

<details>
<summary><strong>Can I customize the patterns? I want some but not others.</strong></summary>

Yes — `maji-mode/SKILL.md` is just text. Fork the repo, edit the file, install your version. Common customizations:

- Remove banned phrases you don't mind (some users like "Great question!")
- Adjust compression default (some prefer slightly more verbose by default)
- Add your own magic phrases vocabulary
- Translate to your language

</details>

<details>
<summary><strong>Does this work on Claude Pro / Max / API?</strong></summary>

Works on any tier that supports Claude Code skills. Token savings matter most on metered API or hitting Pro tier limits — that's where the 75% reduction translates to real $$$.

</details>

<details>
<summary><strong>How do I uninstall?</strong></summary>

Delete the skill folder:

```bash
rm -rf ~/.claude/skills/maji-mode
```

Or for project-level: `rm -rf ./.claude/skills/maji-mode`. If you appended SKILL.md to your `~/.claude/CLAUDE.md`, edit that file to remove the section.

</details>

<details>
<summary><strong>Does this send any data anywhere? Telemetry?</strong></summary>

No. The skill is a static markdown file Claude reads locally. Zero telemetry, zero phone-home, zero tracking. MIT licensed — read the file, you'll see.

</details>

<details>
<summary><strong>What if I miss the friendly tone?</strong></summary>

The patterns reduce padding but Claude still gives quality answers. If you want some warmth back, invoke compression less aggressively — skip `/jimat` mode and stick with default. Or fork and adjust the banned phrases list to allow some pleasantries.

</details>

<details>
<summary><strong>Will this conflict with my other skills?</strong></summary>

Generally no — `maji-mode` defines response posture, not domain logic. It composes well with other skills (e.g., a code-review skill, a documentation skill). If you hit conflicts, file an issue with details.

</details>

<details>
<summary><strong>I tried it and it feels too tight. What now?</strong></summary>

Two options: (1) skip compression modes (`/dry`, `/jimat`) — default `maji-mode` is already terse but still readable. (2) Fork and remove the strict token discipline section — keep just the 4 patterns (outcome-first, decision modes, frustration signals, Pre-Action Gate) without banned phrases.

</details>

---

## 💬 Questions or Feedback?

Have questions about how to use these skills, or feedback after trying them?

→ **LinkedIn:** [Zarul Izham (Ijam)](https://www.linkedin.com/in/zarulijam/)
→ **Threads:** [@_zarulijam](https://www.threads.com/@_zarulijam)

DMs open. Tag the repo when sharing your experience — happy to feature builders using `maji-mode` in the wild.

---

## 🤝 Contributing

PRs welcome. Patterns to add should be:

- ✅ Universal (not specific to one project / language / domain)
- ✅ Token-positive (saves tokens, doesn't cost more)
- ✅ Easy to explain in 1-2 sentences
- ✅ Backed by a real failure mode the pattern prevents

---

## 📜 License

MIT — use freely, modify freely, attribute when you can. See [LICENSE](./LICENSE).

---

## 🌱 About MAJI

MAJI (Malaysia Artificial Joint Institute) is an Applied AI learning movement based in Malaysia. We believe AI is the joint between people, industries, and disciplines.

**Methodology:** *No Codes, Only Vibes* — we don't teach coding, we teach building.

Learn more: [maji.org](https://maji.org)

---

<div align="center">

## Ready to ship faster?

**Install MAJI Skills in 30 seconds. Free. No signup. MIT licensed.**

[**⬇️ Install Now**](#-installation) · [**⭐ Star the Repo**](https://github.com/Ijam18/MAJI-Skills) · [**🔗 Share with a Friend**](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2FIjam18%2FMAJI-Skills)

*Built by builders, for builders. — MAJI*

</div>
