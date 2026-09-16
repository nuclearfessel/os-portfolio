# Toast

**Source:** `src/components/ui/toast.tsx`, `src/components/ui/toaster.tsx`, `src/hooks/use-toast.tsx`  
**Exports:** `Toast`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`, `ToastProvider`, `ToastViewport`, `Toaster`, `ToastProps`, `ToastActionElement`, `useToast`, `toast`  
**Export paths:** `@workspace/os-portfolio-ds/components/ui/toast`, `@workspace/os-portfolio-ds/components/ui/toaster`, `@workspace/os-portfolio-ds/hooks/use-toast`  
**Preview page:** `toast`

---

## Purpose

Toast is a provider-backed transient notification for confirming an event or communicating a short-lived status without interrupting the current task. This implementation is built on `@radix-ui/react-toast`.

Mount one `Toaster` near the application root, then call `toast()` from a component or use the lower-level primitives for a custom composition. Use an inline `Alert` when the message must remain visible and in context.

## Anatomy

```tsx
<ToastProvider>
  <ToastViewport />
  <Toast>
    <div>
      <ToastTitle>Saved</ToastTitle>
      <ToastDescription>Your changes are up to date.</ToastDescription>
    </div>
    <ToastAction altText="Undo">Undo</ToastAction>
    <ToastClose />
  </Toast>
</ToastProvider>
```

- `ToastProvider` supplies Radix toast state and timing context.
- `ToastViewport` is the fixed notification region. The default is full-width at the top on small screens and a bottom-right column capped at `md:max-w-[420px]` on larger screens.
- `Toast` is the notification root and supports `default` and `destructive` visual variants.
- `ToastTitle` and `ToastDescription` provide the notification's text.
- `ToastAction` is an optional recovery or follow-up control.
- `ToastClose` is an optional dismiss control with a close icon.
- `Toaster` is the ready-to-use composition that reads the `useToast` store, renders the title/description/action, and includes close and viewport primitives.

## API

### `toast()` and `useToast()`

```tsx
const { toast, dismiss, toasts } = useToast();
const result = toast({ title, description, variant, action });
result.dismiss();
result.update({ description: 'Updated' });
```

| Option / return value | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | — | Short notification heading |
| `description` | `ReactNode` | — | Supporting message |
| `variant` | `'default' \| 'destructive'` | `'default'` | Visual and semantic status |
| `action` | `ToastActionElement` | — | A `ToastAction` element |
| `open` | `boolean` | `true` when created | Controlled open state passed to Radix |
| `onOpenChange` | `(open: boolean) => void` | internal | Dismisses the toast when Radix reports closed |
| `id` | `string` | generated | Store identifier |
| `result.dismiss()` | `() => void` | — | Dismisses this toast |
| `result.update(props)` | `(props: ToastProps) => void` | — | Updates this toast |
| `dismiss(toastId?)` | `(string?) => void` | — | Dismiss one toast, or all when omitted |
| `toasts` | `ToasterToast[]` | `[]` | Current toast state exposed by the hook |

The store currently limits the visible queue to one toast (`TOAST_LIMIT = 1`). Radix's default toast duration is used unless a supported `duration` prop is supplied. Dismissal is animated; dismissed entries are removed from the store after the implementation's removal delay.

### Component props

`Toast` accepts all `Toast.Root` props from Radix plus `variant`, `className`, and a forwarded ref. `ToastProvider`, `ToastViewport`, `ToastTitle`, `ToastDescription`, `ToastAction`, and `ToastClose` accept their corresponding Radix primitive props, `className`, and forwarded refs.

| Component | Important props | Default |
|---|---|---|
| `Toast` | `variant`, `open`, `defaultOpen`, `onOpenChange`, `duration`, `className` | `variant="default"` |
| `ToastAction` | `altText`, `onClick`, `disabled`, `className` | — |
| `ToastClose` | `onClick`, `aria-label`, `className` | visual close icon; add/retain an accessible label as needed |
| `ToastViewport` | Radix viewport props, `className` | fixed responsive placement |
| `Toaster` | none | renders the current `useToast()` queue |

## Variants, states, and behavior

| Variant | Appearance | Use |
|---|---|---|
| `default` | `border bg-background text-foreground` | Successful, neutral, or informational event |
| `destructive` | `border-destructive bg-destructive text-destructive-foreground` | Failed or blocked operation; provide recovery guidance |

- Open and closed states animate in/out. Swipe gestures are supported by Radix; a swipe can cancel, move, or end.
- `ToastAction` is outlined and becomes more visible on hover/focus; it adapts its border and colors for destructive toasts.
- `ToastClose` is visually subtle and appears on hover or keyboard focus.
- `Toaster` renders title and description only when supplied, always includes `ToastClose`, and passes the action through unchanged.
- Prefer one toast system in an app. Do not mount both this system and the Sonner `Toaster` for the same notifications.

## Accessibility

- Radix manages the toast live region and announcement behavior. Keep the title and description meaningful when a toast conveys important status.
- `ToastAction` requires `altText`; it is the screen-reader description of the action and is required even when visible children are present.
- Provide a concise, specific action label such as “Retry upload”, not “Click here”.
- Destructive toasts use assertive announcement behavior through the Radix destructive context; reserve them for failures or urgent status.
- Keep an explicit close affordance available. If customizing `ToastClose`, preserve an accessible name such as `aria-label="Dismiss notification"`.
- Do not put essential information only in a toast: it disappears and is limited to one visible item in this implementation.

## Relevant tokens

`bg-background`, `text-foreground`, `border`, `border-destructive`, `bg-destructive`, `text-destructive-foreground`, `rounded-md`, `shadow-lg`, `ring-ring`, `bg-secondary`, `--radix-toast-swipe-end-x`, `--radix-toast-swipe-move-x`

## Import & usage

```tsx
// App root
import { Toaster } from '@workspace/os-portfolio-ds/components/ui/toaster';

<Toaster />
```

```tsx
import { ToastAction } from '@workspace/os-portfolio-ds/components/ui/toast';
import { useToast } from '@workspace/os-portfolio-ds/hooks/use-toast';

function SaveButton() {
  const { toast } = useToast();

  return (
    <button
      onClick={() =>
        toast({
          title: 'Changes saved',
          description: 'Your project settings are up to date.',
        })
      }
    >
      Save
    </button>
  );
}

toast({
  variant: 'destructive',
  title: 'Upload failed',
  description: 'The file could not be uploaded.',
  action: <ToastAction altText="Retry upload">Retry</ToastAction>,
});
```

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Mount `Toaster` once at the app root before calling `toast()`. | Don’t use a toast for critical information that must remain available. |
| Keep messages short, specific, and useful; include a recovery action for recoverable errors. | Don’t omit `altText` from `ToastAction`. |
| Use a persistent inline message as well when the status is essential or requires extended attention. | Don’t mount both the Radix toast system and Sonner toaster for the same app surface. |