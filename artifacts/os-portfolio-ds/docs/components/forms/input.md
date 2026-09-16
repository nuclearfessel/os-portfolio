# Input

**Source:** `src/components/ui/input.tsx`  
**Export:** `Input`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/input`  
**Preview page:** `input`

---

## Purpose

The standard single-line native form control for text, email, password, search, file, and other HTML input values. Use it with a visible label and an associated description or error message when needed.

---

## Anatomy

```tsx
<label htmlFor="email">Email</label>
<Input id="email" type="email" />
```

- `Input` renders a native `<input>` and forwards its ref.
- The `type` attribute selects the browser's input behavior.
- File inputs inherit the component's file-specific styling.
- Pair the control with `<Label>` or a native `<label>` using matching `htmlFor`/`id`.

---

## Types and variants

`Input` has no component-specific variant prop. All native `input` types and attributes are supported through `React.ComponentProps<"input">`.

| Type | Use |
|---|---|
| `text` (default) | General short text |
| `email` | Email addresses and browser validation |
| `password` | Secret text |
| `search` | Search queries |
| `number` | Numeric values; prefer `min`, `max`, and `step` |
| `file` | File selection; use `accept` when appropriate |
| `url`, `tel`, `date`, and other native types | Browser-supported specialized entry |

---

## States and behavior

| State | Implementation and guidance |
|---|---|
| Default | Full-width, 36px-high control with border and transparent background |
| Placeholder | Uses `text-muted-foreground`; placeholder is not a label |
| Focus-visible | Shows a 1px `ring-ring` focus ring |
| Invalid | `aria-invalid="true"` changes the border through the shared form styling |
| Disabled | `disabled` prevents editing and applies `opacity-50` and a not-allowed cursor |
| Read-only | `readOnly` prevents editing while retaining the normal enabled presentation |
| File | File button is reset and file text uses the foreground text styling |

Native browser behavior remains available: keyboard entry, selection, copy/paste, autocomplete, constraint validation, and form submission.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `HTMLInputTypeAttribute` | browser default (`text`) | Native input type |
| `className` | `string` | — | Additional classes merged with the base styles |
| `ref` | `Ref<HTMLInputElement>` | — | Forwarded input ref |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | — | All native input props, including `value`, `defaultValue`, `onChange`, `name`, `required`, `disabled`, and `aria-*` |

---

## Accessibility and keyboard behavior

- Use a visible label whenever possible; connect it with `htmlFor` and `id`.
- Use `aria-describedby` to connect help or error text, and `aria-invalid="true"` when validation fails.
- Native input keyboard behavior applies: Tab enters the field, typing edits its value, and standard text navigation and selection shortcuts work.
- Do not use placeholder text as the only label.
- A disabled input is removed from the tab order by the browser. A read-only input remains focusable.

---

## Relevant tokens

`bg-transparent`, `border-input`, `text-base`, `text-foreground`, `placeholder:text-muted-foreground`, `ring-ring`, `opacity-50`

---

## Import & usage

```tsx
import { Input } from '@workspace/os-portfolio-ds/components/ui/input';
import { Label } from '@workspace/os-portfolio-ds/components/ui/label';

<Label htmlFor="name">Name</Label>
<Input id="name" name="name" placeholder="Your name" />

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" required />

<Input type="file" accept="image/*" aria-label="Upload an image" />
<Input value={query} onChange={(event) => setQuery(event.target.value)} />
```

---

## Do / Don't

- **Do** provide a label and expose validation with `aria-invalid` and descriptive text.
- **Do** use the native `type`, `autocomplete`, `name`, and constraint attributes.
- **Don't** use placeholder text as a substitute for a label.
- **Don't** recreate this control with a generic `div` or suppress native validation and keyboard behavior without a specific reason.
