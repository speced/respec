// @ts-check
/**
 * @typedef {object} LinterResult
 * @property {string} description
 * @property {string} help
 * @property {string} howToFix
 * @property {string} name
 * @property {number} occurrences
 * @property {Element[]} offendingElements
 *
 * @typedef {(conf: any, doc: Document) => (LinterResult | Promise<LinterResult>)} LintingFunction
 */

/** @type {WeakMap<LinterRule, { name: string, lintingFunction: LintingFunction }>} */
const privs = new WeakMap();

/**
 * Checks if the linter rule is enabled.
 *
 * @param {Object} conf ReSpec config object.
 * @param {string} name linter rule name
 */
function canLint(conf, name) {
  return !(
    conf.hasOwnProperty("lint") === false ||
    conf.lint === false ||
    !conf.lint[name]
  );
}

export default class LinterRule {
  /**
   *
   * @param {String} name the name of the rule
   * @param {LintingFunction} lintingFunction
   */
  constructor(name, lintingFunction) {
    privs.set(this, { name, lintingFunction });
  }
  get name() {
    return privs.get(this).name;
  }
  /**
   * Runs linter rule.
   *
   * @param {Object} conf The ReSpec config.
   * @param {Document} doc The document to be checked.
   */
  lint(conf = { lint: { [this.name]: false } }, doc = document) {
    if (canLint(conf, this.name)) {
      return privs.get(this).lintingFunction(conf, doc);
    }
  }
}
