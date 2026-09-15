---
name: Accessibility contrast wallpapers
description: Defines how fixed accessibility contrast palettes interact with desktop wallpaper preferences.
---

Low and High Contrast use a fixed, regular-theme-independent presentation baseline and disable regular theme and wallpaper controls, but they do not modify the saved light/dark theme or picture/solid-color selection.

**Why:** Retaining the light presentation class underneath High Contrast allows light-theme selectors to break the fixed contrast palette. Returning to Standard must still restore exactly what the user had chosen, and Reset Desktop must not be overwritten by a delayed restoration effect.

**How to apply:** Use the contrast presentation baseline while a contrast theme is active, guard regular theme changes, override wallpaper rendering, and leave the saved regular theme and wallpaper preferences untouched for restoration in Standard.