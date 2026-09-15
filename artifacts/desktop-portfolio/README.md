# Portfolio OS Desktop Portfolio

A responsive, static React portfolio for John Doe presented as a desktop operating system.

## Features

- Draggable, resizable, maximizable desktop windows
- Movable app launchers and Dock
- Work, About, Contact, Terminal, and Stickies
- Light and dark themes
- Custom desktop, Dock, and sticky context menus
- Responsive managed layouts for tablet and mobile
- Browser-local desktop persistence
- User-defined reset baseline through `Save state as default`

The saved default is a complete workspace snapshot. It includes positions, sizes, open and maximized windows, active window, full stacking order, sticky collection and visibility, active sticky, Dock placement, theme, icon settings, and desktop preferences.

## Work files in Terminal

The virtual `~/selected-work` directory contains:

- `northstar-commerce-system.md`
- `signal-operations-platform.md`
- `mosaic-health-toolkit.md`
- `fieldnote-collaboration-kit.md`

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @workspace/desktop-portfolio run dev
```

The development server binds to Replit’s `PORT` environment variable.

## Validation

```bash
pnpm --filter @workspace/desktop-portfolio run typecheck
pnpm --filter @workspace/desktop-portfolio run test:e2e:persistence
pnpm --filter @workspace/desktop-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
pnpm --filter @workspace/desktop-portfolio run build
```

Run focused checks while editing and the relevant full suite before release.

## Production output

The Vite build writes the static site to:

```text
artifacts/desktop-portfolio/dist/public/
```

Assets use relative URLs so the site can run at a domain root or nested static/FTP path. Upload the contents of `dist/public/`, not the source `public/` directory.

See `BUILD.md` for release and ZIP details.