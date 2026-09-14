# SettingsContrastCard

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/portfolio-os-design-system/components/ui/settings`
**Preview page:** `portfolio-os-settings`

---

## Purpose

A selectable card that lets users choose a contrast theme — Standard, Low Contrast, or High Contrast. Each card shows a fixed-palette preview miniature of what the selected mode looks like.

---

## Anatomy

```
┌─────────────────┐
│  ┌─────────────┐│  ← preview miniature (aspect-[3/2])
│  │ [bar]       ││    fixed colors, not themed
│  │ [accent]    ││
│  │ [text]      ││
│  └─────────────┘│
│  ✓ Label        │  ← selected: text-primary + check mark
│  Description    │
└─────────────────┘
```

---

## Variants

| Variant | Preview palette | CSS properties used |
|---|---|---|
| `standard` | Dark desktop (fixed inline values) | Hardcoded rgba values |
| `low` | Soft dark (`--contrast-*`) | CSS custom properties from `:root` |
| `high` | Black/white/yellow (`--hc-*`) | CSS custom properties from `:root` |

Preview colors are **theme-independent** — the card always shows what each mode looks like before the user selects it.

---

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | `'standard' \| 'low' \| 'high'` | ✓ | Which contrast theme this card represents |
| `label` | `string` | ✓ | Visible label text |
| `description` | `string` | — | Optional description below the label |
| `selected` | `boolean` | ✓ | Whether this card is currently selected |
| `onSelect` | `() => void` | ✓ | Called when the card is activated |
| `data-testid` | `string` | — | Applied to the root button |
| `className` | `string` | — | Merged |

---

## Interactive states

| State | Visual |
|---|---|
| Unselected | `border-border/40` preview border; `text-muted-foreground` label |
| Unselected hover | `border-primary/50` preview border |
| Selected | `border-primary` preview border; `text-primary` label + check SVG |
| Focus-visible | `ring-2 ring-ring ring-offset-2` |

---

## Accessibility

- Each card renders as `<button role="radio" aria-checked={selected}>`.
- The parent container must have `role="radiogroup" aria-label="Contrast theme"`.
- Preview miniature is `aria-hidden="true"` — decorative.

---

## Behavior contract

The consuming app sets the contrast attribute on `:root`:

```js
if (theme === 'none') {
  document.documentElement.removeAttribute('data-contrast');
} else {
  document.documentElement.setAttribute('data-contrast', theme);
}
```

When `data-contrast` is set, the package stylesheet re-maps all semantic tokens automatically.

---

## Import & usage

```tsx
import { SettingsContrastCard } from '@workspace/portfolio-os-design-system/components/ui/settings';

<div role="radiogroup" aria-label="Contrast theme" className="flex flex-wrap gap-3">
  <SettingsContrastCard
    variant="standard"
    label="Standard"
    description="Default appearance"
    selected={prefs.contrastTheme === 'none'}
    onSelect={() => updatePrefs({ contrastTheme: 'none' })}
  />
  <SettingsContrastCard
    variant="low"
    label="Low contrast"
    description="Reduced visual harshness"
    selected={prefs.contrastTheme === 'low'}
    onSelect={() => updatePrefs({ contrastTheme: 'low' })}
  />
  <SettingsContrastCard
    variant="high"
    label="High contrast"
    description="Maximum black/white separation"
    selected={prefs.contrastTheme === 'high'}
    onSelect={() => updatePrefs({ contrastTheme: 'high' })}
  />
</div>
```
