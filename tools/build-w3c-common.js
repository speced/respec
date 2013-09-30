#!/usr/local/bin/node

var fs   = require("fs")
,   pth  = require("path")
,   b    = require("./builder")
,   version = JSON.parse(fs.readFileSync(pth.join(__dirname, "../package.json"), "utf-8")).version
,   builds = pth.join(__dirname, "../builds")
,   latest = pth.join(builds, "respec-w3c-common.js")
,   versioned = pth.join(builds, "respec-w3c-common-" + version + ".js")
;

function buildW3C (versionSnapshot, cb) {
    console.log("running with versionSnapshot=", versionSnapshot, latest);
    b.build({ out: latest }, function () {
        console.log("in build cb");
        if (versionSnapshot) fs.writeFileSync(versioned, fs.readFileSync(latest, "utf8"), { encoding: "utf8" });
        console.log("exiting build cb");
        cb();
    });
    console.log("called build");
}

if (require.main === module) {
    buildW3C(true, function () {
        console.log("OK!");
    });
}

exports.buildW3C = buildW3C;
