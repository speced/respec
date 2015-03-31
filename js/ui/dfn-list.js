
// Module ui/dfn-list
// Displays all definitions with links to the defining element.
define(
    ["jquery"],
    function ($) {
        return {
            show:   function (ui, _conf) {
                var $halp = $("<ul></ul>");
                Object.keys(_conf.definitionMap).sort().forEach(function(title) {
                    _conf.definitionMap[title].forEach(function(dfn) {
                      // Link to definition
                      var $link = $("<a>" + title + "</a>")
                        .attr("href", "#" + dfn.attr("id"))
                        .click(function () {
                          ui.closeModal();
                      });
                      ($("<li></li>").append($link)).appendTo($halp);
                    });
                });

                ui.freshModal("List of Definitions", $halp);
            }
        };
    }
);
