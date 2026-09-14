# Forms & Inputs — Family Reference

**Preview pages:** `input`, `input-group`, `input-otp`, `textarea`, `checkbox`, `radio-group`, `select`, `slider`, `switch`, `calendar`, `field`, `form`

All form components share these conventions:
- Error state via `aria-invalid="true"` — triggers red border (`border-destructive`).
- Disabled via `disabled` attribute — `opacity-50 pointer-events-none`.
- Focus ring: `focus-visible:ring-1 focus-visible:ring-ring` (1px primary ring).
- Labels always paired via `htmlFor` / `id` or `<Label>` from `ui/label.tsx`.
- Native HTML elements used — no custom ARIA wrappers needed.

---

## Input

**Source:** `src/components/ui/input.tsx` · **Preview:** `input`

Text, email, password, file, search inputs.

```tsx
import { Input } from '@workspace/portfolio-os-design-system/components/ui/input';

<Input type="email" placeholder="you@example.com" />
<Input aria-invalid="true" />       // error state
<Input disabled />
```

Tokens: `bg-background`, `border-input`, `text-foreground`, `placeholder:text-muted-foreground`, `ring-ring`

---

## InputGroup

**Source:** `src/components/ui/input-group.tsx` · **Preview:** `input-group`
**Exports:** `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`

Compose an input with inline or block addons (icons, buttons, text, or textareas).

```tsx
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/portfolio-os-design-system/components/ui/input-group';

<InputGroup>
  <InputGroupAddon align="inline-start">
    <SearchIcon className="size-4" />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search…" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="xs">Clear</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

`InputGroupAddon` align values: `inline-start` | `inline-end` | `block-start` | `block-end`
`InputGroupButton` size values: `xs` | `sm` | `icon-xs` | `icon-sm`

---

## InputOTP

**Source:** `src/components/ui/input-otp.tsx` · **Preview:** `input-otp`
**Exports:** `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`

Segmented one-time code entry. Built on `input-otp`.

```tsx
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@workspace/portfolio-os-design-system/components/ui/input-otp';

<InputOTP maxLength={6} value={otp} onChange={setOtp}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

---

## Textarea

**Source:** `src/components/ui/textarea.tsx` · **Preview:** `textarea`

```tsx
import { Textarea } from '@workspace/portfolio-os-design-system/components/ui/textarea';

<Textarea placeholder="Write your message…" />
<Textarea disabled />
```

---

## Checkbox

**Source:** `src/components/ui/checkbox.tsx` · **Preview:** `checkbox`
Built on `@radix-ui/react-checkbox`.

```tsx
import { Checkbox } from '@workspace/portfolio-os-design-system/components/ui/checkbox';

<Checkbox id="terms" checked={checked} onCheckedChange={setChecked} />
<label htmlFor="terms">Accept terms</label>
```

States: unchecked, checked (`bg-primary` with a check icon), indeterminate (`bg-primary` with a minus icon), and disabled. The control remains a compact square in every state; do not use a circular checkbox.
ARIA: `role="checkbox"` + `aria-checked` managed by Radix.

For checkbox groups, a parent “Select all” checkbox is:
- checked when every child is checked;
- unchecked when no children are checked;
- indeterminate when only some children are checked.

The indeterminate state communicates a mixed child selection. It is not a third persisted value for an individual binary setting.

---

## RadioGroup / RadioGroupItem

**Source:** `src/components/ui/radio-group.tsx` · **Preview:** `radio-group`

```tsx
import { RadioGroup, RadioGroupItem } from '@workspace/portfolio-os-design-system/components/ui/radio-group';

<RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="monthly" id="monthly" />
    <label htmlFor="monthly">Monthly</label>
  </div>
</RadioGroup>
```

---

## Select

**Source:** `src/components/ui/select.tsx` · **Preview:** `select`
**Exports:** `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectValue`, `SelectScrollUpButton`, `SelectScrollDownButton`

```tsx
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@workspace/portfolio-os-design-system/components/ui/select';

<Select value={theme} onValueChange={setTheme}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Choose theme…" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
  </SelectContent>
</Select>
```

---

## Slider

**Source:** `src/components/ui/slider.tsx` · **Preview:** `slider`

Single value or range. Built on `@radix-ui/react-slider`.

```tsx
import { Slider } from '@workspace/portfolio-os-design-system/components/ui/slider';

<Slider
  min={0} max={100} step={5}
  value={[level]}
  onValueChange={([v]) => setLevel(v)}
  aria-label="Volume"
/>
```

Track: `bg-secondary`. Range fill: `bg-primary`. Thumb: `bg-background border-2 border-primary`.
Note: For settings-specific slider with live output and guidance labels, use `SettingsSliderGroup` instead.

---

## Switch

**Source:** `src/components/ui/switch.tsx` · **Preview:** `switch`
Built on `@radix-ui/react-switch`.

```tsx
import { Switch } from '@workspace/portfolio-os-design-system/components/ui/switch';

<Switch
  id="notifications"
  checked={enabled}
  onCheckedChange={setEnabled}
  aria-label="Enable notifications"
/>
```

Semantics: `role="switch"` + `aria-checked` managed by Radix.
Note: For settings panels with a label row, use `SettingsToggleRow` instead.

---

## Calendar

**Source:** `src/components/ui/calendar.tsx` · **Preview:** `calendar`
Built on `react-day-picker`.

```tsx
import { Calendar } from '@workspace/portfolio-os-design-system/components/ui/calendar';

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>
```

Keyboard navigation: Arrow keys to move between days, Enter/Space to select.

---

## Field / FieldSet / FieldGroup

**Source:** `src/components/ui/field.tsx` · **Preview:** `field`
**Exports:** `Field`, `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldLabel`, `FieldContent`, `FieldMessage`, `FieldDescription`

Composes a label, description, input control, and error message into a semantic group.

```tsx
import { Field, FieldLabel, FieldContent, FieldMessage } from '@workspace/portfolio-os-design-system/components/ui/field';

<Field orientation="vertical">
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
  <FieldMessage>We'll never share your email.</FieldMessage>
</Field>

// Horizontal layout
<Field orientation="horizontal">
  <FieldLabel htmlFor="name">Name</FieldLabel>
  <Input id="name" />
</Field>

// Responsive (vertical below @md, horizontal above)
<Field orientation="responsive">
  <FieldLabel>Country</FieldLabel>
  <Select>…</Select>
</Field>
```

`Field.orientation`: `'vertical'` | `'horizontal'` | `'responsive'`

---

## Form

**Source:** `src/components/ui/form.tsx` · **Preview:** `form`
Built on `react-hook-form` + Radix Label.
**Exports:** `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@workspace/portfolio-os-design-system/components/ui/form';

const form = useForm({ resolver: zodResolver(schema) });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```
