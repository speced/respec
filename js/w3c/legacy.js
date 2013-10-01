/*global berjon */

// RESPEC
var sn;
(function () {
    if (typeof berjon === 'undefined') window.berjon = { biblio: {} };
    berjon.respec = function () {};
    berjon.respec.prototype = {
        loadAndRun:    function (conf, doc, cb, msg) {
            var count = 0;
            var base = "";
            $("script[src]").each(function () {
                var src = $(this).attr("src");
                if (!src) return;
                if (/\/js\/require.*\.js$/.test(src)) {
                    base = src.replace(/js\/require.*\.js$/, "");
                }
            });
            var deps = [base + "js/simple-node.js"];
            var obj = this;

            function callback() {
                if (count <= 0) {
                    sn = new berjon.simpleNode({
                        "":     "http://www.w3.org/1999/xhtml",
                        "x":    "http://www.w3.org/1999/xhtml"
                    }, document);
                    obj.run(conf, doc, cb, msg);
                }
            }

            function loadHandler() {
                count--;
                callback();
            }

            // the fact that we hand-load is temporary, and will be fully replaced by RequireJS
            // in the meantime, we need to avoid loading these if we are using the built (bundled)
            // version. So we do some basic detection and decline to load.
            if (!berjon.simpleNode) {
                for (var i = 0; i < deps.length; i++) {
                    count++;
                    this.loadScript(deps[i], loadHandler, msg);
                }
            }

            callback();
        },

        loadScript: function(src, cb, msg) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.setAttribute("class", "remove");
            var timeout = setTimeout(function () {
                msg.pub("error", "Failed to load '" + src + "', timed out.");
                cb();
            }, 5000);
            script.onload = function () {
                clearTimeout(timeout);
                cb();
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        },

        run:    function (conf, doc, cb, msg) {
            msg.pub("end", "w3c/legacy");
            cb();
        }
    };
}());
// EORESPEC

define([], function () {
    return {
        run:    function (conf, doc, cb, msg) {
            msg.pub("start", "w3c/legacy");
            (new berjon.respec()).loadAndRun(conf, doc, cb, msg);
        }
    };
});
