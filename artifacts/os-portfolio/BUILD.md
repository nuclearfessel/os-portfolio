# Build and Release

Run all commands from the repository root.

## Verify

```bash
pnpm --filter @workspace/os-portfolio run typecheck
pnpm --filter @workspace/os-portfolio run test:e2e:persistence
pnpm --filter @workspace/os-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
```

## Build

```bash
pnpm --filter @workspace/os-portfolio run build
pnpm --filter @workspace/os-portfolio-ds run build
```

The generated outputs are:

```text
artifacts/os-portfolio/dist/public/
artifacts/os-portfolio-ds/dist/
```

The release workflow combines them into one deployable site package:

```text
site-package/
├── index.html and assets/
└── os-portfolio-ds/
    ├── index.html
    └── assets/
```

The generated `index.html` files reference hashed JavaScript and CSS assets using relative URLs. Replace an older release as a complete set; do not mix either `index.html` with assets from different builds.

## GitHub release retention

GitHub must contain no more than two OS Portfolio releases at a time. After a new release is published successfully, keep that release and the immediately previous release, then permanently delete every older release.

## Static or FTP deployment

Upload the contents of the combined site package directly into the destination document root. Keep `os-portfolio-ds/` inside that upload so the portfolio’s Design System button opens `/os-portfolio-ds/`. Do not upload `artifacts/os-portfolio/public/`; that is Vite source input and is not a complete build.

## Downloadable Claude bundle

`claude-os-portfolio-source.zip` contains:

- OS Portfolio and OS Portfolio DS source
- Relevant repository and artifact Markdown documentation
- Claude skill files
- A top-level `public/` deployment directory containing the portfolio build and the design-system build at `public/os-portfolio-ds/`
- A top-level `DEPLOYMENT.md`

The source portion excludes dependencies, package build output, Playwright reports/results, caches, environment files, and TypeScript build-info files. Validate the completed archive with:

```bash
unzip -tq claude-os-portfolio-source.zip
```