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
import tmpls from "templates";
export const name = "w3c/permalinks";
export function run(conf, doc, cb) {
  if (!conf.includePermalinks) {
    return cb();
  }
  const css = tmpls["permalinks.css"];
  var symbol = conf.permalinkSymbol || "§";
  var style = "<style>" + css(conf) + "</style>";

  $(doc).find("head link").first().before(style);
  var $secs = $(doc).find("h2, h3, h4, h5, h6");
  $secs.each(function(i, item) {
    var $item = $(item);
    if (!$item.hasClass("nolink")) {
      var resourceID = $item.attr("id");
      var $par = $item.parent();
      if ($par.is("section") || $par.is("div")) {
        if (!$par.hasClass("introductory") && !$par.hasClass("nolink")) {
          resourceID = $par.attr("id");
        } else {
          resourceID = null;
        }
      }
      // if we still have resourceID
      if (resourceID) {
        // we have an id.  add a permalink
        // right after the h* element
        var theNode = $("<span></span>");
        theNode.attr("class", "permalink");
        var ctext = $item.text();
        var el = $("<a></a>");
        el.attr({
          href: "#" + resourceID,
          "aria-label": "Permalink for " + ctext,
          title: "Permalink for " + ctext,
        });
        var sym = $("<span></span>");
        if (conf.doRDFa) {
          sym.attr({
            property: "schema:name",
            content: ctext,
          });
        }
        sym.append(symbol);
        el.append(sym);
        theNode.append(el);
        // if this is not being put at
        // page edge, then separate it
        // from the heading with a
        // non-breaking space
        if (!conf.permalinkEdge) {
          $item.append("&nbsp;");
        }
        $item.append(theNode);
      }
    }
  });
  cb();
}
