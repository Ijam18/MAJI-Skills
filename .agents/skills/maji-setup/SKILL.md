---
name: maji-setup
description: First-run setup for a MAJI Skills agent folder. Interview the user in short rounds, write me/profile.md from profile.example.md, create me/overrides/ and me/learned.md, then report which skills now have what they need. Also updates an existing profile section by section. Use when the user says "run maji-setup", "set me up", "set up my agent", "update my profile", "my stack changed", "change my brand", or in Malay "jom setup", "setup agent aku", "kemaskini profile aku". Run it too when a skill finds me/profile.md missing and the user agrees.
metadata:
  tier: experimental
  category: meta
  version: "1.0.0"
---

# maji-setup: first-run profile

Turns a fresh clone into the user's own agent: one short interview, one profile file every skill can read. Output: `me/profile.md`, an empty `me/overrides/`, and `me/learned.md` with its first entry.

## Step 0: your context

Read `profile.example.md` (the template) and `me/profile.md` if it already exists. If it exists, this is an update: only ask about the sections the user wants to change.

## When to use / when not
- **Use:** first session in a new clone; the user's stack, brand, folders or tools changed; a skill keeps asking the same question.
- **Not:** one-off preferences for a single task (just follow them), or changing how one skill behaves (write `me/overrides/<skill>.md`, see `maji-learn`).

## Steps
1. **Check the state.** Does `me/profile.md` exist? If yes, show its section headings and ask which to update. If no, say you will ask a few questions in rounds and that any answer can be skipped.
2. **Interview in rounds, not a form.** At most 3 questions per round, in this order:
   - Round 1, Identity + Voice and language: name, role, languages, tone, words or styles to avoid.
   - Round 2, Stack + Folders: default stack, test tools, package manager; inbox, outbox, assets and notes folders.
   - Round 3, Brand + Tools and credits: brand file or colours, fonts, logo; tools allowed freely; tools that need approval first; spend limits.
   - Round 4, only if the user does client work: Money and tax, Ports.
   Offer a sensible default in brackets for each question, so a short reply like "ok" is enough.
3. **Never ask for secrets.** For keys and tokens ask only where they live (env file name, keychain entry). If the user pastes a secret, do not save it, and tell them to rotate it.
4. **Write `me/profile.md`** in the agent folder. Start from `profile.example.md` (in the kit folder; when the kit was linked into an existing folder, that is `.maji-skills/profile.example.md`) and keep its section headings exactly, because every skill's Step 0 looks for those names. Fill what was answered; leave the rest as blank bullets.
5. **Create the rest of `me/`.** An empty `me/overrides/` folder, and `me/learned.md` with a first line: `YYYY-MM-DD: profile created by maji-setup (sections filled: ...)`.
6. **Check it stays private.** Run `git check-ignore me/profile.md`. It must print the path. If it prints nothing, add `me/` to `.gitignore` before anything else.
7. **Report.** One short table: section, filled or empty, and which skills use it (Brand: brand-pdf, poster-batch, image-gen; Money and tax: offer; Folders: doc-fill-sign, brand-pdf; Ports: dev-up). End with one suggestion for what to do next.

## Pitfalls
- **Renamed headings break every skill silently.** Keep the template headings word for word.
- **Interrogating the user.** Twenty questions in one message gets skipped. Rounds of 3 with defaults get answered.
- **Overwriting answers on update.** Show the old value and confirm before replacing it.
- **Saving a pasted secret.** Never. Record only where it lives.
- **Profile outside `me/`.** Anything personal written elsewhere in the repo can get committed by accident.

## Done when
- [ ] `me/profile.md` exists with the template headings intact.
- [ ] `git check-ignore me/profile.md` prints the path.
- [ ] `me/overrides/` and `me/learned.md` exist.
- [ ] The user saw which sections are filled and what to do next.

## Composes with
- `maji-learn`: grows new skills and overrides once the profile exists.
- `maji-brand-kit`: builds the brand file the Brand section points to.
- `maji-mode`: applies the tone and language set here.
