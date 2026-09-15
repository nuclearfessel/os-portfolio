# Pattern: Saved-State Ownership

**Preview:** N/A (cross-cutting concern)

---

## Intent

The Portfolio OS DS is a visual-only library. It has no internal persistence, no localStorage access, no desktop orchestration, and no concept of "the current desktop state." All of these are the exclusive responsibility of the consuming product.

---

## What the design system provides vs. what the product owns

### Design system provides (visual only)
- Component appearance, variants, and interactive states
- CSS custom property hooks (`--accessibility-transparency`, `--fixed-wallpaper-*`, `--hc-*`, etc.)
- Package CSS that reacts to DOM attributes (`data-contrast`, `data-no-transparency`, etc.)
- Documented API for setting those attributes

### Consuming product is responsible for

| Concern | What the product does |
|---|---|
| **Persistence** | Read/write localStorage, sessionStorage, cookies, or a backend |
| **Window geometry** | Track x, y, width, height per window ID; save/restore across sessions |
| **Dock geometry** | Track Dock position and order; save/restore |
| **Launcher positions** | Track x, y per launcher; save/restore |
| **Sticky note content & position** | Track content, x, y, rotation per note; save/restore |
| **Accessibility preferences** | Track all preference values; write DOM attributes on load and change |
| **Wallpaper/background color** | Track selected color; apply to desktop CSS on load |
| **"Save State as Default"** | Serialize current geometry + prefs; write to storage |
| **"Reset Desktop"** | Clear product-stored geometry; restore default positions |
| **Desktop orchestration** | Z-order, focus management between windows, resize constraints |
| **Responsive reflow** | Temporarily override to managed layout on small screens; never overwrite desktop geometry |

---

## Critical rule: Responsive reflow must not overwrite desktop geometry

On tablet and mobile, the product uses temporary managed layout (one window at a time, centered or bottom-sheet). When the user returns to a desktop viewport:

- Desktop window positions, sizes, and z-order must be **exactly as the user left them**.
- Sticky note positions, rotations, and content must be **unchanged**.
- Dock item order and position must be **unchanged**.

The managed-layout state is **ephemeral** — it does not replace the persisted desktop state.

---

## Applying preferences on load

The consuming product must apply saved preferences immediately on mount (before the first paint if possible) to avoid a flash of unstyled state:

```js
// Apply on load from saved prefs:
if (prefs.contrastTheme !== 'none') {
  document.documentElement.setAttribute('data-contrast', prefs.contrastTheme);
}
if (prefs.windowTransparency) {
  document.documentElement.setAttribute('data-transparency-enabled', '');
  document.documentElement.style.setProperty(
    '--accessibility-transparency',
    String(prefs.transparencyLevel / 100)
  );
}
if (!prefs.uiAnimations) {
  document.documentElement.setAttribute('data-no-animations', '');
}
if (prefs.animationSpeed !== 'default') {
  document.documentElement.setAttribute('data-anim-speed', prefs.animationSpeed);
}
if (prefs.alwaysShowScrollbars) {
  document.documentElement.setAttribute('data-always-scrollbars', '');
}
```

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Keep all persistence in the consuming product | Write to localStorage from design system components |
| Apply DOM attributes from saved preferences on load | Wait for user interaction to apply saved preferences |
| Document the consuming product's storage schema | Mix product storage logic into design system PRs |
| Preserve desktop geometry when temporarily switching to managed layout | Overwrite window positions on viewport resize |
| Treat "Save as Default" and "Reset Desktop" as product features | Implement them in the design system |
