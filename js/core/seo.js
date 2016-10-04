
// Module core/seo
// Manages SEO information for documents
// e.g. set the canonical URL for the document if configured

define(
    ["core/pubsubhub"],
    function (pubsubhub) {
        return {
            run:    function (conf, doc, cb) {
                var warnings = [];
                var uri;
                switch(conf.canonicalURI) {
                case "edDraft":
                    if (conf.edDraftURI) {
                        uri = conf.edDraftURI;
                    } else {
                        warnings.push("Canonical URI set to edDraft, but " +
                                      "no edDraftURI is set in configuration");
                    }
                    break;
                case "TR":
                    if (conf.shortName) {
                        uri = 'https://www.w3.org/TR/' + conf.shortName + '/';
                    } else {
                        warnings.push("Canonical URI set to TR, but " +
                                      "no shortName is set in configuration");
                    }
                    break;
                default:
                    if (conf.canonicalURI
                        && conf.canonicalURI.match(/^https?:/)) {
                        uri = conf.canonicalURI;
                    } else if (conf.shortName) {
                        uri = 'https://www.w3.org/TR/' + conf.shortName + '/';
                    }
                    break;
                }
                if (uri) {
                    var linkElem = document.createElement("link");
                    linkElem.setAttribute("rel", "canonical");
                    linkElem.setAttribute("href", uri);
                    document.head.appendChild(linkElem);
                }

                // Publish warnings
                warnings.map(function(warn) {
                    pubsubhub.pub("warn", warn);
                });

                cb();
            }
        };
    }
);
