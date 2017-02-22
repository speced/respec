
// Module w3c/unhtml5
// Removes uses of HTML5 elements (e.g. section) and replaces them with HTML4 equivalents.
// This module is now officially deprecated for use in W3C specifications. You can however
// still use it if you need to for some reason.

define(
    ["core/utils"], // load this to be sure that the jQuery extensions are loaded
    function (utils) {
        return {
            run:    function (conf, doc, cb) {
                $.each("section figcaption figure".split(" "), function (i, item) {
                    $(item, doc).renameElement("div").addClass(item);
                });
                $("time", doc).renameElement("span").addClass("time").removeAttr('datetime');
                $("div[role]").removeAttr('role').removeAttr('aria-level') ;
                $("style:not([type])").attr("type", "text/css");
                $("script:not([type])").attr("type", "text/javascript");
                cb();
            }
        };
    }
);
