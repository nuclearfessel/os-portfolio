---
name: Playwright validation environment
description: Local browser-test validation may require restoring cached Playwright packages and browser binaries.
---

The desktop artifact can have Playwright declared in its package manifest while the local install lacks both the runner link and Chromium binary. Restore those from the workspace cache for validation rather than changing application dependencies.

**Why:** The repository's package layout and environment provisioning can leave declared development tools unavailable even though the app itself type-checks and builds.

**How to apply:** When the desktop E2E script reports a missing runner or browser, check the workspace cache first, run the focused spec with the cached runner, and remove generated test reports before finishing.