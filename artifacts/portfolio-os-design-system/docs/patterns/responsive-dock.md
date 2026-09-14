# Pattern: Responsive Dock Navigation

**Preview:** `portfolio-os-pilot` (DockItem + DockItemLabel demos)

---

## Intent

The Dock is the primary navigation surface — a persistent bar of icon buttons that activate windows and sections. Its label presentation adapts by breakpoint: floating tooltip on desktop, always-visible inline label on mobile and tablet.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `DockItem` | `portfolio-os.tsx` | Activatable button cell |
| `DockItemLabel` | `portfolio-os.tsx` | Breakpoint-switched label |
| `Tooltip` / `TooltipProvider` | `ui/tooltip.tsx` | Alternative for label overflow (optional) |

---

## Anatomy / Composition

```
Desktop Dock:
┌────┐ ┌────┐ ┌────┐
│ 🏠 │ │ 💼 │ │ 📬 │   ← DockItem (icon, fixed size)
└────┘ └────┘ └────┘
[tooltip label shown on hover/focus — above or below]

Mobile / Tablet Dock (bottom bar):
┌──────┐ ┌──────┐ ┌──────┐
│  🏠  │ │  💼  │ │  📬  │
│ Home │ │ Work │ │Contact│  ← inline label always visible
└──────┘ └──────┘ └──────┘
```

---

## DockItemLabel presentation switching

| Breakpoint | `presentation` value | Result |
|---|---|---|
| Desktop (≥ 1024px) | `"tooltip"` | Tooltip surface: `border bg-popover shadow font-mono text-[10px]` |
| Mobile / tablet (< 1024px) | `"inline"` | Plain text: `font-sans` no border/bg/shadow/padding |

The tooltip label should be positioned absolutely above or below the Dock item:

```tsx
<DockItemLabel
  presentation="tooltip"
  className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-100"
>
  Work
</DockItemLabel>
```

The inline label sits as a child in the `DockItem`'s flex column:

```tsx
<DockItem className="flex flex-col items-center gap-1 h-14 w-20">
  <WorkIcon />
  <DockItemLabel presentation="inline">Work</DockItemLabel>
</DockItem>
```

---

## State ownership

| Concern | Product responsibility |
|---|---|
| Active section | Product state — passed as `active={true}` to `DockItem` |
| Icon and label content | Product |
| Dock position (left/bottom/floating) | Product layout |
| Breakpoint detection | Product (`useMediaQuery` or CSS container queries) |

---

## Responsive transformation

| Breakpoint | Dock position | Label style | Min touch target |
|---|---|---|---|
| Desktop | Any (typically bottom or left edge) | Tooltip | 44×44px |
| Tablet | Bottom edge, fixed | Inline visible | 44×44px |
| Mobile | Bottom edge, fixed, full-width | Inline visible | 44×44px |

Mobile navigation must remain fixed at the bottom — do not hide it or make it scrollable.

### Desktop spacing

| Measurement | Value |
|---|---|
| Gap between Dock items | 8px |
| Dock padding, all edges | 8px |
| Inactive item border | 1px solid, one shared color per theme |

Use the spacing pair together. Do not independently tighten the edge padding or
increase the gaps between items.

---

## Accessibility checklist

- [ ] Every `DockItem` has `aria-label` set to the section name.
- [ ] Active item has `aria-current="true"` or `aria-pressed="true"`.
- [ ] `DockItemLabel presentation="tooltip"` is `pointer-events-none` and excluded from tab order.
- [ ] Mobile labels are always visible — not tooltip-only.
- [ ] Dock container has `role="navigation"` and `aria-label="Main navigation"` or equivalent.
- [ ] Branded app hover/focus states preserve each app's tile and glyph colors.
- [ ] Neutral utility hover/focus foreground and background pairs meet WCAG AA in both themes.
- [ ] Active items use a full-tile ring and a substantial edge pill, not a small dot alone.
- [ ] The active pill remains visible beneath mobile and tablet inline labels.
- [ ] Hover styling applies only to inactive items; active items remain unchanged under the pointer.
- [ ] All inactive items use the same 1px border color within a theme.

---

## Tokens

`bg-secondary`, `border-accent` (shared inactive border), `ring-primary` (active ring and pill), `text-primary-foreground`, `rounded-lg`, `gap-2`, `p-2`, `bg-popover`, `border-border`, `font-mono`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Show inline labels on mobile and tablet | Use tooltip labels on touch screens |
| Give every DockItem an `aria-label` | Rely on DockItemLabel text as the accessible name |
| Keep the Dock fixed at the bottom on mobile | Make the Dock scroll horizontally on small screens |
| Use `active` prop to reflect current section | Manage active state only via CSS |
| Use a flat outline while preserving the shared inactive border | Move, brighten, emboss, recolor, or change Dock item borders on hover |
| Keep the active ring and edge pill visible in every theme and breakpoint | Hide the active indicator on mobile or rely on color alone |
| Keep active items visually stable on hover | Add a second hover treatment on top of active styling |
| Standardize inactive items on one 1px border color | Use unrelated border colors for each inactive app tile |

---

## Composition example

```tsx
import { DockItem, DockItemLabel } from '@workspace/portfolio-os-design-system/components/ui/portfolio-os';

function NavDock({ section, setSection, isDesktop }) {
  const items = [
    { id: 'home', label: 'Home', icon: <HomeIcon strokeWidth={1.8} /> },
    { id: 'work', label: 'Work', icon: <BriefcaseIcon strokeWidth={1.8} /> },
  ];

  return (
    <nav aria-label="Main navigation" className="flex gap-2 rounded-xl border border-border bg-card p-2">
      {items.map((item) => (
        <DockItem
          key={item.id}
          active={section === item.id}
          aria-label={item.label}
          aria-current={section === item.id ? 'true' : undefined}
          onClick={() => setSection(item.id)}
          className={
            section === item.id
              ? isDesktop
                ? "relative size-14 border-accent bg-secondary ring-[3px] ring-primary after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-[18px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
                : "relative flex h-14 w-20 flex-col items-center gap-1 border-accent bg-secondary ring-[3px] ring-primary after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-[26px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
              : isDesktop
                ? 'relative size-14 border-accent bg-secondary hover:outline-2 hover:outline-offset-2 hover:outline-ring'
                : 'relative flex h-14 w-20 flex-col items-center gap-1 border-accent bg-secondary hover:outline-2 hover:outline-offset-2 hover:outline-ring'
          }
        >
          {item.icon}
          <DockItemLabel
            presentation={isDesktop ? 'tooltip' : 'inline'}
            className={isDesktop ? 'absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2' : ''}
          >
            {item.label}
          </DockItemLabel>
        </DockItem>
      ))}
    </nav>
  );
}
```
