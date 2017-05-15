"use strict";
describe("Core - Markdown", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should process standard markdown content", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + "\n\nFoo\n===\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      Array.from(doc.querySelectorAll(".removeOnSave")).forEach(function(elem) {
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
      body: makeDefaultBody() + "<section>\nFoo\n===\n</section>",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var foo = doc.getElementById("foo");
      expect(foo).toBeTruthy();
      expect(foo.textContent).toEqual("1. Foo");
    }).then(done);
  });

  it("should process markdown inside of notes, issues and reqs.", function(
    done
  ) {
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

  it("should remove left padding before processing markdown content", function(
    done
  ) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "\n    Foo\n    ===\n      * list item 1\n      * list item 2\n        * nested list item",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelector("code")).toBeFalsy();
      expect(doc.querySelector("#foo").textContent === "Foo");
      var listItems = doc.querySelectorAll(
        "section > ul:not([class=toc]) > li"
      );
      expect(listItems.length).toEqual(2);
      expect(listItems[0].textContent).toEqual("list item 1");
      var nestedLi = doc.querySelector("li > ul > li");
      expect(nestedLi).toBeTruthy();
      expect(nestedLi.textContent).toEqual("nested list item");
    }).then(done);
  });

  it("should structure content in nested sections with appropriate titles", function(
    done
  ) {
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

  it("should nest sections according to their first header, if present", function(
    done
  ) {
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

  it("should not nest content following a section inside of said section", function(
    done
  ) {
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
    it("automatically links URLs in pre when missing (smoke test)", function(
      done
    ) {
      var ops = {
        config: makeBasicConfig(),
        body: makeDefaultBody() +
          `
          <div id=testElem>
            this won't link
            this will link: http://no-links-foo.com
            so will this: http://no-links-bar.com
          </div>`,
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
          `
          <div id=testElem class=nolinks>
            http://no-links-foo.com
            http://no-links-bar.com
          <div>
          `,
      };
      ops.config.format = "markdown";
      makeRSDoc(ops, function(doc) {
        var anchors = doc.querySelectorAll("#testElem a");
        expect(anchors.length).toEqual(0);
        expect(
          doc.querySelector("a[href='http://no-links-foo.com']")
        ).toBeFalsy();
        expect(
          doc.querySelector("a[href='http://no-links-bar.com']")
        ).toBeFalsy();
      }).then(done);
    });

    it("handles quoted elements, including entity quotes", function(done) {
      var ops = {
        config: makeBasicConfig(),
        body: makeDefaultBody() +
          `<p id='test-text1'>test1 text &quot;<code>inner text</code>".</p>
           <p id='test-text2'>test2 '<code>inner</code>&#39;.</p>
           // Pre left alone
           <pre class=nohighlight id='test-text3'>test3 text "<code>inner text</code>".</pre>`,
      };
      ops.config.format = "markdown";
      makeRSDoc(ops, function(doc) {
        var text1 = doc.getElementById("test-text1");
        expect(text1.textContent).toEqual(`test1 text "inner text".`);
        expect(text1.innerHTML).toEqual(
          `test1 text "<code>inner text</code>".`
        );
        var text2 = doc.getElementById("test-text2");
        expect(text2.textContent).toEqual(`test2 'inner'.`);
        expect(text2.innerHTML).toEqual(`test2 '<code>inner</code>'.`);
        var text3 = doc.getElementById("test-text3");
        expect(text3.innerHTML).toEqual(
          `test3 text "<code>inner text</code>".`
        );
      }).then(done);
    });
  });
  describe("data-format=markdown", () => {
    it("replaces processes data-format=markdown sections, but leaves other sections alone", done => {
      var ops = {
        config: makeBasicConfig(),
        body: makeDefaultBody() +
          `
          <section id=markdown1 data-format=markdown>
            ## this is a h2
            This is a paragraph with \`code\`.

            ### heading 3
            This is another paragraph.

            ### another h3
            This is another paragraph.
          </section>
          <section id=dontTouch>
            ## this should not change
          </section>
          `,
      };
      ops.config.doRDFa = false;
      makeRSDoc(ops, doc => {
        const headings = Array.from(
          doc.querySelectorAll("#markdown1 h2, #markdown1 h3")
        );
        expect(headings.length).toEqual(3);
        const [h2, h3, anotherH3] = headings;
        expect(h2.localName).toEqual("h2");
        expect(h3.localName).toEqual("h3");
        expect(anotherH3.localName).toEqual("h3");
        expect(anotherH3.textContent.trim()).toEqual("1.2 another h3");
        expect(doc.querySelector("#markdown1 code")).toBeTruthy();
        const dontChange = doc.querySelector("#dontTouch").textContent.trim();
        expect(dontChange).toEqual("## this should not change");
      }).then(done);
    });
  });
});
