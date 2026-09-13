---
name: desktop-portfolio
description: Maintain the desktop-style React portfolio, including windows, Dock, responsive layouts, stickies, persistence, themes, and accessibility. Use for any feature, design, bug fix, or content change in artifacts/desktop-portfolio.
---

# Desktop Portfolio Development

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

## Responsive rules

- Desktop-only apps: Terminal and Stickies.
- Hide desktop launchers outside desktop mode.
- Keep tablet/mobile navigation fixed at the bottom with visible labels.
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

## Visual rules

- Keep the established typography, restrained OS styling, and light/dark palettes.
- Use `@keyline-icons/react` for interface icons when a matching icon exists.
- Avoid emoji interface icons.
- Keep mobile navigation icons and labels inside stable footprints so state changes do not shift layout.
- Preserve solid managed-window surfaces for readability.

## Editing workflow

1. Search `App.tsx` and `index.css` for the relevant component and selectors.
2. Make the smallest coherent change.
3. Update an existing focused test when behavior changes.
4. Run:

```bash
pnpm --filter @workspace/desktop-portfolio run typecheck
```

5. For responsive or persistence changes, run the relevant Playwright spec:

```bash
pnpm --filter @workspace/desktop-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
pnpm --filter @workspace/desktop-portfolio run test:e2e:persistence
```

6. Build with:

```bash
PORT=3000 pnpm --filter @workspace/desktop-portfolio run build
```

The existing tooltip sourcemap warning during Vite builds is non-fatal if the build otherwise succeeds.