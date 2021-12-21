// @ts-check
/**
 * Linter rule "no-unused-dfns".
 *
 * Complains if an internal/un-exported definitions is not linked to.
 */
import {
  docLink,
  getIntlData,
  norm,
  showError,
  showWarning,
} from "../utils.js";

const ruleName = "no-unused-dfns";
export const name = "core/linter-rules/no-unused-dfns";

const localizationStrings = {
  en: {
    msg(text) {
      return `Found definition for "${text}", but nothing links to it. This is usually a spec bug!`;
    },
    get hint() {
      return docLink`Either remove the definition, or add a \`"lint-ignore"\` CSS class. Or did you want to ${"[export|#data-export]"} it? If yes, add the "export" CSS to it.`;
    },
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) return;
  const logger = conf.lint[ruleName] === "warn" ? showWarning : showError;
  /** @type NodeListOf<HTMLElement> */
  const definitions = document.querySelectorAll(
    "dfn[id]:not(.lint-ignore, [data-export], [data-cite])"
  );

  const elements = [...definitions].filter(dfnFilter);

  // These are usually bad spec bugs, so best shown individually.
  elements.forEach(element => {
    const elements = [element];
    const text = norm(element.textContent);
    logger(l10n.msg(text), name, { elements, hint: l10n.hint });
  });
}

function dfnFilter(dfn) {
  // Not in the index
  // and not the "self-link" box
  return !document.querySelector(
    `a[href="#${dfn.id}"]:not(.index-term, .self-link)`
  );
}
