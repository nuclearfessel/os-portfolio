# SettingsNavSection / SettingsNavItem

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/fes-os-design-system/components/ui/settings`
**Preview page:** `fes-os-settings`

---

## Purpose

Sidebar navigation for a settings window. `SettingsNavSection` is the `<nav>` landmark; `SettingsNavItem` is each individual navigation button.

---

## SettingsNavSection

### Anatomy
```
<nav aria-label="Settings sections">
  <SettingsNavItem>Personalization</SettingsNavItem>
  <SettingsNavItem>Accessibility</SettingsNavItem>
</nav>
```

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `'Settings sections'` | `aria-label` for the `<nav>` landmark |
| `className` | `string` | — | Merged |
| `children` | `ReactNode` | — | `SettingsNavItem` elements |

---

## SettingsNavItem

### Anatomy
```
<button class="flex items-center gap-2 …">
  <span aria-hidden>[icon]</span>
  {children}
</button>
```

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | `false` | Applies `bg-primary/10 text-primary` |
| `icon` | `ReactNode` | — | 14×14px icon (wrapped in `aria-hidden` span) |
| `aria-current` | `'page' \| undefined` | — | Set `"page"` when active |
| `onClick` | `() => void` | — | Section switch handler |
| `className` | `string` | — | Merged |

### States

| State | Visual |
|---|---|
| Default | `text-muted-foreground` |
| Hover | `bg-muted text-foreground` |
| Active | `bg-primary/10 text-primary` |
| Focus-visible | `outline-2 outline-offset-1 outline-ring` |

---

## Accessibility

- `SettingsNavSection` renders `<nav aria-label="…">` — a named navigation landmark.
- Active item carries `aria-current="page"`.
- Icon is wrapped in `aria-hidden="true"` span — accessible name comes from `children` text.
- Focus ring is `outline` (not `ring`) to avoid layout shift.

---

## Import & usage

```tsx
import { SettingsNavSection, SettingsNavItem } from '@workspace/fes-os-design-system/components/ui/settings';
import { SunIcon, EyeIcon } from 'lucide-react';

<SettingsNavSection label="Settings sections">
  <SettingsNavItem
    active={section === 'personalization'}
    aria-current={section === 'personalization' ? 'page' : undefined}
    icon={<SunIcon size={14} />}
    onClick={() => setSection('personalization')}
  >
    Personalization
  </SettingsNavItem>
  <SettingsNavItem
    active={section === 'accessibility'}
    aria-current={section === 'accessibility' ? 'page' : undefined}
    icon={<EyeIcon size={14} />}
    onClick={() => setSection('accessibility')}
  >
    Accessibility
  </SettingsNavItem>
</SettingsNavSection>
```
