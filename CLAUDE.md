# ReSpec

Browser-based tool that generates W3C specifications. Authors write HTML plus a
`<script>` tag; ReSpec handles boilerplate, cross-references, bibliography, and
validation. Around half of W3C standards are produced with it, so a regression
here reaches a lot of documents.

Build, test, code style, and the house style for pull requests, commits and
comments live in the file below, shared with other agents rather than duplicated:

@.github/copilot-instructions.md

Contributions written with AI are welcome and have a policy: @AI_POLICY.md

## Architecture

- **`src/core/`** — profile-agnostic modules (markdown, xref, dfn, biblio, etc.)
- **`src/w3c/`** — W3C-specific modules (headers, SoTD, conformance, SEO)
- **`profiles/w3c.js`** — entry point that wires modules together
- **`worker/respec-worker.js`** — Web Worker for syntax highlighting (built to `builds/`); inlined as a string in the bundle via Rollup's `text!` plugin — not loaded as a separate module at runtime
- **`src/core/base-runner.js`** — sequential module pipeline (`run()` called on each module)

The build output is an IIFE (`builds/respec-w3c.js`). Rollup captures `document.currentScript` at bundle time for `import.meta.url` resolution.

## Key modules

| Module                              | What it does                                                              |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `src/core/dfn.js` + `dfn-map.js`    | Definition registration and export                                        |
| `src/core/link-to-dfn.js`           | Resolves `<a>` tags to local `<dfn>` elements                             |
| `src/core/xref.js` + `xref-db.js`   | External term resolution via respec.org/xref API + IndexedDB cache        |
| `src/core/biblio.js`                | Bibliography from api.specref.org + IndexedDB cache                       |
| `src/core/inlines.js`               | All inline shorthand syntax: `[= =]`, `{{ }}`, `[[SPEC]]`, `[[[...]]]`, ` | var | `   |
| `src/core/webidl.js`                | WebIDL parsing (via webidl2 npm), semantic markup, auto-dfn               |
| `src/core/issues-notes.js`          | GitHub issue integration, issue/note/warning blocks                       |
| `src/core/markdown.js`              | Optional markdown processing via `marked`                                 |
| `src/core/dfn-panel.js`             | Interactive definition panels (hover/click)                               |
| `src/core/highlight.js` + `worker/` | Syntax highlighting via highlight.js in a Web Worker                      |
| `src/w3c/headers.js`                | Full W3C header/SoTD generation                                           |
| `src/w3c/seo.js`                    | Schema.org JSON-LD, canonical link (`doJsonLd: true` to enable)           |

## Inline shorthand syntax reference

```
[= term =]              → link to a local/external definition
[= For/term =]          → scoped definition link
{{ IDLInterface }}      → WebIDL type reference
{{ IDLInterface/member() }} → WebIDL member reference
[[SPEC]]                → normative reference
?[[SPEC]]               → informative reference
[[[expand]]]            → expand section title at that ID
[[[SPEC#id]]]           → cross-spec section link
[[[#id]]]               → in-document section expander
|varName|               → variable (for algorithms)
|varName: Type|         → typed variable
```

## Testing patterns

```js
// Standard test setup
import {
  makeRSDoc,
  makeStandardOps,
  errorFilters,
  warningFilters,
} from "../SpecHelper.js";
const errors = errorFilters.filter("module/name");
const warnings = warningFilters.filter("module/name");

const doc = await makeRSDoc(
  makeStandardOps({ specStatus: "WD", group: "webapps" }, body)
);
```

### Common Copilot findings (from respec-web-services experience)

These patterns apply equally to ReSpec code:

- `catch (error)` must narrow `unknown` with `instanceof Error` before accessing `.message`
- `toThrow()` can't match messages on raw string throws — use try/catch
- Env var save/restore in tests: reset per-test in `beforeEach`, not shared across specs
- `setInterval` for async work risks overlap — use self-scheduling `setTimeout` with in-flight guard
- Mock objects must match the real interface — positional args vs options object

## Post-rebase verification (MANDATORY)

After any rebase with conflicts, verify the working tree matches expectations:

- `ls` new files to confirm they exist (rebase can silently drop additions)
- `grep` for key additions (imports, function calls) in conflict-resolved files
- Run `pnpm lint` before pushing — never assume the rebase was clean

### CI lint failures on PRs

Almost always caused by the branch being behind main. Fix:

1. `git rebase main` (resolve conflicts — for `builds/` files, always take `--ours`)
2. `git diff main --name-only | xargs npx prettier --write`
3. `git push --force-with-lease`

Do NOT commit `builds/` files — CI rebuilds them. On rebase conflicts in build artifacts, take main's version.

## Pre-PR checklist (learned from Copilot reviews)

Before pushing any PR, check for these patterns that Copilot consistently flags:

**Null safety:** Every `querySelector()`, `closest()`, `getElementById()`, `getAttribute()` result must be checked before use. Never use `?? ""` on DOM queries (creates empty text nodes). Guard `append()` calls against null.

**Template literals:** No JSDoc inside `html` template literals. Wrap `<tag>` references in backticks in error messages so they display as code, not HTML.

**JSDoc:** `@param` before `@returns`, parameter order matches signature.

**URLs:** Use `encodeURIComponent()` for user values in URLs. Pin CDN versions (exception: `web-features/data.json` is intentionally unversioned to reflect current browser support).

**Accessibility:** Visual indicators need `aria-label` or equivalent. Don't rely on `title` alone.

**Tests:** Use local fixtures, never remote endpoints. Export behaviors need `getExportedDoc()` tests. Test names must match what the test body actually exercises.

**DOM node reuse:** `html` tagged template literals create DOM nodes. A DOM node can only exist in one place. If an SVG/element is used in a loop (e.g., browser icons), use a factory function (`() => html\`...\``) instead of a shared constant.

**Save/export data flow:** When `removeOnSave` or `beforesave` rewrites content, ensure the rewritten HTML preserves feature-specific URLs and context, not just a generic fallback link.

**Unused properties:** Don't declare properties in constants (e.g., `label` in a Map entry) that are never read. Copilot flags these consistently.

## Cross-spec headings API

`POST /xref/headings` on respec.org looks up section heading text by
`{spec, id}`, sourced from w3c/webref `ed/headings/`. This is what lets
`[[[SPEC#id]]]` render the actual heading rather than just the spec title.
