/**
 * Module core/linter
 *
 * Core linter module. Exports a linter object.
 */
import { pub } from "./pubsubhub";
import { showInlineWarning } from "./utils";
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
  results.forEach(async resultPromise => {
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
    const message = `Linter (${name}): ${description} ${howToFix} ${help}`;
    if (offendingElements.length) {
      showInlineWarning(offendingElements, `${message} Occured`);
    } else {
      pub("warn", `${message} (Count: ${occurrences})`);
    }
  });
}

export function run(conf) {
  if (conf.lint === false) {
    return; // nothing to do
  }
  // return early, continue processing other things
  (async () => {
    await document.respecIsReady;
    try {
      await linter.lint(conf, document);
    } catch (err) {
      console.error("Error ocurred while running the linter", err);
    }
  })();
}
