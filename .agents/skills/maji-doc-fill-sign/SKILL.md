---
name: maji-doc-fill-sign
description: Work on a document someone hands you (form, letter, weekly logbook, DOCX template, reviewer feedback, partner deck) without breaking the original. Find it in the inbox folder, read it by type, edit a copy in its native format, fill fields, place signature and stamp, preview, then deliver with a status suffix and a draft reply email. Use for "fill and sign this form", "sign this week's logbook", "fill in this docx template", "apply this reviewer feedback", "check my Downloads folder", "don't change the original format", or in Malay "tolong isi dan sign", "aku ada letak fail dalam Downloads", "jangan ubah format asal". Not for creating a new branded PDF from scratch (use maji-brand-pdf).
metadata:
  tier: workflow
  category: business
  version: "1.0.0-lite"
---

# maji-doc-fill-sign: Document In, Document Out

Inbox in, copy edited in place, outbox out. Output: a filled or signed copy in the original format (`- Signed.docx`, `- Filled.pdf`), the original untouched, plus a short reply email if one is needed.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Brand, Money and tax, Folders, Voice and language). If `me/overrides/maji-doc-fill-sign.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use when the input is someone else's file: a form, a letter to answer, a recurring logbook, a client template, reviewer comments, a concept paper or deck.
- Use when the format must survive exactly (a supervisor's template, an official form).
- Not for a new document you design yourself (maji-brand-pdf). Not for pricing or pitching (maji-offer).

## Steps

1. **Locate the input.** The user names a file or folder in an inbox (Downloads, Documents, a project folder).
2. **Read it by type.**
3. **Summarise and ask before acting.** State what you understood and the plan in a few lines.
4. **Work on a copy.** Keep the original byte-for-byte.
5. **Edit in the native format.**
6. **Respect the form's rules.**
7. **For feedback documents:**
8. **Preview and compare.** Render the copy to PNG.
9. **Export only as asked.** DOCX stays DOCX unless a PDF is requested.
10. **Deliver and record.** Put the result in the outbox with its suffix, give the path, and draft a short reply email if the sender expects one.

## Composes with

- **maji-brand-pdf**: renders recreated forms, letters and PDF exports.
- **maji-offer**: client templates (agenda, schedule) often arrive mid-offer.
- **maji-app-capture**: fresh screenshots when feedback hits a manual, deck or demo.
- **maji-review**: check the edit script before it runs on a real document.
- **maji-mode**: ask once before touching confidential or ambiguous files.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-doc-fill-sign` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
