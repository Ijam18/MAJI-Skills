---
name: maji-image-gen
description: Generate and edit AI images that survive QA. Write the brief, prepare references (face, product, brand), generate one image at a time (Canva generate-image, Gemini image models such as "Nano Banana", Higgsfield or Bloom), QA every image at full size (distinct faces, apparent age, hands, no text or logos baked in, colours against the swatch), edit (background removal, watermark, crop per ratio), then save a reusable prompt pack. Use when someone says "generate AI models for the poster", "professional photos for the deck, not screenshots", "product shot on a clean background", "watermark this screenshot", "write a prompt pack I can run in Gemini", or in Malay "generate gambar AI guna muka ni", "muka diorang kena distinct", "buatkan prompt pack". Not for text layouts (render text locally via maji-poster-batch) or video (use maji-video-gen).
---

# maji-image-gen: AI Image Studio

Brief, reference, generate one at a time, QA, edit, keep the prompts. Final output: approved images at the target ratio in the project folder, a QA note per image, and a prompt pack anyone can re-run.

## When to use / when not

- **Use:** AI people for posters (models, hosts, players, crowds), professional photos for a deck or landing page, product shots and cut-outs, print-ready graphic designs, a watermark on a screenshot before sharing it outside, a triptych master image, a profile picture or cover.
- **Not:** text, prices or logos inside the image (generate a clean photo, then overlay locally with `maji-poster-batch`), real product UI (capture the real app with `maji-app-capture`), video (`maji-video-gen` animates approved stills, `maji-code-video` builds from code), or copying a licensed character, artist or campaign.

## Steps

1. **Write the brief.** Use and size (feed 4:5 at 1080x1350, story 9:16 at 1080x1920, deck 16:9, print 1:1), subject, and where text will sit. Read the house image rules file first: age band, dress norms for the audience, ethnic mix, body types, banned elements. Ask one question if the use is unclear; ask before depicting anyone the audience norms make sensitive.
2. **Pick the tool and check the budget.** Options: Canva `generate-image` through its connector (async; poll `get-generate-image-job`), Gemini image models ("Nano Banana", e.g. in Google AI Studio, often run by the user from a prompt pack), Bloom `generate_image`, or Higgsfield. Use only tools the owner has approved, check credits or balance before a run, and ask before using any tool not yet approved.
3. **Prepare references.**
   - People: approved source photos only, cropped to the face, uploaded as reference media. One reference per identity.
   - Products: real shelf photos, white-balanced; match fabric colour against the swatch; cut out before compositing.
   - Brand: palette swatch and do/don't list from `maji-brand-kit`. The logo goes on in the overlay, never in the generation.
4. **Write the prompt** one clause per concern, so a failure can be fixed by changing one clause:
   ```text
   Person matching the face reference (identity only, ignore its clothes and background).
   [Age: clearly 20 to 28], [body type], wearing a [colour] [garment], [pose, facing camera],
   [framing: head fully in frame], plain area at [top/bottom] for text.
   Natural light, photo-real, [ratio]. No text, no logos, no watermark, no real team colours.
   ```
   For crowds, describe every person separately (face shape, expression, hair, body type) and mix ethnicities. Keep styles original: no licensed characters or copied collaborations.
5. **Generate one at a time.** Queue the jobs; respect the cooldown (Canva allows about one image per 3 to 5 minutes; parallel calls fail on quota). Wait for the job, export at full size, save straight into the project folder (`assets/photos/<id>.png`), never only in a scratch or temp folder.
6. **QA at full size.** Build a face sheet (crop each face with PIL or sharp, view at 200% next to its reference). Hard fails: the same face or haircut twice in one group, apparent age outside the band, broken hands, fingers or shoes, heads cropped, back-facing poses, odd artifacts (animal features on objects), any text, logo, watermark or recognisable IP, clothing or brand colours off the swatch, cultural details wrong. Preview thumbnails are too small for this; QA the export.
7. **Fix by clause.** Regenerate changing only the failing clause. Write every new rule into the rules file and the QA checklist in the same step.
8. **Edit.**
   - Background removal: Canva `remove-background`, or a local tool.
   - Crop per ratio locally (PIL, sharp); keep feed images 4:5.
   - Watermark or overlay text locally when it must be exact (see Variants).
9. **Save the prompt pack.** `prompts/<series>.md`: how to use, one prompt per ID (the ID is also the output filename), a constraints appendix, an IP note, and a status column (generated, approved, rejected plus reason). Hand approved images to the next skill.

## Variants

- **Face-referenced model or host:** the same person across a series; one reference, identity-only clause, face sheet against that reference every time.
- **Crowds and teams:** per-person descriptions, tight age band, distinct faces and hair; invented team colours and names checked against a deny-list.
- **Product shots:** white-balance shelf photos, swatch match, cut-out, then composite or place on a clean background.
- **Print-ready design pack:** reserve a numbered code range, write prompts by series, appendix "1:1, transparent background, high contrast, no text, no watermark, no logo, print-ready". The user runs one prompt at a time, downloads the PNG, names it by code, uploads it to the catalog.
- **Screenshot watermark:** screenshot plus logo into an AI image editor (Gemini image models, GPT-4o image edit) with a fixed prompt: tiled logo, a CONFIDENTIAL badge, a footer strip, underlying content unchanged. Tweak on request (thicker, subtler, badge only, disclaimer in the local language). Compare against the original before sharing; if the editor redrew content, apply the watermark locally with PIL or sharp instead.
- **Deck photos:** professional, diverse people instead of screenshots, heads fully in frame; real screens still come from `maji-app-capture`.
- **Triptych master:** make your own version of an example (never copy it), one master strip (about 3105x1350), plan the grid math (the profile grid shows a 3:4 crop of each 4:5 post), cut three 4:5 tiles with seam overlap.
- **Profile picture and cover:** derive from the brand kit; keep the cover inside its safe area.

## Pitfalls

| Failure | Guard |
|---|---|
| Cooldown and quota; parallel calls fail; upload URLs are rate-limited too | One job at a time, queued; never fire calls in parallel |
| Tool out of credits, or not approved by the owner | Check balance first; ask before using an unapproved tool |
| Same face twice in a group shot, noticed after scheduling | Face sheet per image; hard-fail and swap the media even if already scheduled |
| A "20 to 35" brief lets mid-30s faces through | Tight band ("clearly 20 to 28"); check each face crop |
| References of two people mixed, so the face is wrong | One reference per identity |
| Reference clothes or background leak into the output | "Identity only, ignore its clothes and background" clause |
| Back-facing poses, cropped heads, odd artifacts | Explicit pose and framing clauses; regenerate the failing clause only |
| Text, logos, real team colours or licensed IP in the image | "No text or logos" clause, deny-list, original styles only |
| Image rules change mid-campaign | Update prompts and the QA checklist together |
| Tiny previews hide defects | QA the full-size export |
| AI editor alters the screenshot under the watermark | Say "content unchanged"; diff against the original; fall back to a local overlay |
| Em-dash in badge or prompt text ends up in the image | Use "·" or a comma; lint prompt text |
| Scratch folder wiped, generated images lost | Save to the project folder at once; recover from a built PDF with `pdfimages` |
| Prompt pack written, nothing tracked as generated | Status column; filename equals prompt ID |
| A 3:4 upload triggers an auto-crop warning on the feed | Keep feed images 4:5 |

## Done when

- [ ] Brief written and the rules file read (and updated with any new rule)
- [ ] Every image passed QA at full size, with a note for each rejection
- [ ] No text, logo or watermark baked into photos; overlays done separately
- [ ] Approved images saved in the project folder, named by prompt ID, at the target ratio
- [ ] Prompt pack saved with status per prompt
- [ ] The owner approved the images in this session

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
