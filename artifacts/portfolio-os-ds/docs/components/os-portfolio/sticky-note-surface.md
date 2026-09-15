# StickyNoteSurface

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/portfolio-os-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

---

## Purpose

The visual shell of a sticky note widget on the desktop. Provides the rounded border and large shadow; the consuming product handles color, content, dragging, rotation, and persistence.

---

## Anatomy

```
┌──────────────────────────────┐
│  [note content]              │  ← rounded-lg border shadow-xl
└──────────────────────────────┘
```

Renders as `<div>`. No built-in background color — the consumer applies a color token like `bg-accent` or a wallpaper color.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Required — consumer supplies background, padding, sizing |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | All div attributes |

---

## State ownership

- Rotation, position, and z-order: consuming product.
- Background color choice: consuming product.
- Low/High Contrast color choice: use the generated fixed sticky palette tokens;
  all ten product colors have a low background, low accent, and high accent.
- Content (text, rich content): consuming product.
- Persistence: consuming product (see [Saved-state ownership](../../patterns/saved-state-ownership.md)).

---

## Accessibility

Treat note content as readable text. The container itself has no semantic role. If notes are a list, wrap in `<ul>` and make each note an `<li>`.

In High Contrast, use a black surface and white body text with the selected
`--fixed-sticky-<color>-high-accent` for the border and secondary details. In
Low Contrast, pair `--fixed-sticky-<color>-low-bg` with its matching
`--fixed-sticky-<color>-low-accent`.

---

## Import & usage

```tsx
import { StickyNoteSurface } from '@workspace/portfolio-os-ds/components/ui/os-portfolio';
import { SectionLabel } from '@workspace/portfolio-os-ds/components/ui/os-portfolio';

<StickyNoteSurface
  className="rotate-[-1deg] bg-accent p-5 text-accent-foreground w-64"
>
  <SectionLabel>field note / 004</SectionLabel>
  <p className="mt-3 text-sm">Direct manipulation stays in the product…</p>
</StickyNoteSurface>
```
