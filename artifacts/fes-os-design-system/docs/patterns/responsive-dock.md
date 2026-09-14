# Pattern: Responsive Dock Navigation

**Preview:** `fes-os-pilot` (DockItem + DockItemLabel demos)

---

## Intent

The Dock is the primary navigation surface — a persistent bar of icon buttons that activate windows and sections. Its label presentation adapts by breakpoint: floating tooltip on desktop, always-visible inline label on mobile and tablet.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `DockItem` | `fes-os.tsx` | Activatable button cell |
| `DockItemLabel` | `fes-os.tsx` | Breakpoint-switched label |
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

---

## Tokens

`bg-secondary`, `border-border`, `bg-primary` (active fill), `text-primary-foreground`, `rounded-lg`, `bg-popover`, `border-border`, `font-mono`, `shadow`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Show inline labels on mobile and tablet | Use tooltip labels on touch screens |
| Give every DockItem an `aria-label` | Rely on DockItemLabel text as the accessible name |
| Keep the Dock fixed at the bottom on mobile | Make the Dock scroll horizontally on small screens |
| Use `active` prop to reflect current section | Manage active state only via CSS |
| Use a flat outline and border change for branded app feedback | Move, brighten, emboss, or recolor Dock items on hover |
| Keep the active ring and edge pill visible in every theme and breakpoint | Hide the active indicator on mobile or rely on color alone |

---

## Composition example

```tsx
import { DockItem, DockItemLabel } from '@workspace/fes-os-design-system/components/ui/fes-os';

function NavDock({ section, setSection, isDesktop }) {
  const items = [
    { id: 'home', label: 'Home', icon: <HomeIcon strokeWidth={1.8} /> },
    { id: 'work', label: 'Work', icon: <BriefcaseIcon strokeWidth={1.8} /> },
  ];

  return (
    <nav aria-label="Main navigation" className="flex gap-2">
      {items.map((item) => (
        <DockItem
          key={item.id}
          active={section === item.id}
          aria-label={item.label}
          aria-current={section === item.id ? 'true' : undefined}
          onClick={() => setSection(item.id)}
          className={
            isDesktop
              ? 'relative size-14 border-border bg-secondary'
              : 'relative flex h-14 w-20 flex-col items-center gap-1 border-border bg-secondary'
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
