---
name: ftp-release
description: Build and release the static desktop portfolio to a configured FTP subfolder. Use when preparing deployment files, diagnosing blank pages, or updating the hosted site.
---

# FTP Release

## Build

From the repository root:

```bash
PORT=3000 pnpm --filter @workspace/desktop-portfolio run build
```

The upload-ready output is:

```text
artifacts/desktop-portfolio/dist/public/
```

Upload the contents of `dist/public`, not the `public` directory itself.

Run typecheck before preparing release files:

```bash
pnpm --filter @workspace/desktop-portfolio run typecheck
```

## Upload procedure

1. Open the target server directory, such as `/public_html/os1/`.
2. Remove its old `index.html` and old `assets/` directory.
3. Upload the new `index.html`, `assets/`, and other files directly from `dist/public/`.
4. Verify every JavaScript and CSS URL referenced by the deployed `index.html` returns HTTP 200 with the correct MIME type.

The generated asset filenames contain hashes and change between builds. Never document or depend on a specific hash.

## Cache policy

Keep `index.html` uncached and hashed assets cached long-term. A suitable `.htaccess` file is:

```apache
<IfModule mod_headers.c>
  <Files "index.html">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </Files>

  <FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
```

## Blank-page diagnosis

If the HTML loads but the app is blank:

1. Read the deployed `index.html` and note its referenced `.js` and `.css` paths.
2. Request each asset directly.
3. A `.js` request returning a 404 HTML page will be blocked by Firefox as a disallowed `text/html` MIME type.
4. Replace the entire old release rather than mixing assets from separate builds.
5. Test the exact public subfolder URL, not the domain root.

Do not add browser-path routing to solve FTP hosting. Production uses relative asset paths and renders directly from the nested directory.

## Claude source ZIP

`claude-src-pack.zip` is the downloadable handoff bundle. Its filename is never versioned. Regenerate it after source, documentation, skill, or production-build changes.

- Include portfolio and design-system source, `CLAUDE.md`, `replit.md`, Markdown documentation, `.claude/skills/`, and a top-level `public/` copy of `dist/public/`.
- Include `DEPLOYMENT.md` explaining that the top-level `public/` folder is deployable.
- Exclude `node_modules`, package `dist` folders from the source portion, test reports/results, caches, environment files, and `*.tsbuildinfo`.
- Run `bash scripts/package-claude-source.sh claude-src-pack.zip` to build it.
- Run `unzip -tq claude-src-pack.zip` before handoff.