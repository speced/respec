/*jshint strict: true, browser:true, jquery: true*/
/*globals define*/
// Module geonovum/style
// Inserts a link to the appropriate Geonovum style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
"use strict";
define([
  "core/utils",
  "core/pubsubhub",
], function(utils, pubsubhub) {
  function attachFixupScript(doc, version) {
    var script = doc.createElement("script");
    script.addEventListener("load", function() {
      if (window.location.hash) {
        window.location = window.location;
      }
    });
    var helperScript = "https://www.w3.org/scripts/TR/{version}/fixup.js"
      .replace("{version}", version);
    script.src = helperScript;
    doc.body.appendChild(script);
  }

  // Make a best effort to attach meta viewport at the top of the head.
  // Other plugins might subsequently push it down, but at least we start
  // at the right place. When ReSpec exports the HTML, it again moves the
  // meta viewport to the top of the head - so to make sure it's the first
  // thing the browser sees. See js/ui/save-html.js.
  function createMetaViewport() {
    var meta = document.createElement("meta");
    meta.name = "viewport";
    var contentProps = {
      "width": "device-width",
      "initial-scale": "1",
      "shrink-to-fit": "no",
    };
    meta.content = utils.toKeyValuePairs(contentProps).replace(/\"/g, "");
    return meta;
  }

  function createBaseStyle() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://tools.geostandaarden.nl/respec/media/base.css";
    link.classList.add("removeOnSave");
    return link;
  }

  function createResourceHints() {
    var resourceHints = [{
        hint: "preconnect", // for W3C styles and scripts.
        href: "https://www.w3.org",
      }, {
        hint: "preload", // all specs need it, and we attach it on end-all.
        href: "https://www.w3.org/scripts/TR/2016/fixup.js",
        as: "script",
      }, {
        hint: "preload", // all specs include on base.css.
        href: "https://tools.geostandaarden.nl/respec/media/base.css",
        as: "style",
      }, {
        hint: "preload", // all specs show the logo.
        href: "https://tools.geostandaarden.nl/respec/media/logos/Geonovum.png",
        as: "image",
      }]
      .map(utils.createResourceHint.bind(utils))
      .reduce(function(frag, link) {
        frag.appendChild(link);
        return frag;
      }, document.createDocumentFragment());
    return resourceHints;
  }
  // Collect elements for insertion
  var elements = createResourceHints();

  // Opportunistically apply base style
  elements.appendChild(createBaseStyle());
  if (!document.head.querySelector("meta[name=viewport]")) {
    // Make meta viewport the first element in the head.
    elements.insertBefore(createMetaViewport(), elements.firstChild);
  }

  document.head.insertBefore(elements, document.head.firstChild);

  return {
    run: function(conf, doc, cb) {
      if (!conf.specStatus) {
        var warn = "'specStatus' missing from ReSpec config. Defaulting to 'base'.";
        conf.specStatus = "base";
        pubsubhub.pub("warn", warn);
      }

      var styleBaseURL = "https://tools.geostandaarden.nl/respec/media/";
      var finalStyleURL = "";
      var styleFile = "";

      // Figure out which style file to use.
      switch (conf.specStatus.toUpperCase()) {
        case "GN-WV":
          styleFile += "GN-WV.css";
          break;
        case "GN-CV":
          styleFile += "GN-CV.css";
          break;
        case "GN-VV":
          styleFile += "GN-VV.css";
          break;
        case "GN-DEF":
          styleFile += "GN-DEF.css";
          break;
        default:
          styleFile = "base.css";
      }
      
      attachFixupScript(doc, "2016")
      finalStyleURL = styleBaseURL + styleFile
      utils.linkCSS(doc, finalStyleURL);
      cb();
    }
  };
});
