# TerminalCursor

**Source:** `src/components/ui/os-portfolio.tsx`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/os-portfolio`  
**Preview page:** `os-portfolio-pilot`

---

## Purpose

`TerminalCursor` is the visual block caret used by interactive Terminal inputs.
It matches the cursor shown in the User Guide Terminal diagram while leaving
input value, selection, caret position, history, and completion behavior under
product control.

---

## Anatomy

- Root: decorative `<span aria-hidden="true">`
- Size: `7px × 13px`
- Radius: `1px`
- Blink: `1s step-end infinite`
- Dark theme: Terminal cursor token (`#e4ff5b`)
- Light theme: Terminal cursor token (`#c54f48`)

---

## Product responsibilities

- Use a native input for typing, selection, history, and assistive-technology semantics.
- Hide the native caret when the block cursor is rendered.
- Position the block at the native input’s current `selectionStart`, not merely at the end of the value.
- Refocus the input whenever its Terminal window opens, restores, or becomes active.
- Preserve intentional output-text selection instead of stealing focus during a selection gesture.

---

## Motion and accessibility

The blinking caret is functional typing feedback, not decorative motion. It
continues blinking under `data-no-animations`, `data-fast-ui`, and
`prefers-reduced-motion`. The cursor is always hidden from assistive technology;
the native input remains the semantic control.

---

## Usage

```tsx
<div className="relative">
  <input className="caret-transparent" aria-label="Terminal command" />
  <TerminalCursor
    className="absolute top-1/2 -translate-y-1/2"
    style={{ left: `${selectionStart}ch` }}
  />
</div>
```

---

## Do / Don’t

| Do | Don’t |
|---|---|
| Keep the native input as the interactive control | Replace the input with a contenteditable imitation |
| Track the actual selection position | Pin the cursor to the end of the command |
| Focus the input when Terminal becomes active | Require a second click before typing |
| Keep the cursor decorative to accessibility APIs | Announce the cursor as content |