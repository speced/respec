
// Module w3c/conformance
// Handle the conformance section properly.

define(
    ["tmpl!w3c/templates/conformance.html"],
    function (confoTmpl) {
        return {
            run:    function (conf, doc, cb) {
                var $confo = $("#conformance");
                if ($confo.length) $confo.prepend(confoTmpl(conf));
                cb();
            }
        };
    }
);
