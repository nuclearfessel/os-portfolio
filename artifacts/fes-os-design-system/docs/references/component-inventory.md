# Component Inventory

**Canonical index.** Every shipped component/export and every reusable pattern maps to a spec document and a living preview ID.

Source authority: `package.json` exports + `src/components/ui/` files + `src/preview/registry.tsx`
Last updated: post settings/accessibility update.

---

## Fes OS primitives

Source: `src/components/ui/fes-os.tsx`
Preview ID: `fes-os-pilot`

| Component | Export | Spec | Preview ID |
|---|---|---|---|
| ActionButton | `ActionButton` | [action-button.md](../components/fes-os/action-button.md) | `fes-os-pilot` |
| SectionLabel | `SectionLabel` | [section-label.md](../components/fes-os/section-label.md) | `fes-os-pilot` |
| StatusIndicator | `StatusIndicator` | [status-indicator.md](../components/fes-os/status-indicator.md) | `fes-os-pilot` |
| Surface | `Surface` | [surface.md](../components/fes-os/surface.md) | `fes-os-pilot` |
| ProjectCard | `ProjectCard` | [project-card.md](../components/fes-os/project-card.md) | `fes-os-pilot` |
| WindowSurface | `WindowSurface` | [window-surface.md](../components/fes-os/window-surface.md) | `fes-os-pilot` |
| DockItem | `DockItem` | [dock-item.md](../components/fes-os/dock-item.md) | `fes-os-pilot` |
| DockItemLabel | `DockItemLabel` | [dock-item.md](../components/fes-os/dock-item.md) | `fes-os-pilot` |
| DesktopLauncher | `DesktopLauncher` | [desktop-launcher.md](../components/fes-os/desktop-launcher.md) | `fes-os-pilot` |
| StickyNoteSurface | `StickyNoteSurface` | [sticky-note-surface.md](../components/fes-os/sticky-note-surface.md) | `fes-os-pilot` |
| ContextMenuSurface | `ContextMenuSurface` | [context-menu-surface.md](../components/fes-os/context-menu-surface.md) | `fes-os-pilot` |

---

## Settings primitives

Source: `src/components/ui/settings.tsx`
Preview ID: `fes-os-settings`

| Component | Export | Spec | Preview ID |
|---|---|---|---|
| SettingsNavSection | `SettingsNavSection` | [settings-nav.md](../components/settings/settings-nav.md) | `fes-os-settings` |
| SettingsNavItem | `SettingsNavItem` | [settings-nav.md](../components/settings/settings-nav.md) | `fes-os-settings` |
| SettingsToggleRow | `SettingsToggleRow` | [settings-toggle-row.md](../components/settings/settings-toggle-row.md) | `fes-os-settings` |
| SettingsSliderGroup | `SettingsSliderGroup` | [settings-slider-group.md](../components/settings/settings-slider-group.md) | `fes-os-settings` |
| SettingsSegmentedChoice | `SettingsSegmentedChoice` | [settings-segmented-choice.md](../components/settings/settings-segmented-choice.md) | `fes-os-settings` |
| SettingsContrastCard | `SettingsContrastCard` | [settings-contrast-card.md](../components/settings/settings-contrast-card.md) | `fes-os-settings` |
| SettingsColorPreset | `SettingsColorPreset` | [settings-color-preset.md](../components/settings/settings-color-preset.md) | `fes-os-settings` |
| SettingsDivider | `SettingsDivider` | [settings-divider.md](../components/settings/settings-divider.md) | `fes-os-settings` |
| SettingsSectionHeader | `SettingsSectionHeader` | [settings-section-header.md](../components/settings/settings-section-header.md) | `fes-os-settings` |

Also exported: `ContrastVariant`, `SegmentedOption` (TypeScript types)

---

## Actions

| Component | Export | Source | Spec | Preview ID |
|---|---|---|---|---|
| Button | `Button`, `buttonVariants` | `ui/button.tsx` | [button.md](../components/actions/button.md) | `button` |
| ButtonGroup | `ButtonGroup`, `ButtonGroupButton`, `ButtonGroupLabel`, `ButtonGroupSeparator` | `ui/button-group.tsx` | [button-group.md](../components/actions/button-group.md) | `button-group` |
| Toggle | `Toggle`, `toggleVariants` | `ui/toggle.tsx` | [toggle.md](../components/actions/toggle.md) | `toggle` |
| ToggleGroup | `ToggleGroup`, `ToggleGroupItem` | `ui/toggle-group.tsx` | [toggle-group.md](../components/actions/toggle-group.md) | `toggle-group` |

---

## Forms & Inputs

| Component | Export | Source | Spec | Preview ID |
|---|---|---|---|---|
| Input | `Input` | `ui/input.tsx` | [forms-family.md](../components/forms/forms-family.md#input) | `input` |
| InputGroup | `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea` | `ui/input-group.tsx` | [forms-family.md](../components/forms/forms-family.md#inputgroup) | `input-group` |
| InputOTP | `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator` | `ui/input-otp.tsx` | [forms-family.md](../components/forms/forms-family.md#inputotp) | `input-otp` |
| Textarea | `Textarea` | `ui/textarea.tsx` | [forms-family.md](../components/forms/forms-family.md#textarea) | `textarea` |
| Checkbox | `Checkbox` | `ui/checkbox.tsx` | [forms-family.md](../components/forms/forms-family.md#checkbox) | `checkbox` |
| RadioGroup | `RadioGroup`, `RadioGroupItem` | `ui/radio-group.tsx` | [forms-family.md](../components/forms/forms-family.md#radiogroup-radiogroupitem) | `radio-group` |
| Select | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectValue`, `SelectScrollUpButton`, `SelectScrollDownButton` | `ui/select.tsx` | [forms-family.md](../components/forms/forms-family.md#select) | `select` |
| Slider | `Slider` | `ui/slider.tsx` | [forms-family.md](../components/forms/forms-family.md#slider) | `slider` |
| Switch | `Switch` | `ui/switch.tsx` | [forms-family.md](../components/forms/forms-family.md#switch) | `switch` |
| Calendar | `Calendar` | `ui/calendar.tsx` | [forms-family.md](../components/forms/forms-family.md#calendar) | `calendar` |
| Field | `Field`, `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldLabel`, `FieldContent`, `FieldMessage`, `FieldDescription` | `ui/field.tsx` | [forms-family.md](../components/forms/forms-family.md#field-fieldset-fieldgroup) | `field` |
| Form | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` | `ui/form.tsx` | [forms-family.md](../components/forms/forms-family.md#form) | `form` |
| Label | `Label` | `ui/label.tsx` | Used by Field and Form | — |

---

## Overlays

| Component | Export | Source | Spec | Preview ID |
|---|---|---|---|---|
| Dialog | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose` | `ui/dialog.tsx` | [overlays-family.md](../components/overlays/overlays-family.md#dialog) | `dialog` |
| AlertDialog | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel` | `ui/alert-dialog.tsx` | [overlays-family.md](../components/overlays/overlays-family.md#alertdialog) | `alert-dialog` |
| Sheet | `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`, `SheetClose` | `ui/sheet.tsx` | [overlays-family.md](../components/overlays/overlays-family.md#sheet) | `sheet` |
| Drawer | `Drawer`, `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`, `DrawerClose` | `ui/drawer.tsx` | [overlays-family.md](../components/overlays/overlays-family.md#drawer) | `drawer` |
| Popover | `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor` | `ui/popover.tsx` | [overlays-family.md](../components/overlays/overlays-family.md#popover) | `popover` |
| HoverCard | `HoverCard`, `HoverCardTrigger`, `HoverCardContent` | `ui/hover-card.tsx` | [overlays-family.md](../components/overlays/overlays-family.md#hovercard) | `hover-card` |
| Tooltip | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`, `tooltipSurfaceClassName` | `ui/tooltip.tsx` | [overlays-family.md](../components/overlays/overlays-family.md#tooltip) | `tooltip` |
| Command | `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut` | `ui/command.tsx` | [overlays-family.md](../components/overlays/overlays-family.md#command) | `command` |

---

## Menus & Navigation

| Component | Export | Source | Spec | Preview ID |
|---|---|---|---|---|
| DropdownMenu | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuGroup`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuShortcut`, `DropdownMenuPortal`, `DropdownMenuRadioGroup` | `ui/dropdown-menu.tsx` | [navigation-family.md](../components/navigation/navigation-family.md#dropdownmenu) | `dropdown-menu` |
| ContextMenu | `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuGroup`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuShortcut`, `ContextMenuPortal`, `ContextMenuRadioGroup` | `ui/context-menu.tsx` | [navigation-family.md](../components/navigation/navigation-family.md#contextmenu) | `context-menu` |
| Menubar | `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarGroup`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarShortcut`, `MenubarPortal`, `MenubarRadioGroup` | `ui/menubar.tsx` | [navigation-family.md](../components/navigation/navigation-family.md#menubar) | `menubar` |
| NavigationMenu | `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport` | `ui/navigation-menu.tsx` | [navigation-family.md](../components/navigation/navigation-family.md#navigationmenu) | `navigation-menu` |
| Breadcrumb | `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis` | `ui/breadcrumb.tsx` | [navigation-family.md](../components/navigation/navigation-family.md#breadcrumb) | `breadcrumb` |
| Pagination | `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis` | `ui/pagination.tsx` | [navigation-family.md](../components/navigation/navigation-family.md#pagination) | `pagination` |
| Tabs | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `ui/tabs.tsx` | [navigation-family.md](../components/navigation/navigation-family.md#tabs) | `tabs` |
| Sidebar | `Sidebar`, `SidebarProvider`, `SidebarTrigger`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`, `SidebarSeparator`, `SidebarInput`, `SidebarInset`, `SidebarRail`, `useSidebar` | `ui/sidebar.tsx` | [navigation-family.md](../components/navigation/navigation-family.md#sidebar) | `sidebar` |

---

## Data Display

| Component | Export | Source | Spec | Preview ID |
|---|---|---|---|---|
| Avatar | `Avatar`, `AvatarImage`, `AvatarFallback` | `ui/avatar.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#avatar) | `avatar` |
| Badge | `Badge`, `badgeVariants` | `ui/badge.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#badge) | `badge` |
| Card | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | `ui/card.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#card) | `card` |
| Table | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` | `ui/table.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#table) | `table` |
| Accordion | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | `ui/accordion.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#accordion) | `accordion` |
| Collapsible | `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` | `ui/collapsible.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#collapsible) | `collapsible` |
| Carousel | `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `useCarousel` | `ui/carousel.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#carousel) | `carousel` |
| Item | `Item`, `ItemGroup`, `ItemSeparator`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter` | `ui/item.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#item-itemgroup) | `item` |
| Empty | `Empty` | `ui/empty.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#empty) | `empty` |
| Kbd | `Kbd`, `KbdGroup` | `ui/kbd.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#kbd-kbdgroup) | `kbd` |
| AspectRatio | `AspectRatio` | `ui/aspect-ratio.tsx` | [data-display-family.md](../components/data-display/data-display-family.md#aspectratio) | `aspect-ratio` |

---

## Feedback

| Component | Export | Source | Spec | Preview ID |
|---|---|---|---|---|
| Alert | `Alert`, `AlertTitle`, `AlertDescription` | `ui/alert.tsx` | [feedback-family.md](../components/feedback/feedback-family.md#alert) | `alert` |
| Progress | `Progress` | `ui/progress.tsx` | [feedback-family.md](../components/feedback/feedback-family.md#progress) | `progress` |
| Skeleton | `Skeleton` | `ui/skeleton.tsx` | [feedback-family.md](../components/feedback/feedback-family.md#skeleton) | `skeleton` |
| Spinner | `Spinner` | `ui/spinner.tsx` | [feedback-family.md](../components/feedback/feedback-family.md#spinner) | `spinner` |
| Toast / Toaster | `Toast`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`, `ToastProvider`, `ToastViewport`, `Toaster` | `ui/toast.tsx`, `ui/toaster.tsx` | [feedback-family.md](../components/feedback/feedback-family.md#toast-toaster) | `toast` |
| Sonner | `Toaster` (sonner) | `ui/sonner.tsx` | [feedback-family.md](../components/feedback/feedback-family.md#sonner) | `sonner` |

---

## Structure & Layout

| Component | Export | Source | Spec | Preview ID |
|---|---|---|---|---|
| Separator | `Separator` | `ui/separator.tsx` | [structure-family.md](../components/structure/structure-family.md#separator) | `separator` |
| ScrollArea | `ScrollArea`, `ScrollBar` | `ui/scroll-area.tsx` | [structure-family.md](../components/structure/structure-family.md#scrollarea) | `scroll-area` |
| ResizablePanelGroup | `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` | `ui/resizable.tsx` | [structure-family.md](../components/structure/structure-family.md#resizablepanelgroup) | `resizable` |

---

## Charts

| Component | Export | Source | Spec | Preview ID |
|---|---|---|---|---|
| Chart | `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`, `useChart` | `ui/chart.tsx` | [chart.md](../components/charts/chart.md) | `chart` |

---

## Foundations

| Foundation | Spec | Preview ID |
|---|---|---|
| Overview | [README.md](../README.md) | `overview` |
| Color | [foundations/color.md](../foundations/color.md) | `color-roles` |
| Typography | [foundations/typography.md](../foundations/typography.md) | `type-scale` |
| Spacing & Radius | [foundations/spacing-radius.md](../foundations/spacing-radius.md) | `spacing-radius` |
| Iconography & Motion | [foundations/iconography-motion.md](../foundations/iconography-motion.md) | `fes-os-guidelines` |
| Accessibility | [foundations/accessibility.md](../foundations/accessibility.md) | `accessibility` |

---

## Patterns

| Pattern | Spec | Related preview IDs |
|---|---|---|
| Desktop window workspace | [desktop-window-workspace.md](../patterns/desktop-window-workspace.md) | `fes-os-pilot` |
| Responsive Dock navigation | [responsive-dock.md](../patterns/responsive-dock.md) | `fes-os-pilot` |
| Desktop launcher grid | [desktop-launcher-grid.md](../patterns/desktop-launcher-grid.md) | `fes-os-pilot` |
| Sticky notes | [sticky-notes.md](../patterns/sticky-notes.md) | `fes-os-pilot` |
| Context menus | [context-menus.md](../patterns/context-menus.md) | `fes-os-pilot`, `context-menu` |
| Project-card list | [project-card-list.md](../patterns/project-card-list.md) | `fes-os-pilot`, `item` |
| Settings window & sidebar | [settings-window.md](../patterns/settings-window.md) | `fes-os-settings` |
| Personalization color presets | [personalization-colors.md](../patterns/personalization-colors.md) | `fes-os-settings` |
| Accessibility preference panel | [accessibility-panel.md](../patterns/accessibility-panel.md) | `fes-os-settings`, `accessibility` |
| Contrast override behavior | [contrast-override.md](../patterns/contrast-override.md) | `fes-os-settings` |
| Transparency surfaces | [transparency-surfaces.md](../patterns/transparency-surfaces.md) | `fes-os-settings` |
| Saved-state ownership | [saved-state-ownership.md](../patterns/saved-state-ownership.md) | — |

---

## Validation status

All `src/components/ui/` files have corresponding spec entries.
All registry entries in `src/preview/registry.tsx` (non-empty groups) have preview IDs in this table.
See [README.md](../README.md) for the full documentation navigation.
