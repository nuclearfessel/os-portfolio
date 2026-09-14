# Settings primitives — Family Reference

**Source:** `src/components/ui/settings.tsx`
**Preview page:** `portfolio-os-settings`

This is the canonical family spec for all settings primitives. The detailed reference (including all state contracts, fixed-palette token table, and consuming-app attribute mapping) lives at:

→ **[docs/references/components/settings.md](../../references/components/settings.md)**

---

## Component quick reference

| Component | Export | Purpose |
|---|---|---|
| `SettingsNavSection` | `SettingsNavSection` | `<nav>` landmark for settings sidebar navigation |
| `SettingsNavItem` | `SettingsNavItem` | Individual sidebar nav button with icon and active state |
| `SettingsToggleRow` | `SettingsToggleRow` | Accessible boolean preference row (label + pill switch) |
| `SettingsSliderGroup` | `SettingsSliderGroup` | Range slider with live value output and guidance labels |
| `SettingsSegmentedChoice` | `SettingsSegmentedChoice` | Exclusive radio chip group (Less/Default/More) |
| `SettingsContrastCard` | `SettingsContrastCard` | Selectable contrast theme card with preview miniature |
| `SettingsColorPreset` | `SettingsColorPreset` | Selectable solid-color wallpaper preset swatch |
| `SettingsDivider` | `SettingsDivider` | `<hr>` separator between settings sections |
| `SettingsSectionHeader` | `SettingsSectionHeader` | Label + description header for settings sub-groups |

## Individual component specs

- [SettingsNavSection / SettingsNavItem](./settings-nav.md)
- [SettingsToggleRow](./settings-toggle-row.md)
- [SettingsSliderGroup](./settings-slider-group.md)
- [SettingsSegmentedChoice](./settings-segmented-choice.md)
- [SettingsContrastCard](./settings-contrast-card.md)
- [SettingsColorPreset](./settings-color-preset.md)
- [SettingsDivider](./settings-divider.md)
- [SettingsSectionHeader](./settings-section-header.md)

## Design principle

All settings primitives are **visual-only**. Product behavior — localStorage persistence, wallpaper updates, desktop orchestration, and "Save State as Default" / "Reset Desktop" — lives in the consuming app only.

See → [Saved-state ownership pattern](../../patterns/saved-state-ownership.md)
