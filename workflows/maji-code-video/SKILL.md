---
name: maji-code-video
description: Build promo, intro or reel videos from code. The film is an HTML page with a time-driven timeline, rendered frame by frame with Playwright and encoded with ffmpeg, with music and SFX mixed in 2-3 versions for the owner to pick. Uses real app footage or approved posters, no AI video generator. Use when someone says "make a promo video for the app", "Apple-style intro video", "60s showcase in 16:9 and 9:16", "turn these posters into a reel", "add music and sound effects", or in casual Malay "buat video promo app ni", "letak lagu dan sfx", "jom buat reel minggu ni". Not for live-action editing or talking-head video.
---

# maji-code-video: Video from Code

Deterministic, re-renderable promo video built like a web page. Final output: MP4 (9:16 and/or 16:9, 30-60s or a 7-30s reel) with audio versions A/B/C, a cover image, captions, a licence file, and a QA pass.

## When to use / when not

Use when:
- An app intro, feature showcase or weekly reel is needed and AI video tools are unavailable, out of credit or not allowed.
- Footage must be the real UI or already approved posters.
- The video will be re-cut often (new copy, new aspect ratio, new track).

Not for:
- Filmed footage, interviews or voiceover-led edits (use a video editor).
- One-off clips where a design tool's built-in animation is enough.

## Steps

1. **Discuss the concept first.** Duration (30 or 60s), aspects (9:16 + 16:9), style, BPM grid (120 or 128), scene list, CTA. No domain in the CTA until the site is live. Propose the music genre for the audience now, not after render.
2. **Get footage.** Capture the real app from a production build, never the dev server (see maji-app-capture), or use approved poster layouts. Scramble QR codes and IDs; freeze dates so badges match the post date.
3. **Write the film.** `film.html` + `film.js`: every layer is a pure function of time, `renderAt(ms)`, or a paused GSAP timeline you seek. Cuts land on the BPM grid. Export the cut and hit points to `cuts.txt` / `hits.json`.
4. **Render.** `render.mjs`: Playwright seeks each frame, screenshots, pipes PNGs to ffmpeg: `-c:v libx264 -pix_fmt yuv420p -colorspace bt709 -movflags +faststart`. Run under `nice -n 10` with 2 threads so the machine stays usable.
5. **Audio in versions.** 2-3 royalty-free tracks or original music composed in code (numpy/scipy synth, MIDI + FluidSynth with a soundfont). Synthesize SFX (tap, pop, stamp, chime in the song's key) at the hit points. Duck under SFX, `loudnorm` to about -14 LUFS, mux with `-c:v copy` so the video stream is untouched. Deliver versions A/B/C plus an SFX-only cut. Write a short "pick a track" note and `LICENSES.md`.
6. **QA.** `ffprobe` (duration, fps, codec, pix_fmt); contact sheet of sampled frames; OCR the frames (tesseract) for typos, stale numbers and old names; `blackdetect` / `freezedetect`; logo check. Optional: a creative-director review pass by a second agent.
7. **Deliver and wait.** Copy MP4s, cover and captions to a delivery folder. Put cover + caption in the design tool for review (Canva MCP takes images, not MP4/MOV) and send the MP4 itself as a file. Do not re-render until the owner gives direction.

Render, mux and QA sketch (run the renderer with `nice -n 10 node render.mjs`):

```js
// render.mjs: seek, screenshot, pipe to ffmpeg
import { chromium } from "playwright"
import { spawn } from "node:child_process"
const FPS = 30, MS = 30000, W = 1080, H = 1920
const ff = spawn("ffmpeg", ["-y", "-f", "image2pipe", "-framerate", `${FPS}`, "-i", "-",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-threads", "2",
  "-movflags", "+faststart", "silent.mp4"], { stdio: ["pipe", "inherit", "inherit"] })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H } })
await page.goto(new URL("./film.html", import.meta.url).href)
for (let f = 0; f < (MS / 1000) * FPS; f++) {
  await page.evaluate((ms) => window.renderAt(ms), (f * 1000) / FPS)
  if (!ff.stdin.write(await page.screenshot({ type: "png" }))) await new Promise((r) => ff.stdin.once("drain", r))
}
ff.stdin.end(); await browser.close()
```

```sh
ffmpeg -i silent.mp4 -i mix-A.wav -c:v copy -c:a aac -b:a 192k -af loudnorm=I=-14:TP=-1.5 -shortest promo-A.mp4
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt:format=duration promo-A.mp4
ffmpeg -i promo-A.mp4 -vf "blackdetect=d=0.5,freezedetect=d=1" -f null - 2>&1 | grep -E "black_|freeze_"
```

## Variants

- **App intro, Apple style**: product UI, big type, beat-synced cuts.
- **System showcase** in both 16:9 and 9:16, GSAP timelines.
- **Weekly reel from approved posters** (9:16 or 4:5, 7-30s, no new shoot): animate layer by layer (poster-motion with music + SFX) or a PIL slideshow left silent so trending audio can be added in the app. First frame doubles as the grid thumbnail.
- **Audio-only update**: re-mux a new track onto an existing silent MP4.

## Pitfalls

- **AI video generator out of credit or not permitted; some code-video frameworks need a company licence.** Guard: plain HTML + Playwright + ffmpeg has no licence or credit dependency.
- **Design tools reject MP4/MOV uploads, so review splits.** Guard: cover + caption in the design tool, MP4 via file share; say so up front.
- **Social schedulers have no music picker, and design-tool APIs cannot add audio; a scheduled reel goes out silent.** Guard: mux audio into the MP4 unless the plan is trending audio added in-app by hand.
- **Wrong genre (jazz for a corporate system) rejected.** Guard: propose 2-3 genres tied to the audience before composing.
- **Licence traps.** Some royalty-free tracks are registered for Content ID; free tiers can exclude organisations; platform audio libraries only cover their own platform. Guard: check each track's terms, record source and licence in `LICENSES.md`.
- **TTS or speech tools cannot make music or SFX.** Guard: synth in code or use licensed tracks.
- **Heavy render while the machine is under load.** Guard: `nice -n 10`, 2 threads, or render off-hours.
- **Dev server HMR disrupts frame capture.** Guard: always capture from a production build.
- **LIVE / Today badges and old sample numbers stuck in the film.** Guard: freeze the clock at capture; OCR the frames before delivery.
- **zsh reads `$var:l` inside an ffmpeg filter as a modifier.** Guard: brace variables, `${var}`.
- **Reel composer: no alt-text field, video showing twice after upload.** Guard: check the draft post before scheduling.
- **Re-rendering on guesses burns time.** Guard: wait for explicit direction after delivery.

## Done when

- [ ] Concept, durations, aspects and CTA agreed before rendering
- [ ] Footage from a production build or approved posters, dates and IDs safe
- [ ] Every layer driven by time; render reproducible with one command
- [ ] `ffprobe` clean, no black or frozen stretches, OCR text correct
- [ ] 2-3 audio versions at about -14 LUFS, muxed, with `LICENSES.md`
- [ ] Cover, captions and MP4s delivered; owner picked a version

## Composes with

- **maji-app-capture**: produces the real-app footage.
- **maji-ui-review**: locks brand fonts and palette used in the film.
- **maji-poster-batch**: approved posters become reel source material.
- **maji-meta-schedule**: schedules the finished reel (audio already muxed).
- **maji-mode**: discuss mode for the concept; pause after delivery.
- **maji-review**: check `render.mjs` and audio scripts before batch renders.

---

*`maji-code-video` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
