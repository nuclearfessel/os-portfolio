# SectionLabel

**Source:** `src/components/ui/os-portfolio.tsx`
**Export path:** `@workspace/os-portfolio-ds/components/ui/os-portfolio`
**Preview page:** `os-portfolio-pilot`

---

## Purpose

A compact uppercase monospace kicker used to orient the user: window type labels, group eyebrows, intro section markers, and preview story headers. Not for body copy.

---

## Anatomy

```
COMPONENTS / PILOT
└── <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
```

---

## Variants / Sizes

No variants — one canonical style. Adjust `className` if a specific context genuinely requires a different weight or color, but prefer using this consistently.

---

## Interactive states

Static display element — no interactive states.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Merged with base classes |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | — | All span attributes |

---

## Accessibility

- Renders as `<span>` — not a heading. Do not use as a page title replacement.
- Purely visual orientation text. Screen readers will announce it as inline text.
- If the label is purely decorative / redundant with a visible heading, add `aria-hidden="true"`.

---

## Relevant tokens

`text-primary`, `font-mono`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use at the top of a card, window, or section to orient the user | Use as a replacement for `<h1>`–`<h6>` headings |
| Keep text short (≤ 40 characters) | Write long sentences in SectionLabel |
| Use `text-primary` — the component supplies this | Override to a non-primary color without strong reason |

---

## Import & usage

```tsx
import { SectionLabel } from '@workspace/os-portfolio-ds/components/ui/os-portfolio';

<SectionLabel>components / pilot</SectionLabel>
```
