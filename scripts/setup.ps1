# Windows version of scripts/setup.sh: copy the MAJI Skills kit into an agent folder you already have.
# Windows symlinks need admin rights or Developer Mode, so this copies the skill folders instead.
# Run it again after updating the kit (git -C .maji-skills pull --ff-only) to refresh the copies.
#
#   git clone https://github.com/Ijam18/MAJI-Skills.git <folder>\.maji-skills
#   powershell -ExecutionPolicy Bypass -File <folder>\.maji-skills\scripts\setup.ps1 <folder>
param([string]$Target = (Join-Path $PSScriptRoot "..\.."))
$ErrorActionPreference = "Stop"
$Kit = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Target = (Resolve-Path $Target).Path

if ($Target -eq $Kit) {
  # The kit is the agent folder: make sure .claude\skills holds real folders, not a broken link file.
  $claude = Join-Path $Kit ".claude\skills"
  if (Test-Path $claude -PathType Leaf) { Remove-Item $claude -Force }
  New-Item -ItemType Directory -Force -Path $claude | Out-Null
  Get-ChildItem (Join-Path $Kit ".agents\skills") -Directory | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $claude $_.Name) -Recurse -Force
  }
  Write-Host "Copied skills into .claude\skills for Claude Code. Open this folder in your agent."
  exit 0
}

$Rel = $Kit.Substring($Target.Length).TrimStart('\', '/')
$count = 0
foreach ($dir in @(".agents\skills", ".claude\skills")) {
  $dest = Join-Path $Target $dir
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Get-ChildItem (Join-Path $Kit ".agents\skills") -Directory -Filter "maji-*" | ForEach-Object {
    $to = Join-Path $dest $_.Name
    if (Test-Path $to) { Remove-Item $to -Recurse -Force }
    Copy-Item $_.FullName $to -Recurse -Force
    if ($dir -eq ".agents\skills") { $count++ }
  }
}

function Set-Block([string]$File, [string]$Block) {
  $wrapped = "<!-- maji:start -->`n$Block`n<!-- maji:end -->"
  $text = if (Test-Path $File) { Get-Content $File -Raw } else { "" }
  if ($text -match "<!-- maji:start -->") {
    $text = [regex]::Replace($text, "<!-- maji:start -->[\s\S]*?<!-- maji:end -->", [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $wrapped })
  } elseif ($text.Trim()) { $text = $text.TrimEnd() + "`n`n" + $wrapped + "`n" } else { $text = $wrapped + "`n" }
  Set-Content -Path $File -Value $text -NoNewline
}

$relSlash = $Rel -replace '\\', '/'
Set-Block (Join-Path $Target "AGENTS.md") @"
## MAJI Skills
This folder uses the MAJI Skills kit. Before any task, read ``$relSlash/AGENTS.md`` and follow it: discipline first (``maji-mode``), match a skill from its index, and run each skill's Step 0.
- Skills are copied into ``.agents/skills/`` (and ``.claude/skills/``). Your own skills go in ``.agents/skills/my-<name>/`` (``maji-learn``).
- Personal files live in ``me/`` here: ``me/profile.md`` (run ``maji-setup``), ``me/overrides/<skill>.md``, ``me/learned.md``. Never commit them.
- Update the kit: ``git -C $relSlash pull --ff-only``, then run this script again.
"@
Set-Block (Join-Path $Target "CLAUDE.md") "@AGENTS.md`n@$relSlash/AGENTS.md"

$ignore = Join-Path $Target ".gitignore"
if (-not (Test-Path $ignore)) { New-Item $ignore -ItemType File | Out-Null }
$existing = Get-Content $ignore
foreach ($p in @("me/", ".agents/skills/my-*", ".agents/skills/maji-*", ".claude/skills/maji-*", "$relSlash/")) {
  if ($existing -notcontains $p) { Add-Content $ignore $p }
}

$gemini = Join-Path $Target ".gemini\settings.json"
if (-not (Test-Path $gemini)) {
  New-Item -ItemType Directory -Force -Path (Split-Path $gemini) | Out-Null
  Set-Content $gemini "{`n  `"context`": { `"fileName`": [`"AGENTS.md`", `"GEMINI.md`"] }`n}"
} else { Write-Host "note: .gemini\settings.json exists; for Gemini CLI add AGENTS.md to context.fileName yourself" }

Write-Host "MAJI Skills copied into ${Target}: $count skills. Next: open the folder in your agent and say `"run maji-setup`"."
