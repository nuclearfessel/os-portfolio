# DockItem / DockItemLabel

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

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
│ .active when open; .focused when topmost
```

- Root: `<button>` (forwarded ref)
- Open state: add `active` CSS class + pass `active={true}` prop
- Focused/topmost state: add `focused` CSS class + pass `focused={true}` prop

---

## DockItem Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | `false` | Applies `active` class and drives visual state |
| `focused` | `boolean` | `false` | Applies `focused` class for the topmost app's directional edge tab |
| `type` | `string` | `'button'` | Prevents form submission |
| `className` | `string` | — | Required — the consumer applies sizing and color tokens |
| `ref` | `Ref<HTMLButtonElement>` | — | Forwarded |
| `...props` | `ButtonHTMLAttributes` | — | Including `aria-label` |

`DockItem` intentionally exposes no built-in size or color — the consuming product applies those based on its layout and theme.

For the OS Portfolio desktop Dock, the container uses an 8px gap and 8px padding on
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

## Portfolio desktop shortcut contract

Shortcut behavior belongs to the consuming desktop product, not to `DockItem`.
The canonical labels and assignments are:

| Key | Dock item |
|---:|---|
| `1` | About |
| `2` | Work |
| `3` | Contact |
| `4` | Terminal |
| `5` | Stickies |
| `6` | Shortcuts |
| `7` | Settings |

Desktop tooltip labels append the assigned number, for example `Work · 2`.
Responsive inline labels omit shortcut numbers. Use **Work** consistently; do not
expand it to “Work.”

The Shortcuts item opens a non-modal drawer that:

- closes with `Escape`, an outside pointer press, or its trigger;
- stays open when interacting inside it;
- uses a compact 202px width;
- centers its kicker, description, and shortcut labels;
- keeps 8px between kicker and description;
- separates description from actions with the context-menu separator color and
  8px of space above and below;
- uses 20px shortcut rows with 0.5px gaps;
- keeps the beak tip, rather than the panel edge, 4px from the Shortcuts Dock
  item on the item’s inward-facing side;
- follows the Dock to any desktop edge and uses a directional beak aimed at the
  center of the Shortcuts item, including when viewport clamping shifts the drawer;
- lists all seven Dock assignments.

Number shortcuts must not run while focus is inside a color-value input.

Windowed Dock items use one consistent activation model: clicking an item opens
its window when closed and focuses/brings it forward when open. Clicking the
currently focused item must not minimize or close the window. Text-entry apps
such as Terminal may also return focus to their primary input on activation.

---

## Interactive states (DockItem)

| State | Visual |
|---|---|
| Default | Border + background from consumer classes |
| Open / active | Full-tile contrast ring; every open app retains this state |
| Focused / topmost | Directional 16–26px edge pill in addition to the active ring; exactly one item receives it |
| Hover | Inactive items only: branded apps retain their icon foreground, tile fill, and shared border; use a flat contrast-safe outline |
| High contrast | Branded app tiles retain the same contrast-safe foreground and fill as their matching desktop launcher; use the active marker rather than replacing app identity |
| Focus-visible | Uses the same flat, theme-appropriate outline while retaining the shared inactive border |

Treat branded app items and neutral utility controls as separate state systems.
App hover and focus must not replace the app's identity color. Utility controls
may change foreground and background together, but the resulting pair must meet
WCAG AA contrast in both light and dark themes.

Within a product Dock, inactive item borders should use one shared 1px color
rather than inheriting a different border from every branded tile. Keep that
border stable through hover and focus; use the flat outline for interaction
feedback.

The active state must remain distinguishable without hover. Use a full-tile
border/ring for every open app; an open but unfocused app has no edge tab. Add
the directional edge pill only to the focused/topmost
item so users can distinguish open apps from the current app. On mobile and
tablet, keep that pill visible beneath the inline label. Do not apply hover
styling to active items; their selected treatment remains unchanged under the
pointer.

---

## Accessibility

- Every `DockItem` **must** have `aria-label` set to the section name.
- When `active`, add `aria-current="true"` or `aria-pressed="true"` as appropriate.
- Use `focused` only for the currently focused/topmost open app; it does not replace keyboard focus semantics.
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
| Give every open app a full-tile border/ring and only the focused app an edge pill | Add a separate bottom tab to an open but unfocused app |
| Preserve branded tile and glyph colors and use a flat outline on hover/focus | Move, brighten, emboss, or recolor branded tiles on hover |
| Apply hover feedback only to inactive items | Layer hover styling on top of the active treatment |
| Use Dock clicks to open or focus windowed apps | Make one app minimize when its active Dock item is clicked |
| Use one shared 1px border color for every inactive item | Give each inactive branded tile a different border color |
| Change utility foreground and background as a tested pair | Change only the foreground and assume contrast remains sufficient |
| Show `1–7` in desktop Dock labels and the Shortcuts drawer | Show shortcut numbers in mobile or tablet inline labels |

---

## Import & usage

```tsx
import { DockItem, DockItemLabel } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

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
