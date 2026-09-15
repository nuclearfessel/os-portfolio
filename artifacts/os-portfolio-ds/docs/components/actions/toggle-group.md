# ToggleGroup / ToggleGroupItem

**Source:** `src/components/ui/toggle-group.tsx`
**Export:** `ToggleGroup`, `ToggleGroupItem`
**Export path:** `@workspace/os-portfolio-ds/components/ui/toggle-group`
**Preview page:** `toggle-group`

---

## Purpose

A group of `Toggle` items sharing a common `variant` and `size` context — for single-select (radio-like) or multi-select toolbar sets.

---

## Anatomy

```
<ToggleGroup type="single" | "multiple">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
```

Items inherit `variant` and `size` from the group context — no need to repeat on each item.

---

## Props — ToggleGroup

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'single' \| 'multiple'` | required | Selection model |
| `value` / `onValueChange` | string / string[] | — | Controlled value |
| `defaultValue` | string / string[] | — | Uncontrolled initial value |
| `variant` | Toggle variant | `'default'` | Passed to all items |
| `size` | Toggle size | `'default'` | Passed to all items |

---

## Accessibility

- `type="single"` maps to `role="radiogroup"` behavior via Radix.
- `type="multiple"` items each carry `aria-pressed`.
- Add `aria-label` to the group.

---

## Import & usage

```tsx
import { ToggleGroup, ToggleGroupItem } from '@workspace/os-portfolio-ds/components/ui/toggle-group';

// Single select
<ToggleGroup type="single" value={align} onValueChange={setAlign} aria-label="Text alignment">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>

// Multi-select with outline variant
<ToggleGroup type="multiple" variant="outline" size="sm">
  <ToggleGroupItem value="bold">B</ToggleGroupItem>
  <ToggleGroupItem value="italic">I</ToggleGroupItem>
</ToggleGroup>
```
