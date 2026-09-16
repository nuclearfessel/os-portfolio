#!/usr/bin/env bash

set -uo pipefail

browser="${1:-}"

case "$browser" in
  firefox)
    port=4175
    project="firefox-storage-recovery"
    ;;
  webkit)
    port=4176
    project="webkit-storage-recovery"
    ;;
  *)
    printf 'Usage: %s <firefox|webkit>\n' "${0##*/}" >&2
    exit 2
    ;;
esac

run_phase() {
  local phase="$1"
  shift

  printf '::group::%s recovery — %s\n' "$browser" "$phase"
  "$@"
  local status=$?
  printf '::endgroup::\n'

  if (( status != 0 )); then
    printf 'Recovery failed during phase: %s (%s)\n' "$phase" "$browser" >&2
    printf '::error title=%s recovery failed::Phase: %s\n' "$browser" "$phase" >&2
    exit "$status"
  fi
}

run_phase \
  "Playwright launcher configuration" \
  pnpm run test:playwright-config

run_phase \
  "storage recovery browser run" \
  env \
    "PLAYWRIGHT_PORT=$port" \
    "PLAYWRIGHT_OUTPUT_DIR=test-results/$browser-recovery" \
    "PLAYWRIGHT_REPORT_DIR=playwright-report/$browser-recovery" \
    playwright test "--project=$project"