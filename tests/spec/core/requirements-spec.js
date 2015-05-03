describe("Core — Requirements", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        }
    ,   issueBaseConfig = {
            editors:    [{ name: "Gregg Kellogg" }]
        ,   issueBase:  "http://example.com/issues/"
        ,   specStatus: "WD"
      };
    it("should process requirements", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<p class='req' id='req-id'>REQ</p>")
                    },
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $req = $("p.req", doc)
            ,   $a = $req.find("a")
            ;

            expect($req.text()).toEqual("Req. 1: REQ");

            expect($a.length).toEqual(1);
            expect($a.text()).toEqual("Req. 1");
            expect($a.attr("href")).toEqual("#req-id");
        });
    });
    it("should process requirement references", function () {
      var doc;
      runs(function () {
          makeRSDoc({
                      config: basicConfig
                      ,   body: $("<a href='#req-id' class='reqRef'></a><a href='#foo' class='reqRef'></a><p class='req' id='req-id'>REQ</p>")
                  },
                  function (rsdoc) { doc = rsdoc; });
      });
      waitsFor(function () { return doc; }, MAXOUT);
      runs(function () {
        var $refs = $("a.reqRef", doc);

        expect($refs.first().text()).toEqual("Req. 1");
        expect($refs.last().text()).toEqual("Req. not found 'foo'");
      });
    });
});
