# Effects

**Living preview:** `effects`
**Implementation sources:** Tailwind shadow utilities and `.portfolio-surface-translucent` in `src/index.css`

---

## Purpose

Effects communicate depth, separation, and material without replacing hierarchy,
borders, or readable contrast. The system uses three related tools:

1. **Drop shadows** establish elevation.
2. **Transparency** lets selected surfaces reveal the workspace behind them.
3. **Backdrop blur** preserves legibility on those translucent surfaces.

These are existing utility and behavior contracts, not a separate token scale.
Do not introduce new shadow values or one-off glass treatments when an existing
level or the shared translucent-surface utility fits.

---

## Drop shadows

| Level | Utility | Intended use |
|---|---|---|
| Flat | None | Inline or nested surfaces that do not need depth |
| Low | `shadow-sm` | Controls, cards, and the default raised `Surface` |
| Medium | `shadow-md` | Menus, popovers, and compact overlays |
| High | `shadow-lg` | Dialogs, sheets, toasts, and prominent overlays |
| Floating | `shadow-xl` | Windows, floating `Surface` containers, and other desktop layers |

`Surface` exposes the foundation through semantic elevation variants:
`flat` has no shadow, `raised` uses `shadow-sm`, and `floating` uses
`shadow-xl`. `WindowSurface` uses `shadow-xl`.

A few components own tightly scoped shadows that are not reusable elevation
levels: the tooltip's compact dark shadow, selection/focus rings expressed as
zero-offset shadows, and small status indicators. Keep those effects local to
the component contract.

See → [Surface](../components/os-portfolio/surface.md)

---

## Transparency

Apply `.portfolio-surface-translucent` only to windows, Dock containers, menus,
and other surfaces that should respond to the shared preference. It changes the
surface background alpha; it does not reduce the opacity of children.

| State | Result |
|---|---|
| Default | `--accessibility-transparency: 0.2` fallback |
| `data-transparency-enabled` | Reads `--accessibility-transparency` from 0 through 0.7 |
| `data-no-transparency` | Forces the participating surface fully opaque |
| Low- or high-contrast theme | Forces participating surfaces fully opaque |

Do not set `opacity` on a surface to create transparency. That also fades text,
icons, controls, and borders.

See → [Transparency surfaces](../patterns/transparency-surfaces.md)

---

## Backdrop blur

The translucent-surface utility uses `--surface-blur`, with a `12px` fallback,
and applies `saturate(1.4)` with the blur. Both the WebKit-prefixed and standard
`backdrop-filter` declarations are required.

| State | Result |
|---|---|
| Transparency active | `blur(var(--surface-blur, 12px)) saturate(1.4)` |
| `data-no-blur` | Removes backdrop blur without changing transparency |
| `data-no-transparency` | The product also sets `data-no-blur`; the saved blur value is preserved |
| Low- or high-contrast theme | Package CSS automatically removes blur |

Blur is subordinate to transparency: the product may preserve a saved blur
preference while effective blur is unavailable. Contrast themes must display
participating surfaces as opaque and blur-free without discarding the user's
saved Standard-mode settings.

---

## Performance and accessibility

- Keep backdrop blur on a limited number of large shell surfaces.
- Animate `transform` or `opacity`, not layout-affecting properties, on
  translucent surfaces.
- Verify text and control contrast against varied wallpaper or content.
- Do not use a text shadow, scrim, or translucent plate to manufacture contrast
  for desktop introduction text.
- Shadows are supporting cues only; borders, position, and semantics must still
  communicate separation.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Choose the lowest existing shadow level that communicates the needed depth | Invent a new shadow for each surface |
| Use `Surface` elevation variants when the semantic container fits | Re-create `Surface` elevation with ad hoc classes |
| Change background alpha through `.portfolio-surface-translucent` | Lower the opacity of a whole surface |
| Preserve saved transparency and blur preferences when effects are temporarily unavailable | Clear preferences when contrast mode is enabled |
| Keep contrast themes opaque and blur-free | Allow blur or translucency to weaken a contrast theme |