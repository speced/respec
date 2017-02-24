
// Module w3c/conformance
// Handle the conformance section properly.

define(
    ["templates", "core/pubsubhub"],
    function (tmpls, pubsubhub) {
        var confoTmpl = tmpls["conformance.html"];
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
