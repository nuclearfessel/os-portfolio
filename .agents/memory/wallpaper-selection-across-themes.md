---
name: Wallpaper selection across themes
description: Defines how desktop wallpaper preferences behave when the user changes appearance themes.
---

Wallpaper type is one shared preference across light and dark themes. If the user selects a solid color, switching themes must keep that color active. If the user selects picture mode, switching themes keeps picture mode while loading the appropriate theme image.

**Why:** Separate light and dark wallpaper modes caused theme switching to replace a user-selected solid color with the other theme’s default picture.

**How to apply:** Any personalization or persistence change must keep wallpaper mode and custom color synchronized across themes; only the picture asset itself varies by theme.