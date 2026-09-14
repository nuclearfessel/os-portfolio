# SettingsSectionHeader

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/fes-os-design-system/components/ui/settings`
**Preview page:** `fes-os-settings`

---

## Purpose

A label + optional description header for a settings sub-section within the content pane. Groups related settings controls under a clear heading.

---

## Anatomy

```
Display                           ← text-[13px] font-medium text-foreground
Adjust how elements appear.       ← text-[11px] leading-relaxed text-muted-foreground
```

---

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | `ReactNode` | ✓ | Section heading |
| `description` | `ReactNode` | — | Optional helper text |
| `className` | `string` | — | Merged |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | All div attributes |

---

## Accessibility

- Rendered as a `<div>` with two `<span>` children — not a semantic heading.
- If the section has enough context from surrounding headings, this is sufficient.
- For landmark-level sections, combine with a visually hidden `<h2>`/`<h3>`.

---

## Import & usage

```tsx
import { SettingsSectionHeader } from '@workspace/fes-os-design-system/components/ui/settings';

<SettingsSectionHeader
  label="Display"
  description="Adjust how elements appear on screen."
/>
<SettingsToggleRow … />

<SettingsSectionHeader label="Motion" />
<SettingsToggleRow … />
```
