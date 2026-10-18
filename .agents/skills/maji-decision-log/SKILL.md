---
name: maji-decision-log
description: Keep an append-only decision log for a project. Capture each non-obvious choice with its context, what was chosen, what was rejected and why; answer "why did we choose X?" from the log; record reversals as new entries instead of edits. Use when a trade-off is settled in a session, when someone asks why something is the way it is, or before reopening a choice that was already made.
metadata:
  tier: core
  category: dev
  version: "1.0.0"
---

# maji-decision-log: Append-Only Decision Log

A skill that writes down the "why" behind non-obvious choices so the next person (or the next agent session) does not reopen a settled trade-off or repeat a rejected option.

---

## Step 0: your context

Read `me/profile.md` if it exists (Folders). If `me/overrides/maji-decision-log.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to Use

- A trade-off was just settled ("we'll use Postgres, not Mongo", "no SSR for the dashboard")
- Someone asks "why did we choose X?" or "what was the trade-off?"
- A choice is about to be reopened, and you want to check what was decided before
- A past decision is being reversed

Skip trivial or obvious choices (using git, formatting preferences, a library everyone already uses).

---

## Where the log lives

One file per project: `docs/decisions.md` by default. Use the path the project already has (`DECISIONS.md`, `docs/adr/`) if one exists. Create the file with a one-line header if it is missing:

```markdown
# Decision log
Append-only. Newest entries at the bottom. Reversals are new entries, never edits.
```

---

## Entry format

```markdown
## YYYY-MM-DD: Short title
**Context:** what situation forced the choice
**Decision:** what was chosen
**Rejected:** the alternatives and why each lost
**Rationale:** the trade-off, constraint or evidence that decided it
**Revisit if:** the condition that would make this worth reopening (optional)
```

All of Context, Decision, Rejected and Rationale are required. "Revisit if" is the cheapest way to stop the same debate next month.

---

## Steps

### Logging a decision

1. Name the decision in one line: chosen option versus rejected options.
2. Check it is non-obvious. If a newcomer would never ask "why?", skip it.
3. If the alternatives or the reason are vague ("we went with the better one"), ask one question to get them.
4. Write the entry with today's date and append it after the last entry.
5. Confirm in one line: `Logged: <title>`.

### Answering "why did we choose X?"

1. Search the log for the keywords (tool names, feature names, the rejected option).
2. Quote the matching entry or entries in full, newest last.
3. If nothing matches, say so plainly and offer to log the decision now if the user knows the reason.

### Reversing a decision

1. Never edit or delete the original entry.
2. Append a new entry titled `Reversed: <original title>` that links to the original date and title.
3. In Context, say what changed: new information, a new constraint, a failed assumption.

---

## Rules

- **Append-only:** past entries are never rewritten, only superseded.
- **Rejected options are mandatory:** a decision without its alternatives cannot be re-checked later.
- **One decision per entry:** related choices get separate entries that reference each other.
- **Facts over opinions:** cite numbers, benchmarks, deadlines and constraints when they exist.
- **Offer, don't nag:** when a decision-worthy moment appears mid-session, offer once ("Log this decision?") and move on if declined.

---

## Pitfalls

| Failure | Guard |
|---|---|
| Log fills with trivial choices nobody reads | Non-obvious only; ask "would a newcomer ask why?" |
| Entry says what was chosen but not what was rejected | Rejected is a required field |
| Old entry quietly edited after a reversal, history lost | Reversal is always a new entry |
| Same debate reopened every month | Fill "Revisit if" so the trigger to reopen is explicit |
| Log scattered across chat and tickets | One file per project, in the repo |

---

## Example

**User:** we're going with server actions instead of a REST layer for the admin panel. log it

```markdown
## 2026-10-19: Server actions for the admin panel
**Context:** Admin panel needs ~12 internal mutations; no external clients call them.
**Decision:** Next.js server actions, called directly from the forms.
**Rejected:** REST API routes (extra layer and types for no outside consumer); tRPC (new dependency for one surface).
**Rationale:** Fewer files, end-to-end types from the form to the database, and the panel is internal only.
**Revisit if:** a mobile app or partner needs the same mutations.
```

`Logged: Server actions for the admin panel`

---

## Done when

- [ ] The entry has Context, Decision, Rejected and Rationale
- [ ] It was appended, not inserted or edited
- [ ] Reversals reference the original entry
- [ ] The user saw a one-line confirmation

---

*`maji-decision-log` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
