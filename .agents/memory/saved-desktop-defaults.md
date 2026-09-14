---
name: Saved desktop defaults
description: Defines the complete state required when users overwrite the desktop reset baseline.
---

“Save state as default” must capture the complete workspace snapshot: geometry, window visibility, active window, maximized state, full stacking order, sticky collection and visibility, active sticky, and desktop preferences.

**Why:** A partial snapshot appeared to work for simple position changes but later resets mixed the newly saved geometry with the original open-window and sticky state.

**How to apply:** Any state that Reset desktop changes must also be represented in the saved-default snapshot, validated on load, overwritten atomically, and covered by a repeated save-mutate-reset test.