# ButtonGroup

**Source:** `src/components/ui/button-group.tsx`
**Export path:** `@workspace/portfolio-os-ds/components/ui/button-group`
**Preview page:** `button-group`

---

## Purpose

Renders a set of visually attached buttons as a single unit — useful for segmented action bars, split buttons, and toolbars where related actions belong together without extra spacing between them.

---

## Anatomy

```
┌──────────┬──────────┬──────────┐
│  Action  │  Action  │  Action  │  ← flush borders, shared radius
└──────────┴──────────┴──────────┘
```

Inner items share adjacent borders and radius is applied only on the first/last items.

---

## Variants

See `src/components/ui/button-group.tsx` for exported parts. Use the demo preview (`button-group`) to explore all configurations.

---

## Accessibility

- Each button in the group retains its own accessible name and keyboard focus.
- Add `aria-label` to the group container if the set of actions forms a logical group: `<div role="group" aria-label="Text formatting">`.

---

## Import & usage

```tsx
import {
  ButtonGroup,
  ButtonGroupButton,
  ButtonGroupLabel,
  ButtonGroupSeparator,
} from '@workspace/portfolio-os-ds/components/ui/button-group';

<ButtonGroup>
  <ButtonGroupButton>Bold</ButtonGroupButton>
  <ButtonGroupSeparator />
  <ButtonGroupButton>Italic</ButtonGroupButton>
  <ButtonGroupButton>Underline</ButtonGroupButton>
</ButtonGroup>
```
