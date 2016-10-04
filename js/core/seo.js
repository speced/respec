
// Module core/seo
// Manages SEO information for documents
// e.g. set the canonical URL for the document if configured

define(
    ["core/pubsubhub"],
    function (pubsubhub) {
        return {
            run: function (conf, doc, cb) {
                var uri;
                var trLatestUri = conf.shortName ? 'https://www.w3.org/TR/' + conf.shortName + '/' : undefined;
                switch(conf.canonicalURI) {
                case "edDraft":
                    if (conf.edDraftURI) {
                        uri = conf.edDraftURI;
                    } else {
                        pubsubhub.pub("warn", "Canonical URI set to edDraft, " +
                                      "but no edDraftURI is set in configuration");
                    }
                    break;
                case "TR":
                    if (trLatestUri) {
                        uri = trLatestUri;
                    } else {
                        pubsubhub.pub("warn", "Canonical URI set to TR, but " +
                                      "no shortName is set in configuration");
                    }
                    break;
                default:
                    if (conf.canonicalURI) {
                        if (/^https?:/.test(conf.canonicalURI)) {
                            uri = conf.canonicalURI;
                        } else {
                            pubsubhub.pub("warn", "Canonical URI configured, " +
                                          "but the value does not start with " +
                                          "http: or https:");

                        }
                    } else if (trLatestUri) {
                        uri = trLatestUri;
                    }
                }
                if (uri) {
                    var linkElem = doc.createElement("link");
                    linkElem.setAttribute("rel", "canonical");
                    linkElem.setAttribute("href", uri);
                    doc.head.appendChild(linkElem);
                }

                cb();
            }
        };
    }
);
