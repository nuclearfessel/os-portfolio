# DesktopLauncher

**Source:** `src/components/ui/fes-os.tsx`
**Export path:** `@workspace/fes-os-design-system/components/ui/fes-os`
**Preview page:** `fes-os-pilot`

---

## Purpose

The `DesktopLauncher` is a button primitive for desktop app launcher icons — the interactive targets in the desktop launcher grid that open windows. It applies `is-open` when its associated window is visible.

---

## Anatomy

```
<button class="is-open?" ...>
  [icon + label — supplied by consumer]
</button>
```

Adds `is-open` class when `open={true}`. No built-in size, color, or layout — the consuming product supplies all visual treatment.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Applies `is-open` class |
| `type` | `string` | `'button'` | Prevents form submission |
| `className` | `string` | — | Consumer styles the launcher appearance |
| `ref` | `Ref<HTMLButtonElement>` | — | Forwarded |
| `...props` | `ButtonHTMLAttributes` | — | Including `aria-label`, `aria-expanded` |

---

## State ownership

- **`is-open`** reflects open/closed state via prop — consuming product manages window state.
- Visual feedback for open (highlight, indicator dot, shadow) is the consuming product's responsibility.
- Position on the desktop grid is the consuming product's responsibility.

---

## Accessibility

- Add `aria-label` set to the window/app name.
- Add `aria-expanded={open}` to signal the associated window's open state.
- Add `aria-controls` pointing to the window's `id` if the window is in the same DOM subtree.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Add `aria-expanded` and `aria-label` | Leave icon-only launchers without accessible names |
| Use `is-open` CSS class to drive open-state visuals in the consuming app's CSS | Manage open-state appearance only via JavaScript |

---

## Import & usage

```tsx
import { DesktopLauncher } from '@workspace/fes-os-design-system/components/ui/fes-os';

<DesktopLauncher
  open={windowOpen}
  aria-label="About"
  aria-expanded={windowOpen}
  onClick={toggleAboutWindow}
  className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3"
>
  <AboutIcon className="size-8" strokeWidth={1.8} />
  <span className="text-[10px] font-mono">About</span>
</DesktopLauncher>
```
