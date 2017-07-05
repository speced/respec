// Module core/id-headers
// All headings are expected to have an ID, unless their immediate container has one.
// This is currently in core though it comes from a W3C rule. It may move in the future.

export const name = "core/id-headers";

export function run(conf, doc, cb) {
  $("h2, h3, h4, h5, h6").each(function() {
    var $h = $(this);
    if (!$h.attr("id")) {
      if ($h.parent("section").attr("id") && $h.prev().length === 0) return;
      $h.makeID();
    }
  });
  cb();
}
