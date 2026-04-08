# ReSpec MCP LLM Authoring Guide

## Purpose

This guide is for LLMs and AI-assisted editors operating the `respec-mcp`
tools. It is intended to make the MCP useful for actual W3C-style document
authoring, not just HTML rendering.

Use this guide when drafting, revising, validating, or preflighting Community
Group reports, final reports, and standards-transition documents.

## Read First

Before generating report content, load these sources:

1. The target repo's `respec-mcp.config.json`
2. The target repo profile JSON under `respec-mcp/profiles/`
3. W3C Community Group report requirements:
   - <https://www.w3.org/community/reports/reqs/>
4. If the document is meant to support later standards work:
   - <https://www.w3.org/guide/standards-track/>
   - <https://www.w3.org/guide/process/cg-transition.html>
   - <https://www.w3.org/community/about/faq/#how-do-community-groups-make-it-easier-to-move-to-the-standards-track>

Do not start from generic “spec writing” habits alone. Use the repo profile and
the W3C requirements as the controlling constraints.

## Document Type Discipline

Choose the document type before drafting:

- `CG-DRAFT`: active Community Group draft report.
- `CG-FINAL`: stabilized Community Group final report.
- Transition/support report: a CG draft report whose purpose is to prepare
  adoption by a Working Group or another standards-track venue.
- Explainer: a problem-and-proposal document for design discussion.

Do not confuse these types.

In particular:

- A Community Group report is **not** a W3C Standard.
- A transition report is **not** itself a standards-track specification.
- An explainer should not be mislabeled as the normative specification.

## Community Group Report Requirements

When authoring CG reports, ensure the document satisfies the report
requirements:

- Use the correct Community Group draft or final logo and style. ReSpec can
  handle this when `specStatus` is set correctly.
- Include the group name and a link to the public group page.
- Include a publication date.
- Do not use the W3C organization logo.
- Do not cause confusion about standards status.
- Make contribution history easy to find.
- For final reports, ensure the final-report-specific FSA requirements are met.
- Do not introduce third-party tracking that violates W3C privacy policy.

For authoring text, prefer the exact W3C framing. Do not improvise stronger or
weaker status language if the official boilerplate already covers the point.

## Standards-Track Readiness Guidance

When writing a report that aims to support later standards-track adoption, make
the following explicit:

- Clear problem statement.
- Explicit success criteria.
- Well-socialized proposal, or a clear explanation of what socialization is
  still missing.
- Maturity level of the draft and what remains incubation-specific.
- Evidence of user, implementer, and reviewer interest.
- Evidence package: tests, implementations, interoperability work, opposition,
  risks, and IPR readiness.
- Clear statement that W3C is not being asked for a rubber stamp.

Do not write a transition report as if a Working Group decision were already
made.

## Structural Patterns to Reuse

These patterns repeatedly help Community Group work transition well:

- Keep the title focused on the problem being solved, not only on process stage.
- Separate the **problem**, the **proposed scope**, and the **evidence gaps**.
- Distinguish what is candidate normative core from what remains informative,
  project-specific, or experimental.
- Include links to issue tracker, repository, and commit history.
- If using a reference implementation, say so directly and explain which parts
  are implementation detail versus candidate standard surface.
- For transition-oriented reports, include a short adoption path:
  incubation -> final Community Group report -> Working Group adoption.

## Real W3C Examples

Use these examples as structural models.

### 1. Presentation API: Community Group report used as WG starting point

Sources:

- Second Screen Community Group:
  <https://www.w3.org/community/webscreens/>
- Transition announcement:
  <https://www.w3.org/community/webscreens/2014/12/03/transitioning-the-presentation-api-to-the-second-screen-presentation-working-group/>
- Second Screen Presentation Working Group Charter:
  <https://www.w3.org/2014/secondscreen/charter.html>

Why it matters:

- The Community Group published a final report specifically to provide a
  concrete starting point for the Working Group.
- The charter says the initial version of the WG deliverable would be copied
  from the Community Group final report.
- The charter also separates what remains in scope for the WG from future
  incubations in the CG.

What to copy:

- Narrow initial deliverable.
- Clear Working Group scope.
- Explicit bridge from CG final report to adopted draft.

### 2. Decentralized Identifiers: final CG specification plus later WG adoption

Sources:

- DID v0.13 Final Community Group Report:
  <https://www.w3.org/2019/08/did-20190828/>
- DID WG minutes on adopting the final report:
  <https://www.w3.org/2019/09/15-did-minutes.html>
- DID WG charter example:
  <https://www.w3.org/2024/03/proposed-wg-did.html>

Why it matters:

- The final CG report has a strong public surface: GitHub, bugs, commit
  history, participation, and status boilerplate.
- The Working Group explicitly discussed adopting the CG final report as the
  first editors’ draft.
- Later charters continue to identify incubated deliverables with draft state
  such as “Draft Community Group Report”.

What to copy:

- Make contribution history and participation easy to find.
- Preserve a direct line from CG report to WG adopted draft.
- Be precise about each deliverable’s draft state.

### 3. Verifiable Credentials WG charter: CG drafts as initial drafts

Source:

- Proposed VC WG charter:
  <https://www.w3.org/2026/02/proposed-vc-wg-charter.html>

Why it matters:

- The charter lists multiple new normative specifications and, for each, states
  draft state, expected completion, and the initial draft or adopted draft.
- Several entries explicitly start from Draft Community Group Reports.

What to copy:

- Make future charter extraction easy.
- For each candidate deliverable, state scope, current draft state, and what
  existing document would serve as the initial or adopted draft.

### 4. Touch Events final report: polished final-report surface

Source:

- Touch Events - Level 2:
  <https://www.w3.org/community/reports/touchevents/CG-FINAL-touch-events-20240704/>

Why it matters:

- It shows a clean final-report structure with repository, bug tracker, commit
  history, mailing list, boilerplate, and explicit relation to adjacent work.
- It includes a direct note about maintenance status and legacy position.

What to copy:

- Strong public participation surface.
- Clear status language.
- Explicit relationship to adjacent or successor work.

## Instructions for LLMs Using `respec-mcp`

When operating this MCP, follow this sequence:

1. `respec_list_profiles`
   - discover the profile and allowed statuses.
2. Read the repo-local profile and templates.
3. If the target is a W3C/CG report, read the W3C report requirements.
4. If the target supports later standards work, read the W3C readiness and CG
   transition guidance.
5. Draft or edit the source.
6. Run `respec_validate`.
7. Run `respec_preflight`.
8. Only then run `respec_build`.

While writing:

- Keep paragraphs short.
- Prefer concrete section headings over vague narrative.
- Focus titles on the problem or deliverable, not only on process mechanics.
- Do not claim endorsement or standards status.
- Separate normative candidate content from reference-implementation detail.
- Include issue tracker, repository, and contribution history links whenever
  appropriate.
- If a report supports standards-track transition, include:
  - problem statement
  - success criteria
  - evidence and implementation status
  - standards-track scope proposal
  - evidence gaps and next steps

## What Not to Do

- Do not label a Community Group report as a W3C Standard.
- Do not imply that a Working Group will merely rubber-stamp an existing draft.
- Do not carry over all implementation detail from a reference implementation
  into candidate normative text.
- Do not omit evidence gaps just because the project has a working codebase.
- Do not reduce the MCP workflow to “render whatever text already exists”.

The MCP should help produce reviewable, standards-aware documents.
