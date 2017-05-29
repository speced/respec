// Module geonovum/ui/about-respec
// A simple about dialog with pointer to the help
import ui from "core/ui";

// window.respecVersion is added at build time (see tools/builder.js)
window.respecVersion = window.respecVersion || "Developer Edition";
const div = document.createElement("div");
div.innerHTML = `
  <p>
    ReSpec ondersteunt het productieproces van Standaardisatiedocumenten.
  </p>
  <p>
    Meer informatie over de tool leest u in de <a href='https://w3.org/respec/'>documentatie</a>.
  </p>
  <p>
    Een issue gevonden in ReSpec? <a href='https://github.com/w3c/respec/issues'>Meld het</a>!
  </p>
`;

const button = ui.addCommand(
  "About ReSpec",
  "geonovum/ui/about-respec",
  "Ctrl+Shift+Alt+A",
  "ℹ️"
);

function show() {
  ui.freshModal("About ReSpec - " + window.respecVersion, div, button);
}

export { show };
