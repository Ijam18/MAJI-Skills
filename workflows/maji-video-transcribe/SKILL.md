---
name: maji-video-transcribe
description: Turn a list of videos into clean transcripts and a digest. Curate a manifest, pull captions or audio with yt-dlp, chunk audio with ffmpeg, transcribe with Whisper (resumable, merged by offset), then digest into original articles or verbatim quote signals, with a leak check before commit. Use for a knowledge base from tutorials, a sentiment or signal corpus from commentary, or batch analysis of channels. Triggers: "transcribe these videos", "pull the captions", "turn this channel into notes", "build a knowledge base from YouTube", "extract quotes from these videos". Malay: "transcribe video ni", "tukar video jadi nota", "tarik caption YouTube".
---

# maji-video-transcribe: Video to Text to Knowledge

Turns a curated set of videos into `transcript.json` per video plus a digest (original articles, or `signals.json` of verbatim quotes with timestamps), without leaking source links or creator names into the product.

---

## When to use / when not

**Use** when the knowledge you need lives in talks, tutorials, livestreams or commentary and you want text you can search, analyse or rewrite.

**Not** for a single short clip you can just watch, for republishing someone else's video, or for anything that must run unattended on a schedule while it still depends on a logged-in browser session (fix that first, see Pitfalls).

---

## Steps

1. **Curate.** Write `manifest.json`: id, url, topic, language, duration. For "find N channels on topic X", discover with search or Playwright, then freeze the list. Decide the output mode now: **knowledge** (rewrite into original articles) or **signals** (verbatim quotes for analysis).
2. **Captions first.** `yt-dlp --skip-download --write-auto-subs --sub-langs <lang> -o "%(id)s.%(ext)s" <url>`. Then check that a `.vtt` file actually exists for each id. `--ignore-errors` reports success even when no caption was written.
3. **Audio path** for videos with no captions (common for non-English languages): `yt-dlp -x --cookies-from-browser <browser> <url>` using a browser profile that is logged in. Without cookies, expect HTTP 403.
4. **Chunk.** `ffmpeg -i in.m4a -ac 1 -c:a libopus -b:a 24k -f segment -segment_time 840 chunk_%03d.ogg`. About 14 minutes of mono Opus stays under a 4 MB upload cap. Some hosted Whisper endpoints reject WAV / PCM, so send OGG / Opus. A 6 hour livestream becomes many chunks: budget the time.
5. **Transcribe.** Whisper locally (whisper.cpp, faster-whisper) or a hosted API with a failover provider. Cache by `video_id + chunk_index`, skip chunks already done, and merge segments into one transcript by adding each chunk's offset to its timestamps. Call the transcription API from a script, not a UI.
6. **Clean.** Strip rolling-caption duplicates from `.vtt`, normalise whitespace, group transcripts by topic.
7. **Digest.**
   - Knowledge: one agent per topic writes an original article from that topic's transcripts. Re-express facts in your own words: no quotes, links or creator credits in the output.
   - Signals: an LLM extracts verbatim quotes into `signals.json`, each tied to its `video_id` and timestamp.
   - Spot-check a sample of outputs against the transcript before trusting the batch.
8. **Human pass.** Analyst or owner re-tunes the downstream artefact (wiki page, forecast, report) using the digest.
9. **Leak check, then ship.** Grep the output for URLs, video ids, channel names and handles. Transcripts and audio stay gitignored. Open a PR with a short audit doc (counts, coverage, method); the source list stays private.

---

## Variants

- **Knowledge base from tutorials:** captions route, topic grouping, one agent per topic, original articles, no source credits shown in the app.
- **Signal / sentiment corpus:** audio route, verbatim quotes with timestamps, then a scorer or lexicon downstream.
- **Batch analysis through your own transcription service:** a script posts each chunk to the service's transcribe endpoint, then digests.
- **Clip and shorts tool:** paste a link, fetch (the fetcher caps source length, about 45 to 60 min), transcribe with word timestamps, LLM proposes highlights + summary, edit captions (karaoke style, bilingual), export MP4 with burned-in subtitles or SRT. Treat as unproven until one real end-to-end export has been checked.

---

## Pitfalls

| Failure seen in real runs | Guard |
|---|---|
| `--ignore-errors` reports success with no caption written | Assert a `.vtt` exists per id; fall back to the audio path |
| HTTP 403 from YouTube without a logged-in session | `--cookies-from-browser`; for servers, export `cookies.txt` and store it as a secret (base64), never in the repo |
| Cookies for the fetch account expire | Re-export and update the secret; make the fetcher fail loudly on 403 |
| Endpoint rejects WAV / PCM; upload route capped at 4 MB | OGG / Opus mono, about 14 minute chunks |
| Livestreams of 6+ hours take a long time | Resumable cache per chunk; run in background; report progress |
| Transcription only works with a local dev server plus an auth bypass, so it cannot run on cron | Expose a CLI or API path before scheduling anything |
| No auto-captions for some languages | Go straight to audio + Whisper for those |
| Copyright risk if links, credits or quotes leak into the product | Leak grep before every commit; rewrite, do not republish |
| Cost spikes from hosted video connectors | Budget cap and a kill switch per connector |
| Source resolution drops on long videos (720p, then lower); full download to the browser stalls; fetcher runs out of memory under 2 GB RAM | Stream server-side, size the fetcher, do not promise 1080p from a link |

---

## Done when

- [ ] Every manifest id has a transcript or an explicit failure reason
- [ ] Caption files verified on disk, not trusted from exit codes
- [ ] Transcripts merged with correct offsets (spot-check one timestamp per long video)
- [ ] Digest sampled against transcripts, no invented facts
- [ ] Leak grep clean: no URLs, ids or creator names in shipped output
- [ ] Transcripts and audio gitignored; audit doc written

---

## Composes with

- **maji-real-data**: same verify and provenance rules when transcripts feed a dataset.
- **maji-scheduled-job**: only after the pipeline runs headless without a browser session.
- **maji-debug**: for 403s, empty captions or broken chunk merges.
- **maji-review**: review the digest prompts and leak check before the PR.
- **maji-commit**: commit message for the PR.
- **maji-brand-pdf**: when the digest goes out as a briefing or report PDF.

---

*`maji-video-transcribe` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
