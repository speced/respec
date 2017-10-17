"use strict";
describe("Core - Utils", () => {
  let utils;
  beforeAll(async () => {
    utils = await new Promise(resolve => {
      require(["core/utils"], u => resolve(u));
    });
  });
  fdescribe("deriveDfnType()", () => {
    it("checks local name of element for a dfn", () => {
      expect(() => {
        utils.deriveDfnType(document.createElement("dfn"));
      }).not.toThrow();
      expect(() => {
        utils.deriveDfnType(document.createElement("a"));
      }).toThrow();
      expect(() => {
        utils.deriveDfnType(document.createElement("div"));
      }).toThrow();
    });
    it("returns the type, if already included via 'data-dfn-type'", () => {
      const dfn = document.createElement("dfn");
      expect(utils.deriveDfnType(dfn)).toEqual("dfn"); // default is "dfn"
      dfn.dataset.dfnType = "pass";
      expect(utils.deriveDfnType(dfn)).toEqual("pass");
    });
    it("derives the 'idl' type from the ancestor chain", () => {
      const section = document.createElement("section");
      section.dataset.dfnFor = "test";
      section.innerHTML = `
        <pre class="idl">
          interface Test {};
        </pre>
        <dfn>test</dfn>
      `;
      const dfn = section.querySelector("dfn");
      expect(utils.deriveDfnType(dfn)).toEqual("idl");
    });
  });

  fdescribe("deriveAnchorType()", () => {
    it("checks local name of element for a link", () => {
      expect(() => {
        utils.deriveAnchorType(document.createElement("a"));
      }).not.toThrow();
      expect(() => {
        utils.deriveAnchorType(document.createElement("dfn"));
      }).toThrow();
      expect(() => {
        utils.deriveAnchorType(document.createElement("div"));
      }).toThrow();
    });
    it("returns the type, if already included via 'data-link-type'", () => {
      const anchor = document.createElement("a");
      expect(utils.deriveAnchorType(anchor)).toEqual("dfn"); // default is "dfn"
      anchor.dataset.linkType = "pass";
      expect(utils.deriveAnchorType(anchor)).toEqual("pass");
    });
    it("derives the 'idl' type from the ancestor chain", () => {
      const section = document.createElement("section");
      section.dataset.linkFor = "test";
      section.innerHTML = `
        <pre class="idl">
          interface Test {};
        </pre>
        <dfn>test</dfn>
        <a>test</a>
      `;
      const anchor = section.querySelector("a");
      expect(utils.deriveAnchorType(anchor)).toEqual("idl");
    });
  });

  fdescribe("deriveId()", () => {
    it("generates an id, but doesn't actually assign it", () => {
      const div = document.createElement("div");
      utils.deriveId(div);
      expect(div.hasAttribute("id")).toBe(false);
    });
    it("returns only generates a new id if the id is missing", () => {
      const div = document.createElement("div");
      expect(utils.deriveId(div)).toEqual("generated-id");
      div.id = "pass";
      expect(utils.deriveId(div)).toEqual("pass");
    });
    it("returns auto-generates/increment ids even when it has no text to work with", () => {
      const doc = document.implementation.createHTMLDocument("");
      const div = doc.createElement("div");
      doc.body.appendChild(div);
      div.id = "";
      expect(utils.deriveId(div)).toEqual("generated-id");
      div.id = "generated-id";
      const div2 = doc.createElement("div");
      expect(utils.deriveId(div2)).toBe("generated-id-0");
    });
    it("uses provided text option, otherwise falls back to text content", () => {
      const div = document.createElement("div");
      div.textContent = "text-content";
      const id = utils.deriveId(div, { text: "pass" });
      expect(id).toEqual("pass");
      expect(utils.deriveId(div)).toEqual("text-content");
    });
    it("respects not converting the id to lowercase, when passed noLowerCase", () => {
      const div = document.createElement("div");
      const id = utils.deriveId(div, { text: "PASS", noLowerCase: true });
      expect(id).toEqual("PASS");
      div.innerHTML = "TeSt";
      expect(utils.deriveId(div, { noLowerCase: true })).toBe("TeSt");
    });
    it("normalizes ids to lowercase when generating an id from text or content", () => {
      const div = document.createElement("div");
      expect(utils.deriveId(div, { text: "PASS" })).toEqual("pass");
      div.textContent = "PASS";
      expect(utils.deriveId(div)).toEqual("pass");
      div.textContent = "PASS";
      expect(utils.deriveId(div, { noLowerCase: true })).toEqual("PASS");
    });
    it("respects requests to prefix ids in some particular way", () => {
      const div = document.createElement("div");
      div.textContent = "fail";
      expect(utils.deriveId(div, { text: "PASS", prefix: "pass" })).toEqual(
        "pass-pass"
      );
      expect(utils.deriveId(div, { text: "PASS", prefix: "PREFIX" })).toEqual(
        "PREFIX-pass"
      );
      expect(
        utils.deriveId(div, { text: "PASS", prefix: "PASS", noLowerCase: true })
      ).toEqual("PASS-PASS");
      div.textContent = "PASS";
      expect(
        utils.deriveId(div, { prefix: "PASS", noLowerCase: true })
      ).toEqual("PASS-PASS");
      expect(
        utils.deriveId(div, { prefix: "PASS", noLowerCase: false })
      ).toEqual("PASS-pass");
    });
    it("respects requests to prefix ids, but normalizes garbage prefixes", () => {
      const div = document.createElement("div");
      div.textContent = "text";
      expect(utils.deriveId(div, { prefix: "this-is-FINE" })).toEqual(
        "this-is-FINE-text"
      );
      expect(
        utils.deriveId(div, { text: "PASS", prefix: "$#@!!#@$!#%@#$$#&" })
      ).toEqual("pass");
    });
    it("Replaces non-ascii chars when generating IDs", () => {
      const doc = document.implementation.createHTMLDocument("");
      const p = doc.createElement("p");
      p.innerHTML = "<p>  A--Bé9\n C</p>";
      expect(utils.deriveId(p)).toEqual("a-b-9-c");
      p.textContent = "2017";
      expect(utils.deriveId(p)).toEqual("x2017");
      const div = doc.createElement("div");
      div.innerHTML = `<p>" ¡™£¢∞§¶•ªº
          THIS is a ------------
        test (it_contains [[stuff]] '123') 😎		"</p>`;
      expect(utils.deriveId(div.querySelector("p"))).toEqual(
        "this-is-a-test-it_contains-stuff-123"
      );
    });
    it("prefixes ids that start with numbers with 'x'", () => {
      const div = document.createElement("div");
      div.textContent = "1";
      expect(utils.deriveId(div)).toEqual("x1");
      expect(utils.deriveId(div, { text: "2000" })).toEqual("x2000");
      expect(utils.deriveId(div, { text: "PASS", prefix: "2000" })).toEqual(
        "x2000-pass"
      );
      expect(
        utils.deriveId(div, { text: "PASS", prefix: "2000", noLowerCase: true })
      ).toEqual("x2000-PASS");
    });
    it("gives the next possible id, if ID is taken in the document", () => {
      const doc = document.implementation.createHTMLDocument("");
      const div = doc.createElement("div");
      div.innerHTML = `
        <p id='a'></p>
        <p id='a-1'></p>
        <span>A</span>
        <foo>a</foo>
      `;
      doc.body.appendChild(div);
      const span = div.querySelector("span");
      const spanId = utils.deriveId(span);
      expect(spanId).toEqual("a-0");
      span.id = spanId;
      const foo = div.querySelector("foo");
      const fooId = utils.deriveId(foo);
      expect(fooId).toEqual("a-2");
    });
  });

  fdescribe("getLinkedTerms()", () => {
    it("gets an empty list if there are no linked terms for the element", () => {
      const a = document.createElement("a");
      const terms = utils.getLinkedTerms(a);
      expect(terms).toEqual(jasmine.arrayWithExactContents([]));
    });
    it("respects `ltNoDefault`, so ignores text content of element", () => {
      const a = document.createElement("a");
      a.dataset.ltNoDefault = "";
      expect(utils.getLinkedTerms(a)).toEqual(
        jasmine.arrayWithExactContents([])
      );
      a.innerHTML = "FOO";
      expect(utils.getLinkedTerms(a)).toEqual(
        jasmine.arrayWithExactContents([])
      );
      a.dataset.lt = "pass";
      expect(utils.getLinkedTerms(a)).toEqual(
        jasmine.arrayWithExactContents(["pass"])
      );
      delete a.dataset.ltNoDefault;
      expect(utils.getLinkedTerms(a)).toEqual(
        jasmine.arrayWithExactContents(["pass", "foo"])
      );
    });
    it("normalizes linked terms to lowercase and trimmed", () => {
      const dfn = document.createElement("dfn");
      dfn.innerHTML = "FOO";
      dfn.dataset.lt = " \n BAR|\tBAZ | BAT  ";
      expect(utils.getLinkedTerms(dfn)).toEqual(
        jasmine.arrayWithExactContents(["foo", "bar", "baz", "bat"])
      );
    });
    it("special-cases the empty string", () => {
      const dfn = document.createElement("dfn");
      dfn.innerHTML = '""';
      expect(utils.getLinkedTerms(dfn)).toEqual(
        jasmine.arrayWithExactContents(["the-empty-string"])
      );
      dfn.dataset.lt = '""';
      dfn.innerHTML = "";
      expect(utils.getLinkedTerms(dfn)).toEqual(
        jasmine.arrayWithExactContents(["the-empty-string"])
      );
    });
    it("pluralizes definitions when asked to via `pluralize`", () => {
      const dfn = document.createElement("dfn");
      dfn.innerHTML = "TeSt";
      expect(utils.getLinkedTerms(dfn)).toEqual(
        jasmine.arrayWithExactContents(["test"])
      );
      dfn.dataset.pluralize = "";
      expect(utils.getLinkedTerms(dfn)).toEqual(
        jasmine.arrayWithExactContents(["test", "tests"])
      );
    });
    it("resolves simple entities", () => {
      debugger;
      const a = document.createElement("a");
      a.dataset.lt = "parent[&quot;child&quot;]";
      expect(utils.getLinkedTerms(a)).toEqual(
        jasmine.arrayWithExactContents(['parent["inner"]'])
      );
    });
  });

  describe("createResourceHint", () => {
    it("returns a link element", () => {
      var link = utils.createResourceHint({
        href: "https://example.com",
        hint: "preconnect",
      });
      expect(link instanceof HTMLLinkElement).toEqual(true);
    });
    it("throws given invalid opts", () => {
      expect(() => {
        utils.createResourceHint();
      }).toThrow();

      expect(() => {
        utils.createResourceHint(null);
      }).toThrow();

      expect(() => {
        utils.createResourceHint("throw");
      }).toThrow();

      expect(() => {
        utils.createResourceHint({
          href: "https://example.com",
          hint: "preconnect",
        });
      }).not.toThrow();
    });
    it("throws given an unknown hint", () => {
      expect(() => {
        utils.createResourceHint({ hint: null });
      }).toThrow();
      expect(() => {
        utils.createResourceHint({ hint: "not a real hint" });
      }).toThrow();
      expect(() => {
        utils.createResourceHint({ hint: "preconnect" });
      }).not.toThrow();
    });
    it("throws given an invalid URL", () => {
      expect(() => {
        utils.createResourceHint({
          hint: "preconnect",
          href: "http://[unvalid:url:///",
        });
      }).toThrow();
      expect(() => {
        utils.createResourceHint({
          hint: "preconnect",
          href: "http://this/is/ok/tho",
        });
      }).not.toThrow();
    });
    it("normalizes a URL intended for dns-prefetch to an origin", () => {
      var link = utils.createResourceHint({
        hint: "dns-prefetch",
        href: "http://origin:8080/./../test",
      });
      expect(link.href).toEqual("http://origin:8080/");
    });
    it("normalizes a URL intended for preconnect to an origin", () => {
      var link = utils.createResourceHint({
        hint: "preconnect",
        href: "http://origin:8080/./../test",
      });
      expect(link.href).toEqual("http://origin:8080/");
    });
    it("ignores 'as' member on dns-prefetch", () => {
      var link = utils.createResourceHint({
        hint: "dns-prefetch",
        href: "https://example.com",
        as: "media",
      });
      expect(link.hasAttribute("as")).toEqual(false);
    });
    it("ignores 'as' member on preconnect", () => {
      var link = utils.createResourceHint({
        hint: "preconnect",
        href: "https://example.com",
        as: "style",
      });
      expect(link.hasAttribute("as")).toEqual(false);
    });
    it("respects 'as' member on preload", () => {
      var link = utils.createResourceHint({
        hint: "preload",
        href: "https://example.com",
        as: "style",
      });
      expect(link.hasAttribute("as")).toEqual(true);
      expect(link.getAttribute("as")).toEqual("style");
    });
    it("respects override of the CORS mode", () => {
      var link = utils.createResourceHint({
        hint: "preconnect",
        href: "https://other.origin.com",
        corsMode: "use-credentials",
      });
      expect(link.crossOrigin).toEqual("use-credentials");
    });
    it("allows the browser to recover from bogus CORS mode", () => {
      var link = utils.createResourceHint({
        hint: "preconnect",
        href: "https://other.origin.com",
        corsMode: "this will magically become anonymous!",
      });
      expect(link.crossOrigin).toEqual("anonymous");
    });
    it("automatically detects cross-origin requests for dns-prefetch", function() {
      var link = utils.createResourceHint({
        hint: "dns-prefetch",
        href: "https://other.origin.com",
      });
      expect(link.crossOrigin).toEqual("anonymous");
    });
    it("automatically detects cross-origin requests for preconnect", () => {
      var link = utils.createResourceHint({
        hint: "preconnect",
        href: "https://other.origin.com",
      });
      expect(link.crossOrigin).toEqual("anonymous");
    });
    it("marks the link element for removal on save by default", () => {
      var link = utils.createResourceHint({
        href: "https://example.com",
        hint: "preconnect",
      });
      expect(link.classList.contains("removeOnSave")).toEqual(true);
    });
    it("repects leaving a hint in the spec when told to", () => {
      var link = utils.createResourceHint({
        href: "https://example.com",
        hint: "preconnect",
        dontRemove: true,
      });
      expect(link.classList.contains("removeOnSave")).toEqual(false);
    });
  });

  describe("calculateLeftPad()", () => {
    it("throws given invalid input", () => {
      expect(() => {
        expect(utils.calculateLeftPad());
      }).toThrow();
      expect(() => {
        expect(utils.calculateLeftPad({}));
      }).toThrow();
      expect(() => {
        expect(utils.calculateLeftPad(123));
      }).toThrow();
      expect(() => {
        expect(utils.calculateLeftPad(null));
      }).toThrow();
    });
    it("calculates the smallest left padding of multiline text", () => {
      expect(utils.calculateLeftPad("")).toEqual(0);
      expect(utils.calculateLeftPad("\n    \n  ")).toEqual(2);
      expect(utils.calculateLeftPad("                         ")).toEqual(25);
      expect(utils.calculateLeftPad(" a                        ")).toEqual(1);
      expect(utils.calculateLeftPad("  \n a                        ")).toEqual(
        1
      );
      expect(utils.calculateLeftPad(" \n   a ")).toEqual(1);
      expect(utils.calculateLeftPad("\n    \n      \n    ")).toEqual(4);
      expect(utils.calculateLeftPad("\n    \n      \n  ")).toEqual(2);
      expect(utils.calculateLeftPad("\n   \n      \n  \n    ")).toEqual(2);
      expect(utils.calculateLeftPad("\n\n\n\n\n\n\n\n\n\n")).toEqual(0);
      expect(utils.calculateLeftPad("    \n\n\n\n\n  \n\n\n\n\n   ")).toEqual(
        2
      );
    });
  });

  describe("makeOwnerSwapper()", () => {
    it("returns a function", () => {
      var testNode = document.createTextNode("test");
      var testFunction = utils.makeOwnerSwapper(testNode);
      expect(testFunction instanceof Function).toBe(true);
    });

    it("removes the original node from the its owner document", () => {
      var testNode = document.createTextNode("test");
      var swapTestNode = utils.makeOwnerSwapper(testNode);
      var newDoc = document.implementation.createHTMLDocument("test");
      document.body.appendChild(testNode);
      expect(document.body.contains(testNode)).toBe(true);
      swapTestNode(newDoc.body);
      expect(document.body.contains(testNode)).toBe(false);
      expect(testNode.ownerDocument).toEqual(newDoc);
    });

    it("appends the node into a new document", () => {
      var testNode = document.createElement("link");
      var swapTestNode = utils.makeOwnerSwapper(testNode);
      var newDoc = document.implementation.createHTMLDocument("test");
      expect(document.head.contains(testNode)).toBe(false);
      swapTestNode(newDoc.head);
      expect(newDoc.head.contains(testNode)).toBe(true);
      expect(testNode.ownerDocument).toEqual(newDoc);
    });

    it("prepends the node into a new document at the right place", () => {
      var testNode = document.createElement("link");
      var swapTestNode = utils.makeOwnerSwapper(testNode);
      var newDoc = document.implementation.createHTMLDocument("test");
      var metaElem = newDoc.createElement("meta");
      newDoc.head.appendChild(metaElem);
      swapTestNode(newDoc.head);
      expect(newDoc.head.firstChild).toEqual(testNode);
      expect(newDoc.head.lastChild).toEqual(metaElem);
    });
  });

  describe("normalizePadding() method", () => {
    it("throws given an argument that is not a string", () => {
      expect(() => {
        utils.normalizePadding({});
      }).toThrow();
      expect(() => {
        utils.normalizePadding([]);
      }).toThrow();
      expect(() => {
        utils.normalizePadding(123);
      }).toThrow();
    });

    it("returns the empty string given falsy values", () => {
      expect(utils.normalizePadding()).toEqual("");
      expect(utils.normalizePadding("")).toEqual("");
      expect(utils.normalizePadding(null)).toEqual("");
    });

    it("normalises whitespace, but ignore white with pre tags", () => {
      var str = `   trim start\n    * trim 3 from start \n <pre>trim 1\n   if(x){\n\t party()</pre>\n  foo \n    bar`;
      var testStrings = utils.normalizePadding(str).split("\n");
      expect(testStrings[0]).toEqual("trim start");
      expect(testStrings[1]).toEqual(" * trim 3 from start ");
      expect(testStrings[2]).toEqual("<pre>trim 1");
      expect(testStrings[3]).toEqual("   if(x){");
      expect(testStrings[4]).toEqual("\t party()</pre>");
      expect(testStrings[5]).toEqual("foo ");
      expect(testStrings[6]).toEqual(" bar");
    });
  });

  describe("linkCSS", () => {
    it("adds a link element", () => {
      utils.linkCSS(document, "BOGUS");
      expect($("link[href='BOGUS']").length).toEqual(1);
      $("link[href='BOGUS']").remove();
    });

    it("adds several link elements", () => {
      utils.linkCSS(document, ["BOGUS", "BOGUS", "BOGUS"]);
      expect($("link[href='BOGUS']").length).toEqual(3);
      $("link[href='BOGUS']").remove();
    });
  });

  describe("lead0", () => {
    it("prepends 0 only when needed", () => {
      expect(utils.lead0("1")).toEqual("01");
      expect(utils.lead0("01")).toEqual("01");
    });
  });

  describe("concatDate", () => {
    it("formats the date as needed", () => {
      var d = new Date("1977-03-01");
      expect(utils.concatDate(d)).toEqual("19770301");
      expect(utils.concatDate(d, "-")).toEqual("1977-03-01");
    });
  });

  describe("parseSimpleDate", () => {
    it("parses a simple date", () => {
      const d = utils.parseSimpleDate("1977-03-01");
      expect(d.getUTCFullYear()).toEqual(1977);
      expect(d.getUTCMonth()).toEqual(2);
      expect(d.getUTCDate()).toEqual(1);
    });
  });

  describe("parseLastModified", () => {
    it("parses a date in lastModified format", () => {
      const d = utils.parseLastModified("03/15/1977 13:05:42");
      expect(d.getUTCFullYear()).toEqual(1977);
      expect(d.getUTCMonth()).toEqual(2);
      expect(d.getUTCDate()).toEqual(15);
    });
  });

  describe("humanDate", () => {
    it("produces a human date", () => {
      expect(utils.humanDate("1977-03-15")).toEqual("15 March 1977");
      var d = new Date("1977-03-15");
      expect(utils.humanDate(d)).toEqual("15 March 1977");
    });

    it("produces a human date in different languages", () => {
      expect(utils.humanDate("1977-03-15", "en")).toEqual("15 March 1977");
      var d = new Date("1977-03-15");
      expect(utils.humanDate(d)).toEqual("15 March 1977");
      expect(utils.humanDate(d, "en")).toEqual("15 March 1977");
      expect(utils.humanDate(d, "nl")).toEqual("15 maart 1977");
      expect(utils.humanDate(d, "fr")).toEqual("15 mars 1977");
      expect(utils.humanDate(d, "unknown")).toEqual("15 March 1977");
    });
  });

  describe("isoDate", () => {
    it("produces an ISO date", () => {
      expect(utils.isoDate("2013-06-25")).toMatch(/2013-06-2[45]T/);
      var d = new Date("2013-09-25");
      expect(utils.isoDate(d)).toMatch(/2013-09-2[45]T/);
    });
  });

  describe("joinAnd", () => {
    it("joins with proper commas and 'and'", () => {
      expect(utils.joinAnd([])).toEqual("");
      expect(utils.joinAnd(["x"])).toEqual("x");
      expect(utils.joinAnd(["x", "x"])).toEqual("x and x");
      expect(utils.joinAnd(["x", "x", "x"])).toEqual("x, x, and x");
      expect(utils.joinAnd(["x", "x", "x", "x"])).toEqual("x, x, x, and x");
      expect(
        utils.joinAnd(["x", "x", "x", "x"], function(str) {
          return str.toUpperCase();
        })
      ).toEqual("X, X, X, and X");
    });
  });

  describe("xmlEscape", () => {
    it("escapes properly", () => {
      expect(utils.xmlEscape('&<>"')).toEqual("&amp;&lt;&gt;&quot;");
    });
  });

  describe("norm", () => {
    it("normalises text", () => {
      expect(utils.norm("  a   b   ")).toEqual("a b");
    });
  });

  describe("toKeyValuePairs", () => {
    it("converts objects to key values pairs", () => {
      var obj = {
        editors: [
          {
            name: "Person Name",
          },
        ],
        specStatus: "ED",
        edDraftURI: "http://foo.com",
        shortName: "Foo",
      };
      var expected =
        'editors=[{"name":"Person Name"}], specStatus="ED", ' +
        'edDraftURI="http://foo.com", shortName="Foo"';
      expect(utils.toKeyValuePairs(obj)).toEqual(expected);
    });
  });

  it("converts objects to key values pairs with different separator", () => {
    var obj = {
      editors: [
        {
          name: "Person Name",
        },
      ],
      specStatus: "ED",
      edDraftURI: "http://foo.com",
      shortName: "Foo",
    };
    var expected =
      'editors=[{"name":"Person Name"}]|||specStatus="ED"|||' +
      'edDraftURI="http://foo.com"|||shortName="Foo"';
    expect(utils.toKeyValuePairs(obj, "|||")).toEqual(expected);
  });

  it("converts objects to key values pairs with different separator and delimiter", function() {
    var obj = {
      editors: [
        {
          name: "Person Name",
        },
      ],
      specStatus: "ED",
      edDraftURI: "http://foo.com",
      shortName: "Foo",
    };
    var expected =
      'editors;[{"name":"Person Name"}], specStatus;"ED", ' +
      'edDraftURI;"http://foo.com", shortName;"Foo"';
    expect(utils.toKeyValuePairs(obj, undefined, ";")).toEqual(expected);

    expected =
      'editors^[{"name":"Person Name"}] % specStatus^"ED" % ' +
      'edDraftURI^"http://foo.com" % shortName^"Foo"';
    expect(utils.toKeyValuePairs(obj, " % ", "^")).toEqual(expected);
  });
});
