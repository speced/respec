#!/usr/local/bin/node

var fs   = require("fs")
,   pth  = require("path")
,   r    = require("requirejs")
,   version = JSON.parse(fs.readFileSync(pth.join(__dirname, "../package-pcisig.json"), "utf-8")).version
// ,   builds = pth.join(__dirname, "../builds")
// ,   versioned = pth.join(builds, "respec-pcisig-common-" + version + ".js")
;

// options:
//  optimize:   none || uglify || uglify2
//  out:        /path/to/output
function build (options, cb) {
    // optimisation settings
    // note that the paths/includes below will need to change in when we drop those
    // older dependencies
    var config = {
        baseUrl:    pth.join(__dirname, "../js")
    ,   optimize:   options.optimize || "uglify2"
    ,   paths:  {
            requireLib: "./require"
        }
    ,   shim:   {
            "shortcut": {
                exports:    "shortcut"
            }
        }
    ,   name:       "profile-pcisig-common"
    ,   include:    "requireLib".split(" ")
    ,   out:        options.out
    ,   inlineText: true
    ,   preserveLicenseComments:    false
    };
    r.optimize(config, function () {
        // add header
        try {
            fs.writeFileSync(config.out
                        ,   "/* ReSpec " + version +
                            " - Steve Glaser, http://sglaser.com/ (@sglaser2) */\n" +
                            " - Robin Berjon, http://berjon.com/ (@robinberjon) */\n" +
                            "/* Documentation: http://w3.org/respec/. */\n" +
                            "/* See original source for licenses: https://github.com/darobin/respec. */\n" +
                            "/* See modified source: https://github.com/sglaser/respec. */\n" +
                            "respecVersion = '" + version + "';\n" +
                            fs.readFileSync(config.out, "utf8") + "\nrequire(['profile-pcisig-common']);\n");
        }
        catch (e) {
            console.log("ERROR", e);
        }
        cb();
    });
}

exports.build = build;
