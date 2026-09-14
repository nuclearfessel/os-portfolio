# ProjectCard

**Source:** `src/components/ui/fes-os.tsx`
**Export path:** `@workspace/fes-os-design-system/components/ui/fes-os`
**Preview page:** `fes-os-pilot`

---

## Purpose

A structured list item for portfolio work — displays a numbered index, title, description, category tag, and an optional action (e.g. "View case study"). Used in the "Selected Work" window.

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
import { ProjectCard } from '@workspace/fes-os-design-system/components/ui/fes-os';
import { ActionButton } from '@workspace/fes-os-design-system/components/ui/fes-os';

<ProjectCard
  index="01"
  title="Orbit CRM"
  description="A calmer command center for customer teams managing complex accounts."
  tag="PRODUCT / 2024"
  accent="#e4ff5b"
  action={
    <ActionButton variant="primary">View case study</ActionButton>
  }
/>
```
