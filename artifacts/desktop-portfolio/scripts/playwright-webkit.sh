#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
webkitgtk_out="$(nix-build '<nixpkgs>' -A webkitgtk_6_0 --no-out-link)"
icu74_out="$(nix-build '<nixpkgs>' -A icu74 --no-out-link)"
libjpeg8_out="$(nix-build '<nixpkgs>' -A libjpeg8 --no-out-link)"
libmanette_out="$(nix-build '<nixpkgs>' -A libmanette --no-out-link)"
libsecret_out="$(nix-build '<nixpkgs>' -A libsecret --no-out-link)"
libglvnd_out="$(nix-build '<nixpkgs>' -A libglvnd --no-out-link)"
x264_out="$(nix-build '<nixpkgs>' -A x264 --no-out-link)"
hyphen_out="$(nix-build '<nixpkgs>' -A hyphen --no-out-link)"

webkit_runner="$(
  find "$repo_root/.cache/ms-playwright" -mindepth 2 -maxdepth 2 -type f -name pw_run.sh -path '*/webkit-*/*' |
    sort -V |
    tail -n 1
)"

if [[ -z "$webkit_runner" ]]; then
  echo "Playwright WebKit is not installed. Run: pnpm exec playwright install webkit" >&2
  exit 1
fi

webkit_bundle="$(dirname "$webkit_runner")"
minibrowser_variant="minibrowser-gtk"
if [[ " $* " == *" --headless "* ]]; then
  minibrowser_variant="minibrowser-wpe"
fi
minibrowser="$webkit_bundle/$minibrowser_variant/bin/MiniBrowser"

mapfile -t missing_libraries < <(
  ldd "$minibrowser" 2>&1 |
    awk '$2 == "=>" && $3 == "not" && $4 == "found" { print $1 }'
)

mapfile -t closure_packages < <(
  nix-store -qR \
    "$webkitgtk_out" \
    "$icu74_out" \
    "$libjpeg8_out" \
    "$libmanette_out" \
    "$libsecret_out" \
    "$libglvnd_out" \
    "$x264_out" \
    "$hyphen_out" |
    awk '!seen[$0]++'
)
runtime_libs=()
for package in "${closure_packages[@]}"; do
  [[ -d "$package/lib" ]] || continue
  for library in "${missing_libraries[@]}"; do
    if [[ -e "$package/lib/$library" ]]; then
      runtime_libs+=("$package/lib")
      break
    fi
  done
done

if [[ ${#runtime_libs[@]} -eq 0 ]]; then
  echo "Unable to resolve the WebKit runtime libraries reported missing by ldd." >&2
  exit 1
fi

runtime_path="$(
  IFS=:
  printf '%s' "${runtime_libs[*]}"
)"
minibrowser_root="$webkit_bundle/$minibrowser_variant"

export WEBKIT_EXEC_PATH="$minibrowser_root/bin"
export WEBKIT_INJECTED_BUNDLE_PATH="$minibrowser_root/lib"
export WEBKIT_INSPECTOR_RESOURCES_PATH="$minibrowser_root/share"
export LD_LIBRARY_PATH="$minibrowser_root/lib:$minibrowser_root/sys/lib:$runtime_path${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"

if [[ ${PLAYWRIGHT_WEBKIT_VALIDATE_LIBS:-0} == 1 ]]; then
  ldd "$minibrowser"
  exit
fi

exec "$minibrowser" "$@"