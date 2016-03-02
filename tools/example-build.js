#!/usr/local/bin/node

"use strict";
const pth = require("path");
const builder = require("./builder").Builder;
const options = {
  optimize: "none",
  out: pth.join(__dirname, "../examples/respec-debug.js")
};
builder.build(options).catch(
  (err) => console.log(err.stack)
);
