
// XXX untested

// Module core/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit 
// anywhere else.

// XXX
//  - test individual methods

define(
    [],
    function () {
        var utils = {
            // --- SET UP
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/utils");
                msg.pub("end", "w3c/utils");
                cb()
            }
            
            // --- STYLE HELPERS ------------------------------------------------------------------------------
            // take a document and either a link or an array of links to CSS and appends a <link/> element
            // to the head pointing to each
        ,   linkCSS:  function (doc, styles) {
                if (!$.isArray(styles)) styles = [styles];
                $.each(styles, function (i, css) { 
                    $('head', doc).append($("<link/>").attr({ rel: 'stylesheet', href: css }));
                });
            }
        };
        return utils;
    }
);
