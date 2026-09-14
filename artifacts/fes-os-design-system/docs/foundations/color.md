# Color

**Living preview:** `color-roles`
**Token source:** `tokens.json` → `color`
**Generated output:** `src/index.css` (CSS custom properties) · `src/generated/tokens.tsx` (hex object)

---

## Overview

The color system is built on semantic roles rather than raw palette values. Every UI surface, text element, border, and interactive control references a semantic token. This means a single theme switch — or a contrast-mode attribute — updates all components automatically.

Tokens exist in two coordinated themes (**light** and **dark**) plus a **fixed** palette used by accessibility contrast modes and wallpaper presets.

---

## Semantic roles

### Background & surface

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#eaf3ef` | `#111326` | Page / desktop canvas background |
| `foreground` | `#17233a` | `#e8eaf4` | Default body text on `background` |
| `card` | `#f7fbf9` | `#20233d` | Window surfaces, cards, panels |
| `card-foreground` | `#17233a` | `#e8eaf4` | Text on `card` |
| `popover` | `#f2f8f5` | `#1d2036` | Menus, tooltips, command palettes |
| `popover-foreground` | `#17233a` | `#e8eaf4` | Text on `popover` |
| `sidebar` | `#e2ece8` | `#181b30` | Sidebar background |
| `sidebar-foreground` | `#17233a` | `#e8eaf4` | Sidebar text |

### Interactive & brand

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` | `#0b665d` (teal) | `#e4ff5b` (lime) | Primary actions, active states, focus rings, section labels |
| `primary-foreground` | `#f7fbf9` | `#111326` | Text on primary backgrounds |
| `secondary` | `#dceae5` | `#2b2f4a` | Secondary action backgrounds |
| `secondary-foreground` | `#17233a` | `#e8eaf4` | Text on secondary backgrounds |
| `muted` | `#e2ece8` | `#2b2f4a` | Muted/subtle backgrounds |
| `muted-foreground` | `#536a72` | `#aeb2cb` | Secondary / helper text |
| `accent` | `#c54f48` (red-orange) | `#ff8d79` (salmon) | Accent emphasis, not primary actions |
| `accent-foreground` | `#ffffff` | `#111326` | Text on accent |

### Status

| Token | Light | Dark | Use |
|---|---|---|---|
| `destructive` | `#b63f4d` | `#e46765` | Destructive actions, error states |
| `destructive-foreground` | `#ffffff` | `#111326` | Text on destructive |

### Borders & inputs

| Token | Light | Dark | Use |
|---|---|---|---|
| `border` | `#a9c5bd` | `#444967` | Default borders on all surfaces |
| `input` | `#8db3aa` | `#4b526d` | Input field border |
| `ring` | `#0b665d` | `#e4ff5b` | Focus ring color (matches `primary`) |

### Charts

| Token | Light | Dark | Use |
|---|---|---|---|
| `chart-1` | `#0b665d` | `#e4ff5b` | Primary data series |
| `chart-2` | `#c54f48` | `#ff8d79` | Second series |
| `chart-3` | `#287f8f` | `#86d9ee` | Third series |
| `chart-4` | `#6f5ca8` | `#b996ed` | Fourth series |
| `chart-5` | `#b77824` | `#f5b85c` | Fifth series |

### Sidebar system

Sidebar tokens mirror the main palette but allow independent theming of sidebar panels. Prefix: `sidebar-`.

---

## Fixed palette (contrast & wallpaper)

These values never change with the app theme. They are used by contrast mode previews and wallpaper presets.

See [Contrast override behavior](../patterns/contrast-override.md) and the [fixed palette token table](../references/components/settings.md#fixed-palette-tokens) for the full list.

| Group | CSS var prefix | Purpose |
|---|---|---|
| Wallpaper presets | `--fixed-wallpaper-*` | Solid-color desktop background defaults |
| Low-contrast palette | `--contrast-*` | `data-contrast="low"` theme override |
| High-contrast palette | `--hc-*` | `data-contrast="high"` theme override |

---

## How tokens are consumed (web)

Tokens are generated as HSL channel variables so they can be used inside `hsl()`:

```css
/* In src/index.css */
:root {
  --primary: 174 80.5% 22.2%;   /* H S% L% */
}
```

In Tailwind utilities:
```css
/* Mapped in @theme inline block */
--color-primary: hsl(var(--primary));
```

In component classNames:
```tsx
className="bg-primary text-primary-foreground"
```

In inline styles, use the raw CSS variable form:
```tsx
style={{ color: 'hsl(var(--primary))' }}
```

---

## Contrast-mode override

When the consuming app sets `data-contrast="low"` or `data-contrast="high"` on the root element, the package stylesheet re-maps all semantic channel variables to the fixed low- or high-contrast palette. Every component that references semantic tokens updates automatically — no per-component override is needed.

See → [Contrast override behavior](../patterns/contrast-override.md)

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use semantic tokens (`bg-primary`, `text-foreground`) | Use hardcoded hex values in components |
| Reference the same semantic token in both themes | Create theme-specific utilities |
| Use `primary` for the single main action per view | Apply `primary` to more than one competing call to action |
| Reserve `accent` for secondary emphasis | Use `accent` as a second primary |
| Use `destructive` only for irreversible, harmful actions | Apply `destructive` to warnings or caution states |
| Use `ring` for focus rings | Use custom colors for focus that fail contrast checks |
