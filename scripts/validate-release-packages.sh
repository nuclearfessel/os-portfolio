#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
site_zip="${1:-site-package-validation.zip}"
claude_zip="${2:-claude-src-pack.zip}"

absolute_output() {
  local output="$1"

  if [[ "$output" = /* ]]; then
    printf '%s\n' "$output"
  else
    printf '%s/%s\n' "$repo_root" "$output"
  fi
}

site_zip="$(absolute_output "$site_zip")"
claude_zip="$(absolute_output "$claude_zip")"

cd "$repo_root"

pnpm --filter @workspace/os-portfolio run typecheck
pnpm --filter @workspace/os-portfolio run build
pnpm --filter @workspace/os-portfolio-ds run typecheck
pnpm --filter @workspace/os-portfolio-ds run build

if [[ -n "${VITE_APP_VERSION:-}" ]] \
  && ! grep -Fq -- "$VITE_APP_VERSION" artifacts/os-portfolio/dist/public/assets/*.js; then
  printf 'Portfolio production bundle is missing release version %s.\n' "$VITE_APP_VERSION" >&2
  exit 1
fi

if ! grep -REq '(^|[;{])backdrop-filter:blur\(' artifacts/os-portfolio/dist/public/assets/*.css; then
  printf 'Desktop production CSS is missing the standard backdrop-filter blur declaration.\n' >&2
  exit 1
fi

if ! grep -REq '(^|[;{])backdrop-filter:blur\(' artifacts/os-portfolio-ds/dist/assets/*.css; then
  printf 'Design-system production CSS is missing the standard backdrop-filter blur declaration.\n' >&2
  exit 1
fi

stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

cp -R artifacts/os-portfolio/dist/public/. "$stage/"
mkdir -p "$stage/os-portfolio-ds"
cp -R artifacts/os-portfolio-ds/dist/. "$stage/os-portfolio-ds/"

rm -f "$site_zip"
(cd "$stage" && zip -qr "$site_zip" .)
bash scripts/package-claude-source.sh "$claude_zip"

unzip -tq "$site_zip"
unzip -tq "$claude_zip"

site_manifest="$stage/site-manifest.txt"
claude_manifest="$stage/claude-manifest.txt"
unzip -Z1 "$site_zip" > "$site_manifest"
unzip -Z1 "$claude_zip" > "$claude_manifest"

grep -Fxq 'index.html' "$site_manifest"
grep -Fxq 'os-portfolio-ds/index.html' "$site_manifest"
grep -Fxq 'public/index.html' "$claude_manifest"
grep -Fxq 'public/os-portfolio-ds/index.html' "$claude_manifest"
