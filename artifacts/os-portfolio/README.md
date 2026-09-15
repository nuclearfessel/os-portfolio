# OS Portfolio Desktop Portfolio

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

The virtual `~/work` directory contains:

- `northstar-commerce-system.md`
- `signal-operations-platform.md`
- `mosaic-health-toolkit.md`
- `fieldnote-collaboration-kit.md`

## Desktop keyboard shortcuts

- `1` — About
- `2` — Work
- `3` — Contact
- `4` — Terminal
- `5` — Stickies
- `6` — Shortcuts
- `7` — Settings
- `Command/Control + Shift + X` — close the topmost portfolio window
- `Command/Control + Alt/Option + Shift + X` — close all portfolio windows

The Shortcuts drawer closes with `Escape`, an outside click, or its Dock trigger.
Number shortcuts remain inactive while editing a color value.

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @workspace/os-portfolio run dev
```

The development server binds to the `PORT` environment variable.

## Validation

```bash
pnpm --filter @workspace/os-portfolio run typecheck
pnpm --filter @workspace/os-portfolio run test:e2e:persistence
pnpm --filter @workspace/os-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
pnpm --filter @workspace/os-portfolio run build
```

Run focused checks while editing and the relevant full suite before release.

## Production output

Build both the portfolio and the design-system site:

```bash
pnpm --filter @workspace/os-portfolio run build
pnpm --filter @workspace/os-portfolio-ds run build
```

The deployable site package combines both outputs:

```text
site-package/
├── index.html and assets/       ← artifacts/os-portfolio/dist/public/
└── os-portfolio-ds/             ← artifacts/os-portfolio-ds/dist/
```

Upload that combined directory as one unit. The Design System button opens `/os-portfolio-ds/`, so that directory must remain inside the site deployment at the domain root. Do not upload the source `public/` directory.

See `BUILD.md` for release and ZIP details.