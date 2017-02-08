// Module ui/about-respec
// A simple about dialog with pointer to the help
"use strict";
define(
  ["core/ui"],
  function(ui) {
    // window.respecVersion is added at build time (see tools/builder.js)
    window.respecVersion = window.respecVersion || "Developer Edition";
    const $halp = $("<div><p>ReSpec is a document production toolchain, with a notable focus on W3C specifications.</p></div>");
    $("<p>You can find more information in the <a href='https://w3.org/respec/'>documentation</a>.</p>").appendTo($halp);
    $("<p>Found a bug in ReSpec? <a href='https://github.com/w3c/respec/issues'>File it!</a>.</p>").appendTo($halp);
    const button = ui.addCommand("About ReSpec", "ui/about-respec", "Ctrl+Shift+Alt+A", "ℹ️");
    return {
      show: function() {
        ui.freshModal("About ReSpec - " + window.respecVersion, $halp, button);
      }
    };
  }
);
