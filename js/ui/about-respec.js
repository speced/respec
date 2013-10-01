
// Module ui/about-respec
// A simple about dialogue with pointer to the help

define(
    ["jquery"],
    function ($) {
        return {
            show:   function (ui) {
                var $halp = $("<div><p>ReSpec is a document production toolchain, with a notable focus on W3C specifications.</p></div>");
                $("<p>You can find more information in the <a href='http://w3.org/respec/'>documentation</a>.</p>");
                ui.freshModal("About ReSpec", $halp);
            }
        };
    }
);
