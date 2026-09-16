---
name: Design-system token consumption
description: Why product-only palette values should use generated tokens instead of importing the complete design-system stylesheet.
---

An isolated design-system component must ship every generated token mapping its stylesheet depends on; do not assume the consumer also imports the complete theme.

**Why:** Importing the full design-system stylesheet only to obtain component variables can alter unrelated product rendering, while omitting those mappings makes variable-driven fills and strokes disappear.

**How to apply:** Bundle a narrow, generated mapping stylesheet with isolated component CSS. Use the portable token object for product-owned values, and reserve the full theme for products intentionally adopting it.