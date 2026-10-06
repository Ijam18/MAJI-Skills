---
name: maji-doc-fill-sign
description: Work on a document someone hands you (form, letter, weekly logbook, DOCX template, reviewer feedback, partner deck) without breaking the original. Find it in the inbox folder, read it by type, edit a copy in its native format, fill fields, place signature and stamp, preview, then deliver with a status suffix and a draft reply email. Use for "fill and sign this form", "sign this week's logbook", "fill in this docx template", "apply this reviewer feedback", "check my Downloads folder", "don't change the original format", or in Malay "tolong isi dan sign", "aku ada letak fail dalam Downloads", "jangan ubah format asal". Not for creating a new branded PDF from scratch (use maji-brand-pdf).
metadata:
  tier: workflow
  category: business
  version: "1.0.0"
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

1. **Locate the input.** The user names a file or folder in an inbox (Downloads, Documents, a project folder). Use `ls -lt` / `find -newer` by name and recent date. If several near-identical versions exist, list them with dates and confirm which one. Watch for tidy jobs that move loose files into other folders.
2. **Read it by type.**
   - PDF: `pdftotext` or a PDF library.
   - DOCX: unzip and inspect `word/document.xml`, or python-docx / a docx skill. Count the text runs: zero means an image-based document.
   - Images and screenshots: view them directly.
   - Then render a preview to see the real layout (`qlmanage -t` on macOS, LibreOffice headless, or pandoc + WeasyPrint + `pdftoppm`).
3. **Summarise and ask before acting.** State what you understood and the plan in a few lines. Ask first if the instruction is unclear or the material is confidential. Mark third-party confidential material as such: it never goes to a public page, repo or shared artifact.
4. **Work on a copy.** Keep the original byte-for-byte. Save as `<name> - Signed.docx`, `<name> - Filled`, or keep a `- original template` backup next to the working file. Treat input images as read-only: do not move, rename or edit them unless asked.
5. **Edit in the native format.**
   - DOCX: edit `word/document.xml` with zipfile + ElementTree, replacing text inside existing `w:t` runs so styles stay. python-docx is fine for simple text-only docs.
   - Recurring signed doc: transplant the signed block from last time's `- Signed` file. Align tokens with difflib, remap relationship IDs (`rId`), copy the media files (signature, stamp, tick marks). Do not ask the user for signature assets again; take them from the last signed file or one asset folder.
   - Image-based DOCX (0 text runs, scanned fragments): find-and-replace cannot work. Overlay or transplant blocks instead, and say so.
   - Fillable PDF: fill the fields with pypdf or pdftk. Flat PDF or paper form: recreate it as HTML, fill it, place the signature PNG with CSS sizing, render with maji-brand-pdf.
6. **Respect the form's rules.**
   - Never delete mandatory fields (time taken, evaluation, dates). Do not reformat tables or retype rows.
   - Tick inside the box; write comments inside the comment box, not as loose text.
   - Comments are short, bullet-style, written like a real supervisor: no dashes, no AI tone. Match last time's style.
   - Remove headers or footers only when asked. Start the signature at a realistic size (about 3.5 to 4 cm wide).
7. **For feedback documents:**
   - Break the feedback into numbered points; map each one to the exact slide, step or section.
   - Check each point against the real system first (pull the latest code or data); do not apply blindly.
   - Map the reviewer's terms to the actual UI labels.
   - Back up the old version, apply changes at the source (build script, text file, template), not in the output, then regenerate and show a contact sheet.
8. **Preview and compare.** Render the copy to PNG. Check: signature and stamp present (count the media files), layout identical to the original apart from filled values, no table overlapping the header, nothing missing.
9. **Export only as asked.** DOCX stays DOCX unless a PDF is requested. For PDF export, use LibreOffice headless or Word via scripting (macOS `osascript`); GUI automation can hang on a modal dialog, so have a fallback.
10. **Deliver and record.** Put the result in the outbox with its suffix, give the path, and draft a short reply email if the sender expects one. Note any new terms or rules (reviewer vocabulary, signing conventions) in project notes. Delete scratch copies holding personal data.

## Variants

- **Weekly sign-off (logbook, timesheet):** one script with a week parameter plus a signer profile file (name, title, signature, stamp), instead of a new script each week.
- **Letter or form to fill, sign and return:** fill, sign, render, plus a draft reply email for the user to send.
- **Client template (agenda, schedule):** fill the original DOCX directly in XML, keep a copy of the untouched template, export PDF.
- **Reviewer feedback:** new version of the manual, deck or demo, plus an updated term list applied to every other deliverable.
- **Confidential concept paper or partner deck:** a confidential phase plan with open questions stays private; anything public is a neutral prototype, guarded by a test that fails if partner names appear in public copy. Challenge unsourced numbers.

## Pitfalls

- Mandatory fields (time taken, evaluation) were dropped and the format changed when rows were retyped. Guard: edit runs in place; never retype tables.
- Output became an image or PDF when the original DOCX was wanted. Guard: native format unless told otherwise.
- Image-based DOCX had no text runs, so find-and-replace silently did nothing. Guard: check the run count in step 2.
- Comments sounded like AI or contained `--`. Guard: short human bullets, dash sweep.
- Signature too small, enlarged two or three times. Guard: start at a realistic size, check the preview.
- Signature and stamp hunted down again every time. Guard: one asset folder or the last signed file.
- File location kept changing (Downloads vs Documents); many near-identical names. Guard: confirm the exact file in step 1.
- Reviewer terms differed from UI labels; an outdated local clone caused a wrong document. Guard: pull latest, map terms.
- Replacing an image inside a hosted interactive demo corrupted it; old frames had overlays covering the UI. Guard: back up first, recapture frames from the live app instead of patching.
- Revised wording drifted too stiff or too slangy and was rejected. Guard: keep the register of the original document.
- Confidential third-party material leaked to a public site. Guard: classify in step 3, add a guard test.
- Personal data (address, ID number, phone) landed in scratch HTML. Guard: never commit or log it; delete scratch files.
- Unwanted header or footer carried over; table overlapped the header. Guard: compare previews side by side.
- `.pdf.pdf` names and empty files in the outbox. Guard: size and name check before handing off.

## Done when

- [ ] The exact input file was confirmed; the original is unchanged
- [ ] Output is in the original format (or the format asked for), saved with a status suffix
- [ ] Every mandatory field is present and filled; layout matches the original
- [ ] Signature and stamp are present at a realistic size; comments read like a person wrote them
- [ ] Preview images were checked; no personal data left in scratch files or commits
- [ ] Reply email drafted if needed; new terms or rules recorded

## Composes with

- **maji-brand-pdf**: renders recreated forms, letters and PDF exports.
- **maji-offer**: client templates (agenda, schedule) often arrive mid-offer.
- **maji-app-capture**: fresh screenshots when feedback hits a manual, deck or demo.
- **maji-review**: check the edit script before it runs on a real document.
- **maji-mode**: ask once before touching confidential or ambiguous files.

---

*`maji-doc-fill-sign` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
