var page = require("webpage").create()
,   env = require("system").env
,   args = require("system").args
;

page.open("http://localhost:3000/tests/phantom-runner.html?filter=" + (args.slice(1).join("%20")), function () {});

page.onConsoleMessage = function (msg) {
    if (msg === "JASMINE: ConsoleReporter finished") {
        var console_reporter = page.evaluate(function () {
            return console_reporter;
        });
        phantom.exit(console_reporter.status);
    }
    else if (msg.indexOf("JASMINE: ") === 0) {
        console.log(msg.replace("JASMINE: ", ""));
    }
    else if (env.TRACE) {
        console.log(msg);
    }
};
