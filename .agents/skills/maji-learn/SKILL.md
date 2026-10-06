---
name: maji-learn
description: Turn the user's repeated work into their own skills. Spot a pattern (the same kind of task done two or three times, or the user says to keep it), draft a SKILL.md from what actually happened, lint it, and save it to .agents/skills/my-<name>/ where every agent finds it. Adapt mode writes me/overrides/<skill>.md when an existing maji skill fits but the user does it differently. Use when the user says "save this as a skill", "make this repeatable", "I keep doing this", "remember how we did this", "do it my way next time", or in Malay "jadikan ni skill", "aku asyik buat benda ni", "simpan cara ni".
metadata:
  tier: experimental
  category: meta
  version: "1.0.0"
---

# maji-learn: grow your own skills

Your agent learns by writing files, not by hoping it remembers. Repeated work becomes a private skill in `.agents/skills/my-<name>/`; a different way of doing an existing skill becomes an override in `me/overrides/<skill>.md`. Both are gitignored, so `git pull` never touches them.

## Step 0: your context

Read `me/profile.md` if it exists (Voice and language, Stack, Folders, Tools and credits) and `me/learned.md`, so you do not create a skill that already exists. If the profile is missing, suggest `maji-setup` first.

## When to use / when not
- **Use:** the same kind of task has now happened two or three times; the user corrected the same step twice; the user asks to keep a way of working.
- **Not:** a one-off task, or a single preference (just apply it). Not for editing `maji-*` files: personalize with an override instead.

## Steps
1. **Name the pattern and show the evidence.** One line: what repeats, how often, and examples (dates, files, commands). Ask: "Save this as a skill?" Do nothing without a yes.
2. **New skill or override?** If an existing `maji-*` skill already covers most of it, write an override (step 6). Otherwise write a new skill.
3. **Extract from what really happened**, not from memory of how it should go: the inputs, the steps in order with the exact commands, tools and files, the checks that proved it worked, and every place it went wrong and how that was fixed. Those become the pitfalls.
4. **Write `.agents/skills/my-<name>/SKILL.md`** (kebab-case name):
   - Frontmatter: `name: my-<name>`; a `description` with what it does plus the user's own trigger phrases; `metadata` with `tier: personal`, `category`, `version: "1.0.0"`.
   - Sections: Step 0 (which profile sections it reads), When to use / when not, Steps, Pitfalls, Done when.
   - Under about 120 lines. If it grows past that, split it into two skills.
5. **Lint it.** Run `node scripts/lint-skills.mjs` from the kit folder (the path may be `.maji-skills/scripts/` in an existing agent folder). Fix every error.
6. **Adapt mode: write `me/overrides/<skill>.md`.** Keep it short and specific: "Step 3: use pnpm, not npm", "Skip the review page; export straight to the outbox". Only list what differs.
7. **Check it is live and private.** The agent can see the new skill (list skills, or ask it to use `my-<name>`), and `git status` shows nothing new.
8. **Log it.** Append to `me/learned.md`: `YYYY-MM-DD: my-<name> (new skill) from <evidence>` or `YYYY-MM-DD: override for <skill>: <what changed>`.
9. **Optional, share upstream.** If the skill would help anyone, offer to make a cleaned copy (no names, paths, clients or secrets) as a draft pull request to the kit. The user submits it; never open one on their behalf.

## Pitfalls
- **Skills from one-off work.** Wait for the second or third repeat, or an explicit "keep this".
- **Vague descriptions never trigger.** Put the user's actual phrases in the description.
- **Private details leaking.** Paths, client names and secrets stay out of anything meant to be shared. A `my-*` skill may hold paths; a shared copy may not.
- **Editing `maji-*` files to personalize.** The next `git pull` conflicts. Use an override.
- **Duplicates.** Check `me/learned.md` and the skill index before creating a new one; update the existing skill and bump its version instead.

## Done when
- [ ] The user agreed to save it.
- [ ] `.agents/skills/my-<name>/SKILL.md` or `me/overrides/<skill>.md` exists and lint passes.
- [ ] `git status` is clean and the agent can see the skill.
- [ ] `me/learned.md` has a dated entry.

## Composes with
- `maji-setup`: creates the profile and `me/learned.md` this skill builds on.
- `maji-session-handoff`: saved state is good evidence of what repeats.
- `maji-propose`: when a learned workflow is big, plan the first run with it.
