describe("Core — Override Configuration", function () {
    var MAXOUT = 5000;
    it("should override a simple string setting", function () {
        var $orig = $("<iframe width='800' height='200' style='display: none' src='spec/core/simple.html'></iframe>")
        ,   $over = $("<iframe width='800' height='200' style='display: none' src='spec/core/simple.html?specStatus=RSCND'></iframe>")
        ,   counter = 0
        ,   incr = function (ev) {
                if (ev.data && ev.data.topic == "end-all") counter++;
            }
        ;
        window.addEventListener("message", incr, false);
        runs(function () {
            $orig.appendTo($("body"));
            $over.appendTo($("body"));
        });
        waitsFor(function () { return counter == 2; }, MAXOUT);
        runs(function () {
            expect($(".head h2", $orig[0].contentDocument).text()).toMatch(/W3C Editor's Draft/);
            expect($(".head h2", $over[0].contentDocument).text()).toMatch(/W3C Rescinded Recommendation/);
            $orig.remove();
            $over.remove();
            window.removeEventListener("message", incr, false);
        });
    });
});
