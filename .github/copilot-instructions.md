# Copilot instructions for ReSpec

ReSpec is a browser-based tool that generates W3C specifications. Authors write
HTML plus a `<script>` tag, and ReSpec fills in boilerplate, cross-references,
bibliography, and validation. Roughly half of W3C standards are produced with it,
so a regression here reaches a lot of documents.

Contributions written with AI are welcome and have a policy: see
[AI_POLICY.md](../AI_POLICY.md). Read it before opening a pull request.

## Build and test

This is the whole sequence. The build is part of it, and so are `BROWSERS` and
`PUPPETEER_CACHE_DIR`:

```bash
export PUPPETEER_CACHE_DIR="$PWD/.cache/puppeteer"
pnpm i --frozen-lockfile
pnpm lint                 # tsc -p src/jsconfig.json && eslint .
pnpm build:w3c && pnpm build:geonovum && pnpm build:aom && pnpm build:dini
BROWSERS=ChromeHeadless pnpm test        # unit then integration, via karma
pnpm test:build                          # the builder tool
pnpm test:headless                       # renders examples through puppeteer
```

**Always set `BROWSERS`, or pass `--browsers`.** No karma config sets a default, so
`pnpm test` on its own launches nothing, waits for a browser to connect by hand, and
hangs until something kills it. Nothing in the output says so; it simply stops after
printing `START:`.

**Set `PUPPETEER_CACHE_DIR` to `$PWD/.cache/puppeteer` for anything that launches a
browser**, which includes `pnpm test:headless` via `tools/respecDocWriter.js`. The
agent environment provisions the browser there rather than in the default home
cache, so puppeteer will not find it unless pointed at the same place.

Karma reads the bundles in `builds/`, not `src/`. A source change has no effect on
the tests until the bundle is rebuilt, which is why the build sits above the test
line rather than being mentioned afterwards.

There is one bundle per profile. Building only `w3c` leaves the Geonovum, DiNI and
AOM suites testing the previous code, which looks like a passing or failing test
that has nothing to do with the change. If a change that provably does nothing
alters a test result, suspect a stale bundle before suspecting the test.

Never commit anything under `builds/`. CI rebuilds it, and a PR touching it fails
a dedicated check.

To run a single suite, rebuild first, then pass the describe block. Integration and
unit suites use different configs:

```bash
pnpm build:w3c
npx karma start tests/spec/karma.conf.cjs --single-run --browsers ChromeHeadless --grep="Core - Inlines"
npx karma start tests/unit/karma.conf.cjs --single-run --browsers ChromeHeadless
```

`--grep` is a literal string match. Alternation does not work, and only the last
`--grep` counts, so run separate invocations instead.

## Code style

Prefer functional style over imperative loops: `forEach`, `map`, `filter`, `find`,
`reduce`, `some`, `every`. Use an early `return` inside `forEach` rather than
`continue`. `NodeList`, `Map` and `Set` have `forEach` natively, so prefer
`nodeList.forEach()` over `[...nodeList].forEach()` and avoid the extra array.

Every `querySelector`, `closest`, `getElementById` and `getAttribute` result is
possibly null; check before use. Do not paper over it with `?? ""`, because the
empty string then flows on into an `html` template and renders as an empty text
node, so the bug shows up later as missing output rather than as a null failing
where it happened.

Write en-US English everywhere, including comments and identifiers: behavior,
color, license, center, analyze, initialize, serialize. Leave existing en-GB
spelling alone when it is load-bearing, such as an established identifier or a
verbatim quotation.

Run `npx prettier --write` on changed files. CI fails on unformatted code.

## Pull requests, commits, and comments

The house style is in [AI_POLICY.md](../AI_POLICY.md) under "Write it the way the
project writes it". In short:

- Pull request descriptions are plain prose. No `## Summary`, no `## Changes`, no
  `## Test plan`, no emoji, no bold section labels. A closing reference goes on
  the first line.
- `Closes #N` only when every ask in the issue is delivered, otherwise `Refs #N`.
  Confirm the number is an issue and not a pull request before citing it.
- Commit messages are one imperative subject line, lowercase after any prefix, no
  trailing period, and no body unless the diff cannot be understood without one.
  Never add `Co-Authored-By` for a model.
- Comments say why, not what. Delete a comment that restates the line below it.
  No bare `fixes #1234` in source.

## Tests

A test that cannot fail is worse than no test, because it costs review time and
implies coverage that does not exist. A regression test must fail on `main` for
the reason the issue describes, and pass with the fix. Do not assert a literal the
implementation just set, and do not exercise a path the issue never mentioned
while the reported path stays uncovered.

One concern per pull request. A locale addition or a drive-by refactor belongs in
its own PR even when it is one line and obviously correct.

## Adding a module

A new module under `src/core/` exports `name` and a `run(conf)`. `run` may be
synchronous or async, whichever the work needs: most core modules are synchronous,
and only the ones that fetch or await something are not. The module must be
registered in every profile that needs it: `profiles/w3c.js`, `profiles/geonovum.js`,
`profiles/aom.js`, `profiles/dini.js`. Tests go in `tests/spec/core/`. If the module
uses `getIntlData`, add a Czech (`cs`) entry.
