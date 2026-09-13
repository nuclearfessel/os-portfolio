---
name: Firefox sticky initialization
description: Prevent browser timing differences from corrupting persisted sticky geometry.
---

Unsaved stickies must initialize from explicit model dimensions and CSS positioning, not first-render DOM measurements. Reject persisted sticky dimensions below the interaction constraints together with their paired position.

**Why:** Firefox can run the geometry effect before the sticky’s authored width and position are applied during development loading. Measuring then captures an almost full-width absolute element and persists the distortion across reloads.

**How to apply:** When adding geometry initialization or recovery, use canonical defaults until saved user geometry exists. DOM measurements are appropriate only after an explicit interaction has begun or after validity checks confirm authored minimum dimensions.