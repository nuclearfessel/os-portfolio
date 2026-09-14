---
name: Main-only release packages
description: Required source-control boundary for GitHub website ZIP releases.
---

Website ZIP packages must be published only from `main`, and every published package must be a standard GitHub release. Feature and maintenance branches must never create release packages or prereleases.

**Why:** The user explicitly prohibited prerelease packages and branch-generated release artifacts.

**How to apply:** Restrict automatic release triggers to `main`, guard manual runs against non-main refs, and never pass prerelease flags. Validate branch work locally, then publish the next package only after approved work is merged to `main`.