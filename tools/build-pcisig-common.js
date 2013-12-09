#!/usr/local/bin/node

var fs   = require("fs")
,   pth  = require("path")
,   b    = require("./builder-pcisig")
,   version = JSON.parse(fs.readFileSync(pth.join(__dirname, "../package-pcisig.json"), "utf-8")).version
,   builds = pth.join(__dirname, "../builds")
,   latest = pth.join(builds, "respec-pcisig-common.js")
,   versioned = pth.join(builds, "respec-pcisig-common-" + version + ".js")
;

function buildPCISIG (versionSnapshot, cb) {
    b.build({ out: latest }, function () {
        if (versionSnapshot) fs.writeFileSync(versioned, fs.readFileSync(latest, "utf8"), { encoding: "utf8" });
        cb();
    });
}

if (require.main === module) {
    buildPCISIG(true, function () {
        console.log("OK!");
    });
}

exports.buildPCISIG = buildPCISIG;
