
// Module ui/save-html
// Saves content to HTML when asked to

define(
    ["jquery"],
    function ($) {
        return {
            show:   function (ui) {
                var $modal = ui.freshModal("Save Snapshot", "<p>HAHAHAHA</p>");
            }
        };
    }
);
