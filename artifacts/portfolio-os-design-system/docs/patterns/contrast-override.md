# Pattern: Contrast Override Behavior

**Preview:** `portfolio-os-settings` (SettingsContrastCard), `accessibility`

---

## Intent

Three contrast themes are available — Standard (default), Low Contrast, and High Contrast. Low and High Contrast are independent presentation modes, not variants of the regular light or dark theme. When a non-standard theme is active, the package stylesheet re-maps all semantic CSS channel variables to a fixed palette, updating every component's appearance automatically.

---

## How it works

The consuming app sets `data-contrast` on `:root`. The package CSS responds:

```js
// Standard (default) — no attribute
document.documentElement.removeAttribute('data-contrast');

// Low contrast
document.documentElement.setAttribute('data-contrast', 'low');

// High contrast
document.documentElement.setAttribute('data-contrast', 'high');
```

The package stylesheet then overwrites the HSL channel variables used by `hsl(var(--background))`, `hsl(var(--foreground))`, `hsl(var(--primary))`, etc. Every design system component that uses semantic tokens is updated automatically.

---

## Fixed palettes

### Low contrast palette (`data-contrast="low"`)

Softer dark theme — reduced visual harshness.

| Semantic role | Fixed value | CSS var |
|---|---|---|
| Background | `#282a38` | `--contrast-bg` |
| Card / surface | `#31334a` | `--contrast-surface` |
| Elevated surface | `#3a3c52` | `--contrast-surface-2` |
| Body text | `#c4c8da` | `--contrast-text` |
| Secondary text | `#8e92a8` | `--contrast-text-muted` |
| Accent / interactive | `#8fa8c8` | `--contrast-accent` |

### High contrast palette (`data-contrast="high"`)

Maximum black/white separation.

| Semantic role | Fixed value | CSS var |
|---|---|---|
| Background | `#000000` | `--hc-bg` |
| Card / surface | `#0d0d0d` | `--hc-surface` |
| Body text | `#ffffff` | `--hc-text` |
| Accent | `#ffff00` | `--hc-accent` (19.6:1 on black) |
| Alt accent | `#00ffff` | `--hc-accent-alt` |
| Border | `#ffffff` | `--hc-border` |
| Focus ring | `#ffff00` | `--hc-focus` |

In high contrast mode, `*:focus-visible` receives a `3px yellow outline` globally.
Text-entry surfaces that already provide an unmistakable caret and active prompt,
such as the Portfolio OS Terminal command input, may suppress that outer outline
to avoid drawing a box around the typing area. Do not remove focus indicators
from buttons or other controls.

---

## Side effects

When any contrast theme is active:
- `portfolio-surface-translucent` elements are forced fully opaque (backdrop blur removed).
- The consuming app should also disable the transparency toggle row (pass `disabled`).
- Regular Light and Dark controls and wallpaper controls remain visible but disabled.
- The saved regular theme and wallpaper preferences remain unchanged so Standard restores them exactly.
- The product must remove or neutralize regular-theme presentation classes that can override the fixed contrast palette.
- Non-visual theme entry points, including Terminal commands, must report that Light and Dark are disabled instead of comparing against the saved regular theme.
- Branded Dock app tiles retain the same contrast-safe tile and glyph treatment as their matching desktop launchers; the Dock active marker communicates state without replacing app identity.
- Icons inside an active yellow Settings navigation item inherit its black foreground. Broad contrast text rules must not force those nested icons white.

---

## Scope of override

The `data-contrast` attribute re-maps semantic channel variables — so every package component using those semantic tokens updates automatically. Exceptions:

- Inline `rgba()` backgrounds or Tailwind alpha utilities set **directly** by the consuming product (not via semantic tokens) are **not** automatically updated. The consuming app should avoid alpha backgrounds when contrast themes are active.
- `SettingsContrastCard` preview miniatures use fixed inline values / unconditional CSS vars — they show the correct appearance regardless of which theme is active.

---

## Accessibility checklist

- [ ] High contrast mode is visually distinct from the standard theme — confirmed manually.
- [ ] Focus rings are visible in all three modes (3px yellow in high contrast).
- [ ] Transparency is disabled when any contrast theme is active.
- [ ] All text meets WCAG AA contrast ratios in each mode.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use semantic tokens so contrast mode updates components automatically | Hardcode colors in components |
| Disable transparency toggle when contrast is active | Allow translucency and contrast to coexist |
| Preserve the saved regular theme while using an independent contrast presentation baseline | Leave the regular light-theme class active underneath contrast mode |
| Keep regular theme controls visible but disabled | Let users switch Light or Dark while contrast mode is active |
| Reject Terminal `theme light` and `theme dark` commands with the contrast-mode disabled message | Report that the saved regular theme is already active |
| Keep matching Dock and desktop launcher app icons visually consistent | Replace branded Dock app tiles with a generic active fill |
| Make active Settings labels and icons black on yellow | Let a nested icon retain a white foreground on the active yellow surface |
| Test all interactive states in high-contrast mode | Only test the base reading state |
| Use `--hc-focus` (`#ffff00`) for focus in high contrast | Override focus rings with custom colors in high contrast |
