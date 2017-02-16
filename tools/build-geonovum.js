#!/usr/bin/env node

"use strict";
const async = require("marcosc-async");
const Builder = require("./builder").Builder;
const colors = require("colors");

colors.setTheme({
  error: "red",
});

exports.buildGeonovum = function buildGeonovum() {
  return async.task(function*() {
    yield Builder.build({ name: "geonovum" });
  });
};

if (require.main === module) {
  exports.buildGeonovum()
    .catch(
      err => console.error(` ☠ ️ ${colors.error(err.stack)}`)
    );
}
