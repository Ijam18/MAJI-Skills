---
name: maji-video-gen
description: Produce short AI-generated videos end to end. Lock the objective and a timestamped shot list (A-roll and B-roll), write a prompt pack per shot, approve stills before spending video credits, generate takes one job at a time with a generator the owner allows (for example Higgsfield), pick takes, add music and SFX in 2-3 mixes for the owner to choose, QA every frame, then export 9:16 (plus 16:9 or 4:5) with cover and caption. Use when someone says "make an AI video", "prompt pack by timestamp", "animate this still", "same face in every shot", "AI news anchor clip", "video for the hackathon", "shot-by-shot prompts", "frame prompt and motion prompt", "image-to-video workflow" or "strategy first, no prompts yet". Not for code-rendered films (use maji-code-video) or transcription (use maji-video-transcribe).
metadata:
  tier: workflow
  category: content
  version: "1.0.0-lite"
---

# AI Video Generation

Turn one objective into short AI-generated clips that keep the same look across shots, then cut, score, check and export them. Final output: MP4 per ratio (9:16, plus 16:9 or 4:5 when asked), audio mixes A/B/C, a cover image, the post caption, `prompts-log.md`, `continuity.md` and `LICENSES.md`.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-video-gen.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- **Use:** ads and teasers, AI presenter or news-anchor segments, contest and hackathon entries, B-roll for a bigger edit, animating approved stills, any scene that cannot be filmed or captured.
- **Not:** promo films built from real app UI or approved posters with no generator (use `maji-code-video`, which is also the fallback when credits run out or the owner rules the generator out); turning existing video into text (use `maji-video-transcribe`); editing real footage (use a video editor).

## Steps

1. **Check access before anything else.** Ask which generators the owner allows (owners do rule tools out by name), check the credit balance and plan limits, and confirm which approved reference photos you may use.
2. **Lock the objective (discuss mode, no prompts yet).** Concept, audience, duration (short entries often run 30 to 45s), ratios, style, scene list and CTA (no domain in the CTA if the site is not live yet).
3. **Shot list by timestamp.** Split A-roll (presenter or main action) from B-roll (supporting shots), one job per shot.
4. **Write the prompt pack, one block per shot.** Keep what the frame looks like (subject, wardrobe, setting, framing, light) apart from what moves (action, camera, end state), so a failure can be fixed in one part.
5. **Make and approve the stills first.** Generate start frames one at a time with an image model (see `maji-image-gen`), or use approved photos, posters or renders.
6. **Generate takes, one job at a time.** Use the approved still as the start image (image-to-video) when identity, wardrobe or framing must hold; prompt-only (text-to-video) is for atmospheric shots with no face or when exploration speed matters more.
7. **Pick and fix.** Grab a sample frame per take with ffmpeg into a contact sheet and pick per shot.
8. **Assemble.** Trim and join the picked takes (a video editor or ffmpeg concat), add overlays and logo in the edit, export a silent master and a `cuts.txt` with hit points.
9. **Music and SFX in 2-3 mixes.** Propose 2 to 3 genres tied to the audience before mixing.
10. **QA every frame that ships.** Faces match the reference and do not morph between cuts, hands, garbled lettering or fake logos inside the frame, logo and palette in the overlays, every claim in voice or overlay traced to a source.
11. **Export per ratio.** 9:16 (1080x1920) for reels and stories, 16:9 (1920x1080) or 4:5 (1080x1350) when asked; libx264, yuv420p, bt709, `+faststart`.
12. **Deliver and wait.** MP4s, cover, caption, prompt log and licences in one delivery folder.

## Composes with

- `maji-propose`: discuss mode for the concept, numbered options for direction.
- `maji-image-gen`: start frames, face references and still QA.
- `maji-poster-batch`: approved posters as source stills; same local overlay rendering.
- `maji-code-video`: no-generator fallback, and its audio step for code-composed music and SFX.
- `maji-app-capture`: real product screens as inserts next to generated shots.
- `maji-video-transcribe`: Whisper transcription of the voice track for subtitles.
- `maji-brand-pdf`: storyboard or prompt pack as a sign-off PDF for a client.
- `maji-meta-schedule`: schedules the finished reel with audio already muxed.

*`maji-video-gen` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-video-gen` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
