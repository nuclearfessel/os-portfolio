# Surface

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

---

## Purpose

A semantic surface container — the visual base for cards, info panels, and grouped content areas within the portfolio. Three elevation levels express depth. Not to be confused with `WindowSurface` (which adds `shadow-xl` and `section` semantics for draggable app windows).

See → [Effects foundation](../../foundations/effects.md)

---

## Anatomy

```
┌─────────────────────────────────────┐
│  border-border  bg-card             │  ← rounded-lg
│  text-card-foreground               │
│  [children]                         │
└─────────────────────────────────────┘
```

---

## Elevation variants

| Variant | Shadow | Use |
|---|---|---|
| `flat` | None | Inline content areas, no depth required |
| `raised` (default) | `shadow-sm` | Most surface uses — cards, info boxes |
| `floating` | `shadow-xl` | Demo containers, overlay-style panels |

---

## Interactive states

Static — no interactive states built in. Add hover/focus classes via `className` for interactive surfaces.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `elevation` | `'flat' \| 'raised' \| 'floating'` | `'raised'` | Shadow depth |
| `className` | `string` | — | Merged with base classes |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | All div attributes |

---

## Accessibility

Renders as `<div>` — add `role`, `aria-label`, or semantic HTML children as needed for the content.

---

## Relevant tokens

`bg-card`, `text-card-foreground`, `border-border`, `shadow-sm`, `shadow-xl`, `rounded-lg`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `elevation="floating"` for demo containers and overlapping content | Use `floating` for every surface (overuses depth) |
| Use `elevation="flat"` inside an already-elevated container | Nest two `floating` surfaces |
| Compose padding and spacing inside the surface via `className` | Assume the surface has padding — it has none by default |

---

## Import & usage

```tsx
import { Surface } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

<Surface className="p-6 space-y-4">
  <h2>Content heading</h2>
  <p className="text-sm text-muted-foreground">Details…</p>
</Surface>

<Surface elevation="floating" className="p-8">
  {/* Demo / overlay content */}
</Surface>
```
