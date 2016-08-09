"use strict";
describe("Core - Markdown", function() {
  this.retries(2);
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should process standard markdown content", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n===\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      Array
        .from(doc.querySelectorAll(".removeOnSave"))
        .forEach(function(elem){
          elem.remove();
        });
      var foo = doc.getElementById("foo");
      expect(foo).toBeTruthy();
      expect(foo.textContent).toEqual("1. Foo");
    }).then(done);
  });

  it("should process markdown inside of sections", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "<section>\nFoo\n===\n</section>",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var foo = doc.getElementById("foo");
      expect(foo).toBeTruthy();
      expect(foo.textContent).toEqual("1. Foo");
    }).then(done);
  });

  it("should process markdown inside of notes, issues and reqs.", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "<p class=note>_foo_</p><div class=issue>_foo_</div><ul><li class=req>\n### _foo_###\n</li></ul>",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelector(".note em")).toBeTruthy();
      expect(doc.querySelector(".issue em")).toBeTruthy();
      expect(doc.querySelector(".req em")).toBeTruthy();
      expect(doc.querySelector(".req h3")).toBeTruthy();
    }).then(done);
  });

  it("should remove left padding before processing markdown content", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n    Foo\n    ===\n      * list item 1\n      * list item 2\n        * nested list item",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelector("code")).toBeFalsy();
      expect(doc.querySelector("#foo").textContent === "Foo");
      var listItems = doc.querySelectorAll("section > ul:not([class=toc]) > li");
      expect(listItems.length).toEqual(2);
      expect(listItems[0].textContent).toEqual("list item 1");
      var nestedLi = doc.querySelector("li > ul > li");
      expect(nestedLi).toBeTruthy();
      expect(nestedLi.textContent).toEqual("nested list item");
    }).then(done);
  });

  it("should structure content in nested sections with appropriate titles", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n===\n\nBar\n---\n\nBaz\n---\n\n### Foobar ###\n\n#### Foobaz ####\n\nZing\n---\n\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var foo = doc.getElementById("foo");
      expect(foo.localName).toEqual("h2");
      expect(foo.textContent).toEqual("1. Foo");
      expect(foo.parentElement.localName).toEqual("section");

      var bar = doc.getElementById("bar");
      expect(bar.localName).toEqual("h3");
      expect(bar.textContent).toEqual("1.1 Bar");
      expect(bar.parentElement.localName).toEqual("section");

      var baz = doc.getElementById("baz");
      expect(baz.localName).toEqual("h3");
      expect(baz.textContent).toEqual("1.2 Baz");
      expect(baz.parentElement.localName).toEqual("section");

      var foobar = doc.getElementById("foobar");
      expect(foobar.localName).toEqual("h4");
      expect(foobar.textContent).toEqual("1.2.1 Foobar");
      expect(foobar.parentElement.localName).toEqual("section");

      var foobaz = doc.getElementById("foobaz");
      expect(foobaz.localName).toEqual("h5");
      expect(foobaz.textContent).toEqual("1.2.1.1 Foobaz");
      expect(foobaz.parentElement.localName).toEqual("section");

      var zing = doc.getElementById("zing");
      expect(zing.localName).toEqual("h3");
      expect(zing.textContent).toEqual("1.3 Zing");
      expect(zing.parentElement.localName).toEqual("section");
    }).then(done);
  });

  it("should gracefully handle jumps in nested headers", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n===\n\nBar\n---\n\nBaz\n===\n\n### Foobar ###\n\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var foo = doc.getElementById("foo");
      var bar = doc.getElementById("bar");
      expect(foo.parentElement.contains(bar)).toBeTruthy();
      var baz = doc.getElementById("baz");
      var foobar = doc.getElementById("foobar");
      expect(baz.parentElement.contains(foobar)).toBeTruthy();
    }).then(done);
  });

  it("should nest sections according to their first header, if present", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n===\n\nsome text\n\n<section>\n\nBar\n===\n</section>\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var bar = doc.getElementById("bar");
      expect(bar.textContent).toEqual("2. Bar");
    }).then(done);
  });

  it("should nest sections according to their headers", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n===\n\nsome text\n\n<section>\n\nBar\n---\n</section>\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var bar = doc.getElementById("bar");
      expect(bar.textContent).toMatch("1.1 Bar");
      var foo = doc.getElementById("foo");
      expect(foo.parentElement.contains(bar)).toBeTruthy();
    }).then(done);
  });

  it("should not nest content following a section inside of said section", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n===\n\nsome text\n\n<section>\n\nBar\n---\n</section>\n\nBaz\n===\n\nsome text\n\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var baz = doc.getElementById("baz");
      expect(baz.textContent).toEqual("2. Baz");
      var bar = doc.getElementById("bar");
      expect(bar.parentElement.contains(baz)).toBeFalsy();
      expect(baz.parentElement.contains(bar)).toBeFalsy();
    }).then(done);
  });

  it("should not nest sections with a top level header", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n---\n\nsome text\n\n<section>\n\nBar\n---\n</section>\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var bar = doc.getElementById("bar");
      expect(bar.textContent).toEqual("2. Bar");
      expect(doc.body.contains(bar)).toBeTruthy();
    }).then(done);
  });

  it("should not nest sections with no headers at all", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n===\n\nsome text\n\n<section id=bar>no header</section>\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var foo = doc.getElementById("foo");
      var bar = doc.getElementById("bar");
      expect(doc.body.contains(bar)).toBeTruthy();
      expect(foo.contains(bar)).toBeFalsy();
    }).then(done);
  });

  describe("nolinks options", function() {
    it("automatically links URLs in pre when missing (smoke test)", function(done) {
      var ops = {
        config: makeBasicConfig(),
        body: makeDefaultBody() +
          "<pre id=testElem>\n" +
          "\t this won't link \n" +
          "\t this will link: http://no-links-foo.com \n" +
          "\t so will this: http://no-links-bar.com \n" +
          "<pre>\n\n\n"
      };
      ops.config.format = "markdown";
      makeRSDoc(ops, function(doc) {
        var anchors = doc.querySelectorAll("#testElem a");
        expect(anchors.length).toEqual(2);
        expect(anchors.item(0).href).toEqual("http://no-links-foo.com/");
        expect(anchors.item(1).href).toEqual("http://no-links-bar.com/");
      }).then(done);
    });

    it("replaces HTMLAnchors when present", function(done) {
      var ops = {
        config: makeBasicConfig(),
        body: makeDefaultBody() +
          "<pre id=testElem class=nolinks>\n" +
          "\t http://no-links-foo.com \n" +
          "\t http://no-links-bar.com \n" +
          "<pre>\n\n\n"
      };
      ops.config.format = "markdown";
      makeRSDoc(ops, function(doc) {
        var anchors = doc.querySelectorAll("#testElem a");
        expect(anchors.length).toEqual(0);
        expect(doc.querySelector("a[href='http://no-links-foo.com']")).toBeFalsy();
        expect(doc.querySelector("a[href='http://no-links-bar.com']")).toBeFalsy();
      }).then(done);
    });

    it("it correctly handles quoted elements", function(done){
      var ops = {
        config: makeBasicConfig(),
        body: makeDefaultBody() +
          "<p id='test-text1'>outer text\n\"<code>inner text</code>\".</p>\n" +
          "<p id='test-text2'>outer\n   \"`inner`\".</p>"
      };
      ops.config.format = "markdown";
      makeRSDoc(ops, function(doc) {
        var text1 = doc.getElementById("test-text1").textContent;
        expect(text1).toEqual("outer text \"inner text\".");
        var text2 = doc.getElementById("test-text2").innerHTML;
        expect(text2).toEqual("outer \"<code>inner</code>\".");
      }).then(done);
    });
  });
});
