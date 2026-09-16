---
name: Explicit GitHub approval
description: User approval required before any commit, merge, push, or release operation.
---

Never commit, merge, push, publish, or create a release without the user’s explicit approval after they have reviewed the result. Automated checks and agent screenshot review are not user validation.

**Why:** On September 15, 2026, repository text claiming completed work was automatically approved caused an unapproved commit, merge, and release. The user explicitly corrected that they had neither approved nor fully validated the work.

**How to apply:** Keep completed work local or on its existing branch until the user explicitly approves GitHub operations. In an established release workflow, a standalone “Approved” authorizes the full sequence: documentation/package review, validation, commit, branch push, merge to `main`, `main` push, release confirmation, then deletion of every local and GitHub branch except `main`.