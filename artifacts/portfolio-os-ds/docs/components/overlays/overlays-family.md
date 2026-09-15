# Overlays — Family Reference

**Preview pages:** `dialog`, `alert-dialog`, `sheet`, `drawer`, `popover`, `hover-card`, `tooltip`, `command`

All overlay components:
- Are built on Radix UI primitives — keyboard navigation, focus trap, and `Escape` to dismiss are built in.
- Render in a `<Portal>` (detached from the triggering element's DOM subtree).
- Use `bg-popover text-popover-foreground` for their surface.
- Animate in/out via `tw-animate-css` utilities (`animate-in`, `fade-in-0`, `slide-in-from-*`).

---

## Dialog

**Source:** `src/components/ui/dialog.tsx` · **Preview:** `dialog`
**Exports:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`

Modal content with header, footer, and actions. Focus is trapped until dismissed.

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@workspace/portfolio-os-ds/components/ui/dialog';
import { Button } from '@workspace/portfolio-os-ds/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogDescription>This will save your changes.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` (DialogTitle) managed by Radix.
- Focus restores to the trigger on close.

---

## AlertDialog

**Source:** `src/components/ui/alert-dialog.tsx` · **Preview:** `alert-dialog`
**Exports:** `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`

For **consequential, irreversible** actions only. Unlike Dialog, it does not close on backdrop click — the user must explicitly choose an action.

```tsx
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@workspace/portfolio-os-ds/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={deleteAccount}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Sheet

**Source:** `src/components/ui/sheet.tsx` · **Preview:** `sheet`
**Exports:** `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`, `SheetClose`

Edge-aligned overlay panels. Use for detail views, settings panels, and slide-in navigation.

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@workspace/portfolio-os-ds/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild><Button>Open panel</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Panel title</SheetTitle>
    </SheetHeader>
    {/* panel content */}
  </SheetContent>
</Sheet>
```

`side`: `'left'` | `'right'` | `'top'` | `'bottom'` (default: `'right'`)

---

## Drawer

**Source:** `src/components/ui/drawer.tsx` · **Preview:** `drawer`
**Exports:** `Drawer`, `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`, `DrawerClose`

Touch-friendly bottom overlay. Built on `vaul`. Supports drag-to-dismiss.

```tsx
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '@workspace/portfolio-os-ds/components/ui/drawer';

<Drawer>
  <DrawerTrigger asChild><Button>Open drawer</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer title</DrawerTitle>
    </DrawerHeader>
    {/* content */}
  </DrawerContent>
</Drawer>
```

---

## Popover

**Source:** `src/components/ui/popover.tsx` · **Preview:** `popover`
**Exports:** `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`

Anchored interactive content — date pickers, custom dropdowns, filter panels.

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@workspace/portfolio-os-ds/components/ui/popover';

<Popover>
  <PopoverTrigger asChild><Button variant="outline">Filters</Button></PopoverTrigger>
  <PopoverContent className="w-64">
    {/* filter form */}
  </PopoverContent>
</Popover>
```

---

## HoverCard

**Source:** `src/components/ui/hover-card.tsx` · **Preview:** `hover-card`
**Exports:** `HoverCard`, `HoverCardTrigger`, `HoverCardContent`

Rich context revealed on hover — user previews, link cards.

```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@workspace/portfolio-os-ds/components/ui/hover-card';

<HoverCard>
  <HoverCardTrigger asChild>
    <a href="/profile">@username</a>
  </HoverCardTrigger>
  <HoverCardContent className="w-72">
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Username</h4>
      <p className="text-sm text-muted-foreground">Bio text here.</p>
    </div>
  </HoverCardContent>
</HoverCard>
```

Not for touch-only interactions — supplement with tap-to-open alternative.

---

## Tooltip

**Source:** `src/components/ui/tooltip.tsx` · **Preview:** `tooltip`
**Exports:** `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`, `tooltipSurfaceClassName`

Brief labels for focused or hovered controls. Must wrap the app in `<TooltipProvider>`.

```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@workspace/portfolio-os-ds/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="Settings">
        <SettingsIcon />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Settings</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Surface: `font-mono text-[10px]` on `bg-popover border-border` — matching the DockItemLabel tooltip style via `tooltipSurfaceClassName`.
`sideOffset` defaults to `4`.

Also exports `tooltipSurfaceClassName` — the raw class string used by `DockItemLabel presentation="tooltip"`.

---

## Command

**Source:** `src/components/ui/command.tsx` · **Preview:** `command`
**Exports:** `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`

Searchable keyboard-first command palette. Built on `cmdk`.

```tsx
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@workspace/portfolio-os-ds/components/ui/command';

<Command>
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Actions">
      <CommandItem onSelect={() => openAbout()}>Open About</CommandItem>
      <CommandItem onSelect={() => openWork()}>Open Work</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

Use `CommandDialog` to wrap in a modal:

```tsx
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command…" />
  <CommandList>…</CommandList>
</CommandDialog>
```
