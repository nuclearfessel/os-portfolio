---
name: UI geometry stability
description: Project-wide invariant for resizing, alignment, and neighboring layout behavior.
---

For every UI artifact and element, alignment and sizing changes must preserve geometric stability. Resizing or repositioning one part must not misalign that part, shift unrelated parts, distort neighboring elements, or introduce layout regressions.

**Why:** The user explicitly established this as a project-wide requirement after track thickness changes repeatedly displaced slider handles.

**How to apply:** Separate visual dimensions from alignment anchors and interaction geometry. Use explicit centerlines, stable containers, and independent sizing where needed. Verify the changed element and its neighbors at relevant sizes before delivery.