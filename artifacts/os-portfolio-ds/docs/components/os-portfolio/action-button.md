# ActionButton

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

---

## Purpose

`ActionButton` is the portfolio's own action primitive — a compact, consistently-sized button for window quick-actions, project links, confirmation dialogs, and contact calls to action. It complements (but does not replace) the general-purpose `Button` component from `ui/button.tsx`. Use `ActionButton` for OS Portfolio surfaces; use `Button` for standard UI patterns.

---

## Anatomy

```
┌──────────────────────────────┐
│  [icon?]  Label text         │  ← min-h-9, px-3
└──────────────────────────────┘
```

- Root: `<button>` (or forwarded ref)
- Content: passed as `children` — text, icons, or a combination

---

## Variants

| Variant | Appearance | Use |
|---|---|---|
| `secondary` (default) | Theme-mapped in-window action: light transparent with an `accent` outline → solid `primary`; dark `secondary` with primary text/border → solid `primary` | Work, Settings, Guide, and other in-window actions |
| `primary` | `bg-primary text-primary-foreground border-primary` → hover: `brightness-105` | Single primary call to action per view |
| `desktopPrimary` | Primary fill → the desktop secondary quick-action hover treatment (`accent` in light, `secondary` with primary text/border in dark) | Desktop “open work” quick action only |
| `danger` | `bg-destructive text-destructive-foreground border-destructive` → hover: `brightness-110` | Irreversible actions (delete, confirm removal) |

---

## Interactive states

| State | Visual |
|---|---|
| Default | Light mode is border-only with accent text; dark mode uses the secondary surface with primary text and border |
| Hover | `secondary`: swaps to the theme's solid primary fill and primary foreground; `desktopPrimary`: matches the neighboring desktop secondary action; `primary`/`danger`: subtle brightness lift |
| Focus-visible | `outline-2 outline-offset-2` (uses `--color-ring`) |
| Disabled | Pass `disabled` — browser default `pointer-events-none opacity-50` applies |

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'desktopPrimary' \| 'danger'` | `'secondary'` | Visual variant |
| `type` | `HTMLButtonElement['type']` | `'button'` | Prevents accidental form submission |
| `className` | `string` | — | Merged with base classes |
| `ref` | `Ref<HTMLButtonElement>` | — | Forwarded to the root `<button>` |
| `...props` | `ButtonHTMLAttributes` | — | All native button attributes |

---

## Accessibility

- Uses a native `<button>` — receives keyboard focus and activation automatically.
- Default `type="button"` prevents form submission.
- Add `aria-label` when the button contains only an icon.
- Destructive actions should confirm before executing.

---

## Responsive guidance

`min-h-9` guarantees a 36px minimum touch target. At narrower breakpoints, stack buttons vertically with `flex-col` on the container rather than reducing button size.

---

## Relevant tokens

`--component-action-button-background`, `--component-action-button-foreground`, `--component-action-button-border`, `--component-action-button-hover`, `--component-action-button-hover-foreground`, `--component-action-button-hover-border`, `--component-action-button-focus`, and the parallel `--component-desktop-primary-action-*` aliases, plus the semantic `primary`, `secondary`, `accent`, and foreground roles they reference.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use the default `secondary` variant for in-window actions that follow the shared theme mechanic | Reuse this treatment for desktop quick actions such as “open work” |
| Use `desktopPrimary` only for the desktop’s main quick action | Use `desktopPrimary` for actions inside windows |
| Use `variant="danger"` for destructive actions | Use `danger` for warnings or caution states |
| Add `aria-label` to icon-only instances | Leave icon-only buttons without an accessible name |

---

## Import & usage

```tsx
import { ActionButton } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

// Secondary (default)
<ActionButton onClick={handleClose}>Close</ActionButton>

// In-window action
<ActionButton onClick={handleOpenCaseStudy}>
  View case study
</ActionButton>

// Primary
<ActionButton variant="primary" onClick={handleSubmit}>
  Save changes
</ActionButton>

// Desktop primary quick action
<ActionButton variant="desktopPrimary" onClick={handleOpenWork}>
  Open work
</ActionButton>

// Danger
<ActionButton variant="danger" onClick={handleDelete}>
  Delete note
</ActionButton>
```
