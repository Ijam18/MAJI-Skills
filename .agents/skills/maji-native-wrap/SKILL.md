---
name: maji-native-wrap
description: "Take an existing PWA or Next.js web app to the App Store and Play Store with Capacitor: decide if a wrapper is worth it, set up the native projects, fix safe areas and system bars (Capacitor 8 SystemBars, Android 15+ edge-to-edge), generate splash and icons, wire deep links and push, run a store review preflight and version every build. Lists commands for the owner; installs nothing itself. Use when someone says \"put the app on the App Store\", \"publish to Play Store\", \"wrap the PWA with Capacitor\", \"the header is under the notch in the app\", \"splash screen flashes white\", \"deep links open the browser\", \"add push to the app\", \"Apple rejected the build\". Not for making the web app installable as a PWA (use maji-pwa) or for motion inside it (use maji-motion)."
metadata:
  tier: workflow
  category: ship
  version: "1.0.0-lite"
---

# maji-native-wrap: PWA to App Store and Play Store

Wrap a working web app in Capacitor only when the store gives it something the PWA cannot, then get it through review on the first or second try. Final output: iOS and Android projects that build, a preflight checklist with every item ticked, and a versioned build ready for TestFlight and a Play testing track.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Stack, Brand, Tools and credits, Folders). If `me/overrides/maji-native-wrap.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use when a client or market needs a store listing, native push on iOS without home-screen install, or device APIs the web cannot reach (biometrics, background tasks, deep OS share targets).
- Use when an existing Capacitor app breaks on notches, splash, deep links or after a Capacitor 8 or targetSdk upgrade.
- Not when the PWA already does the job: install, offline and web push (iOS 16.4+ for installed apps) come from maji-pwa without store fees or review. Not for React Native or a rewrite.

## Steps

1. **Decide if the wrapper earns its keep.** Write one line: what the store build gives users that the PWA does not.
2. **Pick the web delivery.** Bundled is the default: Next.js `output: 'export'` (no server actions, no route handlers, `images.unoptimized`), `webDir: 'out'`.
3. **Hand the owner the setup commands** (the skill does not run installs):
4. **Safe areas and system bars.** `viewport-fit=cover` in the viewport meta, then pad the layout shell once:
5. **Icons and splash.** Sources in `assets/`: `icon-only.png`, `icon-foreground.png`, `icon-background.png` (1024px or more), `splash.png` and `splash-dark.png` (2732px or more), logo inside the centre third.
6. **Deep links.** iOS Universal Links: `apple-app-site-association` (no extension, `application/json`) at `https://<domain>/.well-known/` plus the Associated Domains entitlement `applinks:<domain>`.
7. **Push, only if step 1 needs it.** `@capacitor/push-notifications`; iOS needs the Push capability and an APNs auth key; Android needs Firebase `google-services.json` and the Android 13+ notification permission.
8. **Store review preflight.** Privacy policy URL; in-app account deletion when sign-up exists; an equivalent private login option on iOS if third-party social login is offered; digital goods through in-app purchase, no external payment links; demo account and review notes; iOS privacy manifest and App Privacy answers; Play Data safety form and the current target API level; real screenshots per required size (maji-app-capture).
9. **Version every build.** One source: `package.json` version maps to iOS `MARKETING_VERSION` and Android `versionName`; iOS build number and Android `versionCode` are integers that rise on every upload, even rejected ones.
10. **Device check, then ship.** Clean build (Xcode Clean Build Folder, `./gradlew clean`), delete and reinstall (launch screens cache), cold launch on an iPhone with Dynamic Island, a small iPhone, Android 15+ in gesture and 3-button navigation, light and dark, landscape once.

## Composes with

- **maji-pwa**: the installable web app this wraps; most apps should stop there.
- **maji-app-capture**: real store screenshots and preview video.
- **maji-ship**: the gated release and rollback plan.
- **maji-motion**: sheet and gesture feel inside the wrapped app.
- **maji-mode**: confirm the store decision before buying developer accounts.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-native-wrap` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
