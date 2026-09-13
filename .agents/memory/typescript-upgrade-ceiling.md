---
name: TypeScript upgrade ceiling
description: Compatibility constraint between the workspace TypeScript version and Orval's TypeDoc dependency.
---

Keep TypeScript on the newest release accepted by the TypeDoc version installed through Orval. Do not upgrade to a newer TypeScript major while that peer range rejects it.

**Why:** A workspace-wide latest-package upgrade selected TypeScript 7 while Orval's TypeDoc dependency accepted only through TypeScript 6, leaving an invalid peer graph despite successful compilation.

**How to apply:** Check Orval and TypeDoc peer ranges during dependency upgrades. Raise the TypeScript major only after the installed documentation toolchain declares support.