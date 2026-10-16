---
name: maji-proposal
description: "Structure and draft proposal and scope documents a decision-maker can approve: proposal spine before prose, institutional or partnership paper with annexes (budget, timeline, team, risk), scope and deliverables tables, capability profile, and a delivery note at handover that lists shipped vs quoted. Use when someone says \"write a proposal\", \"partnership paper for the school\", \"proposal to the university\", \"concept paper for the agency\", \"capability profile\", \"scope document\", \"add an annex\", \"delivery note for handover\", \"explain this project to the client\". Not for setting the price itself (use maji-offer) or rendering the PDF (use maji-brand-pdf)."
metadata:
  tier: workflow
  category: business
  version: "1.0.0-lite"
---

# maji-proposal: Proposal and Scope Documents

Turn a project, programme or partnership idea into a document an institution or client can read once and approve. Final output: a main paper with explicit assumptions, outcomes and one ask, its annexes, and (at the end of the job) a delivery note that traces shipped work back to the proposal.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Brand, Money and tax, Folders, Voice and language). If `me/overrides/maji-proposal.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use for proposals to schools, universities, agencies, companies, councils or funders; partnership and MoU concept papers; scope documents; capability profiles; delivery notes and other commercial paperwork around delivery work.
- Use when a quote alone is not enough and the reader must approve a plan, not a number.
- Not for deciding the price, tiers or payment phases: maji-offer locks those and this skill cites them.
- Not for filling the institution's own template (maji-doc-fill-sign) or the final render (maji-brand-pdf).

## Steps

1. **Audience and objective first.** Name the decision-maker (role, not a guess at a person), what they must approve, their approval path (committee, board, procurement, head of department) and the deadline.
2. **Pick the angle.** Institutional (mission, outcomes, compliance, reputation) or commercial (cost, revenue, time saved, risk removed).
3. **Build the spine before prose.** Agree the section list, the evidence each section uses, the deliverables, and the ask.
4. **Write scope as tables.** Columns: item, description in buyer language, included or excluded, phase, acceptance check.
5. **Annexes carry the detail.** Main paper stays short; annexes hold: A budget (copied from the maji-offer quote, never recalculated here), B timeline or Gantt, C team and roles (roles only unless names are approved), D risk and mitigation, E past work or capability evidence, F sample materials.
6. **Translate technical work into value.** Replace stack and feature names with what the reader gets: "parents see attendance the same day" beats "real-time dashboard with Supabase".
7. **Capability profile (if asked).** Two pages: who the provider is, what it does, three proof points with evidence that exists, delivery model, contact.
8. **Fresh-reader test.** Before sending, read it as the approver with no context: can they state the ask, the cost, the timeline and their own obligations after one pass?
9. **Sweep and render.** Remove em dashes, internal codenames, placeholder text, other clients' names and any brand from an older template.
10. **Delivery note at handover.** Table: proposal item, status (shipped, partial, deferred, dropped by agreement), evidence (link, file, screenshot), notes.

## Composes with

- **maji-offer**: owns price, tiers and payment phases; this skill cites them.
- **maji-market-scan**: background, need and positioning evidence.
- **maji-brand-pdf**: renders paper, annexes and profile.
- **maji-doc-fill-sign**: when the institution supplies its own template.
- **maji-app-capture**: real screenshots for the capability annex.
- **maji-outreach**: the cover message and follow-up once the paper is sent.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-proposal` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
