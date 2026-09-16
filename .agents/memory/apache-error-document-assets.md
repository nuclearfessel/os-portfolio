---
name: Apache error document assets
description: Asset-path requirements for custom Apache error pages in a relative-base Vite build.
---

Custom Apache error pages must be self-contained and must not depend on relative asset paths. Use inline critical CSS and canonical absolute URLs for shared images, icons, and navigation.

**Why:** Apache serves an `ErrorDocument` while the browser retains the original failed directory URL. Relative resources then resolve beneath that failed directory. Vite also rewrites root-based resources to relative paths when the project uses `base: './'`.

**How to apply:** For standalone error documents, inline the page styles and verify the built HTML has no stylesheet dependency. Use canonical absolute asset and CTA URLs, then test the generated HTML rather than only the source file.