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
      return docLink`
        You can do one of the following...

          * Add a \`class="lint-ignore"\` attribute the definition.
          * Either remove the definition or change \`<dfn>\` to another type of HTML element.
          * If you meant to ${"[export|#data-export]"} the definition, add \`class="export"\` to the definition.

        To silence this warning entirely, set \`lint: { "no-unused-dfns": false }\` in your \`respecConfig\`.`;
    },
  },
  cs: {
    msg(text) {
      return `Nalezena definice pro "${text}", ale nic na ni neodkazuje. Toto je obvykle chyba ve specifikaci!`;
    },
    get hint() {
      return docLink`
        Můžete udělat jedno z následujícího...

          * Přidejte k definici atribut \`class="lint-ignore"\`.
          * Definici buď odstraňte, nebo změňte \`<dfn>\` na jiný typ HTML elementu.
          * Pokud jste chtěli ${"[export|#data-export]"} tuto definici, přidejte k ní \`class="export"\`.

        Pro úplné potlačení tohoto varování nastavte \`lint: { "no-unused-dfns": false }\` ve vaší \`respecConfig\`.`;
    },
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) return;
  const logger = conf.lint[ruleName] === "error" ? showError : showWarning;
  /** @type NodeListOf<HTMLElement> */
  const definitions = document.querySelectorAll(
    "dfn:not(.lint-ignore, [data-export], [data-cite])"
  );

  const elements = [...definitions].filter(isDfnUnused);

  // These are usually bad spec bugs, so best shown individually.
  elements.forEach(element => {
    const elements = [element];
    const text = norm(element.textContent);
    logger(l10n.msg(text), name, { elements, hint: l10n.hint });
  });
}

function isDfnUnused(dfn) {
  // Not in the index
  // and not the "self-link" box
  return !document.querySelector(
    `a[href="#${dfn.id}"]:not(.index-term, .self-link)`
  );
}
