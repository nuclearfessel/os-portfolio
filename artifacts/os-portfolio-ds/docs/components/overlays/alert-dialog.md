# AlertDialog

**Source:** `src/components/ui/alert-dialog.tsx`  
**Exports:** `AlertDialog`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/alert-dialog`  
**Preview page:** `alert-dialog`

---

## Purpose

Use AlertDialog only for consequential actions that require an explicit decision, such as deleting an account or project. Unlike Dialog, it cannot be dismissed by clicking the backdrop; the user must choose an action or press `Escape`.

---

## Anatomy

```
<AlertDialog>
  <AlertDialogTrigger>...</AlertDialogTrigger>
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>...</AlertDialogTitle>
        <AlertDialogDescription>...</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialogPortal>
</AlertDialog>
```

- `AlertDialogAction` is the default button style.
- `AlertDialogCancel` is the outline button style and adds `mt-2` on small screens, removed at `sm`.
- There is no built-in close icon: the explicit Cancel and Action choices are the intended dismissal paths.

---

## API

| Component | API | Description |
|---|---|---|
| `AlertDialog` | Radix `Root` props | Controls open state; supports controlled `open` and `onOpenChange`. |
| `AlertDialogTrigger` | Radix `Trigger` props | Opens the alert. `asChild` passes behavior to a child control. |
| `AlertDialogPortal` | Radix `Portal` props | Renders the alert outside the trigger's DOM subtree. |
| `AlertDialogOverlay` | Overlay props + `className` | Full-viewport dimming layer. |
| `AlertDialogContent` | Content props + `className` | Centered alert surface. |
| `AlertDialogHeader` | `HTMLAttributes<HTMLDivElement>` | Header layout wrapper. |
| `AlertDialogFooter` | `HTMLAttributes<HTMLDivElement>` | Responsive action layout wrapper. |
| `AlertDialogTitle` | Radix Title props | Required concise alert title. |
| `AlertDialogDescription` | Radix Description props | Explains the consequence and scope of the action. |
| `AlertDialogAction` | Radix Action props + `className` | Confirms the action and closes the alert by default. Styled as the default Button. |
| `AlertDialogCancel` | Radix Cancel props + `className` | Cancels and closes the alert. Styled as an outline Button. |

All wrapper and primitive components merge `className`; forwarded refs are supported by content, overlay, title, description, action, and cancel.

---

## Variants and states

- The content is `w-full` with `max-w-lg`, centered with a `bg-background` surface, border, shadow, and responsive rounded corners.
- Header text is centered on small screens and left-aligned at `sm`; footer actions stack on small screens and become a right-aligned row at `sm`.
- Opening and closing animate with fade, zoom, and a subtle slide. The overlay fades in and out.
- `AlertDialogAction` uses the default Button appearance; supply a `className` or button-compatible classes when a destructive treatment is needed.
- `AlertDialogCancel` uses the outline appearance and is intended to remain visually secondary.

---

## Accessibility and keyboard behavior

- Radix supplies the alert-dialog semantics, modal state, title/description relationships, focus trap, and accessible labelling.
- Always include both `AlertDialogTitle` and `AlertDialogDescription`; state what will happen and whether it can be undone.
- Focus is trapped while open. `Tab` and `Shift+Tab` cycle between the available actions.
- `Escape` cancels/dismisses the alert. Backdrop clicks do not dismiss it.
- Focus returns to the trigger after dismissal. Ensure the trigger has a clear accessible name.

---

## Relevant tokens

`bg-background`, `border`, `shadow-lg`, `bg-black/80`, `text-lg`, `font-semibold`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `--primary-border`, `ring`

---

## Usage

```tsx
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from '@workspace/os-portfolio-ds/components/ui/alert-dialog';
import { Button } from '@workspace/os-portfolio-ds/components/ui/button';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete project</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone and removes all project data.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={deleteProject}>Delete project</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Do

- Use for irreversible or high-impact actions where an explicit choice is required.
- Make the consequence clear in the description and label the action with a specific verb.
- Keep Cancel available and visually secondary.

### Don't

- Do not use for routine forms, informational content, or low-risk confirmations; use `Dialog`.
- Do not rely on backdrop click or an icon-only close affordance.
- Do not make the confirmation label ambiguous (for example, avoid “OK” for deletion).