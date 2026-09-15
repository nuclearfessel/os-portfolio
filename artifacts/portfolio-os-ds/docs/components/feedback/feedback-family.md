# Feedback — Family Reference

**Preview pages:** `alert`, `progress`, `skeleton`, `spinner`, `toast`, `sonner`

---

## Alert

**Source:** `src/components/ui/alert.tsx` · **Preview:** `alert`
**Exports:** `Alert`, `AlertTitle`, `AlertDescription`

Inline informational or destructive messages. Static — not a transient notification.

| Variant | Appearance | Use |
|---|---|---|
| `default` | `bg-background text-foreground` | Informational, neutral |
| `destructive` | `text-destructive border-destructive/50` | Error, failure, blocked state |

```tsx
import { Alert, AlertTitle, AlertDescription } from '@workspace/portfolio-os-ds/components/ui/alert';
import { InfoIcon } from 'lucide-react';

<Alert>
  <InfoIcon className="size-4" />
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>Your session expires in 10 minutes.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Failed to save. Please try again.</AlertDescription>
</Alert>
```

`role="alert"` is implied by Radix. Ensure `AlertTitle` + `AlertDescription` communicate recovery steps for errors.

---

## Progress

**Source:** `src/components/ui/progress.tsx` · **Preview:** `progress`
**Exports:** `Progress`

Completion indicator for ongoing work. Built on `@radix-ui/react-progress`.

```tsx
import { Progress } from '@workspace/portfolio-os-ds/components/ui/progress';

<Progress value={65} aria-label="Upload progress" />
```

- Track: `bg-secondary`; fill: `bg-primary`.
- `value`: 0–100. `null` for indeterminate.
- `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow` managed by Radix.

---

## Skeleton

**Source:** `src/components/ui/skeleton.tsx` · **Preview:** `skeleton`
**Exports:** `Skeleton`

Placeholder shape for loading content. Use instead of spinners for layout-stable loading states.

```tsx
import { Skeleton } from '@workspace/portfolio-os-ds/components/ui/skeleton';

// Approximate the shape of the content loading:
<div className="space-y-3">
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-32 w-full" />
</div>
```

Tokens: `bg-primary/10`, `animate-pulse`, `rounded-md`.

---

## Spinner

**Source:** `src/components/ui/spinner.tsx` · **Preview:** `spinner`
**Exports:** `Spinner`

Indeterminate loading indicator. Use for short-lived operations where layout preservation is not needed (button loading state, inline search).

```tsx
import { Spinner } from '@workspace/portfolio-os-ds/components/ui/spinner';

<Spinner />                           // size-4 (default)
<Spinner className="size-6" />        // larger
<Button disabled>
  <Spinner className="mr-2" /> Saving…
</Button>
```

Has `role="status"` and `aria-label="Loading"` built in.

---

## Toast / Toaster

**Source:** `src/components/ui/toast.tsx`, `src/components/ui/toaster.tsx` · **Preview:** `toast`
**Exports (toast.tsx):** `Toast`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`, `ToastProvider`, `ToastViewport`
**Exports (toaster.tsx):** `Toaster`

Provider-backed transient notification system. Built on `@radix-ui/react-toast`.
Use `useToast` from `hooks/use-toast.tsx` to trigger toasts programmatically.

```tsx
// In app root:
import { Toaster } from '@workspace/portfolio-os-ds/components/ui/toaster';
<Toaster />

// In any component:
import { useToast } from '@workspace/portfolio-os-ds/hooks/use-toast';
const { toast } = useToast();

toast({
  title: 'Saved',
  description: 'Your changes have been saved.',
});

toast({
  variant: 'destructive',
  title: 'Error',
  description: 'Failed to save. Please try again.',
  action: <ToastAction altText="Retry" onClick={retry}>Retry</ToastAction>,
});
```

- Variants: `default` | `destructive`
- Duration: auto-dismiss after ~5 seconds. `duration: Infinity` to keep open.
- Live region: Radix announces via `aria-live="polite"` (default) or `aria-live="assertive"` (destructive).
- `ToastAction` requires `altText` for screen readers.

---

## Sonner

**Source:** `src/components/ui/sonner.tsx` · **Preview:** `sonner`
**Exports:** `Toaster` (re-exports from `sonner`)

Alternative toast stack — stacked, position-controlled notifications with status types and rich actions. Built on `sonner`.

```tsx
// In app root:
import { Toaster } from '@workspace/portfolio-os-ds/components/ui/sonner';
<Toaster richColors />

// Trigger anywhere:
import { toast } from 'sonner';

toast('Event created');
toast.success('Saved successfully');
toast.error('Failed to connect');
toast.info('Update available', {
  action: { label: 'Update', onClick: () => runUpdate() },
});
```

Do not use both `Toast`/`Toaster` from `ui/toast.tsx` and `Toaster` from `ui/sonner.tsx` in the same app — pick one system.
