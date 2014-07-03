// Module w3c/permalinks
// Adds "permalinks" into the document at sections with explicit IDs
// Introduced by Shane McCarron (shane@aptest.com) from the W3C PFWG
//
// Only enabled when the includePermalinks option is set to true.
// Defaults to false.
//
// When includePermalinks is enabled, the following options are
// supported:
//
//     permalinkSymbol:    the character(s) to use for the link.
//                         Defaults to §
//     permalinkEdge:      Boolean. The link will be right-justified.  Otherwise 
//                         it will be immediately after the heading text.
//                         Defaults to false.
//     permalinkHide:      Boolean. The symbol will be hidden until the header is 
//                         hovered over.  Defaults to false.

define(
    ["tmpl!w3c/templates/permalinks.css", "core/utils"], // load this to be sure that the jQuery extensions are loaded
    function (css, utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/permalinks");
                if (conf.includePermalinks) {
                    var symbol = conf.permalinkSymbol || '§';
                    var style = "<style>" + css(conf) + "</style>" ;

                    $(doc).find("head link").first().before(style) ;
                    var $secs = $(doc).find("h2, h3, h4, h5, h6");
                    $secs.each(function(i, item) {
                        var $item = $(item) ;
                        if (!$item.hasClass("nolink")) {
                            var resourceID = $item.attr('id');

                            var $par = $item.parent();
                            if ($par.is("section") || $par.is("div")) {
                                if (!$par.hasClass("introductory") && !$par.hasClass("nolink")) {
                                    resourceID = $par.attr('id') ;
                                } else {
                                    resourceID = null;
                                }
                            }

                            // if we still have resourceID
                            if (resourceID != null) {
                                // we have an id.  add a permalink
                                // right after the h* element
                                var type = conf.doRDFa ? "typeof='bookmark' " : "";
                                var urlprop = conf.doRDFa ? "property='url' " : "";
                                var titprop = conf.doRDFa ? "property='title' " : "";
                                var content = "<span " + type + "class='permalink'>";
                                if (!conf.permalinkEdge) {
                                    content += "&nbsp;";
                                }
                                content += "<a href='#"+resourceID+"' " + urlprop + "aria-label='Permalink for "
                                        +resourceID+"' title='Permalink for "+resourceID+"'>" 
                                        + "<span " + titprop + "content='"+$item.text()+"'>"
                                        + symbol + "</span></a></span>";
                                $item.append(content);
                            }
                        }
                    });
                };
                msg.pub("end", "w3c/permalinks");
                cb();
            }
        };
    }
);
