describe("Core — Include config as JSON", function() {
  var MAXOUT = 5000;
  var basicConfig = {
    editors: [{
      name: "Robin Berjon"
    }],
    specStatus: "WD"
  };
  it("should have a script tag with the correct attributes", function() {
    var doc;
    runs(function() {
      makeRSDoc({
          config: basicConfig,
          body: $("<section id='abstract'>no content</section>")
        },
        function(rsdoc) {
          doc = rsdoc;
        });
    });
    waitsFor(function() {
      return doc;
    }, MAXOUT);
    runs(function() {
      var $script = $("#initialUserConfig", doc);
      expect($script[0].tagName).toEqual("SCRIPT");
      expect($script.attr("id")).toEqual("initialUserConfig");
      expect($script.attr("type")).toEqual("application/json");
      flushIframes();
    });
  });
  it("should have the same content for the config and the script's text", function() {
    var doc;
    runs(function() {
      makeRSDoc({
          config: basicConfig,
          body: $("<section id='abstract'>no content</section>")
        },
        function(rsdoc) {
          doc = rsdoc;
        });
    });
    waitsFor(function() {
      return doc;
    }, MAXOUT);
    runs(function() {
      var $script = $("#initialUserConfig", doc);
      var jsonConfig = JSON.stringify(doc.defaultView.respecConfig.initialUserConfig, null, 2);
      expect($script[0].innerHTML).toEqual(jsonConfig);
      flushIframes();
    });
  });
});
