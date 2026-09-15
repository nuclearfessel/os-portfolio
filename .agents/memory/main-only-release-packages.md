---
name: Main-only release packages
description: Required source-control boundary for GitHub website ZIP releases.
---

Release packages must be published only from `main`, and every published package must be part of a standard GitHub release. Each release contains two ZIP assets: a versioned combined site package with the design-system build at `/os-portfolio-ds/`, plus an unversioned Claude source package named exactly `claude-src-pack.zip`. Feature and maintenance branches must never create release packages or prereleases. GitHub must retain only the current release and one previous release.

**Why:** The user explicitly prohibited prerelease packages and branch-generated release artifacts, and limited release retention to two so old downloadable builds do not accumulate.

**How to apply:** Restrict automatic release triggers to `main`, guard manual runs against non-main refs, and never pass prerelease flags. Build and validate both required ZIP assets, attach them to the same release after approved work is merged to `main`, then delete all releases older than the newest two.