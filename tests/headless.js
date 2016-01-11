#!/usr/local/bin/node
/*jshint es5: true*/

var exec = require("child_process").exec
,   express  = require("express")
,   pth  = require("path")
,   dir = pth.join(__dirname, "..")
,   PORT = 3000
,   builder = require("../tools/build-w3c-common")
;

var express = require('express');
var app = express();
app.use(express.static(dir));
app.listen(PORT);

var counter = 0;

function done() {
    counter--;
    if (!counter) {
        process.exit(0);
    }
}

function runPhantom () {
    if (process.env.TRACE) {
        console.log("PhantomJS version:");
        var childProcess = exec('phantomjs -v', function () {});
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
    }
    counter++;
    var childProcess = exec('phantomjs --ssl-protocol=tlsv1 ./tests/phantom.js ' + (process.argv.slice(2).join(" ")), function () {});
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    childProcess.on('exit', function(code) {
        if (code > 0) {
            process.exit(code);
        }
        done();
    });
}

function buildFailureReporter(source) {
    return function(code) {
        if (code > 0) {
            console.error("Running respec2html on " + source + " failed");
            process.exit(code);
        } else {
            console.log("Success building " + source);
        }
        done();
    }
}

function runRespec2html () {
   var fs = require("fs");
   // Run respec2html.js on each example file (except "embedder.html")
   // and stops in error if any of them reports a warning or an error
   var sources = fs.readdirSync("examples").filter(function(n) { return n.match(/\.html$/) && n !== "embedder.html" ;});
   sources.forEach(function(s) {
       // We use --delay 1 since the examples use the non-compiled version
       // of respec, which takes a bit longer to load
       var cmd = 'phantomjs --ssl-protocol=tlsv1 ./tools/respec2html.js --delay 1 -w -e examples/' + s;
       console.log("Running " + cmd);
       counter++;
       var childProcess = exec(cmd, function () {});
       childProcess.stderr.pipe(process.stderr);
       childProcess.on('exit', buildFailureReporter(s));
   });
}

if (!process.env.TRAVIS) {
    builder.buildW3C(false, function () {
        console.log("Script built");
        runPhantom();
        runRespec2html();
    });
}
else {
    runPhantom();
    runRespec2html();
}
