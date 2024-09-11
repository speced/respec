// @ts-check
/**
 * Linter rule "informative-dfn".
 *
 * Complains if an informative definition is referenced from a normative section.
 */
import { docLink, getIntlData, showError, showWarning } from "../utils.js";

import { informativeRefsInNormative } from "../xref.js";

const ruleName = "informative-dfn";
export const name = "core/linter-rules/informative-dfn";

const localizationStrings = {
  en: {
    msg(term, cite) {
      return `Normative reference to "${term}" found but term is defined "informatively" in "${cite}".`;
    },
    get hint() {
      return docLink`
        You can do one of the following...

          * Get the source definition to be made normative
          * Add a \`class="lint-ignore"\` attribute to the link.
          * Use a local normative proxy for the definition à la \`<dfn data-cite="spec">term</dfn>\`

        To silence this warning entirely, set \`lint: { "${ruleName}": false }\` in your \`respecConfig\`.`;
    },
  },
  it: {
    msg(term, cite) {
      return `Riferimento normativo a "${term}" trovato, ma il termine è definito "informativamente" in "${cite}".`;
    },
    get hint() {
      return docLink`
        Puoi fare una delle seguenti cose...
          * Far diventare la definizione sorgente normativa
          * Aggiungere un attributo \`class="lint-ignore"\` al link.
          * Usare un proxy normativo locale per la definizione, ad esempio \`<dfn data-cite="spec">termine</dfn>\`
        Per silenziare completamente questo avviso, imposta \`lint: { "${ruleName}": false }\` nel tuo \`respecConfig\`.`;
    },
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) return;
  const logger = conf.lint[ruleName] === "error" ? showError : showWarning;

  informativeRefsInNormative.forEach(({ term, spec, element }) => {
    if (element.classList.contains("lint-ignore")) return;
    logger(l10n.msg(term, spec), name, {
      title: "Normative reference to non-normative term.",
      elements: [element],
      hint: l10n.hint,
    });
  });
}
