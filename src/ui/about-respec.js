// Module ui/about-respec
// A simple about dialog with pointer to the help
import { ui } from "core/ui";

// window.respecVersion is added at build time (see tools/builder.js)
window.respecVersion = window.respecVersion || "Developer Edition";
const div = document.createElement("div");
div.innerHTML = `
  <p>
    ReSpec is a document production toolchain, with a notable focus on W3C specifications.
  </p>
  <p>
    You can find more information in the <a href='https://w3.org/respec/'>documentation</a>.
  </p>
  <p>
    Found a bug in ReSpec? <a href='https://github.com/w3c/respec/issues'>File it!</a>.
  </p>
`;

const button = ui.addCommand(
  "About ReSpec",
  "ui/about-respec",
  "Ctrl+Shift+Alt+A",
  "ℹ️"
);

function  show() {
  ui.freshModal("About ReSpec - " + window.respecVersion, div, button);
}

export { show };
