#!/usr/bin/env node
// Lint every SKILL.md in this repo. Errors fail the run; warnings are printed only.
// Rules for workflows/ (strict): valid frontmatter, name == folder, description <= 1024 chars,
// no em-dash, no secret-looking strings, no private names. Core and experimental get warnings
// for style rules so existing skills are not forced to change.
// Private names live outside the repo: ~/.maji/maji-skills-private-terms.json ({"banned": [...]}).
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, relative, basename, dirname } from "node:path"
import { homedir } from "node:os"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const SKIP = new Set([".git", "node_modules", "mcp", "analytics", "community-benchmarks", "scripts"])
const PRIVATE = join(homedir(), ".maji/maji-skills-private-terms.json")
const banned = existsSync(PRIVATE) ? JSON.parse(readFileSync(PRIVATE, "utf8")).banned : []
const SECRET = /(github_pat_|ghp_|sk_(live|test)_|rk_(live|test)_|apify_api_|AIza[0-9A-Za-z_-]{10}|xox[bpa]-|eyJ[A-Za-z0-9_-]{20,}\.)/

export function findSkills(dir = ROOT, out = []) {
  for (const n of readdirSync(dir)) {
    if (SKIP.has(n)) continue
    const p = join(dir, n)
    if (statSync(p).isDirectory()) findSkills(p, out)
    else if (n === "SKILL.md") out.push(p)
  }
  return out
}

export function parse(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return null
  const fm = {}
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/)
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "")
  }
  return { fm, body: m[2] }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let errors = 0
  for (const file of findSkills()) {
    const rel = relative(ROOT, file)
    const strict = rel.startsWith("workflows/")
    const issues = []
    const text = readFileSync(file, "utf8")
    const doc = parse(text)
    if (!doc) issues.push(["error", "missing frontmatter"])
    else {
      const folder = basename(dirname(file))
      if (doc.fm.name !== folder) issues.push(["error", `name "${doc.fm.name}" != folder "${folder}"`])
      if (!doc.fm.description) issues.push(["error", "missing description"])
      else if (doc.fm.description.length > 1024) issues.push(["error", `description ${doc.fm.description.length} > 1024 chars`])
      if (doc.body.trim().length < 200) issues.push(["error", "body too short"])
    }
    if (SECRET.test(text)) issues.push(["error", "secret-looking string"])
    for (const t of banned) {
      const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const re = /^[A-Za-z0-9]/.test(t) ? new RegExp(`\\b${esc}\\b`, "i") : new RegExp(esc, "i")
      if (re.test(text)) issues.push([strict ? "error" : "warn", `private term "${t}"`])
    }
    if (text.includes("—")) issues.push([strict ? "error" : "warn", "em-dash"])
    for (const [level, msg] of issues) {
      if (level === "error") errors++
      console.log(`${level.padEnd(5)} ${rel}: ${msg}`)
    }
  }
  console.log(errors ? `\n${errors} error(s)` : "\nlint ok")
  process.exit(errors ? 1 : 0)
}
