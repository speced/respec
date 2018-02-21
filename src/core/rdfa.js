// Module core/rdfa
// Support for RDFa is spread to multiple places in the code, including templates, as needed by
// the HTML being generated in various places. This is for parts that don't fit anywhere in
// particular
export const name = "core/rdfa";

export function run(conf, doc, cb) {
  if (!conf.doRDFa) {
    return cb();
  }
  // Do abstract
  const $abs = $("#abstract", doc);
  if ($abs.length) {
    var rel = "schema:description",
      ref = $abs.attr("property");
    if (ref) rel = ref + " " + rel;
    $abs.attr({ property: rel });
  }

  $("section,nav").each(function() {
    var $sec = $(this),
      resource = "",
      $fc = $sec.children("h1,h2,h3,h4,h5,h6").first(),
      ref = $sec.attr("id"),
      fcref = null;
    if (ref) {
      resource = "#" + ref;
    } else if ($fc.length) {
      ref = $fc.attr("id");
      if (ref) {
        resource = "#" + ref;
        fcref = ref;
      }
    }
    var property = "schema:hasPart";
    // Headings on everything but boilerplate
    if (!resource.match(/#(abstract|sotd|toc)$/)) {
      $sec.attr({
        typeof: "schema:Chapter",
        resource: resource,
        property: property,
      });
    }
    // create a heading triple too, as per the role spec
    // since we should not be putting an @role on
    // h* elements with a value of heading, but we
    // still want the semantic markup
    if ($fc.length) {
      if (!fcref) {
        // if there is no ID on the heading itself.  Add one
        fcref = $fc.makeID("h", ref);
      }
    }
  });
  cb();
}
