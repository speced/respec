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
      return {
        run: function(conf, doc, cb) { //jshint ignore:line
          if (!location.search) {
            return cb();
          }
          var overrideProps = doc.location.search
            //Remove "?" from search
            .replace(/^\?/, "")
            // The default separator is ";" for key/value pairs
            .split(";")
            .filter(function removeEmpties(item) {
              return item.trim();
            })
            .reduce(function decodeKeyValues(collector, item) {
              var keyValue = item.split("=", 2);
              var key = decodeURIComponent(keyValue[0]);
              var value = decodeURIComponent(keyValue[1].replace(/%3D/g, "="));
              var parsedValue;
              try {
                parsedValue = JSON.parse(value);
              } catch (err) {
                parsedValue = value;
              }
              collector[key] = parsedValue;
              return collector;
            }, {});
          Object.assign(conf, overrideProps);
          cb();
        }
      };
    }
);
