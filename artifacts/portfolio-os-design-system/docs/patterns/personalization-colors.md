# Pattern: Personalization Color Presets & Custom Picker

**Preview:** `portfolio-os-settings` (Personalization section)

---

## Intent

Allow users to select a desktop background color from a set of curated presets, or enter any hex color via a native color picker. The preset swatches and custom picker are mutually exclusive: selecting one clears the other.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `SettingsColorPreset` | `settings.tsx` | Selectable solid-color swatch |
| `SettingsSectionHeader` | `settings.tsx` | "Background color" section label |
| Native `<input type="color">` | Product | Custom color picker |

Two fixed presets ship with the design system:
- **Light default** `#E8F0EC` — CSS var `--fixed-wallpaper-light`
- **Dark default** `#111326` — CSS var `--fixed-wallpaper-dark`

---

## Anatomy

```
Background color
Choose a solid desktop background.

[#e8f0ec]  [#111326]   ← SettingsColorPreset (size-12 swatch)
Light default  Dark default

[Custom…]  ← native <input type="color"> or custom picker
```

---

## State ownership

`SettingsColorPreset` only reflects the `selected` prop. The consuming app owns the full exclusion and persistence logic:

```tsx
const [selectedPreset, setSelectedPreset] = useState<string | null>('#e8f0ec');
const [customColor, setCustomColor] = useState<string | null>(null);

// Select a preset → clear custom
const handlePresetSelect = (hex: string) => {
  setSelectedPreset(hex);
  setCustomColor(null);
  applyWallpaper(hex);
};

// Pick a custom color → deselect all presets
const handleCustomColor = (hex: string) => {
  setCustomColor(hex);
  setSelectedPreset(null);
  applyWallpaper(hex);
};
```

The consuming app writes the chosen color to the desktop background (CSS variable, inline style, etc.).

---

## Responsive transformation

| Breakpoint | Layout |
|---|---|
| All | Preset swatches wrap naturally (`flex flex-wrap gap-3`) |
| Mobile | Swatches may reduce in count or use a horizontal scroll |

---

## Accessibility checklist

- [ ] Each `SettingsColorPreset` has `aria-pressed` and a descriptive `aria-label` including the hex value.
- [ ] Selected preset shows a contrasting check mark (handled automatically by `isLightColor()` in the component).
- [ ] Custom `<input type="color">` has an associated `<label>`.
- [ ] Focus rings are visible on all swatches (2px outline on `rounded-md`).

---

## Tokens

`--fixed-wallpaper-light` (`#e8f0ec`), `--fixed-wallpaper-dark` (`#111326`), `border-primary`, `ring` (focus)

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Clear the custom color when a preset is selected | Allow both a preset and a custom color to appear selected simultaneously |
| Label each preset with both a name and the hex value | Use only the hex value as an accessible name |
| Apply the background color immediately on change | Require a "Save" step for instant-feedback personalization |
| Keep preset swatches in the fixed-wallpaper token set | Add product-specific presets to the design system token file |

---

## Composition example

```tsx
import { SettingsColorPreset, SettingsSectionHeader } from '@workspace/portfolio-os-design-system/components/ui/settings';

const PRESETS = [
  { color: '#e8f0ec', label: 'Light default, #e8f0ec', name: 'Light default' },
  { color: '#111326', label: 'Dark default, #111326', name: 'Dark default' },
];

<SettingsSectionHeader
  label="Background color"
  description="Choose a solid desktop background."
/>
<div className="flex flex-wrap gap-3">
  {PRESETS.map((p) => (
    <SettingsColorPreset
      key={p.color}
      color={p.color}
      label={p.label}
      name={p.name}
      selected={selectedPreset === p.color}
      onSelect={() => handlePresetSelect(p.color)}
    />
  ))}
  <label className="flex flex-col items-start gap-1 text-[10px] text-muted-foreground">
    <span
      className="grid size-12 place-items-center rounded-md border border-border/40 overflow-hidden"
      style={customColor ? { backgroundColor: customColor } : undefined}
    >
      <input
        type="color"
        value={customColor ?? '#ffffff'}
        onChange={(e) => handleCustomColor(e.target.value)}
        className="sr-only"
        aria-label="Custom background color"
      />
      {!customColor && <PlusIcon className="size-4 text-muted-foreground" />}
    </span>
    Custom
  </label>
</div>
```
