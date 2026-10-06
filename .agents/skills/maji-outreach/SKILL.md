---
name: maji-outreach
description: Plan who to approach and how. Rank partner, sponsor or buyer categories by fit, pick one segment, then build a short outreach sequence with distinct first-contact and follow-up messages tied to one real offer. Use when you need leads, sponsors, collaborators or a follow-up cadence instead of a generic brainstorm.
metadata:
  tier: experimental
  category: business
  version: "1.0.0"
---

# maji-outreach: Targets, Sequence, Follow-up

A skill that turns "who should I reach out to?" into a ranked target list and a short, sendable message sequence. It works for sales leads, sponsors, partners and collaborators. It plans and drafts. It never sends anything on its own.

---

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Brand, Money and tax, Folders, Voice and language). If `me/overrides/maji-outreach.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to Use

Type `maji-outreach <offer or project>` or ask in plain language:

- "who would sponsor this event?"
- "find partner angles for this app"
- "plan outreach to schools / clinics / agencies for this offer"
- "write the follow-up sequence after my first message"

---

## Inputs (ask once, only for what is missing)

| Input | Example |
|---|---|
| Offer | One line: what you sell, propose or need |
| Objective | Meeting, pilot, sponsorship, paid project, intro |
| Audience hints | Industry, region, size, language |
| Constraints | Channel (email, DM, phone), deadline, budget |
| Existing contacts | Warm leads, past clients, referrals |

If there is no concrete offer yet, stop and say so. Outreach without an offer is noise. Point to `maji-offer` first.

---

## Protocol

### Step 1: State the value in the target's terms
One sentence: what the target gets, not what you built.
Example: "Clinics cut no-show bookings with automatic reminders" beats "We built a booking app with reminders".

### Step 2: Target categories before names
List 3 to 5 categories. For each:

- **Incentive**: why this category benefits (revenue, reach, compliance, reputation, mission)
- **Control**: what they hold that you need (budget, audience, access, distribution)
- **Fit**: High / Medium / Low, with one line of reasoning

Rank by relevance multiplied by leverage. Give individual names only when asked, and only from sources the user can verify. Never invent contacts, titles or email addresses.

### Step 3: Pick one segment and one objective
Recommend the top category. Alternatives in one line. Running five segments at once dilutes every message.

### Step 4: Build the sequence
Default cadence (adjust to channel and culture):

| Touch | Day | Purpose | Message angle |
|---|---|---|---|
| 1 | 0 | First contact | Who you are, why them, one concrete value, one small ask |
| 2 | 3 to 4 | Follow-up | Add something new: proof, short case, demo link, relevant date |
| 3 | 10 | Last nudge | Easy yes or easy no, offer a smaller next step |
| Park | 14+ | Stop | Log outcome, revisit only with a new reason |

### Step 5: Draft the messages
- **First contact**: under 120 words. One ask (a 15-minute call, a reply, a pilot). Personalize the first line to the category or the target.
- **Follow-ups**: shorter than the first message. Each adds new information. Never "just checking in".
- **Last nudge**: polite exit that keeps the door open.
- Match the audience's language and formality. Formal institutions get a formal register; founders and small shops get a direct one.

### Step 6: Tracking and stop rules
- Where to log: one sheet or CRM with columns `target, category, touch, date, status, next`
- What counts as a result: reply, meeting booked, referral, clear no
- When to stop: after the last nudge, on any opt-out, or on a clear no

---

## Output Format

```
OUTREACH PLAN: [offer]
Objective: [meeting / pilot / sponsorship / sale]
Value line: [one sentence in the target's terms]

TARGET CATEGORIES (ranked)
1. [Category] | Fit: High | Incentive: ... | Controls: ...
2. [Category] | Fit: Medium | ...
3. [Category] | Fit: Low | ...

RECOMMENDED: [Category 1]. Alternative: [Category 2] if [condition].

SEQUENCE
| Touch | Day | Channel | Angle |
|---|---|---|---|
| 1 | 0 | email | ... |
| 2 | 4 | email | ... |
| 3 | 10 | DM | ... |

MESSAGES
[Touch 1 draft]
[Touch 2 draft]
[Touch 3 draft]

TRACKING: [sheet columns] · STOP: [rule]
NEXT MOVE: [one concrete action]
```

---

## Rules

- **Categories before names**: names only on request, and only verifiable ones
- **Every target tied to an incentive**: no "they might be interested"
- **One ask per message**: never stack a call, a deck and a pricing question together
- **First contact and follow-up are different messages**: follow-ups add value, not pressure
- **No fabrication**: no invented stats, testimonials, client logos or contacts
- **Respect opt-out**: stop on any no, and follow local anti-spam and privacy rules
- **Draft only**: the user sends; this skill never contacts anyone

---

## Anti-patterns Avoided

| Avoid | Do instead |
|---|---|
| A list of 50 random company names | 3 to 5 ranked categories with incentives |
| "Just following up on my last email" | A follow-up that adds proof or a new reason |
| A 400-word first message | Under 120 words, one ask |
| Pitching features | Pitching the outcome for that category |
| Outreach before the offer is clear | Fix the offer first, then reach out |
| Endless chasing | Park after the last nudge, log the outcome |

---

## Example

```
maji-outreach "booking web app for small dental clinics, want 3 pilot users"

Value line: Fewer no-shows and less phone time for front desk staff.

1. Independent dental clinics (2 to 5 chairs) | Fit: High
   Incentive: lost revenue from no-shows | Controls: buying decision is the owner
2. Dental supply distributors | Fit: Medium
   Incentive: value-add for their clinic customers | Controls: distribution
3. Dental associations | Fit: Low (for pilots)
   Incentive: member benefits | Controls: audience, slow decisions

RECOMMENDED: independent clinics, owner-operated. Alternative: distributors once 3 pilots exist.
```

---

## Composes With

- `maji-offer`: defines the offer and price before outreach starts
- `maji-brand-pdf`: turns the plan into a branded outreach or sponsorship kit
- `maji-mode`: token discipline and one-recommendation rule apply

---

*`maji-outreach` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · No Codes, Only Vibes.*
