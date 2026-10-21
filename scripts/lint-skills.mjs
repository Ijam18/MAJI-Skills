#!/usr/bin/env node
// Lint the MAJI skill kit. Errors fail the run; warnings are printed only.
// - every <skills dir>/<name>/SKILL.md: frontmatter (name == folder, description <= 1024 chars, warn > 800,
//   no unquoted ": " or " #" in description, metadata.tier/category/version), body length,
//   no secret-looking strings, no private names
// - skills use `allowed-tools:`; subagent files (<skill>/agents/*.md) use `tools:`
// - every "Composes with" target must exist in this kit, the other kit or ~/.claude/skills (cross-kit = warn)
// - evals/evals.json, when present, must parse
// - workflow tier is strict on style (em-dash); core and experimental only warn
// - scanning 0 skills is an error
// - every relative markdown link in the kit must resolve
// Private names live outside the repo: ~/.maji/maji-skills-private-terms.json ({"banned": [...]}).
// Usage: node scripts/lint-skills.mjs [<kit path>]   (a repo with .agents/skills or skills/, or a skills folder; default: this repo)
//        node scripts/lint-skills.mjs --dir <skills dir>   (lints a personal skills folder)
//        node scripts/lint-skills.mjs --self-test           (lints scripts/fixtures and expects known failures)
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, rmSync } from "node:fs"
import { join, relative, dirname, resolve, basename } from "node:path"
import { homedir, tmpdir } from "node:os"
import { fileURLToPath } from "node:url"

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const args = process.argv.slice(2)
const argDir = args.indexOf("--dir")
const selfTest = args.includes("--self-test")
const positional = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--dir")

// A kit path is a repo root holding .agents/skills or skills/, or a skills folder itself.
export function resolveKit(p) {
  const abs = resolve(p)
  for (const sub of [".agents/skills", "skills"]) if (existsSync(join(abs, sub))) return { root: abs, skills: join(abs, sub) }
  return { root: null, skills: abs }
}
const target = argDir >= 0 ? { root: null, skills: resolve(args[argDir + 1]) }
  : positional ? resolveKit(positional) : { root: ROOT, skills: join(ROOT, ".agents/skills") }
export const SKILLS = target.skills
const PRIVATE = join(homedir(), ".maji/maji-skills-private-terms.json")
const banned = existsSync(PRIVATE) ? JSON.parse(readFileSync(PRIVATE, "utf8")).banned : []
const SECRET = /(github_pat_|ghp_|sk_(live|test)_|rk_(live|test)_|apify_api_|AIza[0-9A-Za-z_-]{10}|xox[bpa]-|eyJ[A-Za-z0-9_-]{20,}\.)/
const TIERS = new Set(["core", "experimental", "workflow"])
const isPersonal = (name) => name.startsWith("my-")
// Where Composes-with targets may live: core kit, Pro kit, user-level skills.
const KNOWN = [join(ROOT, ".agents/skills"), resolve(ROOT, "../maji-skills-pro/skills"), join(homedir(), ".claude/skills")]
const NOT_SKILLS = new Set(["maji-skills", "maji-skills-pro"])

export function findSkills(dir = SKILLS) {
  return readdirSync(dir)
    .filter((n) => !n.startsWith(".") && statSync(join(dir, n)).isDirectory())
    .map((n) => join(dir, n, "SKILL.md"))
    .filter((f) => existsSync(f))
}

// Frontmatter subset: top-level "key: value" plus one level of nested "  key: value" under a parent key.
export function parse(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return null
  const fm = {}
  let parent = null
  for (const line of m[1].split("\n")) {
    const nested = line.match(/^\s{2,}([A-Za-z_-]+):\s*(.*)$/)
    const top = line.match(/^([A-Za-z_-]+):\s*(.*)$/)
    const clean = (v) => v.trim().replace(/^["']|["']$/g, "")
    if (nested && parent) fm[parent][nested[1]] = clean(nested[2])
    else if (top) {
      if (top[2].trim() === "") { parent = top[1]; fm[parent] = {} }
      else { parent = null; fm[top[1]] = clean(top[2]) }
    }
  }
  return { fm, body: m[2], raw: m[1] }
}

// Plain YAML scalars break on ": " (read as a mapping) and " #" (read as a comment).
function yamlScalarIssue(raw, key) {
  const line = raw.split("\n").find((l) => l.startsWith(`${key}:`))
  if (!line) return null
  const v = line.slice(key.length + 1).trim()
  if (!v || /^[>|]/.test(v)) return null
  if (/^["']/.test(v)) return v.length > 1 && v.endsWith(v[0]) ? null : `${key} has an unterminated quote`
  if (v.includes(": ")) return `${key} has an unquoted ": " (breaks YAML); wrap it in double quotes`
  if (v.includes(" #")) return `${key} has an unquoted " #" (YAML reads the rest as a comment); wrap it in double quotes`
  return null
}

function composesTargets(body) {
  const out = new Set()
  let on = false
  for (const line of body.split("\n")) {
    if (/^##\s+composes with/i.test(line)) on = true
    else if (/^(## |---)/.test(line)) on = false
    if (on) for (const [t] of line.matchAll(/\b(?:maji|my)-[a-z0-9]+(?:-[a-z0-9]+)*/g)) if (!NOT_SKILLS.has(t)) out.add(t)
  }
  return out
}

function mdFiles(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === ".git" || n === "node_modules" || n === "me" || n === "fixtures" || n === "dist") continue
    const p = join(dir, n)
    const st = statSync(p, { throwIfNoEntry: false })
    if (!st) continue
    if (st.isDirectory()) { if (!(n === "skills" && p.endsWith(".claude/skills"))) mdFiles(p, out) }
    else if (n.endsWith(".md")) out.push(p)
  }
  return out
}

// Lint one skills folder. personal = --dir mode (strict style, no tier checks); root = kit root for the link scan.
export function lintSkills(dir, { root = null, personal = false, report }) {
  const skills = existsSync(dir) ? findSkills(dir) : []
  if (skills.length === 0) report("error", dir, "scanned 0 skills (wrong path?)")
  const others = KNOWN.filter((d) => existsSync(d) && resolve(d) !== resolve(dir))
  for (const file of skills) {
    const text = readFileSync(file, "utf8")
    const doc = parse(text)
    const folder = dirname(file).split("/").pop()
    if (!doc) { report("error", file, "missing frontmatter"); continue }
    const { fm, body, raw } = doc
    const tier = fm.metadata?.tier
    const strict = tier === "workflow" || personal
    if (fm.name !== folder) report("error", file, `name "${fm.name}" != folder "${folder}"`)
    if (!fm.description) report("error", file, "missing description")
    else if (fm.description.length > 1024) report("error", file, `description ${fm.description.length} > 1024 chars`)
    else if (fm.description.length > 800) report("warn", file, `description ${fm.description.length} > 800 chars (always loaded; trim)`)
    for (const key of ["name", "description"]) {
      const issue = yamlScalarIssue(raw, key)
      if (issue) report("error", file, issue)
    }
    if (/^tools:/m.test(raw)) report("error", file, "frontmatter `tools:` is the subagent key; skills use `allowed-tools:`")
    const agentsDir = join(dirname(file), "agents")
    if (existsSync(agentsDir)) for (const a of readdirSync(agentsDir).filter((n) => n.endsWith(".md"))) {
      const ad = parse(readFileSync(join(agentsDir, a), "utf8"))
      if (ad && /^allowed-tools:/m.test(ad.raw)) report("error", join(agentsDir, a), "subagent uses `allowed-tools:`; subagents use `tools:`")
    }
    const evals = join(dirname(file), "evals/evals.json")
    if (existsSync(evals)) {
      try { JSON.parse(readFileSync(evals, "utf8")) } catch (e) { report("error", evals, `invalid JSON: ${e.message}`) }
    }
    const personalSkill = isPersonal(folder)
    if (!body.includes("## Step 0")) report("error", file, "missing \"## Step 0\" section (profile + override)")
    if (!personal && !personalSkill) {
      if (!TIERS.has(tier)) report("error", file, `metadata.tier must be core|experimental|workflow (got "${tier}")`)
      if (!fm.metadata?.category) report("error", file, "missing metadata.category")
      if (!fm.metadata?.version) report("error", file, "missing metadata.version")
    }
    if (body.trim().length < 200) report("error", file, "body too short")
    if (SECRET.test(text)) report("error", file, "secret-looking string")
    for (const t of personalSkill ? [] : banned) {
      const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const re = /^[A-Za-z0-9]/.test(t) ? new RegExp(`\\b${esc}\\b`, "i") : new RegExp(esc, "i")
      if (re.test(text)) report(strict ? "error" : "warn", file, `private term "${t}"`)
    }
    if (text.includes("\u2014")) report(strict ? "error" : "warn", file, "em-dash")
    const missing = [], crossKit = []
    for (const t of composesTargets(body)) {
      if (t === folder || existsSync(join(dir, t))) continue
      if (others.some((d) => existsSync(join(d, t)))) crossKit.push(t)
      else missing.push(t)
    }
    if (missing.length) report("error", file, `Composes with names missing skill(s): ${missing.join(", ")}`)
    if (crossKit.length) report("warn", file, `Composes with names skill(s) outside this kit: ${crossKit.join(", ")}`)
  }
  if (root) {
    for (const file of mdFiles(root)) {
      const text = readFileSync(file, "utf8")
      for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^(https?:|mailto:|#)/.test(target)) continue
        const path = target.split("#")[0]
        if (path && !existsSync(resolve(dirname(file), path))) report("error", file, `broken link ${target}`)
      }
    }
  }
  return skills.length
}

// Each expected failure must show up when linting the known-bad fixture (and an empty folder).
function runSelfTest() {
  const fixtures = join(ROOT, "scripts/fixtures")
  const found = []
  lintSkills(fixtures, { report: (level, file, msg) => found.push(`${level} ${basename(dirname(file))} ${msg}`) })
  const empty = mkdtempSync(join(tmpdir(), "lint-skills-"))
  lintSkills(empty, { report: (level, file, msg) => found.push(`${level} ${msg}`) })
  rmSync(empty, { recursive: true })
  const expect = [
    ["error", "unquoted \": \""],
    ["error", "`tools:` is the subagent key"],
    ["error", "subagent uses `allowed-tools:`"],
    ["error", "Composes with names missing skill(s): maji-does-not-exist"],
    ["warn", "> 800 chars"],
    ["error", "!= folder"],
    ["error", "missing \"## Step 0\""],
    ["error", "metadata.tier must be"],
    ["error", "invalid JSON"],
    ["error", "scanned 0 skills"],
  ]
  let failed = 0
  for (const [level, needle] of expect) {
    const hit = found.some((f) => f.startsWith(level) && f.includes(needle))
    if (!hit) failed++
    console.log(`${hit ? "pass" : "FAIL"}  ${level} ${needle}`)
  }
  console.log(failed ? `\nself-test: ${failed} expected failure(s) not caught` : "\nself-test ok")
  process.exit(failed ? 1 : 0)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (selfTest) runSelfTest()
  let errors = 0, warns = 0
  const base = target.root ?? dirname(SKILLS)
  const report = (level, file, msg) => {
    if (level === "error") errors++
    else warns++
    console.log(`${level.padEnd(5)} ${relative(base, file) || "."}: ${msg}`)
  }
  const n = lintSkills(SKILLS, { root: target.root, personal: argDir >= 0, report })
  console.log(`\n${n} skill(s) scanned in ${SKILLS}`)
  console.log(errors ? `${errors} error(s), ${warns} warning(s)` : `lint ok, ${warns} warning(s)`)
  process.exit(errors ? 1 : 0)
}
