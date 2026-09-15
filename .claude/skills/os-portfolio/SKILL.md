---
name: os-portfolio
description: Maintain OS Portfolio, the desktop-style React portfolio, including windows, Dock, responsive layouts, stickies, persistence, themes, and accessibility. Use for any feature, design, bug fix, or content change in artifacts/os-portfolio.
---

# OS Portfolio Development

## Product model

The site simulates a desktop OS on large screens and becomes a managed app interface on tablet and mobile.

- Desktop: draggable/resizable windows, movable launchers, movable Dock, Stickies, and Terminal.
- Tablet: fixed bottom navigation; tablet landscape may retain desktop-like window controls.
- Mobile: fixed four-item bottom menu and portrait layout rules.
- About and Work folder artwork reflects whether the corresponding window is open.
- A desktop window toolbar toggles maximize/restore on double-click and must restore exact prior geometry.

## State rules

1. Treat responsive geometry as temporary.
2. Never persist managed tablet/mobile coordinates over desktop geometry.
3. Restore the user's desktop window, launcher, sticky, and Dock geometry when returning to desktop.
4. Use separate persisted identities for launchers and windows. Moving the About launcher must not move the About window.
5. Keep theme, icon size, snap-to-grid, Dock position, sticky state, and desktop geometry persistent.
6. Handle blocked or unavailable local storage explicitly; do not silently pretend saving succeeded.
7. `Save state as default` must atomically replace the complete reset snapshot: geometry, window visibility, active/maximized windows, full bottom-to-top window stack, sticky collection/visibility/active sticky, Dock, theme, icons, and preferences.
8. `Reset desktop…` must restore the latest saved default, not a mixture of the custom snapshot and built-in initial state.

## Responsive rules

- Desktop-only apps: Terminal and Stickies.
- Hide desktop launchers outside desktop mode.
- Keep tablet/mobile navigation fixed at the bottom with visible labels.
- Every resizable window with side navigation must respond to its own container width. At narrow widths, smoothly transform the sidebar into a horizontal sub-navigation toolbar directly below the window toolbar while preserving DOM and keyboard order, active state, and non-overlapping content geometry.
- When solid-color wallpaper mode is selected, carry the active theme's saved solid color into tablet and mobile layouts. Keep picture wallpapers desktop-only, and let contrast modes override wallpaper presentation without discarding the saved selection.
- The non-desktop Mode item toggles light/dark theme using Keyline `Sun` and `Moon` icons.
- Managed windows stay 8px below the system bar.
- Tablet portrait and mobile windows are fully opaque.
- Desktop and tablet-landscape window surfaces are 98% opaque with a 2px backdrop blur.
- Desktop and tablet-landscape headers remain 92% opaque.
- In tablet portrait and mobile, show only the Close window control.
- Do not claim CSS can physically prevent Android or iOS browser rotation. Only installed PWA or eligible fullscreen orientation APIs can request a lock.

## Interaction rules

- Use pointer capture for drag, resize, and sticky rotation.
- Do not write drag geometry for click-only interactions.
- Preserve fractional window coordinates when maximizing and restoring.
- Exclude traffic-light buttons from toolbar double-click behavior.
- Suppress native pressed artifacts on invisible sticky rotation handles while retaining keyboard-only focus indication.
- Mobile/tablet app selection must focus the selected open window.
- Context menus receive initial focus as containers so their first submenu stays collapsed. Arrow Down focuses the first item; hover or keyboard focus may then reveal a submenu.
- Browser-native context menus and iOS touch callouts remain disabled while custom desktop, Dock, and sticky menus remain usable.

## Visual rules

- Keep the established typography, restrained OS styling, and light/dark palettes.
- Use `@keyline-icons/react` for interface icons when a matching icon exists.
- Avoid emoji interface icons.
- Keep mobile navigation icons and labels inside stable footprints so state changes do not shift layout.
- Preserve solid managed-window surfaces for readability.
- Keep desktop text personalization copy shared between themes, but persist each element's light and dark colors independently. Open the shared color picker in a modal floating dialog from Personalization.
- Current motion timings are intentionally quick: windows `0.07s`, folder transforms `0.07s`, mode opacity `0.12s`, and mode transform `0.17s`.

## Editing workflow

1. Search `App.tsx` and `index.css` for the relevant component and selectors.
2. Make the smallest coherent change.
3. Update an existing focused test when behavior changes.
4. Run:

```bash
pnpm --filter @workspace/os-portfolio run typecheck
```

5. For responsive or persistence changes, run the relevant Playwright spec:

```bash
pnpm --filter @workspace/os-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
pnpm --filter @workspace/os-portfolio run test:e2e:persistence
```

6. Build with:

```bash
PORT=3000 pnpm --filter @workspace/os-portfolio run build
```

The existing tooltip sourcemap warning during Vite builds is non-fatal if the build otherwise succeeds.