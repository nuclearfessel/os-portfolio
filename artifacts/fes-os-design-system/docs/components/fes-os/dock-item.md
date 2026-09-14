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
| Active | `active` class applied; consumer can target `.active` in CSS |
| Hover | `transition-colors duration-100` — consumer supplies hover utility |
| Focus-visible | Inherits `focus-visible:ring-2 focus-visible:ring-ring` from consumer or browser |

---

## Accessibility

- Every `DockItem` **must** have `aria-label` set to the section name.
- When `active`, add `aria-current="true"` or `aria-pressed="true"` as appropriate.
- `DockItemLabel` with `presentation="tooltip"` should be position-absolute / `pointer-events-none` and hidden from the tab order (it is decorative; the `aria-label` names the button).

---

## Relevant tokens

`rounded-lg`, `border-border`, `bg-secondary`, `bg-primary`, `text-primary-foreground`, `font-mono`, `popover`/`popover-foreground` (tooltip surface)

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Supply `aria-label` on every `DockItem` | Rely on `DockItemLabel` text as the only accessible name |
| Use `presentation="tooltip"` only on desktop | Show tooltip labels on mobile (they overlap other content) |
| Keep Dock icons in a fixed footprint across states | Resize the icon on hover/active |

---

## Import & usage

```tsx
import { DockItem, DockItemLabel } from '@workspace/fes-os-design-system/components/ui/fes-os';

// Desktop — tooltip label
<DockItem
  className="size-14 bg-secondary border-border"
  active={currentSection === 'work'}
  aria-label="Work"
  onClick={() => setSection('work')}
>
  <WorkIcon strokeWidth={1.8} className="size-6" />
  <DockItemLabel presentation="tooltip" className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2">
    Work
  </DockItemLabel>
</DockItem>

// Mobile / tablet — inline label
<DockItem
  className="flex h-14 w-20 flex-col gap-1 bg-secondary border-border"
  active={currentSection === 'work'}
  aria-label="Work"
  onClick={() => setSection('work')}
>
  <WorkIcon strokeWidth={1.8} className="size-6" />
  <DockItemLabel presentation="inline">Work</DockItemLabel>
</DockItem>
```
