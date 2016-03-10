
// Module core/fix-headers
// Make sure that all h1-h6 headers (that are first direct children of sections) are actually
// numbered at the right depth level. This makes it possible to just use any of them (conventionally
// h2) with the knowledge that the proper depth level will be used

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/fix-headers");
                var $secs = $("section:not(.introductory)", doc)
                                .find("h1:first, h2:first, h3:first, h4:first, h5:first, h6:first");
                $secs.each(function () {
                    var depth = $(this).parents("section").length + 1;
                    if (depth > 6) depth = 6;
                    var h = "h" + depth;
                    if (this.localName.toLowerCase() !== h) $(this).renameElement(h);
                });
                msg.pub("end", "core/fix-headers");
                cb();
            }
        };
    }
);
