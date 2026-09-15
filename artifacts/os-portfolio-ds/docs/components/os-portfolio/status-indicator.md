# StatusIndicator

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

---

## Purpose

Displays a coloured dot beside a status label — used in system bars, "availability" rows, and anywhere online/idle/danger state needs a compact paired representation.

---

## Anatomy

```
● online
└── <span> (inline-flex gap-1.5 font-mono text-xs)
      ├── <span aria-hidden="true"> — colored dot (size-1.5 rounded-full + halo shadow)
      └── {label}                  — visible status text
```

---

## Tones

| Tone | Dot color | Default label | Use |
|---|---|---|---|
| `online` (default) | `bg-primary text-primary` | `"online"` | Active / connected |
| `idle` | `bg-muted-foreground text-muted-foreground` | `"away"` | Idle / reduced state |
| `danger` | `bg-destructive text-destructive` | `"offline"` | Error / unreachable |

The halo shadow is `shadow-[0_0_0_3px_color-mix(in_srgb,currentColor_10%,transparent)]` — automatically picks up the dot's `text-*` color.

---

## Interactive states

Static display element — no interactive states.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `'online' \| 'idle' \| 'danger'` | `'online'` | Semantic color tone |
| `label` | `string` | `'online'` | Visible text label alongside the dot |
| `dotClassName` | `string` | — | Extra classes on the dot `<span>` |
| `className` | `string` | — | Merged with root classes |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | — | All span attributes |

---

## Accessibility

- The dot span is `aria-hidden="true"` — it is decorative; meaning is carried by the visible label text.
- Color is never the sole carrier of status — the label text always accompanies the dot.

---

## Relevant tokens

`text-primary`, `bg-primary`, `text-muted-foreground`, `bg-muted-foreground`, `text-destructive`, `bg-destructive`, `font-mono`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Always supply a readable `label` alongside the dot | Use the dot alone without accompanying text |
| Match `tone` to the actual semantic state | Use `tone="danger"` for neutral warnings |

---

## Import & usage

```tsx
import { StatusIndicator } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

<StatusIndicator />                              // online (default)
<StatusIndicator tone="idle" label="away" />
<StatusIndicator tone="danger" label="offline" />
```
