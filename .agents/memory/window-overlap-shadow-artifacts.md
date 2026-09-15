---
name: Window overlap shadow artifacts
description: Browser repaint artifacts caused by large external shadows on overlapping draggable window surfaces.
---

Keep the normal external shadow on idle draggable translucent windows, but suppress it on the window being dragged or resized. Keep its edge highlight inside the surface during the interaction.

**Why:** Chromium and Firefox can leave a stale blurred edge on lower overlapping windows while a floating surface changes geometry. Removing shadows from every window fixes it but unnecessarily flattens stationary windows.

**How to apply:** Track the active window interaction separately from its normal active/focused state. Verify idle, dragging, resizing, and pointer-release states in both Chromium and Firefox before changing the shadow treatment.