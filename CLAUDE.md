# Desktop Portfolio

This repository contains a React and Vite portfolio styled as a desktop operating system. The application is in `artifacts/desktop-portfolio`.

## Start here

Read `.claude/skills/branch-first-development/SKILL.md` before making any repository change. Read `.claude/skills/desktop-portfolio/SKILL.md` before changing the portfolio. Read `.claude/skills/ftp-release/SKILL.md` before preparing or uploading a release.

## Common commands

Run commands from the repository root:

```bash
pnpm install
PORT=5173 pnpm --filter @workspace/desktop-portfolio run dev
pnpm --filter @workspace/desktop-portfolio run typecheck
pnpm --filter @workspace/desktop-portfolio run test:e2e:persistence
pnpm --filter @workspace/desktop-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
pnpm --filter @workspace/desktop-portfolio run build
```

## Main files

- `artifacts/desktop-portfolio/src/App.tsx` — application behavior, windows, Dock, responsive profiles, persistence, and content.
- `artifacts/desktop-portfolio/src/index.css` — visual design and responsive presentation.
- `artifacts/desktop-portfolio/tests/` — persistence, responsive-layout, and contrast checks.
- `artifacts/desktop-portfolio/vite.config.ts` — Vite and relative production asset configuration.

## Non-negotiable constraints

- Perform all work on a dedicated branch. Never develop directly on `main`.
- Leave completed work uncommitted while the user validates it.
- Commit, merge into `main`, and push only after the user gives explicit approval.
- Preserve saved desktop positions and sizes when temporarily entering tablet or mobile layouts.
- Keep launcher positions separate from the positions of their corresponding windows.
- Stickies and Terminal are desktop-only.
- Tablet and mobile use a fixed bottom app menu.
- Mobile always uses the portrait layout rules. A normal browser tab cannot physically lock device orientation.
- Production assets must remain relative so the static build can run from an FTP subfolder.
- Do not reintroduce pathname-based client routing; it caused blank pages under nested FTP paths.
- Do not add a backend dependency. This portfolio is a static site.
- Maintain keyboard focus states and accessible labels when modifying controls.
- Keep desktop context-menu submenus collapsed on open. Arrow Down starts keyboard navigation.
- `Save state as default` must overwrite the complete reset snapshot, including open/maximized windows, active window, stacking order, stickies, geometry, Dock, and preferences.

## Completion checks

Run the smallest relevant test during development. Before handing off a release, run typecheck, the persistence suite when desktop state changed, responsive tests when responsive behavior changed, and the production build.

## Generated files

- Upload-ready build: `artifacts/desktop-portfolio/dist/public/`
- Downloadable source bundle: `claude-desktop-portfolio-source.zip`
- The ZIP also contains a top-level `public/` copy of the latest production build and `DEPLOYMENT.md`.
- Source portions of the ZIP exclude `node_modules`, package `dist` folders, Playwright reports/results, caches, environment files, and `*.tsbuildinfo`.