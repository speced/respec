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

builder.buildW3C(false, function () {
    console.log("Script built");
    var childProcess = exec('phantomjs ./tests/phantom.js', function () {});
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    childProcess.on('exit', function (code) {
        process.exit(code);
    });
});
