---
name: maji-video-gen
description: Produce short AI-generated videos end to end. Lock the objective and a timestamped shot list (A-roll and B-roll), write a prompt pack per shot, approve stills before spending video credits, generate takes one job at a time with a generator the owner allows (for example Higgsfield), pick takes, add music and SFX in 2-3 mixes for the owner to choose, QA every frame, then export 9:16 (plus 16:9 or 4:5) with cover and caption. Use when someone says "make an AI video", "prompt pack by timestamp", "animate this still", "same face in every shot", "AI news anchor clip" or "video for the hackathon", or in casual Malay "buat prompt ikut timestamp", "jadikan gambar ni video", "nak muka sama setiap shot". Not for code-rendered films (use maji-code-video) or transcription (use maji-video-transcribe).
metadata:
  tier: workflow
  category: content
  version: "1.0.0"
---

# AI Video Generation

Turn one objective into short AI-generated clips that keep the same look across shots, then cut, score, check and export them. Final output: MP4 per ratio (9:16, plus 16:9 or 4:5 when asked), audio mixes A/B/C, a cover image, the post caption, `prompts-log.md`, `continuity.md` and `LICENSES.md`.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-video-gen.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- **Use:** ads and teasers, AI presenter or news-anchor segments, contest and hackathon entries, B-roll for a bigger edit, animating approved stills, any scene that cannot be filmed or captured.
- **Not:** promo films built from real app UI or approved posters with no generator (use `maji-code-video`, which is also the fallback when credits run out or the owner rules the generator out); turning existing video into text (use `maji-video-transcribe`); editing real footage (use a video editor).

## Steps

1. **Check access before anything else.** Ask which generators the owner allows (owners do rule tools out by name), check the credit balance and plan limits, and confirm which approved reference photos you may use. No credits or no permission: stop and offer `maji-code-video`.
2. **Lock the objective (discuss mode, no prompts yet).** Concept, audience, duration (short entries often run 30 to 45s), ratios, style, scene list and CTA (no domain in the CTA if the site is not live yet). For a contest, write a tactical brief first (rules, judging rubric, theme, time plan, checklist) and shape the entry to the rubric.
3. **Shot list by timestamp.** Split A-roll (presenter or main action) from B-roll (supporting shots), one job per shot. Columns: `#, time, A/B, job, subject, framing, camera, motion, duration, ratio, overlay, voice line`. Headlines, lower thirds and logos are overlays for the edit, never part of the prompt.
4. **Write the prompt pack, one block per shot.** Keep what the frame looks like (subject, wardrobe, setting, framing, light) apart from what moves (action, camera, end state), so a failure can be fixed in one part. Add the settings the tool exposes (duration, ratio, start image; tools differ, so check each one's own controls) and an avoid list. Repeat the continuity anchors (face, hair, wardrobe, palette) in every block.
   ```text
   SHOT 2 | 0:04-0:08 | A-roll | job: headline | start image: [approved still ID] | 9:16 | 4s
   Look: presenter, [wardrobe anchors], medium close-up, [setting], [lighting].
   Motion: natural blink, subtle head turn to camera, steady eye contact, camera steady.
   Avoid: on-screen text, logos, extra people, face or outfit change.
   Overlay (edit): [headline]. Voice: "[line]". Cut on the beat.
   ```
5. **Make and approve the stills first.** Generate start frames one at a time with an image model (see `maji-image-gen`), or use approved photos, posters or renders. Identity comes from the face reference only; "no text or logos"; leave room for overlays. QA at full size against the reference (face, age, hands). The owner approves stills before any video credit is spent. Record each still's ID and the continuity anchors in `continuity.md`.
6. **Generate takes, one job at a time.** Use the approved still as the start image when the tool accepts one and identity matters; prompt-only shots are for scenes with no face. 2 to 3 takes per shot, respecting cooldowns and quotas. Log every take in `prompts-log.md` (shot, tool, prompt, settings, file, verdict).
7. **Pick and fix.** Grab a sample frame per take with ffmpeg into a contact sheet and pick per shot. Fix only the failing part: wrong face or look, redo the still or the look text; right look but wrong movement, change only the motion text. Never regenerate on a guess.
8. **Assemble.** Trim and join the picked takes (a video editor or ffmpeg concat), add overlays and logo in the edit, export a silent master and a `cuts.txt` with hit points.
9. **Music and SFX in 2-3 mixes.** Propose 2 to 3 genres tied to the audience before mixing. Music: royalty-free tracks with checked terms, or composed in code (numpy/scipy synth, MIDI plus FluidSynth). SFX at the hit points, licensed or synthesized. Voice lines from a TTS tool or a recording. Duck music under voice and SFX, normalize to about -14 LUFS, mux with `-c:v copy` so the video stream is untouched. Deliver mixes A/B/C, a `pick-a-track.md` note and `LICENSES.md`; the owner picks one.
10. **QA every frame that ships.** Faces match the reference and do not morph between cuts, hands, garbled lettering or fake logos inside the frame, logo and palette in the overlays, every claim in voice or overlay traced to a source. Technical: `ffprobe` (duration, fps, codec), sample frames, `blackdetect` and `freezedetect`, OCR the overlays for typos.
11. **Export per ratio.** 9:16 (1080x1920) for reels and stories, 16:9 (1920x1080) or 4:5 (1080x1350) when asked; libx264, yuv420p, bt709, `+faststart`. Reframe each ratio on purpose, never a blind center crop; in 9:16 keep faces and text between y=250 and y=1580. The first frame doubles as the grid cover; also export `cover.png`. Subtitles, if wanted: from the script, or transcribed with `maji-video-transcribe`, then proofread. Write the post caption separately.
12. **Deliver and wait.** MP4s, cover, caption, prompt log and licences in one delivery folder. Design tools often reject MP4/MOV uploads: review cover and caption there and send the MP4 as a file or to the owner's phone. Do not re-render until the owner gives direction.

## Variants

- **Presenter or news-anchor segment:** A-roll presenter, B-roll under each spoken line; believability over spectacle (subtle motion, steady framing); no inference stated as fact.
- **Contest or hackathon entry:** tactical brief before the day; live notes on the day, each timestamped with type, source, note, why it matters and next action; a 30 to 45s prompt pack by timestamp.
- **Animate approved stills or posters:** generate from the artwork without its text, then put the text back as an overlay; or skip the generator and animate the layers in code with `maji-code-video`.
- **Prompt builder:** once a pack structure works, turn it into a small form-based builder (one field per step, saved in localStorage, installable as a PWA) so the next video starts from the same skeleton.

## Pitfalls

| Failure | Guard |
|---|---|
| Credits run out, or the owner rules the generator out mid-project | Check balance and permission at step 1; fall back to `maji-code-video` |
| Face, wardrobe or background drifts between shots | One reference per identity, an approved still per shot, continuity anchors repeated in every block |
| Video credits spent on looks nobody approved | Owner approves stills before any video run |
| Garbled lettering and fake logos inside generated frames | "No text or logos" in every prompt; all text added as overlays; frame check and OCR in QA |
| Parallel jobs hit quota or cooldown | Queue one job at a time |
| Generator connector audio is speech-only, so no music or SFX from it | Music from licensed tracks or code, SFX separately |
| Wrong genre rejected after the mix | Propose genres tied to the audience before mixing |
| Licence traps: free-library tracks registered for Content ID, free tiers excluding organisations, platform-only libraries, render frameworks needing a company licence | Check each source's terms; record source and licence in `LICENSES.md` |
| Social schedulers have no music picker, so the reel goes out silent | Mux audio into the MP4 unless trending audio will be added in-app by hand |
| Design tool rejects the MP4/MOV upload | Cover and caption in the design tool, MP4 sent as a file or to the phone |
| Blind crop to 9:16 cuts heads and overlays | Plan ratios in the shot list, frame with headroom, check the safe zone per ratio |
| Encoding hogs the laptop while it is under load | Run ffmpeg with `nice -n 10` and `-threads 2` |
| zsh reads `$var:l` inside an ffmpeg filter as a modifier | Brace variables: `${var}` |
| Stale dev caches break the prompt builder during a crunch | Clear the framework build cache before the demo; keep one working build folder |
| Regenerating on guesses burns credits | Wait for direction; change only the failing part |

## Done when

- [ ] Allowed generator, credits and approved reference photos confirmed
- [ ] Objective, shot list and ratios agreed before any prompt ran
- [ ] Every shot has look, motion, settings and avoid parts in the pack
- [ ] Stills approved before video credits; every take logged in `prompts-log.md`
- [ ] QA passed: faces, hands, in-frame text, logo, `ffprobe`, black and freeze checks, OCR
- [ ] 2-3 mixes at about -14 LUFS with `LICENSES.md`; owner picked one
- [ ] Ratio exports, cover and post caption delivered; nothing re-rendered without direction

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
