# ActionButton

**Sources:** `src/components/ui/os-portfolio.tsx`, `src/components/ui/os-portfolio-action-button.css`
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
| `primary` | Solid brand fill. Light hover uses an opaque sage surface with coral text/border; dark hover uses an opaque indigo surface with lime text/border. | Desktop “open work” and the single dominant action |
| `secondary` (default) | Light coral outline → solid teal; dark indigo surface with lime text/border → solid lime | Settings, Guide, Work, and other in-window actions |
| `tertiary` | Neutral surface → solid theme accent with matching border so no distinct border is visible | Desktop “say hello” and lower-emphasis actions |
| `danger` | Solid destructive treatment with a subtle brightness lift | Irreversible actions such as delete or confirm removal |

---

## Interactive states

| State | Visual |
|---|---|
| Default | Variant-specific mapped surface, foreground, and border |
| Hover | `primary` inverts the adjacent in-window relationship; `secondary` fills from its outline treatment; `tertiary` becomes a solid borderless-looking accent; `danger` lifts slightly |
| Focus-visible | `outline-2 outline-offset-2` (uses `--color-ring`) |
| Disabled | Pass `disabled` — browser default `pointer-events-none opacity-50` applies |

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'secondary'` | Visual hierarchy |
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

Each variant exposes `--component-action-button-{variant}-background`, `-foreground`, `-border`, `-hover`, `-hover-foreground`, `-hover-border`, and `-focus`. These aliases resolve through the semantic `primary`, `secondary`, `actionSurface`, `accent`, `accentStrong`, `destructive`, and foreground roles.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `primary` for the single dominant action such as “open work” | Use multiple competing primary actions in one view |
| Use the default `secondary` for Settings, Guide, and Work window actions | Use `secondary` for the desktop “say hello” action |
| Use `tertiary` for lower-emphasis actions such as “say hello” | Add an outlined border to the tertiary hover treatment |
| Use `variant="danger"` for destructive actions | Use `danger` for warnings or caution states |
| Add `aria-label` to icon-only instances | Leave icon-only buttons without an accessible name |

---

## Import & usage

```tsx
import { ActionButton } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

// Primary
<ActionButton variant="primary" onClick={handleOpenWork}>
  Open work
</ActionButton>

// Secondary (default, in-window)
<ActionButton onClick={handleOpenCaseStudy}>
  View case study
</ActionButton>

// Tertiary
<ActionButton variant="tertiary" onClick={handleContact}>
  Say hello
</ActionButton>

// Danger
<ActionButton variant="danger" onClick={handleDelete}>
  Delete note
</ActionButton>
```
