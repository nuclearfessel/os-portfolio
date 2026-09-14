# Menus & Navigation — Family Reference

**Preview pages:** `dropdown-menu`, `context-menu`, `menubar`, `navigation-menu`, `breadcrumb`, `pagination`, `tabs`, `sidebar`

---

## DropdownMenu

**Source:** `src/components/ui/dropdown-menu.tsx` · **Preview:** `dropdown-menu`
**Exports:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuGroup`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuShortcut`, `DropdownMenuPortal`, `DropdownMenuRadioGroup`

Triggered by a button — shows a list of actions, selections, and shortcuts.

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@workspace/fes-os-design-system/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">Options</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Keyboard: Arrow keys to navigate, Enter/Space to activate, Escape to close.

---

## ContextMenu

**Source:** `src/components/ui/context-menu.tsx` · **Preview:** `context-menu`
**Exports:** `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuGroup`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuShortcut`, `ContextMenuPortal`, `ContextMenuRadioGroup`

Right-click context menus. Same API shape as DropdownMenu.

```tsx
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@workspace/fes-os-design-system/components/ui/context-menu';

<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="p-8 border rounded-lg">Right-click here</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Theme</ContextMenuItem>
    <ContextMenuItem>Reset desktop…</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

For the Fes OS desktop pattern (custom-positioned), see `ContextMenuSurface` in `fes-os.tsx`.

---

## Menubar

**Source:** `src/components/ui/menubar.tsx` · **Preview:** `menubar`
**Exports:** `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarGroup`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarShortcut`, `MenubarPortal`, `MenubarRadioGroup`

Desktop-style application menu bar — File, Edit, View, etc.

```tsx
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@workspace/fes-os-design-system/components/ui/menubar';

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New</MenubarItem>
      <MenubarItem>Open…</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Undo</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

---

## NavigationMenu

**Source:** `src/components/ui/navigation-menu.tsx` · **Preview:** `navigation-menu`
**Exports:** `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`

Primary navigation with rich dropdown/flyout panels. Built on `@radix-ui/react-navigation-menu`.

```tsx
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from '@workspace/fes-os-design-system/components/ui/navigation-menu';

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        {/* rich panel content */}
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

## Breadcrumb

**Source:** `src/components/ui/breadcrumb.tsx` · **Preview:** `breadcrumb`
**Exports:** `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`

Hierarchical location trail with parent links.

```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/fes-os-design-system/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/work">Work</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Orbit CRM</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## Pagination

**Source:** `src/components/ui/pagination.tsx` · **Preview:** `pagination`
**Exports:** `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`

Previous, next, page, and overflow controls.

```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@workspace/fes-os-design-system/components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## Tabs

**Source:** `src/components/ui/tabs.tsx` · **Preview:** `tabs`
**Exports:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

Switch between related content views.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@workspace/fes-os-design-system/components/ui/tabs';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content…</TabsContent>
  <TabsContent value="details">Details content…</TabsContent>
</Tabs>
```

ARIA: `role="tablist"`, `role="tab"` + `aria-selected`, `role="tabpanel"` + `aria-labelledby`.
Keyboard: Arrow keys to switch tabs, Enter/Space to activate.

---

## Sidebar

**Source:** `src/components/ui/sidebar.tsx` · **Preview:** `sidebar`
**Exports:** `Sidebar`, `SidebarProvider`, `SidebarTrigger`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`, `SidebarSeparator`, `SidebarInput`, `SidebarInset`, `SidebarRail`, `useSidebar`

Full application sidebar with expand/collapse, mobile sheet behavior, keyboard shortcut, and provider context.

```tsx
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@workspace/fes-os-design-system/components/ui/sidebar';

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard">Dashboard</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {/* main content */}
  </SidebarInset>
</SidebarProvider>
```

- Toggle keyboard shortcut: `⌘B` (configurable via `SIDEBAR_KEYBOARD_SHORTCUT`).
- Mobile: automatically renders as a `Sheet`.
- State stored in cookie `sidebar_state` — overridable via `open` / `onOpenChange`.
- Token set: `sidebar-*` tokens used throughout.

Note: `Sidebar` is a general-purpose application sidebar. For the Fes OS settings sidebar (section nav inside a window), use `SettingsNavSection` / `SettingsNavItem` instead.

For any sidebar used as section navigation inside a resizable Fes OS window, the universal window rule applies: at a narrow window-container width, smoothly transform it into a horizontal sub-navigation toolbar directly below the window toolbar. Do not key this transformation to viewport width, hide the navigation, or place it over the content.
