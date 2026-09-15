# Pattern: Transparency Surfaces

**Preview:** `portfolio-os-settings` (transparency controls)

---

## Intent

Windows, the Dock, menus, and stickies can carry translucency and backdrop blur. Accessibility owns system-wide Transparency effects and Blur effects switches; Blur is available only while Transparency is on. Personalization owns separate window and sticky transparency levels plus one shared blur level. The design system provides the primitives that respond to these preferences, while the consuming product applies them to relevant surfaces.

---

## The utility class

```css
.portfolio-surface-translucent
```

Apply this class to any surface that should respond to the transparency preference.

---

## How the class behaves

| Shell state | What the CSS does |
|---|---|
| No attribute (default) | Moderate translucency with `--accessibility-transparency: 0.2` and `--surface-blur: 12px` fallbacks |
| `data-transparency-enabled` + `--accessibility-transparency` | Uses the variable value (0–0.7) for background alpha |
| `data-no-transparency` | Forces fully opaque background, disables effective blur, and preserves the saved blur preference |
| `data-no-blur` | Removes backdrop blur without changing transparency |
| `data-contrast="low"` or `data-contrast="high"` | Forces fully opaque and removes backdrop blur |

---

## Applying to surfaces

```tsx
// Window
<WindowSurface className="portfolio-surface-translucent overflow-hidden">
  …
</WindowSurface>

// Dock container
<nav className="portfolio-surface-translucent rounded-2xl border border-border p-2">
  …
</nav>

// Menu panel
<ContextMenuSurface className="portfolio-surface-translucent">
  …
</ContextMenuSurface>
```

The `portfolio-surface-translucent` class overrides the surface's `background-color` to use an alpha derived from `--accessibility-transparency`. Do not also set an opaque `bg-card` on the same element — the class handles background color.

Apply the window transparency level to every Dock container used at responsive
breakpoints, including desktop, tablet-menu, and mobile-menu surfaces. Change
the surface background alpha rather than the container's `opacity`; Dock items,
desktop launcher tiles, glyphs, and labels must remain fully opaque.

When `data-no-transparency` is present, every participating surface must become
opaque together: windows and headers, every Dock variant, menus and submenus,
Settings navigation, and sticky-note surfaces. Do not leave individual
translucent surfaces dependent on their default alpha.

---

## Consumer responsibility

The consuming app sets the DOM state that the package CSS reads:

```js
// Enable with a specific level (0–70, maps to alpha 0–0.7)
document.documentElement.setAttribute('data-transparency-enabled', '');
document.documentElement.style.setProperty(
  '--accessibility-transparency',
  String(prefs.transparencyLevel / 100)
);
document.documentElement.style.setProperty(
  '--surface-blur',
  `${prefs.blurLevel}px`
);
document.documentElement.setAttribute('data-blur-enabled', '');
document.documentElement.style.setProperty(
  '--sticky-transparency',
  String(prefs.stickyTransparencyLevel / 100)
);

// Disable
document.documentElement.setAttribute('data-no-transparency', '');
document.documentElement.style.removeProperty('--accessibility-transparency');
document.documentElement.removeAttribute('data-transparency-enabled');

// Disable effective blur when transparency is off or Blur effects is off
document.documentElement.setAttribute('data-no-blur', '');
document.documentElement.style.removeProperty('--surface-blur');
```

---

## State ownership

| Concern | Owner |
|---|---|
| Which surfaces receive `portfolio-surface-translucent` | Consuming product (product decides what should be glassy) |
| `data-transparency-enabled` attribute | Consuming product |
| `--accessibility-transparency` CSS variable | Consuming product |
| `data-no-transparency` attribute | Consuming product |
| `data-no-blur` attribute | Consuming product |
| `--surface-blur` CSS variable | Consuming product |
| When contrast theme forces opaque and blur-free | Package CSS (automatic) |

---

## Performance

`backdrop-filter: blur()` is GPU-composited — use `transform` or `opacity` for animations on translucent surfaces, not layout-affecting properties.

---

## Accessibility checklist

- [ ] Translucent surfaces maintain readable text contrast against the backdrop.
- [ ] Transparency and blur are disabled when any contrast theme is active (automatic via package CSS).
- [ ] The transparency preference can be toggled and its effect is immediate.
- [ ] Turning transparency off disables effective blur without discarding the saved Blur preference.
- [ ] Turning transparency back on restores the saved Blur preference.
- [ ] When `data-no-blur` is set, no backdrop blur appears on any `.portfolio-surface-translucent` element.
- [ ] Desktop, tablet, and mobile Dock surfaces all respond to the window transparency level.
- [ ] Dock items and desktop launcher icons remain fully opaque at every transparency level.
- [ ] Turning transparency off makes every participating surface fully opaque.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Apply `portfolio-surface-translucent` to windows, Dock, and menus | Apply it to body text or form elements |
| Disable transparency when a contrast theme is active | Allow blur + high contrast simultaneously |
| Test readability on the desktop background color | Only test translucency on a white or black background |
| Use the CSS variable approach for alpha | Set a hardcoded `rgba()` background on translucent surfaces |
| Change surface background alpha while keeping children opaque | Set `opacity` on a Dock or launcher container |
