---
name: Approved branch documentation sync
description: Required applicability review before committing and merging approved branch work.
---

After the user approves a branch—including a plain chat response such as “Approved”—review whether the approved change requires matching updates to the README, Claude instructions or skills, package metadata or exports, and package documentation before committing and merging. Apply every relevant update, but do not create unrelated churn when a surface is not applicable.

**Why:** The user explicitly requires approved changes to remain synchronized across user-facing documentation, agent guidance, and package surfaces.

**How to apply:** Treat plain-language approval as the post-approval workflow trigger, not only as design confirmation. Confirm applicability from the actual branch diff, make needed updates on the same branch, validate, commit, merge to main, push GitHub, and confirm the main-only build/release workflow.