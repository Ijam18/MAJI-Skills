#!/usr/bin/env node
// Lint the MAJI skill kit. Errors fail the run; warnings are printed only.
// - every .agents/skills/<name>/SKILL.md: frontmatter (name == folder, description <= 1024 chars,
//   metadata.tier/category/version), body length, no secret-looking strings, no private names
// - workflow tier is strict on style (em-dash); core and experimental only warn
// - every relative markdown link in the repo must resolve
// Private names live outside the repo: ~/.maji/maji-skills-private-terms.json ({"banned": [...]}).
// Usage: node scripts/lint-skills.mjs [--dir <skills dir>]   (--dir lints a personal skills folder)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, relative, dirname, resolve } from "node:path"
import { homedir } from "node:os"
import { fileURLToPath } from "node:url"

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const argDir = process.argv.indexOf("--dir")
export const SKILLS = argDir > 0 ? resolve(process.argv[argDir + 1]) : join(ROOT, ".agents/skills")
const PRIVATE = join(homedir(), ".maji/maji-skills-private-terms.json")
const banned = existsSync(PRIVATE) ? JSON.parse(readFileSync(PRIVATE, "utf8")).banned : []
const SECRET = /(github_pat_|ghp_|sk_(live|test)_|rk_(live|test)_|apify_api_|AIza[0-9A-Za-z_-]{10}|xox[bpa]-|eyJ[A-Za-z0-9_-]{20,}\.)/
const TIERS = new Set(["core", "experimental", "workflow"])
const isPersonal = (name) => name.startsWith("my-")

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
  return { fm, body: m[2] }
}

function mdFiles(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === ".git" || n === "node_modules" || n === "me") continue
    const p = join(dir, n)
    const st = statSync(p, { throwIfNoEntry: false })
    if (!st) continue
    if (st.isDirectory()) { if (!(n === "skills" && p.endsWith(".claude/skills"))) mdFiles(p, out) }
    else if (n.endsWith(".md")) out.push(p)
  }
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let errors = 0
  const report = (level, file, msg) => {
    if (level === "error") errors++
    console.log(`${level.padEnd(5)} ${relative(ROOT, file)}: ${msg}`)
  }
  for (const file of findSkills()) {
    const text = readFileSync(file, "utf8")
    const doc = parse(text)
    const folder = dirname(file).split("/").pop()
    if (!doc) { report("error", file, "missing frontmatter"); continue }
    const { fm, body } = doc
    const tier = fm.metadata?.tier
    const strict = tier === "workflow" || argDir > 0
    if (fm.name !== folder) report("error", file, `name "${fm.name}" != folder "${folder}"`)
    if (!fm.description) report("error", file, "missing description")
    else if (fm.description.length > 1024) report("error", file, `description ${fm.description.length} > 1024 chars`)
    const personal = isPersonal(folder)
    if (!body.includes("## Step 0")) report("error", file, "missing \"## Step 0\" section (profile + override)")
    if (argDir < 0 && !personal) {
      if (!TIERS.has(tier)) report("error", file, `metadata.tier must be core|experimental|workflow (got "${tier}")`)
      if (!fm.metadata?.category) report("error", file, "missing metadata.category")
      if (!fm.metadata?.version) report("error", file, "missing metadata.version")
    }
    if (body.trim().length < 200) report("error", file, "body too short")
    if (SECRET.test(text)) report("error", file, "secret-looking string")
    for (const t of personal ? [] : banned) {
      const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const re = /^[A-Za-z0-9]/.test(t) ? new RegExp(`\\b${esc}\\b`, "i") : new RegExp(esc, "i")
      if (re.test(text)) report(strict ? "error" : "warn", file, `private term "${t}"`)
    }
    if (text.includes("—")) report(strict ? "error" : "warn", file, "em-dash")
  }
  if (argDir < 0) {
    for (const file of mdFiles(ROOT)) {
      const text = readFileSync(file, "utf8")
      for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^(https?:|mailto:|#)/.test(target)) continue
        const path = target.split("#")[0]
        if (path && !existsSync(resolve(dirname(file), path))) report("error", file, `broken link ${target}`)
      }
    }
  }
  console.log(errors ? `\n${errors} error(s)` : "\nlint ok")
  process.exit(errors ? 1 : 0)
}
