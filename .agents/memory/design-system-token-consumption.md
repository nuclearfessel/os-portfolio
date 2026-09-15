---
name: Design-system token consumption
description: Why product-only palette values should use generated tokens instead of importing the complete design-system stylesheet.
---

Consume isolated shared values through the generated token object when the product does not already load the complete design-system theme.

**Why:** Importing the full design-system stylesheet only to obtain new CSS variables can alter global product rendering and unrelated visual calculations.

**How to apply:** Use the portable generated token export for product-owned CSS variables and inline styles. Reserve the full stylesheet import for products intentionally adopting the complete theme.