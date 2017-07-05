/// Module ui/dfn-list
// Displays all definitions with links to the defining element.
import { ui } from "core/ui";
import hyperHTML from "deps/hyperhtml";

const button = ui.addCommand(
  "Definition List",
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
      return window.hyperHTML.wire()`
        <li>
          <a href="${"#" + dfn.id}">
            ${key}
          </a>
        </li>
      `;
    });
  render`${definitionLinks}`;
  ui.freshModal("List of Definitions", ul, button);
}

export { show };
