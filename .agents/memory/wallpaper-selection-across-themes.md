---
name: Wallpaper selection across themes
description: Defines how desktop wallpaper preferences behave when the user changes appearance themes.
---

Wallpaper type is one shared preference across light and dark themes. Solid-color mode keeps separate Light and Dark colors, initially `#E8F0EC` and `#111326`, and exposes both as selectable presets. Picture mode loads the appropriate theme image.

**Why:** Separate light and dark wallpaper modes caused theme switching to replace a user-selected solid color with the other theme’s default picture. The user explicitly confirmed theme-specific colors with shared mode as the intended behavior.

**How to apply:** Keep picture-versus-solid mode synchronized across themes, but preserve and edit each theme’s color independently. Switching themes must never switch back to picture mode.