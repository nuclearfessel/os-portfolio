# Pattern: Project-Card List

**Preview:** `fes-os-pilot` (ProjectCard demo), `item` (Item family)

---

## Intent

The "Selected Work" window presents a vertical list of portfolio projects. Each entry has a numbered index, title, description, category tag, optional accent color, and a primary action button.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `ProjectCard` | `fes-os.tsx` | Primary project row |
| `ActionButton` | `fes-os.tsx` | "View case study" action |
| `ScrollArea` | `ui/scroll-area.tsx` | Scrollable container for long lists |
| `Item` / `ItemGroup` | `ui/item.tsx` | Alternative for more generic content lists |

---

## Anatomy

```
┌────────────────────────────────────────────────────┐  WindowSurface
│  ./selected-work    ← SectionLabel                 │
├────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐  │  ProjectCard
│  │  01          ← .project-index (accent color) │  │
│  │  Orbit CRM   ← h3                            │  │
│  │  Description ← p                             │  │
│  │  PRODUCT / 2024  ← .project-tag             │  │
│  │  [View case study] ← ActionButton primary    │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  02  …                                       │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

---

## State ownership

| Concern | Product responsibility |
|---|---|
| Project data | Product |
| Accent colors | Product (passed as `accent` prop) |
| Navigation on CTA click | Product |
| Scroll position | Product (or `ScrollArea`) |

---

## Responsive transformation

| Breakpoint | Layout |
|---|---|
| Desktop | List inside floating `WindowSurface` |
| Tablet | Centered modal / sheet containing the list |
| Mobile | Full-width list in `DrawerContent` or dedicated page |

---

## Accessibility checklist

- [ ] List wrapper has `role="list"` (or use `<ul>`).
- [ ] Each `ProjectCard` renders as `<article>` — self-contained content unit.
- [ ] "View case study" button has descriptive text (avoid generic "View" without context).
- [ ] Accent color is not the sole differentiator between projects — index numbers carry identity.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `accent` prop to color-code projects | Use random non-token colors |
| Keep project actions to one primary per card | Add multiple competing actions to a single card |
| Wrap the list in `ScrollArea` for tall content | Let the list overflow the window without scroll control |

---

## Composition example

```tsx
import { ProjectCard, ActionButton, SectionLabel } from '@workspace/fes-os-design-system/components/ui/fes-os';
import { ScrollArea } from '@workspace/fes-os-design-system/components/ui/scroll-area';

const projects = [
  { index: '01', title: 'Orbit CRM', description: '…', tag: 'PRODUCT / 2024', accent: '#e4ff5b' },
  { index: '02', title: 'Solara', description: '…', tag: 'PRODUCT / 2023', accent: '#ff8d79' },
];

<ScrollArea className="h-full">
  <div className="p-5 space-y-4">
    <SectionLabel>./selected-work</SectionLabel>
    <ul role="list" className="space-y-3">
      {projects.map((p) => (
        <li key={p.index}>
          <ProjectCard
            {...p}
            action={
              <ActionButton variant="primary" onClick={() => openCaseStudy(p.index)}>
                View case study
              </ActionButton>
            }
          />
        </li>
      ))}
    </ul>
  </div>
</ScrollArea>
```
