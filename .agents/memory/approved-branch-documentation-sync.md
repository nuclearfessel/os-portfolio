---
name: Approved branch documentation sync
description: Required applicability review before committing and merging approved branch work.
---

The exact plain-language response “Approved” is an immediate, mandatory post-approval workflow trigger. Never treat it as simple confirmation, never stop after acknowledging it, and never substitute a publish suggestion. Review whether the approved change requires matching updates to the README, Claude instructions or skills, package metadata or exports, and package documentation before committing and merging. Apply every relevant update, but do not create unrelated churn when a surface is not applicable.

**Why:** The user explicitly requires approved changes to remain synchronized across user-facing documentation, agent guidance, and package surfaces, and confirmed on September 14, 2026 that this trigger must never be missed.

**How to apply:** On “Approved,” begin this workflow in the same turn without asking for confirmation: inspect the actual branch diff, make applicable sync updates, validate, commit, merge to main, push GitHub, and confirm the main-only build/release workflow.