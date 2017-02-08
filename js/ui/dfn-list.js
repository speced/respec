
// Module ui/dfn-list
// Displays all definitions with links to the defining element.
define(
    ["core/ui"],
    function (ui) {
        const button = ui.addCommand("Definition List", "ui/dfn-list", "Ctrl+Shift+Alt+D", "📔");
        return {
            show: function() {
                var $halp = $("<ul></ul>");
                Object.keys(window.respecConfig.definitionMap).sort().forEach(function(title) {
                    window.respecConfig.definitionMap[title].forEach(function(dfn) {
                      // Link to definition
                      var $link = $("<a>" + title + "</a>")
                        .attr("href", "#" + dfn.attr("id"))
                        .click(function () {
                          ui.closeModal();
                      });
                      ($("<li></li>").append($link)).appendTo($halp);
                    });
                });

                ui.freshModal("List of Definitions", $halp, button);
            }
        };
    }
);
