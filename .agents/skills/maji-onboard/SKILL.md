---
name: maji-onboard
description: "Onboard a new human collaborator to a project: a context pack (what it is, who decides, stack, conventions, where things live), a least-privilege access checklist, a first-week task list with one small shippable win, a glossary, the house style, and how to hand work back for review. Keeps the owner's private and personal notes out. Use when someone says \"onboard a new dev\", \"write an onboarding doc\", \"get the new designer up to speed\", \"what does a new joiner need access to\", \"first week plan for the intern\", \"how should they hand work back\". Not for passing your own session state to the next session or agent (use maji-session-handoff)."
metadata:
  tier: workflow
  category: team
  version: "1.0.0-lite"
---

# maji-onboard: Collaborator Onboarding

Get a new person productive without drowning them or over-sharing. Final output: one onboarding pack (context, access, first week, glossary, house style, hand-back rules) built from the repo as it really is, plus a revoke list for when they leave.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Stack, Folders, Voice and language). If `me/overrides/maji-onboard.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use when a developer, designer, writer, intern or contractor joins a project, or when a returning collaborator needs a refresh.
- Use when the same questions keep coming from new people: the pack becomes the answer.
- Not for agent-to-agent continuity (maji-session-handoff). Not for client support (maji-client-helpdesk).

## Steps

1. **Scope the person.** Role, start date, hours, trust level (employee, contractor, volunteer), what they will touch and what they must never touch.
2. **Build the context pack from the repo, not memory.** Read the README, package files, env example, folder tree, recent commits and open tasks.
3. **Filter private material.** Exclude the owner's personal notes, memory files, diaries, health, family, money, rate cards, other clients and internal lore.
4. **Access checklist, least privilege.** A table: system, access level, who grants, granted (yes/no), expiry.
5. **First-week plan.** Day 1: run the app locally and read the pack.
6. **Glossary.** Every internal term, codename and abbreviation they will meet, one line each, in plain words.
7. **House style.** Voice and language for user-facing text, brand tokens and where they live, naming rules, what "good" looks like with one example each.
8. **How to hand work back.** Branch and pull request per task, short description (what changed, how it was tested, screenshots for UI, what is uncertain).
9. **Deliver and walk through.** Put the pack where they will look (repo `docs/onboarding.md` or the team wiki), share it before day 1, and do a 20-minute walkthrough.
10. **Offboard list.** Same access table with a revoke column.

## Composes with

- **maji-session-handoff**: the agent-side counterpart for continuity between sessions.
- **maji-dev-up**: the tested local run steps in the pack.
- **maji-repo-hygiene**: clean README, env example and folder tree before writing the pack.
- **maji-brand-kit**: the brand tokens the house style points to.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-onboard` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
