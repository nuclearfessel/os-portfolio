# SettingsToggleRow

**Source:** `src/components/ui/settings.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/settings`
**Preview page:** `os-portfolio-settings`

---

## Purpose

An accessible settings preference row — label, optional description, and a pill switch. Used for boolean preferences (transparency on/off, animations on/off, always-show-scrollbars).

---

## Anatomy

```
┌────────────────────────────────────────────────────┐
│  Label text                      [●────] (pill)    │
│  Optional description line                         │
└────────────────────────────────────────────────────┘
```

- Root: `<label htmlFor={id}>` — clicking the label row activates the switch.
- Switch: `<button role="switch" aria-checked={checked}>` with translated knob.

---

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Links `<label>` to the switch button |
| `label` | `string` | ✓ | Visible label text + `aria-label` on the switch |
| `description` | `string` | — | Optional secondary help text |
| `checked` | `boolean` | ✓ | Controlled on/off state |
| `onChange` | `(checked: boolean) => void` | ✓ | Called with the new boolean |
| `disabled` | `boolean` | — | `opacity-45 pointer-events-none` |
| `data-testid` | `string` | — | Root testid; `-switch` suffix on the button |
| `className` | `string` | — | Merged with root |

---

## Interactive states

| State | Visual |
|---|---|
| Off | Track: `bg-border/60`; knob: left |
| On | Track: `bg-primary`; knob: `translate-x-4` |
| Hover (row) | `border-border/60 bg-card/60` |
| Focus-visible (switch) | `ring-2 ring-ring ring-offset-1` |
| Disabled | `opacity-45 pointer-events-none` |

---

## Accessibility

- `<label htmlFor={id}>` + `<button id={id}>` — clicking anywhere on the row activates the switch.
- `role="switch"` + `aria-checked` — correctly announced as a toggle switch.
- `aria-label={label}` on the button — announces the preference name to screen readers.
- Disabled: use `disabled` prop; keep the row visible (do not hide it).

---

## Behavior contract

`SettingsToggleRow` is fully controlled — it has no internal state. The consuming app:
1. Reads `checked` from its state.
2. Calls `onChange(newValue)` to update state.
3. Writes the appropriate DOM attribute on the shell element (e.g., `data-no-transparency`).

See → [State contracts table in settings.md](../../references/components/settings.md#state-contracts)

---

## Import & usage

```tsx
import { SettingsToggleRow } from '@workspace/os-portfolio-ds/components/ui/settings';

<SettingsToggleRow
  id="a11y-transparency"
  label="Window transparency effects"
  description="Enables blur and translucency on windows, the dock, and menus."
  checked={prefs.windowTransparency}
  onChange={(v) => updatePrefs({ windowTransparency: v })}
  disabled={prefs.contrastTheme !== 'none'}  // disabled when contrast is active
/>
```
