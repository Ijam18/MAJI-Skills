---
name: maji-offer
description: "Run an inbound inquiry through the full offer pipeline: one fixed price with per-line justification, a one-page scope or module list, an optional training pack or live demo, a quotation PDF with validity and payment phases, then the pitch (deck, capability profile, proposal, contract paperwork) and later the invoice. Use for \"how much should I charge\", \"price this project\", \"make a quotation\", \"draft a proposal\", \"pitch deck for this client\", \"training package\", \"draft an invoice\", \"turn this app into an offer\", \"what is this website worth\", \"package this project for sale\". Lock price, scope and payment before building."
metadata:
  tier: workflow
  category: business
  version: "1.0.0-lite"
---

# maji-offer: Offer Pipeline

Inquiry in, signed-off offer out. Output: a fixed price with justification, a one-page scope, a quotation PDF under the right provider identity, the pitch material the buyer needs, and the locked numbers recorded for later invoicing.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Brand, Money and tax, Folders, Voice and language). If `me/overrides/maji-offer.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use when a client, sponsor or employer asks what you would charge, what you would teach or build, or wants a quote, proposal, deck or invoice.
- Use before building for a new client: scope and payment get locked first.
- Not for the document rendering itself (maji-brand-pdf does that). Not for filling a template the client sent (maji-doc-fill-sign).

## Steps

1. **Lock the inputs.** Client type and sector, scope, headcount or scale, dates, delivery mode (on-site, remote, solo or with a facilitator).
2. **Research and package before drafting.** Search the client: who they are, what they need, sector norms.
3. **Give one price, not a range.** Justify each line in plain language a non-technical buyer understands.
4. **Draft the scope or module list.** One page, portrait.
5. **Training pack (if it is training).** Numbered folders by who holds them: `1-client`, `2-participants`, `3-facilitator`, `4-class-materials`, `5-admin`.
6. **Quotation.** Reference number, issue date, validity (30 days is common), line-item table with named lines (design, development, revisions, support, never "miscellaneous"), total, assumptions, exclusions, payment phases, add-ons, issuer contact details (email, phone), client's registered name and contact, tax status.
7. **Pitch, sized to the audience.**
8. **Demo-first, only on purpose.** If you build before quoting (a live site or spin-off demo app in a day), send the quote or a presentation request right after the demo, priced per finished module.
9. **Invoice against the locked phases.** Lines come from the quoted scope and payment phases, under the same provider identity, each specific enough to audit against a quote line or milestone.
10. **Record what was locked.** Final price, payment phases, provider identity and scope go in project notes.

## Composes with

- **maji-brand-pdf**: renders the module list, quotation, profile and paperwork.
- **maji-doc-fill-sign**: fills the client's own agenda or form templates.
- **maji-app-capture**: real screenshots and demo walkthroughs for the deck.
- **maji-deadline-sprint**: the demo-first build or same-day spin-off demo.
- **maji-review**: check the deck and quote for overclaims before sending.
- **maji-mode**: discuss scope before pricing; one clarifying question beats a wrong quote.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-offer` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
