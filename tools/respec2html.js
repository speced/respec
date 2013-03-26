/*global phantom*/
// respec2html is a command line utility that converts a ReSpec source file to an HTML file.
// Depends on PhantomJS <http://phantomjs.org>.

var page = require('webpage').create(),
    args = require('system').args,
    fs = require('fs'),
    source = args[1],
    output = args[2],
    timeout = (!isNaN(args[3])) ? parseInt(args[3], 10) : 10;

if (args.length !== 3 && args.length !== 4) {
    console.log('Usage:\n   phantomjs respec2html.js respec-source html-output [timeout]\n');
    console.log('   respec-source  ReSpec source file, or an URL to the file');
    console.log('   html-output    Name for the HTML file to be generated');
    console.log('   [timeout]      An optional timeout in seconds, default is 10\n');
    phantom.exit();
}

page.open(source, function (status) {
    if (status !== 'success') {
        console.log('Unable to access ReSpec source file.');
        phantom.exit();
    }
    else {
        console.log('Loading ' + source);
        var timer = setInterval(function () {
            // Poll document.respecDone for doneness. A proper way would be to listen
            // for the end-all message on respecEvents (unsupported by PhantomJS).
            var done = page.evaluate(function () { return (document && document.respecDone) ? true : false; });
            if (done) {
                clearInterval(timer);
                console.log('Serializing the DOM into HTML...');
                var html = page.evaluate(function() {
                    // Serialize the DOM using the built-in serializer.
                    var outer = document.querySelector('html').outerHTML;
                    return '<!DOCTYPE html>\n' + outer.replace('<head>', '\n<head>');
                });
                fs.write(output, html, 'w');
                console.log(output + ' created!\n');
                phantom.exit();
            } else {
                if (timeout === 0) {
                    clearInterval(timer);
                    console.log('Timeout loading ' + source + '. Is it a valid ReSpec source file?');
                    phantom.exit();
                } else {
                    console.log('Timing out in ' + timeout-- + ' s');
                }
            }
        }, 1000);
    }
});