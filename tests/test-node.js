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
  await import("./spec/core/data-abbr-spec.js");
  // for (const testSet of readdirSync(`${__dirname}/spec/`)) {
  //   await importTestSets(testSet);
  // }
})().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
