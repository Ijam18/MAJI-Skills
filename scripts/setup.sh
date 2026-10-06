#!/usr/bin/env bash
# Link the MAJI Skills kit into an agent folder you already have. Safe to run again (after a
# git pull it links new skills and refreshes the blocks).
#
#   git clone https://github.com/Ijam18/MAJI-Skills.git <folder>/.maji-skills
#   <folder>/.maji-skills/scripts/setup.sh <folder>
#
# What it does in <folder>:
#   .agents/skills/maji-*   links to each kit skill (Cursor, Antigravity, Codex, Gemini CLI)
#   .claude/skills/maji-*   the same links for Claude Code
#   AGENTS.md / CLAUDE.md   a marked block pointing at the kit hub (your own text is untouched)
#   .gitignore              ignores me/, your my-* skills and the links
# If you cloned the kit itself as your agent folder, you do not need this script.
set -euo pipefail

KIT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$(cd "${1:-$KIT/..}" && pwd)"
[ "$TARGET" = "$KIT" ] && { echo "The kit is your agent folder already: open it in your agent. Nothing to link."; exit 0; }
REL="${KIT#"$TARGET"/}"   # kit path relative to the target, e.g. .maji-skills
[ "$REL" = "$KIT" ] && REL="$KIT"

mkdir -p "$TARGET/.agents/skills" "$TARGET/.claude/skills"
linked=0
for skill in "$KIT"/.agents/skills/maji-*; do
  name="$(basename "$skill")"
  for dir in "$TARGET/.agents/skills" "$TARGET/.claude/skills"; do
    if [ -e "$dir/$name" ] && [ ! -L "$dir/$name" ]; then
      echo "skip $dir/$name: a real folder with that name exists (yours wins)"; continue
    fi
    ln -sfn "$skill" "$dir/$name"
  done
  linked=$((linked + 1))
done

# Replace (or append) the block between the markers in a file, leaving everything else alone.
put_block() {
  local file="$1" block="$2"
  touch "$file"
  python3 - "$file" "$block" <<'PY'
import re, sys
path, block = sys.argv[1], sys.argv[2]
text = open(path).read()
wrapped = f"<!-- maji:start -->\n{block}\n<!-- maji:end -->"
if "<!-- maji:start -->" in text:
    text = re.sub(r"<!-- maji:start -->[\s\S]*?<!-- maji:end -->", lambda m: wrapped, text)
else:
    text = (text.rstrip() + "\n\n" if text.strip() else "") + wrapped + "\n"
open(path, "w").write(text)
PY
}

put_block "$TARGET/AGENTS.md" "## MAJI Skills
This folder uses the MAJI Skills kit. Before any task, read \`$REL/AGENTS.md\` and follow it: discipline first (\`maji-mode\`), match a skill from its index, and run each skill's Step 0.
- Skills are linked into \`.agents/skills/\` (and \`.claude/skills/\`). Your own skills go in \`.agents/skills/my-<name>/\` (\`maji-learn\`).
- Personal files live in \`me/\` here: \`me/profile.md\` (run \`maji-setup\`), \`me/overrides/<skill>.md\`, \`me/learned.md\`. Never commit them.
- Update the kit: \`git -C $REL pull --ff-only && $REL/scripts/setup.sh .\`"

put_block "$TARGET/CLAUDE.md" "@AGENTS.md
@$REL/AGENTS.md"

touch "$TARGET/.gitignore"
for pattern in "me/" ".agents/skills/my-*" ".agents/skills/maji-*" ".claude/skills/maji-*" "$REL/"; do
  grep -qxF "$pattern" "$TARGET/.gitignore" || echo "$pattern" >> "$TARGET/.gitignore"
done

if [ ! -f "$TARGET/.gemini/settings.json" ]; then
  mkdir -p "$TARGET/.gemini"
  printf '{\n  "context": { "fileName": ["AGENTS.md", "GEMINI.md"] }\n}\n' > "$TARGET/.gemini/settings.json"
else
  echo "note: $TARGET/.gemini/settings.json exists; for Gemini CLI add \"AGENTS.md\" to context.fileName yourself"
fi

echo "MAJI Skills linked into $TARGET: $linked skills. Next: open the folder in your agent and say \"run maji-setup\"."
