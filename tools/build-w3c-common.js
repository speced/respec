#!/usr/bin/env node

"use strict";
const async = require("marcosc-async");
const Builder = require("./builder").Builder;
const colors = require("colors");

colors.setTheme({
  error: "red",
});

function buildW3C() {
  return async.task(function*() {
    yield Builder.build({ name: "w3c-common" });
  });
}

if (require.main === module) {
  buildW3C()
    .catch(
      err => console.error(` ☠ ️ ${colors.error(err.stack)}`)
    );
}

exports.buildW3C = buildW3C;
