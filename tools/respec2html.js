#!/usr/bin/env phantomjs --ssl-protocol=any

/*global phantom, respecEvents, respecConfig, require*/
// respec2html is a command line utility that converts a ReSpec source file to an HTML file.
// Depends on PhantomJS <http://phantomjs.org>.

"use strict";
var page = require("webpage").create();
var args = require("system").args.slice();
var fs = require("fs");
var timer;
var reportErrors = false;
var reportWarnings = false;
var ignoreScripts = false;
var errors = [];
var warnings = [];
var delay = 0;

// report console.error on stderr
console.error = function() {
  require("system").stderr.write(Array.prototype.join.call(arguments, " ") + "\n");
};

var eOption = args.indexOf("-e");
if (eOption !== -1) {
  args.splice(args.indexOf("-e"), 1);
  reportErrors = true;
}

if (args.indexOf("-w") !== -1) {
  args.splice(args.indexOf("-w"), 1);
  reportWarnings = true;
}

if (args.indexOf("--delay") !== -1) {
  delay = args.splice(args.indexOf("--delay"), 2)[1];
}

if (args.indexOf("--exclude-script") !== -1) {
  var idx = args.indexOf("--exclude-script");
  var values = args.splice(idx, 2);
  ignoreScripts = values[1];
}

// Reading other parameters
var source = args[1];
var output = args[2];
var timeout = isNaN(args[3]) ? 5 : parseInt(args[3], 10);

if (args.length < 2 || args.length > 4) {
  var usage = "Usage:\n   phantomjs --ssl-protocol=any respec2html.js [-e] [-w] " +
      "[--exclude-script url] respec-source [html-output] [timeout]\n" +
      "   respec-source  ReSpec source file, or an URL to the file\n" +
      "   [-e]                    Report ReSpec errors on stderr\n" +
      "   [-w]                    Report ReSpec warnings on stderr\n" +
      "   [--exclude-script url]  Do not load scripts whose source\n" +
      "                           starts with the passed URL\n" +
      "   [html-output]           Name for the HTML file to be generated,\n" +
      "                           defaults to stdout\n" +
      "   [timeout]               An optional timeout in seconds, default is 10\n";
  console.error(usage);
  phantom.exit(2);
}

// Dealing with ReSpec source being loaded with scheme-relative link
// i.e. <script src='//www.w3.org/Tools/respec/respec-w3c-common'>
page.onResourceRequested = function(requestData, networkRequest) {
  if (requestData.url === "file://www.w3.org/Tools/respec/respec-w3c-common") {
    networkRequest.changeUrl("https://www.w3.org/Tools/respec/respec-w3c-common");
  } else if (ignoreScripts && requestData.url.indexOf(ignoreScripts) === 0) {
    networkRequest.abort();
  }
};

page.onConsoleMessage = function(msg) {
  if (msg.match(/^ERROR: /)) {
    errors.push(msg);
  } else if (msg.match(/^WARN: /)) {
    warnings.push(msg);
  }
};

page.open(source, function(status) {
  if (status !== "success") {
    console.error("Unable to access ReSpec source file.");
    return phantom.exit(1);
  }
  setTimeout(function() {
    page.evaluateAsync(function() {
      $.ajaxSetup({
        timeout: 4000
      });

      function saveToPhantom() {
        require(["core/ui", "ui/save-html"], function(ui, saver) {
          saver.show(ui, respecConfig, document, respecEvents);
          window.callPhantom({
            html: saver.toString()
          });
        });
      }
      if (document.respecDone) {
        saveToPhantom();
      } else {
        respecEvents.sub("end-all", saveToPhantom);
      }
    }, delay * 1000);
  });
  timer = setInterval(function() {
    if (timeout === 0) {
      clearInterval(timer);
      console.error("Timeout loading " + source + ".\n" +
          "  Is it a valid ReSpec source file?\n" +
          "  Did you forget  --ssl-protocol=any?");
      phantom.exit(1);
    }
  }, 1000);
});

page.onCallback = function(data) {
  clearInterval(timer);
  var code = 0;
  if (warnings.length && reportWarnings) {
    console.error(warnings.join("\n"));
    code = 65;
  }
  if (errors.length && reportErrors) {
    console.error(errors.join("\n"));
    code = 64;
  }
  if (output) {
    fs.write(output, data.html, "w");
  } else {
    console.log(data.html);
  }
  phantom.exit(code);
};
