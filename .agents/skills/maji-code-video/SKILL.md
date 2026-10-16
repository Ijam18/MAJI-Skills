---
name: maji-code-video
description: Build promo, intro or reel videos from code. The film is an HTML page with a time-driven timeline, rendered frame by frame with Playwright and encoded with ffmpeg, with music and SFX mixed in 2-3 versions for the owner to pick. Uses real app footage or approved posters, no AI video generator. Use when someone says "make a promo video for the app", "Apple-style intro video", "60s showcase in 16:9 and 9:16", "turn these posters into a reel", "add music and sound effects", "Apple-style commercial", "export it as a GIF", "make an emoji GIF", "generative background for the video". Not for live-action editing or talking-head video.
metadata:
  tier: workflow
  category: content
  version: "1.0.0-lite"
---

# maji-code-video: Video from Code

Deterministic, re-renderable promo video built like a web page. Final output: MP4 (9:16 and/or 16:9, 30-60s or a 7-30s reel) with audio versions A/B/C, a cover image, captions, a licence file, and a QA pass.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-code-video.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

Use when:
- An app intro, feature showcase or weekly reel is needed and AI video tools are unavailable, out of credit or not allowed.
- Footage must be the real UI or already approved posters.
- The video will be re-cut often (new copy, new aspect ratio, new track).

Not for:
- Filmed footage, interviews or voiceover-led edits (use a video editor).
- One-off clips where a design tool's built-in animation is enough.

## Steps

1. **Discuss the concept first.** Duration (30 or 60s), aspects (9:16 + 16:9), style, BPM grid (120 or 128), scene list, CTA.
2. **Get footage.** Capture the real app from a production build, never the dev server (see maji-app-capture), or use approved poster layouts.
3. **Write the film.** `film.html` + `film.js`: every layer is a pure function of time, `renderAt(ms)`, or a paused GSAP timeline you seek.
4. **Render.** `render.mjs`: Playwright seeks each frame, screenshots, pipes PNGs to ffmpeg: `-c:v libx264 -pix_fmt yuv420p -colorspace bt709 -movflags +faststart`.
5. **Audio in versions.** 2-3 royalty-free tracks or original music composed in code (numpy/scipy synth, MIDI + FluidSynth with a soundfont).
6. **QA.** `ffprobe` (duration, fps, codec, pix_fmt); contact sheet of sampled frames; OCR the frames (tesseract) for typos, stale numbers and old names; `blackdetect` / `freezedetect`; logo check.
7. **Deliver and wait.** Copy MP4s, cover and captions to a delivery folder.

## Composes with

- **maji-app-capture**: produces the real-app footage.
- **maji-ui-review**: locks brand fonts and palette used in the film.
- **maji-poster-batch**: approved posters become reel source material.
- **maji-meta-schedule**: schedules the finished reel (audio already muxed).
- **maji-mode**: discuss mode for the concept; pause after delivery.
- **maji-review**: check `render.mjs` and audio scripts before batch renders.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-code-video` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
