---
name: Approved branch documentation sync
description: Required applicability review before committing and merging approved branch work.
---

After the user approves a branch and before it is committed and merged, review whether the approved change requires matching updates to the README, Claude instructions or skills, package metadata or exports, and package documentation. Apply every relevant update, but do not create unrelated churn when a surface is not applicable.

**Why:** The user explicitly requires approved changes to remain synchronized across user-facing documentation, agent guidance, and package surfaces.

**How to apply:** Add this review to the post-approval checklist. Confirm applicability from the actual branch diff, make any needed updates on the same branch, validate them, and only then commit and merge.