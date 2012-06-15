describe("Core — Data Include", function () {
    var MAXOUT = 5000, $ifr = $("<iframe width='800' height='200' style='display: none'></iframe>"), loaded = false;
    // this does not test much, someone for whom this is important should provide more tests
    it("should include an external file", function () {
        $ifr.attr("src", "spec/core/includer.html");
        runs(function () {
            window.addEventListener("message", function (ev) { if (ev.data && ev.data.topic == "end-all") loaded = true; }, false);
            $ifr.appendTo($("body"));
        });
        waitsFor(function () { return loaded; }, MAXOUT);
        runs(function () {
            var $sec = $("#includes", $ifr[0].contentDocument);
            expect($sec.find("p").length).toEqual(1);
            expect($sec.find("p").text()).toEqual("INCLUDED");
            expect($sec.find("div > p").length).toEqual(1);
            expect($sec.find("div > p").attr("data-include")).toBeFalsy();
            $ifr.remove();
        });
    });
});
