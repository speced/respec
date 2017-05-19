// Module geonovum/ui/dfn-list
// Displays all definitions with links to the defining element.
define(["core/ui"], function(ui) {
  const button = ui.addCommand(
    "Definitie Lijst",
    "geonovum/ui/dfn-list",
    "Ctrl+Shift+Alt+D",
    "📔"
  );
  return {
    show: function() {
      var $halp = $("<ul class='respec-dfn-list'></ul>");
      Object.keys(window.respecConfig.definitionMap)
        .sort()
        .forEach(function(title) {
          window.respecConfig.definitionMap[title].forEach(function(dfn) {
            // Link to definition
            var $link = $("<a>" + title + "</a>")
              .attr("href", "#" + dfn.attr("id"))
              .click(function() {
                ui.closeModal();
              });
            $("<li></li>").append($link).appendTo($halp);
          });
        });

      ui.freshModal("Lijst van Definities", $halp, button);
    },
  };
});
