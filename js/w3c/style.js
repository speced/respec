/*jshint strict: true, browser:true, jquery: true*/
/*globals define*/
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
"use strict";
define(
    ["core/utils"],
    function(utils) {
      function attachFixupScript(doc, version){
        var script = doc.createElement("script");
        script.async = true;
        script.defer = true;
        var helperScript = "https://www.w3.org/scripts/TR/{version}/fixup.js"
          .replace("{version}", version);
        script.src = helperScript;
        doc.body.appendChild(script);
      }

      function attachMetaViewport(doc){
        var meta = doc.createElement("meta");
        meta.name = "viewport";
        var contentProps = {
            "initial-scale": "1",
            "shrink-to-fit": "no",
            "width": "device-width",
        };
        meta.content = utils.toKeyValuePairs(contentProps).replace(/\"/g, "")
        doc.head.appendChild(meta);
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
        run: function(conf, doc, cb, msg) {
          msg.pub("start", "w3c/style");

          if (!conf.specStatus) {
            var warn = "'specStatus' missing from ReSpec config. Defaulting to 'base'.";
            conf.specStatus = "base";
            msg.pub("warn", warn);
          }

          var styleBaseURL = "https://www.w3.org/StyleSheets/TR/{version}";
          var finalStyleURL = "";
          var styleFile = "W3C-";

          // Figure out which style file to use.
          switch (conf.specStatus){
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
            case "FPWD-NOTE":
              styleFile += "WG-NOTE";
              break;
            case "unofficial":
              styleFile += "UD";
              break;
            case "finding":
            case "finding-draft":
            case "base":
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
            var subscribeKey = window.respecEvents.sub("end-all", function (){
              attachFixupScript(doc, version);
              window.respecEvents.unsub("end-all", subscribeKey);
            });
          }
          var finalVersionPath = (version) ? version + "/" : "";
          finalStyleURL = styleBaseURL.replace("{version}", finalVersionPath);
          finalStyleURL += styleFile;

          utils.linkCSS(doc, finalStyleURL);
          msg.pub("end", "w3c/style");
          cb();
        }
      };
    }
);
