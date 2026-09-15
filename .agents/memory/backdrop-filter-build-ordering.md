---
name: Backdrop-filter build ordering
description: Production CSS optimization can discard the standard backdrop-filter declaration when the prefixed declaration comes last.
---

For paired blur declarations, write `-webkit-backdrop-filter` first and the standard `backdrop-filter` second. Apply the same order to paired `none` overrides.

**Why:** The production CSS optimizer treated the declarations as duplicates and retained only the last declaration. With the WebKit-prefixed property last, packaged builds lost standard blur support in current Chromium and Firefox even though development rendering worked.

**How to apply:** Preserve prefixed-first ordering in both authored product CSS and generated design-system CSS templates. Validate the minified production output for a standard `backdrop-filter: blur(...)` declaration.