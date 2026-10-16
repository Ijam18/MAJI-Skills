---
name: maji-skill-vet
description: "Vet any outside agent skill, plugin or MCP server before it touches your machine: check provenance and licence, pin a commit, read every file, scan for risky patterns (downloads, package installs, load-time shell, hooks, MCP configs, eval, encoded payloads, sudo, credential reads, remote fetches), strip what is risky, record source, commit, licence and omissions in a third-party registry, and install only with the owner's approval. Use when someone says \"install this skill\", \"is this plugin safe\", \"add this MCP server\", \"vet this repo before we use it\", \"security-scan before install\", \"update the third-party skills\". Not for auditing your own app code (use maji-review) or checking a site's SEO (use maji-seo-audit)."
metadata:
  tier: core
  category: security
  version: "1.0.0-lite"
---

# maji-skill-vet: Vet Before Install

A skill is instructions plus files that run with your agent's permissions, so treat it like code from a stranger. Final output: a verdict table per skill (install / install with omissions / reject), a registry entry, and the owner's yes or no before anything is copied in.

## Step 0: your context

Read `me/profile.md` if it exists (Folders, Stack, Tools and credits). If `me/overrides/maji-skill-vet.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use before installing any skill, plugin, MCP server, agent config or prompt pack from a marketplace, repo, gist or chat message.
- Use again on every update of something already installed.
- Not for reviewing your own code (maji-review). Not for package dependency audits in an app (use the stack's own audit tool).

## Steps

1. **Provenance.** Record where it came from: repo URL, author handle, marketplace page.
2. **Licence.** Find a LICENSE file or a declared licence.
3. **Fetch read-only and pin.** `git clone --depth 1` into an empty scratch folder outside any project, then `git rev-parse HEAD` and record the commit.
4. **Inventory every file.** `find .
5. **Scan for risky patterns.** Grep, then read every hit in context:
6. **Judge each hit.** Benign: docs that warn against `eval`, a user-run project command like `npx playwright test`, plain reference links.
7. **Omit, do not patch.** Keep only the files you read and trust, usually SKILL.md, references and LICENSE.
8. **Verdict and owner approval.** Present the table below and wait.
9. **Record in the registry.** Append to the third-party registry file (e.g.
10. **Re-scan on update.** Clone upstream again, diff against the installed folder, re-run steps 4 to 7 on the diff, update the pinned commit in the registry, then replace.

## Composes with

- **maji-review**: deeper review of any script the owner still wants to keep.
- **maji-repo-hygiene**: keep secrets and third-party clones out of the repo.
- **maji-propose**: plan a large import batch before vetting it.
- **maji-mode**: ask before install; one clarifying question first.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-skill-vet` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*
