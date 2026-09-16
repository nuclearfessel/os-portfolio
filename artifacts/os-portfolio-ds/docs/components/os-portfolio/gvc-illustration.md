# Guide Illustration Components

**Source:** `src/components/ui/gvc-illustration.tsx`
**CSS:** `src/components/ui/gvc-illustration.css`
**Preview ID:** `gvc-illustration`

---

## Overview

The Guide Illustration layer provides three reusable React components for
teaching and annotated-interface diagrams:

| Component | Purpose |
|---|---|
| `AnnotatedFrame` | Crop + legend wrapper. Markers inside; legend rail below. |
| `AbstractWindow` | Product-correct window chrome. Title left, Min/Max/Close top-right. |
| `PositionGrid` + `PositionCell` | Contained mini-screen position diagram grid. |

These components are structural wrappers. Product-specific diagram interiors
(dock icons, sticky contents, terminal lines) remain in the consuming application.

---

## Anatomy

```
┌─ AnnotatedFrame ────────────────────────────────┐
│  ┌─ gvc-annotated-crop ─────────────────────┐  │
│  │                                           │  │
│  │  ← illustration children go here         │  │
│  │    (AbstractWindow, mini-screens, etc.)   │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│  ┌─ gvc-legend ─────────────────────────────┐  │
│  │  ● A  Description of A                   │  │
│  │  ● B  Description of B                   │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

```
┌─ AbstractWindow ─────────────────────┐
│ ┌─ gvc-win-titlebar ────────────────┐│
│ │ title text     [min][max][close]  ││
│ └───────────────────────────────────┘│
│ ┌─ gvc-window-body ─────────────────┐│
│ │  children                         ││
│ └───────────────────────────────────┘│
│                             ░░ (SE)  │
└──────────────────────────────────────┘
```

---

## API

### AnnotatedFrame

```tsx
<AnnotatedFrame
  markers={[
    { label: 'A', description: 'System bar — time, status, and location' },
    { label: 'B', description: 'Windows — each app opens here' },
  ]}
  cropClassName="gvc-overview-crop"
  aria-hidden="true"
>
  {/* illustration interior */}
</AnnotatedFrame>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Crop contents |
| `markers` | `AnnotatedFrameMarker[]` | — | Legend entries (`{ label, description }`) |
| `className` | `string` | — | Outer wrapper className |
| `cropClassName` | `string` | — | `.gvc-annotated-crop` className |
| `cropStyle` | `CSSProperties` | — | `.gvc-annotated-crop` inline style |
| `aria-hidden` | `boolean \| 'true' \| 'false'` | `'true'` | Decorative by default |

### AbstractWindow

```tsx
<AbstractWindow title="~/about" showResizeHandle style={{ width: '100%' }}>
  <div className="gvc-content-line" style={{ width: '60%' }} />
</AbstractWindow>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Left-aligned title bar text |
| `children` | `ReactNode` | — | Window body content |
| `className` | `string` | — | Outer `.gvc-window` className |
| `style` | `CSSProperties` | — | Outer `.gvc-window` style |
| `showResizeHandle` | `boolean` | `false` | Render SE resize handle dot-pattern |

### PositionGrid + PositionCell

```tsx
<PositionGrid>
  {(['top', 'right', 'bottom', 'left'] as const).map((pos) => (
    <PositionCell key={pos} position={pos}>
      <div className={`gvc-mini-sysbar gvc-mini-sysbar-${pos}`} />
    </PositionCell>
  ))}
</PositionGrid>
```

| Prop (Grid) | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `PositionCell` components |
| `columns` | `number` | `4` | Grid column count |
| `className` | `string` | — | Additional className |

| Prop (Cell) | Type | Default | Description |
|---|---|---|---|
| `position` | `string` | — | Label text (e.g. `'top'`, `'left'`) |
| `children` | `ReactNode` | — | Mini-screen interior |

### DotBadge

```tsx
<DotBadge label="A" />
<DotBadge label="B" inline />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Displayed character |
| `inline` | `boolean` | `false` | Apply `.gvc-dot-inline` margin/align |
| `className` | `string` | — | Additional className |
| `style` | `CSSProperties` | — | Local composition geometry, such as an edge marker's along-edge offset |

Shared placement modifiers:

| Class | Purpose |
|---|---|
| `.gvc-dot-edge-left` | Center a marker directly across a positioned element's left edge |
| `.gvc-dot-edge-se` | Center a marker directly across a positioned element's southeast corner |
| `.gvc-dot-group-center` | Center a marker beneath a grid or navigation group |
| `.gvc-window-overflow-visible` | Allow edge markers to extend beyond an `AbstractWindow` |
| `.gvc-fixed-strip` | Keep a teaching strip at `--gvc-fixed-strip-width` and prevent direct children from shrinking |

---

## Token Mapping

All colours reference `--component-guide-illustration-*` custom properties
generated from `tokens.json`. These alias semantic tokens so both light and
dark themes flow through automatically.

| CSS Variable | Semantic alias | Role |
|---|---|---|
| `--gv-bg` | `--component-guide-illustration-canvas` + opacity | Outer container background |
| `--gv-border` | `--component-guide-illustration-border` | Borders and lines |
| `--gv-surface` | `--component-guide-illustration-surface` | Legend rail background |
| `--gv-surface-mid` | `--component-guide-illustration-surface-mid` | Crop background |
| `--gv-surface-hi` | `--component-guide-illustration-surface-elevated` | Title bar background |
| `--gv-surface-deep` | `--component-guide-illustration-surface-deep` | Dock bar background |
| `--gv-surface-base` | `--component-guide-illustration-surface-base` | Mini-screen background |
| `--gv-line` | `--component-guide-illustration-content-line` | Skeleton content lines |
| `--gv-fg` | `--component-guide-illustration-foreground` | Primary text |
| `--gv-fg-muted` | `--component-guide-illustration-foreground-muted` | Legend and muted text |
| `--gv-primary` | `--component-guide-illustration-primary` | Dot badge background, accent |
| `--gv-primary-ring` | `--component-guide-illustration-primary-ring` | Callout borders |

---

## Responsive Containment

- Crops use `overflow: hidden` so the complete illustration remains inside the frame.
- A marker may cross an illustrated element's edge inside the crop. Apply
  `.gvc-window-overflow-visible` to that element and an edge modifier to the
  marker; never disable containment on the outer `.gvc-annotated` frame.
- Fixed teaching strips use one deliberate width and non-shrinking children.
  The consuming window must reserve enough space for that width at its minimum.
- At `container-width ≤ 499px`, `.gvc-legend` stacks items single-column
  and `.gvc-positions-grid` collapses to 2 columns via `@container`.
- The consuming element must set `container-type: inline-size` for
  container queries to engage (`.guide-content` in the portfolio does this).

---

## Window Controls Order

AbstractWindow renders controls **top-right, left-to-right**:
`Minimize → Maximize → Close`

This matches the OS Portfolio product's own window chrome order.
No macOS traffic-light colours are applied; buttons use `--gv-line`.

---

## Accessibility

- Wrap all illustration instances with `aria-hidden="true"` — they are
  purely decorative and their information is conveyed by surrounding text.
- `DotBadge` carries no role; it is always inside an `aria-hidden` context.
- `AbstractWindow` button spans carry `aria-label` attributes for screen-reader
  accessibility when rendered outside an `aria-hidden` tree.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Keep product-specific diagram interiors (dock icons, sticky body, terminal lines) in the portfolio — they are not part of the reusable DS layer. | Use `.gvc-traffic-lights` with `gvc-traffic-close/min/max` for new diagrams — use `AbstractWindow`'s monochrome buttons instead. |
| Import `gvc-illustration.css` alongside the component imports. | Hardcode colour hex values for illustration backgrounds or borders — always reference `--gv-*` custom properties that alias DS tokens. |
| Center a group-level marker beneath the entire group rather than under the first item. | |
| Use `.gvc-fixed-strip` for system-bar-style diagrams that must retain all labels and controls at every supported window width. | |

---

## Composition Example

```tsx
import '@workspace/os-portfolio-ds/components/ui/gvc-illustration.css';
import {
  AnnotatedFrame,
  AbstractWindow,
  DotBadge,
  PositionGrid,
  PositionCell,
} from '@workspace/os-portfolio-ds/components/ui/gvc-illustration';

function WindowGuide() {
  return (
    <AnnotatedFrame
      aria-hidden="true"
      markers={[
        { label: 'A', description: 'Title bar — drag to move' },
        { label: 'B', description: 'Min / Max / Close — top right' },
      ]}
    >
      <AbstractWindow
        title="~/about"
        className="gvc-window-overflow-visible"
        style={{ width: '100%', maxWidth: 360 }}
      >
        <DotBadge label="A" style={{ position: 'absolute', left: '46%', top: 8 }} />
        <DotBadge label="B" style={{ position: 'absolute', right: 2, top: 8 }} />
        <DotBadge label="C" className="gvc-dot-edge-se" />
        <div className="gvc-content-line" style={{ width: '70%' }} />
        <div className="gvc-content-line" style={{ width: '90%' }} />
      </AbstractWindow>
    </AnnotatedFrame>
  );
}
```
