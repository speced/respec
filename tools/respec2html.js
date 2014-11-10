#!/usr/local/bin/phantomjs
/*global phantom, respecEvents, respecConfig*/

// respec2html is a command line utility that converts a ReSpec source file to an HTML file.
// Depends on PhantomJS <http://phantomjs.org>.

var page = require("webpage").create()
,   args = require("system").args.slice()
,   fs = require("fs")
,   timer
,   reportErrors = false
,   reportWarnings = false
,   errors = []
,   warnings = []
;

// report console.error on stderr
console.error = function () {
    require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
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

// Reading other parameters
var source = args[1]
,   output = args[2]
,   timeout = isNaN(args[3]) ? 10: parseInt(args[3], 10);


if (args.length < 2 || args.length > 4) {
    var usage = "Usage:\n   phantomjs --ssl-protocol=any respec2html.js [-e] [-w] respec-source [html-output] [timeout]\n" +
                "   respec-source  ReSpec source file, or an URL to the file" +
                "   [-e]           Report ReSpec errors on stderr" +
                "   [-w]           Report ReSpec warnings on stderr" +
                "   [html-output]  Name for the HTML file to be generated, defaults to stdout" +
                "   [timeout]      An optional timeout in seconds, default is 10\n";
    console.error(usage);
    phantom.exit(1);
}

// Dealing with ReSpec source being loaded with scheme-relative link
// i.e. <script src='//www.w3.org/Tools/respec/respec-w3c-common'>
page.onResourceRequested = function (requestData, networkRequest) {
    if (requestData.url === "file://www.w3.org/Tools/respec/respec-w3c-common") {
        networkRequest.changeUrl("https://www.w3.org/Tools/respec/respec-w3c-common");
    }
};

page.onConsoleMessage = function (msg) {
    if (msg.match(/^ERROR: /)) {
        errors.push(msg);
    } else if (msg.match(/^WARN: /)) {
        warnings.push(msg);
    }
};

page.open(source, function (status) {
    if (status !== "success") {
        console.error("Unable to access ReSpec source file.");
        phantom.exit(1);
    }
    else {
        console.error("Loading " + source);
        page.evaluateAsync(function () {
            function saveToPhantom () {
                require(["core/ui", "ui/save-html"], function (ui, saver) {
                           saver.show(ui, respecConfig, document, respecEvents);
                           window.callPhantom({ html: saver.toString() });
                });
            }
            if (document.respecDone) saveToPhantom();
            else respecEvents.sub("end-all", saveToPhantom);
        });
        timer = setInterval(function () {
            if (timeout === 0) {
                clearInterval(timer);
                console.error("Timeout loading " + source + ".\n" +
                              "  Is it a valid ReSpec source file?\n" +
                              "  Did you forget  --ssl-protocol=any?");
                phantom.exit(1);
            }
            else {
                console.error("Timing out in " + --timeout + "s...");
            }
        }, 1000);
    }
});

page.onCallback = function (data) {
    clearInterval(timer);
    var exit = 0;
    if (warnings.length && reportWarnings) {
        console.error(warnings.join("\n"));
        exit = 65;
    }
    if (errors.length && reportErrors) {
        console.error(errors.join("\n"));
        exit = 64;
    }
    if (output) fs.write(output, data.html, "w");
    else console.log(data.html);
    if (output) console.error(output + " created!");
    phantom.exit(exit);
};
