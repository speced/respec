// Module pcisig/empty-references
// Find references with empty content and invent content.
// This must run AFTER structure.js

import { pub } from "../core/pubsubhub.js";

export const name = "pcisig/empty-references";

export function run(conf, doc, cb) {
  // Update all anchors with empty content that are not in a table of contents
  $("a[href^='#']:empty():not(.tocxref)", doc).each(function() {
    let $a = $(this),
      id = $a.attr("href"),
      was = $a.attr("data-was");
    if (id) {
      $a.addclass('respec-error');
      $a.append("[["+ id);
      if (was) $a.append(" data-was=\"" + was + "\"");
      $a.append("]]");
    }
  });

  cb();
}
