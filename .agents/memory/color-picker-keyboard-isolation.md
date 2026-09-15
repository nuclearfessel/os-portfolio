---
name: Color picker keyboard isolation
description: Defines how desktop keyboard shortcuts behave while editing custom wallpaper color values.
---

When focus is inside a color-picker value field, number keys are text entry only and must not trigger the desktop’s numbered app shortcuts.

**Why:** RGB, HSV, and HSL values require numeric typing; opening or focusing Dock apps during entry corrupts the editing flow.

**How to apply:** Keep the `1`, `2`, `3`, and `4` desktop shortcuts inactive for color-picker fields while preserving normal input and validation behavior.