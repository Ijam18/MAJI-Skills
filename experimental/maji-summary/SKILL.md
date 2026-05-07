---
name: maji-summary
description: Compress long content into structured summary. TLDR + key points + action items, length-tunable. Use for meeting notes, transcripts, long docs, threads, codebases. No padding, no editorial commentary.
---

# maji-summary — Long Content Compression

A skill that compresses long content into a structured summary with TLDR, key points, and action items if applicable. No padding. No "this is a great document!" commentary.

---

## When to Use

Type `maji-summary <target>` where target is:

- A document / file (`maji-summary docs/architecture.md`)
- A URL (`maji-summary https://example.com/blog/post`)
- A transcript / chat history (`maji-summary [paste content]`)
- A codebase summary (`maji-summary src/`)

---

## Output Format

```
TLDR
[1-2 sentences capturing the core message]

KEY POINTS
1. [point 1]
2. [point 2]
3. [point 3]
[5-10 max, ranked by importance]

ACTION ITEMS (if applicable)
☐ [item 1] — owner [if mentioned]
☐ [item 2] — owner

NOTABLE QUOTES (if applicable, max 3)
> "[direct quote]" — [speaker if known]

DECISIONS MADE (if applicable)
- [decision 1]
- [decision 2]

OPEN QUESTIONS (if applicable)
- [question 1]
- [question 2]
```

---

## Length Modes

User can specify length:

| Mode | Trigger | Output |
|---|---|---|
| **Default** | `maji-summary X` | TLDR + 5-10 key points + relevant sections |
| **Brief** | `maji-summary X --brief` | TLDR only + max 3 key points |
| **Full** | `maji-summary X --full` | All sections + supporting quotes + context |
| **Outline** | `maji-summary X --outline` | Hierarchical bullet outline of structure |

---

## Rules

- **Lead with TLDR** — user should know the gist in 5 seconds
- **Rank key points by importance**, not by appearance order in source
- **Use direct quotes sparingly** — only when the exact phrasing matters
- **Action items must be actionable** — no "discuss further", "consider X"
- **Skip editorial commentary** — no "interesting article!", "well-written piece"
- **Preserve numbers** — dates, $, %, counts stay verbatim
- **Flag uncertainty** — if source is ambiguous, mark "(unclear)" not paraphrase confidently

---

## Examples

### Example 1 — Meeting transcript (default)

**Input:** [60-minute meeting transcript, 8000 words]

**Output:**
```
TLDR
Team agreed to ship MVP by 20 May with auth and search; payments deferred to Phase 2. Mung owns infra, Ijam owns frontend.

KEY POINTS
1. MVP scope locked: auth, search, basic dashboard. Payments out.
2. Stack confirmed: Next.js + Supabase + Vercel.
3. Demo to Pengetua scheduled for 18 May, before launch.
4. Risk: WiFi at venue not stress-tested for 70+ concurrent users.
5. Budget approved: RM 5k for materials and printing.

ACTION ITEMS
☐ Ijam — finalize landing page copy by 10 May
☐ Mung — set up Supabase RLS policies by 8 May
☐ Coordinator — confirm WiFi capacity by 13 May
☐ All — review final material draft 17 May

DECISIONS MADE
- MVP scope locked (above)
- 5-week timeline approved (was 4 weeks)
- Cikgu mentor model adopted for pod structure

OPEN QUESTIONS
- Backup hotspot count if WiFi fails on day
- Whether to record sessions for absent participants
```

### Example 2 — Long doc (brief mode)

**Input:** `maji-summary docs/PRD.md --brief`

**Output:**
```
TLDR
MAJI OS is a browser-based PWA learning OS combining W3Schools content, macOS aesthetic, Windows multitasking, Linux depth. MVP ships in 5 weeks with 9 apps + first auto-generated course.

KEY POINTS
1. Stack: Next.js + Supabase + Vercel; domain maji.org
2. MVP scope: 9 apps + auth + PWA + 1 course
3. Soft launch ~9 June, validates with SEMASHUR cohort
```

---

## Anti-patterns Avoided

| ❌ Avoid | ✅ Do instead |
|---|---|
| "This document discusses..." | TLDR |
| Including everything from source ("comprehensive") | Rank and cut |
| Editorializing ("important point!", "great example") | State the point |
| Vague action items ("look into X") | Concrete with owner |
| Ignoring numbers / dates | Preserve verbatim |
| Paraphrasing when ambiguous | Mark "(unclear)" |

---

## Composes With

- `maji-explain` — when summary mentions unfamiliar concept, explain that
- `maji-mode` — token discipline applies (no padding)
- `maji-doc` — summary can become a doc starting point

---

## Customization

- Adjust default length (some teams want longer summaries)
- Add team-specific sections (e.g., "Decisions" before "Action Items")
- Add language preference (translate output)
- Add domain-specific extractors (e.g., for code reviews — group by file)

---

*`maji-summary` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By [MAJI](https://maji.org) · No Codes, Only Vibes.*
