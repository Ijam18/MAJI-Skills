# MAJI Skills

A growing collection of Claude skills that make AI collaboration tighter, faster, and less wasteful.

By [MAJI](https://maji.org) · *No Codes, Only Vibes.*

---

## Skills in this Repo

### `maji-mode` — Claude Collaboration Discipline

A discipline layer between you and Claude. Activates 4 patterns that make Claude listen properly the first time — saving tokens, reducing rework, and preventing scope drift.

The 4 patterns:

1. **Outcome before context** — you say what you want, Claude responds; rationale optional
2. **Mode-tagged prompts** — discuss / build / pause / pivot — Claude treats them differently
3. **Frustration recognition** — when you signal "wrong direction", Claude halts instead of doubling down
4. **Pre-action confirmation** — destructive or scope-expanding actions need explicit OK

[→ Read the full skill](./maji-mode/SKILL.md)

---

## Why use these skills?

| Benefit | What changes for you |
|---|---|
| **Less rework** | Claude stops extrapolating wrong scope |
| **Faster shipping** | Outcome-first prompts get answers in 1 turn instead of 3 |
| **Saves tokens** | Leaner exchanges = less context burned, lower API cost |
| **Frustration aware** | Claude halts and reconsiders when you signal "wrong direction" |
| **Decision modes** | Explicit discuss/build/pause/pivot — no ambiguity |
| **Pre-Action Gate** | Risky ops (deletions, force pushes, scope expansion) need confirmation |
| **Universal** | Works across any project, any domain |
| **Compounds** | Teaches you to prompt better — works even outside Claude |

---

## Real Before/After Examples

### Building a Feature

**Without maji-mode:**
> User: *"Hey, I'm thinking maybe we could add a search feature, what do you think?"*
> Claude: *"Great idea! Several considerations: search algorithms, indexing... should I explore the codebase first?"*
> [3 messages later, nothing shipped]

**With maji-mode:**
> User: *"Add search to dashboard. Discuss first."*
> Claude: *"Search scope: client-side filter or full-text? Recommend client-side first. Approve?"*
> User: *"Approve"* → Claude implements.

---

### The "Proceed" Trap

**Without maji-mode:**
> User: *"Let's proceed phase by phase, plan stories and epics"*
> Claude: *[scaffolds 10 stories, runs npm install, commits 11 times]*
> User: *"Wait, what are you doing?"* → has to delete everything.

**With maji-mode:**
> User: *"Let's proceed phase by phase, plan stories and epics"*
> Claude: *"Reading 'proceed' in discussion context — continuing to plan, not building yet."*
> No surprise commits.

---

### Aesthetic Mismatch

**Without maji-mode:**
> User: *"That doesn't look right"*
> Claude: *"Let me try a different color scheme..."* [makes 5 changes]
> User: *"Still wrong"*
> Claude: *"Let me try yet another approach..."* [user rage-quits]

**With maji-mode:**
> User: *"Not the right vibe"*
> Claude: *"STOP — pivoting completely instead of iterating. Show me 1-2 reference sites with the look you want, or describe in 5 words."*
> User: *"Linear style — minimal, dark, generous spacing"* → clean pivot.

---

### Destructive Action

**Without maji-mode:**
> User: *"Clean up old branches"*
> Claude: *[force-deletes branches, resets remote tracking, some unmerged work disappears]*

**With maji-mode:**
> User: *"Clean up old branches"*
> Claude: *"Pre-Action Gate: destructive op detected. Found 12 branches. Show list before delete?"*
> User reviews → surgical cleanup, no surprise loss.

---

## Token Economy Math

| Item | Without `maji-mode` | With `maji-mode` |
|---|---|---|
| Avg prompt+response | ~600 tokens | ~250 tokens |
| Savings per exchange | — | ~58% |
| 100-message session | — | ~35,000 tokens saved |
| Power user (5 sessions/day) | — | ~$15/day saved on Pro tier |

---

## Installation

### Option 1 — User-level (applies to all projects)

```bash
mkdir -p ~/.claude/skills
cp -r ./maji-mode ~/.claude/skills/
```

### Option 2 — Project-level (single project only)

```bash
mkdir -p ./.claude/skills
cp -r ./maji-mode ./.claude/skills/
```

### Option 3 — Always-on (loaded every session, every project)

Add the contents of `maji-mode/SKILL.md` to your `~/.claude/CLAUDE.md` file:

```bash
cat ./maji-mode/SKILL.md >> ~/.claude/CLAUDE.md
```

---

## Usage

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

## Who benefits most

| User type | Benefit fit |
|---|---|
| Solo founders + indie hackers | High |
| Vibe-coders (no formal CS) | Highest |
| Senior devs using AI as pair programmer | High |
| Designers using Claude for code | High |
| Teaching contexts | High |
| Casual / weekend tinkerers | Lower (overhead may exceed benefit) |

---

## Contributing

PRs welcome. Patterns to add should be:

- Universal (not specific to one project / language / domain)
- Token-positive (saves tokens, doesn't cost more)
- Easy to explain in 1-2 sentences
- Backed by a real failure mode the pattern prevents

---

## License

MIT — use freely, modify freely, attribute when you can.

---

## About MAJI

MAJI (Malaysia Artificial Joint Institute) is an Applied AI learning movement based in Malaysia. We believe AI is the joint between people, industries, and disciplines. Methodology: *No Codes, Only Vibes* — we don't teach coding, we teach building.

Learn more: [maji.org](https://maji.org)
