#!/usr/local/bin/node

var fs   = require("fs")
,   pth  = require("path")
,   b    = require("./builder")
,   version = JSON.parse(fs.readFileSync(pth.join(__dirname, "../package.json"), "utf-8")).version
,   builds = pth.join(__dirname, "../builds")
,   latest = pth.join(builds, "respec-w3c-common.js")
;

function buildW3C (versionSnapshot, cb) {
    var opts = { out: latest };
    if (versionSnapshot === true) {
        opts.version = version;
    }
    else if (typeof versionSnapshot === "string") {
        opts.version = versionSnapshot;
    }
    var versioned = pth.join(builds, "respec-w3c-common-" + opts.version + ".js");
    b.build(opts, function () {
        if (versionSnapshot) fs.writeFileSync(versioned, fs.readFileSync(latest, "utf8"), { encoding: "utf8" });
        cb();
    });
}

if (require.main === module) {
    buildW3C(true, function () {
        console.log("OK!");
    });
}

exports.buildW3C = buildW3C;
