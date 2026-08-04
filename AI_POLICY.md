# AI policy

ReSpec accepts contributions written with AI. This document says what we ask for
in return.

It has two audiences, because two very different things get called AI
contribution. Everything under "Everyone" applies to any contributor, maintainers
included. Everything under "Generated pipelines" applies where a maintainer runs
models to produce contributions at volume, or an autonomous account opens PRs
directly. Those requirements are stricter because in that setting we control the
pipeline and can actually enforce the ordering, which nobody can verify from
outside a PR.

## Everyone

### You are responsible for what you submit

By opening a pull request you are stating that you understand every line of it,
that you have run it, and that you have the right to contribute it under the
project's license. Responsibility for correctness, security, and copyright sits
with you, not with the tool you used. We will not accept "the AI wrote it" as an
account of a defect.

Two specific things to check before submitting, because generated code gets them
wrong in ways that read as plausible: that every package you import actually
exists and is one we already depend on or that you are deliberately adding, and
that every DOM or platform API you call is real. Invented dependencies and
invented APIs are the two failure modes we see most.

### Disclose it

If AI generated logic in your contribution, label the PR `AI` and say so in the
description. Generated logic means an agent, a function, an algorithm, a test, a
feature: something you would otherwise have had to work out.

Editor autocomplete, a rename refactor, or a model helping you word a comment do
not need the label. The label exists to tell a reviewer where to spend attention,
not to tally tool use, and a label on everything tells them nothing.

### One concern per pull request

A PR fixes one thing. A locale addition, a drive-by refactor, or a second bug fix
belongs in its own PR, even when it is a one line change and even when it is
obviously correct. Bundling is the most common reason an AI PR takes three review
rounds instead of one.

### Say exactly what the issue asked for

Quote the issue's asks in the description and mark each one addressed or not.
Only write `Closes #N` when every ask is delivered. Otherwise write `Refs #N` and
say what is left. Before citing a number, confirm it is an issue rather than a
pull request, and that it is open.

### What does not count as a test

This applies to every contribution, from anyone. A test that cannot fail proves
nothing and costs review time. We reject:

- a test that passes on `main` without the fix
- a test asserting a literal the implementation just set, or restating the
  implementation's own shape
- a test exercising a path the issue never mentioned, while the reported path
  stays uncovered
- a test whose name claims more than its body checks

### Screenshots when the change is visual

If the change alters rendered output, include before and after screenshots. If it
does not, skip them. Most AI PRs here are not visual and screenshots would prove
nothing about them.

### Say what you did not fix

List every review finding you chose not to act on, with your reason, in the PR
before asking for another round. A finding you drop silently is a decision you
made on the reviewer's behalf.

## Generated pipelines

These apply to maintainers running models at volume and to autonomous accounts.
They are not asked of outside contributors, who cannot be held to an ordering
nobody can verify.

### The test is written by a different model than the fix

A model that writes a fix cannot be trusted to write the test for it, because a
test authored alongside an implementation tends to assert what the code happens
to do rather than what the report said was broken. So:

1. The test is written by a **different** model from the one writing the fix, and
   is written **from the issue alone, before the fix exists**. It has to fail on
   `main` for the reason the issue describes. Starting red is what makes passing
   later mean something.
2. The fix is then written to make that test pass.
3. A third model audits both, judging whether the test pins the reported behavior
   or something incidental. Answer every finding: fix it, or say why it is wrong.
   Do not resolve a thread silently.

In practice today that means one of Claude or Gemini writes the test and the
other writes the fix, and Copilot audits both. Copilot is what we use because it
is already wired into review here; nothing about the requirement depends on that
particular tool, and no outside contributor is expected to buy it.

### Higher scrutiny, on purpose

Work from these pipelines is held to a stricter standard than a human's. A model
can produce a confident, fluent, well formatted pull request that is wrong, and
can do it faster than anyone can read it. The asymmetry is the reason for the
extra requirements, and it is not personal.

We would rather a model attempt a real fix under these checks than a timid one,
so please do try the hard bugs.
