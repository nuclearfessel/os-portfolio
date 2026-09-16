# Dialog

**Source:** `src/components/ui/dialog.tsx`  
**Exports:** `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogTrigger`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/dialog`  
**Preview page:** `dialog`

---

## Purpose

Use Dialog for modal content that temporarily interrupts the current page to collect input, show details, or confirm a routine action. It provides a title, optional description, content area, and actions while keeping focus inside the modal.

---

## Anatomy

```
<Dialog>
  <DialogTrigger>...</DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogHeader>
        <DialogTitle>...</DialogTitle>
        <DialogDescription>...</DialogDescription>
      </DialogHeader>
      [content]
      <DialogFooter>
        <DialogClose>...</DialogClose>
        [action]
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>
```

- `DialogContent` creates the portal, overlay, centered modal surface, and built-in icon-only close button.
- `DialogHeader` and `DialogFooter` are layout wrappers, not Radix primitives.
- The built-in close control has a visually hidden `Close` label. Use `DialogClose` for additional explicit close actions.

---

## API

| Component | API | Description |
|---|---|---|
| `Dialog` | Radix `Root` props | Controls open state and modal behavior. Supports controlled `open` and `onOpenChange`. |
| `DialogTrigger` | Radix `Trigger` props | Opens the dialog. `asChild` passes behavior to a child control. |
| `DialogPortal` | Radix `Portal` props | Renders overlay/content outside the trigger's DOM subtree. |
| `DialogOverlay` | Overlay props + `className` | Full-viewport dimming layer. |
| `DialogContent` | Content props + `overlayClassName` | Centered modal surface; `className` customizes content and `overlayClassName` customizes the overlay. |
| `DialogHeader` | `HTMLAttributes<HTMLDivElement>` | Header layout wrapper. |
| `DialogFooter` | `HTMLAttributes<HTMLDivElement>` | Responsive action layout wrapper. |
| `DialogTitle` | Radix Title props | Required accessible title for the dialog. |
| `DialogDescription` | Radix Description props | Supporting accessible description. |
| `DialogClose` | Radix Close props | Closes the dialog; supports `asChild`. |

`DialogContent`, `DialogOverlay`, `DialogTitle`, and `DialogDescription` forward refs. All component `className` values are merged with the component defaults.

---

## Layout and behavior

- Content is `w-full` with `max-w-lg`, centered in the viewport, and uses responsive rounded corners (`sm` and above).
- The header is centered on small screens and left-aligned from `sm` upward.
- The footer stacks actions in reverse column order on small screens and aligns them to the end in a row from `sm` upward.
- The close button is positioned in the top-right corner and includes an `X` icon.
- Opening and closing use fade and zoom animations. The overlay fades independently.
- Dialogs are dismissible with the close button, an explicit `DialogClose`, backdrop interaction, or `Escape` (Radix default). Focus returns to the trigger after close.

---

## Accessibility and keyboard behavior

- Radix supplies `role="dialog"`, `aria-modal="true"`, and relationships to `DialogTitle` and `DialogDescription`.
- Always include a `DialogTitle`; provide a `DialogDescription` when users need context for the task.
- Focus is trapped within the modal while it is open. `Tab` and `Shift+Tab` cycle through focusable controls.
- `Escape` dismisses the dialog. The trigger regains focus when the dialog closes.
- Use a real, text-labelled trigger or add an accessible label to icon-only triggers.

---

## Relevant tokens

`bg-background`, `border`, `shadow-lg`, `--osp-spacing-component-dialog-gap`, `--osp-spacing-component-dialog-padding`, `--osp-motion-component-dialog-duration`, `--osp-motion-component-dialog-easing`, `--osp-radius-component-dialog-radius`, `bg-black/80`, `ring`, `bg-accent`, `text-muted-foreground`

---

## Usage

```tsx
import { Button } from '@workspace/os-portfolio-ds/components/ui/button';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from '@workspace/os-portfolio-ds/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Edit profile</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Update the details shown to your teammates.</DialogDescription>
    </DialogHeader>
    <form>{/* fields */}</form>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <DialogClose asChild><Button>Save changes</Button></DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Do

- Use for reversible tasks, forms, and detail views that need focused attention.
- Keep the title concise and put the primary action last in the footer.
- Use controlled `open` state when the parent must react to dismissal or submission.

### Don't

- Do not omit `DialogTitle` or replace the built-in close control without an accessible name.
- Do not use a Dialog for brief, non-blocking feedback; use a toast or inline message instead.
- Do not put an irreversible action here without clear consequence copy; use `AlertDialog` for that case.