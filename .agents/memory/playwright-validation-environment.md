---
name: Playwright validation environment
description: Local browser-test validation may require restoring cached Playwright packages and browser binaries.
---

The desktop artifact can have Playwright declared in its package manifest while the local install lacks the runner link or browser binaries. Restore those from the workspace cache for validation rather than changing application dependencies. Playwright's downloaded WebKit build currently requires the Ubuntu `libjpeg.so.8` ABI, which the NixOS host does not provide even with its JPEG packages installed.

**Why:** The repository's package layout and environment provisioning can leave declared development tools unavailable even though the app itself type-checks and builds. Firefox can run after adding its native UI libraries, but WebKit fails at process launch on the missing JPEG ABI.

**How to apply:** When the desktop E2E script reports a missing runner or browser, check the workspace cache first, run the focused spec with the cached runner, and remove generated test reports before finishing. Run the WebKit project on a supported Linux host until its Playwright build is Nix-compatible; do not keep adding unrelated Nix packages after launch identifies `libjpeg.so.8` as the blocker.