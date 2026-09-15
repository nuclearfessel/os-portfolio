#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
site_zip="${1:-site-package-validation.zip}"
design_system_zip="${2:-design-system-package-validation.zip}"
claude_zip="${3:-claude-src-pack.zip}"

absolute_output() {
  local output="$1"

  if [[ "$output" = /* ]]; then
    printf '%s\n' "$output"
  else
    printf '%s/%s\n' "$repo_root" "$output"
  fi
}

site_zip="$(absolute_output "$site_zip")"
design_system_zip="$(absolute_output "$design_system_zip")"
claude_zip="$(absolute_output "$claude_zip")"

cd "$repo_root"

pnpm --filter @workspace/os-portfolio run typecheck
pnpm --filter @workspace/os-portfolio run build
pnpm --filter @workspace/os-portfolio-ds run typecheck
pnpm --filter @workspace/os-portfolio-ds run build

if ! grep -REq '(^|[;{])backdrop-filter:blur\(' artifacts/os-portfolio/dist/public/assets/*.css; then
  printf 'Desktop production CSS is missing the standard backdrop-filter blur declaration.\n' >&2
  exit 1
fi

if ! grep -REq '(^|[;{])backdrop-filter:blur\(' artifacts/os-portfolio-ds/dist/assets/*.css; then
  printf 'Design-system production CSS is missing the standard backdrop-filter blur declaration.\n' >&2
  exit 1
fi

rm -f "$site_zip" "$design_system_zip"
(cd artifacts/os-portfolio/dist/public && zip -qr "$site_zip" .)
bash scripts/package-claude-source.sh "$claude_zip"
(cd artifacts/os-portfolio-ds/dist && zip -qr "$design_system_zip" .)

unzip -tq "$site_zip"
unzip -tq "$design_system_zip"
unzip -tq "$claude_zip"
