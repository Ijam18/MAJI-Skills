---
name: maji-api-contract
description: "Design and review an API contract before building it: resources and naming, request and response schemas validated on every input, one success and one error shape, status-code rules, pagination, idempotency keys, versioning, auth scopes, rate limits, an OpenAPI file or typed contract as the single source, contract tests, and a breaking-change checklist before ship. Use when starting a new backend or endpoint, when a frontend and backend disagree on a payload, when exposing an API to partners or a mobile app, or before changing a live endpoint. Triggers: \"design the API\", \"review these endpoints\", \"what should the response look like\", \"standardise our error format\", \"add pagination\", \"make this endpoint idempotent\", \"write the OpenAPI spec\", \"is this a breaking change\", \"version the API\". Not for database schema and migrations (use maji-ship) or credit and payment idempotency inside the ledger (use maji-credits-ledger)."
metadata:
  tier: workflow
  category: product
  version: "1.0.0-lite"
---

# maji-api-contract: API Contract First

Agree what the API promises before writing handlers, so clients, tests and docs all come from one source. Final output: a reviewed contract (OpenAPI file or typed schema module), shared response and error shapes, contract tests in CI, and a breaking-change checklist run before every ship.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Folders). If `me/overrides/maji-api-contract.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use for a new backend, a new group of endpoints, a public or partner API, a mobile client that cannot update instantly, or a review of an API that grew without rules.
- Use before changing a live endpoint, to decide whether the change breaks clients.
- Not for table design and migrations (maji-ship covers migration order). Not for ledger-level idempotency (maji-credits-ledger). Not for a server-rendered page that has no external client: a typed server function may be enough.

## Steps

1. **List consumers and use cases.** Who calls it (own web app, mobile app, partner, cron), with what auth, and what each screen or job needs.
2. **Name resources.** Plural nouns in kebab-case paths (`/job-posts/{id}`), one consistent field case in bodies (camelCase or snake_case, pick once).
3. **Write the schemas.** For every endpoint: path and query params, request body, success body, possible errors.
4. **One success shape, one error shape.**
5. **Status-code rules.** 200 read or update, 201 create (with the new id), 204 no body, 400 malformed, 401 not signed in, 403 signed in but not allowed, 404 not found or not visible to this caller, 409 conflict or duplicate, 422 valid shape but failed a business rule, 429 rate limited, 500 server fault.
6. **Pagination, filtering, sorting.** Every list endpoint is paginated from day one with a default and a maximum page size.
7. **Idempotency.** Any POST that charges, sends, books or creates something a retry could duplicate accepts an `Idempotency-Key` header.
8. **Auth and scopes.** Name the scopes or roles per endpoint in the contract (`jobs:read`, `jobs:write`, admin).
9. **Rate limits.** Set limits per caller and per route class (auth, writes, expensive AI or search calls).
10. **Versioning.** Pick one scheme and write it down: a URL prefix (`/v1`) is the simplest to route and cache.
11. **Make the contract the source.** Either an OpenAPI 3.1 file in the repo, or a typed schema module that generates OpenAPI.
12. **Contract tests.** For each endpoint: one valid request, each documented error, auth missing, wrong owner, pagination end, idempotent replay.
13. **Breaking-change checklist before ship.** Diff the contract against the deployed version.

## Composes with

- `maji-propose`: discuss the contract options before building.
- `maji-review` to review the contract and handlers, `maji-ship` to ship with migrations in the right order.
- `maji-credits-ledger` for money flows, `maji-observe` for request ids and error alerts, `maji-ai-eval` when an endpoint wraps an LLM.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-api-contract` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
