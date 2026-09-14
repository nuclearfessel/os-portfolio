# SettingsSliderGroup

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/fes-os-design-system/components/ui/settings`
**Preview page:** `fes-os-settings`

---

## Purpose

A range slider with a live value readout and optional guidance labels. Used for the transparency level control — shown conditionally when the parent transparency toggle is on.

---

## Anatomy

```
┌─────────────────────────────────────────────┐
│  Label text               [35%] ← <output> │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (range)   │
│  Subtle                  More transparent   │
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
| `guidanceStart` | `string` | — | Left guidance label (e.g. `"Subtle"`) |
| `guidanceEnd` | `string` | — | Right guidance label (e.g. `"More transparent"`) |
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

The slider track is 4px high. Keep the thumb and input hit area larger so the control remains easy to drag.

Show `SettingsSliderGroup` only when its parent toggle is on:

```tsx
{prefs.windowTransparency && (
  <SettingsSliderGroup
    id="a11y-transparency-level"
    label="Transparency level"
    value={prefs.transparencyLevel}
    min={0} max={70} step={5}
    onChange={(v) => updatePrefs({ transparencyLevel: v })}
    guidanceStart="Subtle"
    guidanceEnd="More transparent"
    ariaValueText={`${prefs.transparencyLevel}% transparent`}
  />
)}
```

The consuming app converts the numeric value to the `--accessibility-transparency` CSS variable:

```js
document.documentElement.style.setProperty(
  '--accessibility-transparency',
  String(prefs.transparencyLevel / 100)  // unitless 0–0.7
);
```

See → [State contracts](../../references/components/settings.md#state-contracts)
