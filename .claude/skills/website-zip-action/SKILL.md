---
name: website-zip-action
description: Maintains the GitHub Actions workflow that creates a deployable portfolio ZIP after every branch push. Use before changing CI, production builds, output paths, or release packaging.
---

# Website ZIP action

The repository must produce a fresh deployable website ZIP after every push to `main` or any other branch.

## Source of truth

- Workflow: `.github/workflows/website-release-zip.yml`
- Portfolio package: `@workspace/desktop-portfolio`
- Deployable build directory: `artifacts/desktop-portfolio/dist/public/`
- Download location: the corresponding run under GitHub’s **Actions** tab

The uploaded file is a GitHub Actions artifact, not a GitHub Releases entry.

## Required workflow behavior

The workflow must:

1. Trigger on pushes to every branch.
2. Allow manual `workflow_dispatch` runs.
3. Install dependencies with the repository’s locked pnpm version and frozen lockfile.
4. Typecheck `@workspace/desktop-portfolio`.
5. Build `@workspace/desktop-portfolio`.
6. ZIP the contents of `dist/public`, not the directory itself.
7. Put `index.html`, `assets/`, wallpapers, and other deployable files at the archive root.
8. Name each artifact with the branch name and short commit SHA.
9. Fail when the build or ZIP is missing.
10. Retain uploaded website artifacts for 30 days.

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
```

Inspect the archive and confirm `index.html` is at its root:

```bash
unzip -l /tmp/fes-os-website-validation.zip
```

Follow `.claude/skills/branch-first-development/SKILL.md`: leave the workflow and skill changes uncommitted until the user explicitly approves them.