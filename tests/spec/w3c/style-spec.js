/*jshint strict: true, jquery:true, jasmine:true*/
"use strict";
var specStatus = [{
  status: "FPWD",
  expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WD",
}, {
  status: "WD-NOTE",
  expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WD",
}, {
  status: "finding",
  expectedURL: "https://www.w3.org/StyleSheets/TR/{version}base",
}, {
  status: "unofficial",
  expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-UD",
}, {
  status: "base",
  expectedURL: "https://www.w3.org/StyleSheets/TR/{version}base",
}, {
  status: "RSCND",
  expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-RSCND",
}, {
  status: "FPWD-NOTE",
  expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WG-NOTE",
}, {
  status: "FAKE-TEST-TYPE",
  expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-FAKE-TEST-TYPE",
}, {
  status: "CG-FINAL",
  expectedURL: "https://www.w3.org/community/src/css/spec/cg-final",
}, {
  status: "CG-DRAFT",
  expectedURL: "https://www.w3.org/community/src/css/spec/cg-draft",
}, {
  status: "BG-FINAL",
  expectedURL: "https://www.w3.org/community/src/css/spec/bg-final",
}, {
  status: "BG-DRAFT",
  expectedURL: "https://www.w3.org/community/src/css/spec/bg-draft",
},];

function loadWithStatus(status, expectedURL, mode) {
  var loaded = false;
  var MAXOUT = 10000;
  var ifr = document.createElement("iframe");
  var docURL = "spec/core/simple.html?specStatus=" + status;
  var version = "";
  switch (mode) {
    case "experimental":
      docURL += ";useExperimentalStyles=true";
      version = new Date().getFullYear() + "/";
      break;
    case "force-stable":
      docURL += ";useExperimentalStyles=false";
      break;
    default:
      if (mode && Number.isNaN(mode) === false) {
        docURL += ";useExperimentalStyles=" + mode;
        version = mode + "/";
      }
  }
  var testedURL = expectedURL.replace("{version}", version);
  ifr.src = docURL;
  var incr = function(ev) {
    if (ev.data && ev.data.topic === "end-all") {
      loaded = true;
    }
  };
  runs(function() {
    window.addEventListener("message", incr);
    document.body.appendChild(ifr);
  });
  waitsFor(function() {
    return loaded;
  }, MAXOUT);
  runs(function() {
    var query = "link[href^='" + testedURL + "']";
    var elem = ifr.contentDocument.querySelector(query);
    expect(elem).toBeTruthy();
    expect(elem.href).toEqual(testedURL);
    ifr.remove();
    loaded = false;
    window.removeEventListener("message", incr);
  });
}

describe("W3C - Style", function() {
  // Blocked on: https://github.com/w3c/tr-design/pull/55
  // Busted in PhantomJS
  xit("should include 'fixup.js'", function() {
    var ifr = document.createElement("iframe");
    ifr.src = "spec/core/simple.html?specStatus=unofficail;useExperimentalStyles=2016";
    var loaded = false;
    var MAXOUT = 5000;
    var incr = function(ev) {
      if (ev.data && ev.data.topic === "end-all") {
        loaded = true;
      }
    };
    runs(function() {
      window.addEventListener("message", incr);
      document.body.appendChild(ifr);
    });
    waitsFor(function() {
      return loaded;
    }, MAXOUT);
    runs(function() {
      var query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";
      var elem = ifr.contentDocument.querySelector(query);
      expect(elem.src).toEqual("https://www.w3.org/scripts/TR/2016/fixup.js");
      ifr.remove();
      loaded = false;
      window.removeEventListener("message", incr);
    });
  });

  it("should default to base when specStatus is missing", function() {
    loadWithStatus("", "https://www.w3.org/StyleSheets/TR/base");
  });

  it("should style according to spec status", function() {
    specStatus.forEach(function(test) {
      loadWithStatus(test.status, test.expectedURL);
    });
  });

  it("should style according to experimental styles", function() {
    specStatus.forEach(function(test) {
      loadWithStatus(test.status, test.expectedURL, "experimental");
    });
  });

  it("should not use 'experimental' URL when useExperimentalStyles is false", function() {
    specStatus.forEach(function(test) {
      loadWithStatus(test.status, test.expectedURL, "force-stable");
    });
  });
});
