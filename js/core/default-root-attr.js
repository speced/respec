// Module core/default-root-attr
// In cases where it is recommended that a document specify its language and writing direction,
// this module will supply defaults of "en" and "ltr" respectively (but won't override
// specified values).
// Be careful in using this that these defaults make sense for the type of document you are
// publishing.
"use strict";
define(
  [],
  function() {
    return {
      run: function(config, doc, cb) {
        var $root = $(doc.documentElement);
        if (!$root.attr("lang")) {
          $root.attr("lang", "en");
          if (!$root.attr("dir")) $root.attr("dir", "ltr");
        }
        cb();
      }
    };
  }
);
