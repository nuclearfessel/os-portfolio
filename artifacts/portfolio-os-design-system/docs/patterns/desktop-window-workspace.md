# Pattern: Desktop Window Workspace

**Preview:** `portfolio-os-pilot` (WindowSurface demo)

---

## Intent

The Portfolio OS desktop presents multiple floating windows simultaneously — each window is a distinct content area that the user can move and resize freely. The design system provides the visual surface; the consuming product provides all geometry management.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `WindowSurface` | `portfolio-os.tsx` | Visual shell (border, bg, shadow) |
| `SectionLabel` | `portfolio-os.tsx` | Window title kicker / path label |
| `ActionButton` | `portfolio-os.tsx` | Window controls (close, actions) |
| `Separator` | `ui/separator.tsx` | Title bar / content divider |

---

## Anatomy / Composition

```
┌──────────────────────────────────────────────────────┐  WindowSurface
│  [title bar — product]                               │  ← border-b border-border
│  SectionLabel + path / window name                   │
├──────────────────────────────────────────────────────┤
│  [window content — product]                          │
│  Menubar? | Tabs? | ScrollArea                        │
│  …                                                   │
│  [action row — product]                              │  ActionButton(s)
└──────────────────────────────────────────────────────┘
```

---

## State ownership

> **All of the following are consuming-product responsibilities:**

| Concern | Product responsibility |
|---|---|
| Position (x, y) | Product state, persisted (see [Saved-state ownership](./saved-state-ownership.md)) |
| Size (width, height) | Product state, persisted |
| Z-order / stacking | Product state |
| Open / minimized / closed | Product state |
| Dragging | Product event handlers |
| Resizing | Product event handlers / `ResizablePanelGroup` for in-window splits |
| Window controls (close, minimize, maximize) | Product |

`WindowSurface` has no internal state — it is purely visual.

On freeform desktops, reserve the window stack above wallpaper, desktop
content, launchers, and the complete sticky-note layer. Reordering active
windows changes order only within the window layer; even the lowest open window
must remain above the highest active sticky.

---

## Responsive transformation

| Breakpoint | Behavior |
|---|---|
| Desktop (≥ 1024px) | Freeform: windows float at user-arranged positions |
| Tablet (768–1023px) | Managed layout: one window at a time, centered/modal |
| Mobile (< 768px) | Single-window or bottom-sheet — no overlap |

Responsive reflow must never overwrite desktop geometry. The product reads the breakpoint and temporarily hides the freeform layout on narrow screens without persisting any geometry changes.

---

## Transparency

```tsx
<WindowSurface className="portfolio-surface-translucent overflow-hidden">
  …
</WindowSurface>
```

When `data-transparency-enabled` + `--accessibility-transparency` are set by the consuming app, the `portfolio-surface-translucent` class applies a backdrop blur.

---

## Accessibility checklist

- [ ] `WindowSurface` has `aria-label` or `aria-labelledby` pointing to the window title.
- [ ] Window close button has `aria-label="Close [window name]"`.
- [ ] Keyboard focus is trapped inside the active window when it is modal.
- [ ] Focus returns to the launcher button when a window closes.
- [ ] Resize handles have accessible names and keyboard support.
- [ ] Every open window remains above every sticky note, including the active sticky.

---

## Tokens / contracts

`bg-card`, `text-card-foreground`, `border-border`, `rounded-lg`, `shadow-xl`, `portfolio-surface-translucent` (optional)

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Keep geometry management in the product | Add position/resize state to `WindowSurface` |
| Apply `portfolio-surface-translucent` only to windows that should respond to transparency prefs | Apply it to all elements globally |
| Provide keyboard resize alternative | Make resize drag-only |

---

## Composition example

```tsx
import { WindowSurface, SectionLabel, ActionButton } from '@workspace/portfolio-os-design-system/components/ui/portfolio-os';

<WindowSurface
  aria-labelledby="about-title"
  style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
  className="absolute overflow-hidden"
>
  <div
    className="flex items-center justify-between border-b border-border px-4 py-3"
    onPointerDown={startDrag}
  >
    <SectionLabel id="about-title">~/john/about</SectionLabel>
    <ActionButton
      aria-label="Close About window"
      onClick={closeWindow}
      className="size-6 p-0"
    >
      ×
    </ActionButton>
  </div>
  <div className="overflow-auto p-5">
    {/* window content */}
  </div>
</WindowSurface>
```
