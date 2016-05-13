// Module core/style
// Inserts the CSS that ReSpec uses into the document.
//
// IMPORTANT NOTE
//  To add you own styles, create a plugin that declares the css as a dependency
//  and create a build of your new ReSpec profile.
//
// CONFIGURATION
//  - noReSpecCSS: if you're using a profile that loads this module but you don't want
//    the style, set this to true
"use strict";
define(
  [
    "text!core/css/respec2.css",
    "core/utils",
  ],
  function(css, utils) {
    // Opportunistically inserts the style, with the chance to reduce some FOUC
    var styleElement = document.createElement("style");
    styleElement.id = "respec-mainstyle";
    styleElement.textContent = css;
    var swapStyleOwner = utils.makeOwnerSwapper(styleElement);
    swapStyleOwner(document, document.head);
    return {
      run: function(conf, doc, cb) {
        if (conf.noReSpecCSS) {
          styleElement.remove();
        } else if (styleElement.ownerDocument !== doc) {
          swapStyleOwner(doc, doc.head);
        }
        cb();
      },
    };
  }
);
