# AI PR proof requirement

Status: DRAFT, not yet adopted.
Audience: Claude or any AI agent that opens or updates bug-fix pull requests for ReSpec.

This document is an implementation spec for an automated proof check. It does not replace the PR prose rules in [AI_POLICY.md](AI_POLICY.md). The rendered PR description should stay terse and plain prose; the check can rely on hidden markers, machine-readable metadata, and linked artifacts.

## Goal

When an AI claims to have fixed a bug, the pull request description must contain proof that the bug reproduced before the change and no longer reproduces after the change.

For most bugs, the primary proof is not a screenshot. The primary proof is the same deterministic repro run against the base commit and the head commit, showing fail-before and pass-after. Screenshots or rendered artifacts are additional evidence for UI, rendering, and document-generation bugs.

## Requirement

For every AI-authored bug-fix PR:

1. The PR description must include an `ai-proof` block delimited by HTML comments.
2. The visible proof in that block must stay plain prose, not a new template section with headings.
3. The proof must use the same repro command, script, test, or steps before and after the fix.
4. The before-proof must come from the closest reproducible pre-fix state, using one of these modes:
   - `base-sha`: run the repro on the PR base commit.
   - `reverted-fix`: run the repro with the fix reverted while keeping any required new test or harness in place.
   - `captured-failure`: point at a preserved failing run only when the first two modes are genuinely infeasible.
5. `base-sha` is preferred. If another mode is used, the proof must say why `base-sha` was not valid.
6. The before-proof must fail for the reason the bug describes.
7. The after-proof must pass, or otherwise show that the incorrect behavior is gone.
8. If the bug is visual, UI-based, rendering-based, or output-based, include before and after screenshots or equivalent rendered artifacts.
9. If no deterministic repro can be produced in any mode, the PR must be labeled speculative and the PR description must say exactly what blocked proof generation.

## Required proof block

Every bug-fix PR description should contain a block like this:

```md
<!-- ai-proof:start -->

Proof: `BROWSERS=ChromeHeadless pnpm test --grep "Core - Inlines"` fails in `reverted-fix` mode with `AssertionError: expected "foo" to equal "bar"` and passes on `def5678`. [before log](../blob/pr-assets/pr-123/before.txt?raw=1) [after log](../blob/pr-assets/pr-123/after.txt?raw=1) [before artifact](../blob/pr-assets/pr-123/before.png?raw=1) [after artifact](../blob/pr-assets/pr-123/after.png?raw=1)
<!-- ai-proof:
{
   "mode": "reverted-fix",
   "base": "abc1234",
   "head": "def5678",
   "repro": "BROWSERS=ChromeHeadless pnpm test --grep \"Core - Inlines\"",
   "before": "failed",
   "after": "passed",
   "blocker": "base commit does not build with the new test harness"
}
-->
<!-- ai-proof:end -->
```

## Rules for good proof

- The repro must match the reported bug, not a nearby behavior.
- The command or steps must be identical before and after, except for the declared proof mode.
- The proof must include the actual base SHA and head SHA used for the runs.
- Non-base modes must identify what was reverted or which preserved failing run is being used.
- The proof must be regenerated after new commits are pushed to the PR.
- A screenshot without a before-state and without matching repro evidence does not count as proof.
- A passing test alone does not count if it was never shown failing against the declared pre-fix state.
- The prose may summarize, but it must link the concrete output. A claim with no linked log or artifact is not proof.

## Enforcement model

This should be enforced mechanically, not left as a convention.

Suggested policy:

1. A required check validates that the PR description contains the `ai-proof` block.
2. The validator checks that the block names the current head SHA and declares a proof mode.
3. If the mode is `base-sha`, the validator checks that the block also names the current base SHA.
4. If the mode is not `base-sha`, the validator checks that the block includes a blocker explaining why `base-sha` was not valid.
5. The validator checks that the repro command is present and that the before-proof failed and the after-proof passed.
6. For UI, rendering, and output bugs, the validator checks that the before and after artifacts are present.
7. If the proof block is missing, stale, or incomplete, the PR fails validation.

## Implementation sketch

The automation can be simple:

1. Determine the PR number, base SHA, and head SHA.
2. Choose the proof mode: `base-sha` if possible, otherwise `reverted-fix`, otherwise `captured-failure`.
3. Generate the before-proof in the chosen mode.
4. Run the same repro on the head SHA.
5. Save the exit codes, logs, and optional screenshots or rendered artifacts.
6. Upload any artifacts to a stable location for the life of the PR.
7. Rewrite only the `ai-proof` block in the PR description.
8. Re-run the validator on every push.

## Artifact backend and retention

- Logs and screenshots do not need to live forever in project history.
- The backend only needs to keep evidence available while the PR is under review.
- One workable implementation is workflow artifacts for logs and a rewriteable `pr-assets` branch, or equivalent short-lived store, for images that must render inline in the PR description.
- If a branch is used, it should be treated as generated proof storage and pruned after PR close or merge.

## Non-goals

- This is not asking the AI to write a persuasive story in the PR description.
- This is not satisfied by saying "fixed" or "verified" with no evidence.
- This is not satisfied by a single after screenshot.
- This is not satisfied by a green test that was never shown failing before the patch.

## Short instruction to Claude

When you fix a bug, do not claim success without proof. Update the PR description with a plain-prose `ai-proof` block that shows the same repro against the closest reproducible pre-fix state and the head commit, with fail-before and pass-after. Prefer `base-sha`, but if that is not valid, declare the proof mode and blocker explicitly. If the bug is visual, rendering-related, or changes generated output, include before and after artifacts as well. If you cannot produce deterministic proof in any mode, mark the PR as speculative and state the blocker explicitly.
