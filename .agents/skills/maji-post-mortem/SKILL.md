---
name: maji-post-mortem
description: "Write a blameless post-mortem after something went wrong (failed deploy, broken tests, data loss, leaked secret, a dead-end approach that cost hours): timeline, impact, root cause, what helped, what hurt, and concrete action items with owners. Appends to a project log and reminds you of past lessons when work touches the same area again. Use when the user says \"post-mortem\", \"what went wrong\", \"log this failure\", or after an incident or a wasted afternoon."
metadata:
  tier: core
  category: dev
  version: "1.0.0"
---

# maji-post-mortem: Blameless Post-Mortems That Change Something

A skill that turns a failure into a short written record and a few concrete fixes, so the same mistake costs nothing the second time.

---

## Step 0: your context

Read `me/profile.md` if it exists (Folders). If `me/overrides/maji-post-mortem.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to Use

- **Asked directly:** "post-mortem", "postmortem", "what went wrong", "log this failure".
- **After a signal in the session**, offer once ("That didn't go as planned. Worth a post-mortem?"):

| Signal | Sounds like |
|---|---|
| Failed deploy or rollback | "it crashed", "rolled back", "pod keeps restarting" |
| Regression | "was passing before", "something broke" |
| Approach reversed | "revert this", "this approach doesn't work" |
| Time lost | "wasted hours", "dead end" |
| Security slip | "committed a secret", "exposed key" |
| Data loss | "data is gone", "migration failed", "backup didn't restore" |

If the user says no, drop it. Never write a post-mortem nobody asked for.

---

## Where it lives

Append to `docs/post-mortems.md` (or the project's existing incident folder). Newest at the bottom. Create the file with a one-line header if missing.

---

## Format

```markdown
## YYYY-MM-DD: Short title (severity: low | medium | high)

**Summary:** two sentences: what broke and for how long.
**Impact:** who or what was affected, with numbers (users, minutes, rows, money).

**Timeline**
- HH:MM: first sign
- HH:MM: detected by ...
- HH:MM: mitigated by ...
- HH:MM: resolved

**Root cause:** the underlying condition, not the person. Ask "why" until you reach something you can change.
**Trigger:** the event that exposed it.

**What helped:** what shortened the incident.
**What hurt:** what made it longer or worse.

**Action items**
- [ ] <specific change>: owner, due date
- [ ] <specific change>: owner, due date

**Lesson (one line):** the sentence future-you should read before touching this area.
```

---

## Steps

1. **Collect facts first.** Pull the timeline from what the session already shows: commands, error output, commit hashes, deploy logs. Ask only for what is missing (start time, impact numbers).
2. **Find the root cause.** Ask "why?" from the trigger until the answer is a condition in the system or process (missing test, no staging check, no backup verification), not a person.
3. **Write action items that would have prevented or shortened it.** Each one is specific, testable and has an owner. "Be more careful" is not an action item; "add a migration dry-run step to the deploy script" is.
4. **Rate severity** by impact, not by how stressful it felt.
5. **Append** the entry and confirm in one line with the lesson.
6. **Remind later:** when a new task touches the same area (same service, file, migration or deploy step), check the log and surface the lesson in one line before starting.

---

## Rules

- **Blameless:** describe actions and conditions, never fault. "The deploy ran without a migration check", not "X forgot".
- **Numbers over adjectives:** minutes, users, rows, cost.
- **Max five action items:** fewer, owned and dated beats a long wishlist.
- **Short:** one screen. A post-mortem nobody finishes reading changes nothing.
- **Append-only:** later findings are added under the entry as an "Update (date)" line, not rewritten.

---

## Pitfalls

| Failure | Guard |
|---|---|
| Root cause stops at a person ("dev pushed bad code") | Keep asking why until it is a process or system gap |
| Action items too vague to check | Each item is a concrete change with an owner and a date |
| Post-mortem written days later from memory | Draft it in the same session while logs and commands are visible |
| Lessons written, never read again | Surface the lesson when work returns to the same area |
| Every small hiccup becomes a document | Offer once; respect "no" |

---

## Example

**User:** ok that migration wiped the staging orders table. post-mortem pls

```markdown
## 2026-10-19: Staging orders table emptied by migration (severity: medium)

**Summary:** A migration that renamed `orders.status` dropped and recreated the table on staging. 1,240 test orders were lost; restored from the nightly dump after 40 minutes.
**Impact:** QA blocked for 40 min; production not affected.

**Timeline**
- 14:05: migration applied to staging
- 14:12: QA reports empty order list
- 14:20: cause found in generated SQL (DROP TABLE + CREATE)
- 14:45: restored from 02:00 dump

**Root cause:** the ORM generated a drop-and-create for a column rename, and the deploy step applies SQL without review.
**Trigger:** renaming a column through the schema file instead of a hand-written migration.

**What helped:** nightly staging dump existed and restored cleanly.
**What hurt:** no dry-run output was shown before applying.

**Action items**
- [ ] Deploy script prints migration SQL and stops on DROP TABLE: Aina, Oct 22
- [ ] Column renames use explicit ALTER ... RENAME migrations: team rule, Oct 20

**Lesson (one line):** read the generated SQL before any migration that renames.
```

`Logged post-mortem: read the generated SQL before any migration that renames.`

---

## Done when

- [ ] Timeline, impact and root cause are filled with facts from the session
- [ ] Every action item has an owner and a date
- [ ] The entry is blameless and fits on one screen
- [ ] The lesson is one line and was shown to the user

---

*`maji-post-mortem` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
