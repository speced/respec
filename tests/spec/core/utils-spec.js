"use strict";
describe("Core - Utils", () => {
  var utils;
  beforeAll(done => {
    require(["core/utils"], function(u) {
      utils = u;
      done();
    });
  });

  describe("fetchAndCache", () => {
    async function clearCaches() {
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }
    }
    beforeEach(clearCaches);
    it("caches a requests of different type with a 1 day default", async () => {
      const url = location.origin + "/tests/data/pass.txt";
      const requests = [url, new URL(url), new Request(url)];
      for (const request of requests) {
        expect(await caches.match(request)).toBe(undefined);
        await utils.fetchAndCache(url);
        const cache = await caches.open(location.origin);
        expect(cache).toBeTruthy();
        const cachedResponse = await cache.match(url);
        expect(cachedResponse).toBeTruthy();
        const expires = new Date(
          cachedResponse.headers.get("Expires")
        ).valueOf();
        expect(expires).toBeGreaterThan(Date.now());
        // default is 86400000, but we give a little leeway (~1 day)
        expect(expires).toBeGreaterThan(Date.now() + 86000000);
        const bodyText = await cachedResponse.text();
        expect(bodyText).toBe("PASS");
        await clearCaches();
      }
    });

    it("uses the origin as the cache key", async () => {
      expect(await caches.keys()).toEqual([]);
      const url = location.origin + "/tests/data/pass.txt";
      await utils.fetchAndCache(url);
      expect(await caches.keys()).toEqual([location.origin]);
    });

    it("returns a cached response when the response is not ok", async () => {
      const url = location.origin + "/bad-request";
      const cache = await caches.open(location.origin);
      const goodResponse = new Response("PASS");
      await cache.put(url, goodResponse);
      const badRequest = new Request(url);
      const cachedResponse = await utils.fetchAndCache(badRequest);
      expect(await cachedResponse.text()).toBe("PASS");
    });

    it("returns a fresh network response when the cached response is expired", async () => {
      const url = location.origin + "/tests/data/pass.txt";
      const cache = await caches.open(location.origin);
      const yesterday = Date.now() - 86400000;
      const expiredResponse = new Response("FAIL", {
        headers: { Expires: yesterday },
      });
      await cache.put(new Request(url), expiredResponse);
      const response = await utils.fetchAndCache(url);
      const body = await response.text();
      expect(body).toBe("PASS");
      const cachedResponse = await cache.match(url);
      expect(await cachedResponse.text()).toBe("PASS");
    });

    it("allows overriding the default cache time", async () => {
      const url = location.origin + "/tests/data/pass.txt";
      const cachedResponse = await utils.fetchAndCache(url, 0);
      expect(cachedResponse.headers.has("Expires")).toBe(true);
      const cacheTime = new Date(
        cachedResponse.headers.get("Expires")
      ).valueOf();
      expect(cacheTime <= Date.now()).toBe(true);
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

  describe("flatten()", () => {
    it("flattens iterables", () => {
      expect(utils.flatten(["pass"], [123, 456])).toEqual(["pass", 123, 456]);
      const map = new Map([["key-fail", "pass"], ["anotherKey", 123]]);
      expect(utils.flatten([], map)).toEqual(["pass", 123]);
      expect(utils.flatten([], new Set(["pass", 123]))).toEqual(["pass", 123]);
      expect(utils.flatten([], { "key-fail": "pass", other: 123 })).toEqual([
        "pass",
        123,
      ]);
    });

    it("flattens nested iterables as a reducer", () => {
      const input = [
        new Map([["fail", "123"]]),
        new Set([456]),
        [7, [8, [new Set([9, 10])]]],
        { key: "11" },
      ];
      const output = input.reduce(utils.flatten, ["first", 0]);
      expect(output).toEqual(["first", 0, "123", 456, 7, 8, 9, 10, "11"]);
    });

    it("flattens sparse and arrays", () => {
      const input = [, 1, 1, , , , 1, , 1];
      const output = input.reduce(utils.flatten,["pass"]);
      expect(output).toEqual([
        "pass",
        1,
        1,
        1,
        1,
      ]);
    });

    it("flattens dense and arrays", () => {
      const input = new Array(10);
      const output = input.reduce(utils.flatten,["pass"]);
      expect(output).toEqual(["pass"]);
    });
  });

  describe("DOM utils", () => {
    // migrated from core/jquery-enhanced
    describe("getTextNodes", () => {
      it("finds all the text nodes", () => {
        const node = document.createElement("div");
        node.innerHTML =
          "<div>aa<span>bb</span><p>cc<i>dd</i></p><pre>nope</pre></div>";

        const textNodes = utils.getTextNodes(node, ["pre"]);
        expect(textNodes.length).toEqual(4);
        const str = textNodes.map(tn => tn.nodeValue).join("");
        expect(str).toEqual("aabbccdd");
      });
    });
  });
});
