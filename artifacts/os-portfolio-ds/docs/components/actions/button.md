# Button

**Source:** `src/components/ui/button.tsx`
**Export:** `Button`, `buttonVariants`
**Export path:** `@workspace/os-portfolio-ds/components/ui/button`
**Preview page:** `button`

---

## Purpose

The general-purpose interactive button. Use for standard UI patterns — forms, dialogs, toolbars. For OS Portfolio portfolio actions (window controls, project links), prefer `ActionButton` from `os-portfolio.tsx`.

---

## Anatomy

```
<button | Comp (asChild)>
  [leading icon?]  Label text  [trailing icon?]
</button>
```

- SVG children are automatically sized to `size-4` and made `pointer-events-none`.
- `asChild`: renders the consumer's child element instead of `<button>`, transferring all button styles and behavior via Radix Slot.

---

## Variants

| Variant | Appearance | Use |
|---|---|---|
| `default` | `bg-primary text-primary-foreground border border-primary-border` | Primary action |
| `destructive` | `bg-destructive text-destructive-foreground border-destructive-border shadow-sm` | Irreversible / destructive |
| `outline` | `border bg-transparent shadow-xs` | Secondary/neutral; inherits parent background |
| `secondary` | `border bg-secondary text-secondary-foreground border-secondary-border` | Supporting action |
| `ghost` | `border-transparent` | Minimal UI controls, table actions, icon buttons in toolbars |
| `link` | `text-primary underline-offset-4 hover:underline` | In-context text links |

---

## Sizes

| Size | Height | Padding | Notes |
|---|---|---|---|
| `default` | `min-h-9` | `px-4 py-2` | Standard |
| `sm` | `min-h-8` | `px-3` `text-xs` | Compact controls |
| `lg` | `min-h-10` | `px-8` | Prominent CTA |
| `icon` | `h-9 w-9` | — | Square icon button |

---

## Interactive states

| State | Visual |
|---|---|
| Default | Variant base |
| Hover | `hover-elevate` (subtle overlay lift from CSS variable) |
| Active | `active-elevate-2` (slightly stronger overlay) |
| Focus-visible | `ring-1 ring-ring` |
| Disabled | `opacity-50 pointer-events-none` |

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | see variants | `'default'` | Visual variant |
| `size` | see sizes | `'default'` | Size preset |
| `asChild` | `boolean` | `false` | Render as child element via Radix Slot |
| `ref` | `Ref<HTMLButtonElement>` | — | Forwarded |
| `...props` | `ButtonHTMLAttributes` | — | All native button attributes |

---

## Accessibility

- Native `<button>` — keyboard focus and activation built-in.
- `asChild` with `<a>` produces a link that looks like a button — add `aria-label` if text is icon-only.
- Disabled state: use `disabled` prop or `aria-disabled` + `tabIndex={-1}` for links styled as buttons.

---

## Relevant tokens

`bg-primary`, `text-primary-foreground`, `--primary-border`, `bg-secondary`, `bg-destructive`, `ring`, `--elevate-1`, `--elevate-2`

---

## Import & usage

```tsx
import { Button } from '@workspace/os-portfolio-ds/components/ui/button';

<Button>Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive">Delete account</Button>
<Button variant="ghost" size="icon" aria-label="Settings">
  <SettingsIcon />
</Button>

// As link
<Button variant="link" asChild>
  <a href="/about">Learn more</a>
</Button>
```
