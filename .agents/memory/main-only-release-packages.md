---
name: Main-only release packages
description: Required source-control boundary for GitHub website ZIP releases.
---

Release packages must be published only from `main`, and every published package must be part of a standard GitHub release. Each release contains three ZIP assets: versioned portfolio and design-system site packages plus an unversioned Claude source package named exactly `claude-src-pack.zip`. Feature and maintenance branches must never create release packages or prereleases.

**Why:** The user explicitly prohibited prerelease packages and branch-generated release artifacts.

**How to apply:** Restrict automatic release triggers to `main`, guard manual runs against non-main refs, and never pass prerelease flags. Build and validate all three required ZIP assets, then attach them to the same release after approved work is merged to `main`.