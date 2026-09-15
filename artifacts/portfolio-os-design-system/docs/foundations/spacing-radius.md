# Spacing & Radius

**Living preview:** `spacing-radius`
**Token source:** `tokens.json` → `spacing`, `radius`
**Generated output:** `src/index.css` and `src/generated/tokens.tsx`

---

## Architecture

Spacing and radius use three DTCG layers:

1. **Primitive** — the audited, reusable numeric values. These are the only
   values that should be changed when the scale is revised.
2. **Semantic** — stable purposes such as `surfacePadding`, `iconGap`, and
   `control`. Every semantic token aliases a primitive.
3. **Component** — contracts for the component groups that need a stable
   dimension. Every component token aliases a semantic token; components should
   not reference primitives directly.

The generator emits the complete structured layer as `--os-spacing-*` and
`--os-radius-*` custom properties. It also emits `spacingTokens` and
`radiusTokens` in the portable token object. The scalar `tokens.spacing`,
`tokens.radius`, `--spacing`, `--radius`, `--radius-sm`, `--radius-md`,
`--radius-lg`, and `--radius-xl` APIs remain available for existing consumers.

---

## Spacing inventory

There are **13 primitive spacing tokens**:

| Token | Value |
|---|---:|
| `spacing.primitive.0` | 0px |
| `spacing.primitive.2` | 2px |
| `spacing.primitive.4` | 4px |
| `spacing.primitive.6` | 6px |
| `spacing.primitive.8` | 8px |
| `spacing.primitive.10` | 10px |
| `spacing.primitive.12` | 12px |
| `spacing.primitive.14` | 14px |
| `spacing.primitive.16` | 16px |
| `spacing.primitive.20` | 20px |
| `spacing.primitive.24` | 24px |
| `spacing.primitive.28` | 28px |
| `spacing.primitive.32` | 32px |

There are **17 semantic spacing aliases**: `none`, `hairline`, `micro`,
`iconGap`, `itemGap`, `controlPaddingBlock`, `overlayInset`, `controlGap`,
`controlPaddingInline`, `listGap`, `compactPadding`, `surfaceInset`,
`surfacePadding`, `stackGap`, `sectionGap`, `shellPadding`, and `sectionInset`.

`spacing.base` remains `0.25rem` (4px) for the original scalar/Tailwind
contract. It is not part of the staged primitive count.

---

## Radius inventory

There are **6 primitive radius tokens**:

| Token | Value |
|---|---:|
| `radius.primitive.none` | 0px |
| `radius.primitive.sm` | 8px |
| `radius.primitive.md` | 10px |
| `radius.primitive.lg` | 12px |
| `radius.primitive.xl` | 16px |
| `radius.primitive.full` | 9999px |

There are **11 semantic radius aliases**: the six size names `none`, `sm`,
`md`, `lg`, `xl`, `full`, plus the stable purposes `compact`, `control`,
`surface`, `elevated`, and `pill`.

`radius.base` remains `0.75rem` (12px), and the legacy theme aliases
`radius-sm`, `radius-md`, `radius-lg`, and `radius-xl` continue to use their
existing compatibility formulas.

---

## Component coverage

The component layer covers the existing **21 component groups**:
`actionButton`, `accordion`, `dialog`, `separator`, `toast`, `tooltip`,
`contextMenu`, `desktopLauncher`, `dock`, `dockLabel`, `projectCard`,
`sectionLabel`, `statusIndicator`, `stickyNoteSurface`, `genericSurface`,
`windowSurface`, `systemBar`, `settingsControls`, `colorPicker`, `terminal`,
and `contactCta`.

The radius layer has stable contracts for all 21 groups (23 component radius
aliases total). `settingsControls` intentionally has separate `surface`,
`control`, and `segmented` leaves because its window surface, form controls,
and segmented pills do not share one radius. The spacing layer has stable
contracts for 20 groups (44 component spacing aliases total); `separator` has
no spacing contract and is intentionally omitted. Component properties use
purpose names such as `padding`, `paddingInline`, `paddingBlock`, `gap`, and
`radius`, not one-off geometry values.

---

## Exclusions

- Large composition values are not primitives. Page layout, hero positioning,
  viewport offsets, and other composition geometry remain local to their
  composition.
- Arbitrary and dynamic geometry is not tokenized, including percentages,
  calculated dimensions, responsive widths, transforms, slider positions, and
  content-dependent sizes.
- No new separator spacing contract is invented because the audited separator
  component has no stable spacing purpose.
- Existing scalar APIs are not replaced by structured objects. Use
  `tokens.spacingTokens` and `tokens.radiusTokens` when a portable consumer
  needs the staged layers.

---

## Usage guidance

Prefer the semantic or component contract that describes the purpose of a
dimension. Use named Tailwind spacing utilities for composition, and use
`rounded-md` for interactive controls, `rounded-lg`/`rounded-xl` for surfaces,
and `rounded-full` for pills, avatars, and dots. Avoid arbitrary values such
as `p-[14px]` when a staged token is appropriate.