---
name: branch-first-development
description: Enforces the repository's branch, validation, commit, and merge workflow. Use before making any change in this repository.
---

# Branch-first development

Every repository update must follow this process.

## Before editing

1. Confirm the working tree and current branch:

   ```bash
   git status --short --branch
   ```

2. Do not edit on `main`.
3. Create a concise, descriptive branch from the current `main` branch:

   ```bash
   git switch main
   git pull --ff-only origin main
   git switch -c <type>/<short-description>
   ```

   Use prefixes such as `feature/`, `fix/`, `docs/`, or `chore/`.

4. If unrelated uncommitted changes already exist, stop and ask the user how to handle them. Do not discard, stash, or absorb them without approval.

## During development

- Make and verify the complete requested change on the dedicated branch.
- Do not commit while developing.
- Do not merge into `main`.
- Do not push `main`.
- Keep the user informed of the active branch when handing off work for validation.

## Validation handoff

When the work is ready:

1. Run the relevant checks.
2. Treat completed, validated work as automatically approved for GitHub.
3. Continue immediately with the completion workflow below.
4. Show the user a concise summary of the changes, validation results, merge, and release.

## After validation

Completion is an immediate, mandatory trigger for every step below. Begin the
workflow in the same turn. Never wait for a separate approval response, stop
after validation, or substitute a publish suggestion.

1. Confirm only intended files changed.
2. Review whether the completed change requires corresponding updates to `README.md`, Claude instruction/skill files, package metadata, package exports, or package documentation. Make and validate every applicable update before committing; do not change unrelated files merely to satisfy the checklist.
3. Refresh the two GitHub README screenshots from the current running previews:
   `docs/images/os-portfolio.jpg` for the OS Portfolio site and
   `docs/images/portfolio-os-ds.jpg` for the Portfolio OS DS site.
   Confirm `README.md` embeds both files.
4. Commit the completed work on its branch with a descriptive message.
5. Push the branch to `origin`.
6. Update local `main` without rewriting history:

   ```bash
   git switch main
   git pull --ff-only origin main
   ```

7. Merge the completed branch into `main`. Preserve the branch in history:

   ```bash
   git merge --no-ff <branch-name> -m "Merge <short description>"
   ```

8. Push `main`:

   ```bash
   git push origin main
   ```

9. Confirm that `main` matches `origin/main` and the working tree is clean.
10. Confirm the `main`-only GitHub release workflow completed and published all
    three required ZIP assets: the OS Portfolio site, Portfolio OS DS site, and Claude
   source packages.

Do not delete the branch unless the user asks.

## Safety

- Never force-push `main`.
- Never bypass the relevant validation checks.
- Never commit unrelated files.
- If `main` changed during development, update it with `git pull --ff-only` and resolve any merge conflict on the feature branch before merging.
- Automatic checkpoint commits may appear. If that happens, report it clearly and use the existing checkpoint rather than creating duplicate commits.