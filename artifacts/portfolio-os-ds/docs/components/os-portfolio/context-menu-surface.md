# ContextMenuSurface

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/portfolio-os-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

---

## Purpose

The styled container for a desktop right-click context menu. Provides background, border, popover-surface appearance, and large shadow. The consuming product provides positioning, item rendering, and keyboard handling.

For Radix-powered context menus with full keyboard/ARIA support, use the `ContextMenu` family from `ui/context-menu.tsx` instead. `ContextMenuSurface` is a lightweight visual shell for custom or manually positioned menus.

---

## Anatomy

```
┌────────────────────────────┐
│  [menu items]              │  ← rounded-md border-border bg-popover
│                            │     text-popover-foreground shadow-xl
└────────────────────────────┘
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Merged with base classes |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | All div attributes |

---

## State ownership

- Position (x, y) on the desktop: consuming product.
- Visibility / open state: consuming product.
- Item rendering and keyboard handling: consuming product (or delegate to `ContextMenu` from `ui/context-menu.tsx`).

---

## Accessibility

When used as a custom menu, the consuming product must provide:
- `role="menu"` on the surface container
- `role="menuitem"` on each item
- Keyboard navigation (Arrow keys, Enter, Escape)
- Focus management (focus first item on open; restore trigger focus on close)

If full ARIA menu semantics are needed, prefer `ContextMenu` from `ui/context-menu.tsx`.

---

## Relevant tokens

`bg-popover`, `text-popover-foreground`, `border-border`, `rounded-md`, `shadow-xl`

---

## Import & usage

```tsx
import { ContextMenuSurface } from '@workspace/portfolio-os-ds/components/ui/os-portfolio';

// Positioned absolutely by the consuming product
<ContextMenuSurface
  role="menu"
  className="absolute w-48 p-2 text-sm"
  style={{ left: x, top: y }}
>
  <button role="menuitem" className="w-full rounded px-2 py-1.5 text-left hover:bg-secondary">
    Theme
  </button>
  <button role="menuitem" className="w-full rounded px-2 py-1.5 text-left hover:bg-secondary">
    Reset desktop…
  </button>
</ContextMenuSurface>
```
