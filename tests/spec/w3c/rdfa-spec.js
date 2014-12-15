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

describe("W3C — RDFa", function () {
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
        ,   doRDFa: "1.1"
        }
    ,   liteConfig = {
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
        ,   doRDFa: "lite"
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
        ,   doRDFa: false
        };
    it("should set the document information", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("html", doc);
            expect($c.attr('prefix')).toMatch(/bibo:/);
            expect($c.attr('prefix')).toMatch(/w3p:/);
            expect($c.attr('prefix')).toNotMatch(/dc:/);
            expect($c.attr('prefix')).toNotMatch(/foaf:/);
            expect($c.attr('prefix')).toNotMatch(/xsd:/);
            expect($c.attr('typeof')).toMatch(/w3p:PER/);
            expect($c.attr('typeof')).toMatch(/bibo:Document/);

            var $lang = $("html>head>meta[property='dc:language']", doc) ;
            expect($lang.attr('content')).toEqual("en") ;
            flushIframes();
        });
    });
    it("should set the lite document information", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: liteConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("html", doc);
            expect($c.attr('prefix')).toMatch(/bibo:/);
            expect($c.attr('prefix')).toMatch(/w3p:/);
            expect($c.attr('typeof')).toMatch(/w3p:PER/);
            expect($c.attr('typeof')).toMatch(/bibo:Document/);

            var $lang = $("html>head>meta[property='dc:language']", doc) ;
            expect($lang.attr('content')).toEqual("en") ;
            flushIframes();
        });
    });
    it("should set RDFa information on editors", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $dd = $("dt:contains('Editor:')", doc ).next("dd") ;
            expect($dd.attr("property")).toEqual("bibo:editor") ;
            expect($dd.attr("inlist")).toEqual("") ;
            var $sp = $dd.children("span");
            expect($sp.attr("typeof")).toEqual('foaf:Person') ;
            var $meta = $sp.children("meta") ;
            expect($meta.attr("property")).toEqual('foaf:name') ;
            expect($meta.attr("content")).toEqual('Shane McCarron') ;
            var $a = $sp.children("a") ;
            expect($a.attr("property")).toEqual('foaf:homepage') ;
            expect($a.attr("href")).toEqual('http://URI') ;
            $a = $sp.children("span").children("a");
            expect($a.attr("property")).toEqual('foaf:mbox') ;
            expect($a.attr("href")).toEqual('mailto:EMAIL') ;
            flushIframes();
        });
    });
    it("should set RDFa information on editors (lite)", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: liteConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $dd = $("dt:contains('Editor:')", doc ).next("dd") ;
            expect($dd.attr("property")).toEqual("bibo:editor") ;
            expect($dd.attr("inlist")).not.toBeDefined() ;
            var $sp = $dd.children("span");
            expect($sp.attr("typeof")).toEqual('foaf:Person') ;
            var $meta = $sp.children("meta") ;
            expect($meta.attr("property")).toEqual('foaf:name') ;
            expect($meta.attr("content")).toEqual('Shane McCarron') ;
            var $a = $sp.children("a") ;
            expect($a.attr("property")).toEqual('foaf:homepage') ;
            expect($a.attr("href")).toEqual('http://URI') ;
            $a = $sp.children("span").children("a");
            expect($a.attr("property")).toEqual('foaf:mbox') ;
            expect($a.attr("href")).toEqual('mailto:EMAIL') ;
            flushIframes();
        });
    });
    it("should set information on patent", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#sotd_patent", doc);
            expect($c.attr('property')).toEqual("w3p:patentRules");
            flushIframes();
        });
    });
    it("should describe normative references", function () {
      var doc;
      runs(function () {
          makeRSDoc({ config: basicConfig, body: $("<section><p>[[!DAHU]] [[REX]]</p></section>") }, 
                    function (rsdoc) { doc = rsdoc; });
      });
      waitsFor(function () { return doc; }, MAXOUT);
      runs(function () {
          var $nr = $("#normative-references", doc)
          ,   $ir = $("#informative-references", doc)
          ;
          expect($nr.attr('typeof')).toMatch(/bibo:Chapter/);
          expect($nr.attr('resource')).toEqual("#normative-references");
          expect($nr.find("dl dt").length).toEqual(1);
          expect($nr.find("dl dt:contains('[DAHU]')").length).toEqual(1);
          expect($nr.find("dl>dd>a").attr('property')).toEqual('dc:requires');

          expect($ir.attr('typeof')).toMatch(/bibo:Chapter/);
          expect($ir.attr('resource')).toEqual("#informative-references");
          expect($ir.find("dl dt").length).toEqual(1);
          expect($ir.find("dl dt:contains('[REX]')").length).toEqual(1);
          expect($ir.find("dl>dd>a").attr('property')).toEqual('dc:references');
          flushIframes();
      });
    });
    it("should mark abstract using dc:abstract", function () {
      var doc;
      runs(function () {
          makeRSDoc({ config: basicConfig, body: $("<section id='abstract'>test abstract</section>") }, 
                    function (rsdoc) { doc = rsdoc; });
      });
      waitsFor(function () { return doc; }, MAXOUT);
      runs(function () {
          var $abs = $("#abstract", doc);
          expect($abs.attr('property')).toEqual("dc:abstract");
          expect($abs.attr('typeof')).not.toBeDefined();
          expect($abs.attr('resource')).not.toBeDefined();
          flushIframes();
      });
    });
    it("should add bibo to chapters", function () {
      var doc;
      runs(function () {
          makeRSDoc({ config: basicConfig, body: $("<section id='chap'><h2>Chapter</h2></section>") }, 
                    function (rsdoc) { doc = rsdoc; });
      });
      waitsFor(function () { return doc; }, MAXOUT);
      runs(function () {
          var $chap = $("#chap", doc);
          expect($chap.attr('typeof')).toEqual("bibo:Chapter");
          expect($chap.attr('resource')).toEqual("#chap");
          expect($chap.attr('property')).toMatch(/bibo:hasPart/);
          flushIframes();
      });
    });
    it("should do nothing when disabled", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: noConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("html", doc);
            expect($c.attr('prefix')).not.toBeDefined();
            expect($c.attr('typeof')).not.toBeDefined();
            expect($c.attr('property')).not.toBeDefined();
            expect($c.attr('content')).not.toBeDefined();
            expect($c.attr('about')).not.toBeDefined();
            flushIframes();
        });
    });
});
