function loadWithConfig (conf, check) {
    var config = [];
    for (var k in conf) {
        config.push(k + "=" + encodeURI($.isArray(conf[k]) ? JSON.stringify(conf[k]) : conf[k]).replace(/=/g, "%3D"));
    }
    var $ifr = $("<iframe width='800' height='200' style='display: none'></iframe>")
    ,   loaded = false

    ,   incr = function (ev) {
            if (ev.data && ev.data.topic == "end-all") loaded = true;
        }
    ;
    $ifr.attr("src", "spec/core/simple.html?" + config.join(";"));

        window.addEventListener("message", incr, false);
        $ifr.appendTo($("body"));
    });
    waitsFor(function () { return loaded; }, MAXOUT);

        check($ifr);
        $ifr.remove();
        loaded = false;
        window.removeEventListener("message", incr, false);
    });
}

describe("W3C — Permalinks", function () {

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
        ,   doRDFa: 1.1
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


            makeRSDoc({ config: makeBasicConfig(), body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><section id='testing'><h2>a heading</h2><p>some content</p></section>") },function (doc) {  });


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


            makeRSDoc({ config: makeBasicConfig(), body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><div id='testing'><h2>a heading</h2><p>some content</p></div>") },function (doc) {  });


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


            makeRSDoc({ config: makeBasicConfig(), body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><section id='testing'><h2>a heading</h2><p>some content</p></section><section><h2>another heading</h2><p>Other Content</p></section>") },function (doc) {  });


            var $c = $("#testing", doc);
            $c = $c.nextElementSibling;
            var list = $(".permalink", $c) ;
            expect(list.length).toEqual(0);
            flushIframes();
        });
    });
    it("permalinks data should not be added when section has a class of nolink", function () {


            makeRSDoc({ config: makeBasicConfig(), body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><section class='nolink' id='testing'><h2>a heading</h2><p>some content</p></section>") },function (doc) {  });


            var $c = $("#testing", doc);
            var list = $(".permalink", $c) ;
            expect(list.length).toEqual(0);
            flushIframes();
        });
    });
    it("should do nothing when disabled", function () {


            makeRSDoc({ config: noConfig, body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><section id='testing'><h2>a heading</h2><p>some content</p></section>") },function (doc) {  });


            var $c = $("#sotd", doc) ;
            var list = $c.children(".permalink");
            expect(list.length).toEqual(0);
            $n = $("#testing", doc);
            list = $n.children(".permalink") ;
            expect(list.length).toEqual(0);
            flushIframes();
        });
    });
    it("permalinks content attribute should have special characters escaped", function () {


            makeRSDoc({ config: makeBasicConfig(), body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><div id='testing'><h2>a heading with "+'"'+" and '</h2><p>some content</p></div>") },function (doc) {  });


            var $c = $("#testing", doc);
            var list = $("span.permalink a span", $c) ;
            expect(list.length).toEqual(1);
            expect($(list[0]).attr("content")).toMatch(/'/);
            expect($(list[0]).attr("content")).toMatch(/"/);
            flushIframes();
        });
    });
    it("permalinks not on edge will have non-breaking space after heading", function () {


            makeRSDoc({ config: makeBasicConfig(), body: $("<section class='introductory' id='sotd'>Some unique SOTD content</section><div id='testing'><h2>a heading with "+'"'+" and '</h2><p>some content</p></div>") },function (doc) {  });


            var $c = $("#testing", doc);
            var list = $("h2", $c) ;
            expect(list.length).toEqual(1);
            expect(list[0].innerHTML).toMatch(/&nbsp;/);
            flushIframes();
        });
    });
});
