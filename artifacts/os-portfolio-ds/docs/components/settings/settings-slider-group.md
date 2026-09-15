# SettingsSliderGroup

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/settings`
**Preview page:** `os-portfolio-settings`

---

## Purpose

A range slider with a live value readout and optional guidance labels. Used for transparency and blur levels, shown conditionally when the corresponding Accessibility toggle is on.

---

## Anatomy

```
┌─────────────────────────────────────────────┐
│  Label text               [35%] ← <output> │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (range)   │
│  None                       Almost full     │
└─────────────────────────────────────────────┘
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Links `<label>` and `<input>` |
| `label` | `string` | — | Visible label + `aria-label` on the input |
| `value` | `number` | — | Current numeric value (controlled) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `onChange` | `(value: number) => void` | — | Called with the new numeric value |
| `disabled` | `boolean` | `false` | Makes the range non-interactive while preserving its controlled value |
| `disabledDescription` | `ReactNode` | — | Explains why a disabled range is unavailable and is linked with `aria-describedby` |
| `guidanceStart` | `string` | — | Left guidance label (e.g. `"None"`) |
| `guidanceEnd` | `string` | — | Right guidance label (e.g. `"Almost full"`) |
| `unit` | `string` | `'%'` | Unit appended to the `<output>` display |
| `ariaValueText` | `string` | `"${value}${unit}"` | Human-readable value announcement |
| `data-testid` | `string` | — | Applied to root, input (`-slider`), and output (`-value`) |
| `className` | `string` | — | Merged |

---

## Accessibility

- `<output htmlFor={id} aria-live="polite">` announces live value changes to screen readers.
- `<input type="range">` has `aria-label={label}`, `aria-labelledby`, and `aria-valuetext`.
- Guidance labels are `aria-hidden="true"` — decorative.
- The consuming app should coerce `onChange`'s `number` value (from `Number(e.currentTarget.value)`) — HTML range inputs always return strings.

---

## Behavior contract

The custom rail and filled range are 4px high and vertically centered in a 20px control. The 14px visual handle has independent geometry and shares the rail's centerline, so changing track thickness must never move the handle. A transparent native range input remains layered above both visuals for interaction.

Show each `SettingsSliderGroup` only when its parent toggle is on. In a large desktop Settings window, window transparency, sticky transparency, and blur form one three-column row. Below the product's wide-window breakpoint, each occupies its own row. When the combined window and Dock transparency level is `0` (“None”), keep the Blur slider visible but disabled. Preserve its controlled value and re-enable it when transparency rises above `0`.

```tsx
{prefs.windowTransparency && (
  <SettingsSliderGroup
    id="a11y-transparency-level"
    label="Transparency level"
    value={prefs.transparencyLevel}
    min={0} max={70} step={5}
    onChange={(v) => updatePrefs({ transparencyLevel: v })}
    guidanceStart="None"
    guidanceEnd="Almost full"
    ariaValueText={`${prefs.transparencyLevel}% transparent`}
  />
)}

{prefs.blurEffects && (
  <SettingsSliderGroup
    id="personalization-blur"
    label="Blur"
    value={prefs.blurLevel}
    disabled={prefs.transparencyLevel === 0}
    min={0} max={24} step={2}
    onChange={(v) => updatePrefs({ blurLevel: v })}
    guidanceStart="Sharp"
    guidanceEnd="More blurred"
    unit="px"
    ariaValueText={`${prefs.blurLevel} pixels of blur`}
  />
)}
```

The consuming app converts the numeric value to the `--accessibility-transparency` CSS variable:

```js
document.documentElement.style.setProperty(
  '--accessibility-transparency',
  String(prefs.transparencyLevel / 100)  // unitless 0–0.7
);
document.documentElement.style.setProperty(
  '--surface-blur',
  `${prefs.blurLevel}px`
);
```

For transparency controls, `0` must produce a fully opaque surface. “None”
means no transparency, not a subtle minimum effect. The upper bound remains
below 100%, so “Almost full” accurately describes the maximum.

See → [State contracts](../../references/components/settings.md#state-contracts)
