// Module ui/about-respec
// A simple about dialogue with pointer to the help
"use strict";
define(
  ["core/ui"],
  function(ui) {
    window.respecVersion = window.respecVersion || "Developer Edition";
    const $halp = $("<div>" +
      "<p>ReSpec is a document production toolchain, with a notable focus on W3C specifications.</p>" +
      "</div>" +
      "<p>You can find more information in the <a href=\"https://github.com/w3c/respec/wiki/\">documentation</a>.</p>" +
      "<p>Found a bug in ReSpec? <a href=\"https://github.com/w3c/respec/issues\">File it!</a>.</p>" +
      "</div>"
    );
    ui.addCommand("About ReSpec", "ui/about-respec", "Ctrl+Shift+Alt+A", "ℹ️");
    return {
      show() {
        ui.freshModal("About ReSpec - " + window.respecVersion, $halp);
      }
    };
  }
);
