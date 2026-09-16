# Pattern: Annotated Interface Teaching

- **Specimen:** Static reference — `gvc-illustration` AnnotatedFrame, AbstractWindow, and PositionGrid demos
- **Variants:** Annotated frame; abstract window; position grid; fixed teaching strip
- **States:** Selected position; visible legend; contained labels; hidden decorative content

---

## Intent

The annotated-interface teaching pattern provides a safe, token-driven way to compose screenshot-style UI teaching diagrams directly in JSX — no static images, no out-of-band SVG, no hardcoded colours. Every illustration updates automatically when the design system theme changes.

Use it for:

- Feature-announcement guides and changelogs
- Onboarding walkthroughs
- In-product "how this works" explainers
- Design documentation and spec handoffs

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `AnnotatedFrame` | `gvc-illustration.tsx` | Outer wrapper — crop + legend rail |
| `AbstractWindow` | `gvc-illustration.tsx` | Window chrome with monochrome controls |
| `PositionGrid` | `gvc-illustration.tsx` | 4-up mini-screen position selector |
| `PositionCell` | `gvc-illustration.tsx` | One mini-screen position cell |
| `DotBadge` | `gvc-illustration.tsx` | Numbered callout dot |

CSS classes from `gvc-illustration.css`:

| Class | Role |
|---|---|
| `.gvc-annotated` | Frame outer wrapper |
| `.gvc-annotated-crop` | Strictly contained illustration area |
| `.gvc-legend` | Rail of numbered legend items below the crop |
| `.gvc-legend-item` | Single legend entry (dot + label) |
| `.gvc-dot-badge` | Numbered dot; colour = `--gv-primary` / `--gv-marker-fg` |
| `.gvc-win-titlebar` | Monochrome window title bar |
| `.gvc-win-controls` | Min / Max / Close button group |
| `.gvc-win-btn` | Single monochrome window button |
| `.gvc-window` | Window container (border, shadow, bg) |
| `.gvc-positions-grid` | 4-column position-grid container |
| `.gvc-pos-cell` | Single position cell |
| `.gvc-pos-label` | Position label below mini screen |
| `.gvc-screen-mini` | Mini screen abstraction |
| `.gvc-callout` | Inline positioned label |

---

## Anatomy / Composition

```
┌────────────────────────────────────────────────────────┐  .gvc-annotated
│  .gvc-annotated-crop                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  AbstractWindow                                  │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │  .gvc-win-titlebar                        │   │  │
│  │  │  [title text]    [.gvc-win-controls]      │   │  │
│  │  ├──────────────────────────────────────────┤   │  │
│  │  │  .gvc-window-body                         │   │  │
│  │  │  .gvc-content-line …                      │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  │  .gvc-dot-badge   ① ② ③                         │  │
│  └──────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────┤
│  .gvc-legend                                           │
│  ① Legend item one     ② Legend item two              │
└────────────────────────────────────────────────────────┘
```

---

## Responsive legend flow

The legend rail (`gvc-legend`) uses `flex-wrap: wrap` so items reflow at any container width. Below 500 px (enforced by a `@container` query on `.gvc-annotated`), the legend stacks single-column and the position grid drops from 4 to 2 columns.

**Rules:**

- Keep legend text under 60 characters per item so no item wraps on its own line at ≥ 320 px.
- Use at most 6 numbered legend items per frame; more labels make the legend taller than the illustration.
- Never truncate legend text — use short, imperative phrases ("Sets the accent colour", not "This control is used to set the accent colour for the selected section").

---

## Label containment and non-overlap

All annotation labels must live in the **legend**, never directly inside the crop area. This is the core containment rule:

```
✅ CORRECT                    ❌ WRONG
  crop  │  legend rail           crop  │  legend rail
  ──────┤──────────              ──────┤──────────
  ①②③  │  ① label A             ① label A ②      │  (empty)
        │  ② label B             ② label B ③      │
        │  ③ label C             ③ label C        │
```

**Callout labels** (`.gvc-callout`) are the only exception — they identify a specific region by name (e.g., "System bar", "Dock"), not by numeric index. They must:

- Use 2–4 words max.
- Be positioned with `.gvc-callout-top`, `.gvc-callout-bottom`, `.gvc-callout-left`, or `.gvc-callout-right` to avoid overlapping the element they label.
- Have `pointer-events: none` (already set in DS CSS) so they cannot be accidentally interacted with.

Dot badges (`.gvc-dot-badge`) inside the crop never carry text labels — only the legend entries do.

Markers that identify an edge or corner should be centered across that exact
boundary. Use `.gvc-dot-edge-left` or `.gvc-dot-edge-se`; if the illustrated
element normally clips its children, opt that element into
`.gvc-window-overflow-visible`. The outer annotated frame remains contained.
A marker describing a navigation group uses `.gvc-dot-group-center` so it sits
beneath the group rather than appearing attached to the first item.

### Fixed teaching strips

System-bar-style diagrams should render one compact, legible composition instead
of progressively shrinking their text and gaps. Use `.gvc-fixed-strip`, set
`--gvc-fixed-strip-width` in the consuming composition, and keep every direct
child non-shrinking. The host window minimum and crop padding must guarantee the
strip fits; do not hide lower-priority labels to make the diagram pass.

---

## Decorative vs. accessible rules

**Decorative diagrams** (the common case — accompanies prose that explains the same information):

```tsx
// aria-hidden on the frame; prose in the surrounding page provides context
<AnnotatedFrame ariaHidden>
  <AbstractWindow title="Appearance" />
</AnnotatedFrame>
```

Use `aria-hidden={true}` (or the `ariaHidden` prop on `AnnotatedFrame`) when the surrounding content already describes what the diagram shows. Screen readers skip the entire frame.

**Standalone diagrams** (no adjacent prose):

```tsx
<AnnotatedFrame label="Diagram: the three dock positions">
  {/* crop content */}
</AnnotatedFrame>
```

Pass a `label` string to `AnnotatedFrame` when the diagram is the primary content. The component sets `role="img"` and `aria-label` on the crop container.

**Never** put meaningful text inside the crop as plain DOM text — the legend is the accessible text layer.

---

## Correct window-control placement

The DS enforces **product-correct** (non-macOS) window chrome:

```
.gvc-win-titlebar
  [title text]  →  left-aligned, .gvc-win-title-text
  [controls]    →  right-aligned, .gvc-win-controls
                   order: Minimize | Maximize | Close
```

All three buttons are **monochrome** (`--gv-line` fill, `--gv-border` border). No traffic-light colours. This is intentional — the teaching diagrams represent an abstract OS, not a specific platform.

```tsx
// ✅ CORRECT — product-correct window chrome (DS AbstractWindow component)
<AbstractWindow title="Settings">
  {/* body */}
</AbstractWindow>

// ❌ WRONG — macOS traffic-light colours violate the abstract-OS rule
<div className="gvc-window-titlebar">
  <div className="gvc-traffic-close" />  {/* #ff5f57 — banned */}
  <div className="gvc-traffic-min" />    {/* #febc2e — banned */}
  <div className="gvc-traffic-max" />    {/* #27c840 — banned */}
</div>
```

If you need to show macOS-specific chrome in product-facing copy (e.g., a changelog screenshot that targets macOS users), keep those styles **in the portfolio's own CSS** as representational fixed colours, not in the DS.

---

## Token derivation

All visual properties derive exclusively from generated `--component-guide-illustration-*` CSS vars. The `--gv-*` shorthands in `:root` / `.theme-light` are aliases of those generated vars — they never reference raw hex or rgba.

| DS token role | Semantic alias | Generated CSS var |
|---|---|---|
| `secondaryAccent` | `chart3` | `--component-guide-illustration-secondary-accent` → `var(--chart-3)` |
| `markerForeground` | `primaryForeground` | `--component-guide-illustration-marker-foreground` → `var(--primary-foreground)` |
| `shadowBase` | `foreground` | `--component-guide-illustration-shadow-base` → `var(--foreground)` |

Shadows use `hsl(var(--component-guide-illustration-shadow-base) / α)` — no `rgba(0,0,0,…)` anywhere in the DS stylesheet.

---

## Dos and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Keep all annotation text in the legend | Put text labels directly inside the crop |
| Center edge markers across the edge they identify | Place edge markers fully inside the illustrated element |
| Keep fixed teaching strips legible and non-shrinking | Compress labels and controls independently at multiple breakpoints |
| Center group markers beneath the complete group | Align a group marker to the first navigation item |
| Use `AbstractWindow` for any window chrome | Hand-roll `.gvc-win-titlebar` with traffic-light colours |
| Use `ariaHidden` when prose covers the same information | Leave decorative diagrams accessible to screen readers (noisy) |
| Keep legend items under 60 characters | Write multi-sentence legend labels |
| Use `DotBadge` for numeric callouts | Create ad-hoc coloured circles |
| Rely on `--gv-*` shorthand vars | Write raw hex or rgba in diagram CSS |
| Use `PositionGrid` / `PositionCell` for position choosers | Hand-roll 4-column grids |

---

## See also

- [GVC Illustration component spec](../components/os-portfolio/gvc-illustration.md) — full component API
- [Transparency surfaces pattern](./transparency-surfaces.md) — when diagram surfaces need backdrop-filter
- [Saved-state ownership](./saved-state-ownership.md) — if the selected position cell must be persisted
