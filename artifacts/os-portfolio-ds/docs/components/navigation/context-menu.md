# ContextMenu

**Source:** `src/components/ui/context-menu.tsx`  
**Export:** `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuGroup`, `ContextMenuPortal`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuRadioGroup`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/context-menu`  
**Preview page:** `context-menu`

---

## Purpose

A right-click (context) menu for actions and selections associated with a region or object. It is built on Radix Context Menu and opens at the pointer location. Use `ContextMenuSurface` from `os-portfolio.tsx` when the OS Portfolio desktop pattern needs a custom-positioned surface instead.

## Anatomy

```tsx
<ContextMenu>
  <ContextMenuTrigger>Target region</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuLabel>Document</ContextMenuLabel>
    <ContextMenuItem>Rename</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuSub>
      <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuRadioGroup value="drafts">
          <ContextMenuRadioItem value="drafts">Drafts</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>
```

- `ContextMenuTrigger` is the region that responds to the secondary pointer button.
- `ContextMenuContent` is portalled and positioned by Radix at the pointer.
- Items can be regular actions, checkboxes, radio choices, or nested submenus.

## API

| Component | Important props | Description |
|---|---|---|
| `ContextMenu` | `onOpenChange`, `dir`, `modal` | Root state and interaction context. |
| `ContextMenuTrigger` | `asChild`, `disabled` | Context-menu target; accepts trigger element props. |
| `ContextMenuContent` | `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `className` | Portalled menu surface; accepts Radix content props. |
| `ContextMenuItem` | `inset`, `disabled`, `onSelect`, `textValue` | Action item. `inset` aligns with check/radio items. |
| `ContextMenuCheckboxItem` | `checked`, `onCheckedChange`, `disabled` | Toggle item; `checked` may be controlled. |
| `ContextMenuRadioGroup` | `value`, `defaultValue`, `onValueChange` | Groups mutually exclusive radio items. |
| `ContextMenuRadioItem` | `value`, `disabled` | One option in a radio group. |
| `ContextMenuSub` | `open`, `defaultOpen`, `onOpenChange` | Nested submenu state. |
| `ContextMenuSubTrigger` | `inset`, `disabled` | Opens a nested submenu and renders a chevron. |
| `ContextMenuSubContent` | `className` | Nested submenu surface. |
| `ContextMenuLabel` | `inset` | Non-interactive group heading. |
| `ContextMenuSeparator` | `className` | Visual separator. |
| `ContextMenuShortcut` | HTML span props | Right-aligned shortcut hint; it does not bind a shortcut. |
| `ContextMenuGroup` / `ContextMenuPortal` | Radix component props | Group items or explicitly portal content. |

All wrappers forward refs and accept the corresponding Radix/native props. `asChild` uses Radix Slot, so the child must be able to receive props and a ref.

## Variants, states, and behavior

- **Regular item:** closes the menu after `onSelect` unless selection is prevented.
- **Checkbox:** shows a check indicator when `checked`; use `onCheckedChange` to update controlled state.
- **Radio:** shows a filled circle for the selected item; place items inside `ContextMenuRadioGroup`.
- **Submenu:** `ContextMenuSubTrigger` opens `ContextMenuSubContent`; nested surfaces use the same item primitives.
- **Disabled:** `disabled` items are non-interactive and render with reduced opacity.
- **Focus/open:** focused items use `bg-accent text-accent-foreground`; content animates on open/close and is constrained to available height.
- **Placement:** content uses Radix collision handling and is automatically placed near the pointer; `className` can add width or layout adjustments.

## Accessibility and keyboard behavior

Radix supplies menu roles, focus management, labeling, and dismissal behavior. Give the trigger meaningful visible content or an accessible name.

- Right-click (secondary pointer button) opens the menu; `Shift+F10` or the Context Menu key provides a keyboard equivalent when the trigger is focused.
- `ArrowDown`/`ArrowUp` moves through items, with typeahead search for item labels.
- `ArrowRight` opens a focused submenu; `ArrowLeft` returns to its parent.
- `Enter` or `Space` selects an item; `Escape` closes the current menu and restores focus.
- Do not rely on `ContextMenuShortcut` as an actual keyboard binding; implement command shortcuts separately and keep the hint accurate.

## Relevant tokens

`bg-popover`, `text-popover-foreground`, `border`, `shadow-md`, `shadow-lg`, `bg-accent`, `text-accent-foreground`, `text-foreground`, `text-muted-foreground`, `opacity-50`, `--radix-context-menu-content-available-height`, `--radix-context-menu-content-transform-origin`

## Import & usage

```tsx
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@workspace/os-portfolio-ds/components/ui/context-menu';

<ContextMenu>
  <ContextMenuTrigger className="rounded-lg border p-8">
    Right-click this area
  </ContextMenuTrigger>
  <ContextMenuContent className="w-56">
    <ContextMenuLabel>Document</ContextMenuLabel>
    <ContextMenuItem onSelect={() => rename()}>Rename</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuCheckboxItem checked={favorite} onCheckedChange={setFavorite}>
      Favorite
    </ContextMenuCheckboxItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem onSelect={() => move('archive')}>Archive</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>
```

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Offer the same essential actions elsewhere for touch and keyboard users. | Hide the only path to a critical action in a context menu. |
| Use labels and item text that describe the target and action. | Nest deeply or put long forms inside a transient menu; use a dialog for complex workflows. |