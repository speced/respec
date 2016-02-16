/*jshint strict: true, phantom:true*/

"use strict";
var page = require("webpage").create();
var env = require("system").env;
var args = require("system").args;
var url = "http://localhost:3000/tests/phantom-runner.html?filter=" + (args.slice(1).join("%20"));

page.open(url, function() {});

page.onConsoleMessage = function(msg) {
  if (msg === "JASMINE: ConsoleReporter finished") {
    var console_reporter = page.evaluate(function() {
      return console_reporter;
    });
    phantom.exit(console_reporter.status);
  } else if (msg.indexOf("JASMINE: ") === 0) {
    console.log(msg.replace("JASMINE: ", ""));
  } else if (env.TRACE) {
    console.log(msg);
  }
};
