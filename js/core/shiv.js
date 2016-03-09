
// Module core/shiv
// Injects the HTML5 shiv conditional comment

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/shiv");
                var cmt = doc.createComment("[if lt IE 9]><script src='https://www.w3.org/2008/site/js/html5shiv.js'></script><![endif]");
                $("head").append(cmt);
                msg.pub("end", "core/shiv");
                cb();
            }
        };
    }
);
