"use strict";
describe("Core - Utils", function() {
  var utils;
  beforeAll(function(done) {
    require.config({
      baseUrl: "../js/",
      paths: {
        "handlebars": "/node_modules/handlebars/dist/handlebars",
        "jquery": "/node_modules/jquery/dist/jquery",
        "Promise": "/node_modules/promise-polyfill/Promise",
        "webidl2": "/node_modules/webidl2/lib/webidl2",
      },
    });
    require(["core/utils"], function(u) {
      utils = u;
      window.utils = u;
      done();
    });
  });

  // linkCSS()
  it("should add a link element", function(done) {
    utils.linkCSS(document, "BOGUS");
    expect($("link[href='BOGUS']").length).toEqual(1);
    $("link[href='BOGUS']").remove();
    done();
  });

  it("should add several link elements", function(done) {
    utils.linkCSS(document, ["BOGUS", "BOGUS", "BOGUS"]);
    expect($("link[href='BOGUS']").length).toEqual(3);
    $("link[href='BOGUS']").remove();
    done();
  });

  // lead0
  it("should prepend 0 only when needed", function(done) {
    expect(utils.lead0("1")).toEqual("01");
    expect(utils.lead0("01")).toEqual("01");
    done();
  });

  // concatDate
  it("should format the date as needed", function(done) {
    var d = new Date();
    d.setFullYear(1977);
    d.setMonth(2);
    d.setDate(15);
    expect(utils.concatDate(d)).toEqual("19770315");
    expect(utils.concatDate(d, "-")).toEqual("1977-03-15");
    done();
  });

  // parseSimpleDate
  it("should parse a simple date", function(done) {
    var d = utils.parseSimpleDate("1977-03-15");
    expect(d.getFullYear()).toEqual(1977);
    expect(d.getMonth()).toEqual(2);
    expect(d.getDate()).toEqual(15);
    done();
  });

  // parseLastModified
  it("should parse a date in lastModified format", function(done) {
    var d = utils.parseLastModified("03/15/1977 13:05:42");
    expect(d.getFullYear()).toEqual(1977);
    expect(d.getMonth()).toEqual(2);
    expect(d.getDate()).toEqual(15);
    done();
  });

  // humanDate
  it("should produce a human date", function(done) {
    expect(utils.humanDate("1977-03-15")).toEqual("15 March 1977");
    var d = new Date();
    d.setFullYear(1977);
    d.setMonth(2);
    d.setDate(15);
    expect(utils.humanDate(d)).toEqual("15 March 1977");
    done();
  });

  // isoDate
  it("should produce an ISO date", function(done) {
    expect(utils.isoDate("2013-06-25")).toMatch(/2013-06-2[45]T/);
    var d = new Date();
    d.setFullYear(2013);
    d.setDate(25);
    d.setMonth(8);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    expect(utils.isoDate(d)).toMatch(/2013-09-2[45]T/);
    done();
  });

  // joinAnd
  it("should join with proper commas and 'and'", function(done) {
    expect(utils.joinAnd([])).toEqual("");
    expect(utils.joinAnd(["x"])).toEqual("x");
    expect(utils.joinAnd(["x", "x"])).toEqual("x and x");
    expect(utils.joinAnd(["x", "x", "x"])).toEqual("x, x, and x");
    expect(utils.joinAnd(["x", "x", "x", "x"])).toEqual("x, x, x, and x");
    expect(utils.joinAnd(["x", "x", "x", "x"], function(str) {
      return str.toUpperCase();
    })).toEqual("X, X, X, and X");
    done();
  });

  // xmlEscape
  it("should escape properly", function(done) {
    expect(utils.xmlEscape("&<>\"")).toEqual("&amp;&lt;&gt;&quot;");
    done();
  });

  // norm
  it("should normalise text", function(done) {
    expect(utils.norm("  a   b   ")).toEqual("a b");
    done();
  });

  // toKeyValuePairs
  it("should convert objects to key values pairs", function(done) {
    var obj = {
      editors: [{
        "name": "Person Name"
      }],
      specStatus: "ED",
      edDraftURI: "http://foo.com",
      shortName: "Foo"
    };
    var expected = "editors=[{\"name\":\"Person Name\"}], specStatus=\"ED\", " +
      "edDraftURI=\"http://foo.com\", shortName=\"Foo\"";
    expect(utils.toKeyValuePairs(obj)).toEqual(expected);
    done();
  });

  it("should convert objects to key values pairs with different separator", function(done) {
    var obj = {
      editors: [{
        "name": "Person Name"
      }],
      specStatus: "ED",
      edDraftURI: "http://foo.com",
      shortName: "Foo"
    };
    var expected = "editors=[{\"name\":\"Person Name\"}]|||specStatus=\"ED\"|||" +
      "edDraftURI=\"http://foo.com\"|||shortName=\"Foo\"";
    expect(utils.toKeyValuePairs(obj, "|||")).toEqual(expected);
    done();
  });

  it("should convert objects to key values pairs with different separator and delimiter", function(done) {
    var obj = {
      editors: [{
        "name": "Person Name"
      }],
      specStatus: "ED",
      edDraftURI: "http://foo.com",
      shortName: "Foo"
    };
    var expected = "editors;[{\"name\":\"Person Name\"}], specStatus;\"ED\", " +
      "edDraftURI;\"http://foo.com\", shortName;\"Foo\"";
    expect(utils.toKeyValuePairs(obj, null, ";")).toEqual(expected);

    expected = "editors^[{\"name\":\"Person Name\"}] % specStatus^\"ED\" % " +
      "edDraftURI^\"http://foo.com\" % shortName^\"Foo\"";
    expect(utils.toKeyValuePairs(obj, " % ", "^")).toEqual(expected);
    done();
  });
});
