
define([
            "domReady"
        ,   "core/base-runner"
        ,   "core/default-root-attr"
        ,   "w3c/legacy"
        ], 
        function (domReady, runner) {
            var args = arguments;
            domReady(function () {
                runner.runAll(Array.prototype.slice.call(args));
            });
        }
);
