# Pattern: Transparency Surfaces

**Preview:** `fes-os-settings` (transparency controls)

---

## Intent

Windows, the Dock, and menus can carry frosted-glass translucency — a backdrop blur that shows the desktop content beneath. The user controls this via the accessibility preferences. The design system provides the CSS class that responds to user preferences; the consuming product applies that class to relevant surfaces.

---

## The utility class

```css
.fes-surface-translucent
```

Apply this class to any surface that should respond to the transparency preference.

---

## How the class behaves

| Shell state | What the CSS does |
|---|---|
| No attribute (default) | Moderate translucency with backdrop-filter blur(12px) + `--accessibility-transparency: 0.2` |
| `data-transparency-enabled` + `--accessibility-transparency` | Uses the variable value (0–0.7) for background alpha; keeps backdrop-filter |
| `data-no-transparency` | Forces fully opaque background; removes backdrop-filter |
| `data-contrast="low"` or `data-contrast="high"` | Forces fully opaque (same as `data-no-transparency`) |

---

## Applying to surfaces

```tsx
// Window
<WindowSurface className="fes-surface-translucent overflow-hidden">
  …
</WindowSurface>

// Dock container
<nav className="fes-surface-translucent rounded-2xl border border-border p-2">
  …
</nav>

// Menu panel
<ContextMenuSurface className="fes-surface-translucent">
  …
</ContextMenuSurface>
```

The `fes-surface-translucent` class overrides the surface's `background-color` to use an alpha derived from `--accessibility-transparency`. Do not also set an opaque `bg-card` on the same element — the class handles background color.

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

// Disable
document.documentElement.setAttribute('data-no-transparency', '');
document.documentElement.style.removeProperty('--accessibility-transparency');
document.documentElement.removeAttribute('data-transparency-enabled');
```

---

## State ownership

| Concern | Owner |
|---|---|
| Which surfaces receive `fes-surface-translucent` | Consuming product (product decides what should be glassy) |
| `data-transparency-enabled` attribute | Consuming product |
| `--accessibility-transparency` CSS variable | Consuming product |
| `data-no-transparency` attribute | Consuming product |
| When contrast theme forces opaque | Package CSS (automatic) |

---

## Performance

`backdrop-filter: blur()` is GPU-composited — use `transform` or `opacity` for animations on translucent surfaces, not layout-affecting properties.

---

## Accessibility checklist

- [ ] Translucent surfaces maintain readable text contrast against the backdrop.
- [ ] Transparency is disabled when any contrast theme is active (automatic via package CSS).
- [ ] The transparency preference can be toggled and its effect is immediate.
- [ ] When `data-no-transparency` is set, no backdrop blur appears on any `.fes-surface-translucent` element.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Apply `fes-surface-translucent` to windows, Dock, and menus | Apply it to body text or form elements |
| Disable transparency when a contrast theme is active | Allow blur + high contrast simultaneously |
| Test readability on the desktop background color | Only test translucency on a white or black background |
| Use the CSS variable approach for alpha | Set a hardcoded `rgba()` background on translucent surfaces |
