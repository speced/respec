/**
 * Module core/linter
 *
 * Core linter module. Exports a linter object.
 */
import { pub } from "core/pubsubhub";
export const name = "core/linter";
const privates = new WeakMap();

class Linter {
  constructor() {
    privates.set(this, {
      rules: new Set(),
    });
  }
  get rules() {
    return privates.get(this).rules;
  }
  register(...newRules) {
    newRules.reduce((rules, newRule) => rules.add(newRule), this.rules);
  }
  async lint(conf, doc = window.document) {
    const promisesToLint = [...privates.get(this).rules].map(rule =>
      toLinterWarning(rule.lint(conf, doc))
    );
    await promisesToLint;
  }
}

const linter = new Linter();
export default linter;

const baseResult = {
  name: "unknown",
  description: "",
  occurrences: 0,
  howToFix: "",
  offendingElements: [], // DOM Nodes
  help: "", // where to get help
};

async function toLinterWarning(promiseToLint) {
  const results = await promiseToLint;
  results
    .map(async resultPromise => {
      const result = await resultPromise;
      const output = { ...baseResult, ...result };
      const {
        description,
        help,
        howToFix,
        name,
        occurrences,
        offendingElements,
      } = output;
      const msg = `${description} ${howToFix} ${help} ("${name}" x ${occurrences})`;
      offendingElements.forEach(elem => {
        elem.classList.add("respec-offending-element");
      });
      console.warn(`Linter (${name}):`, description, ...offendingElements);
      return msg;
    })
    .forEach(async msgPromise => {
      pub("warn", await msgPromise);
    });
}

export async function run(conf, doc, cb) {
  cb(); // return early, continue processing other things
  if (conf.lint === false) {
    return; // nothing to do
  }
  await document.respecReady;
  try {
    await linter.lint(conf, doc);
  } catch (err) {
    console.error("Error ocurred while running the linter", err);
  }
}
