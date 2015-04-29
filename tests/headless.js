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

function runPhantom () {
    if (process.env.TRACE) {
        console.log("PhantomJS version:");
        var childProcess = exec('phantomjs -v', function () {});
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
    }
    var childProcess = exec('phantomjs --ssl-protocol=any --ignore-ssl-errors=yes ./tests/phantom.js ' + (process.argv.slice(2).join(" ")), function () {});
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    childProcess.on('exit', function (code) {
        process.exit(code);
    });
}

if (!process.env.TRAVIS) {
    builder.buildW3C(false, function () {
        console.log("Script built");
        runPhantom();
    });
}
else {
    runPhantom();
}
