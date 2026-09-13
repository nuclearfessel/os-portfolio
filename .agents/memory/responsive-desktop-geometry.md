---
name: Responsive desktop geometry
description: Why adaptive layouts must not replace saved freeform desktop positions and sizes.
---

Responsive tablet and mobile layout is temporary presentation state. Preserve the last desktop window, sticky, launcher, and dock geometry while another workspace mode is active, then restore it when desktop mode returns.

**Why:** Orientation and breakpoint changes can otherwise persist constrained or managed-layout coordinates over a desktop arrangement the user intentionally created.

**How to apply:** Any future responsive interaction or reclamping change must write temporary geometry outside desktop mode and keep persisted desktop geometry unchanged.