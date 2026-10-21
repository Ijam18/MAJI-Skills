---
name: bad-skil
description: Known-bad fixture for lint-skills --self-test. Note: this unquoted colon breaks YAML. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires. Pads the description past the soft limit so the length warning fires.
tools: Read, Grep
---

# bad-skill: known-bad fixture

This file exists only so `node scripts/lint-skills.mjs --self-test` can prove each check still fires. It has no tier, no Step 0 section, a wrong name, a `tools:` key, an unquoted colon in the description, a description over 800 chars, a subagent with `allowed-tools:`, a broken evals.json and a Composes-with target that does not exist. Do not fix it.

## Composes with

- **maji-review**: exists, should not be reported as missing.
- **maji-does-not-exist**: should be reported as missing.
