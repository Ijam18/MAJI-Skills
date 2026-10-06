---
name: maji-brand-kit
description: Lock the brand guideline before building anything. Discovery questions, tokens (colours with roles, type scale, logo lockups and clear space, voice, do and don't), the kit in the design tool (Canva brand kit, guide page and templates, or a Bloom brand) plus a machine-readable brand.json, then apply it to the app (tokens, logo, favicon, OG images), posters, PDFs and social profiles, and run a brand lint before shipping. Use when someone says "let's start with the brand guideline", "set up our brand kit", "connect to Canva and use the brand there", "make this design our brand identity", "transform the site to match the brand", or in Malay "jom bincang brand guideline dulu", "guna brand guideline dekat canva tu", "jadikan ni brand identity". Not for producing a poster batch (use maji-poster-batch).
metadata:
  tier: workflow
  category: content
  version: "1.0.0"
---

# maji-brand-kit: Brand Guideline First

One locked brand, stored where people and code can both read it, applied everywhere, checked before shipping. Final output: a guide page in the design tool, `brand.json` in the repo, a `/brand` page or brand section in the app, derived assets (logo files, favicon, profile picture, cover), and a passing brand lint.

## Step 0: your context

Read `me/profile.md` if it exists (Brand, Voice and language, Tools and credits, Folders). If `me/overrides/maji-brand-kit.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- **Use:** a new project or account before its first app screen, poster or PDF; a rebrand; turning a favourite design into the identity; bringing an existing brand (draft PDF, design-tool brand kit, client guideline) into a codebase; setting up social profiles.
- **Not:** the poster batch itself (`maji-poster-batch`), one PDF on an already locked brand (`maji-brand-pdf`), UI layout work once the brand is locked (`maji-ui-review`), or a client's brand you have no right to change (apply it, do not redesign it).

## Steps

1. **Discover (discuss mode, nothing built yet).** Whose brand is it? Ask about audience, vibe, colours and fonts, plus references the owner likes and dislikes; or read what exists: a brand draft PDF, the design tool's brand kit, the owner's favourite design. One question at a time when unclear.
2. **Connect the design tool.** Paste the design link. Canva connector: `resolve-shortlink` for short links, `read-design` for the page index, `list-brand-kits` for existing kits. If the connector is missing, the user re-authenticates (Claude Code: `/mcp`. Other agents: the agent's own MCP settings screen), then reload and start a new session (connectors load at session start). Do not add a second local server for the same tool; it can shadow the hosted connector. Bloom: `list_brands` / `get_brand` if a brand already lives there.
3. **Propose, then lock.** One guideline with references and 1 to 2 rendered samples (a poster, an app header). Choose fonts now, not after the first batch. The owner pivots fully or says "lock". Record the latest decision, because choices flip.
4. **Write the tokens** to `brand.json`:
   ```json
   {
     "name": "Brand",
     "colors": [
       { "token": "bg", "hex": "#FFFFFF", "role": "page background (true white)" },
       { "token": "ink", "hex": "#111111", "role": "body text" },
       { "token": "accent", "hex": "#2F6BFF", "role": "CTA and links only" }
     ],
     "type": { "heading": "Heading Font", "body": "Body Font", "scalePx": [48, 32, 24, 18, 14], "files": ["fonts/heading.ttf", "fonts/body.ttf"] },
     "logo": { "primary": "logo/primary.svg", "mono": "logo/mono.svg", "mark": "logo/mark.svg", "clearSpace": "0.5 x mark height", "minWidthPx": 96 },
     "voice": { "tone": ["plain", "warm"], "cta": "subtle, one per piece" },
     "do": ["wordmark as an image file"], "dont": ["cream backgrounds", "retyping the wordmark"]
   }
   ```
5. **Build the kit in the design tool.**
   - Canva: the brand kit itself is set up in the Canva UI (the connector reads it); add a brand guide page, a text-kit master page for editable text styles, and brand templates (`create-brand-template-draft`, `publish-brand-template`) when the team reuses layouts.
   - Bloom (if the team uses it): onboard or update the brand there so it matches `brand.json`.
   - Write house rules for the tool (which design new pages go into) in a rules file the next session reads (Claude Code: CLAUDE.md. Other agents: AGENTS.md).
6. **Apply to the app.** Generate CSS variables or the Tailwind theme from `brand.json`; export logo, favicon and web manifest icons from the design tool; bundle the brand TTFs for OG image rendering; add a `/brand` page. Verify with desktop and mobile screenshots (`maji-ui-review`).
7. **Apply to posters, PDFs and social.** Poster renderers and PDF templates read `brand.json` (`maji-poster-batch`, `maji-brand-pdf`). Profiles: bio (max 150 characters, enquiry email, link with UTM), name, category, profile picture and cover from the guide (cover inside its safe area, e.g. 1640x720). The owner approves first; browser scripts run dry first, then save and screenshot as proof.
8. **Brand lint before shipping.** Run on every output:
   - Colours: `grep -rnoE '#[0-9A-Fa-f]{6}' src` and compare against `brand.json`; sample rendered pixels on posters.
   - Fonts: only brand families; no default fallback in OG images or PDFs.
   - Logo: wordmark is the image file, clear space kept, not clipped (pixel check on the footer).
   - Copy: voice rules, no em-dash, no banned words; QR codes and links point to the real domain.

## Variants

- **Existing brand:** read the PDF or kit, extract tokens, confirm them with the owner; do not reinvent.
- **From a favourite design:** extract palette, fonts, logo sticker or footer, card style and CTA from that design, then build the guide and text kit from it.
- **Social rebrand:** profile picture, cover, bio, name and category in one pass; app-only steps handed to the owner.
- **Site transform:** the brand already lives in the design tool; export logo and favicon from it, then restyle the site screen by screen with `maji-ui-review`.

## Pitfalls

| Failure | Guard |
|---|---|
| Generic font pairing (condensed display plus mono) reads as "AI made" | Propose a distinctive pairing during discovery |
| Colour drift (cream instead of true white) | Exact hex with a role per token; record the latest decision |
| Brand font missing from the repo, so OG images use a default font | Bundle the TTFs (e.g. from fontsource) and load them in the renderer |
| Wordmark retyped as live text | Use the logo image file; lint for it |
| CSS variables inside inline styles (gradients) do not resolve under some bundlers | Hardcode or move to a class; check the screenshot |
| QR poster generated with a placeholder domain | Regenerate with the real domain before print |
| Design tool API cannot set font family or letter spacing | Keep editable text in the text-kit master, or flatten text locally |
| Footer logo clipped after an image fill shifts the box | Reset the crop after every fill; pixel-check the logo |
| Local server for the same design tool hides the hosted connector (and may lack image generation) | One connector per tool; remove the extra, reload, new session |
| MCP config scoped to one project, so the next project has no connector | Re-add per project or use the account-level connector (Claude Code: user scope or a claude.ai connector. Other agents: the agent's own global MCP settings screen) |
| OAuth needs a human click; non-interactive sessions cannot | The owner authenticates, then continue |
| Social name changes are rate-limited (e.g. once per 14 days); link in bio is phone-app only; page name changes ask for the account password | Batch name changes; hand app-only and password steps to the owner |
| Page settings in an iframe reload after every edit | Re-query the frame after each save; dry-run the script first |
| Brand updated in the design tool, app logo and favicon left stale | Regenerate logo, favicon and manifest whenever the kit changes |

## Done when

- [ ] Owner said "lock" on the guideline in this session
- [ ] `brand.json`, the guide page and the design-tool kit agree on every token
- [ ] App tokens, logo, favicon, manifest and OG images updated, with screenshots
- [ ] Profiles updated and proven with screenshots, owner-only steps listed
- [ ] Brand lint passes on every output about to ship

## Composes with

- `maji-propose`: discovery and the lock decision.
- `maji-ui-review`: applies the tokens to app screens and proves them.
- `maji-image-gen`: briefs and QA use the swatch and do/don't list.
- `maji-poster-batch` and `maji-meta-schedule`: posters built on the kit, then scheduled.
- `maji-brand-pdf`: PDFs on the same tokens and fonts.
- `maji-app-capture` and `maji-code-video`: screens and videos framed in the brand.

*`maji-brand-kit` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
