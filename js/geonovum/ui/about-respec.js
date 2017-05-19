// Module geonovum/ui/about-respec
// A simple about dialog with pointer to the help
"use strict";
define(["core/ui"], function(ui) {
  // window.respecVersion is added at build time (see tools/builder.js)
  window.respecVersion = window.respecVersion || "Developer Edition";
  const $halp = $(
    "<div><p>ReSpec ondersteunt het productieproces van Standaardisatiedocumenten.</p></div>"
  );
  $(
    "<p>Meer informatie over de tool leest u in de <a href='https://w3.org/respec/'>documentatie</a>.</p>"
  ).appendTo($halp);
  $(
    "<p>Een issue gevonden in ReSpec? <a href='https://github.com/w3c/respec/issues'>Meld het</a>!</p>"
  ).appendTo($halp);
  const button = ui.addCommand(
    "Over ReSpec",
    "geonovum/ui/about-respec",
    "Ctrl+Shift+Alt+A",
    "ℹ️"
  );
  return {
    show: function() {
      ui.freshModal("About ReSpec - " + window.respecVersion, $halp, button);
    },
  };
});
