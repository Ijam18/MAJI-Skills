---
name: maji-video-transcribe
description: Turn a list of videos into clean transcripts and a digest. Curate a manifest, pull captions or audio with yt-dlp, chunk audio with ffmpeg, transcribe with Whisper (resumable, merged by offset), then digest into original articles or verbatim quote signals, with a leak check before commit. Use for a knowledge base from tutorials, a sentiment or signal corpus from commentary, or batch analysis of channels. Triggers: "transcribe these videos", "pull the captions", "turn this channel into notes", "build a knowledge base from YouTube", "extract quotes from these videos". Malay: "transcribe video ni", "tukar video jadi nota", "tarik caption YouTube".
metadata:
  tier: workflow
  category: content
  version: "1.0.0-lite"
---

# maji-video-transcribe: Video to Text to Knowledge

Turns a curated set of videos into `transcript.json` per video plus a digest (original articles, or `signals.json` of verbatim quotes with timestamps), without leaking source links or creator names into the product.

---

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-video-transcribe.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

**Use** when the knowledge you need lives in talks, tutorials, livestreams or commentary and you want text you can search, analyse or rewrite.

**Not** for a single short clip you can just watch, for republishing someone else's video, or for anything that must run unattended on a schedule while it still depends on a logged-in browser session (fix that first, see Pitfalls).

---

## Steps

1. **Curate.** Write `manifest.json`: id, url, topic, language, duration.
2. **Captions first.** `yt-dlp --skip-download --write-auto-subs --sub-langs <lang> -o "%(id)s.%(ext)s" <url>`.
3. **Audio path** for videos with no captions (common for non-English languages): `yt-dlp -x --cookies-from-browser <browser> <url>` using a browser profile that is logged in.
4. **Chunk.** `ffmpeg -i in.m4a -ac 1 -c:a libopus -b:a 24k -f segment -segment_time 840 chunk_%03d.ogg`.
5. **Transcribe.** Whisper locally (whisper.cpp, faster-whisper) or a hosted API with a failover provider.
6. **Clean.** Strip rolling-caption duplicates from `.vtt`, normalise whitespace, group transcripts by topic.
7. **Digest.**
8. **Human pass.** Analyst or owner re-tunes the downstream artefact (wiki page, forecast, report) using the digest.
9. **Leak check, then ship.** Grep the output for URLs, video ids, channel names and handles.

## Composes with

- **maji-real-data**: same verify and provenance rules when transcripts feed a dataset.
- **maji-scheduled-job**: only after the pipeline runs headless without a browser session.
- **maji-debug**: for 403s, empty captions or broken chunk merges.
- **maji-review**: review the digest prompts and leak check before the PR.
- **maji-commit**: commit message for the PR.
- **maji-brand-pdf**: when the digest goes out as a briefing or report PDF.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-video-transcribe` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
