# Structure & Layout — Family Reference

**Preview pages:** `separator`, `scroll-area`, `resizable`

---

## Separator

**Source:** `src/components/ui/separator.tsx` · **Preview:** `separator`
**Exports:** `Separator`

Horizontal or vertical visual divider. Built on `@radix-ui/react-separator`.

```tsx
import { Separator } from '@workspace/portfolio-os-design-system/components/ui/separator';

// Horizontal (default)
<Separator />

// Vertical
<div className="flex h-8 items-center gap-2">
  <span>Section A</span>
  <Separator orientation="vertical" />
  <span>Section B</span>
</div>
```

- `orientation`: `'horizontal'` (default) | `'vertical'`
- `decorative`: `true` hides from assistive technology (`role="none"` or `aria-hidden="true"`)
- Token: `bg-border`
- Note: `SettingsDivider` from `settings.tsx` is a styled `<hr>` variant for use within settings content panes.

---

## ScrollArea

**Source:** `src/components/ui/scroll-area.tsx` · **Preview:** `scroll-area`
**Exports:** `ScrollArea`, `ScrollBar`

Bounded vertical and horizontal scrolling with styled scrollbars. Built on `@radix-ui/react-scroll-area`.

```tsx
import { ScrollArea } from '@workspace/portfolio-os-design-system/components/ui/scroll-area';

<ScrollArea className="h-64 w-full rounded-md border p-4">
  {/* long content */}
</ScrollArea>

// Horizontal scroll
<ScrollArea className="w-96 whitespace-nowrap">
  <div className="flex gap-4">
    {items.map(item => <Card key={item.id}>{item.name}</Card>)}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

Scrollbar visibility: hidden by default, shown on hover. When the user enables "Always show scrollbars" in accessibility settings, the consuming app sets `data-always-scrollbars` on the shell — the package CSS makes scrollbars persistently visible.

---

## ResizablePanelGroup

**Source:** `src/components/ui/resizable.tsx` · **Preview:** `resizable`
**Exports:** `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`

Bounded split panes with draggable handles. Built on `react-resizable-panels`.

```tsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@workspace/portfolio-os-design-system/components/ui/resizable';

<ResizablePanelGroup direction="horizontal" className="min-h-64 rounded-lg border">
  <ResizablePanel defaultSize={30}>
    <div className="p-4">Sidebar</div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel>
    <div className="p-4">Main content</div>
  </ResizablePanel>
</ResizablePanelGroup>
```

- `direction`: `'horizontal'` | `'vertical'`
- `withHandle`: adds the visible drag grip to the handle
- Panel sizes are percentages (0–100); use `minSize` / `maxSize` to constrain
- Keyboard: focus the handle and use Arrow keys to resize; resize events are direct (no easing)
- Note: ResizablePanelGroup is for bounded in-page split panes. The Portfolio OS desktop window resize (free-form, user-arranged) is a consuming-product responsibility — not provided by this component.
