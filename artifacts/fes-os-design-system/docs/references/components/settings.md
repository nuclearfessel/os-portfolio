# Settings primitives

Source: `src/components/ui/settings.tsx`
Preview page: `fes-os-settings` in the living style guide

## Purpose

Visual-only primitives for settings-style windows. They provide structure,
interaction semantics, and ARIA attributes. **Product behavior stays in the
consuming app**: localStorage persistence, wallpaper updates, desktop
orchestration, and "Save State as Default" / "Reset Desktop" belong there, not
here.

---

## Component reference

### SettingsNavSection / SettingsNavItem

Sidebar navigation landmark + individual nav buttons.

```tsx
import { SettingsNavSection, SettingsNavItem } from '@workspace/fes-os-design-system/components/ui/settings';

<SettingsNavSection label="Settings sections">
  <SettingsNavItem
    active={section === 'personalization'}
    aria-current={section === 'personalization' ? 'page' : undefined}
    icon={<Sun size={14} />}
    onClick={() => setSection('personalization')}
  >
    Personalization
  </SettingsNavItem>
  <SettingsNavItem
    active={section === 'accessibility'}
    aria-current={section === 'accessibility' ? 'page' : undefined}
    icon={<Eye size={14} />}
    onClick={() => setSection('accessibility')}
  >
    Accessibility
  </SettingsNavItem>
</SettingsNavSection>
```

**Accessibility:** `<nav aria-label="…">` landmark. Active item carries
`aria-current="page"`. Focus ring uses the `ring-ring` Tailwind utility
(maps to `--color-ring`, the primary brand color) in both themes.
Inactive hover uses `bg-muted`. Active state uses `bg-primary/10 text-primary`.

---

### SettingsToggleRow

Accessible boolean preference control — label row with a pill switch.

```tsx
import { SettingsToggleRow } from '@workspace/fes-os-design-system/components/ui/settings';

<SettingsToggleRow
  id="a11y-transparency"
  label="Transparency effects"
  description="Enables transparency across windows, the dock, menus, and stickies."
  checked={prefs.windowTransparency}
  onChange={(v) => updatePrefs({ windowTransparency: v })}
  data-testid="settings-a11y-transparency"
/>
```

**Accessibility:** The pill `<button>` carries `role="switch"` and
`aria-checked`. The surrounding `<label>` links by `htmlFor` so clicking the
label row also toggles. Disabled state uses `opacity-45 pointer-events-none`.

**Do:** Pass `disabled` when a feature is unavailable (e.g. transparency when a
contrast theme is active). **Don't:** hide the row — keep it visible but inert.

---

### SettingsSliderGroup

Conditional range slider with a live percentage output.

```tsx
import { SettingsSliderGroup } from '@workspace/fes-os-design-system/components/ui/settings';

// Render level controls in Personalization when the master toggle is on:
{prefs.windowTransparency && (
  <>
    <SettingsSliderGroup
      id="personalization-window-transparency"
      label="Window transparency"
      value={prefs.transparencyLevel}
      min={0}
      max={70}
      step={5}
      onChange={(v) => updatePrefs({ transparencyLevel: v })}
      guidanceStart="Subtle"
      guidanceEnd="More transparent"
    />
    {prefs.blurEffects && (
      <SettingsSliderGroup
        id="personalization-blur"
        label="Blur"
        value={prefs.blurLevel}
        min={0}
        max={24}
        step={2}
        unit="px"
        onChange={(v) => updatePrefs({ blurLevel: v })}
        guidanceStart="Sharp"
        guidanceEnd="More blurred"
      />
    )}
    <SettingsSliderGroup
      id="personalization-sticky-transparency"
      label="Sticky transparency"
      value={prefs.stickyTransparencyLevel}
      min={0}
      max={70}
      step={5}
      onChange={(v) => updatePrefs({ stickyTransparencyLevel: v })}
      guidanceStart="Subtle"
      guidanceEnd="More transparent"
    />
  </>
)}
```

**Accessibility:** The `<output>` element carries `aria-live="polite"` so screen
readers announce the current value when it changes. Range guidance labels are
`aria-hidden`. The `<input type="range">` receives both an `aria-label` (from
the `label` prop) and optionally an `ariaValueText` for a human-readable
announcement.

**State contract:** The consuming app reads the slider's numeric value (0–70)
and converts it to the CSS variable `--accessibility-transparency` on `:root`:

```js
document.documentElement.style.setProperty(
  '--accessibility-transparency',
  String(prefs.transparencyLevel / 100)   // unitless alpha, range 0–0.7
);
document.documentElement.setAttribute('data-transparency-enabled', '');
document.documentElement.style.setProperty('--surface-blur', `${prefs.blurLevel}px`);
```

Only surfaces carrying the `.fes-surface-translucent` package class (defined in
`src/index.css`) respond to this variable.

---

### SettingsSegmentedChoice

Exclusive option group — Less / Default / More animation speed or any
comparable set of three options.

```tsx
import { SettingsSegmentedChoice } from '@workspace/fes-os-design-system/components/ui/settings';

<SettingsSegmentedChoice
  groupLabel="Animation speed"
  options={[
    { value: 'less',    label: 'Less',    description: 'Slower, reduced intensity' },
    { value: 'default', label: 'Default', description: 'Standard timing' },
    { value: 'more',    label: 'More',    description: 'Faster, snappier motion' },
  ]}
  value={prefs.animationSpeed}
  onChange={(v) => updatePrefs({ animationSpeed: v as AnimationSpeed })}
  data-testid="settings-anim-speed"
/>
```

**Accessibility:** `role="radiogroup"` wrapper; each pill `<button>` carries
`role="radio"` and `aria-checked`. `description` is exposed via the button's
`title` attribute (hover tooltip for mouse users).

**State contract (consuming app):**

```js
// 'less' or 'more' → set attribute
document.documentElement.setAttribute('data-anim-speed', prefs.animationSpeed);
// 'default' → remove attribute (no attribute = default speed)
document.documentElement.removeAttribute('data-anim-speed');
```

The package stylesheet applies duration overrides automatically when the
attribute is present:
- `data-anim-speed="less"`: `animation-duration: 2s`, `transition-duration: 0.6s`
- `data-anim-speed="more"`: `animation-duration: 0.4s`, `transition-duration: 0.12s`

---

### SettingsContrastCard

Selectable contrast-theme card with a fixed-palette preview miniature.

```tsx
import { SettingsContrastCard } from '@workspace/fes-os-design-system/components/ui/settings';

// Wrap in a radiogroup:
<div role="radiogroup" aria-label="Contrast theme">
  <SettingsContrastCard
    variant="standard"
    label="Standard"
    description="Default appearance"
    selected={prefs.contrastTheme === 'none'}
    onSelect={() => updatePrefs({ contrastTheme: 'none' })}
    data-testid="settings-a11y-contrast-none"
  />
  <SettingsContrastCard
    variant="low"
    label="Low contrast"
    description="Reduced visual harshness"
    selected={prefs.contrastTheme === 'low'}
    onSelect={() => updatePrefs({ contrastTheme: 'low' })}
    data-testid="settings-a11y-contrast-low"
  />
  <SettingsContrastCard
    variant="high"
    label="High contrast"
    description="Maximum black/white separation"
    selected={prefs.contrastTheme === 'high'}
    onSelect={() => updatePrefs({ contrastTheme: 'high' })}
    data-testid="settings-a11y-contrast-high"
  />
</div>
```

**Preview colours:**
- **Standard** variant: fixed inline values showing a dark desktop appearance
  (always looks the same regardless of app theme).
- **Low** variant: references `--contrast-*` CSS custom properties defined
  unconditionally on `:root` in the package stylesheet.
- **High** variant: references `--hc-*` CSS custom properties defined
  unconditionally on `:root` in the package stylesheet.

All three are theme-independent, so the card always shows what each mode will
look like before the user selects it.

**Accessibility:** Each card is a `<button>` with `role="radio"` and
`aria-checked`. The parent `<div role="radiogroup">` provides group context.

**State contract (consuming app):**

```js
// 'low' or 'high' → set attribute
document.documentElement.setAttribute('data-contrast', prefs.contrastTheme);
// 'none' (Standard) → remove attribute
document.documentElement.removeAttribute('data-contrast');
```

When `data-contrast` is present, the package stylesheet re-maps the semantic
CSS variables (`--background`, `--foreground`, `--card`, `--primary`, `--ring`,
etc.) to the fixed palette. Every package component using those semantic tokens
inherits the contrast-mode appearance automatically — no per-component override
needed.

---

### SettingsColorPreset

Selectable solid-color wallpaper preset block.

Two presets ship: **Light default** `#E8F0EC` and **Dark default** `#111326`.
Both values are documented in `tokens.json` under `color.fixed.wallpaperLightDefault`
and `color.fixed.wallpaperDarkDefault`, and are also available as CSS custom
properties `--fixed-wallpaper-light` and `--fixed-wallpaper-dark` on `:root`.

```tsx
import { SettingsColorPreset } from '@workspace/fes-os-design-system/components/ui/settings';

<SettingsColorPreset
  color="#e8f0ec"
  label="Light default, #e8f0ec"
  name="Light default"
  selected={currentWallpaper.color === '#e8f0ec'}
  onSelect={() => setWallpaperColor('#e8f0ec')}
  data-testid="settings-color-preset-light"
/>
```

**Custom-color coexistence:** The component does not coordinate with other
presets or a custom color picker — it only reflects whether `selected` is true.
The consuming app owns exclusion logic:
- Selecting a preset → sets its hex color and deselects any custom value.
- Picking a custom color → pass `selected={false}` to all presets.

**Focus/selected states:**
- Focus ring: `outline: 2px solid var(--color-ring)` at `outline-offset: 4px`.
- Selected swatch: `border-2 border-primary` + subtle primary shadow ring.
- Check mark color: auto-selected via luminance heuristic (`isLightColor()`).
  Light swatches get a dark primary-green mark; dark swatches get white.

---

### SettingsDivider

Horizontal rule separating settings sections.

```tsx
import { SettingsDivider } from '@workspace/fes-os-design-system/components/ui/settings';

<SettingsDivider />
```

Uses `border-border/50` so it adapts to both light and dark themes.

---

### SettingsSectionHeader

Label + optional description header for a settings sub-section.

```tsx
import { SettingsSectionHeader } from '@workspace/fes-os-design-system/components/ui/settings';

<SettingsSectionHeader
  label="Display"
  description="Adjust how elements appear on screen."
/>
```

---

## State contracts

The package stylesheet (`src/index.css`) ships CSS that reads these attributes
from the shell element. The consuming app writes/removes them; the package rules
react automatically.

| Attribute / class / variable | What the consuming app does | What the package CSS does |
| --- | --- | --- |
| `.fes-scrollbar-window` | Add to each window shell | Keeps tracks transparent and fades styled thumbs in while the window is hovered or contains focus |
| `data-always-scrollbars` | Set on shell when `alwaysShowScrollbars === true` | Keeps the same `.fes-scrollbar-window` thumbs visible without changing their style or adding a gray track |
| `.fes-surface-translucent` | Add to window/dock/menu elements | Applies `backdrop-filter: blur(12px)` and uses `--accessibility-transparency` for background alpha |
| `data-no-transparency` | Set on shell when the global transparency switch is false | Removes `backdrop-filter` and forces opaque backgrounds on all participating surfaces |
| `data-transparency-enabled` + `--accessibility-transparency` (0–0.7) | Set attribute + window CSS var on `:root` when the global transparency switch is true | Window, Dock, and menu surfaces use the window alpha |
| `--sticky-transparency` (0–0.7) | Set the sticky CSS var on `:root` from the Personalization slider | Sticky surfaces use an independent background alpha |
| `data-no-animations` | Set on shell when `uiAnimations === false` | Collapses animation/transition durations to `0.001ms`, `animation-iteration-count: 1` on all descendants |
| `data-fast-ui` | Set on shell for maximum motion reduction | `animation: none`, `transition: none`, `transition-delay: 0s`, `scroll-behavior: auto` on all descendants |
| `data-anim-speed="less"` | Set when animations on + speed = 'less' | `animation-duration: 2s`, `transition-duration: 0.6s` on all descendants |
| `data-anim-speed="more"` | Set when animations on + speed = 'more' | `animation-duration: 0.4s`, `transition-duration: 0.12s` on all descendants |
| `data-contrast="low"` | Set on `:root` when `contrastTheme === 'low'` | Re-maps **all** semantic channel vars (background, foreground, card, primary, accent, destructive, chart-1–5, sidebar-primary/accent/ring, border, input, ring) to `--contrast-*-hsl` values. Also forces `.fes-surface-translucent` opaque. No per-component override needed for package components. |
| `data-contrast="high"` | Set on `:root` when `contrastTheme === 'high'` | Re-maps all semantic channel vars to `--hc-*-hsl` values (black/white/yellow/cyan). Also forces `.fes-surface-translucent` opaque. 3px yellow `var(--hc-focus)` focus rings globally via `*:focus-visible`. |

**Scope of translucency suppression under contrast modes:** `[data-contrast]` forces only `.fes-surface-translucent` elements opaque. Inline `rgba()` backgrounds or Tailwind `bg-*/alpha` utilities set directly by the consuming app are not automatically removed — the app should avoid alpha backgrounds when a contrast theme is active.

---

## Fixed palette tokens

Located at `color.fixed` in `tokens.json`. Generated by `scripts/build-tokens.mjs` — do not edit values in the stylesheet directly.

Available to:
- **Web consumers**: two CSS custom properties per token on `:root` in `src/index.css`:
  - **Raw hex var** (`--contrast-bg`, `--hc-bg`, `--fixed-wallpaper-light`, …) — for direct `background` or `color` use and component previews.
  - **HSL channel var** (`--contrast-bg-hsl`, `--hc-bg-hsl`, …) — for assignment into semantic channel vars consumed as `hsl(var(--background))`. Using the channel form avoids producing invalid `hsl(#hexvalue)` output.
- **Mobile/portable consumers**: `tokens.color.fixed` in `src/generated/tokens.tsx` (hex strings).

| Token key | Hex | Raw CSS var | HSL channel var | Use |
| --- | --- | --- | --- | --- |
| `wallpaperLightDefault` | `#E8F0EC` | `--fixed-wallpaper-light` | `--fixed-wallpaper-light-hsl` | Light-mode solid wallpaper preset |
| `wallpaperDarkDefault` | `#111326` | `--fixed-wallpaper-dark` | `--fixed-wallpaper-dark-hsl` | Dark-mode solid wallpaper preset |
| `lowContrastBg` | `#282a38` | `--contrast-bg` | `--contrast-bg-hsl` | Low-contrast background |
| `lowContrastSurface` | `#31334a` | `--contrast-surface` | `--contrast-surface-hsl` | Low-contrast window/card surface |
| `lowContrastSurface2` | `#3a3c52` | `--contrast-surface-2` | `--contrast-surface-2-hsl` | Low-contrast elevated surface |
| `lowContrastText` | `#c4c8da` | `--contrast-text` | `--contrast-text-hsl` | Low-contrast body text |
| `lowContrastTextMuted` | `#8e92a8` | `--contrast-text-muted` | `--contrast-text-muted-hsl` | Low-contrast secondary text |
| `lowContrastAccent` | `#8fa8c8` | `--contrast-accent` | `--contrast-accent-hsl` | Low-contrast interactive accent |
| `highContrastBg` | `#000000` | `--hc-bg` | `--hc-bg-hsl` | High-contrast background |
| `highContrastSurface` | `#0d0d0d` | `--hc-surface` | `--hc-surface-hsl` | High-contrast window surface |
| `highContrastSurface2` | `#1a1a1a` | `--hc-surface-2` | `--hc-surface-2-hsl` | High-contrast elevated surface |
| `highContrastText` | `#ffffff` | `--hc-text` | `--hc-text-hsl` | High-contrast body text |
| `highContrastTextMuted` | `#e0e0e0` | `--hc-text-muted` | `--hc-text-muted-hsl` | High-contrast secondary text |
| `highContrastAccent` | `#ffff00` | `--hc-accent` | `--hc-accent-hsl` | High-contrast accent (19.6:1 on black) |
| `highContrastAccentAlt` | `#00ffff` | `--hc-accent-alt` | — (direct use only) | High-contrast alternate accent |
| `highContrastBorder` | `#ffffff` | `--hc-border` | `--hc-border-hsl` | High-contrast border |
| `highContrastFocus` | `#ffff00` | `--hc-focus` | `--hc-focus-hsl` | High-contrast focus ring color |
