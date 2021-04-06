// @ts-check
/**
 * Checks whether the document has `<meta charset="utf-8">` properly.
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "check-charset";
export const name = "core/linter-rules/check-charset";

const localizationStrings = {
  en: {
    msg: `Document must only contain one \`<meta>\` tag with charset set to 'utf-8'`,
    hint: `Add this line in your document \`<head>\` section - \`<meta charset="utf-8">\` or set charset to "utf-8" if not set already.`,
  },
  zh: {
    msg: `文档只能包含一个 charset 属性为 utf-8 的 \`<meta>\` 标签`,
    hint: `将此行添加到文档的 \`<head>\` 部分—— \`<meta charset="utf-8">\` 或将 charset 设置为 utf-8（如果尚未设置）。`,
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  /** @type {NodeListOf<HTMLMetaElement>} */
  const metas = document.querySelectorAll("meta[charset]");
  const val = [];
  for (const meta of metas) {
    val.push(meta.getAttribute("charset").trim().toLowerCase());
  }
  const utfExists = val.includes("utf-8");

  // only a single meta[charset] and is set to utf-8, correct case
  if (utfExists && metas.length === 1) {
    return;
  }
  // if more than one meta[charset] tag defined along with utf-8
  // or
  // no meta[charset] present in the document
  showWarning(l10n.msg, name, { hint: l10n.hint, elements: [...metas] });
}
