
// Module w3c/conformance
// Handle the conformance section properly.

define(
    ["tmpl!w3c/templates/conformance.html", "core/pubsubhub"],
    function (confoTmpl, pubsubhub) {
        return {
            run:    function (conf, doc, cb) {
                var $confo = $("#conformance");
                if ($confo.length) $confo.prepend(confoTmpl(conf));
                // Added message for legacy compat with Aria specs
                // See https://github.com/w3c/respec/issues/793
                pubsubhub.pub("end", "w3c/conformance");
                cb();
            }
        };
    }
);
