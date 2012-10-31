/*global berjon*/

// IMPORTANT NOTE -- THIS CODE IS NOT YET ACTIVE, IT WILL BE WHEN LEGACY IS REMOVED

// Module code/local-biblio
// Provide your own local biblio refs
// CONFIGURATION
//  - localBiblio: an object mapping biblio keys to values that complement and
//    override the shared biblio

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/local-biblio");
                if (conf.localBiblio) {
                    console.log(conf.localBiblio);
                    console.log(berjon.biblio.SVG12);
                    for (var k in conf.localBiblio) berjon.biblio[k] = conf.localBiblio[k];
                }
                msg.pub("end", "core/local-biblio");
                cb();
            }
        };
    }
);
