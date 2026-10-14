---
name: maji-brand-pdf
description: Turn content into a branded, print-ready PDF (one-pager, report, formal letter, white paper, syllabus, talk script, slide handout) through one pipeline: HTML or Markdown source, embedded logo and fonts, dash and voice sweep, render with WeasyPrint or Chromium, check every page as an image, then hand off one clean file with a standard name. Use when someone says "make this a PDF", "export to PDF", "one-page report", "letter on our letterhead", "print-ready", "A4 report", "export to my Desktop", or in Malay "buat dalam bentuk PDF", "keluarkan PDF 1 page", "export ke desktop". Not for filling or signing a document someone gave you (use maji-doc-fill-sign).
metadata:
  tier: workflow
  category: business
  version: "1.0.0-lite"
---

# maji-brand-pdf: Branded PDF Engine

Write the source, embed the brand, sweep the voice, render, look at every page, deliver. Output: one on-brand PDF (plus its source) in an agreed outbox folder, verified page by page.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Brand, Money and tax, Folders, Voice and language). If `me/overrides/maji-brand-pdf.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use for any document going to people outside the build: client one-pagers, module lists, stakeholder reports, letters, briefings, books, tech docs, slide PDFs.
- Use when every project has its own build script that keeps repeating the same render bugs. This is the shared recipe.
- Not for editing a DOCX or form you were handed (maji-doc-fill-sign). Not for pricing (maji-offer), though its quote renders here.

## Steps

1. **Lock brand, language, format first.** Whose brand is it (yours, the client's, a partner's)?
2. **Pick the source format.**
3. **Embed every asset.** Put placeholder tokens (`LOGO_B64`, `SIG_B64`, font data) in the source and swap them for base64 with a small script.
4. **Lay out for print, not screen.**
5. **Sweep the text before rendering.** Replace em-dashes and `--` with `:` `,` or parentheses (a one-line `perl -pi -e` or `sed`).
6. **Render with the right engine.**
7. **Check every page as an image.** `pdfinfo` for page count, `pdftoppm -png -r 80` for previews, then open each PNG.
8. **Hand off one clean file.** Copy the final to the agreed outbox as `<Brand>-<Topic>.pdf` plus a status suffix (`- Signed`, `- Filled`, `-A` / `-B`).
9. **Iterate on feedback without touching facts.** "1 page", "vertical", "less stiff", "sounds like AI": change layout and voice only.

## Composes with

- **maji-doc-fill-sign**: filled forms and letters render through this engine.
- **maji-offer**: module lists, quotations and capability profiles render here.
- **maji-review**: review the build script or template before reusing it.
- **maji-app-capture**: real app screenshots for manuals and reports.
- **maji-mode**: lock format with one question instead of guessing.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-brand-pdf` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
