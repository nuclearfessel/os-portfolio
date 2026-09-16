# Tooltip

**Source:** `src/components/ui/tooltip.tsx`  
**Exports:** `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`, `tooltipSurfaceClassName`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/tooltip`  
**Preview page:** `tooltip`

---

## Purpose

Use Tooltip for a brief label or clarification revealed when a control is hovered or focused. It is especially useful for icon-only buttons, compact toolbar controls, and unfamiliar interface symbols.

---

## Anatomy

```
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>...</TooltipTrigger>
    <TooltipContent side="top" sideOffset={4}>Label</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

- `TooltipProvider` supplies shared timing and interaction behavior; wrap the app or the relevant control group.
- `TooltipTrigger` owns the hover/focus target and supports `asChild`.
- `TooltipContent` is portalled and positioned by Radix.
- `tooltipSurfaceClassName` is the raw surface class string, also used by DockItemLabel's tooltip presentation.

---

## API

| Component/export | API | Description |
|---|---|---|
| `TooltipProvider` | Radix Provider props | Supplies shared configuration such as `delayDuration`; the demo uses `delayDuration={200}`. |
| `Tooltip` | Radix Root props | Owns one tooltip's open state; supports controlled `open` and `onOpenChange`. |
| `TooltipTrigger` | Radix Trigger props | Hover/focus target; `asChild` transfers behavior to a child element. |
| `TooltipContent` | Radix Content props + `className` | Portalled label. `sideOffset` defaults to `4`; supports `side`, `align`, collision handling, and other Radix positioning props. |
| `tooltipSurfaceClassName` | `string` | Reusable raw class string for the canonical tooltip surface. |

All content props and refs are forwarded to the Radix content primitive. `className` is merged after the canonical surface classes.

---

## Behavior and states

- Tooltips open on pointer hover and keyboard focus, then close when the trigger is no longer hovered/focused.
- The content is portalled, has a `z-50` stacking level, and animates with a short fade and directional slide.
- `sideOffset` defaults to `4`; Radix may flip or shift the requested side to remain visible.
- The canonical surface is nowrap, `w-max`, and `max-w-none`; keep labels brief.
- Set provider timing once for a consistent interaction model. The Radix provider default delay may be overridden with `delayDuration`.

---

## Accessibility and keyboard behavior

- Radix exposes the tooltip relationship and opens it when the trigger receives keyboard focus.
- `Tab` reaches the trigger normally; do not make tooltip content itself a required keyboard stop.
- `Escape` closes an open tooltip.
- Tooltip text supplements a control; it must not be the only accessible name for an icon-only control. Give the trigger an `aria-label` or visible label (the demo uses `aria-label`).
- Do not put interactive controls, essential instructions, or critical actions inside a tooltip.

---

## Relevant tokens

`bg-[hsl(var(--popover))]`, `text-[hsl(var(--popover-foreground))]`, `border-[hsl(var(--border))]`, `font-mono`, `text-[10px]`, `px-3`, `py-[5px]`, `rounded-sm`, `shadow-[0_5px_16px_rgba(0,0,0,0.24)]`, `z-50`

---

## Usage

```tsx
import { Info } from 'lucide-react';
import { Button } from '@workspace/os-portfolio-ds/components/ui/button';
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from '@workspace/os-portfolio-ds/components/ui/tooltip';

<TooltipProvider delayDuration={200}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="icon" aria-label="Project information">
        <Info />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Project information</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Do

- Use short, plain-language labels that identify an icon or clarify a control.
- Keep the trigger usable by keyboard and give icon-only controls their own accessible name.
- Use `side`, `align`, and `sideOffset` when placement needs to avoid nearby UI.

### Don't

- Do not use a tooltip for essential content, validation errors, or complex explanations.
- Do not use it as the sole label for an icon-only control.
- Do not place buttons, links, or form fields inside `TooltipContent`; use a Popover or Dialog instead.