// @ts-check
/**
 * Linter rule "no-headingless-sections".
 *
 * Checks that there are no sections in the document that don't start
 * with a heading element (h1-6).
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "no-headingless-sections";
export const name = "core/linter-rules/no-headingless-sections";

const localizationStrings = {
  en: {
    msg: "All sections must start with a `h2-6` element.",
    hint: "Add a `h2-6` to the offending section or use a `<div>`.",
  },
  nl: {
    msg: "Alle secties moeten beginnen met een `h2-6` element.",
    hint: "Voeg een `h2-6` toe aan de conflicterende sectie of gebruik een `<div>`.",
  },
  zh: {
    msg: "所有章节（section）都必须以 `h2-6` 元素开头。",
    hint: "将 `h2-6` 添加到有问题的章节或使用 `<div>`。",
  },
};
const l10n = getIntlData(localizationStrings);

const hasNoHeading = ({ firstElementChild: elem }) => {
  return elem === null || /^h[1-6]$/.test(elem.localName) === false;
};

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  const offendingElements = [...document.querySelectorAll("section")].filter(
    hasNoHeading
  );
  if (offendingElements.length) {
    showWarning(l10n.msg, name, {
      hint: l10n.hint,
      elements: offendingElements,
    });
  }
}
