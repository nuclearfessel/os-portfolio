# Pattern: Desktop Window Workspace

- **Specimen:** Static reference — `os-portfolio-pilot` WindowSurface demo
- **Variants:** Desktop freeform; tablet managed; mobile single-window or bottom-sheet
- **States:** Open; minimized; closed; focused; active; dragging; resizing; maximized

---

## Intent

The OS Portfolio desktop presents multiple floating windows simultaneously — each window is a distinct content area that the user can move and resize freely. The design system provides the visual surface; the consuming product provides all geometry management.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `WindowSurface` | `os-portfolio.tsx` | Visual shell (border, bg, shadow) |
| `SectionLabel` | `os-portfolio.tsx` | Window title kicker / path label |
| `ActionButton` | `os-portfolio.tsx` | Secondary window controls and actions |
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
| Maximized drag-to-restore | Product title-bar pointer handling |
| Keyboard close commands | Product global keyboard handling |
| Primary input focus | Product; text-entry windows focus their input when opened, restored, or activated |

`WindowSurface` has no internal state — it is purely visual.

### Action hierarchy

Use `ActionButton variant="secondary"` for Settings, Guide, Work, and other
in-window actions. Reserve `primary` for the desktop's dominant “open work”
quick action, `tertiary` for the adjacent “say hello” action, and `danger` for
destructive confirmation. Do not promote routine window controls to primary.

### Maximized title-bar dragging

When a user begins dragging a maximized window by its title bar, the product
restores the window to its saved pre-maximize size and continues the same pointer
gesture. Place the restored window so the grabbed title-bar point remains under
the pointer. Do not require a separate restore click before dragging.

### Window close shortcuts

These shortcuts run only in desktop mode while the page has keyboard focus:

| Action | macOS | Windows / Linux |
|---|---|---|
| Close topmost open product window | `Command + Shift + X` | `Control + Shift + X` |
| Close all open product windows | `Command + Option + Shift + X` | `Control + Alt + Shift + X` |

Topmost means the highest open entry in the product's current z-order. Closing
through the keyboard uses the same geometry-preserving close path as the window
control. Ignore repeated keydown events so holding the shortcut cannot close
multiple windows unintentionally.

These commands close OS Portfolio windows, not browser tabs. Do not attempt to
override browser-reserved `Command/Control + W` or `Command/Control + E`.

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

## System-bar placement

The system bar may be placed on any desktop edge. Top and bottom placements
use the full horizontal identity treatment. Left and right placements use a
compact 48px rail: keep the OS Portfolio logo visible, hide the wordmark, and
reflow status and action content vertically.

Windows, desktop launchers, sticky notes, and the Dock must offset from the
occupied edge so changing system-bar placement never obscures or misaligns
workspace content.

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
- [ ] Maximized title-bar drag restores and continues under the same pointer.
- [ ] Product close shortcuts preserve geometry and follow current z-order.
- [ ] Text-entry windows place focus at their primary caret when opened,
      restored, or brought forward, without blocking intentional output selection.

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
| Reserve the mounted system-bar edge in workspace geometry | Overlay a side-mounted system bar on windows or launchers |

---

## Composition example

```tsx
import { WindowSurface, SectionLabel, ActionButton } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

<WindowSurface
  aria-labelledby="about-title"
  style={{ left: osp.x, top: osp.y, width: size.w, height: size.h }}
  className="absolute overflow-hidden"
>
  <div
    className="flex items-center justify-between border-b border-border px-4 py-3"
    onPointerDown={startDrag}
  >
    <SectionLabel id="about-title">~/john/about</SectionLabel>
    <ActionButton
      variant="secondary"
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
