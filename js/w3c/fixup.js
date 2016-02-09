
// Module w3c/fixup
// Inserts a link to the appropriate JS Extension for the W3C Spec Style Sheet.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/fixup");
                if (!conf.specStatus) msg.pub("error", "Configuration 'specStatus' is not set, required for w3c/fixup");
                var statStyle = conf.specStatus;
                if (statStyle === "FPWD"    ||
                    statStyle === "LC"      ||
                    statStyle === "WD-NOTE" ||
                    statStyle === "LC-NOTE") statStyle = "WD";
                if (statStyle === "FPWD-NOTE") statStyle = "WG-NOTE";
                if (statStyle === "finding" || statStyle === "draft-finding") statStyle = "base";
                var fixup = "null";
                if (statStyle === "unofficial" || statStyle === "base" ||
                    statStyle === "CG-DRAFT" || statStyle === "CG-FINAL" ||
                    statStyle === "BG-DRAFT" || statStyle === "BG-FINAL") {
                    // note: normally, the ".css" is not used in W3C, but here specifically it clashes
                    // with a PNG of the same base name. CONNEG must die.
                    // @@ TO BE CHANGED ONCE the NEW STYLESHEETS ARE OFFICIAL
                    // fixup = "https://www.w3.org/scripts/TR/2016/fixup.js";
                } else if (conf.useExperimentalStyles) {
                    fixup = "https://www.w3.org/scripts/TR/2016/fixup.js";
                }
                if (fixup !== null) {
                  $("html>body").append($('<script src="' + fixup + '"></script>'));
                }
                msg.pub("end", "w3c/fixup");
                cb();
            }
        };
    }
);
