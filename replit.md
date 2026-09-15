# OS Portfolio

OS Portfolio is John Doe’s static React portfolio, presenting work inside a responsive desktop operating-system interface.

## Run and validate

Run commands from the repository root:

```bash
pnpm install
pnpm --filter @workspace/os-portfolio run dev
pnpm --filter @workspace/os-portfolio run typecheck
pnpm --filter @workspace/os-portfolio run test:e2e:persistence
pnpm --filter @workspace/os-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
pnpm --filter @workspace/os-portfolio run build
```

The managed Replit workflow is `artifacts/os-portfolio: web`.

## Stack

- React, Vite, and TypeScript in a pnpm workspace
- Shared UI package: `@workspace/os-portfolio-ds` (OS Portfolio DS)
- Browser-local persistence; no backend or database dependency
- Playwright interaction and responsive-layout coverage
- Static production output with relative asset URLs

## Project map

- `artifacts/os-portfolio/src/App.tsx` — desktop behavior, content, Terminal, persistence, windows, Dock, and stickies
- `artifacts/os-portfolio/src/index.css` — responsive presentation, themes, and motion
- `artifacts/os-portfolio/tests/` — persistence, interaction, responsive, and contrast checks
- `artifacts/os-portfolio/dist/public/` — generated upload-ready static site
- `artifacts/os-portfolio-ds/` — OS Portfolio DS shared tokens and visual primitives
- `CLAUDE.md` — concise collaborator instructions
- `.claude/skills/os-portfolio/SKILL.md` — OS Portfolio maintenance rules
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
- Completed, validated work is automatically approved for GitHub. Do not wait for a separate approval response.
- Completion immediately triggers the GitHub workflow: review and sync applicable docs/package surfaces, refresh both README screenshots, validate, commit, push the branch, merge into `main`, push `main`, and confirm the main-only release.

- Build strictly on `artifacts/os-portfolio-ds`; do not invent replacement tokens or duplicate shared primitives.
- Keep launchers and their corresponding windows under separate position identities.
- Do not persist temporary tablet or mobile geometry as desktop geometry.
- Keep production asset URLs relative for nested static and FTP hosting.
- Do not add pathname-based client routing or a backend dependency.
- Preserve custom context menus while suppressing browser-native context menus.
- Every resizable window with side navigation must use a window-container breakpoint to smoothly transform the side navigation into a horizontal sub-navigation toolbar directly below the window toolbar. Preserve order, active state, keyboard order, and content geometry.
- A selected solid wallpaper color follows its light or dark theme into tablet and mobile layouts. Picture wallpapers remain desktop-only, and contrast modes may override the visual background without changing the saved wallpaper choice.
- Desktop text personalization edits three elements as shared copy, with independent light and dark colors. Complex color controls use the shared picker inside a floating modal dialog.

## Release files

Build output is generated at `artifacts/os-portfolio/dist/public/`. Upload the contents of that directory, not the source `public/` folder.

The downloadable source bundle is `claude-src-pack.zip`. It includes source, relevant Markdown, Claude skills, and a top-level deployable `public/` directory. It excludes dependencies, intermediate `dist` directories, and test reports.