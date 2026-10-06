# Skill tiers

Every skill lives in `.agents/skills/<name>/`. Its tier is in the frontmatter (`metadata.tier`), not in the folder, so moving a skill between tiers never breaks an install.

| Tier | Meaning | Skills |
|---|---|---|
| `core` | Proven by daily use; the discipline and highest-frequency dev skills | `maji-mode`, `maji-jimat`, `maji-commit`, `maji-debug`, `maji-explain`, `maji-review` |
| `workflow` | Playbooks distilled from real, repeated work across many projects | 22 skills: see the index in [`AGENTS.md`](../AGENTS.md) |
| `experimental` | Useful, not yet validated by sustained use outside one owner | `maji-test`, `maji-doc`, `maji-refactor`, `maji-summary`, `maji-todo`, `maji-outreach`, `maji-setup`, `maji-learn` |
| `personal` | Your own skills, written by `maji-learn` into `.agents/skills/my-*`; gitignored | yours |

## Prove value before promoting
An experimental skill graduates to core when:
- the owner uses it daily or weekly,
- at least one external signal backs it (a PR, an issue, a testimonial),
- it has had 30+ days of real use.

Until then it stays experimental. We don't promote on speculation.

## Feedback
If you use an experimental skill and it helps, open an issue or a PR. That is the signal we are waiting for.
