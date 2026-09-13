# Desktop Portfolio

This repository contains a React and Vite portfolio styled as a desktop operating system. The application is in `artifacts/desktop-portfolio`.

## Start here

Read `.claude/skills/desktop-portfolio/SKILL.md` before changing the portfolio. Read `.claude/skills/ftp-release/SKILL.md` before preparing or uploading a release.

## Common commands

Run commands from the repository root:

```bash
pnpm install
PORT=5173 pnpm --filter @workspace/desktop-portfolio run dev
pnpm --filter @workspace/desktop-portfolio run typecheck
pnpm --filter @workspace/desktop-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
PORT=3000 pnpm --filter @workspace/desktop-portfolio run build
```

## Main files

- `artifacts/desktop-portfolio/src/App.tsx` — application behavior, windows, Dock, responsive profiles, persistence, and content.
- `artifacts/desktop-portfolio/src/index.css` — visual design and responsive presentation.
- `artifacts/desktop-portfolio/tests/` — persistence, responsive-layout, and contrast checks.
- `artifacts/desktop-portfolio/vite.config.ts` — Vite and relative production asset configuration.

## Non-negotiable constraints

- Preserve saved desktop positions and sizes when temporarily entering tablet or mobile layouts.
- Keep launcher positions separate from the positions of their corresponding windows.
- Stickies and Terminal are desktop-only.
- Tablet and mobile use a fixed bottom app menu.
- Mobile always uses the portrait layout rules. A normal browser tab cannot physically lock device orientation.
- Production assets must remain relative so the static build can run from an FTP subfolder.
- Do not reintroduce pathname-based client routing; it caused blank pages under nested FTP paths.
- Do not add a backend dependency. This portfolio is a static site.
- Maintain keyboard focus states and accessible labels when modifying controls.

## Completion checks

Run the smallest relevant test during development. Before handing off a release, run typecheck, the responsive tests when responsive behavior changed, and the production build. Do not include `node_modules`, `dist`, Playwright reports, test results, or `*.tsbuildinfo` in source archives.