// @ts-check
// Module ui/dfn-list
// Displays all definitions with links to the defining element.
import { definitionMap } from "../core/dfn-map.js";
import { getIntlData } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { ui } from "../core/ui.js";

const localizationStrings = {
  en: {
    definition_list: "Definitions",
    list_of_definitions: "List of Definitions",
  },
  nl: {
    definition_list: "Lijst van Definities",
    list_of_definitions: "Lijst van Definities",
  },
  ja: {
    definition_list: "定義",
    list_of_definitions: "定義リスト",
  },
  de: {
    definition_list: "Definitionen",
    list_of_definitions: "Liste der Definitionen",
  },
};
const l10n = getIntlData(localizationStrings);

const button = ui.addCommand(
  l10n.definition_list,
  show,
  "Ctrl+Shift+Alt+D",
  "📔"
);

const ul = document.createElement("ul");
ul.classList.add("respec-dfn-list");
const render = html.bind(ul);

ul.addEventListener("click", ev => {
  if (ev.target instanceof HTMLElement && ev.target.matches("a")) {
    ui.closeModal();
    ev.stopPropagation();
  }
});

function show() {
  const definitionLinks = Array.from(definitionMap)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, [dfn]]) => {
      return html.wire(dfn, ":li>a")`
        <li>
          <a href="${`#${dfn.id}`}">
            ${dfn.textContent}
          </a>
          ${labelDfnIfExported(dfn)} ${labelDfnIfUnused(dfn)}
        </li>
      `;
    });
  render`${definitionLinks}`;
  ui.freshModal(l10n.list_of_definitions, ul, button);
}

/**
 * If a definition is exported, label it accordingly
 * @param {HTMLElement} dfn a definition
 */
function labelDfnIfExported(dfn) {
  const isExported = dfn.hasAttribute("data-export");
  if (isExported) {
    return html`<span class="dfn-status exported">exported</span>`;
  }
  return null;
}

/**
 * If a definition is unused, label it accordingly
 * @param {HTMLElement} dfn a definition
 */
function labelDfnIfUnused(dfn) {
  const isUsed = document.querySelector(`a[href^="#${dfn.id}"]`);
  if (!isUsed) {
    return html`<span class="dfn-status unused">unused</span>`;
  }
  return null;
}
