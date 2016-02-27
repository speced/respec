"use strict";
describe("Core - Markdown", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should process standard markdown content", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\nFoo\n===\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      $(".removeOnSave", doc).remove();
      var $foo = $("#foo", doc);
      expect($foo.length).toEqual(1);
      expect($foo.text()).toEqual("1. Foo");
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
      var $foo = $("#foo", doc);
      expect($foo.length).toEqual(1);
      expect($foo.text()).toMatch(/1\. Foo/);
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
      expect($(".note em", doc).length).toEqual(1);
      expect($(".issue em", doc).length).toEqual(1);
      expect($(".req em", doc).length).toEqual(1);
      expect($(".req h3", doc).length).toEqual(1);
    }).then(done);
  });

  it("should remove left padding before processing markdown content", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n    Foo\n    ===\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      expect($("code", doc).length).toEqual(0);
    }).then(done);
  });

  it("should structure content in nested sections with appropriate titles", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\nFoo\n===\n\nBar\n---\n\nBaz\n---\n\n### Foobar ###\n\n#### Foobaz ####\n\nZing\n---\n\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var $foo = $("#foo", doc);
      expect($foo.prop("tagName")).toEqual("SECTION");
      expect($foo.find("> h2").length).toEqual(1);
      expect($foo.find("> h2").text()).toEqual("1. Foo");

      expect($foo.find("#bar").prop("tagName")).toEqual("SECTION");
      expect($foo.find("#bar > h3").length).toEqual(1);
      expect($foo.find("#bar > h3").text()).toEqual("1.1 Bar");

      expect($foo.find("#baz").prop("tagName")).toEqual("SECTION");
      expect($foo.find("#baz > h3").length).toEqual(1);
      expect($foo.find("#baz > h3").text()).toEqual("1.2 Baz");

      expect($foo.find("#baz > #foobar").prop("tagName")).toEqual("SECTION");
      expect($foo.find("#baz > #foobar > h4").length).toEqual(1);
      expect($foo.find("#baz > #foobar > h4").text()).toEqual("1.2.1 Foobar");

      expect($foo.find("#baz > #foobar > #foobaz").prop("tagName")).toEqual("SECTION");
      expect($foo.find("#baz > #foobar > #foobaz > h5").length).toEqual(1);
      expect($foo.find("#baz > #foobar > #foobaz > h5").text()).toEqual("1.2.1.1 Foobaz");

      expect($foo.find("#zing").prop("tagName")).toEqual("SECTION");
      expect($foo.find("#zing > h3").length).toEqual(1);
      expect($foo.find("#zing > h3").text()).toEqual("1.3 Zing");
    }).then(done);
  });

  it("should gracefully handle jumps in nested headers", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\nFoo\n===\n\nBar\n---\n\nBaz\n===\n\n### Foobar ###\n\n",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      expect($("#baz > #foobar", doc).length).toEqual(1);
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
      var $bar = $("#bar", doc);
      expect($bar.text()).toMatch(/2. Bar/);
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
      var $bar = $("#bar", doc);
      expect($bar.text()).toMatch(/1.1 Bar/);
      var $foo = $("#foo", doc);
      expect($foo.find("#bar").length).toEqual(1);
    }).then(done);
  });

  it("should not nest content following a section inside of said section", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
       "\n\nFoo\n===\n\nsome text\n\n<section>\n\nBar\n---\n</section>\n\nBaz\n===\n\nsome text\n\n<",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, function(doc) {
      var $baz = $("#baz", doc);
      expect($baz.text()).toMatch(/2. Baz/);
      var $bar = $("#bar", doc);
      expect($bar.find("#baz").length).toEqual(0);
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
      var $bar = $("#bar", doc);
      expect($bar.text()).toMatch(/2. Bar/);
      var $body = $(doc.body, doc);
      expect($body.find("> #bar").length).toEqual(1);
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
      var $body = $(doc.body, doc);
      expect($body.find("> #bar").length).toEqual(1);
    }).then(done);
  });
});
