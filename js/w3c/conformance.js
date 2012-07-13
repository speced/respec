
// Module w3c/conformance
// Handle the conformance section properly.

define(
    ["tmpl!w3c/templates/conformance.html"],
    function (confoTmpl) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/conformance");
                var $confo = $("#conformance");
                if ($confo.length) $confo.prepend(confoTmpl(conf));
                msg.pub("end", "w3c/conformance");
                cb();
            }
        };
    }
);
