function loadWithStatus (s, uri) {
    var $ifr = $("<iframe width='800' height='200' style='display: none' src='spec/core/simple.html?specStatus=" + s + "'></iframe>")
    ,   loaded = false
    ,   MAXOUT = 5000
    ,   incr = function (ev) {
            if (ev.data && ev.data.topic == "end-all") loaded = true, console.log("OK");
        }
    ;
    window.addEventListener("message", incr, false);
    runs(function () {
        $ifr.appendTo($("body"));
    });
    waitsFor(function () { return loaded; }, MAXOUT);
    runs(function () {
        console.log("loaded " + s + ", http://www.w3.org/StyleSheets/TR/" + uri);
        console.log($("link[href='http://www.w3.org/StyleSheets/TR/" + uri + "']", $ifr[0].contentDocument));
        console.log($("link", $ifr[0].contentDocument));
        expect($("link[href='http://www.w3.org/StyleSheets/TR/" + uri + "']", $ifr[0].contentDocument).length == 1).toBeTruthy();
        $ifr.remove();
        window.removeEventListener("message", incr, false);
    });
}

describe("W3C — Style", function () {
    it("should style according to spec status", function () {
        var status = "FPWD   WD-NOTE finding unofficial     base RSCND".split(/\s+/)
        ,   uris   = "W3C-WD W3C-WD  base    w3c-unofficial base W3C-RSCND".split(/\s+/)
        ;
        // for (var i = 0, n = status.length; i < n; i++) {
            loadWithStatus(status[5], uris[5]);
        // }
    });
});