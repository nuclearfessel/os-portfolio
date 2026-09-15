# ProjectCard

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

---

## Purpose

A structured list item for portfolio work — displays a numbered index, title, description, category tag, and an optional action (e.g. "View case study"). Used in the "Work" window.

---

## Anatomy

```
┌─────────────────────────────────────────────────┐
│  01         ← .project-index (font-mono, accent) │
│  Title ← h3                                      │
│  Description ← p                                 │
│  TAG         ← .project-tag                      │
│  [action]    ← optional ActionButton             │
└─────────────────────────────────────────────────┘
```

Renders as `<article>` with `role` implied. Internal layout: `grid items-center gap-3 p-4`.

---

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `index` | `string` | ✓ | Display number (e.g. `"01"`) — `font-mono text-xs` |
| `title` | `string` | ✓ | Project name — rendered in `<h3>` |
| `description` | `string` | ✓ | Short description |
| `tag` | `string` | ✓ | Category / year label (e.g. `"PRODUCT / 2024"`) |
| `accent` | `string` | — | Optional CSS color value applied to the index number |
| `action` | `ReactNode` | — | Optional action element (typically `<ActionButton>`) |
| `className` | `string` | — | Merged with base classes |
| `...props` | `HTMLAttributes<HTMLElement>` | — | All HTML attributes for `<article>` |

---

## Interactive states

The card itself is static. The `action` slot provides interactive behaviour.

---

## Accessibility

- Renders as `<article>` — semantically a self-contained content unit in a list context.
- The `index`, `title`, `description`, and `tag` are plain text — exposed to screen readers.
- The `action` slot should use `ActionButton` with an accessible label.

---

## Relevant tokens

`bg-card`, `text-card-foreground`, `border-border`, `rounded-md`, `font-mono`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Pass `accent` to color-code projects with the system's primary or a fixed color | Apply random colors not in the design system palette |
| Use `<ActionButton variant="primary">` in the `action` slot | Place multiple competing actions in one card |
| Wrap a list of `ProjectCard`s in a container with `role="list"` | Nest `ProjectCard` inside another `article` without clear hierarchy |

---

## Import & usage

```tsx
import { ProjectCard } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';
import { ActionButton } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

<ProjectCard
  index="01"
  title="Northstar Commerce System"
  description="A flexible foundation that helped a growing commerce team ship consistent storefront and account experiences."
  tag="DESIGN SYSTEM / 2025"
  accent="#e4ff5b"
  action={
    <ActionButton>View case study</ActionButton>
  }
/>
```
