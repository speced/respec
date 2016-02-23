/*jshint strict:true, maxcomplexity:5 */
/*globals define*/
// Module core/override-configuration
// A helper module that makes it possible to override settings specified in respecConfig
// by passing them as a query string. This is useful when you just want to make a few
// tweaks to a document before generating the snapshot, without mucking with the source.
// For example, you can change the status and date by appending:
//      ?specStatus=LC;publishDate=2012-03-15
// Note that fields are separated by semicolons and not ampersands.
// TODO
//  There could probably be a UI for this to make it even simpler.
"use strict";
define(
    [],
    function() {
      function castToType(value) {
        var result;
        switch (value.trim()) {
        case "true":
        case "false":
          result = (value === "true");
          break;
        case "null":
          result = null;
          break;
        default:
          result = value;
          break;
        }
        return value;
      }
      return {
        run: function(conf, doc, cb, msg) { //jshint ignore:line
          msg.pub("start", "core/override-configuration");
          var done = function() {
            msg.pub("end", "core/override-configuration");
            cb();
          };

          if (!location.search) {
            return done();
          }

          location.search
            //Remove "?" from search
            .replace(/^\?/, "")
            // The default separator is ";" for key/value pairs
            .split(";")
            .filter(function removeEmpties(item) {
              return Boolean(item);
            })
            .map(function makeKeyValuePairs(item) {
              return item.split("=", 2);
            })
            .map(function decodeKeyValues(keyValue) {
              var key = decodeURI(keyValue[0]);
              var value = decodeURI(keyValue[1].replace(/%3D/g, "="));
              return [key, value];
            })
            .map(function attemptTypeCast(keyValue) {
              return [keyValue[0], castToType(keyValue[1])];
            })
            // try to JSON.parse values, or just use the string otherwise.
            .map(function toJSONifiedValues(keyValue) {
              var key = keyValue[0];
              var value;
              try {
                value = JSON.parse(keyValue[1]);
              } catch (err) {
                value = keyValue[1];
              }
              return [key, value];
            })
            // Override the conf properties by reducing
            .reduce(function reduceIntoConfig(conf, keyValue) {
              conf[keyValue[0]] = keyValue[1];
              return conf;
            }, conf);
          done();
        }
      };
    }
);
