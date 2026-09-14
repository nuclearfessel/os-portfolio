# Pattern: Sticky Notes

**Preview:** `fes-os-pilot` (StickyNoteSurface demo)

---

## Intent

Sticky notes are free-floating text/media surfaces on the desktop canvas. They evoke a physical post-it — rotated slightly, colorful background, large shadow. The design system provides the surface shell; all content, position, rotation, and persistence are the consuming product's responsibility.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `StickyNoteSurface` | `fes-os.tsx` | Surface shell (border, shadow, rounded) |
| `SectionLabel` | `fes-os.tsx` | Optional note type / number kicker |
| `ActionButton` | `fes-os.tsx` | Optional delete/action control |

---

## Anatomy

```
┌──────────────────────────────┐  ← StickyNoteSurface (rounded-lg border shadow-xl)
│  field note / 004  (kicker)  │    background: product-supplied color token
│                              │
│  Note content text…          │
│                              │
│                         [×]  │  ← optional ActionButton (delete)
└──────────────────────────────┘
↑ slight rotation via className="rotate-[-1deg]" or CSS transform
```

---

## State ownership

| Concern | Product responsibility |
|---|---|
| Position (x, y) | Product state, persisted |
| Rotation | Product state, persisted |
| Background color | Product (choose from design system color tokens or fixed presets) |
| Content text | Product state, persisted |
| Drag interaction | Product event handlers |
| Delete confirmation | Product (use `AlertDialog` for confirmation) |
| Z-order | Product state |

---

## Responsive transformation

| Breakpoint | Sticky note behavior |
|---|---|
| Desktop | Free-floating, drag-to-position |
| Tablet | Fixed position or hidden; do not allow dragging |
| Mobile | Not shown, or shown as a list in a dedicated notes window |

---

## Accessibility checklist

- [ ] Sticky note container has `role="article"` or equivalent if it's a distinct content unit.
- [ ] Delete button has `aria-label="Delete note"`.
- [ ] Deletion is confirmed via `AlertDialog` before data is removed.
- [ ] Keyboard alternative exists for moving notes (drag-only is not sufficient).

---

## Tokens

`border-border`, `rounded-lg`, `shadow-xl` — supplied by `StickyNoteSurface`.
Background: product-supplied from design system tokens (e.g. `bg-accent`, a fixed wallpaper color, or a CSS custom property).

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use design system color tokens for note backgrounds | Apply arbitrary hex backgrounds not in the token set |
| Confirm deletion with `AlertDialog` | Delete notes on a single click without confirmation |
| Apply rotation via `className` transform | Hardcode CSS `transform` in component styles |

---

## Composition example

```tsx
import { StickyNoteSurface, SectionLabel, ActionButton } from '@workspace/fes-os-design-system/components/ui/fes-os';

<StickyNoteSurface
  className="absolute w-56 rotate-[-1deg] bg-accent p-4 text-accent-foreground"
  style={{ left: note.x, top: note.y }}
  onPointerDown={startDrag}
>
  <SectionLabel className="text-accent-foreground/70">field note / {note.index}</SectionLabel>
  <p className="mt-3 text-sm leading-relaxed">{note.content}</p>
  <ActionButton
    variant="danger"
    aria-label="Delete note"
    className="absolute right-2 top-2 size-6 p-0 text-xs"
    onClick={confirmDelete}
  >
    ×
  </ActionButton>
</StickyNoteSurface>
```
