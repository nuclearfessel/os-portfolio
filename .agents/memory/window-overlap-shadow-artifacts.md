---
name: Window overlap shadow artifacts
description: Browser repaint artifacts caused by large external shadows on overlapping draggable window surfaces.
---

Avoid large external blur shadows on draggable translucent windows. Keep any window highlight inside the surface instead.

**Why:** Chromium and Firefox can leave a stale blurred edge on lower overlapping windows during pointer movement, including movement without a drag and with transparency or blur disabled.

**How to apply:** When changing window elevation, prefer borders or inset highlights. Verify overlapping-window pointer movement in both Chromium and Firefox before restoring an external shadow.