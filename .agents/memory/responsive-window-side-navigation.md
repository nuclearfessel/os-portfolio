---
name: Responsive window side navigation
description: Universal responsive contract for side navigation inside resizable Portfolio OS windows.
---

Every resizable Portfolio OS window with side navigation must use the window container width to drive a smooth responsive transformation. At narrow widths, the side navigation becomes a horizontal sub-navigation toolbar directly below the window toolbar, with content in a separate row below it.

**Why:** The user established this as a universal requirement for all current and future windows with side navigation, not a Settings-specific treatment.

**How to apply:** Preserve navigation DOM order, active state, accessible names, keyboard sequence, and content geometry. Use a container query rather than viewport width. Do not hide the navigation, move it above the window toolbar, or overlay it on content. Settings is the reference implementation and regression-test example.