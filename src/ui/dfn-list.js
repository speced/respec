// @ts-check
// Module ui/dfn-list
// Displays all definitions with links to the defining element.
import { l10n, lang } from "../core/l10n.js";
import { definitionMap } from "../core/dfn-map.js";
import { hyperHTML } from "../core/import-maps.js";
import { ui } from "../core/ui.js";

const button = ui.addCommand(
  l10n[lang].definition_list,
  show,
  "Ctrl+Shift+Alt+D",
  "📔"
);

const ul = document.createElement("ul");
ul.classList.add("respec-dfn-list");

ul.addEventListener("click", ev => {
  ui.closeModal();
  ev.stopPropagation();
});

function show() {
  const definitionLinks = Object.entries(definitionMap)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, [dfn]]) => {
      return hyperHTML`
        <li>
          <a href="${`#${dfn.id}`}">
            ${dfn.textContent}
          </a>
        </li>
      `;
    });
  ul.textContent = "";
  ul.append(...definitionLinks);
  ui.freshModal(l10n[lang].list_of_definitions, ul, button);
}
