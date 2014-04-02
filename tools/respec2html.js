#!/usr/local/bin/phantomjs
/*global phantom, respecEvents, respecConfig*/

// respec2html is a command line utility that converts a ReSpec source file to an HTML file.
// Depends on PhantomJS <http://phantomjs.org>.

var page = require("webpage").create()
,   args = require("system").args
,   fs = require("fs")
,   source = args[1]
,   output = args[2]
,   timeout = isNaN(args[3]) ? 10: parseInt(args[3], 10)
,   timer
;

if (args.length < 2 || args.length > 4) {
    var usage = "Usage:\n   phantomjs --ssl-protocol=any respec2html.js respec-source [html-output] [timeout]\n" +
                "   respec-source  ReSpec source file, or an URL to the file" +
                "   [html-output]  Name for the HTML file to be generated, defaults to stdout" +
                "   [timeout]      An optional timeout in seconds, default is 10\n";
    console.error(usage);
    phantom.exit(1);
}

page.open(source, function (status) {
    if (status !== "success") {
        console.error("Unable to access ReSpec source file.");
        phantom.exit(1);
    }
    else {
        if (output) console.error("Loading " + source);
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
                if (output) console.error("Timing out in " + --timeout + "s...");
            }
        }, 1000);
    }
});

page.onCallback = function (data) {
    clearInterval(timer);
    if (output) fs.write(output, data.html, "w");
    else        console.log(data.html);
    if (output) console.error(output + " created!");
    phantom.exit(0);
};
