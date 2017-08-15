"use strict";
describe("Core - jquery enhanced", function() {
  beforeAll(async () => {
    await new Promise(resolve => {
      require(["core/jquery-enhanced"], resolve);
    });
  });

  it("appears in the global scope", () => {
    expect(window.$).toBeTruthy();
  });

  // $.renameElement()
  it("renames the element", () => {
    var $div = $("<div><p><a></a></p><b>some text</b></div>").appendTo(
      $("body")
    );
    $div.find("p").renameElement("span");
    $div.find("b").renameElement("i");
    expect($div.find("span").length).toEqual(1);
    expect($div.find("i").text()).toEqual("some text");
    $div.remove();
  });

  // $.getDfnTitles()
  it("doesn't prepend empty dfns to data-lt", () => {
    var $dfn = $("<dfn data-lt='DFN|DFN2|DFN3'></dfn>").appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true,
    });
    expect(titles[0]).toEqual("dfn");
    expect(titles[1]).toEqual("dfn2");
    expect(titles[2]).toEqual("dfn3");
    $dfn.remove();
  });

  // $.getDfnTitles()
  it("doesn't use the text content when data-lt-noDefault is present", () => {
    var $dfn = $(
      "<dfn data-lt-noDefault data-lt='DFN|DFN2|DFN3'>FAIL</dfn>"
    ).appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true,
    });
    expect(titles[0]).toEqual("dfn");
    expect(titles[1]).toEqual("dfn2");
    expect(titles[2]).toEqual("dfn3");
    expect(titles[3]).toEqual(undefined);
    $dfn.remove();
  });

  // $.getDfnTitles()
  it("finds the data-lts", () => {
    var $dfn = $(
      "<dfn data-lt='DFN|DFN2|DFN3'><abbr title='ABBR'>TEXT</abbr></dfn>"
    ).appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true,
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
  });

  // $.getDfnTitles()
  it("finds the definition title", () => {
    var $dfn = $(
      "<dfn lt='DFN|DFN2|DFN3'><abbr title='ABBR'>TEXT</abbr></dfn>"
    ).appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true,
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
  });

  // $.getDfnTitles()
  it("returns list of terms when called a second time", () => {
    var $dfn = $("<dfn lt='DFN|DFN2|DFN3'>TEXT</dfn>").appendTo($("body"));
    var titles = $dfn.getDfnTitles({
      isDefinition: true,
    });
    expect(titles[0]).toEqual("text");
    expect(titles[1]).toEqual("dfn");
    expect(titles[2]).toEqual("dfn2");
    expect(titles[3]).toEqual("dfn3");
    expect($dfn.attr("data-lt")).toEqual("text|dfn|dfn2|dfn3");
    expect($dfn.getDfnTitles()[1]).toEqual("dfn");
    $dfn.remove();
  });

  // $.makeID()
  it("creates the proper ID", () => {
    expect($("<p id='ID'></p>").makeID()).toEqual("ID");
    expect($("<p title='TITLE'></p>").makeID()).toEqual("title");
    expect($("<p>TEXT</p>").makeID()).toEqual("text");
    expect($("<p></p>").makeID(null, "PASSED")).toEqual("passed");
    expect($("<p></p>").makeID("PFX", "PASSED")).toEqual("PFX-passed");
    expect($("<p>TEXT</p>").makeID("PFX")).toEqual("PFX-text");
    var $p = $("<p>TEXT</p>");
    $p.makeID();
    expect($p.attr("id")).toEqual("text");
    expect($("<p>  A--Bé9\n C</p>").makeID()).toEqual("a-bé9-c");
    expect($("<p></p>").makeID()).toEqual("generatedID");
    expect($("<p>2017</p>").makeID()).toEqual("x2017");
    var $div = $(
      "<div><p id='a'></p><p id='a-1'></p><span>A</span><span title='a'></span></div>"
    ).appendTo($("body"));
    expect($div.find("span").makeID()).toEqual("a-0");
    expect($div.find("span[title]").makeID()).toEqual("a-2");
    $div.remove();
  });

  // $.allTextNodes()
  it("finds all the text nodes", () => {
    var tns = $(
      "<div>aa<span>bb</span><p>cc<i>dd</i></p><pre>nope</pre></div>"
    ).allTextNodes(["pre"]);
    expect(tns.length).toEqual(4);
    var str = "";
    for (var i = 0, n = tns.length; i < n; i++) {
      str += tns[i].nodeValue;
    }
    expect(str).toEqual("aabbccdd");
  });
});
