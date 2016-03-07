"use strict";
describe("Core - jquery enhanced", function() {
  var enhanced;
  beforeAll(function(done) {
    var script = document.querySelector("script[src*='SpecHelper.js']");
    var scriptsURL = script.src;
    var baseURL = new URL("../../", scriptsURL).href + "js";
    require.config({
      baseUrl: baseURL,
      paths: {
        "jquery": "/node_modules/jquery/dist/jquery",
      },
    });
    require(["core/jquery-enhanced"], function(inportedModule) {
      enhanced = inportedModule;
      done();
    });
  });

  // $.renameElement()
  it("should rename the element", function(done) {
    var $div = enhanced("<div><p><a></a></p><b>some text</b></div>").appendTo(enhanced("body"));
    $div.find("p").renameElement("span");
    $div.find("b").renameElement("i");
    expect($div.find("span").length).toEqual(1);
    expect($div.find("i").text()).toEqual("some text");
    $div.remove();
    done();
  });

  // $.getDfnTitles()
  it("should not prepend empty dfns to data-lt", function(done) {
    var $dfn = enhanced("<dfn data-lt='DFN|DFN2|DFN3'></dfn>").appendTo(enhanced("body"));
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
    var $dfn = enhanced("<dfn data-lt-noDefault data-lt='DFN|DFN2|DFN3'>FAIL</dfn>").appendTo(enhanced("body"));
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
    var $dfn = enhanced("<dfn data-lt='DFN|DFN2|DFN3'><abbr title='ABBR'>TEXT</abbr></dfn>").appendTo(enhanced("body"));
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
    var $dfn = enhanced("<dfn lt='DFN|DFN2|DFN3'><abbr title='ABBR'>TEXT</abbr></dfn>").appendTo(enhanced("body"));
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
    var $dfn = enhanced("<dfn lt='DFN|DFN2|DFN3'>TEXT</dfn>").appendTo(enhanced("body"));
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
    expect(enhanced("<p id='ID'></p>").makeID()).toEqual("ID");
    expect(enhanced("<p title='TITLE'></p>").makeID()).toEqual("title");
    expect(enhanced("<p>TEXT</p>").makeID()).toEqual("text");
    expect(enhanced("<p></p>").makeID(null, "PASSED")).toEqual("passed");
    expect(enhanced("<p></p>").makeID("PFX", "PASSED")).toEqual("PFX-passed");
    expect(enhanced("<p>TEXT</p>").makeID("PFX")).toEqual("PFX-text");
    var $p = enhanced("<p>TEXT</p>");
    $p.makeID();
    expect($p.attr("id")).toEqual("text");
    expect(enhanced("<p>  A--Bé9\n C</p>").makeID()).toEqual("a--b-9-c");
    expect(enhanced("<p></p>").makeID()).toEqual("generatedID");
    expect(enhanced("<p>2017</p>").makeID()).toEqual("x2017");
    var $div = enhanced("<div><p id='a'></p><p id='a-1'></p><span>A</span></div>").appendTo(enhanced("body"));
    expect($div.find("span").makeID()).toEqual("a-2");
    $div.remove();
    done();
  });

  // $.allTextNodes()
  it("should find all the text nodes", function(done) {
    var tns = enhanced("<div>aa<span>bb</span><p>cc<i>dd</i></p><pre>nope</pre></div>").allTextNodes(["pre"]);
    expect(tns.length).toEqual(4);
    var str = "";
    for (var i = 0, n = tns.length; i < n; i++) {
      str += tns[i].nodeValue;
    }
    expect(str).toEqual("aabbccdd");
    done();
  });
});
