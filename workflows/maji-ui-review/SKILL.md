---
name: maji-ui-review
description: Visual UI review loop for web apps and PWAs. Lock the brand or a native reference, build 2-3 clickable mockups, serve them to a real phone, tweak straight from the reviewer's screenshots, prove each change with headless desktop + mobile screenshots, then port in phases and polish copy, PWA, SEO and performance. Use when someone says "revamp this UI", "make it feel like a native app", "here's a screenshot, fix this", "make it mobile / PWA", "do a mockup first", "the page is slow", "remove the em-dashes", or in casual Malay "jom bincang UI ni", "buat mockup dulu", "tak cantik la, betulkan ni". Not for backend-only work or pixel-perfect handoff from a finished design file.
---

# maji-ui-review: UI Review Loop

Turn "it doesn't look right" into an approved, shipped UI. Final output: a UI the reviewer approved on a real device, with screenshot proof and a polish pass (copy, PWA, SEO, perf).

## When to use / when not

Use when:
- A UI is being created or revamped and the reviewer judges visually (screenshots, phone).
- Small tweaks arrive as "screenshot + one line" ("move this", "remove that button").
- A web app must feel native on a phone or install as a PWA.
- A page is slow, or copy needs a tone / punctuation / language sweep.

Not for:
- Logic bugs with no visual symptom (use maji-debug).
- Approved pixel-perfect specs where no review loop is needed.

## Steps

1. **Lock the brand or the reference first.** Ask brand questions (audience, vibe, colours) or read the existing brand kit (PDF, Canva brand kit via Canva MCP). For a native look, collect the real reference (OS login, a system app) plus screenshots of what the reviewer dislikes. Lock palette, fonts, logo, tone; store them as design tokens and a `/brand` page; apply to logo and favicon. Record the latest decision, because choices flip (white vs cream).
2. **Mockup 2-3 concepts before wiring anything.** Desktop + mobile. Options: a design-canvas artifact, a `/lab` route inside the app, Google Stitch. Borrow technical patterns from sibling projects but keep the visual DNA distinct. For native references, measure values from real assets; never invent a guideline that does not exist.
3. **Serve to a real phone.** LAN review (same Wi-Fi), `cloudflared tunnel --url http://localhost:3000` quick tunnel, or a Vercel preview. Default is localhost; open a tunnel only when asked. Use a preview deploy when auth, a QR code or someone else's phone is involved.
4. **Tweak from screenshots.** Reviewer sends screenshot + short instruction. Find the component and edit directly; no plan mode for small tweaks. One instruction, one commit. Add or update a test (unit or e2e) when behaviour changes. If a visual word is ambiguous ("overlay": tint or floating box?), confirm before coding.
5. **Prove it before saying done.** Playwright: log in with a test account, open the route, wait for network idle, screenshot desktop and mobile viewports. Maps: probe headless (source loaded, feature count), not just eyeballing. PDFs: `page.pdf()` then raster with pdftoppm or PyMuPDF and look at the pages. Compare against the reviewer's screenshot, fix, repeat.
6. **Port to the real app in phases** until the reviewer says the design is okay. Larger surfaces: generate 3 directions, judge, pick one; write a build order (step 0..N); patch in place instead of rewriting 2,000-line files; ship the visible win first; split big files into modules only once stable. When mockup and spec disagree, the approved mockup wins.
7. **Polish pass.**
   - Copy: sweep em/en dashes (replace with `: , ( )`), rewrite stiff or AI-sounding lines, language and tone per audience and channel, one language per UI locale, i18n parity test. Save the rule where future sessions read it.
   - PWA: manifest, versioned service worker (Serwist, vite-plugin-pwa or plain `sw.js`), safe-area insets, startup image, offline fallback. The install prompt is a product decision: never auto-trigger it.
   - Mobile fixes: scope them with media queries so desktop stays unchanged.
   - SEO: sitemap, robots, metadata, OG image, JSON-LD.
   - Assets: resize, WebP, PWA icons generated from an SVG source.
   - a11y: AA contrast, modal and popover focus, aria labels.
   - Perf: measure first (timing logs, query harness), rewrite the slowest query, cache hot data with single-flight + warm job, stream the shell and put heavy panels behind Suspense.

## Variants

- **Native-reference revamp**, phone-first (OS-style login, iOS-style app shell: bottom tabs on mobile, header + footer on desktop).
- **Admin surface overhaul** step by step: direction, build order, ship visible wins, then modularise.
- **Map / choropleth fix loop** from screenshots, verified by headless probe.
- **Prototype generator to PWA in one session**: write a short build brief (objective, target user, core flow), generate screens in Stitch, export HTML + screenshots into the repo, port them to components.
- **Client site polish**: speed, SEO/GEO, a11y, PWA.
- **Slow page**: measure, rewrite query, cache + warm + stream, friendly loading state with time estimate.
- **Copy sweep** across a site, PDF or captions, plus a guard so it stays clean.

## Pitfalls

- **Concept too close to another project, rejected.** Guard: state in one line what makes this concept visually different before showing it.
- **v1 looks like a settings form, not native.** Guard: study and measure the real reference before building.
- **Inputs under 16px make iOS Safari zoom.** Guard: 16px minimum on form fields.
- **PWA not full screen, animations gone after "Add to Home Screen".** Guard: test the installed app on a real device, not only the browser tab.
- **Stale service worker cache ("sw.js Failed to fetch").** Guard: version the SW; never cacheFirst API or admin data (stale data, PII on disk).
- **Quick tunnel URL is ephemeral; login fails on another phone.** Guard: auth redirect allowlist and cookies do not know the tunnel host; deploy a preview instead. Never put a tunnel URL on a QR or poster.
- **Some frameworks refuse a second dev server.** Guard: reuse the running server for screenshots.
- **Three wrong theories before finding the cause.** Guard: run a headless probe first, theorise second.
- **Local prod start with strict CSP over http shows a skeleton forever.** Guard: shoot against dev or the real prod URL. Headless also differs from real Chrome (print margins, dark theme).
- **Real credentials pasted into chat for testing.** Guard: create a dedicated test account.
- **Em-dash and mixed-language copy creep back with new generated text.** Guard: regex check in build or CI, i18n parity test. Sweep only em/en dashes, never plain hyphens in compound words.
- **Copy sweep over-corrects into stiff or AI-sounding text; machine-translated legal or privacy text ships as is.** Guard: short human sentences; a human reviews translated legal copy.
- **Mobile-only interaction bugs** (in-view counters stuck at 0 because of observer margins, taps lost without touch slop, tab switch glitches). Guard: test gestures on a mobile viewport and a real phone.
- **Prototype stores data only in localStorage; clearing site data wipes it.** Guard: say so up front and ship an export.
- **Layout traps.** Negative margins overlap the header; `overflow-x: hidden` breaks `position: sticky` (use `overflow: clip`); CSS gradient variables can fail in inline styles, so hardcode them.
- **Old red tests block the revamp deploy; e2e only passes at desktop width.** Guard: fix or retire stale tests first; run e2e at a mobile viewport too.
- **Bundle budget full blocks a new intro or animation.** Guard: check the budget before promising the feature.
- **Perf fixes backfire.** Warm job pins an empty result for the whole TTL; cold scans hit the host timeout; warming every few minutes raises compute cost. Guard: never cache empty, tier warm frequency.
- **Asset work breaks prod.** Bulk WebP conversion rewrote stored image URLs; going live before reseeding gave 404 images; thumbnails too small for cover-crop are blurry. Guard: verify every asset URL after conversion, reseed before release.
- **SEO leaks.** A cookieless crawler gets the wrong default language; caching public HTML can leak user state; the manifest carries wrong or stale facts that look publishable. Guard: set the default locale deliberately; keep user pages dynamic; fact-check manifest and metadata.
- **Brand drift in generated assets.** Generic AI-looking font pairing rejected; OG images fall back to a default font; the wordmark gets retyped as text; QR posters ship with a placeholder domain. Guard: propose a distinctive pairing, bundle brand TTFs, use the wordmark image, regenerate QR with the real domain before print.

## Done when

- [ ] Brand or native reference locked and stored as tokens / brand page
- [ ] Reviewer approved a mockup before backend wiring
- [ ] Reviewed on a real phone (installed PWA if relevant)
- [ ] Headless desktop + mobile screenshots attached for each change
- [ ] Tests updated where behaviour changed; e2e passes at mobile width
- [ ] Copy swept (no em-dash, one language per locale) with a guard in place
- [ ] PWA, SEO, a11y and perf checks pass; asset URLs verified
- [ ] Reviewer said the design is okay

## Composes with

- **maji-mode**: discuss mode for revamps; ask before deploys.
- **maji-app-capture**: real-app screenshots for posters, manuals and decks once the UI is approved.
- **maji-code-video**: promo video from the approved UI.
- **maji-debug**: when a visual bug survives one fix.
- **maji-ship**: preview deploy for phone review, then the gated production release.
- **maji-review** and **maji-commit**: review the diff, one commit per tweak.

---

*`maji-ui-review` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
