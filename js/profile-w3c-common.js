
define([
            "domReady"
        ,   "core/base-runner"
        ,   "w3c/legacy"
        ], 
        function (domReady, runner) {
            var args = arguments;
            domReady(function () {
                runner.runAll(Array.prototype.slice.call(args));
            });
        }
);
