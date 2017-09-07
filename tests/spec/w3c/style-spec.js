"use strict";
var specStatus = [
  {
    status: "FPWD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WD",
  },
  {
    status: "WD-NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WD",
  },
  {
    status: "finding",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}base.css",
  },
  {
    status: "unofficial",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-UD",
  },
  {
    status: "base",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}base.css",
  },
  {
    status: "RSCND",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-RSCND",
  },
  {
    status: "FPWD-NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WG-NOTE.css",
  },
  {
    status: "FAKE-TEST-TYPE",
    expectedURL:
      "https://www.w3.org/StyleSheets/TR/{version}W3C-FAKE-TEST-TYPE",
  },
  {
    status: "CG-FINAL",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}cg-final",
  },
  {
    status: "CG-DRAFT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}cg-draft",
  },
  {
    status: "BG-FINAL",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}bg-final",
  },
  {
    status: "BG-DRAFT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}bg-draft",
  },
];

function loadWithStatus(status, expectedURL, mode) {
  return new Promise(function(resolve) {
    var config = makeBasicConfig();
    config.useExperimentalStyles = false;
    config.specStatus = status;
    config.prevVersion = "FPWD";
    config.previousMaturity = "WD";
    config.previousPublishDate = "2013-12-17";
    var version = "2016/";
    switch (mode) {
      case "experimental":
        config.useExperimentalStyles = true;
        version = 2016 + "/";
        break;
      default:
        if (mode) {
          config.useExperimentalStyles = mode;
          version = mode + "/";
        }
    }
    var testedURL = expectedURL.replace("{version}", version);
    var ops = {
      config: config,
      body: makeDefaultBody(),
    };
    makeRSDoc(ops, function(doc) {
      var query = "link[href^='" + testedURL + "']";
      var elem = doc.querySelector(query);
      expect(elem).toBeTruthy();
      expect(elem.href).toEqual(testedURL);
      resolve(doc);
    });
  });
}

describe("W3C - Style", function() {
  afterAll(flushIframes);

  it("should include 'fixup.js'", function(done) {
    var ops = makeStandardOps();
    var theTest = function(doc) {
      var query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";
      var elem = doc.querySelector(query);
      expect(elem.src).toEqual("https://www.w3.org/scripts/TR/2016/fixup.js");
    };
    makeRSDoc(ops, theTest, "spec/core/simple.html").then(done);
  });

  it("should have a meta viewport added", function(done) {
    var ops = makeStandardOps();
    var theTest = function(doc) {
      var elem = doc.head.querySelector("meta[name=viewport]");
      expect(elem).toBeTruthy();
      var expectedStr = "width=device-width, initial-scale=1, shrink-to-fit=no";
      expect(elem.content).toEqual(expectedStr);
    };
    makeRSDoc(ops, theTest, "spec/core/simple.html").then(done);
  });

  it("should default to base when specStatus is missing", function(done) {
    loadWithStatus(
      "",
      "https://www.w3.org/StyleSheets/TR/{version}base.css"
    ).then(done);
  });

  it("should style according to spec status", function(done) {
    // We pick random half from the list, as running the whole set is very slow

    var promises = pickRandomsFromList(specStatus).map(function(test) {
      return loadWithStatus(test.status, test.expectedURL, "2016");
    });
    Promise.all(promises).then(done);
  });

  it("should style according to experimental styles", function(done) {
    // We pick random half from the list, as running the whole set is very slow
    var promises = pickRandomsFromList(specStatus).map(function(test) {
      return loadWithStatus(test.status, test.expectedURL, "experimental");
    });
    Promise.all(promises).then(done);
  });

  it("should not use 'experimental' URL when useExperimentalStyles is false", function(
    done
  ) {
    // We pick random half from the list, as running the whole set is very slow
    var promises = pickRandomsFromList(specStatus).map(function(test) {
      return loadWithStatus(test.status, test.expectedURL);
    });
    Promise.all(promises).then(done);
  });
  it("shouldn't include fixup.js when noToc is set", done => {
    var ops = makeStandardOps();
    var newProps = {
      noToc: true,
    };
    Object.assign(ops.config, newProps);
    var theTest = function(doc) {
      var query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";
      var elem = doc.querySelector(query);
      expect(elem).toBe(null);
    };
    makeRSDoc(ops, theTest, "spec/core/simple.html").then(done);
  });
});
