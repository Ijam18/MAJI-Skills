# Experimental Skills

Skills that exist but aren't yet validated by real-world use. They follow the same `maji-mode` discipline foundation but haven't earned promotion to the core set.

## Why Experimental?

Per the project's validation philosophy: **prove value before promoting**. The 5 core skills (`maji-mode`, `maji-commit`, `maji-explain`, `maji-debug`, `maji-review`) cover the highest-frequency dev workflows. The skills in this folder address less-frequent or more-speculative use cases.

A skill graduates from `experimental/` to core when:

- Real users report consistent value
- Daily/weekly use proven by repo owner
- 1+ external contribution (PR, issue, testimonial)
- 30+ days of validation

Until then, they live here.

## Skills in this Folder

| Skill | Use case | Why experimental |
|---|---|---|
| **[maji-test](./maji-test/SKILL.md)** | Behaviour-focused test generation | Test culture varies; many teams skip |
| **[maji-doc](./maji-doc/SKILL.md)** | Concise documentation generator | Most skip docs entirely |
| **[maji-refactor](./maji-refactor/SKILL.md)** | Scope-guarded refactoring | Occasional use only |
| **[maji-summary](./maji-summary/SKILL.md)** | Long content compression | Overlaps with default Claude behaviour |
| **[maji-todo](./maji-todo/SKILL.md)** | Codebase TODO triage | Sprint-level frequency only |

## Installation

Same as core skills:

```bash
cp -r experimental/<skill-name> ~/.claude/skills/
```

Use them. Report back. If they prove valuable, they get promoted.

## Feedback

If you actively use one of these and find it valuable, open an issue or PR — that's the signal we're waiting for.
