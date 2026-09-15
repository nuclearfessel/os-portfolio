# Toggle

**Source:** `src/components/ui/toggle.tsx`
**Export:** `Toggle`, `toggleVariants`
**Export path:** `@workspace/os-portfolio-ds/components/ui/toggle`
**Preview page:** `toggle`

---

## Purpose

A two-state pressed/unpressed control — bold, italic, formatting tools, filter chips, view-mode switches. Built on `@radix-ui/react-toggle`.

---

## Variants

| Variant | Appearance |
|---|---|
| `default` | `bg-transparent`; pressed: `bg-accent text-accent-foreground` |
| `outline` | `border border-input bg-transparent shadow-sm`; pressed: `bg-accent text-accent-foreground` |

## Sizes

| Size | Height | Min-width |
|---|---|---|
| `sm` | `h-8` | `min-w-8` |
| `default` | `h-9` | `min-w-9` |
| `lg` | `h-10` | `min-w-10` |

---

## Interactive states

| State | Visual |
|---|---|
| Unpressed | Base variant |
| Pressed (`data-[state=on]`) | `bg-accent text-accent-foreground` |
| Hover | `bg-muted text-muted-foreground` |
| Focus-visible | `ring-1 ring-ring` |
| Disabled | `opacity-50 pointer-events-none` |

---

## Accessibility

- Radix handles `aria-pressed` automatically based on `pressed` / `defaultPressed`.
- Provide `aria-label` for icon-only toggles.

---

## Import & usage

```tsx
import { Toggle } from '@workspace/os-portfolio-ds/components/ui/toggle';
import { BoldIcon } from 'lucide-react';

<Toggle aria-label="Bold" pressed={bold} onPressedChange={setBold}>
  <BoldIcon strokeWidth={1.8} />
</Toggle>

<Toggle variant="outline">Italic</Toggle>
```
