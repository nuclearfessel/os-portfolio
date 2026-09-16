# Slider

**Source:** `src/components/ui/slider.tsx`  
**Export:** `Slider`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/slider`  
**Preview page:** `slider`

---

## Purpose

Adjust a numeric value or bounded numeric range by dragging a thumb or using the keyboard. Use `SettingsSliderGroup` for settings-specific controls that also need a live output and guidance labels.

---

## Anatomy

```tsx
<Slider min={0} max={100} step={5} value={[level]} aria-label="Volume" />
```

- The Radix root provides the slider semantics and one thumb per value.
- The track is a 1px-high rounded rail.
- The range fill shows the selected portion in primary color.
- One value creates a single thumb; two values create a range with two thumbs.

---

## Variants, states, and behavior

| Mode/state | Behavior |
|---|---|
| Single value | Pass one number in `value`/`defaultValue`, such as `[40]` |
| Range | Pass two ordered numbers, such as `[25, 75]` |
| Step | Values change by `step`; defaults are supplied by Radix |
| Disabled | Thumbs cannot be moved and are dimmed with `opacity-50` |
| Focus-visible | Active thumb receives a 1px `ring-ring` ring |
| Orientation | Horizontal by default; use Radix `orientation` for vertical sliders |

The component supports controlled (`value`, `onValueChange`) and uncontrolled (`defaultValue`) operation. Use `min`, `max`, and `step` to define the domain; `minStepsBetweenThumbs` can prevent range thumbs from crossing too closely.

---

## Props

Extends Radix `Slider.Root` props (`React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number[]` | — | Controlled value(s) |
| `defaultValue` | `number[]` | — | Initial uncontrolled value(s) |
| `onValueChange` | `(value: number[]) => void` | — | Called continuously while a thumb moves |
| `onValueCommit` | `(value: number[]) => void` | — | Called when the user finishes changing a value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Increment between values |
| `minStepsBetweenThumbs` | `number` | `0` | Minimum step distance between range thumbs |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider direction |
| `disabled` | `boolean` | `false` | Disables all thumbs |
| `name` | `string` | — | Form field name |
| `className` | `string` | — | Additional root classes |

---

## Accessibility and keyboard behavior

- Radix renders slider thumbs with `role="slider"` and exposes `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- Give every thumb an accessible name with `aria-label`, or associate a visible label with `aria-labelledby`.
- `Tab` focuses a thumb. Arrow keys adjust by one `step`; `Home` and `End` move to the minimum and maximum. Page Up/Page Down make larger increments where supported by Radix.
- For range sliders, each thumb is independently focusable. Avoid overlapping thumbs without a clear label for each value.
- Do not rely on color alone to communicate the current value; provide a visible value or accessible value context for important settings.

---

## Relevant tokens

`bg-primary/20` (track), `bg-primary` (range), `bg-background` (thumb), `border-primary/50`, `ring-ring`, `opacity-50`, `shadow`

---

## Import & usage

```tsx
import { Slider } from '@workspace/os-portfolio-ds/components/ui/slider';

<Slider
  min={0}
  max={100}
  step={5}
  value={[level]}
  onValueChange={([next]) => setLevel(next)}
  aria-label="Volume"
/>

<Slider
  defaultValue={[25, 75]}
  min={0}
  max={100}
  step={5}
  aria-label="Price range"
  onValueCommit={(range) => saveRange(range)}
/>
```

---

## Do / Don't

- **Do** provide an accessible name and define a meaningful `min`, `max`, and `step`.
- **Do** use `onValueCommit` when expensive work should happen only after interaction ends.
- **Don't** use a slider for a small set of named choices; use radios or a select.
- **Don't** expose an unlabeled slider or assume users can infer its value from the fill alone.
