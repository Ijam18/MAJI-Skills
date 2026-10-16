---
name: maji-event-notes
description: "Take live notes at events, talks, meetings, workshops and hackathons, then turn them into a digest. Append-only timestamped capture, a speaker and session index, decisions, action items with owner and date, people to follow up, consent before any recording, follow-up message drafts, and a post-event digest grouped by signals, people, deadlines, opportunities and next actions. Use when someone says \"take notes\", \"log this\", \"capture this\", \"note this down\", \"meeting minutes\", \"recap the event\", \"what were the action items\", \"draft follow-ups to the people I met\". Not for transcribing a recorded video or audio file (use maji-video-transcribe)."
metadata:
  tier: workflow
  category: productivity
  version: "1.0.0-lite"
---

# maji-event-notes: Live Event Notes

Capture the signal while it happens, decide later. Final output: one dated, append-only notes file, an action list with owners and dates, follow-up drafts, and a one-page digest.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Folders, Voice and language). If `me/overrides/maji-event-notes.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use at a conference, talk, meetup, workshop, hackathon, client meeting or internal standup, live or right after.
- Use when the user sends rough fragments from a venue and wants them kept.
- Not for transcribing a recording file (maji-video-transcribe). Not for long-document summaries (maji-summary).

## Steps

1. **Open the file.** `notes/events/YYYY-MM-DD-<event-slug>.md` (or the profile's notes folder).
2. **Consent before recording.** Before any audio or video recording or AI note-taker joins, confirm the organiser's rule and ask the people present.
3. **Capture fast, save first.** If the user is moving, append immediately and clarify later.
4. **Compress, do not transcribe.** Conclusions over filler, deadlines and constraints over chatter, exact numbers and dates when said.
5. **Keep the session index.** At the top of the file: time, session title, speaker, slides or link, one-line takeaway.
6. **People.** Name as given, role, organisation, how you met, what was promised, preferred channel.
7. **Decisions and actions (meetings).** Decisions get their own entries with who decided.
8. **Digest on demand or at the end.** Read the whole file, then output one page:
9. **Follow-up drafts.** One short message per person or group, referencing the specific conversation and the promise, in the user's voice and language.
10. **Hand off actions.** Move action items to the user's task tracker or calendar if asked; tick them in the digest as they close.

## Composes with

- **maji-summary**: compress a long talk transcript before adding it as entries.
- **maji-video-transcribe**: when a consented recording exists.
- **maji-offer**: turn an event opportunity into a quote or proposal.
- **maji-session-handoff**: carry open actions into the next work session.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-event-notes` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
