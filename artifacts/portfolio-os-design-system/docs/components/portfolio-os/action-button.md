# ActionButton

**Source:** `src/components/ui/portfolio-os.tsx`
**Export path:** `@workspace/portfolio-os-design-system/components/ui/portfolio-os`
**Preview page:** `portfolio-os-pilot`

---

## Purpose

`ActionButton` is the portfolio's own action primitive — a compact, consistently-sized button for window quick-actions, project links, confirmation dialogs, and contact calls to action. It complements (but does not replace) the general-purpose `Button` component from `ui/button.tsx`. Use `ActionButton` for Portfolio OS surfaces; use `Button` for standard UI patterns.

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
| `secondary` (default) | `bg-secondary border-border` → hover: `border-primary` | Most window actions, neutral choices |
| `primary` | `bg-primary text-primary-foreground border-primary` → hover: `brightness-105` | Single primary call to action per view |
| `danger` | `bg-destructive text-destructive-foreground border-destructive` → hover: `brightness-110` | Irreversible actions (delete, confirm removal) |

---

## Interactive states

| State | Visual |
|---|---|
| Default | As per variant |
| Hover | `secondary`: border becomes `border-primary`; `primary`/`danger`: subtle brightness lift |
| Focus-visible | `outline-2 outline-offset-2` (uses `--color-ring`) |
| Disabled | Pass `disabled` — browser default `pointer-events-none opacity-50` applies |

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'secondary'` | Visual variant |
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

`bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-secondary-foreground`, `border-border`, `border-primary`, `bg-destructive`, `text-destructive-foreground`, `ring`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `variant="primary"` for the single main action per window | Place two `primary` buttons side by side |
| Use `variant="danger"` for destructive actions | Use `danger` for warnings or caution states |
| Add `aria-label` to icon-only instances | Leave icon-only buttons without an accessible name |

---

## Import & usage

```tsx
import { ActionButton } from '@workspace/portfolio-os-design-system/components/ui/portfolio-os';

// Secondary (default)
<ActionButton onClick={handleClose}>Close</ActionButton>

// Primary
<ActionButton variant="primary" onClick={handleSubmit}>
  View case study
</ActionButton>

// Danger
<ActionButton variant="danger" onClick={handleDelete}>
  Delete note
</ActionButton>
```
