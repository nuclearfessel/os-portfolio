# Menubar

**Source:** `src/components/ui/menubar.tsx`  
**Export:** `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarGroup`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarShortcut`, `MenubarPortal`, `MenubarRadioGroup`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/menubar`  
**Preview page:** `menubar`

---

## Purpose

A desktop-style application menu bar for stable top-level menus such as File, Edit, and View. Each `MenubarMenu` pairs one `MenubarTrigger` with its popup content. It is intended for command-heavy desktop interfaces, not primary site navigation.

## Anatomy

```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New tab <MenubarShortcut>Cmd T</MenubarShortcut></MenubarItem>
      <MenubarSeparator />
      <MenubarItem disabled>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

- `Menubar` is the horizontal root bar.
- Each `MenubarMenu` owns one trigger and its popup.
- Content supports actions, toggles, radio groups, labels, separators, and nested submenus.

## API

| Component | Important props | Description |
|---|---|---|
| `Menubar` | `value`, `defaultValue`, `onValueChange`, `loop`, `dir` | Root bar; controlled or uncontrolled open menu state. |
| `MenubarMenu` | `value`, `open`, `onOpenChange` | Top-level menu scope. |
| `MenubarTrigger` | `disabled`, `className` | Top-level menu button. |
| `MenubarContent` | `align` (default `start`), `alignOffset` (default `-4`), `sideOffset` (default `8`) | Portalled popup surface. |
| `MenubarItem` | `inset`, `disabled`, `onSelect`, `textValue` | Action item; `inset` aligns its label. |
| `MenubarCheckboxItem` | `checked`, `onCheckedChange`, `disabled` | Toggle item. |
| `MenubarRadioGroup` | `value`, `defaultValue`, `onValueChange` | Mutually exclusive item group. |
| `MenubarRadioItem` | `value`, `disabled` | Radio choice in a group. |
| `MenubarSub` | `open`, `defaultOpen`, `onOpenChange` | Nested submenu state. |
| `MenubarSubTrigger` | `inset`, `disabled` | Opens a nested submenu and shows a chevron. |
| `MenubarSubContent` | `className` | Nested submenu surface. |
| `MenubarLabel` | `inset` | Non-interactive heading. |
| `MenubarSeparator` | `className` | Visual separator. |
| `MenubarShortcut` | HTML span props | Right-aligned shortcut hint only; it does not register a shortcut. |
| `MenubarGroup` / `MenubarPortal` | Radix component props | Group items or explicitly portal content. |

All wrappers forward refs and accept the corresponding Radix props. `asChild` is not added by these wrappers; use their native rendered elements and `className` as provided.

## Variants, states, and behavior

- **Open:** the active trigger uses `bg-accent text-accent-foreground`; content animates and is collision-aware.
- **Regular item:** selecting an item closes the menu unless `onSelect` prevents the default.
- **Checkbox:** controlled with `checked` and `onCheckedChange`; displays a check indicator.
- **Radio:** controlled through `MenubarRadioGroup`; displays a filled-circle indicator.
- **Submenu:** focus or activate `MenubarSubTrigger` to open its nested content.
- **Disabled:** disabled triggers/items cannot be selected and render with reduced opacity.
- **Layout:** the root is a 9-unit-high bordered bar. Content has a 12rem minimum width; use `className` for a product-specific width.

## Accessibility and keyboard behavior

Radix provides menu roles, roving focus, typeahead, focus restoration, and dismissal. Keep trigger labels short and distinct.

- `Enter`, `Space`, or `ArrowDown` opens the focused top-level menu; `Escape` closes it and restores focus to its trigger.
- `ArrowLeft` and `ArrowRight` move between top-level menus (wrapping according to `loop`); `ArrowDown`/`ArrowUp` move among items.
- `ArrowRight` opens a focused submenu; `ArrowLeft` returns to its parent.
- `Enter` or `Space` selects an item; typing searches by item label.
- Displayed `MenubarShortcut` text should match a separately implemented keyboard command.

## Relevant tokens

`bg-background`, `border`, `shadow-sm`, `bg-popover`, `text-popover-foreground`, `bg-accent`, `text-accent-foreground`, `text-muted-foreground`, `bg-muted`, `opacity-50`, `--radix-menubar-content-transform-origin`

## Import & usage

```tsx
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@workspace/os-portfolio-ds/components/ui/menubar';

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New tab <MenubarShortcut>Cmd T</MenubarShortcut></MenubarItem>
      <MenubarItem>New window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem disabled>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
        Show toolbar
      </MenubarCheckboxItem>
      <MenubarSub>
        <MenubarSubTrigger>Zoom</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
            <MenubarRadioItem value="90">90%</MenubarRadioItem>
            <MenubarRadioItem value="100">100%</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarSubContent>
      </MenubarSub>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Order menus consistently and keep top-level labels recognizable. | Use a menubar as a mobile navigation pattern; provide a responsive alternative. |
| Provide visible shortcut hints only when the command is actually available. | Put navigation links and unrelated transient actions into one ambiguous menu. |