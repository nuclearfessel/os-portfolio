# Spacing & Radius

**Living preview:** `spacing-radius`
**Token source:** `tokens.json` → `spacing`, `radius`
**Generated output:** `src/index.css`

---

## Spacing

| Token | Value | Tailwind step |
|---|---|---|
| `spacing.base` | `0.25rem` (4px) | `1` = 4px, `2` = 8px, `4` = 16px, etc. |

All Tailwind spacing utilities (`p-`, `m-`, `gap-`, `space-`, `w-`, `h-`) multiply this base step. The system uses the standard Tailwind scale — do not use arbitrary values like `p-[14px]`.

### Common spacing patterns

| Context | Typical values |
|---|---|
| Component internal padding (buttons, chips) | `px-3 py-1.5` / `px-4 py-2` |
| Card / surface padding | `p-4`, `p-5`, `p-6` |
| Section gaps | `gap-3`, `gap-4`, `gap-6` |
| Inline icon-to-label gap | `gap-1.5`, `gap-2` |
| Stack within a form | `gap-4`, `gap-6`, `gap-7` |
| Settings row padding | `px-3 py-2.5` |
| Dock item internal padding | `p-3`, `p-4` |

---

## Radius

| Token | Value | CSS variable | Tailwind class |
|---|---|---|---|
| `radius.base` | `0.75rem` | `--radius` | `rounded-lg` |
| `radius-sm` | `calc(var(--radius) - 4px)` = 0.5rem | — | `rounded-sm` |
| `radius-md` | `calc(var(--radius) - 2px)` = 0.625rem | — | `rounded-md` |
| `radius-lg` | `var(--radius)` = 0.75rem | — | `rounded-lg` |
| `radius-xl` | `calc(var(--radius) + 4px)` = 1rem | — | `rounded-xl` |

### Radius application guide

| Use | Class |
|---|---|
| Cards, windows, main surfaces | `rounded-xl` or `rounded-lg` |
| Buttons, form controls, chips | `rounded-md` |
| Badges, tags | `rounded-md` |
| Avatar images | `rounded-full` |
| Tooltip / popover surfaces | `rounded-sm` |
| Dock items | `rounded-lg` |
| Sticky note surface | `rounded-lg` |
| Settings nav items | `rounded-md` |
| Segmented choice chips | `rounded-full` |
| Color preset swatches | `rounded-md` |
| Contrast card preview miniatures | `rounded-md` |
| Scrollbar thumbs | `rounded-full` (via package CSS) |

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use named Tailwind spacing utilities | Use arbitrary values like `p-[14px]` |
| Use `rounded-md` for interactive controls | Mix rounded and squared corners on similar elements |
| Use `rounded-full` for pills, avatars, dots | Apply `rounded-full` to rectangular cards |
| Keep inner radii smaller than outer (`rounded-sm` inside `rounded-lg`) | Nest equal or larger radii (causes optical concavity) |
