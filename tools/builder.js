#!/usr/local/bin/node

var fs   = require("fs")
,   pth  = require("path")
,   r    = require("requirejs")
,   version = JSON.parse(fs.readFileSync(pth.join(__dirname, "../package.json"), "utf-8")).version
// ,   builds = pth.join(__dirname, "../builds")
// ,   versioned = pth.join(builds, "respec-w3c-common-" + version + ".js")
;

// options:
//  optimize:   none || uglify || uglify2
//  out:        /path/to/output
function build (options, cb) {
    console.log("in build");
    // optimisation settings
    // note that the paths/includes below will need to change in when we drop those
    // older dependencies
    var config = {
        baseUrl:    pth.join(__dirname, "../js")
    ,   optimize:   options.optimize || "uglify2"
    ,   paths:  {
            requireLib: "./require"
        ,   simpleNode: "./simple-node"
        ,   shortcut:   "./shortcut"
        }
    ,   name:       "profile-w3c-common"
    ,   include:    "requireLib simpleNode shortcut".split(" ")
    ,   out:        options.out
    ,   inlineText: true
    ,   preserveLicenseComments:    false
    };
    console.log("building with config", JSON.stringify(config, null, 4));
    r.optimize(config, function () {
        console.log("callback from optimize");
        // add header
        fs.writeFileSync(config.out
                    ,   "/* ReSpec " + version +
                        " - Robin Berjon, http://berjon.com/ (@robinberjon) */\n" +
                        "/* Documentation: http://w3.org/respec/. */\n" +
                        "/* See original source for licenses: https://github.com/darobin/respec. */\n" +
                        fs.readFileSync(config.out, "utf8") + "\nrequire(['profile-w3c-common']);\n"
                    ,   { encoding: "utf8" });
        console.log("about to exit optimize");
        cb();
    });
}

exports.build = build;
