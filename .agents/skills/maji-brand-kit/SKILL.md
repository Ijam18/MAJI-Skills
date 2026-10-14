---
name: maji-brand-kit
description: Lock the brand guideline before building anything. Discovery questions, tokens (colours with roles, type scale, logo lockups and clear space, voice, do and don't), the kit in the design tool (Canva brand kit, guide page and templates, or a Bloom brand) plus a machine-readable brand.json, then apply it to the app (tokens, logo, favicon, OG images), posters, PDFs and social profiles, and run a brand lint before shipping. Use when someone says "let's start with the brand guideline", "set up our brand kit", "connect to Canva and use the brand there", "make this design our brand identity", "transform the site to match the brand", or in Malay "jom bincang brand guideline dulu", "guna brand guideline dekat canva tu", "jadikan ni brand identity". Not for producing a poster batch (use maji-poster-batch).
metadata:
  tier: workflow
  category: content
  version: "1.0.0-lite"
---

# maji-brand-kit: Brand Guideline First

One locked brand, stored where people and code can both read it, applied everywhere, checked before shipping. Final output: a guide page in the design tool, `brand.json` in the repo, a `/brand` page or brand section in the app, derived assets (logo files, favicon, profile picture, cover), and a passing brand lint.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-brand-kit.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- **Use:** a new project or account before its first app screen, poster or PDF; a rebrand; turning a favourite design into the identity; bringing an existing brand (draft PDF, design-tool brand kit, client guideline) into a codebase; setting up social profiles.
- **Not:** the poster batch itself (`maji-poster-batch`), one PDF on an already locked brand (`maji-brand-pdf`), UI layout work once the brand is locked (`maji-ui-review`), or a client's brand you have no right to change (apply it, do not redesign it).

## Steps

1. **Discover (discuss mode, nothing built yet).** Whose brand is it?
2. **Connect the design tool.** Paste the design link.
3. **Propose, then lock.** One guideline with references and 1 to 2 rendered samples (a poster, an app header).
4. **Write the tokens** to `brand.json`:
5. **Build the kit in the design tool.**
6. **Apply to the app.** Generate CSS variables or the Tailwind theme from `brand.json`; export logo, favicon and web manifest icons from the design tool; bundle the brand TTFs for OG image rendering; add a `/brand` page.
7. **Apply to posters, PDFs and social.** Poster renderers and PDF templates read `brand.json` (`maji-poster-batch`, `maji-brand-pdf`).
8. **Brand lint before shipping.** Run on every output:

## Composes with

- `maji-propose`: discovery and the lock decision.
- `maji-ui-review`: applies the tokens to app screens and proves them.
- `maji-image-gen`: briefs and QA use the swatch and do/don't list.
- `maji-poster-batch` and `maji-meta-schedule`: posters built on the kit, then scheduled.
- `maji-brand-pdf`: PDFs on the same tokens and fonts.
- `maji-app-capture` and `maji-code-video`: screens and videos framed in the brand.

*`maji-brand-kit` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

