# Pattern: Accessibility Preference Panel

**Preview:** `fes-os-settings` (Accessibility section), `accessibility` (foundation page)

---

## Intent

A dedicated settings pane where users control visual accessibility preferences — scrollbar visibility, the system-wide transparency master switch, UI animations, animation speed, and contrast theme. Transparency levels belong in Personalization. All controls are visual-only; the consuming product applies their effects to the DOM.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `SettingsSectionHeader` | `settings.tsx` | Group heading + description |
| `SettingsDivider` | `settings.tsx` | Section separator |
| `SettingsToggleRow` | `settings.tsx` | Boolean preference (on/off) |
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
  │ Transparency effects            [●────] │  ← SettingsToggleRow
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
| Transparency effects on | `SettingsToggleRow` | Set/remove `data-transparency-enabled` on `:root`; applies to all translucent system surfaces |
| UI animations on | `SettingsToggleRow` | Set/remove `data-no-animations` on shell |
| Animation speed | `SettingsSegmentedChoice` | Set/remove `data-anim-speed` on shell |
| Contrast theme | `SettingsContrastCard` | Set/remove `data-contrast` on `:root`; forces transparency off |

See → [State contracts](../references/components/settings.md#state-contracts)

---

## Dependency rules (consuming product)

1. **Transparency is disabled when any contrast theme is active.** Pass `disabled` to the transparency `SettingsToggleRow` when `contrastTheme !== 'none'`.
2. **Animation speed is hidden/disabled when animations are off.** Only show `SettingsSegmentedChoice` when `uiAnimations === true`.
3. **Transparency levels belong in Personalization.** Show window and sticky level controls there only when the global transparency switch is on.

---

## Accessibility checklist

- [ ] Each `SettingsToggleRow` has a unique `id` and descriptive `label`.
- [ ] Disabled toggles have `disabled` prop — visible but inert (not hidden).
- [ ] `SettingsSegmentedChoice` has `groupLabel` set to "Animation speed".
- [ ] `SettingsContrastCard` parent has `role="radiogroup" aria-label="Contrast theme"`.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Disable transparency toggle when contrast is active | Hide the transparency toggle |
| Show all sections even when some controls are disabled | Collapse entire sections |
| Apply DOM attributes immediately on change | Require a "Save" step |
| Let the package CSS handle contrast/animation effects automatically | Manually override individual component styles for contrast mode |
