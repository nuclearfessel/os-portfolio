#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output="${1:-$repo_root/claude-src-pack.zip}"
output_dir="$(dirname "$output")"
mkdir -p "$output_dir"
output="$(cd "$output_dir" && pwd)/$(basename "$output")"

if [[ ! -f "$repo_root/artifacts/desktop-portfolio/dist/public/index.html" ]]; then
  echo "Build the desktop portfolio before creating the Claude source package." >&2
  exit 1
fi

stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

copy_source() {
  local source="${1%/}"
  local destination="$stage/$source"

  mkdir -p "$(dirname "$destination")"
  cp -a "$repo_root/$source" "$destination"
}

copy_source artifacts/desktop-portfolio/
copy_source artifacts/portfolio-os-design-system/
copy_source .claude/
copy_source docs/

find "$stage" -type d \( \
  -name node_modules -o \
  -name dist -o \
  -name playwright-report -o \
  -name test-results \
\) -prune -exec rm -rf {} +

find "$stage" -type f \( \
  -name '.env' -o \
  -name '.env.*' -o \
  -name '*.tsbuildinfo' \
\) -delete

for file in CLAUDE.md README.md replit.md package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json; do
  cp "$repo_root/$file" "$stage/$file"
done

cp -R "$repo_root/artifacts/desktop-portfolio/dist/public" "$stage/public"

cat > "$stage/DEPLOYMENT.md" <<'EOF'
# Deploying the portfolio

The top-level `public/` directory contains the built static website.

Upload the contents of `public/` to the target web directory. Keep `index.html` and `assets/` together, and replace the previous build rather than mixing files from separate builds.

The remaining files are the Claude-ready project source, shared design system, documentation, and repository guidance.
EOF

rm -f "$output"
(cd "$stage" && zip -qr "$output" .)
unzip -tq "$output"

echo "Created $output"