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
        switch (value.trim()) {
        case "true":
          return true;
        case "false":
          return false;
        case "null":
          return null;
        }
        return value;
      }
      return {
        run: function(conf, doc, cb) { //jshint ignore:line
          if (!location.search) {
            return cb();
          }

          location.search
            //Remove "?" from search
            .replace(/^\?/, "")
            // The default separator is ";" for key/value pairs
            .split(";")
            .filter(function removeEmpties(item) {
              return Boolean(item);
            })
            .map(function decodeKeyValues(item) {
              var keyValue = item.split("=", 2);
              var key = decodeURI(keyValue[0]);
              var value = decodeURI(keyValue[1].replace(/%3D/g, "="));
              value = castToType(value)
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
          cb();
        }
      };
    }
);
