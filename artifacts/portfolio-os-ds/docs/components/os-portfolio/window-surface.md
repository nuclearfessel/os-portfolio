# WindowSurface

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/portfolio-os-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

---

## Purpose

The visual shell of a desktop application window. Provides the surface appearance (border, background, rounded corners, large shadow) while the consuming product handles dragging, resizing, z-order, and window controls.

---

## Anatomy

```
┌─────────────────────────────────────────────┐
│  [title bar / menubar — product's slot]     │  ← border-b border-border
│  ─────────────────────────────────────────  │
│  [window content — product's slot]          │
└─────────────────────────────────────────────┘
```

Renders as `<section>` (forwarded ref). Applies: `rounded-lg border border-border bg-card text-card-foreground shadow-xl`.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Merged with base classes |
| `ref` | `Ref<HTMLElement>` | — | Forwarded to root `<section>` |
| `...props` | `HTMLAttributes<HTMLElement>` | — | All HTML attributes |

---

## State ownership

> **The consuming product owns:**
> - Dragging (position: x, y)
> - Resizing (width, height)
> - Z-order / focus management between windows
> - Minimize / maximize / close controls
> - Dragging a maximized title bar to restore the prior geometry under the pointer
> - Keyboard commands that close the topmost or all product windows
> - Persisting window geometry (see [Saved-state ownership](../../patterns/saved-state-ownership.md))

`WindowSurface` is purely visual — it has no internal state.

---

## Transparency

Add `portfolio-surface-translucent` alongside your `bg-card` override if the window should respond to the user's transparency preference:

```tsx
<WindowSurface className="portfolio-surface-translucent overflow-hidden">
  …
</WindowSurface>
```

The package CSS applies `backdrop-filter` and respects `--accessibility-transparency` when `data-transparency-enabled` is set on `:root`.

---

## Accessibility

- Renders as `<section>` — add `aria-label` or `aria-labelledby` pointing to the window title.
- The window's close/minimize controls (product-supplied) must have accessible names.
- Window-title text uses the opaque `windowTitleForeground` theme token. Keep the
  title-bar text near 6:1 contrast in both themes; do not lower contrast through
  alpha or blend modes.

---

## Relevant tokens

`bg-card`, `text-card-foreground`, `windowTitleForeground`,
`--window-title-foreground`, `--window-title-foreground-light`,
`--window-title-foreground-dark`, `border-border`, `rounded-lg`, `shadow-xl`

---

## Import & usage

```tsx
import { WindowSurface } from '@workspace/portfolio-os-ds/components/ui/os-portfolio';

<WindowSurface aria-label="About window">
  <div className="border-b border-border px-4 py-3 font-mono text-xs">
    ~/john/about
  </div>
  <div className="p-5">
    {/* window content */}
  </div>
</WindowSurface>
```
