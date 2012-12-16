function loadWithStatus (s, uri) {
    var $ifr = $("<iframe width='800' height='200' style='display: none' src='spec/core/simple.html?specStatus=" + s + "'></iframe>")
    ,   loaded = false
    ,   MAXOUT = 5000
    ,   incr = function (ev) {
            if (ev.data && ev.data.topic == "end-all") loaded = true;
        }
    ;
    runs(function () {
        window.addEventListener("message", incr, false);
        $ifr.appendTo($("body"));
    });
    waitsFor(function () { return loaded; }, MAXOUT);
    runs(function () {
        console.log(s, uri);
        expect($("link[href^='" + uri + "']", $ifr[0].contentDocument).length == 1).toBeTruthy();
        $ifr.remove();
        loaded = false;
        window.removeEventListener("message", incr, false);
    });
}

describe("W3C - Style", function () {
    it("should style according to spec status", function () {
        var status = "FPWD   WD-NOTE finding unofficial     base RSCND      FPWD-NOTE".split(/\s+/)
        ,   uris   = "W3C-WD W3C-WD  base    w3c-unofficial base W3C-RSCND  W3C-WG-NOTE".split(/\s+/)
        ;
        for (var i = 0, n = status.length; i < n; i++) {
            loadWithStatus(status[i], "http://www.w3.org/StyleSheets/TR/" + uris[i]);
        }
        loadWithStatus("CG-FINAL", "http://www.w3.org/community/src/css/spec/cg-final");
    });
});