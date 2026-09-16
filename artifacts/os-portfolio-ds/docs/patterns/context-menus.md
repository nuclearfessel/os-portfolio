# Pattern: Context Menus

- **Specimen:** Static reference — `os-portfolio-pilot` ContextMenuSurface and `context-menu` Radix implementation
- **Variants:** Radix recommended tier; custom-positioned tier
- **States:** Open; closed; focused; right-click; long-press

---

## Intent

Context menus appear on right-click (or long-press on touch) to surface relevant actions for the clicked target — the desktop, a window, a project card, or a sticky note. Two implementation tiers exist depending on the target element type.

---

## Two tiers

### Tier 1 — Radix ContextMenu (recommended for most uses)

Use `ContextMenu` from `ui/context-menu.tsx` when the target element can be wrapped in `<ContextMenuTrigger>`. Provides full keyboard navigation, ARIA semantics, and Escape-to-close automatically.

```tsx
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@workspace/os-portfolio-ds/components/ui/context-menu';

<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="desktop-canvas">…</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Theme</ContextMenuItem>
    <ContextMenuItem>New sticky note</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Reset desktop…</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Tier 2 — ContextMenuSurface (custom positioning)

Use `ContextMenuSurface` from `os-portfolio.tsx` when you need to manually position a menu (e.g. at the pointer coordinates on a canvas that cannot be wrapped). The consuming product manages position, visibility, and keyboard handling.

```tsx
import { ContextMenuSurface } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

{menuOpen && (
  <ContextMenuSurface
    role="menu"
    className="fixed z-50 w-48 p-1 text-sm"
    style={{ left: menuX, top: menuY }}
    ref={menuRef}
  >
    <button role="menuitem" className="…">Theme</button>
    <button role="menuitem" className="…">Reset desktop…</button>
  </ContextMenuSurface>
)}
```

---

## Anatomy

```
┌──────────────────────────────────┐  ← ContextMenuSurface / ContextMenuContent
│  Theme                           │     bg-popover border-border shadow-xl rounded-md
│  New sticky note                 │
│  Cleanup icons                   │
│  Snap to grid                    │
│  ─────────────────────────────── │  ← Separator
│  Reset desktop…                  │
└──────────────────────────────────┘
```

Place direct geometry actions in a predictable sequence. In the desktop menu,
**Cleanup icons** appears immediately before the **Snap to grid** checkbox.
Arrow-key navigation must follow the same visual order.

---

## State ownership

| Concern | Product responsibility (Tier 2) |
|---|---|
| Open/closed state | Product |
| Menu position (x, y from pointer event) | Product |
| Click-outside dismissal | Product |
| Escape-to-close | Product (listen for `keydown Escape`) |
| Focus management | Product (focus first item on open; restore trigger on close) |

---

## Responsive transformation

- Desktop: right-click triggers at pointer coordinates.
- Mobile/tablet: long-press or tap-and-hold triggers; position near the touch point.
- On narrow screens, consider using a `Sheet` (bottom panel) instead of a positioned context menu.

---

## Accessibility checklist (Tier 2 / custom)

- [ ] Container: `role="menu"` + `aria-label` describing the target.
- [ ] Items: `role="menuitem"` on each button.
- [ ] Arrow key navigation between items.
- [ ] Enter/Space to activate items.
- [ ] Escape closes the menu and returns focus.
- [ ] Focus set to first item on open.

---

## Tokens

`bg-popover`, `text-popover-foreground`, `border-border`, `rounded-md`, `shadow-xl` (via `ContextMenuSurface`)

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use Radix `ContextMenu` when the trigger can be wrapped | Build a custom positioned menu without keyboard handling |
| Confirm destructive menu actions ("Reset desktop…") with `AlertDialog` | Execute destructive actions on a single menu click |
| Close the menu on Escape | Leave the menu open until another click |
| Keep keyboard order synchronized with visual item order | Add an item that arrow-key navigation skips |
