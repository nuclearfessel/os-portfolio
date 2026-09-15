# Typography

**Living preview:** `type-scale`
**Token source:** `tokens.json` → `typography`
**Generated output:** `src/index.css` CSS custom properties

---

## Typefaces

| Role | Family | Token key | CSS variable |
|---|---|---|---|
| UI & body | Space Grotesk | `typography.fontFamily.sans` | `--app-font-sans` |
| Serif (decorative) | Georgia | `typography.fontFamily.serif` | `--app-font-serif` |
| Mono (status, labels, metadata) | DM Mono | `typography.fontFamily.mono` | `--app-font-mono` |

Tailwind mappings:
- `font-sans` → Space Grotesk
- `font-serif` → Georgia
- `font-mono` → DM Mono

---

## Type scale

The system uses Tailwind's standard named scale. All values below are as defined in the `@theme inline` block.

| Class | Size | Line-height ratio | Use |
|---|---|---|---|
| `text-xs` | 0.75rem (12px) | 1.33 | Captions, compact metadata, tooltip text |
| `text-sm` | 0.875rem (14px) | 1.43 | Body text, descriptions, form labels |
| `text-base` | 1rem (16px) | 1.5 | Default body copy |
| `text-lg` | 1.125rem (18px) | 1.56 | Emphasized body, intro paragraphs |
| `text-xl` | 1.25rem (20px) | 1.4 | Section headings |
| `text-2xl` | 1.5rem (24px) | 1.33 | Page sub-titles |
| `text-3xl` | 1.875rem (30px) | 1.2 | Page titles |
| `text-4xl` | 2.25rem (36px) | 1.11 | Large display headings |
| `text-5xl+` | 3rem+ | 1.0 | Hero / display sizes |

### Desktop introduction roles

The desktop introduction uses dedicated semantic roles rather than inheriting the
general `text-lg` line height:

| Role | Size | Weight | Line height | Generated variable |
|---|---:|---:|---:|---|
| Primary heading spans | Responsive display size | 800 | Inherited from heading | `--desktop-intro-primary-weight` |
| Intro body | 1.125rem (18px) | 400 | 1.25 | `--desktop-intro-body-size`, `--desktop-intro-body-weight`, `--desktop-intro-body-line-height` |

These values come from `typography.desktopIntro` in `tokens.json`. Use them for
the text block rendered directly over desktop wallpaper; do not substitute the
general `text-lg` role, whose 1.56 line height serves longer-form content.

---

## Role conventions

### Space Grotesk (sans)
Use for all interface copy: buttons, labels, body paragraphs, headings, card text, navigation items, dialog content. It is the default `font-sans`.

### DM Mono (mono)
Use for:
- **SectionLabel** — `font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary`
  Compact uppercase kickers that orient the user (window titles, group labels, eyebrows)
- **StatusIndicator** — `font-mono text-xs`
  System status text next to the dot
- **Keyboard keys** (`Kbd`) — `font-sans text-xs` (note: Kbd itself uses `font-sans` for legibility of keycap text)
- **Numeric metadata** — index values in `ProjectCard`, live value outputs in `SettingsSliderGroup`
- **Tooltip surfaces** — `font-mono text-[10px]`

### Hierarchy rules
1. One heading level dominates each view.
2. Body text in cards and descriptions uses `text-sm` or `text-base`.
3. Muted/secondary text uses `text-muted-foreground`.
4. Never set body copy in `font-mono` — reserve mono for compact system-status roles.

---

## Minimum sizes

- Body copy: 13px or larger (`text-sm` = 14px satisfies this)
- Captions / section labels: 10px minimum (`text-[0.625rem]` = 10px for SectionLabel)
- Touch targets contain text at ≥ 11px

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `font-mono` for status labels, metadata, and compact kickers | Use `font-mono` for paragraph body copy |
| Use `text-muted-foreground` for secondary/helper text | Use raw colors for text variants |
| Use the `desktopIntro` semantic role for the desktop introduction | Rebuild the intro role from unrelated type utilities |
| Keep section labels `uppercase tracking-wide font-mono` for consistent orientation | Mix section-label patterns across the product |
| Use `leading-relaxed` or explicit line-height for descriptions > 1 line | Leave long strings of body text without a comfortable line-height |
