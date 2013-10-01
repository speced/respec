
// Module w3c/data-transform
// Support for the data-transform attribute
// Any element in the tree that has a data-transform attribute is processed here.
// The data-transform attribute can contain a white space separated list of functions
// to call (these must have been defined globally). Each is called with a reference to
// the core/utils plugin and the innerHTML of the element. The output of each is fed
// as the input to the next, and the output of the last one replaces the HTML content
// of the element.
// IMPORTANT:
//  It is unlikely that you should use this module. The odds are that unless you really
//  know what you are doing, you should be using a dedicated module instead. This feature
//  is not actively supported and support for it may be dropped. It is not accounted for
//  in the test suite, and therefore could easily break.

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/data-transform");
                $("[data-transform]", doc).each(function (i, node) {
                    var $n = $(node);
                    var flist = $n.attr('data-transform');
                    $n.removeAttr('data-transform') ;
                    var content;
                    try {
                        content = utils.runTransforms($n.html(), flist);
                    }
                    catch (e) {
                        msg.pub("error", e);
                    }
                    if (content) $n.html(content);
                });
                msg.pub("end", "w3c/data-transform");
                cb();
            }
        };
    }
);
