# SettingsColorPreset

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/settings`
**Preview page:** `os-portfolio-settings`

---

## Purpose

A selectable solid-color swatch for wallpaper/background personalization. Two presets ship by default:
- **Light default** `#E8F0EC` — muted sage (CSS var: `--fixed-wallpaper-light`)
- **Dark default** `#111326` — deep navy (CSS var: `--fixed-wallpaper-dark`)

---

## Anatomy

```
┌──────┐
│      │  ← size-12 swatch (background: color; border-2/border-primary when selected)
│  ✓   │     check mark auto-contrasted via isLightColor()
└──────┘
Light default  ← display name text
```

---

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `color` | `string` | ✓ | Hex color for the swatch background |
| `label` | `string` | ✓ | `aria-label` (e.g. `"Light default, #e8f0ec"`) |
| `name` | `string` | ✓ | Visible name shown below the swatch |
| `selected` | `boolean` | ✓ | Whether this preset is currently selected |
| `onSelect` | `() => void` | ✓ | Called when the preset is activated |
| `disabled` | `boolean` | — | Makes the preset visible but inert, such as while a contrast theme is active |
| `data-testid` | `string` | — | Applied to the root button |
| `className` | `string` | — | Merged |

---

## Interactive states

| State | Visual |
|---|---|
| Unselected | `border-border/40` swatch border |
| Selected | `border-2 border-primary` + primary shadow ring + check mark |
| Focus-visible | `outline-2 outline-offset-4 outline-ring` on rounded container |
| Disabled | Reduced opacity, not-allowed cursor, and native button disabled semantics |

---

## Check mark contrast

The check mark color is automatically selected based on the swatch's perceived luminance:
- **Light swatches** (luminance > 0.5): dark primary-green mark (`#0b665d`)
- **Dark swatches** (luminance ≤ 0.5): white mark (`#fff`)

---

## Accessibility

- `aria-pressed={selected}` — announces pressed/unpressed state.
- `aria-label={label}` — includes the color value for screen readers.
- Native `disabled` prevents activation when wallpaper controls are unavailable.
- Focus ring uses `outline` (not `ring`) so it appears outside the swatch without layout shift.

---

## Custom-color coexistence

`SettingsColorPreset` only reflects the `selected` prop — it does not coordinate with other presets or a custom color picker. The consuming app owns exclusion logic:

```tsx
// When a preset is selected → clear any custom color
const handlePresetSelect = (hex: string) => {
  setSelectedPreset(hex);
  setCustomColor(null);   // ← consuming app clears custom
};

// When a custom color is picked → deselect all presets
const handleCustomColor = (hex: string) => {
  setCustomColor(hex);
  setSelectedPreset(null); // ← consuming app deselects presets
};
```

---

## Token reference

| Token | Value | CSS var |
|---|---|---|
| `color.fixed.wallpaperLightDefault` | `#e8f0ec` | `--fixed-wallpaper-light` |
| `color.fixed.wallpaperDarkDefault` | `#111326` | `--fixed-wallpaper-dark` |

---

## Import & usage

```tsx
import { SettingsColorPreset } from '@workspace/os-portfolio-ds/components/ui/settings';

const PRESETS = [
  { color: '#e8f0ec', label: 'Light default, #e8f0ec', name: 'Light default' },
  { color: '#111326', label: 'Dark default, #111326', name: 'Dark default' },
];

<div className="flex flex-wrap gap-3">
  {PRESETS.map((preset) => (
    <SettingsColorPreset
      key={preset.color}
      color={preset.color}
      label={preset.label}
      name={preset.name}
      selected={selectedColor === preset.color}
      onSelect={() => handlePresetSelect(preset.color)}
      disabled={contrastTheme !== 'none'}
    />
  ))}
</div>
```
