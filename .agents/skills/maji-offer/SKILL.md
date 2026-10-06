---
name: maji-offer
description: Run an inbound inquiry through the full offer pipeline: one fixed price with per-line justification, a one-page scope or module list, an optional training pack or live demo, a quotation PDF with validity and payment phases, then the pitch (deck, capability profile, proposal, contract paperwork) and later the invoice. Use for "how much should I charge", "price this project", "make a quotation", "draft a proposal", "pitch deck for this client", "training package", "draft an invoice", or in Malay "berapa patut aku charge", "buat sebut harga", "jangan bagi julat, terus bagi harga". Lock price, scope and payment before building.
metadata:
  tier: workflow
  category: business
  version: "1.0.0"
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

1. **Lock the inputs.** Client type and sector, scope, headcount or scale, dates, delivery mode (on-site, remote, solo or with a facilitator). Decide the **provider identity** once (company, partner entity or individual) and use it on every document. Check registration and tax status and any certification or levy-claim eligibility; if it does not exist, do not imply it.
2. **Research before drafting.** Search the client: who they are, what they need, sector norms. Look for your own past offers, module lists and packs and start from them, not from zero.
3. **Give one price, not a range.** Justify each line in plain language a non-technical buyer understands. Structure:
   - Core offer vs optional add-ons (kept visibly separate).
   - Build fee, monthly retainer, add-ons, payment phases (deposit, milestone, handover).
   - Training: per head vs per day, and what is included.
   - Map every built item to a payment phase. Work finished outside the current invoice goes to a named later payment, never silently dropped.
   - Keep paid items (an admin panel, say) out of any free base tier.
4. **Draft the scope or module list.** One page, portrait. Based on what you can actually deliver. General by default (strip client-specific framing unless asked); trim, merge or reorder modules as instructed. Render with maji-brand-pdf and iterate voice, not facts.
5. **Training pack (if it is training).** Numbered folders by who holds them: `1-client`, `2-participants`, `3-facilitator`, `4-class-materials`, `5-admin`.
   - Coded learning outcomes, then a minute-by-minute lesson plan (what is said, what is typed). Lesson minutes must add up to the session length.
   - Participant materials: pre-course guide, workbook, prompt handouts, feedback form, certificate, setup guide.
   - Fictional pre-seeded data (raw and labelled CSV) participants can download.
   - Weekly pre-event checklist, attendance list, a full dry run. Test every prompt block before the day.
   - Lock participant requirements early (laptop needed or optional); if they change, notify participants.
   - If the presenter cannot teach it solo, simplify (fewer modules, ask-the-chatbot instead of analytics).
   - If participants use a learning platform, load the course there: one lesson file per module, long prompts as copyable code blocks, facilitator-only blocks stripped at render (not just hidden). Run its content and end-to-end tests.
6. **Quotation.** Reference number, issue date, validity (30 days is common), line-item table, total, assumptions, exclusions, payment phases, add-ons, issuer contact details (email, phone), client's registered name and contact, tax status. Bilingual if the buyer needs it. Render with maji-brand-pdf under the provider identity from step 1. Do not attach prices when only an outline was asked for.
7. **Pitch, sized to the audience.**
   - Proposal or presentation request: current status and demo, suggested improvements, next-phase quote.
   - Deck: propose the slide list first (audience, language, layout mix). Real screenshots with personal data blurred, generated photos where needed. Build with reportlab, pptxgenjs or Marp. Honest status chips (Available / Partial / Next phase), placeholders where there is no metric.
   - Capability profile: inventory past work, group by category, confirm with the owner which sensitive client names may appear, compress to 2 pages.
   - Paperwork bundle (proposal, SOW, MSA, SLA, NDA, DPA, change request, invoice template): Markdown + frontmatter through one build script that globs the folder.
8. **Demo-first, only on purpose.** If you build before quoting (a live site or spin-off demo app in a day), send the quote or a presentation request right after the demo, priced per finished module. Rotate demo credentials after the pitch.
9. **Invoice against the locked phases.** Lines come from the quoted scope and payment phases, under the same provider identity. Flag missing client details (registered name, contact, tax status) instead of inventing them.
10. **Record what was locked.** Final price, payment phases, provider identity and scope go in project notes. The rate card stays private: never in a public repo; generated quotes stay out of git.

## Variants

- Training offer: per-head rate, module list, one-page agenda, full pack, course on a learning platform.
- Build offer: app or website with build fee, retainer and add-ons; school or community site roadmap proposal.
- Demo-first: working site or demo app, then a formal letter requesting a presentation slot plus next-phase quote.
- Event sponsorship kit: tiers with deliverables, invitation and sponsor email sequences, press release in two languages, prospectus rendered from the live site.
- Deck for investors, government officials or competition judges; two-page capability profile; consultancy paperwork bundle.

## Pitfalls

- Gave a price range when one number was wanted. Guard: step 3, one number.
- Scope and payment were not locked before building (retro-quote); finished work was left off the current invoice. Guard: quote before build; map every built item to a payment phase.
- Provider identity was inconsistent (company vs individual vs partner); a personal name appeared where the company should. Guard: lock it in step 1.
- First draft too complex, too client-specific, or sounding like AI. Guard: general, short, human voice from draft one.
- Format and language flip-flopped (landscape vs portrait list, local language vs English). Guard: lock both in step 1.
- Scope drift: a four-page facilitator playbook when only an agenda was asked. Guard: deliver exactly the asked artefact.
- Pack rebuilt from scratch; a headcount pivot left stale numbers across many files. Guard: one source for variables; grep old values after any pivot.
- Deck overclaimed features (MFA, encryption, integrations that do not exist). Guard: honest status chips, verify each claim.
- Quote went out without issuer contact or the client's registered details. Guard: step 6 checklist.
- Renderer depended on a tool installed inside another project. Guard: one shared toolkit install.
- A scratch-folder wipe lost the deck build script and generated images. Guard: keep build sources in the project.
- Client network blocked the tools needed in class; single presenter with no backup. Guard: check the venue network early, keep an offline fallback and a backup lead.
- After a demo-first presentation there was no record of acceptance or payment. Guard: confirm acceptance and the next payment in writing, then record it (step 10).
- Quote rendered in system fonts and off-brand colours. Guard: always render through maji-brand-pdf under the provider brand.
- Deck preview lacked the deck font; numbers overflowed their boxes. Guard: render QA with a metric-compatible font (e.g. Carlito for Calibri), check every slide image.
- Old login passwords sat inside the screenshot capture script. Guard: credentials from env vars only.

## Done when

- [ ] One fixed price with per-line justification; core vs add-ons separated; payment phases set
- [ ] Provider identity, tax status and contact details consistent on every document
- [ ] Scope or module list is one page, general, approved
- [ ] Quotation has reference, date, validity, assumptions, exclusions, phases, issuer contact
- [ ] Pitch material claims only what exists; sensitive names confirmed
- [ ] Locked price and phases recorded privately; rate card not public

## Composes with

- **maji-brand-pdf**: renders the module list, quotation, profile and paperwork.
- **maji-doc-fill-sign**: fills the client's own agenda or form templates.
- **maji-app-capture**: real screenshots and demo walkthroughs for the deck.
- **maji-deadline-sprint**: the demo-first build or same-day spin-off demo.
- **maji-review**: check the deck and quote for overclaims before sending.
- **maji-mode**: discuss scope before pricing; one clarifying question beats a wrong quote.

---

*`maji-offer` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
