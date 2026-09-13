---
name: Firefox launcher pointer capture
description: Prevent released launcher drags from hijacking later interactions in Firefox.
---

During a captured desktop-launcher drag, treat a pointer move with no primary button as the end of the drag and explicitly release pointer capture.

**Why:** Firefox can report `buttons=0` after a launcher reaches a constrained edge without delivering the expected release event immediately. The stale capture can redirect the next click and move the launcher to an unrelated menu cursor position.

**How to apply:** Keep this safeguard specific to desktop launchers. Do not apply it broadly to sticky or window gestures because browser automation can synthesize their pointer-button state differently.