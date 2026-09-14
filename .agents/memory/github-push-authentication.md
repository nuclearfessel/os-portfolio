---
name: GitHub push authentication
description: Replit-specific GitHub authentication behavior for command-line pushes from this workspace.
---

GitHub integrations can create repositories through the API while Git commands in the Shell remain unauthenticated. When that happens, authenticate GitHub CLI through its browser flow using HTTPS before retrying the push.

**Why:** The connected GitHub App and OAuth connector both reported healthy, but credentials were not injected into shell Git operations. Browser-based GitHub CLI authentication successfully enabled the push.

**How to apply:** If a future shell push reports an invalid username/token while the GitHub integration is healthy, check GitHub CLI authentication. Do not request or handle tokens in chat.