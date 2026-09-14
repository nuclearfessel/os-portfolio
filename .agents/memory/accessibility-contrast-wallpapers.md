---
name: Accessibility contrast wallpapers
description: Defines how fixed accessibility contrast palettes interact with desktop wallpaper preferences.
---

Low and High Contrast use fixed system backgrounds and disable wallpaper controls, but they do not modify the saved picture/solid-color selection.

**Why:** Returning to Standard must restore exactly what the user had chosen, and Reset Desktop must not be overwritten by a delayed restoration effect.

**How to apply:** Override wallpaper rendering while a contrast theme is active; leave wallpaper preference state untouched and reveal it again in Standard.