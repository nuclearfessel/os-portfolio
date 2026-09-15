# SettingsSegmentedChoice

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/portfolio-os-ds/components/ui/settings`
**Preview page:** `os-portfolio-settings`

---

## Purpose

An exclusive radio chip group — Less / Default / More (or any comparable set of options). Used for animation speed selection.

---

## Anatomy

```
[Less] [Default] [More]   ← wrapping flex row of pill buttons
  ↑ selected chip: bg-primary border-primary text-primary-foreground
  ↑ unselected chip: bg-card/60 border-border/50 text-muted-foreground
```

---

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `groupLabel` | `string` | ✓ | `aria-label` for the `radiogroup` |
| `options` | `SegmentedOption[]` | ✓ | Array of `{ value, label, description? }` |
| `value` | `string` | ✓ | Currently selected option value |
| `onChange` | `(value: string) => void` | ✓ | Called with the newly selected value |
| `data-testid` | `string` | — | Root testid; option testids are `${testid}-${option.value}` |
| `className` | `string` | — | Merged |

```ts
type SegmentedOption = {
  value: string;
  label: string;
  description?: string;  // exposed via title attribute (hover tooltip)
};
```

---

## Interactive states

| State | Visual |
|---|---|
| Selected | `border-primary bg-primary text-primary-foreground` |
| Unselected default | `border-border/50 bg-card/60 text-muted-foreground` |
| Unselected hover | `border-primary/50 text-primary` |
| Focus-visible | `ring-2 ring-ring ring-offset-1` |

---

## Accessibility

- `role="radiogroup"` on the wrapper with `aria-label={groupLabel}`.
- Each chip button: `role="radio"` + `aria-checked={isSelected}`.
- `description` is exposed via `title` attribute — hover tooltip for mouse users, not announced by screen readers by default.

---

## Behavior contract

The consuming app applies the selected speed to the DOM:

```js
if (speed === 'default') {
  document.documentElement.removeAttribute('data-anim-speed');
} else {
  document.documentElement.setAttribute('data-anim-speed', speed);
}
```

---

## Import & usage

```tsx
import { SettingsSegmentedChoice } from '@workspace/portfolio-os-ds/components/ui/settings';

const SPEED_OPTIONS = [
  { value: 'less',    label: 'Less',    description: 'Slower, reduced intensity' },
  { value: 'default', label: 'Default', description: 'Standard timing' },
  { value: 'more',    label: 'More',    description: 'Faster, snappier motion' },
];

<SettingsSegmentedChoice
  groupLabel="Animation speed"
  options={SPEED_OPTIONS}
  value={prefs.animationSpeed}
  onChange={(v) => updatePrefs({ animationSpeed: v as AnimSpeed })}
  data-testid="settings-anim-speed"
/>
```
