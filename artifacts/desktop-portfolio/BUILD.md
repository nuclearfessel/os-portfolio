# Build and Release

Run all commands from the repository root.

## Verify

```bash
pnpm --filter @workspace/desktop-portfolio run typecheck
pnpm --filter @workspace/desktop-portfolio run test:e2e:persistence
pnpm --filter @workspace/desktop-portfolio exec playwright test tests/responsive-layout.spec.ts --project=chromium
```

## Build

```bash
pnpm --filter @workspace/desktop-portfolio run build
```

The generated static site is:

```text
artifacts/desktop-portfolio/dist/public/
```

The generated `index.html` references hashed JavaScript and CSS assets using relative URLs. Replace an older release as a complete set; do not mix `index.html` and assets from different builds.

## Static or FTP deployment

Upload the contents of `dist/public/` directly into the destination document root or nested site directory. Do not upload `artifacts/desktop-portfolio/public/`; that is Vite source input and is not a complete build.

## Downloadable Claude bundle

`claude-desktop-portfolio-source.zip` contains:

- Portfolio OS and shared design-system source
- Relevant repository and artifact Markdown documentation
- Claude skill files
- A top-level `public/` directory copied from the latest `dist/public/`
- A top-level `DEPLOYMENT.md`

The source portion excludes dependencies, package build output, Playwright reports/results, caches, environment files, and TypeScript build-info files. Validate the completed archive with:

```bash
unzip -tq claude-desktop-portfolio-source.zip
```