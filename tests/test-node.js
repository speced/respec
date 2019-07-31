/* global process, global */

// // import { readdirSync } from "fs";

// async function importTestSets(name) {
//   const base = `${__dirname}/spec/${name}/`;
//   for (const test of readdirSync(base)) {
//     await import(base + test);
//   }
// }

import Jasmine from "jasmine";
import JasmineConsoleReporter from "jasmine-console-reporter";

const jasmine = new Jasmine();
jasmine.addReporter(
  new JasmineConsoleReporter({
    colors: true,
    cleanStack: true,
    verbosity: 4,
    listStyle: "indent",
    activity: false,
  })
);

global.describe = jasmine.env.describe;
global.it = jasmine.env.it;
global.afterAll = jasmine.env.afterAll;
global.afterEach = jasmine.env.afterEach;
global.beforeAll = jasmine.env.beforeAll;
global.beforeEach = jasmine.env.beforeEach;

(async () => {
  await import("./spec/core/anchor-expander-spec.js");
  await import("./spec/core/biblio-spec.js");
  await import("./spec/core/contrib-spec.js");
  await import("./spec/core/data-abbr-spec.js");
  await import("./spec/core/fix-headers-spec.js");
  await import("./spec/core/id-headers-spec.js");
  await import("./spec/core/informative-spec.js");
  await import("./spec/core/structure-spec.js");
  await import("./spec/core/xref-spec.js");
  await import("./spec/w3c/abstract-spec.js");
  await import("./spec/w3c/defaults-spec.js");
  await import("./spec/w3c/headers-spec.js");
  // for (const testSet of readdirSync(`${__dirname}/spec/`)) {
  //   await importTestSets(testSet);
  // }
  jasmine.execute();
})().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
