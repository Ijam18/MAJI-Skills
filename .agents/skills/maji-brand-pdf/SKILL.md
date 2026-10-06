---
name: maji-brand-pdf
description: Turn content into a branded, print-ready PDF (one-pager, report, formal letter, white paper, syllabus, talk script, slide handout) through one pipeline: HTML or Markdown source, embedded logo and fonts, dash and voice sweep, render with WeasyPrint or Chromium, check every page as an image, then hand off one clean file with a standard name. Use when someone says "make this a PDF", "export to PDF", "one-page report", "letter on our letterhead", "print-ready", "A4 report", "export to my Desktop", or in Malay "buat dalam bentuk PDF", "keluarkan PDF 1 page", "export ke desktop". Not for filling or signing a document someone gave you (use maji-doc-fill-sign).
metadata:
  tier: workflow
  category: business
  version: "1.0.0"
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

1. **Lock brand, language, format first.** Whose brand is it (yours, the client's, a partner's)? Which language and register (formal local language or formal English)? Portrait or landscape? Page budget (1 page, 2 pages)? Default when unsaid: portrait, short, bullets, human voice, general rather than tailored to one client. Ask one question if unclear.
2. **Pick the source format.**
   - Self-contained HTML (inline CSS, `@page { size: A4 }`) for one-pagers and reports.
   - Markdown then `pandoc -t html5 --standalone --css style.css` for letters, white papers, long docs.
   - YAML or JSON content + Jinja2 templates (validate with pydantic or a schema) for books and multi-volume sets.
   - A fixed-size A4 page component (React or similar) for reports rendered inside an app.
3. **Embed every asset.** Put placeholder tokens (`LOGO_B64`, `SIG_B64`, font data) in the source and swap them for base64 with a small script. No external URLs: serverless Chromium has no fonts and offline renders break.
4. **Lay out for print, not screen.**
   - Footers and page numbers go in `@page` margin boxes (`@bottom-left`, `@bottom-right`), never `position: fixed`.
   - Chromium `page.pdf` ignores margin-box counters: use its `headerTemplate` / `footerTemplate` instead.
   - Set `print-color-adjust: exact` and `printBackground: true`; check `@media print` is not stripping colors or the header.
   - Inline bar-chart elements need `display: block`. WeasyPrint SVG: gradients need `gradientUnits="userSpaceOnUse"`, no `foreignObject`.
5. **Sweep the text before rendering.** Replace em-dashes and `--` with `:` `,` or parentheses (a one-line `perl -pi -e` or `sed`). Remove AI-sounding filler, jargon, unrequested synopses, internal notes, teammate names and personal data (ID numbers, private emails, phones). Use ASCII-safe punctuation if the file will move between tools.
6. **Render with the right engine.**

   | Content | Engine |
   |---|---|
   | Letters, reports, text docs | WeasyPrint CLI (if the Python module is missing, call the CLI) |
   | SVG-heavy pages, Mermaid, JS charts, app pages | Chromium: Playwright `page.pdf` or headless Chrome `--print-to-pdf` |
   | Slide decks | Playwright screenshot per slide at a fixed viewport @2x, then combine PNGs with reportlab |
   | Python-native layouts | reportlab |

7. **Check every page as an image.** `pdfinfo` for page count, `pdftoppm -png -r 80` for previews, then open each PNG. Look for: overflow, odd or blank page breaks, footer at the bottom, logo intact, dark text on dark backgrounds, page count within budget. For automated builds, PyMuPDF can assert page count, font allowlist and overflow.
8. **Hand off one clean file.** Copy the final to the agreed outbox as `<Brand>-<Topic>.pdf` plus a status suffix (`- Signed`, `- Filled`, `-A` / `-B`). Confirm size > 0 and no double extension, then open it or give the path. When told to remove old versions, delete them and re-check the new file is not empty.
9. **Iterate on feedback without touching facts.** "1 page", "vertical", "less stiff", "sounds like AI": change layout and voice only. On a pivot ("too complex"), archive the old round and rebuild a compact version.

## Variants

- **Formal letter:** Markdown + letterhead CSS + signature PNG through pandoc and WeasyPrint. Set a reference number, match greeting conventions to the recipient, stack the signature block (name / role / organisation, image about 3.5 to 4 cm wide), one-line footer (email · phone · Page X of Y).
- **A4 stakeholder report:** cover with the key question answered, numbered sections, header-styled tables, inline SVG charts. Non-technical copy, no marketing URLs, no executive summary on the cover if the reader says so.
- **In-app download:** server renders the same page component the preview shows, through the same path, plus a preview modal before download.
- **Recurring report (weekly):** verify data first (all sources ingested, invalid items excluded, every member present, reading the current database) before generating. Name files by period, and merge periods that were missed.
- **Book or syllabus:** content lint (short sentences, denylist, no dashes, no unverified "official" claims), then an adversarial fact pass and a layout pass before build.
- **White paper / research snapshot:** numbered section files concatenated into one Markdown, then pandoc + WeasyPrint. Snapshots are dated; write a new one when the system changes, never overwrite. Set publication typography (default styles can double the page count).
- **Tech docs / knowledge base:** Markdown + Mermaid; verify every claim against the code; keep language versions in sync; security findings go in a separate confidential document, never a public page.
- **Talk script + slides:** script as a readable PDF; slides as self-contained HTML (keyboard nav, light projector-safe theme), screenshot to PDF.

## Pitfalls

- Chromium `page.pdf` truncated a deck (8 of 12 slides) no matter the print CSS. Guard: screenshot per slide + reportlab.
- `position: fixed` footer overlapped content. Guard: `@page` margin boxes only.
- `@page { margin: 0 }` made header and footer bands overlap. Guard: keep bands inside the page sheet, check the crop.
- PDF download did not match the preview; `@media print` dropped colors; dark theme painted black margins. Guard: render through the same path as the preview, force color, use a light print theme.
- Local test harness without the global stylesheet gave a false "it fits". Guard: harness loads the real CSS and mocks auth and APIs.
- Pillow JPEG save threw `KeyError`; img2pdf missing. Guard: build image PDFs with reportlab.
- Invented facts (rules, numbers, regulations) got rejected. Guard: research, cite, run a fact-check pass.
- Many rounds lost to voice ("too stiff", "sounds like AI"), not facts. Guard: apply the voice rules in step 5 on the first draft.
- Content spilled past the page budget, or landscape when portrait was wanted. Guard: lock format in step 1, check page count in step 7.
- Empty or stale files left in the outbox; `.pdf.pdf` names. Guard: size and name check in step 8.
- Build script with a hardcoded file list skipped a new doc. Guard: glob the source folder.
- Temporary render harness got committed. Guard: delete it before commit.
- Recurring report read a stale secondary database, so new members were missing; a wrong join showed 0% in the analysis section. Guard: confirm the live data source and spot-check totals before rendering.
- In-app render: a hosting-platform flag in the local env file broke the local Chromium launch; the bundler rejected a static import of the server-side renderer. Guard: keep platform flags out of local env, import the renderer dynamically.
- Renderer depended on Playwright installed inside an unrelated project; a template path stored in notes had moved. Guard: one shared toolkit install; locate templates fresh each time.

## Done when

- [ ] Brand, language, orientation and page budget were locked before writing
- [ ] All assets are embedded; no external URL in the source
- [ ] No em-dash, `--`, internal notes, teammate names or personal data in the text
- [ ] Every page was viewed as an image; count is within budget; footer sits at the bottom
- [ ] One final file in the outbox, standard name, size > 0, old versions removed if asked
- [ ] Facts unchanged across voice and layout iterations

## Composes with

- **maji-doc-fill-sign**: filled forms and letters render through this engine.
- **maji-offer**: module lists, quotations and capability profiles render here.
- **maji-review**: review the build script or template before reusing it.
- **maji-app-capture**: real app screenshots for manuals and reports.
- **maji-mode**: lock format with one question instead of guessing.

---

*`maji-brand-pdf` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
