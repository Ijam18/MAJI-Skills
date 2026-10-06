# Changelog

## v2.0.0 (2026-10-06): one layout for every agent

**Breaking: skills moved.** Every skill now lives in `.agents/skills/<name>/`. The old locations (repo root, `experimental/`, `workflows/`) are gone. If you copied skills with `cp -r`, delete the copies and follow the quickstart in the README.

### Added
- `AGENTS.md`: one hub every agent reads first (load order, rules, generated skill index). `CLAUDE.md` imports it, and `.gemini/settings.json` points Gemini CLI at it.
- `.claude/skills`: a link to `.agents/skills`, so Claude Code finds the same skills as Cursor, Antigravity, Codex and Gemini CLI.
- Personal layer, all gitignored:
  - `me/profile.md` (from `profile.example.md`)
  - `me/overrides/<skill>.md`
  - `me/learned.md`
  - your own skills in `.agents/skills/my-*`
- `maji-setup` (experimental): a short interview that writes your profile.
- `maji-learn` (experimental): turns work you repeat into your own skills, or into overrides.
- Step 0 in every skill: read the profile sections it needs, apply your override, ask once if something is missing.
- Skill metadata: `tier`, `category` and `version` in each frontmatter.
- `scripts/build-index.mjs` regenerates the index in `AGENTS.md`.
- `scripts/setup.sh` / `setup.ps1` link the kit into an agent folder you already have.
- CI: lint, link check and index check on every pull request.
- `docs/tools.md`: how each agent loads skills, with sources.

### Changed
- "Customization: fork and edit" is replaced by overrides, so `git pull` never conflicts with your changes.
- Benchmarks moved to `benchmarks/`; ROADMAP and tier rules moved to `docs/`.
- Cross-links between skills use skill names instead of relative paths, so a copied skill never has a broken link.
- Example names in `maji-summary` and `maji-todo` are now fictional.

## v1.x (2026-08-04 and earlier)
- 6 core and 5 experimental skills, the measured benchmark (−18.2% mean, −28.3% P90 output tokens), 22 workflow playbooks, and `maji-outreach`.
