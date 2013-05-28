#!/usr/local/bin/node

var exec = require("child_process").exec
,   express  = require("express")
,   pth  = require("path")
,   dir = pth.join(__dirname, "..")
,   PORT = 3000
;

var express = require('express');
var app = express();
app.use(express.static(dir));
app.listen(PORT);
var childProcess = exec('phantomjs ./tests/phantom.js',
  function (error, stdout, stderr) {
    
});
childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);
childProcess.on('exit', function(code) {
    process.exit(code);
});
