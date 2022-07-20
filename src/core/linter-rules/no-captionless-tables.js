// @ts-check
/**
 * Linter rule "no-captionless-tables".
 *
 * Checks that there are no tables in the document which don't start
 * with a caption element.
 *
 * As some tables may not contain tabular data, this only applies to
 * tables marked with class="numbered".
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "no-captionless-tables";
export const name = "core/linter-rules/no-captionless-tables";

const localizationStrings = {
  en: {
    msg: "All tables marked with class='numbered' must start with a caption element.",
    hint: "Add a `caption` to the offending table.",
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }
  /** @type {NodeListOf<HTMLElement>} */
  const tables = document.querySelectorAll("table.numbered");
  const offendingElements = [...tables].filter(
    table => !(table.firstElementChild instanceof HTMLTableCaptionElement)
  );

  if (!offendingElements.length) return;

  showWarning(l10n.msg, name, {
    hint: l10n.hint,
    elements: offendingElements,
  });
}
