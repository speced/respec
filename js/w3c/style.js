/*jshint strict: true, browser:true, jquery: true*/
/*globals define*/
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
"use strict";
define(
    ["core/utils", "core/pubsubhub"],
    function(utils, pubsubhub) {
      function attachFixupScript(version){
        var script = document.createElement("script");
        script.async = false;
        script.defer = false;
        var helperScript = "https://www.w3.org/scripts/TR/{version}/fixup.js"
          .replace("{version}", version);
        script.src = helperScript;
        document.body.appendChild(script);
      }

      // Make a best effort to attach meta viewport at the top of the head.
      // Other plugins might subsequently push it down, but at least we start
      // at the right place. When ReSpec exports the HTML, it again moves the
      // meta viewport to the top of the head - so to make sure it's the first
      // thing the browser sees. See js/ui/save-html.js.
      function attachMetaViewport(doc){
        var meta = doc.createElement("meta");
        meta.name = "viewport";
        var contentProps = {
            "width": "device-width",
            "initial-scale": "1",
            "shrink-to-fit": "no",
        };
        meta.content = utils.toKeyValuePairs(contentProps).replace(/\"/g, "")
        doc.head.insertBefore(meta, doc.head.firstChild);
      }

     function selectStyleVersion(styleVersion){
        var version = "";
        switch (styleVersion) {
        case null:
        case true:
          version = new Date().getFullYear().toString();
          break;
        default:
          if(styleVersion && !isNaN(styleVersion)){
            version = styleVersion.toString().trim();
          }
        }
        return version;
      }

      return {
        run: function(conf, doc, cb) {

          if (!conf.specStatus) {
            var warn = "'specStatus' missing from ReSpec config. Defaulting to 'base'.";
            conf.specStatus = "base";
            pubsubhub.pub("warn", warn);
          }

          var styleBaseURL = "https://www.w3.org/StyleSheets/TR/{version}";
          var finalStyleURL = "";
          var styleFile = "W3C-";

          // Figure out which style file to use.
          switch (conf.specStatus.toUpperCase()){
            case "CG-DRAFT":
            case "CG-FINAL":
            case "BG-DRAFT":
            case "BG-FINAL":
              styleFile = conf.specStatus.toLowerCase();
              break;
            case "FPWD":
            case "LC":
            case "WD-NOTE":
            case "LC-NOTE":
              styleFile += "WD";
              break;
            case "WG-NOTE":
            case "FPWD-NOTE":
              styleFile += "WG-NOTE.css";
              break;
            case "UNOFFICIAL":
              styleFile += "UD";
              break;
            case "FINDING":
            case "FINDING-DRAFT":
            case "BASE":
              styleFile = "base";
              break;
            default:
              styleFile += conf.specStatus;
          }

          // Select between released styles and experimental style.
          var version = selectStyleVersion(conf.useExperimentalStyles || "2016");

          // Make spec mobile friendly by attaching meta viewport
          if (!doc.head.querySelector("meta[name=viewport]")) {
            attachMetaViewport(doc);
          }

          // Attach W3C fixup script after we are done.
          if (version) {
            var subscribeKey = pubsubhub.sub("end-all", function (){
              attachFixupScript(version);
              pubsubhub.unsub(subscribeKey);
            });
          }
          var finalVersionPath = (version) ? version + "/" : "";
          finalStyleURL = styleBaseURL.replace("{version}", finalVersionPath);
          finalStyleURL += styleFile;

          utils.linkCSS(doc, finalStyleURL);
          cb();
        }
      };
    }
);
