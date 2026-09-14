# Pattern: Accessibility Preference Panel

**Preview:** `fes-os-settings` (Accessibility section), `accessibility` (foundation page)

---

## Intent

A dedicated settings pane where users control visual accessibility preferences — scrollbar visibility, window transparency, UI animations, animation speed, and contrast theme. All controls are visual-only; the consuming product applies their effects to the DOM.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `SettingsSectionHeader` | `settings.tsx` | Group heading + description |
| `SettingsDivider` | `settings.tsx` | Section separator |
| `SettingsToggleRow` | `settings.tsx` | Boolean preference (on/off) |
| `SettingsSliderGroup` | `settings.tsx` | Range slider for transparency level |
| `SettingsSegmentedChoice` | `settings.tsx` | Exclusive speed selection |
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
  │ Window transparency effects     [●────] │  ← SettingsToggleRow
  └─────────────────────────────────────────┘
  ┌─────────────────────────────────────────┐  ← conditional (only when transparency on)
  │ Transparency level         [35%]        │
  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │  ← SettingsSliderGroup
  │ Subtle              More transparent    │
  └─────────────────────────────────────────┘

Motion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ┌─────────────────────────────────────────┐
  │ UI animations                   [●────] │  ← SettingsToggleRow
  └─────────────────────────────────────────┘
  [Less] [Default] [More]                     ← SettingsSegmentedChoice (when animations on)

Contrast
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Standard] [Low contrast] [High contrast]  ← SettingsContrastCard × 3 (in radiogroup)
```

---

## State ownership

All preference values are owned by the consuming product. The panel only reflects and updates them.

| Preference | Component | Product effect |
|---|---|---|
| Always show scrollbars | `SettingsToggleRow` | Set/remove `data-always-scrollbars` on shell |
| Window transparency on | `SettingsToggleRow` | Set/remove `data-transparency-enabled` on `:root`; disable when contrast active |
| Transparency level | `SettingsSliderGroup` | Set `--accessibility-transparency` on `:root` |
| UI animations on | `SettingsToggleRow` | Set/remove `data-no-animations` on shell |
| Animation speed | `SettingsSegmentedChoice` | Set/remove `data-anim-speed` on shell |
| Contrast theme | `SettingsContrastCard` | Set/remove `data-contrast` on `:root`; forces transparency off |

See → [State contracts](../references/components/settings.md#state-contracts)

---

## Dependency rules (consuming product)

1. **Transparency is disabled when any contrast theme is active.** Pass `disabled` to the transparency `SettingsToggleRow` when `contrastTheme !== 'none'`.
2. **Animation speed is hidden/disabled when animations are off.** Only show `SettingsSegmentedChoice` when `uiAnimations === true`.
3. **Transparency slider is conditional.** Only show `SettingsSliderGroup` when `windowTransparency === true`.

---

## Accessibility checklist

- [ ] Each `SettingsToggleRow` has a unique `id` and descriptive `label`.
- [ ] Disabled toggles have `disabled` prop — visible but inert (not hidden).
- [ ] `SettingsSegmentedChoice` has `groupLabel` set to "Animation speed".
- [ ] `SettingsContrastCard` parent has `role="radiogroup" aria-label="Contrast theme"`.
- [ ] `SettingsSliderGroup` `<output>` announces value changes via `aria-live="polite"`.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Disable transparency toggle when contrast is active | Hide the transparency toggle |
| Show all sections even when some controls are disabled | Collapse entire sections |
| Apply DOM attributes immediately on change | Require a "Save" step |
| Let the package CSS handle contrast/animation effects automatically | Manually override individual component styles for contrast mode |
