---
name: maji-image-gen
description: Generate and edit AI images that survive QA. Write the brief, prepare references (face, product, brand), generate one image at a time (Canva generate-image, Gemini image models such as "Nano Banana", Higgsfield or Bloom), QA every image at full size (distinct faces, apparent age, hands, no text or logos baked in, colours against the swatch), edit (background removal, watermark, crop per ratio), then save a reusable prompt pack. Use when someone says "generate AI models for the poster", "professional photos for the deck, not screenshots", "product shot on a clean background", "watermark this screenshot", "write a prompt pack I can run in Gemini", or in Malay "generate gambar AI guna muka ni", "muka diorang kena distinct", "buatkan prompt pack". Not for text layouts (render text locally via maji-poster-batch) or video (use maji-video-gen).
metadata:
  tier: workflow
  category: content
  version: "1.0.0-lite"
---

# maji-image-gen: AI Image Studio

Brief, reference, generate one at a time, QA, edit, keep the prompts. Final output: approved images at the target ratio in the project folder, a QA note per image, and a prompt pack anyone can re-run.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-image-gen.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- **Use:** AI people for posters (models, hosts, players, crowds), professional photos for a deck or landing page, product shots and cut-outs, print-ready graphic designs, a watermark on a screenshot before sharing it outside, a triptych master image, a profile picture or cover.
- **Not:** text, prices or logos inside the image (generate a clean photo, then overlay locally with `maji-poster-batch`), real product UI (capture the real app with `maji-app-capture`), video (`maji-video-gen` animates approved stills, `maji-code-video` builds from code), or copying a licensed character, artist or campaign.

## Steps

1. **Write the brief.** Use and size (feed 4:5 at 1080x1350, story 9:16 at 1080x1920, deck 16:9, print 1:1), subject, and where text will sit.
2. **Pick the tool and check the budget.** Options: Canva `generate-image` through its connector (async; poll `get-generate-image-job`), Gemini image models ("Nano Banana", e.g.
3. **Prepare references.**
4. **Write the prompt** one clause per concern, so a failure can be fixed by changing one clause:
5. **Generate one at a time.** Queue the jobs; respect the cooldown (Canva allows about one image per 3 to 5 minutes; parallel calls fail on quota).
6. **QA at full size.** Build a face sheet (crop each face with PIL or sharp, view at 200% next to its reference).
7. **Fix by clause.** Regenerate changing only the failing clause.
8. **Edit.**
9. **Save the prompt pack.** `prompts/<series>.md`: how to use, one prompt per ID (the ID is also the output filename), a constraints appendix, an IP note, and a status column (generated, approved, rejected plus reason).

## Composes with

- `maji-brand-kit`: palette swatch, do/don't list and references that every brief starts from.
- `maji-poster-batch`: overlays text and logo on approved photos and runs the batch review.
- `maji-meta-schedule`: schedules the finished posts.
- `maji-brand-pdf`: places approved photos into reports and deck PDFs.
- `maji-app-capture`: real screens when the image must show the actual product.
- `maji-code-video`: uses approved images as scenes in a code-built video.
- `maji-video-gen`: animates approved stills into AI clips with the same faces.
- `maji-propose`: discuss art direction before a large batch.

*`maji-image-gen` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

