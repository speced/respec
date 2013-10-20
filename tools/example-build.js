#!/usr/local/bin/node

var fs   = require("fs")
,   pth  = require("path")
,   b  = require("./builder")
;

b.build({
    optimize:   "none"
,   out:        pth.join(__dirname, "../examples/respec-debug.js")
}, function () {
    console.log("DONE");
});
