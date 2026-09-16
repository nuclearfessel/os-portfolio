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

The generator emits the complete structured layer as `--osp-spacing-*` and
`--osp-radius-*` custom properties. It also emits `spacingTokens` and
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

There are **7 primitive radius tokens**:

| Token | Value |
|---|---:|
| `radius.primitive.none` | 0px |
| `radius.primitive.hairline` | 1px |
| `radius.primitive.sm` | 8px |
| `radius.primitive.md` | 10px |
| `radius.primitive.lg` | 12px |
| `radius.primitive.xl` | 16px |
| `radius.primitive.full` | 9999px |

There are **12 semantic radius aliases**: the seven size names `none`,
`hairline`, `sm`, `md`, `lg`, `xl`, `full`, plus the stable purposes `compact`, `control`,
`surface`, `elevated`, and `pill`.

`radius.base` remains `0.75rem` (12px), and the legacy theme aliases
`radius-sm`, `radius-md`, `radius-lg`, and `radius-xl` continue to use their
existing compatibility formulas.

---

## Component coverage

The component layer covers the existing **23 component groups**:
`actionButton`, `accordion`, `dialog`, `sheet`, `separator`, `toast`, `tooltip`,
`contextMenu`, `desktopLauncher`, `dock`, `dockLabel`, `projectCard`,
`sectionLabel`, `statusIndicator`, `stickyNoteSurface`, `genericSurface`,
`windowSurface`, `systemBar`, `settingsControls`, `colorPicker`, `terminal`,
`terminalCursor`, and `contactCta`.

The radius layer has stable contracts for all 23 groups (25 component radius
aliases total). `settingsControls` intentionally has separate `surface`,
`control`, and `segmented` leaves because its window surface, form controls,
and segmented pills do not share one radius. The spacing layer has stable
contracts for 21 groups (47 component spacing aliases total); `separator` has
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
- Teaching-diagram widths, host-window minimums, navigation relocation
  breakpoints, marker edge offsets, and cursor alignment are composition
  geometry. Keep values such as a Guide minimum width or fixed system-bar strip
  width local to the pattern that proves they fit; do not promote them to tokens.
- No new separator spacing contract is invented because the audited separator
  component has no stable spacing purpose.
- Existing scalar APIs are not replaced by structured objects. Use
  `tokens.spacingTokens` and `tokens.radiusTokens` when a portable consumer
  needs the staged layers.

---

## Spacing do / don't

| Do | Don't |
|---|---|
| Use component spacing contracts inside reusable components | Reference primitive spacing tokens directly from components |
| Choose semantic spacing by purpose, such as `iconGap` or `surfacePadding` | Choose a value only because its number looks close |
| Keep page composition and responsive geometry local to the layout | Promote viewport offsets, calculated widths, or drag positions into spacing tokens |
| Use one spacing contract consistently across every state of a component | Change padding or gaps on hover, focus, or selected states |

---

## Radius do / don't

| Do | Don't |
|---|---|
| Use component radius contracts for controls, surfaces, overlays, and desktop primitives | Reference primitive radius values directly from component styles |
| Use `control`, `surface`, `elevated`, and `pill` roles according to shape purpose | Pick a radius based only on visual similarity |
| Keep a component's corner treatment stable across interaction states | Increase or decrease radius on hover, focus, or active states |
| Use `hairline` only for intentionally near-square details such as the Terminal caret | Use a small non-zero radius where a square corner is required |

---

## Usage guidance

Prefer the semantic or component contract that describes the purpose of a
dimension. Use named Tailwind spacing utilities for composition, and use
`rounded-md` for interactive controls, `rounded-lg`/`rounded-xl` for surfaces,
and `rounded-full` for pills, avatars, and dots. Avoid arbitrary values such
as `p-[14px]` when a staged token is appropriate.