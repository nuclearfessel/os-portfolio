---
name: website-zip-action
description: Maintains the GitHub workflow that publishes a versioned deployable portfolio ZIP to GitHub Releases from main only. Use before changing CI, production builds, output paths, or release packaging.
---

# Website ZIP action

The repository must publish a fresh deployable website ZIP and Claude source ZIP to one standard GitHub release after pushes to `main` only. Feature and maintenance branches must never publish packages or prereleases.

## Source of truth

- Workflow: `.github/workflows/website-release.yml`
- Portfolio package: `@workspace/desktop-portfolio`
- Deployable build directory: `artifacts/desktop-portfolio/dist/public/`
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
12. Create a Claude source package named exactly `claude-src-pack.zip`, with no version in its filename.
13. Attach both ZIPs to the same release and replace both assets safely when rerunning the same workflow run.

Do not package source files, `node_modules`, test reports, caches, or parent `dist` directories into the website ZIP.

## When changing the portfolio build

If the Vite output directory or package name changes, update the workflow in the same branch. Never leave the workflow pointing at stale output.

Production assets must remain relative so the ZIP can be extracted at a domain root or nested static/FTP directory.

## Validation

Before asking for user approval, run:

```bash
pnpm --filter @workspace/desktop-portfolio run typecheck
pnpm --filter @workspace/desktop-portfolio run build
rm -f /tmp/fes-os-website-validation.zip
(cd artifacts/desktop-portfolio/dist/public && zip -qr /tmp/fes-os-website-validation.zip .)
unzip -tq /tmp/fes-os-website-validation.zip
bash scripts/package-claude-source.sh /tmp/claude-src-pack.zip
unzip -tq /tmp/claude-src-pack.zip
```

Inspect the site archive and confirm `index.html` is at its root. Inspect the Claude archive and confirm `DEPLOYMENT.md`, `public/index.html`, project source, and Claude skills are present:

```bash
unzip -l /tmp/fes-os-website-validation.zip
unzip -l /tmp/claude-src-pack.zip
```

Follow `.claude/skills/branch-first-development/SKILL.md`: leave the workflow and skill changes uncommitted until the user explicitly approves them.