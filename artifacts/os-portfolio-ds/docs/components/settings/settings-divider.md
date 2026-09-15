# SettingsDivider

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/settings`
**Preview page:** `os-portfolio-settings`

---

## Purpose

Horizontal rule separating distinct sections within a settings content pane.

---

## Anatomy

```html
<hr class="my-5 border-0 border-t border-border/50" />
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Merged with base classes |
| `...props` | `HTMLAttributes<HTMLHRElement>` | — | All `<hr>` attributes |

---

## Accessibility

Renders as `<hr>` — implied `role="separator"`. No additional attributes needed for decorative dividers. Adapts to both light and dark themes via `border-border/50`.

---

## Distinction from `Separator`

Use `SettingsDivider` within settings content panes.
Use `Separator` from `ui/separator.tsx` for generic horizontal/vertical dividers in standard UI.

---

## Import & usage

```tsx
import { SettingsDivider } from '@workspace/os-portfolio-ds/components/ui/settings';

<SettingsSectionHeader label="Display" />
<SettingsToggleRow … />
<SettingsDivider />
<SettingsSectionHeader label="Motion" />
<SettingsToggleRow … />
```
