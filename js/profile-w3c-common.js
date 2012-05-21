
define([
            "domReady"
        ,   "core/base-runner"
        ,   "w3c/legacy"
        ], 
        function (domReady, runner) {
            console.log("RUNNING");
            var args = arguments;
            domReady(function () {
                console.log("READY");
                runner.runAll(Array.prototype.slice.call(args));
                console.log("ALL RUN");
            });
        }
);
