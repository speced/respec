
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/style");
                if (!conf.specStatus) msg.pub("error", "Configuration 'specStatus' is not set, required for w3c/style");
                var statStyle = conf.specStatus;
                if (statStyle === "FPWD"    || 
                    statStyle === "LC"      || 
                    statStyle === "WD-NOTE" || 
                    statStyle === "LC-NOTE" || 
                    statStyle === "FPWD-NOTE") statStyle = "WD";
                if (statStyle === "finding" || statStyle === "draft-finding") statStyle = "base";
                var css;
                if (statStyle === "unofficial") {
                    css = "http://www.w3.org/StyleSheets/TR/w3c-unofficial";
                }
                else if (statStyle === "base") {
                    css = "http://www.w3.org/StyleSheets/TR/base";
                }
                else {
                    css = "http://www.w3.org/StyleSheets/TR/W3C-" + statStyle;
                }
                utils.linkCSS(doc, css);
                msg.pub("end", "w3c/style");
                cb();
            }
        };
    }
);
