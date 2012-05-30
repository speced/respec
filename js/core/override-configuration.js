
// Module core/override-configuration
// A helper module that makes it possible to override settings specified in respecConfig
// by passing them as a query string. This is useful when you just want to make a few
// tweaks to a document before generating the snapshot, without mucking with the source.
// For example, you can change the status and date by appending:
//      ?specStatus=LC;publishDate=2012-03-15
// Note that fields are separated by semicolons and not ampersands.
// TODO
//  There could probably be a UI for this to make it even simpler.

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/override-configuration");
                if (location.search) {
                    var confs = location.search.replace(/^\?/, "").split(";");
                    for (var i = 0, n = confs.length; i < n; i++) {
                        var items = confs[i].split("=", 2);
                        var k = decodeURI(items[0]), v = decodeURI(items[1]).replace(/%3D/g, "=");
                        // we could process more types here, as needed
                        if (v === "true") v = true;
                        else if (v === "false") v = false;
                        else if (v === "null") v = null;
                        else if (/\[\]$/.test(k)) {
                            k = k.replace(/\[\]/, "");
                            v = $.parseJSON(v);
                        }
                        conf[k] = v;
                    }
                }
                msg.pub("end", "core/override-configuration");
                cb();
            }
        };
    }
);
