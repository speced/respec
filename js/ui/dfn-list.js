
// Module ui/about-respec
// A simple about dialogue with pointer to the help

define(
    ["jquery"],
    function ($) {
        return {
            show:   function (ui, _conf) {
                var $halp = $("<dl></dl>");
                Object.keys(_conf.definitionMap).sort().forEach(function(title) {
                    _conf.definitionMap[title].forEach(function(dfn) {
                      $("<li>" + title + "</li>").appendTo($halp);
                    });
                });

                ui.freshModal("List of Definitions", $halp);
            }
        };
    }
);
