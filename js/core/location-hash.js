
// Module core/location-hash
// Resets window.location.hash to jump to the right point in the document

define(
    ["core/pubsubhub"],
    function (pubsubhub) {
        return {
            run:    function (conf, doc, cb) {
                // Added message for legacy compat with Aria specs
                // See https://github.com/w3c/respec/issues/793
                pubsubhub.pub("start", "core/location-hash");
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
                cb();
            }
        };
    }
);
