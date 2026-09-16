# Switch

**Source:** `src/components/ui/switch.tsx`  
**Export:** `Switch`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/switch`  
**Preview page:** `switch`

---

## Purpose

Toggle one persistent binary setting between on and off. Use it when the change takes effect immediately; use a checkbox when the choice is part of a form submission or may require an explicit submit.

---

## Anatomy

```tsx
<Label htmlFor="notifications">Notifications</Label>
<Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
```

- `Switch` renders a Radix switch root with a rounded track.
- Its thumb slides horizontally between unchecked and checked positions.
- Pair it with a visible `<Label>` or provide an accessible name with `aria-label`.

---

## States and behavior

| State | Visual/behavior |
|---|---|
| Unchecked | `bg-input` track and thumb at the start |
| Checked | `bg-primary` track and thumb translated to the end |
| Focus-visible | 2px `ring-ring` ring with background offset |
| Disabled | Cannot be toggled; `opacity-50` and not-allowed cursor |

The component supports controlled (`checked`, `onCheckedChange`) and uncontrolled (`defaultChecked`) operation. `onCheckedChange` receives a boolean. The switch itself is 36px wide by 20px high.

---

## Props

Extends Radix `Switch.Root` props (`React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled on/off state |
| `defaultChecked` | `boolean` | `false` | Initial uncontrolled state |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called after the state changes |
| `disabled` | `boolean` | `false` | Prevents toggling |
| `name` | `string` | — | Form field name |
| `value` | `string` | `'on'` | Submitted value |
| `required` | `boolean` | `false` | Requires the switch to be on in form validation |
| `id` | `string` | — | Target for a visible label |
| `className` | `string` | — | Additional root classes |
| `ref` | `Ref<HTMLButtonElement>` | — | Forwarded root ref |

---

## Accessibility and keyboard behavior

- Radix supplies `role="switch"` and manages `aria-checked`.
- Give the switch a clear accessible name with a visible associated label (`htmlFor`/`id`) or `aria-label`; do not rely on the track color.
- `Tab` focuses the switch. `Space` toggles it; Enter activation is supported by the button semantics.
- Disabled switches cannot be focused or toggled.
- Communicate the setting's current state in nearby text when the consequence is not obvious from the label.

---

## Relevant tokens

`bg-primary`, `bg-input`, `bg-background`, `ring-ring`, `ring-offset-background`, `opacity-50`, `h-5`, `w-9`

---

## Import & usage

```tsx
import { Label } from '@workspace/os-portfolio-ds/components/ui/label';
import { Switch } from '@workspace/os-portfolio-ds/components/ui/switch';

<div className="flex items-center justify-between gap-6">
  <Label htmlFor="notifications">Notifications</Label>
  <Switch
    id="notifications"
    checked={enabled}
    onCheckedChange={setEnabled}
  />
</div>

<Switch defaultChecked aria-label="Enable background sync" />
<Switch disabled aria-label="Unavailable setting" />
```

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Label every switch and describe what changes when it is on. | Use a switch for multiple mutually exclusive options; use a radio group. |
| Use a controlled switch when its state is stored or synchronized elsewhere. | Use color alone to communicate on/off state or leave an icon-only switch unnamed. |
