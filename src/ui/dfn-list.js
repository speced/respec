// Module ui/dfn-list
// Displays all definitions with links to the defining element.
import { l10n, lang } from "../core/l10n";
import { definitionMap } from "../core/dfn-map";
import hyperHTML from "hyperhtml";
import { ui } from "../core/ui";

const button = ui.addCommand(
  l10n[lang].definition_list,
  show,
  "Ctrl+Shift+Alt+D",
  "📔"
);

const ul = document.createElement("ul");
ul.classList.add("respec-dfn-list");
const render = hyperHTML.bind(ul);

ul.addEventListener("click", ev => {
  ui.closeModal();
  ev.stopPropagation();
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
  ui.freshModal(l10n[lang].list_of_definitions, ul, button);
}
