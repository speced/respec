
describe("Core — Override Configuration", function () {
    "use strict";
    flushIframes();

    it("should override a simple string setting", function (done) {
        var $orig = $("<iframe width='800' height='200' style='display: none' src='spec/core/simple.html'></iframe>")
        var $over = $("<iframe width='800' height='200' style='display: none' src='spec/core/simple.html?specStatus=RSCND'></iframe>")
        var counter = 0

        window.addEventListener("message", incr, false);
            $orig.appendTo($("body"));
            $over.appendTo($("body"));
        });

            expect($(".head h2", $orig[0].contentDocument).text()).toMatch(/W3C Editor's Draft/);
            expect($(".head h2", $over[0].contentDocument).text()).toMatch(/W3C Rescinded Recommendation/);
            window.removeEventListener("message", incr, false);
            done();
    });
});
