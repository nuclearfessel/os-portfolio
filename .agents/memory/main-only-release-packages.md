---
name: Main-only release packages
description: Required source-control boundary for GitHub website ZIP releases.
---

Release packages must be published only from `main`, and every published package must be part of a standard GitHub release. Each release contains two ZIP assets: a versioned site package and an unversioned Claude source package named exactly `claude-src-pack.zip`. Feature and maintenance branches must never create release packages or prereleases. Keep only the three newest releases public and mark older releases as drafts rather than deleting them.

**Why:** The user explicitly prohibited prerelease packages and branch-generated release artifacts.

**How to apply:** Restrict automatic release triggers to `main`, guard manual runs against non-main refs, and never pass prerelease flags. Build and validate both required ZIP assets, attach both to the same release after approved work is merged to `main`, then draft every public release older than the newest three.