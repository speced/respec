
// Module core/style
// Inserts the CSS that ReSpec uses into the document.
// IMPORTANT NOTE
//  The extraCSS configuration option is now deprecated. People rarely use it, and it
//  does not work well with the growing restrictions that browsers impose on loading
//  local content. You can still add your own styles: for that you will have to create
//  a plugin that declares the css as a dependency and create a build of your new
//  ReSpec profile. It's rather easy, really.
// CONFIGURATION
//  - noReSpecCSS: if you're using a profile that loads this module but you don't want
//    the style, set this to true

define(
    ["text!core/css/respec2.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/style");
                if (conf.extraCSS) {
                    msg.pub("warn", "The 'extraCSS' configuration property is now deprecated.");
                }
                if (!conf.noReSpecCSS) {
                    $("<style/>").appendTo($("head", $(doc)))
                                 .text(css);
                }
                msg.pub("end", "core/style");
                cb();
            }
        };
    }
);
