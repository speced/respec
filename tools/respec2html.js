// respec2html is a command line utility that converts a ReSpec source file to an HTML file.
// Depends on PhantomJS <http://phantomjs.org>.

var page = require('webpage').create(),
    args = require('system').args,
    fs = require('fs');

if (args.length !== 3) {
    console.log('Usage:\n   phantomjs respec2html.js [respec-source] [html-output]\n');
    console.log('   [respec-source]\t ReSpec source file, or an URL to the file');
    console.log('   [html-output]\t Name for the HTML file to be generated\n');
    phantom.exit();
}

page.open(args[1], function(status) {
    page.onResourceRequested = function(request) {
        console.log('Loading ' + request.url);
    };
    
    if (status !== 'success') {
        console.log('Unable to access ReSpec source file.');
        phantom.exit();
    } else {
        console.log('Loading ' + args[1]);
        var timer = setInterval(function() {
            // Poll document.respecDone for doneness. A proper way would be to listen
            // for the end-all message on respecEvents (unsupported by PhantomJS).
            var done = page.evaluate(function() { return (document.respecDone) ? true : false; });
            if (done) {
                clearInterval(timer);
                console.log('Serializing the DOM into HTML...');
                var html = page.evaluate(function() {
                    // Serialize the DOM using the built-in serializer.
                    (new berjon.respec()).toHTMLSource();
                    var outer = document.querySelector('html').outerHTML;
                    return '<!DOCTYPE html>\n' + outer.replace('<head>', '\n<head>');
                });
                fs.write(args[2], html, 'w');
                console.log(args[2] + ' created!\n')
                phantom.exit();
            } else {
                console.log('Invalid ReSpec source file. Exiting.');
                phantom.exit();
            }
        }, 1000);
    }
});