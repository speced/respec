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

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }
  /** @type {NodeListOf<HTMLElement>} */
  const sections = document.querySelectorAll(
    "section:not(.head,#abstract,#sotd)"
  );
  const offendingElements = [...sections].filter(
    ({ firstElementChild: e }) =>
      !e ||
      // no header wrapper and the first child is not a heading
      !(e.matches(".header-wrapper") || e instanceof HTMLHeadingElement)
  );

  if (!offendingElements.length) return;

  showWarning(l10n.msg, name, {
    hint: l10n.hint,
    elements: offendingElements,
  });
}
