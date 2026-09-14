# Portfolio OS Desktop Portfolio

John Doe’s static React portfolio presents selected work inside a responsive desktop operating-system interface.

## Run and validate

Run commands from the repository root:

```bash
pnpm install
pnpm --filter @workspace/desktop-portfolio run dev
pnpm --filter @workspace/desktop-portfolio run typecheck
pnpm --filter @workspace/desktop-portfolio run test:e2e:persistence
pnpm --filter @workspace/desktop-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
pnpm --filter @workspace/desktop-portfolio run build
```

The managed Replit workflow is `artifacts/desktop-portfolio: web`.

## Stack

- React, Vite, and TypeScript in a pnpm workspace
- Shared UI package: `@workspace/portfolio-os-design-system`
- Browser-local persistence; no backend or database dependency
- Playwright interaction and responsive-layout coverage
- Static production output with relative asset URLs

## Project map

- `artifacts/desktop-portfolio/src/App.tsx` — desktop behavior, content, Terminal, persistence, windows, Dock, and stickies
- `artifacts/desktop-portfolio/src/index.css` — responsive presentation, themes, and motion
- `artifacts/desktop-portfolio/tests/` — persistence, interaction, responsive, and contrast checks
- `artifacts/desktop-portfolio/dist/public/` — generated upload-ready static site
- `artifacts/portfolio-os-design-system/` — shared tokens and visual primitives
- `CLAUDE.md` — concise collaborator instructions
- `.claude/skills/desktop-portfolio/SKILL.md` — portfolio maintenance rules
- `.claude/skills/ftp-release/SKILL.md` — static release procedure

## Product behavior

- Desktop supports draggable and resizable windows, movable launchers and Dock, Terminal commands, custom context menus, themes, and editable stickies.
- Tablet and mobile switch to managed layouts without overwriting saved desktop geometry.
- `Save state as default` stores the complete workspace snapshot. `Reset desktop…` restores that snapshot.
- The saved default includes window geometry, visibility, maximized state, active window, full stacking order, stickies, Dock position, and desktop preferences.
- Desktop context menus initially open with submenus collapsed. Keyboard navigation begins with Arrow Down.

## Important constraints

### Source-control workflow

- Start every update on a dedicated branch; never develop directly on `main`.
- Leave completed work uncommitted while the user validates it.
- Commit only after the user gives explicit approval.
- Merge the approved branch into `main` only after that approval, then push `main`.

- Build strictly on `artifacts/portfolio-os-design-system`; do not invent replacement tokens or duplicate shared primitives.
- Keep launchers and their corresponding windows under separate position identities.
- Do not persist temporary tablet or mobile geometry as desktop geometry.
- Keep production asset URLs relative for nested static and FTP hosting.
- Do not add pathname-based client routing or a backend dependency.
- Preserve custom context menus while suppressing browser-native context menus.
- Every resizable window with side navigation must use a window-container breakpoint to smoothly transform the side navigation into a horizontal sub-navigation toolbar directly below the window toolbar. Preserve order, active state, keyboard order, and content geometry.
- A selected solid wallpaper color follows its light or dark theme into tablet and mobile layouts. Picture wallpapers remain desktop-only, and contrast modes may override the visual background without changing the saved wallpaper choice.
- Desktop text personalization edits three elements as shared copy, with independent light and dark colors. Complex color controls use the shared picker inside a floating modal dialog.

## Release files

Build output is generated at `artifacts/desktop-portfolio/dist/public/`. Upload the contents of that directory, not the source `public/` folder.

The downloadable source bundle is `claude-src-pack.zip`. It includes source, relevant Markdown, Claude skills, and a top-level deployable `public/` directory. It excludes dependencies, intermediate `dist` directories, and test reports.