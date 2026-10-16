---
name: maji-stress-test
description: "Pressure-test an idea, product or plan before anyone builds it: write the launch press release and FAQ as if it already shipped, run a pre-mortem that assumes it failed, find the riskiest assumption, set kill criteria, and design the cheapest experiment that could prove it wrong, then give one go / change / stop recommendation. Use when someone says \"is this idea any good\", \"poke holes in this\", \"stress-test my plan\", \"devil's advocate\", \"pre-mortem\", \"write the PRFAQ\", \"what could kill this\", \"should we build this\", \"validate before we build\". Not for planning the build itself (use maji-propose) or sizing the market and competitors (use maji-market-scan)."
metadata:
  tier: workflow
  category: plan
  version: "1.0.0-lite"
---

# maji-stress-test: Break It Before You Build It

Spend an hour attacking the idea so you do not spend a month building the wrong thing. Final output: a one-page stress-test file ending in GO, CHANGE or STOP, with the riskiest assumption, the kill criteria and the next cheap experiment.

## Step 0: your context

Read `me/profile.md` if it exists (Identity, Money and tax, Voice and language). If `me/overrides/maji-stress-test.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use before committing real time or money: a new product, feature, venture, offer, event or pivot.
- Use when the owner is excited and nobody has argued against it yet.
- Not for an approved plan that just needs waves (maji-propose). Not for market size and competitor research (maji-market-scan). Not for small, cheap, reversible changes: just try them.

## Steps

1. **State it in one line.** "For [who], [product] does [job] so that [outcome], instead of [current workaround]." If it does not fit one line, the idea is not ready; ask the owner which part matters most.
2. **Write the press release.** Dated on the imagined launch day, under 300 words: headline, who it is for, the problem in the customer's words, how it works in three sentences, one quoted customer reaction (marked as imagined), how to get it and what it costs.
3. **Write the FAQ.** Customer FAQ: the five questions a sceptical buyer asks (why switch, what does it cost, what if it breaks, who else uses it, why trust you).
4. **Pre-mortem.** Assume it is a year later and it failed.
5. **Riskiest assumption.** From the flagged answers and the pre-mortem, pick the one assumption that is both most likely wrong and most fatal if wrong.
6. **Kill criteria, set now.** Write the exact results that mean stop or change, before any test runs: thresholds, a deadline and a spend cap.
7. **Cheapest test.** Design the smallest experiment that could prove the riskiest assumption wrong, cheapest first: talk to five target users about their current workaround (no pitching), a landing page or post with a real call to action, a manual concierge version for three customers, a pre-order or deposit, a clickable mockup.
8. **Red-team pass.** Argue the strongest case against it as a competitor, as a sceptical buyer, and as the person who maintains it at 2 a.m.
9. **Recommend once.** GO (riskiest assumption already tested or cheap enough to just build), CHANGE (name the specific change: narrower audience, different price, smaller first version), or STOP (a fatal reason the owner cannot fix).

## Composes with

- **maji-propose**: a GO or CHANGE verdict becomes the input to the build plan.
- **maji-market-scan**: market size, competitors and pricing evidence for steps 3 and 8.
- **maji-offer**: test a price with a real quote.
- **maji-deadline-sprint**: build the smallest version fast once the test passes.
- **maji-mode**: discuss mode; no building during a stress test.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-stress-test` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
