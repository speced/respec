/* global process, global */

import expect from "expect";
import { mochaGlobals } from "tap";

// import { readdirSync } from "fs";

mochaGlobals();
global.afterAll = global.after;
global.beforeAll = global.before;
global.expect = expect;

// async function importTestSets(name) {
//   const base = `${__dirname}/spec/${name}/`;
//   for (const test of readdirSync(base)) {
//     await import(base + test);
//   }
// }

(async () => {
  // await import("./spec/core/reindent.js");
  // await import("./spec/core/style.js");
  // await import("./spec/w3c/style.js");
  // await import("./spec/core/l10n.js");
  // await import("./spec/core/github.js");
  // await import("./spec/core/markdown.js");
  // await import("./spec/w3c/headers.js");
  // await import("./spec/w3c/abstract.js");
  await import("./spec/core/data-abbr-spec.js");
  // await import("./spec/core/data-abbr.js");
  // await import("./spec/core/inlines.js");
  // await import("./spec/w3c/conformance.js");
  // await import("./spec/core/dfn.js");
  // await import("./spec/core/pluralize.js");
  // await import("./spec/core/examples.js");
  // await import("./spec/core/issues-notes.js");
  // await import("./spec/core/requirements.js");
  // await import("./spec/core/best-practices.js");
  // await import("./spec/core/figures.js");
  // await import("./spec/core/webidl.js");
  // await import("./spec/core/data-cite.js");
  // await import("./spec/core/biblio.js");
  // await import("./spec/core/webidl-index.js");
  // await import("./spec/core/link-to-dfn.js");
  // await import("./spec/core/render-biblio.js");
  await import("./spec/core/contrib-spec.js");
  // await import("./spec/core/fix-headers.js");
  // await import("./spec/core/structure.js");
  // await import("./spec/core/informative.js");
  // await import("./spec/core/id-headers.js");
  // await import("./spec/core/caniuse.js");
  // await import("./spec/core/mdn-annotation.js");
  // await import("./spec/ui/save-html.js");
  // await import("./spec/ui/search-specref.js");
  // await import("./spec/ui/dfn-list.js");
  // await import("./spec/ui/about-respec.js");
  // await import("./spec/core/seo.js");
  // await import("./spec/w3c/seo.js");
  // await import("./spec/core/highlight.js");
  // await import("./spec/core/webidl-clipboard.js");
  // await import("./spec/core/data-tests.js");
  // await import("./spec/core/list-sorter.js");
  // await import("./spec/core/highlight-vars.js");
  // await import("./spec/core/data-type.js");
  // await import("./spec/core/algorithms.js");
  // await import("./spec/core/anchor-expander.js");
  // for (const testSet of readdirSync(`${__dirname}/spec/`)) {
  //   await importTestSets(testSet);
  // }
})().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
