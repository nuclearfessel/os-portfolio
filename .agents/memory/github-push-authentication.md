---
name: GitHub push authentication
description: Replit-specific GitHub authentication behavior for command-line pushes from this workspace.
---

GitHub integrations can remain healthy for reads while individual write paths fail. REST Git Data may return unexplained 404s, the contents API may be blocked by the connector proxy, and `CreateCommitOnBranch` may be unavailable to the connected account. Shell Git can also remain unauthenticated.

**Why:** A release migration succeeded for release and tag updates, but four separate commit-publication paths failed despite healthy branch reads. This was not evidence of an expired credential, and repeated endpoint changes did not resolve it.

**How to apply:** Classify failures by endpoint. Do not request reauthorization for proxy blocks, unexplained endpoint 404s, or missing GraphQL mutation permissions. After several distinct publication paths fail, stop with local work intact. If shell push is the fallback, check GitHub CLI authentication through its browser flow; never request or handle tokens in chat.