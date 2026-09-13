---
name: Desktop drag state isolation
description: Why desktop launchers cannot share persisted drag identities with their corresponding windows.
---

Desktop launchers and windows that represent the same app must use separate position identities, even when they share one drag engine.

**Why:** Reusing an app ID for both surfaces couples their persisted coordinates, so moving a launcher can move its window. A separate launcher-only drag loop also produced inconsistent pointer-release behavior.

**How to apply:** Route launchers through the proven shared pointer-capture lifecycle, but namespace launcher position IDs independently from window IDs. Keep launcher-specific clamping, drop-time snapping, and post-drag launch suppression.