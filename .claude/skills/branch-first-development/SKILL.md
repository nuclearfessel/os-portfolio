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
2. Show the user a concise summary of the changes and validation results.
3. State that the work is uncommitted and name the active branch.
4. Wait for explicit approval such as “approved,” “good to go,” or an equivalent confirmation.
5. Treat requested corrections as continued work on the same branch, then repeat the validation handoff.

Do not interpret silence, a new request, or a successful automated check as approval.

## After explicit approval

1. Confirm only intended files changed.
2. Review whether the approved change requires corresponding updates to `README.md`, Claude instruction/skill files, package metadata, package exports, or package documentation. Make and validate every applicable update before committing; do not change unrelated files merely to satisfy the checklist.
3. Commit the approved work on its branch with a descriptive message.
4. Push the branch to `origin`.
5. Update local `main` without rewriting history:

   ```bash
   git switch main
   git pull --ff-only origin main
   ```

6. Merge the approved branch into `main`. Preserve the branch in history:

   ```bash
   git merge --no-ff <branch-name> -m "Merge <short description>"
   ```

7. Push `main`:

   ```bash
   git push origin main
   ```

8. Confirm that `main` matches `origin/main` and the working tree is clean.

Do not delete the branch unless the user asks.

## Safety

- Never force-push `main`.
- Never bypass the user-validation step.
- Never commit unrelated files.
- If `main` changed while awaiting approval, update it with `git pull --ff-only` and resolve any merge conflict on the feature branch before merging.
- Replit may create automatic checkpoint commits. If that happens, report it clearly and use the existing checkpoint only after the user approves; do not create duplicate commits.