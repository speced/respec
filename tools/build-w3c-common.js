#!/usr/local/bin/node

var exec = require("child_process").exec
,   fs   = require("fs")
,   pth  = require("path")
,   version = fs.readFileSync(pth.join(__dirname, "VERSION"), "utf-8").replace(/\n/g, "")
;

console.log("VERSION=" + version);

exec("git symbolic-ref HEAD", function (err, stdout, stderr) {
    if (err) return console.log("ERR: " + err);
    var branch = stdout.replace(/refs\/heads\//, "").replace(/\n/, "");
    console.log("<" + branch + ">");
});

 // check that we are in a release branch
 // get the version number from VERSION
 // be sure to include RequireJS as a dependency so that just a single file can be loaded
 //   node ../../r.js -o baseUrl=. paths.requireLib=../../require name=main include=requireLib out=main-built.js
 // the important parts above are the mapping from paths.requireLib to the require.js source and the include
 // note that we can load r.js here and use its API to drive the above (rather than shelling out)
 // for the time being, we also need to specify the biblio as a dependency -- that will change of course
 // output both
 //   builds/respec-w3c-common.js (latest)
 //   builds/respec-w3c-common-3.0.7.js (specific version)

