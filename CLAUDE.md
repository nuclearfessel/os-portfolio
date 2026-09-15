# OS Portfolio

This repository contains OS Portfolio (OS.Portfolio), a React and Vite portfolio styled as a desktop operating system. The application is in `artifacts/os-portfolio`.

## Start here

Read `.claude/skills/branch-first-development/SKILL.md` before making any repository change. Read `.claude/skills/os-portfolio/SKILL.md` before changing the portfolio. Read `.claude/skills/website-zip-action/SKILL.md` before changing CI, build output, or release packaging. Read `.claude/skills/ftp-release/SKILL.md` before preparing or uploading a release.

## Common commands

Run commands from the repository root:

```bash
pnpm install
PORT=5173 pnpm --filter @workspace/os-portfolio run dev
pnpm --filter @workspace/os-portfolio run typecheck
pnpm --filter @workspace/os-portfolio run test:e2e:persistence
pnpm --filter @workspace/os-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
pnpm --filter @workspace/os-portfolio run build
```

## Main files

- `artifacts/os-portfolio/src/App.tsx` — application behavior, windows, Dock, responsive profiles, persistence, and content.
- `artifacts/os-portfolio/src/index.css` — visual design and responsive presentation.
- `artifacts/os-portfolio/tests/` — persistence, responsive-layout, and contrast checks.
- `artifacts/os-portfolio/vite.config.ts` — Vite and relative production asset configuration.

## Non-negotiable constraints

- Perform all work on a dedicated branch. Never develop directly on `main`.
- Completed, validated work is automatically approved for GitHub; do not wait for a separate approval response.
- Completion is an immediate, mandatory GitHub workflow trigger. Never stop after the validation summary or substitute a publish suggestion: perform the sync review, refresh both GitHub README screenshots from the running portfolio and design-system previews, commit, push the branch, merge into `main`, push `main`, and confirm the main-only release.
- Before committing completed work, review whether README, Claude files, package metadata/exports, or package documentation require matching updates. Apply only the updates relevant to the completed change.
- Preserve the GitHub Releases website ZIP workflow for pushes to `main` only. Feature and maintenance branches must never publish release packages.
- Website ZIPs must contain the deployable contents of `artifacts/os-portfolio/dist/public/` at the archive root.
- Every `main` release must contain exactly three ZIP assets: a versioned deployable `site-package-vMM.NN.zip`, a versioned deployable `design-system-package-vMM.NN.zip`, and an unversioned Claude source package named exactly `claude-src-pack.zip`. All are standard release assets; never create prereleases.
- Preserve saved desktop positions and sizes when temporarily entering tablet or mobile layouts.
- Keep launcher positions separate from the positions of their corresponding windows.
- For every resizable window with side navigation, use the window container width to smoothly transform the sidebar into a horizontal sub-navigation toolbar directly below the window toolbar. Preserve item and keyboard order, active state, and non-overlapping content geometry.
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

- Upload-ready build: `artifacts/os-portfolio/dist/public/`
- Upload-ready OS Portfolio DS build: `artifacts/os-portfolio-ds/dist/`
- Downloadable source bundle: `claude-src-pack.zip`
- The ZIP also contains a top-level `public/` copy of the latest production build and `DEPLOYMENT.md`.
- Source portions of the ZIP exclude `node_modules`, package `dist` folders, Playwright reports/results, caches, environment files, and `*.tsbuildinfo`.