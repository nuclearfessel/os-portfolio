# Pattern: Accessibility Preference Panel

**Preview:** `os-portfolio-settings` (Accessibility section), `accessibility` (foundation page)

---

## Intent

A dedicated settings pane where users control visual accessibility preferences — scrollbar visibility, system-wide transparency and blur switches, UI animations, animation speed, and contrast theme. Transparency and blur levels belong in Personalization. All controls are visual-only; the consuming product applies their effects to the DOM.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `SettingsSectionHeader` | `settings.tsx` | Group heading + description |
| `SettingsDivider` | `settings.tsx` | Section separator |
| `SettingsToggleRow` | `settings.tsx` | Boolean preference (on/off) |
| Native three-step range | Product | Less / Default / More speed selection |
| `SettingsContrastCard` | `settings.tsx` | Contrast theme selector |

---

## Anatomy / section structure

```
Display
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ┌─────────────────────────────────────────┐
  │ Always show scrollbars          [○────] │  ← SettingsToggleRow
  └─────────────────────────────────────────┘
  ┌─────────────────────────────────────────┐
  │ Transparency effects            [●────] │  ← SettingsToggleRow
  └─────────────────────────────────────────┘
  ┌─────────────────────────────────────────┐
  │ Blur effects                    [●────] │  ← SettingsToggleRow
  └─────────────────────────────────────────┘

Motion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ┌─────────────────────────────────────────┐
  │ UI animations                   [●────] │  ← SettingsToggleRow
  └─────────────────────────────────────────┘
  Less ──────────●────────── More              ← three-step range, Default centered

Contrast
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Standard] [Low contrast] [High contrast]  ← SettingsContrastCard × 3 (in radiogroup)
```

---

## State ownership

All preference values are owned by the consuming product. The panel only reflects and updates them.

| Preference | Component | Product effect |
|---|---|---|
| Always show scrollbars | `SettingsToggleRow` | Set/remove `data-always-scrollbars` on shell; persistent mode keeps the same window scrollbar styling |
| Transparency effects on | `SettingsToggleRow` | Set/remove `data-transparency-enabled` on `:root`; applies to all translucent system surfaces |
| Blur effects on | `SettingsToggleRow` | Set/remove `data-no-blur` and set `--surface-blur` on `:root`; available only while transparency is on |
| UI animations on | `SettingsToggleRow` | Set/remove `data-no-animations` on shell |
| Animation speed | Three-step range | Set/remove `data-anim-speed` on shell |
| Contrast theme | `SettingsContrastCard` | Set/remove `data-contrast` on `:root`; uses an independent presentation baseline and disables regular theme, wallpaper, motion, transparency, and blur controls |

See → [State contracts](../references/components/settings.md#state-contracts)

---

## Dependency rules (consuming product)

1. **Motion, transparency, and blur are disabled when any contrast theme is active.** Show all three toggles off and pass `disabled` when `contrastTheme !== 'none'`. Preserve their saved Standard values for restoration.
2. **Blur depends on transparency in Standard mode.** When Transparency effects is off, show Blur effects off and disabled and apply `data-no-blur`. Preserve the saved Blur preference and restore it when Transparency is turned back on.
3. **Regular themes are disabled when any contrast theme is active.** Keep Light and Dark visible but disabled, preserve the saved regular theme, and restore it when Standard is selected.
4. **Wallpaper controls are disabled when any contrast theme is active.** Preserve the saved wallpaper preference for restoration in Standard.
5. **Animation speed is hidden/disabled when animations are off or contrast is active.** Only show the three-step range when `uiAnimations === true && contrastTheme === 'none'`.
6. **Effect levels belong in Personalization.** Show window and sticky transparency controls when Transparency effects is on, and show the blur control only when both Transparency effects and Blur effects are on.
7. **Three controls share one wide row.** At the product's large Settings-window breakpoint, window transparency, sticky transparency, and blur use three equal columns. At narrower widths, each uses its own row.
8. **Default scrollbars are contextual.** Apply `portfolio-scrollbar-window` to each window so scrollbar thumbs fade in on window hover/focus and fade out when idle. `data-always-scrollbars` keeps those same thumbs visible; tracks stay transparent.

---

## Accessibility checklist

- [ ] Each `SettingsToggleRow` has a unique `id` and descriptive `label`.
- [ ] Disabled toggles have `disabled` prop — visible but inert (not hidden).
- [ ] The range has an accessible "Animation speed" label and announces Less, Default, or More for its current value.
- [ ] `SettingsContrastCard` parent has `role="radiogroup" aria-label="Contrast theme"`.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Show motion, transparency, and blur toggles off and disabled when contrast is active | Mutate or discard their saved Standard preferences |
| Disable regular theme and wallpaper controls while preserving their saved values | Mutate Light/Dark or wallpaper preferences when contrast mode changes |
| Show all sections even when some controls are disabled | Collapse entire sections |
| Apply DOM attributes immediately on change | Require a "Save" step |
| Let the package CSS enforce opaque, blur-free, motion-free contrast effects automatically | Manually override individual component effects for contrast mode |
