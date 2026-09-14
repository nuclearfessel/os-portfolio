# DockItem / DockItemLabel

**Source:** `src/components/ui/fes-os.tsx`
**Export path:** `@workspace/fes-os-design-system/components/ui/fes-os`
**Preview page:** `fes-os-pilot`

---

## Purpose

`DockItem` is the interactive cell in the navigation Dock — the button that activates a window or section. `DockItemLabel` renders the item's name in two presentation modes depending on the breakpoint: a tooltip surface on desktop, plain inline text on mobile/tablet.

---

## Anatomy — DockItem

```
┌─────────────────┐
│  [icon / glyph] │  ← relative grid place-items-center rounded-lg border
│  [DockItemLabel]│    transition-colors duration-100
└─────────────────┘
│ .active class when active
```

- Root: `<button>` (forwarded ref)
- Active state: add `active` CSS class + pass `active={true}` prop

---

## DockItem Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | `false` | Applies `active` class and drives visual state |
| `type` | `string` | `'button'` | Prevents form submission |
| `className` | `string` | — | Required — the consumer applies sizing and color tokens |
| `ref` | `Ref<HTMLButtonElement>` | — | Forwarded |
| `...props` | `ButtonHTMLAttributes` | — | Including `aria-label` |

`DockItem` intentionally exposes no built-in size or color — the consuming product applies those based on its layout and theme.

For the Fes OS desktop Dock, the container uses an 8px gap and 8px padding on
all four edges. Responsive bottom navigation may use separate distribution and
safe-area rules.

---

## Anatomy — DockItemLabel

```
presentation="tooltip"   →  tooltip surface (border, bg-popover, shadow, font-mono 10px)
presentation="inline"    →  plain inline text (font-sans, no border/bg/shadow)
```

---

## DockItemLabel Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `presentation` | `'tooltip' \| 'inline'` | `'tooltip'` | Desktop tooltip vs mobile/tablet inline |
| `className` | `string` | — | Merged |
| `ref` | `Ref<HTMLSpanElement>` | — | Forwarded |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | — | All span attributes |

---

## Presentation switching

| Breakpoint | Recommended `presentation` | Rationale |
|---|---|---|
| Desktop (≥ 1024px) | `"tooltip"` | Floating label appears above/below icon; saves Dock space |
| Tablet / mobile (< 1024px) | `"inline"` | Label always visible beneath icon; no tooltip overhead |

The consuming product controls this switch based on viewport state or a CSS media query. Typical pattern:

```tsx
// Product switches based on isDesktop flag from a media-query hook
<DockItemLabel presentation={isDesktop ? 'tooltip' : 'inline'}>
  Work
</DockItemLabel>
```

---

## Interactive states (DockItem)

| State | Visual |
|---|---|
| Default | Border + background from consumer classes |
| Active | Full-tile contrast ring plus a 16–26px directional pill on the nearest Dock edge; never rely on a tiny dot alone |
| Hover | Inactive items only: branded apps retain their icon foreground, tile fill, and shared border; use a flat contrast-safe outline |
| Focus-visible | Uses the same flat, theme-appropriate outline while retaining the shared inactive border |

Treat branded app items and neutral utility controls as separate state systems.
App hover and focus must not replace the app's identity color. Utility controls
may change foreground and background together, but the resulting pair must meet
WCAG AA contrast in both light and dark themes.

Within a product Dock, inactive item borders should use one shared 1px color
rather than inheriting a different border from every branded tile. Keep that
border stable through hover and focus; use the flat outline for interaction
feedback.

The active state must remain distinguishable without hover. Use both a full-tile
ring and a directional edge pill so the signal remains clear against branded
tiles, neutral controls, and changing wallpaper. On mobile and tablet, keep the
pill visible beneath the inline label. Do not apply hover styling to active
items; their selected treatment remains unchanged under the pointer.

---

## Accessibility

- Every `DockItem` **must** have `aria-label` set to the section name.
- When `active`, add `aria-current="true"` or `aria-pressed="true"` as appropriate.
- `DockItemLabel` with `presentation="tooltip"` should be position-absolute / `pointer-events-none` and hidden from the tab order (it is decorative; the `aria-label` names the button).

---

## Relevant tokens

`rounded-lg`, `border-accent` (shared inactive border), `ring-primary` (active ring and pill), `bg-secondary`, `text-primary-foreground`, `font-mono`, `gap-2`, `p-2`, `popover`/`popover-foreground` (tooltip surface)

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Supply `aria-label` on every `DockItem` | Rely on `DockItemLabel` text as the only accessible name |
| Use `presentation="tooltip"` only on desktop | Show tooltip labels on mobile (they overlap other content) |
| Keep Dock icons in a fixed footprint across states | Resize the icon on hover/active |
| Combine a full-tile ring with a substantial edge pill for active items | Use a 4px dot as the only active indicator |
| Preserve branded tile and glyph colors and use a flat outline on hover/focus | Move, brighten, emboss, or recolor branded tiles on hover |
| Apply hover feedback only to inactive items | Layer hover styling on top of the active treatment |
| Use one shared 1px border color for every inactive item | Give each inactive branded tile a different border color |
| Change utility foreground and background as a tested pair | Change only the foreground and assume contrast remains sufficient |

---

## Import & usage

```tsx
import { DockItem, DockItemLabel } from '@workspace/fes-os-design-system/components/ui/fes-os';

// Desktop — tooltip label
<DockItem
  className="size-14 border-accent bg-secondary ring-[3px] ring-primary after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-[18px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
  active={currentSection === 'work'}
  aria-label="Work"
  aria-current={currentSection === 'work' ? 'true' : undefined}
  onClick={() => setSection('work')}
>
  <WorkIcon strokeWidth={1.8} className="size-6" />
  <DockItemLabel presentation="tooltip" className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2">
    Work
  </DockItemLabel>
</DockItem>

// Mobile / tablet — inline label
<DockItem
  className="flex h-14 w-20 flex-col gap-1 border-accent bg-secondary ring-[3px] ring-primary after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-[26px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
  active={currentSection === 'work'}
  aria-label="Work"
  aria-current={currentSection === 'work' ? 'true' : undefined}
  onClick={() => setSection('work')}
>
  <WorkIcon strokeWidth={1.8} className="size-6" />
  <DockItemLabel presentation="inline">Work</DockItemLabel>
</DockItem>
```
