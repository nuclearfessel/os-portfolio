# Accessibility

**Living preview:** `accessibility`
**Implementation target:** WCAG 2.2 Level AA (this is a design target, not a certification claim)

---

## Contrast & color

| Criterion | Target | Applies to |
|---|---|---|
| Normal text (< 18pt / < 14pt bold) | ≥ 4.5:1 | All body text, labels, descriptions |
| Large text (≥ 18pt / ≥ 14pt bold) | ≥ 3:1 | Headings, display text |
| Interactive states (hover, focus) | Must preserve readable contrast | Buttons, links, form controls |
| Color-only meaning | Not allowed | Status, selection, destructive actions |

Color alone must never carry selection state, status, or destructive meaning. Always pair color with text, icons, or ARIA attributes.

### Text over wallpaper

The desktop introduction is a special high-variability surface because users can
select solid colors or images:

- Target **7:1** contrast for each intro text role against the sampled wallpaper.
- Prefer the role's branded color when it reaches the target.
- Otherwise choose the highest-contrast available foreground, including black or
  white candidates.
- If no candidate reaches 7:1, use the best available candidate.
- Do not add a backing panel, scrim, text shadow, or translucent plate behind the
  introduction to manufacture contrast.
- Recalculate when the wallpaper, theme, or intro text color changes.

The preferred ratio is exposed as `--desktop-intro-contrast-target` and as
`tokens.accessibility.contrast.desktopIntroTarget`. This strengthens the general
WCAG AA baseline for content placed directly over arbitrary wallpaper.

### High-contrast mode
When `data-contrast="high"` is active, all semantic tokens re-map to the fixed high-contrast palette (black/white/yellow). Focus rings become 3px yellow (`var(--hc-focus)`). See → [Contrast override behavior](../patterns/contrast-override.md).

---

## Keyboard & focus

- Every interactive element uses a **native HTML element** (`<button>`, `<input>`, `<a>`, `<select>`, `<textarea>`) or a Radix UI primitive with correct keyboard handling.
- **Visible focus treatment** is required on every keyboard-operable control (`focus-visible:ring-2 focus-visible:ring-ring`).
- `Escape` closes open menus, dialogs, sheets, drawers, and transient layers.
- Pointer dismissal closes non-modal shortcut drawers when the pointer lands
  outside the drawer; activating the drawer trigger again also closes it.
- Dialogs and sheets trap focus until dismissed.
- Modal dialogs restore focus to the trigger element on close.
- Desktop numeric shortcuts are suspended while a color-value field has focus so
  number entry cannot launch or focus Dock applications.
- Dock state and keyboard focus remain separate: every open app retains its
  full-tile border/ring, only the focused topmost app receives the directional
  edge tab, and `:focus-visible` remains available for keyboard focus.

### Focus ring token
`ring` maps to `primary` in both themes. In high-contrast mode it maps to `--hc-focus` (#ffff00) globally via `*:focus-visible`.

---

## Names & semantics

### Required ARIA attributes by component

| Component | Required semantics |
|---|---|
| `DockItem` | `aria-label` on each button |
| `DesktopLauncher` | `aria-label` or visible text |
| `StatusIndicator` | `aria-hidden="true"` on dot span; visible label text |
| `SettingsToggleRow` | `role="switch"`, `aria-checked`, linked `<label>` |
| `SettingsSegmentedChoice` | `role="radiogroup"` wrapper, `role="radio"` + `aria-checked` per chip |
| `SettingsContrastCard` | `role="radio"` + `aria-checked`; parent `role="radiogroup"` |
| `SettingsColorPreset` | `aria-pressed`, `aria-label` |
| `SettingsNavItem` | `aria-current="page"` when active |
| `SettingsNavSection` | `<nav aria-label="…">` landmark |
| `SettingsSliderGroup` | `aria-label`, `aria-valuetext`, `aria-live="polite"` on `<output>` |
| Icon-only buttons | `aria-label` on button |
| Decorative icons | `aria-hidden="true"` |

### Landmark structure
- Settings sidebar uses `<nav aria-label="Settings sections">` — a named nav landmark.
- Windows and major content areas should use `<section>`, `<main>`, or `<aside>` with accessible names.
- Dialog content uses `<dialog>` semantics via Radix (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).

---

## Status & live regions

- `SettingsSliderGroup` uses `<output aria-live="polite">` to announce value changes.
- Storage availability and recovery messages should use `role="status"` (polite) regions.
- Error messages should use `role="alert"` (assertive) when immediate correction is needed.
- Destructive actions require a confirmation step before data is removed.

---

## Motion & manipulation

- Nonessential transitions are removed when `data-no-animations` is set on the shell.
- Pointer-controlled dragging, resizing, and rotation are direct and interruptible (no easing while pointer is active).
- Drag-only desktop interactions provide button, keyboard, or managed-layout alternatives.
- Responsive reflow does not destroy saved desktop arrangement (see → [Saved-state ownership](../patterns/saved-state-ownership.md)).

---

## Responsive access

- Mobile navigation is fixed at the bottom with visible text labels (not icon-only).
- Desktop-only tools are removed (not left unreachable) on touch layouts.
- Body copy stays at 13px or larger.
- Major controls have practical touch targets (min 36px height via `min-h-9` on ActionButton and Button).
- Content reflows without horizontal page scrolling.
- Teaching diagrams retain complete labels and controls at supported minimum
  window widths. Prefer a fixed non-shrinking diagram with a documented host
  minimum over progressively compressed text.
- Modifier-chord key diagrams use a flat uniform border; do not add a bottom tab
  or raised-key indicator that could be mistaken for state.
- Text cursors in terminal diagrams are vertically centered on their prompt line.

---

## Settings preferences exposed

The accessibility preference panel exposes these user-controlled behaviors. All are visual-only in the design system; the consuming app owns persistence and DOM attribute management.

| Preference | Component | Consuming app attribute |
|---|---|---|
| Always show scrollbars | `SettingsToggleRow` | `data-always-scrollbars` on shell |
| Window transparency | `SettingsToggleRow` + `SettingsSliderGroup` | `data-transparency-enabled` + `--accessibility-transparency` |
| UI animations on/off | `SettingsToggleRow` | `data-no-animations` on shell |
| Animation speed | `SettingsSegmentedChoice` | `data-anim-speed="less\|more"` on shell |
| Contrast theme | `SettingsContrastCard` | `data-contrast="low\|high"` on `:root` |

See → [Accessibility preference panel](../patterns/accessibility-panel.md)

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Add `aria-label` to every icon-only button | Rely on tooltips alone to name controls |
| Use `role="switch"` + `aria-checked` for toggles | Style a `<div>` as a toggle without semantics |
| Pair color status indicators with readable text | Use color alone to convey online/idle/danger state |
| Test all interactive components in both light and dark themes | Assume dark theme passes because light theme does |
| Provide keyboard alternatives to drag interactions | Leave window dragging as the only way to reposition |
| Use `aria-current="page"` on the active nav item | Indicate active state with CSS alone |
