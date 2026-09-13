---
name: Responsive Dock labels
description: Presentation rule separating desktop Dock tooltips from responsive inline labels.
---

Desktop Dock labels use the shared tooltip surface. Mobile and tablet Dock labels are always-visible inline text with no tooltip background, border, shadow, or extra padding.

**Why:** The user confirmed this separation fixed the unintended colored halo on responsive Dock labels.

**How to apply:** Keep the two label presentations explicit in the design system and select between them from responsive workspace state. Never let desktop tooltip appearance cascade onto inline labels.

For shared tooltip surfaces rendered from a workspace package, do not rely on a class string composed in a transitive module being discovered by the consuming Tailwind build. Keep a concrete semantic selector in the consumer stylesheet or otherwise ensure the package source is scanned, and verify computed styles against the other tooltip surfaces.