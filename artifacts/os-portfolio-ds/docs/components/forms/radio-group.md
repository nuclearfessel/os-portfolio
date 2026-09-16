# RadioGroup

**Source:** `src/components/ui/radio-group.tsx`  
**Exports:** `RadioGroup`, `RadioGroupItem`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/radio-group`  
**Preview page:** `radio-group`

---

## Purpose

Present mutually exclusive options when exactly one value may be selected from a set. Use a checkbox for independent yes/no choices and a select when the option list needs a compact menu.

---

## Anatomy

```tsx
<RadioGroup aria-label="Plan" value={plan} onValueChange={setPlan}>
  <div>
    <RadioGroupItem id="plan-free" value="free" />
    <Label htmlFor="plan-free">Free</Label>
  </div>
</RadioGroup>
```

- `RadioGroup` renders the Radix radio-group root and lays its items out in a grid with a gap.
- `RadioGroupItem` renders one circular radio control.
- `RadioGroupItem`'s selected indicator is a filled primary circle.
- Put each item and its `<Label>` in a shared wrapper; labels must point to the item `id`.

---

## Variants and states

There are no component-specific variant or size props. Use `className` for layout adjustments while preserving the radio semantics.

| State | Visual/behavior |
|---|---|
| Unchecked | Circular `h-4 w-4` control with a primary border |
| Checked | Filled primary circle indicator |
| Focus-visible | 1px `ring-ring` focus ring |
| Disabled | Cannot be selected; `opacity-50` and not-allowed cursor |
| Orientation | Vertical by default from the root grid; use a class such as `grid-flow-col` or a layout wrapper for horizontal choices |

`RadioGroup` supports controlled (`value`, `onValueChange`) and uncontrolled (`defaultValue`) operation. Values are strings, and selecting one item clears the previous selection.

---

## API

### `RadioGroup`

Extends Radix `RadioGroup.Root` props (`React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled selected value |
| `defaultValue` | `string` | — | Initial uncontrolled value |
| `onValueChange` | `(value: string) => void` | — | Called when selection changes |
| `name` | `string` | — | Form field name |
| `required` | `boolean` | `false` | Requires a selection in form validation |
| `disabled` | `boolean` | `false` | Disables the group |
| `orientation` | `'horizontal' \| 'vertical'` | — | Communicates arrow-key orientation |
| `dir` | `'ltr' \| 'rtl'` | — | Text direction |
| `className` | `string` | — | Additional root classes |

### `RadioGroupItem`

Extends Radix `RadioGroup.Item` props. `value` is required.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Option value |
| `id` | `string` | — | Target for the associated label |
| `disabled` | `boolean` | `false` | Disables this option |
| `className` | `string` | — | Additional item classes |
| `ref` | `Ref<HTMLButtonElement>` | — | Forwarded item ref |

---

## Accessibility and keyboard behavior

- Radix supplies `role="radiogroup"` and `role="radio"` plus `aria-checked` state management.
- Give the group an accessible name with a visible legend/label or `aria-label`/`aria-labelledby`.
- `Tab` enters the group at the selected item (or the first item when none is selected). Arrow keys move among options and select the focused item; `Home` and `End` move to the first and last option.
- In right-to-left layouts, arrow-key direction follows `dir`.
- Disabled items cannot be focused or selected. Keep their labels visually associated.

---

## Relevant tokens

`border-primary`, `text-primary`, `ring-ring`, `opacity-50`, `h-4`, `w-4`, `rounded-full`

---

## Import & usage

```tsx
import { Label } from '@workspace/os-portfolio-ds/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@workspace/os-portfolio-ds/components/ui/radio-group';

<RadioGroup defaultValue="pro" aria-label="Plan">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="free" id="plan-free" />
    <Label htmlFor="plan-free">Free</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="pro" id="plan-pro" />
    <Label htmlFor="plan-pro">Pro</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="enterprise" id="plan-enterprise" disabled />
    <Label htmlFor="plan-enterprise">Enterprise</Label>
  </div>
</RadioGroup>
```

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Provide one accessible name for the group and a label for every item. | Use radios when multiple options can be selected; use checkboxes instead. |
| Use stable, unique `id` and string `value` attributes. | Omit a selected/default value when the form requires an explicit choice. |
