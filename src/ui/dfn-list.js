// @ts-check
// Module ui/dfn-list
// Displays all definitions with links to the defining element.
import { definitionMap } from "../core/dfn-map.js";
import { getIntlData } from "../core/utils.js";
import { hyperHTML } from "../core/import-maps.js";
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
const render = hyperHTML.bind(ul);

ul.addEventListener("click", ev => {
  if (ev.target instanceof HTMLElement && ev.target.matches("a")) {
    ui.closeModal();
    ev.stopPropagation();
  }
});

function show() {
  const definitionLinks = Object.entries(definitionMap)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, [dfn]]) => {
      return hyperHTML.wire(dfn, ":li>a")`
        <li>
          <a href="${`#${dfn.id}`}">
            ${dfn.textContent}
          </a>
        </li>
      `;
    });
  render`${definitionLinks}`;
  ui.freshModal(l10n.list_of_definitions, ul, button);
}
