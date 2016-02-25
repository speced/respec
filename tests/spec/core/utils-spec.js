"use strict";
describe("Core - Utils", function() {
  var utils;
  beforeAll(function(done) {
    require.config({
      baseUrl: "../js/"
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
    expect($("link[href='BOGUS']").length == 1).toBeTruthy();
    $("link[href='BOGUS']").remove();
    done();
  });

  it("should add several link elements", function(done) {
    utils.linkCSS(document, ["BOGUS", "BOGUS", "BOGUS"]);
    expect($("link[href='BOGUS']").length == 3).toBeTruthy();
    $("link[href='BOGUS']").remove();
    done();
  });

  // $.renameElement()
  it("should rename the element", function(done) {
    var $div = $("<div><p><a></a></p><b>some text</b></div>").appendTo($("body"));
    $div.find("p").renameElement("span");
    $div.find("b").renameElement("i");
    expect($div.find("span").length).toEqual(1);
    expect($div.find("i").text()).toEqual("some text");
    $div.remove();
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

  // $.getDfnTitles()
  it("should not prepend empty dfns to data-lt", function(done) {
    var $dfn = $("<dfn data-lt='DFN|DFN2|DFN3'></dfn>").appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true
    });
    expect(titles[0]).toEqual("dfn");
    expect(titles[1]).toEqual("dfn2");
    expect(titles[2]).toEqual("dfn3");
    $dfn.remove();
    done();
  });

  // $.getDfnTitles()
  it("should not use the text content when data-lt-noDefault is present", function(done) {
    var $dfn = $("<dfn data-lt-noDefault data-lt='DFN|DFN2|DFN3'>FAIL</dfn>").appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true
    });
    expect(titles[0]).toEqual("dfn");
    expect(titles[1]).toEqual("dfn2");
    expect(titles[2]).toEqual("dfn3");
    expect(titles[3]).toEqual(undefined);
    $dfn.remove();
    done();
  });

  // $.getDfnTitles()
  it("should find the data-lts", function(done) {
    var $dfn = $("<dfn data-lt='DFN|DFN2|DFN3'><abbr title='ABBR'>TEXT</abbr></dfn>").appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true
    });
    expect(titles[0]).toEqual("text");
    expect(titles[1]).toEqual("dfn");
    expect(titles[2]).toEqual("dfn2");
    expect(titles[3]).toEqual("dfn3");
    $dfn.removeAttr("data-lt");
    expect($dfn.getDfnTitles()[0]).toEqual("abbr");
    $dfn.find("abbr").removeAttr("title");
    expect($dfn.getDfnTitles()[0]).toEqual("text");
    $dfn.remove();
    done();
  });

  // $.getDfnTitles()
  it("should find the definition title", function(done) {
    var $dfn = $("<dfn lt='DFN|DFN2|DFN3'><abbr title='ABBR'>TEXT</abbr></dfn>").appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true
    });
    expect(titles[0]).toEqual("text");
    expect(titles[1]).toEqual("dfn");
    expect(titles[2]).toEqual("dfn2");
    expect(titles[3]).toEqual("dfn3");
    $dfn.removeAttr("data-lt");
    expect($dfn.getDfnTitles()[0]).toEqual("abbr");
    $dfn.find("abbr").removeAttr("title");
    expect($dfn.getDfnTitles()[0]).toEqual("text");
    $dfn.remove();
    done();
  });

  // $.getDfnTitles()
  it("should return list of terms when called a second time", function(done) {
    var $dfn = $("<dfn lt='DFN|DFN2|DFN3'>TEXT</dfn>").appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true
    });
    expect(titles[0]).toEqual("text");
    expect(titles[1]).toEqual("dfn");
    expect(titles[2]).toEqual("dfn2");
    expect(titles[3]).toEqual("dfn3");
    expect($dfn.attr("data-lt")).toEqual("text|dfn|dfn2|dfn3");
    expect($dfn.getDfnTitles()[1]).toEqual("dfn");
    $dfn.remove();
    done();
  });

  // $.makeID()
  it("should create the proper ID", function(done) {
    expect($("<p id='ID'></p>").makeID()).toEqual("ID");
    expect($("<p title='TITLE'></p>").makeID()).toEqual("title");
    expect($("<p>TEXT</p>").makeID()).toEqual("text");
    expect($("<p></p>").makeID(null, "PASSED")).toEqual("passed");
    expect($("<p></p>").makeID("PFX", "PASSED")).toEqual("PFX-passed");
    expect($("<p>TEXT</p>").makeID("PFX")).toEqual("PFX-text");
    var $p = $("<p>TEXT</p>");
    $p.makeID();
    expect($p.attr("id")).toEqual("text");
    expect($("<p>  A--Bé9\n C</p>").makeID()).toEqual("a--b-9-c");
    expect($("<p></p>").makeID()).toEqual("generatedID");
    expect($("<p>2017</p>").makeID()).toEqual("x2017");
    var $div = $("<div><p id='a'></p><p id='a-1'></p><span>A</span></div>").appendTo($("body"));
    expect($div.find("span").makeID()).toEqual("a-2");
    $div.remove();
    done();
  });

  // $.allTextNodes()
  it("should find all the text nodes", function(done) {
    var tns = $("<div>aa<span>bb</span><p>cc<i>dd</i></p><pre>nope</pre></div>").allTextNodes(["pre"]);
    expect(tns.length).toEqual(4);
    var str = "";
    for (var i = 0, n = tns.length; i < n; i++) str += tns[i].nodeValue;
    expect(str).toEqual("aabbccdd");
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
    var expected = 'editors=[{"name":"Person Name"}], specStatus="ED", edDraftURI="http://foo.com", shortName="Foo"';
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
    var expected = 'editors=[{"name":"Person Name"}]|||specStatus="ED"|||edDraftURI="http://foo.com"|||shortName="Foo"';
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
    var expected = 'editors;[{"name":"Person Name"}], specStatus;"ED", edDraftURI;"http://foo.com", shortName;"Foo"';
    expect(utils.toKeyValuePairs(obj, null, ";")).toEqual(expected);

    expected = 'editors^[{"name":"Person Name"}] % specStatus^"ED" % edDraftURI^"http://foo.com" % shortName^"Foo"';
    expect(utils.toKeyValuePairs(obj, " % ", "^")).toEqual(expected);
    done();
  });
});
