
require([
            // must be first
            "core/base-runner"

        ,   "w3c/legacy"
        ], 
        function (runner) {
            var args = arguments;
            require.ready(function () {
                runner.runAll(Array.prototype.slice.call(args));
            });
        }
);
