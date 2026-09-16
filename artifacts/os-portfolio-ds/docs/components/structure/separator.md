# Separator

**Source:** `src/components/ui/separator.tsx`  
**Export:** `Separator`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/separator`  
**Preview page:** `separator`

---

## Purpose

`Separator` is a thin horizontal or vertical divider that visually groups adjacent content. It is built on `@radix-ui/react-separator` and can be decorative or exposed as a semantic separator to assistive technology.

## Anatomy

```tsx
// Horizontal (default)
<Separator />

// Vertical
<div className="flex h-8 items-center gap-2">
  <span>Section A</span>
  <Separator orientation="vertical" />
  <span>Section B</span>
</div>
```

- The root renders a Radix separator element.
- Horizontal separators are `h-[1px] w-full`.
- Vertical separators are `h-full w-[1px]`; place them in a parent with an explicit height.
- Use `className` to add spacing (`my-4`, `mx-2`) or adjust the visual treatment.

## API

`Separator` accepts all `@radix-ui/react-separator` root props, forwards its ref, and merges the supplied `className` with the defaults.

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the divider |
| `decorative` | `boolean` | `true` | When true, hides the separator from assistive technology |
| `className` | `string` | — | Additional classes merged with component defaults |
| `ref` | `Ref<HTMLElement>` | — | Forwarded Radix root ref |
| `...props` | Radix separator root props | — | Additional supported attributes |

## Variants, states, and behavior

Separator has two orientation variants:

| Orientation | Classes | Layout requirement |
|---|---|---|
| `horizontal` | `h-[1px] w-full bg-border` | Parent width determines length |
| `vertical` | `h-full w-[1px] bg-border` | Parent must provide a usable height |

- The root always includes `shrink-0 bg-border`.
- It has no hover, focus, active, disabled, or interactive state.
- `decorative` defaults to `true`; it changes semantics, not appearance.
- Add margins or gaps to the parent/consumer rather than relying on the one-pixel element for spacing.
- `SettingsDivider` is a separate styled `<hr>` for settings panes; use it there instead of changing this primitive.

## Accessibility

- Keep the default `decorative` value for purely visual grouping. Radix marks decorative separators so they are hidden from assistive technology.
- Set `decorative={false}` when the divider conveys a meaningful boundary in the content structure. Radix then exposes the separator semantics.
- Do not use a separator to communicate heading hierarchy, a control state, or an action.
- For vertical separators, ensure the surrounding layout makes the two groups and their relationship understandable without relying on color alone.

## Relevant tokens

`bg-border`, `shrink-0`, `h-[1px]`, `w-full`, `h-full`, `w-[1px]`

## Import & usage

```tsx
import { Separator } from '@workspace/os-portfolio-ds/components/ui/separator';

<div>
  <p className="font-medium">Design system</p>
  <p className="text-sm text-muted-foreground">
    Reusable interface foundations.
  </p>
  <Separator className="my-4" />
  <p>Components</p>
</div>
```

```tsx
<div className="flex h-5 items-center gap-4 text-sm">
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Components</span>
  <Separator orientation="vertical" />
  <span>Patterns</span>
</div>
```

## Do

- Use a horizontal separator between stacked content regions.
- Use a vertical separator only inside a parent with an explicit height.
- Keep the separator decorative unless it represents a meaningful semantic boundary.

## Don't

- Don’t use a separator as a substitute for spacing or a visible focus indicator.
- Don’t rely on a color-only divider to convey information that is essential to understanding the page.
- Don’t use `Separator` for the settings-specific divider when `SettingsDivider` is the intended component.