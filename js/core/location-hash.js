
// Module core/location-hash
// Resets window.location.hash to jump to the right point in the document

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/location-hash");
                var hash = window.location.hash;

                // Number of pixels that the document has already been
                // scrolled vertically (cross-browser)
                var scrollY = (window.pageYOffset !== undefined)
                    ? window.pageYOffset
                    : (document.documentElement || document.body.parentNode || document.body).scrollTop;

                // Only scroll to the hash if the document hasn't been scrolled yet
                // this ensures that a page refresh maintains the scroll position
                if (hash && !scrollY) {
                    window.location.hash = "";
                    window.location.hash = hash;
                }
                msg.pub("end", "core/location-hash");
                cb();
            }
        };
    }
);
