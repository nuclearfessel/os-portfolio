# Pattern: Sticky Notes

**Preview:** `os-portfolio-pilot` (StickyNoteSurface demo)

---

## Intent

Sticky notes are free-floating text/media surfaces on the desktop canvas. They evoke a physical post-it — rotated slightly, colorful background, large shadow. The design system provides the surface shell; all content, position, rotation, and persistence are the consuming product's responsibility.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `StickyNoteSurface` | `os-portfolio.tsx` | Surface shell (border, shadow, rounded) |
| `SectionLabel` | `os-portfolio.tsx` | Optional note type / number kicker |
| `ActionButton` | `os-portfolio.tsx` | Optional delete/action control |

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

### Desktop stacking contract

Keep every visible sticky in a bounded layer above wallpaper, solid fills,
desktop intro text, images, and launchers, but below every open window. The
active sticky may rise above other stickies only within that bounded layer; it
must never overtake a window.

Managed tablet and mobile layouts may replace overlapping layers with
single-surface navigation. Preserve that navigation model rather than applying
desktop z-index behavior at narrow breakpoints.

Sticky color presets must be intrinsically opaque. Apply translucency only
through the shared sticky transparency variable so the global
`data-no-transparency` state can make every preset fully opaque.

### Contrast palettes

All ten sticky colors keep their identity in every contrast mode. Low Contrast
uses a muted dark tint plus a restrained matching accent. High Contrast uses a
black surface, white body text, and a distinct bright accent for the border,
label, tape, and controls.

| Color | Low background | Low accent | High accent |
|---|---|---|---|
| Lemon | `#3b3826` | `#d8c76f` | `#ffff00` |
| Orange | `#3d3124` | `#d7aa72` | `#ff9d00` |
| Red | `#3d292b` | `#d99a9e` | `#ff3b30` |
| Cream | `#3a352d` | `#d8c9ae` | `#fff0d2` |
| Teal | `#263936` | `#8fbeb5` | `#00ffd5` |
| Blue | `#283344` | `#94acd1` | `#66b3ff` |
| Purple | `#322e42` | `#aaa0cc` | `#c4a7ff` |
| Berry | `#3b2a35` | `#c39aaf` | `#ff78b4` |
| Forest | `#29372f` | `#9ab8a4` | `#7dffa5` |
| Charcoal | `#30333b` | `#afb4c2` | `#d5dcf0` |

Use the generated `--fixed-sticky-<color>-low-bg`,
`--fixed-sticky-<color>-low-accent`, and
`--fixed-sticky-<color>-high-accent` variables. Do not collapse all sticky
colors into the generic contrast surface.

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
- [ ] Sticky content remains above all desktop content and below every open window.

---

## Tokens

`border-border`, `rounded-lg`, `shadow-xl` — supplied by `StickyNoteSurface`.
Background: product-supplied from design system tokens (e.g. `bg-accent`, a fixed wallpaper color, or a CSS custom property).

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use design system color tokens for note backgrounds | Apply arbitrary hex backgrounds not in the token set |
| Preserve all ten sticky color identities in Low and High Contrast | Render every contrast-mode sticky as the same generic surface |
| Confirm deletion with `AlertDialog` | Delete notes on a single click without confirmation |
| Apply rotation via `className` transform | Hardcode CSS `transform` in component styles |
| Reserve a bounded sticky layer below windows | Let an active sticky rise above an open window |

---

## Composition example

```tsx
import { StickyNoteSurface, SectionLabel, ActionButton } from '@workspace/portfolio-os-ds/components/ui/os-portfolio';

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
