const privs = new WeakMap();
/**
 * Checks if the linter rule is enabled.
 *
 * @param {Object} conf ReSpec config object.
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
   * @param {String} the name of the rule
   * @param {Function} lintingFunction has a conf, and doc argument
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
   * @param {Object} config The ReSpec config.
   * @param  {Document} doc The document to be checked.
   */
  lint(conf = { lint: { [this.name]: false } }, doc = document) {
    return canLint(conf, this.name)
      ? [].concat(privs.get(this).lintingFunction(conf, doc))
      : [];
  }
}
