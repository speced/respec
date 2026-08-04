# AI policy

ReSpec accepts contributions written with AI. This document says what we ask for
in return, and it applies to everyone, maintainers included.

The requirements below are not general suspicion of machines. They target
mistakes we have actually measured in AI-written pull requests to this
repository. In a review of 38 such PRs, half of the closing claims we checked
closely were overstated, two cited closed pull requests as though they were
issues, unrelated changes rode along in three PRs, and one description advertised
four fixes that were no longer in its diff. None of those are visible in the
diff, which is why we ask for them explicitly.

## Disclose it

Label the PR `ai`, and say in the description that AI was used. One label covers
everything from a whole feature to a few completions. It is not a mark against
the work; it tells a reviewer where to spend attention.

If you are a human who used AI, say so in the description. We are not going to
audit how much.

## One concern per pull request

A PR fixes one thing. A locale addition, a drive-by refactor, or a second bug fix
belongs in its own PR, even when it is a one line change and even when it is
obviously correct. Bundling is the single most common reason an AI PR takes three
review rounds instead of one.

## Say exactly what the issue asked for

Quote the issue's asks in the description and mark each one addressed or not.
Only write `Closes #N` when every ask is delivered. Otherwise write `Refs #N` and
say what is left. Before citing a number, confirm it is an issue and that it is
open.

## The test is written by a different model than the fix

This is the one requirement with no equivalent for human contributors, and it is
the point of the policy.

A model that writes a fix cannot be trusted to write the test for it, because a
test authored alongside an implementation tends to assert what the code happens
to do rather than what the report said was broken. So:

1. The test is written by a **different** model from the one writing the fix, and
   is written **from the issue alone, before the fix exists**. It has to fail on
   `main` for the reason the issue describes. Starting red is what makes passing
   later mean something.
2. The fix is then written to make that test pass.
3. Request a review from GitHub Copilot, whose job includes judging whether the
   test pins the reported behavior or something incidental. Answer every finding:
   fix it, or say why it is wrong. Do not resolve a thread silently.

In practice today that means one of Claude or Gemini writes the test and the
other writes the fix, and Copilot audits both.

## What does not count as a test

A test that cannot fail proves nothing and costs review time. We reject:

- a test that passes on `main` without the fix
- a test asserting a literal the implementation just set, or restating the
  implementation's own shape
- a test exercising a path the issue never mentioned, while the reported path
  stays uncovered
- a test whose name claims more than its body checks

## Screenshots when the change is visual

If the change alters rendered output, include before and after screenshots. If it
does not, skip them. Most AI PRs here are not visual and screenshots would prove
nothing about them.

## Say what you did not fix

List every review finding you chose not to act on, with your reason, in the PR
before asking for another round. A finding you drop silently is a decision you
made on the reviewer's behalf.

## Higher scrutiny, on purpose

AI contributions are held to a stricter standard than human ones. An AI can
produce a confident, fluent, well formatted pull request that is wrong, and can
do it faster than anyone can read. The asymmetry is the reason for the extra
requirements, and it is not personal.

We would rather have an AI attempt a real fix under these checks than a timid
one, so please do try the hard bugs.
