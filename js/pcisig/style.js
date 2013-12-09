
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "pcisig/style");
                if (!conf.specStatus) msg.pub("error", "Configuration 'specStatus' is not set, required for pcisig/style");
                var statStyle = conf.specStatus;
                var css = "https://sglaser.github.com/StyleSheets/pcisig/" + statStyle;
                css = "https://www.w3.org/StyleSheets/TR/w3c-" + statStyle;
                     //css += "www.w3.org/StyleSheets/TR/w3c-unofficial";
                utils.linkCSS(doc, css);
                msg.pub("end", "pcisig/style");
                cb();
            }
        };
    }
);
