# Iconography & Motion

**Living preview:** `os-portfolio-guidelines`

---

## Iconography

### Icon library
Use `lucide-react` icons (bundled as a dependency). Prefer icons with a keyline / outline style for consistency with the system's 1.7–1.8 stroke-width convention.

### Stroke width
Default: `1.7–1.8`. Use `strokeWidth={1.8}` on Lucide icons where the default (2.0) appears too heavy.

### Sizing
- **Default icon size in buttons/controls:** `size-4` (16×16px) — set automatically by Button via `[&_svg]:size-4`
- **Nav icon in settings sidebar:** 14×14px — pass `size={14}` or set `width="14" height="14"`
- **Status dot:** `size-1.5` (6×6px)
- Keep state-changing icons inside a fixed footprint — do not resize on hover/active

### Labeling
- **Icon-only controls** must have an accessible name: `aria-label` on the button, or a visually hidden `<span className="sr-only">`.
- **Decorative icons** must be hidden: `aria-hidden="true"`.
- **Unfamiliar icons** must be paired with visible text or a tooltip (via `Tooltip` component).

### DockItemLabel vs tooltips
- **Desktop:** use `DockItemLabel presentation="tooltip"` — renders with tooltip surface styles (border, bg, shadow, mono font).
- **Mobile / tablet:** use `DockItemLabel presentation="inline"` — renders as plain inline text with `font-sans`, no border or background.

---

## Motion

### Timing reference

| Context | Duration | Easing | Notes |
|---|---|---|---|
| Hover & focus feedback | 100ms | `ease` | Color, border, small positional shifts |
| Theme icon morphs | 240–340ms | Crossfade + rotate/scale | Sun↔Moon icon within a fixed footprint |
| Window / layer entry | ~160ms | `ease-out` | Should not delay interaction |
| Terminal block caret | 1s | `step-end` | Functional typing feedback; continues under reduced-effects modes |
| Drag & resize | Direct | None | Pointer controls geometry — no easing |

### Component token architecture

Motion uses primitive, semantic, and component layers in `tokens.json`.
Components consume `--osp-motion-component-*` contracts for durations and
easing rather than referencing primitive timings directly. The design-system
site presents only the component layer.

### CSS utilities used
- `--osp-motion-component-action-button-*` — button feedback
- `--osp-motion-component-dialog-*` and `sheet-*` — overlay entry and exit
- `--osp-motion-component-dock-*` and `desktop-launcher-*` — desktop navigation feedback
- `transition-transform` — knob slide in `SettingsToggleRow`
- `animate-pulse` — Skeleton loading state
- `animate-spin` — Spinner

### Animation speed overrides
The consuming app can adjust motion globally by setting data attributes on the shell element. The package stylesheet applies duration overrides automatically:

| Attribute | Effect |
|---|---|
| `data-anim-speed="less"` | `animation-duration: 2s`, `transition-duration: 0.6s` |
| `data-anim-speed="more"` | `animation-duration: 0.4s`, `transition-duration: 0.12s` |
| (no attribute) | Default timing |
| `data-no-animations` | Collapses all durations to `0.001ms` |
| `data-fast-ui` | `animation: none`, `transition: none` — maximum reduction |

`TerminalCursor` is the exception to these global animation suppressions. Its
blink communicates the active typing position and therefore remains active in
reduced-effects modes.

### Reduced motion
The package does not apply its own `@media (prefers-reduced-motion)` rules beyond what Tailwind ships. The consuming app should:
1. Read `prefers-reduced-motion` from the OS.
2. Set `data-no-animations` or `data-fast-ui` on the shell when reduction is requested.

See → [Accessibility](./accessibility.md), [Accessibility preference panel](../patterns/accessibility-panel.md)

### Motion do / don't

| Do | Don't |
|---|---|
| Use component motion contracts for duration and easing | Reference primitive durations or easing curves directly from component styles |
| Keep feedback fast, spatial, and interruptible | Delay interaction while an entry animation completes |
| Animate `transform` and `opacity` when possible | Animate layout properties such as width, height, padding, or position |
| Keep drag and resize geometry directly coupled to the pointer | Apply easing while the pointer controls geometry |
| Honor reduced-motion settings while preserving functional feedback | Remove the Terminal caret or other motion that communicates essential state |

---

## Iconography do / don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `strokeWidth={1.8}` for keyline icons | Leave stroke at default 2.0 when icons look heavy |
| Pair unfamiliar icons with labels or tooltips | Use icon-only controls without accessible names |
| Keep icon footprint stable across states | Resize icons on hover/pressed |
| Apply transitions to `transform` and `opacity` for performance | Animate `width`, `height`, `padding`, or other layout properties |
| Honor reduced-motion by setting shell attributes | Suppress motion using inline styles per-component |
