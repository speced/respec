function loadWithConfig (conf, check) {
    var config = [];
    for (var k in conf) {
        config.push(k + "=" + encodeURI($.isArray(conf[k]) ? JSON.stringify(conf[k]) : conf[k]).replace(/=/g, "%3D"));
    }
    var $ifr = $("<iframe width='800' height='200' style='display: none'></iframe>")
    ,   loaded = false
    ,   MAXOUT = 5000
    ,   incr = function (ev) {
            if (ev.data && ev.data.topic == "end-all") loaded = true;
        }
    ;
    $ifr.attr("src", "spec/core/simple.html?" + config.join(";"));
    runs(function () {
        window.addEventListener("message", incr, false);
        $ifr.appendTo($("body"));
    });
    waitsFor(function () { return loaded; }, MAXOUT);
    runs(function () {
        check($ifr);
        $ifr.remove();
        loaded = false;
        window.removeEventListener("message", incr, false);
    });
}

describe("W3C — Permalinks", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Shane McCarron",
                           url:  "http://URI",
                           company: "COMPANY",
                           companyURI: "http://COMPANY",
                           mailto:     "EMAIL",
                           note:       "NOTE"}]
        ,   shortName: "some-spec"
        ,   publicationDate: "2013-06-25"
        ,   previousPublishDate: "2012-06-07"
        ,   previousMaturity:  "REC"
        ,   specStatus: "PER"
        ,   wgPatentURI:  "http://www.w3.org/fake-patent-uri"
        ,   includePermalinks: true
        ,   doRDFa: false
        }
    ,   noConfig = {
            editors:    [{ name: "Shane McCarron",
                           url:  "http://URI",
                           company: "COMPANY",
                           companyURI: "http://COMPANY",
                           mailto:     "EMAIL",
                           note:       "NOTE"}]
        ,   shortName: "some-spec"
        ,   publicationDate: "2013-06-25"
        ,   previousPublishDate: "2012-06-07"
        ,   previousMaturity:  "REC"
        ,   specStatus: "PER"
        ,   includePermalinks: false
        ,   doRDFa: false
        };
    it("permalinks data should be added when section or h* have an id", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><section id='testing'><h2>a heading</h2><p>some content</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#sotd", doc) ;
            var list = $(".permalink", $c);
            expect(list.length).toEqual(0);
            $c = $("#testing", doc);
            list = $(".permalink", $c) ;
            expect(list.length).toEqual(1);
            flushIframes();
        });
    });
    it("permalinks data should be added when div or h* have an id", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><div id='testing'><h2>a heading</h2><p>some content</p></div>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#sotd", doc) ;
            var list = $(".permalink", $c);
            expect(list.length).toEqual(0);
            $c = $("#testing", doc);
            list = $(".permalink", $c) ;
            expect(list.length).toEqual(1);
            flushIframes();
        });
    });
    it("permalinks data should not be added when section or h* have no id", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><section id='testing'><h2>a heading</h2><p>some content</p></section><section><h2>another heading</h2><p>Other Content</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#testing", doc);
            $c = $c.nextElementSibling;
            var list = $(".permalink", $c) ;
            expect(list.length).toEqual(0);
            flushIframes();
        });
    });
    it("permalinks data should not be added when section has a class of nolink", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><section class='nolink' id='testing'><h2>a heading</h2><p>some content</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#testing", doc);
            var list = $(".permalink", $c) ;
            expect(list.length).toEqual(0);
            flushIframes();
        });
    });
    it("should do nothing when disabled", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: noConfig, body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><section id='testing'><h2>a heading</h2><p>some content</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#sotd", doc) ;
            var list = $c.children(".permalink");
            expect(list.length).toEqual(0);
            $n = $("#testing", doc);
            list = $n.children(".permalink") ;
            expect(list.length).toEqual(0);
            flushIframes();
        });
    });
});
