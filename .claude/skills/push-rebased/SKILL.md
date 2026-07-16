---
name: push-rebased
description: Land the current branch/worktree's work on main as rebased commits, fast-forward main, push, and delete the branch/worktree. Use when the user says "push a rebased commit on main", "land this on main", "ship this to main", or similar — especially from a feature branch or worktree.
---

# Push rebased onto main

Lands the current work directly on `main` — no PR, no squash — by rebasing
onto the latest `origin/main` and fast-forwarding. This intentionally bypasses
the normal PR flow; only use it when the user asks for exactly this (or
invokes this skill by name).

## Steps

1. **Check for uncommitted changes.** `git status`. If there's anything
   uncommitted that looks intentional (not stray scratch files), commit it
   first following the normal commit conventions: review `git diff`/`git log`
   for style, draft a message focused on *why*, stage specific files (never
   blanket `git add -A`), commit with a heredoc ending in the
   `Co-Authored-By: Claude <noreply@anthropic.com>` line. If anything looks
   suspicious (secrets, unrelated files), stop and ask.

2. **Identify context.** `git branch --show-current` and check whether the
   working directory is a worktree (`git rev-parse --show-toplevel` vs the
   main repo path, or check if we were entered via EnterWorktree this
   session).
   - **Already on `main`:** `git pull --rebase origin main` to pick up any
     remote movement, then skip to step 5 (run tests).
   - **On a feature branch (worktree or not):** continue to step 3.

3. **Rebase onto latest main.** `git fetch origin main`, then
   `git rebase origin/main` on the feature branch. Keep every commit as-is —
   do **not** squash (this repo's convention: rebase preserves the branch's
   individual commits, it doesn't collapse them).
   - **On conflict:** stop. Report the conflicting files and let the user
     resolve them — never auto-resolve with `--theirs`/`--ours` or skip
     commits silently.

4. **Fast-forward main.**
   - If in the main worktree/checkout: `git switch main` (or `checkout`),
     then `git merge --ff-only <branch>`. This only succeeds because the
     branch was just rebased onto main's tip — if it doesn't fast-forward,
     stop and re-rebase rather than forcing a merge commit.
   - If in a *separate* git worktree for the branch: run the fast-forward
     merge from the main worktree/checkout, not from inside the feature
     worktree.

5. **Run the tests before pushing.** This push bypasses GitHub's required
   "test" status check (see Notes), so this is the only gate left — treat it
   as load-bearing, not a formality. Run `npm test` (`vitest run`) against
   the fast-forwarded `main` (i.e. after step 4, so you're testing exactly
   what's about to be pushed).
   - **All tests pass:** continue to step 6.
   - **Any test fails:** stop. Do not push. Report the failing test(s) to the
     user and wait for direction — don't try to fix-and-retry unprompted.
   - **The suite errors out before running any tests** (e.g. a
     `require`/module-resolution crash rather than an assertion failure):
     this is a different failure mode than a real regression — don't treat
     it as "tests failed" and silently push anyway, but don't assume it's a
     pre-existing environment quirk either unless you've verified that by
     reproducing the same failure on `origin/main` with the rebase/changes
     stashed out. Report exactly what you found either way and let the user
     decide whether to proceed.

6. **Push.** `git push origin main`. Never `--force` — a clean fast-forward
   should never need it. If the push is rejected because `origin/main` moved,
   re-fetch and re-rebase (step 3), re-run the tests (step 5), and push again
   rather than forcing.

7. **Clean up the branch/worktree** (only after tests pass and the push
   succeeds):
   - Delete the local branch: `git branch -d <branch>` (safe delete — refuses
     if unmerged, which shouldn't happen post-fast-forward).
   - Delete the remote branch if one exists: `git push origin --delete
     <branch>`.
   - If the work happened in a git worktree, remove it — use the
     `ExitWorktree` tool if this session entered it via `EnterWorktree`
     (pass `action: "remove"` or equivalent), otherwise
     `git worktree remove <path>`.
   - Never delete/clean up anything the user didn't create for this task —
     if unsure whether a branch or worktree predates this session's work,
     ask first.

8. **Report back.** One or two sentences: what got pushed (commit count/
   summary), test results, and confirmation the branch/worktree was cleaned
   up.

## Notes

- This repo's branch protection on `main` requires a "test" status check;
  pushing directly here bypasses it (GitHub will report "Bypassed rule
  violations" on push). That's expected for this workflow — don't treat it
  as an error.
- If `main` has diverged in a way that doesn't fast-forward even after a
  clean rebase (e.g. someone force-pushed `main` itself), stop and ask the
  user rather than guessing how to reconcile.
- **Known issue (as of 2026-07-16):** `npm test` in this environment can fail
  the entire suite before any test runs, with
  `Error: require() of ES Module .../@exodus/bytes/encoding-lite.js ...
  ERR_REQUIRE_ESM` from `html-encoding-sniffer` (a jsdom dependency). This was
  confirmed to reproduce identically on a clean `origin/main` checkout, so
  it's an environment/dependency issue, not something any particular change
  caused. If you hit this exact signature, mention it but don't block the
  push solely because of it — do still block on any other failure. Don't
  assume future instances of this error are automatically the same
  pre-existing issue, though — verify by reproducing it on `origin/main` per
  step 5, since a real regression could coincidentally throw during module
  loading too.
