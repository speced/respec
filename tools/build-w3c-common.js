#!/usr/local/bin/node

var exec = require("child_process").exec
,   fs   = require("fs")
,   pth  = require("path")
,   r    = require("./r")
,   version = fs.readFileSync(pth.join(__dirname, "VERSION"), "utf-8").replace(/\n/g, "")
,   builds = pth.join(__dirname, "../builds")
,   versioned = pth.join(builds, "respec-w3c-common-" + version + ".js")
;

// check that we are in a release branch
exec("git symbolic-ref HEAD", function (err, stdout, stderr) {
    if (err) return console.log("ERR: " + err);
    var branch = stdout.replace(/refs\/heads\//, "").replace(/\n/, "");
    // if (branch != "release/v" + version)
    //     return console.log("Current branch (" + branch + ") does not match release/v" + version);
    // if (pth.existsSync(versioned))
    //     return console.log("Output build file respec-w3c-common-" + version + ".js already exists");
    
    // optimisation settings
    // note that the paths/includes below will need to change in when we drop those
    // older dependencies
    var config = {
        baseUrl:    pth.join(__dirname, "../js")
    ,   optimize:   "none"
    ,   paths:  {
            requireLib: "./require"
        ,   biblio:     "../bibref/biblio"
        ,   simpleNode: "./simple-node"
        ,   shortcut:   "./shortcut"
        ,   sh_main:    "./sh_main.min"
        ,   sh_css:     "./lang/sh_css.min"
        ,   sh_html:    "./lang/sh_html.min"
        ,   sh_js:      "./lang/sh_javascript.min"
        ,   sh_js_dom:  "./lang/sh_javascript_dom.min"
        ,   sh_xml:     "./lang/sh_xml.min"
        }
    ,   name:       "profile-w3c-common"
    ,   include:    "requireLib biblio simpleNode shortcut sh_main sh_css sh_html sh_js sh_js_dom sh_xml".split(" ")
    ,   out:        pth.join(builds, "respec-w3c-common.js")
    ,   inlineText: true
    };
    r.optimize(config, function (resp) {
        fs.writeFileSync(versioned, fs.readFileSync(config.out));
        console.log("OK!");
    });
});

 // output both
 //   builds/respec-w3c-common.js (latest)
 //   builds/respec-w3c-common-3.0.7.js (specific version)

