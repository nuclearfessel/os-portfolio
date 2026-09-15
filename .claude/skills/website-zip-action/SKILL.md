---
name: website-zip-action
description: Maintains the GitHub workflow that publishes versioned deployable OS Portfolio and OS Portfolio DS ZIPs to GitHub Releases from main only. Use before changing CI, production builds, output paths, or release packaging.
---

# Website ZIP action

The repository must publish fresh deployable OS Portfolio and OS Portfolio DS ZIPs plus the Claude source ZIP to one standard GitHub release after pushes to `main` only. Feature and maintenance branches must never publish packages or prereleases.

## Source of truth

- Workflow: `.github/workflows/website-release.yml`
- OS Portfolio package: `@workspace/desktop-portfolio`
- Deployable build directory: `artifacts/os-portfolio/dist/public/`
- OS Portfolio DS package: `@workspace/portfolio-os-ds`
- Deployable OS Portfolio DS build directory: `artifacts/os-portfolio-ds/dist/`
- Claude source packaging script: `scripts/package-claude-source.sh`
- Download location: the repository’s **Releases** section

## Required workflow behavior

The workflow must:

1. Trigger automatically only on pushes to `main`.
2. Allow manual `workflow_dispatch` runs, but guard the release job so it runs only when the selected ref is `main`.
3. Install dependencies with the repository’s locked pnpm version and frozen lockfile.
4. Typecheck `@workspace/desktop-portfolio`.
5. Build `@workspace/desktop-portfolio`.
6. ZIP the contents of `dist/public`, not the directory itself.
7. Put `index.html`, `assets/`, wallpapers, and other deployable files at the archive root.
8. Name the deployable ZIP `site-package-vMM.NN.zip`, using the workflow run number to increment from `v01.01` through `v01.99`, then roll over to `v02.01`.
9. Fail when the build or ZIP is missing.
10. Never create prereleases.
11. Publish `main` builds as standard GitHub releases.
12. Typecheck and build `@workspace/portfolio-os-ds`.
13. ZIP the contents of the design-system `dist` directory at the archive root.
14. Name it `design-system-package-vMM.NN.zip` using the same release version.
15. Create a Claude source package named exactly `claude-src-pack.zip`, with no version in its filename.
16. Attach all three ZIPs to the same release and replace all assets safely when rerunning the same workflow run.

Do not package source files, `node_modules`, test reports, caches, or parent `dist` directories into the website ZIP.

## When changing the portfolio build

If the Vite output directory or package name changes, update the workflow in the same branch. Never leave the workflow pointing at stale output.

Production assets must remain relative so the ZIP can be extracted at a domain root or nested static/FTP directory.

## Validation

Before asking for user approval, run:

```bash
pnpm --filter @workspace/desktop-portfolio run typecheck
pnpm --filter @workspace/desktop-portfolio run build
pnpm --filter @workspace/portfolio-os-ds run typecheck
pnpm --filter @workspace/portfolio-os-ds run build
rm -f /tmp/os-portfolio-website-validation.zip
(cd artifacts/os-portfolio/dist/public && zip -qr /tmp/os-portfolio-website-validation.zip .)
unzip -tq /tmp/os-portfolio-website-validation.zip
rm -f /tmp/os-portfolio-ds-validation.zip
(cd artifacts/os-portfolio-ds/dist && zip -qr /tmp/os-portfolio-ds-validation.zip .)
unzip -tq /tmp/os-portfolio-ds-validation.zip
bash scripts/package-claude-source.sh /tmp/claude-src-pack.zip
unzip -tq /tmp/claude-src-pack.zip
```

Inspect both deployable archives and confirm `index.html` is at each root. Inspect the Claude archive and confirm `DEPLOYMENT.md`, `public/index.html`, project source, and Claude skills are present:

```bash
unzip -l /tmp/os-portfolio-website-validation.zip
unzip -l /tmp/os-portfolio-ds-validation.zip
unzip -l /tmp/claude-src-pack.zip
```

Follow `.claude/skills/branch-first-development/SKILL.md`: leave the workflow and skill changes uncommitted until the user explicitly approves them.