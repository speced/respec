/// Module ui/dfn-list
// Displays all definitions with links to the defining element.
import { ui } from "core/ui";
import hyperHTML from "deps/hyperhtml";
import { l10n, lang } from "core/l10n";

const button = ui.addCommand(
  l10n[lang].definition_list,
  "ui/dfn-list",
  "Ctrl+Shift+Alt+D",
  "📔"
);

const ul = document.createElement("ul");
ul.classList.add("respec-dfn-list");
const render = window.hyperHTML.bind(ul);

ul.addEventListener("click", ev => {
  ui.closeModal();
  ev.stopPropagation();
});

function show() {
  const definitionLinks = Object.entries(window.respecConfig.definitionMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, $dfn]) => {
      const dfn = $dfn[0];
      return window.hyperHTML.wire(dfn, ":li>a")`
        <li>
          <a href="${"#" + dfn.id}">
            ${key}
          </a>
        </li>
      `;
    });
  render`${definitionLinks}`;
  ui.freshModal(l10n[lang].list_of_definitions, ul, button);
}

export { show };
