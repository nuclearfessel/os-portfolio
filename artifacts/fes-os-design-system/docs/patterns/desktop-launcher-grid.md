# Pattern: Desktop Launcher Grid

**Preview:** `fes-os-pilot` (DesktopLauncher demo)

---

## Intent

The desktop launcher grid presents app/section launcher icons directly on the desktop canvas. Each launcher opens or focuses a corresponding window. The grid is user-arranged on desktop; on mobile/tablet it may be a fixed list or hidden.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `DesktopLauncher` | `fes-os.tsx` | Activatable launcher button (`is-open` class) |
| `SectionLabel` | `fes-os.tsx` | Optional launcher label below the icon |
| Product layout container | Product | Grid positioning, drag-to-rearrange |

---

## Anatomy

```
[icon]         [icon]         [icon]
About          Work           Contact
(is-open)

↑ Each launcher is a DesktopLauncher button
↑ Icon content, size, and label are product-supplied
↑ Position is product-managed (inline style or CSS grid)
```

About and Selected Work are application launchers rather than folder
representations. Give primary portfolio apps distinctive, saturated icon
treatments while preserving the shared `DesktopLauncher` interaction and
accessibility contract.

Mirror primary app identity in the Dock: use the same icon glyph and saturated
color family for About, Selected Work, and Contact across desktop and managed
workspace navigation.

Contact uses Remix Icon's filled mail-send glyph in saturated red-orange on a
warm-ivory tile with a matching red-orange border. Keep the same inverted
palette and glyph between the desktop launcher and Dock.

---

## State ownership

| Concern | Product responsibility |
|---|---|
| Which window is open | Product state → `open` prop |
| Launcher position on the desktop | Product state, persisted |
| Drag-to-rearrange | Product event handlers |
| Open-state visual indicator | Product CSS targeting `.is-open` |

---

## Responsive transformation

| Breakpoint | Launcher behavior |
|---|---|
| Desktop | Freeform grid, user-rearranged |
| Tablet | Fixed grid or hidden (managed layout shows active window) |
| Mobile | Hidden (Dock navigation replaces launchers) |

---

## Accessibility checklist

- [ ] Every `DesktopLauncher` has `aria-label` set to the section/app name.
- [ ] `aria-expanded={open}` reflects whether the associated window is open.
- [ ] `aria-controls` points to the window element's `id` if in the same DOM.
- [ ] Keyboard users can Tab to each launcher and activate with Enter/Space.
- [ ] A keyboard alternative exists for rearranging launchers (drag-only is not sufficient).

---

## Tokens

`bg-card`, `border-border`, `rounded-xl`, `text-primary` (open state indicator), `font-mono`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Provide `aria-expanded` and `aria-label` on every launcher | Leave icon-only launchers without accessible names |
| Offer a keyboard alternative to drag-to-rearrange | Make rearranging pointer-only |
| Hide launchers on mobile (Dock handles navigation) | Show a duplicate navigation set on mobile |

---

## Composition example

```tsx
import { DesktopLauncher, SectionLabel } from '@workspace/fes-os-design-system/components/ui/fes-os';

function DesktopGrid({ windows, openWindow }) {
  return (
    <div className="absolute inset-0 p-8">
      {windows.map((win) => (
        <DesktopLauncher
          key={win.id}
          open={win.open}
          aria-label={win.name}
          aria-expanded={win.open}
          aria-controls={`window-${win.id}`}
          onClick={() => openWindow(win.id)}
          className="absolute flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/80 p-3"
          style={{ left: win.x, top: win.y }}
        >
          <win.Icon className="size-8" strokeWidth={1.8} />
          <SectionLabel className="text-[9px]">{win.name}</SectionLabel>
        </DesktopLauncher>
      ))}
    </div>
  );
}
```
