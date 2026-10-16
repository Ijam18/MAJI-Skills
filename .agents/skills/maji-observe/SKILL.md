---
name: maji-observe
description: "Watch a live app after go-live so failures shout instead of hiding in a log: error tracking per stack (Sentry or a free alternative), source maps and release tagging, a few alert rules that do not spam, an uptime probe, bounded log retention, LLM call tracing with cost caps, a weekly health digest, then triage-to-fix that treats event data as untrusted. Use when an app just shipped, when users report errors nobody saw, or when an AI feature runs up a bill. Triggers: \"set up error monitoring\", \"add Sentry\", \"why are stack traces minified\", \"alert me when prod breaks\", \"uptime check\", \"trace the LLM calls\", \"cap the AI spend\", \"weekly health report\", \"fix the top production error\". Not for the deploy itself (use maji-ship) or for running the recurring job that sends the digest (use maji-scheduled-job)."
metadata:
  tier: workflow
  category: ship
  version: "1.0.0-lite"
---

# maji-observe: Watch Production

Make a live app tell you when it breaks, what it costs, and how healthy it is each week, without drowning you in noise. Final output: errors captured with readable stack traces per release, three to five alert rules routed to one channel someone reads, an uptime probe, bounded logs, traced and capped LLM calls, and a weekly digest.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Tools and credits, Folders). If `me/overrides/maji-observe.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use right after the first go-live, when a user reports an error you never saw, when an AI feature has no spend ceiling, or when "is prod OK?" has no quick answer.
- Use when adding a new service, worker or LLM call to an app that is already watched.
- Not for shipping the change (maji-ship), a paused database or quota wall (maji-vendor-block), or a one-off bug with a known cause (maji-debug).

## Steps

1. **Inventory what can break.** List every runtime (browser, server, edge, worker, cron), every external call (DB, payment, email, LLM) and every scheduled job.
2. **Pick the error tracker.** Hosted Sentry (free tier) is the default for JS and Python; a self-hosted Sentry-compatible tracker or the host's built-in error logs work when budget or data residency rules it out.
3. **Configure it conservatively.**
4. **Source maps and release tagging.** Upload source maps at build time so production traces show real file names.
5. **Alert rules that do not spam.** Start with three to five rules, all to ONE channel the owner already reads (email or one chat channel):
6. **Uptime probe.** One external check per public entry point (home, health route, login) every 5 minutes from a free monitor or a scheduled CI job.
7. **Bound the logs.** Set retention in the tracker and the host log drain (for example 14 or 30 days).
8. **Trace and cap LLM calls.** Wrap every model client with the tracker's AI integration or a thin wrapper that records model, latency, input and output tokens, cost estimate, user or tenant id, and outcome.
9. **Weekly health digest.** A scheduled job (maji-scheduled-job) posts one short summary: uptime percentage, new and regressed issues, top 3 errors by users affected, slowest routes, LLM calls and spend vs cap, anything still unresolved from last week.
10. **Triage to fix.** For each issue worth fixing:

## Composes with

- `maji-ship`: observe is the step after verify-live; tokens are set through its human handoff.
- `maji-scheduled-job`: runs the uptime job, the log pruner and the weekly digest.
- `maji-debug` for the fix, `maji-ai-eval` for turning LLM traces into an eval set, `maji-vendor-block` when the alert is a quota or paused DB.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-observe` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
