# AI policy

ReSpec accepts contributions written with AI. This document says what we ask for
in return.

![A cheerful pixel-art robot smiling straight at the camera while a forest burns
orange behind it. The caption reads "AI is welcome
here."](assets/ai-is-welcome-here.png)

Everything under "Everyone" applies to any contributor, maintainers included, and
it is short. The section after it describes the stricter process we run on our own
AI generated work, and asks nothing of you.

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

### Write it the way the project writes it

Generated prose has a house style of its own, and it is not ours. Three places it
shows up:

**The pull request description** is plain prose. No `## Summary`, no `## Changes`,
no `## Test plan`, no emoji, no bold section labels. If it closes an issue, that
line goes first. Then say how the bug was fixed, then anything else a reviewer
needs. Two or three sentences is usually the whole thing. Do not describe your
test plan; CI runs the tests and the reviewer can read them.

**The commit message** is one imperative subject line, lowercase after any
prefix, no trailing period. A body only when the diff genuinely cannot be
understood without one, and then a sentence or two. No bullet lists, no
"Summary", no recap of what the diff already shows. Do not add AI attribution
trailers such as `Co-Authored-By` for a model.

**Code comments** say why, not what. A comment restating the line below it is
noise a reader has to skim past, and generated code produces a lot of it. Delete
anything that would be obvious to someone reading the code. What earns a comment
is a reason that is not visible: a workaround for a browser bug, an ordering
constraint, why the obvious approach fails. The same test applies to an issue
link: keep it when the issue records that reason, drop it when it does not. A bare
`fixes #1234` in the source is the common failing case, since it tells a future
reader nothing the history does not already hold.

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

## What the maintainers hold themselves to

Nothing in this section is asked of you. It describes how we run our own AI
generated work, and it is here so you can see the standard we are applying to
ourselves rather than only to contributions.

If you are contributing, you need one model and your own judgment. You are never
expected to own a second AI subscription, or to orchestrate models against each
other, to send us a patch.

### The test is written by a different model than the fix

A model that writes a fix cannot be trusted to write the test for it, because a
test authored alongside an implementation tends to assert what the code happens
to do rather than what the report said was broken. So, in our own pipeline:

1. The test is written by a **different** model from the one writing the fix, and
   is written **from the issue alone, before the fix exists**. It has to fail on
   `main` for the reason the issue describes. Starting red is what makes passing
   later mean something.
2. The fix is then written to make that test pass.
3. A third model audits both, judging whether the test pins the reported behavior
   or something incidental. Every finding gets answered: fixed, or a reason why it
   is wrong. No thread is resolved silently.

In practice that means one of Claude or Gemini writes the test and the other
writes the fix, and Copilot audits both. This is enforceable for us only because
we control the whole pipeline. From outside a pull request, nobody could check
that the ordering happened, which is exactly why we do not ask it of anyone else.

### Higher scrutiny, on purpose

We hold this work to a stricter standard than a human's. A model can produce a
confident, fluent, well formatted pull request that is wrong, and can do it
faster than anyone can read it. That asymmetry is the reason for the extra steps.

We would rather a model attempt a real fix under these checks than a timid one,
so the hard bugs are fair game.
