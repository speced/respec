"use strict";

import * as utils from "../../../src/core/utils.js";
import { html } from "../../../src/core/import-maps.js";

describe("Core - Utils", () => {
  describe("makeSafeCopy", () => {
    it("removes attributes from dfn elements when making a safe copy", () => {
      const p = document.createElement("p");
      p.innerHTML = `
        <dfn
          data-export=""
          data-dfn-type="interface"
          data-idl="interface"
          data-title="RTCIceTransport"
          data-dfn-for=""
          tabindex="0"
          aria-haspopup="dialog"
          title="Show what links to this definition"><code>RTCIceTransport</code></dfn>
      `;
      const copy = utils.makeSafeCopy(p);
      const span = copy.querySelector("span");
      expect(span.textContent).toBe("RTCIceTransport");
      expect(copy.attributes).toHaveSize(0);
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
      const url = `${location.origin}/tests/data/pass.txt`;
      const requests = [url, new URL(url), new Request(url)];
      for (const request of requests) {
        expect(await caches.match(request)).toBe(undefined);
        await utils.fetchAndCache(url);
        const cache = await caches.open(location.origin);
        expect(cache).toBeTruthy();
        const cachedResponse = await cache.match(url);
        expect(cachedResponse).toBeTruthy();
        const expiresHeader = cachedResponse.headers.get("Expires");
        expect(expiresHeader).toBe(new Date(expiresHeader).toISOString());
        const expires = new Date(expiresHeader).valueOf();
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
      const url = `${location.origin}/tests/data/pass.txt`;
      await utils.fetchAndCache(url);
      expect(await caches.keys()).toEqual([location.origin]);
    });

    it("returns a cached response when the response is not ok", async () => {
      const url = `${location.origin}/bad-request`;
      const cache = await caches.open(location.origin);
      const goodResponse = new Response("PASS");
      await cache.put(url, goodResponse);
      const badRequest = new Request(url);
      const cachedResponse = await utils.fetchAndCache(badRequest);
      expect(await cachedResponse.text()).toBe("PASS");
    });

    it("returns a fresh network response when the cached response is expired", async () => {
      const url = `${location.origin}/tests/data/pass.txt`;
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
      const url = `${location.origin}/tests/data/pass.txt`;
      const cachedResponse = await utils.fetchAndCache(url, 0);
      expect(cachedResponse.headers.has("Expires")).toBe(true);
      const cacheTime = new Date(
        cachedResponse.headers.get("Expires")
      ).valueOf();
      expect(cacheTime).toBeLessThanOrEqual(Date.now());
    });
  });

  describe("createResourceHint", () => {
    it("returns a link element", () => {
      const link = utils.createResourceHint({
        href: "https://example.com",
        hint: "preconnect",
      });
      expect(link instanceof HTMLLinkElement).toBe(true);
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
      const link = utils.createResourceHint({
        hint: "dns-prefetch",
        href: "http://origin:8080/./../test",
      });
      expect(link.href).toBe("http://origin:8080/");
    });
    it("normalizes a URL intended for preconnect to an origin", () => {
      const link = utils.createResourceHint({
        hint: "preconnect",
        href: "http://origin:8080/./../test",
      });
      expect(link.href).toBe("http://origin:8080/");
    });
    it("ignores 'as' member on dns-prefetch", () => {
      const link = utils.createResourceHint({
        hint: "dns-prefetch",
        href: "https://example.com",
        as: "media",
      });
      expect(link.hasAttribute("as")).toBe(false);
    });
    it("ignores 'as' member on preconnect", () => {
      const link = utils.createResourceHint({
        hint: "preconnect",
        href: "https://example.com",
        as: "style",
      });
      expect(link.hasAttribute("as")).toBe(false);
    });
    it("respects 'as' member on preload", () => {
      const link = utils.createResourceHint({
        hint: "preload",
        href: "https://example.com",
        as: "style",
      });
      expect(link.hasAttribute("as")).toBe(true);
      expect(link.getAttribute("as")).toBe("style");
    });
    it("respects override of the CORS mode", () => {
      const link = utils.createResourceHint({
        hint: "preconnect",
        href: "https://other.origin.com",
        corsMode: "use-credentials",
      });
      expect(link.crossOrigin).toBe("use-credentials");
    });
    it("allows the browser to recover from bogus CORS mode", () => {
      const link = utils.createResourceHint({
        hint: "preconnect",
        href: "https://other.origin.com",
        corsMode: "this will magically become anonymous!",
      });
      expect(link.crossOrigin).toBe("anonymous");
    });
    it("automatically detects cross-origin requests for dns-prefetch", () => {
      const link = utils.createResourceHint({
        hint: "dns-prefetch",
        href: "https://other.origin.com",
      });
      expect(link.crossOrigin).toBe("anonymous");
    });
    it("automatically detects cross-origin requests for preconnect", () => {
      const link = utils.createResourceHint({
        hint: "preconnect",
        href: "https://other.origin.com",
      });
      expect(link.crossOrigin).toBe("anonymous");
    });
    it("marks the link element for removal on save by default", () => {
      const link = utils.createResourceHint({
        href: "https://example.com",
        hint: "preconnect",
      });
      expect(link.classList).toContain("removeOnSave");
    });
    it("repects leaving a hint in the spec when told to", () => {
      const link = utils.createResourceHint({
        href: "https://example.com",
        hint: "preconnect",
        dontRemove: true,
      });
      expect(link.classList).not.toContain("removeOnSave");
    });
  });

  describe("addID()", () => {
    it("removes diacritical marks", () => {
      const elem = document.createElement("h2");
      elem.innerHTML = "Systém jednotné trigonometrické sítě katastrální";
      utils.addId(elem);
      expect(elem.id).toBe("system-jednotne-trigonometricke-site-katastralni");
    });
  });

  describe("linkCSS", () => {
    it("adds a link element", () => {
      utils.linkCSS(document, "BOGUS");
      expect(document.querySelectorAll("link[href='BOGUS']")).toHaveSize(1);
      document.querySelector("link[href='BOGUS']").remove();
    });

    it("adds several link elements", () => {
      utils.linkCSS(document, ["BOGUS", "BOGUS", "BOGUS"]);
      expect(document.querySelectorAll("link[href='BOGUS']")).toHaveSize(3);
      document
        .querySelectorAll("link[href='BOGUS']")
        .forEach(element => element.remove());
    });
  });

  describe("concatDate", () => {
    it("formats the date as needed", () => {
      const d = new Date("1977-03-01");
      expect(utils.concatDate(d)).toBe("19770301");
      expect(utils.concatDate(d, "-")).toBe("1977-03-01");
    });
  });

  describe("humanDate", () => {
    it("produces a human date", () => {
      expect(utils.humanDate("1977-03-15")).toBe("15 March 1977");
      const d = new Date("1977-03-15");
      expect(utils.humanDate(d)).toBe("15 March 1977");
    });

    it("produces a human date in different languages", () => {
      expect(utils.humanDate("1977-03-15", "en")).toBe("15 March 1977");
      const d = new Date("1977-03-15");
      expect(utils.humanDate(d)).toBe("15 March 1977");
      expect(utils.humanDate(d, "en")).toBe("15 March 1977");
      expect(utils.humanDate(d, "nl")).toBe("15 maart 1977");
      expect(utils.humanDate(d, "fr")).toBe("15 mars 1977");
      expect(utils.humanDate(d, "unknown")).toBe("15 March 1977");
    });
  });

  describe("isoDate", () => {
    it("produces an ISO date", () => {
      expect(utils.isoDate("2013-06-25")).toMatch(/2013-06-2[45]T/);
      const d = new Date("2013-09-25");
      expect(utils.isoDate(d)).toMatch(/2013-09-2[45]T/);
    });
  });

  describe("isValidConfDate", () => {
    it("checks the validity of a date", () => {
      expect(utils.isValidConfDate("2000-01-01")).toBeTrue();
      expect(utils.isValidConfDate("01-01-01")).toBeFalse();
      expect(utils.isValidConfDate("March 1, 2020")).toBeFalse();
    });
  });

  describe("joinAnd", () => {
    it("joins with proper commas and 'and'", () => {
      expect(utils.joinAnd([])).toBe("");
      expect(utils.joinAnd(["x"])).toBe("x");
      expect(utils.joinAnd(["x", "x"])).toBe("x and x");
      expect(utils.joinAnd(["x", "x", "x"])).toBe("x, x, and x");
      expect(utils.joinAnd(["x", "x", "x", "x"])).toBe("x, x, x, and x");
      expect(
        utils.joinAnd(["x", "x", "x", "x"], str => {
          return str.toUpperCase();
        })
      ).toBe("X, X, X, and X");
    });
  });

  describe("xmlEscape", () => {
    it("escapes properly", () => {
      expect(utils.xmlEscape('&<>"')).toBe("&amp;&lt;&gt;&quot;");
    });
  });

  describe("norm", () => {
    it("normalises text", () => {
      expect(utils.norm("  a   b   ")).toBe("a b");
    });
  });

  describe("getIntlData", () => {
    const { getIntlData } = utils;
    const localizationStrings = {
      en: { foo: "EN Foo", bar: "EN Bar" },
      ko: { foo: "KO Foo" },
    };

    it("returns localized string in given language", () => {
      const intl = getIntlData(localizationStrings, "ko");
      expect(intl.foo).toBe("KO Foo");

      const intlEn = getIntlData(localizationStrings, "EN");
      expect(intlEn.foo).toBe("EN Foo");
    });

    it("falls back to English string if key does not exist in language", () => {
      const intl = getIntlData(localizationStrings, "ko");
      expect(intl.bar).toBe("EN Bar");
    });

    it("falls back to English string if language does not exist in localization data", () => {
      const intl = getIntlData(localizationStrings, "de");
      expect(intl.bar).toBe("EN Bar");
    });

    it("throws error if key doesn't exist in either doc lang and English", () => {
      const intl = getIntlData(localizationStrings, "de");
      expect(() => intl.baz).toThrowError(/No l10n data for key/);
    });
  });

  describe("toKeyValuePairs", () => {
    it("converts objects to key values pairs", () => {
      const obj = {
        editors: [
          {
            name: "Person Name",
          },
        ],
        specStatus: "ED",
        edDraftURI: "http://foo.com",
        shortName: "Foo",
      };
      const expected =
        'editors=[{"name":"Person Name"}], specStatus="ED", ' +
        'edDraftURI="http://foo.com", shortName="Foo"';
      expect(utils.toKeyValuePairs(obj)).toBe(expected);
    });
  });

  it("converts objects to key values pairs with different separator", () => {
    const obj = {
      editors: [
        {
          name: "Person Name",
        },
      ],
      specStatus: "ED",
      edDraftURI: "http://foo.com",
      shortName: "Foo",
    };
    const expected =
      'editors=[{"name":"Person Name"}]|||specStatus="ED"|||' +
      'edDraftURI="http://foo.com"|||shortName="Foo"';
    expect(utils.toKeyValuePairs(obj, "|||")).toBe(expected);
  });

  it("converts objects to key values pairs with different separator and delimiter", () => {
    const obj = {
      editors: [
        {
          name: "Person Name",
        },
      ],
      specStatus: "ED",
      edDraftURI: "http://foo.com",
      shortName: "Foo",
    };
    let expected =
      'editors;[{"name":"Person Name"}], specStatus;"ED", ' +
      'edDraftURI;"http://foo.com", shortName;"Foo"';
    expect(utils.toKeyValuePairs(obj, undefined, ";")).toBe(expected);

    expected =
      'editors^[{"name":"Person Name"}] % specStatus^"ED" % ' +
      'edDraftURI^"http://foo.com" % shortName^"Foo"';
    expect(utils.toKeyValuePairs(obj, " % ", "^")).toBe(expected);
  });

  describe("htmlJoinAnd", () => {
    it("joins with proper commas and 'and'", () => {
      const div = document.createElement("div");
      const render = html.bind(div);

      render`${utils.htmlJoinAnd([], item => html`<a>${item}</a>`)}`;
      expect(div.textContent).toBe("");
      expect(div.getElementsByTagName("a")).toHaveSize(0);

      render`${utils.htmlJoinAnd(["<x>"], item => html`<a>${item}</a>`)}`;
      expect(div.textContent).toBe("<x>");
      expect(div.getElementsByTagName("a")).toHaveSize(1);

      render`${utils.htmlJoinAnd(
        ["<x>", "<x>"],
        item => html`<a>${item}</a>`
      )}`;
      expect(div.textContent).toBe("<x> and <x>");
      expect(div.getElementsByTagName("a")).toHaveSize(2);

      render`${utils.htmlJoinAnd(
        ["<x>", "<x>", "<x>"],
        item => html`<a>${item}</a>`
      )}`;
      expect(div.textContent).toBe("<x>, <x>, and <x>");
      expect(div.getElementsByTagName("a")).toHaveSize(3);

      render`${utils.htmlJoinAnd(
        ["<x>", "<x>", "<X>", "<x>"],
        item => html`<a>${item}</a>`
      )}`;
      expect(div.textContent).toBe("<x>, <x>, <X>, and <x>");
      expect(div.getElementsByTagName("a")).toHaveSize(4);
    });
  });

  describe("DOM utils", () => {
    describe("getTextNodes", () => {
      it("finds all the text nodes", () => {
        const node = document.createElement("div");
        node.innerHTML =
          "<div>aa<span>bb<div class='exclude'>ignore me</div></span><p>cc<i>dd</i></p><pre>nope</pre></div>";

        const textNodes = utils.getTextNodes(node, ["pre", ".exclude"]);
        expect(textNodes).toHaveSize(4);
        const str = textNodes.map(tn => tn.nodeValue).join("");
        expect(str).toBe("aabbccdd");
      });
      it("Excludes white space nodes", () => {
        const node = document.createElement("div");
        node.innerHTML =
          " <exclude> </exclude> <exclude>\t \n</exclude>include me";

        const textNodes = utils.getTextNodes(node, [], "");
        expect(textNodes).toHaveSize(1);
        expect(textNodes[0].nodeValue).toBe("include me");
      });
    });

    describe("renameElement", () => {
      it("renames empty elements", () => {
        const a = document.createElement("a");
        a.id = "this-is-a-div";
        document.body.appendChild(a);
        const div = utils.renameElement(a, "div");
        expect(div instanceof HTMLDivElement).toBe(true);
        expect(div.id).toBe("this-is-a-div");
        expect(document.querySelector("a#this-is-a-div")).toBeFalsy();
        expect(document.querySelector("div#this-is-a-div")).toBeTruthy();
        div.remove();
        a.remove();
      });

      it("renames elements with children", () => {
        const a = document.createElement("a");
        a.id = "this-is-a-div";
        a.innerHTML = "<span id='inner-pass'>pass</span>";
        document.body.appendChild(a);
        const div = utils.renameElement(a, "div");
        expect(div instanceof HTMLDivElement).toBe(true);
        expect(div.id).toBe("this-is-a-div");
        expect(document.querySelector("a#this-is-a-div")).toBeFalsy();
        const inner = document.querySelector("div#this-is-a-div #inner-pass");
        expect(inner).toBeTruthy();
        expect(inner.textContent).toBe("pass");
        div.remove();
        a.remove();
      });

      it("renames elements and doesn't copy attributes when copyAttributes is false", () => {
        const a = document.createElement("a");
        a.setAttribute("class", "some-class");
        a.setAttribute("title", "title");
        a.innerHTML = "<span id='inner-pass'>pass</span>";
        document.body.appendChild(a);
        const div = utils.renameElement(a, "div", { copyAttributes: false });
        expect(div instanceof HTMLDivElement).toBe(true);
        expect(div.attributes).toHaveSize(0);
        div.remove();
        a.remove();
      });
    });

    describe("addId", () => {
      it("addId - creates an id from the content of an elements", () => {
        const { addId } = utils;
        let elem = document.createElement("p");
        elem.id = "ID";
        expect(addId(elem)).toBe("ID");

        elem = document.createElement("p");
        elem.title = "TITLE";
        expect(addId(elem)).toBe("title");

        elem = document.createElement("p");
        elem.textContent = "TEXT";
        expect(addId(elem)).toBe("text");

        elem = document.createElement("p");
        expect(addId(elem, null, "PASSED")).toBe("passed");

        elem = document.createElement("p");
        expect(addId(elem, "PFX", "PASSED")).toBe("PFX-passed");

        elem = document.createElement("p");
        elem.textContent = "TEXT";
        expect(addId(elem, "PFX")).toBe("PFX-text");

        elem = document.createElement("p");
        elem.textContent = "TEXT";
        addId(elem);
        expect(elem.id).toBe("text");

        elem = document.createElement("p");
        elem.textContent = "  A--Bé9\n C";
        expect(addId(elem)).toBe("a-be9-c");

        elem = document.createElement("p");
        expect(addId(elem)).toBe("generatedID");

        elem = document.createElement("p");
        elem.textContent = "2017";
        expect(addId(elem)).toBe("x2017");

        const div = document.createElement("div");
        div.innerHTML =
          "<p id='a'></p><p id='a-1'></p><span>A</span><span title='a'></span>";
        document.body.appendChild(div);
        const span = div.querySelector("span");
        expect(addId(span)).toBe("a-0");
        const spanWithTitle = div.querySelector("span[title]");
        expect(addId(spanWithTitle)).toBe("a-2");
        div.remove();

        elem = document.createElement("p");
        elem.textContent = ` ¡™£¢∞§¶•ªº
        THIS is a ------------
      test (it_contains [[stuff]] '123') 😎		`;
        expect(addId(elem)).toBe("this-is-a-test-it_contains-stuff-123");
      });
    });

    describe("getDfnTitles", () => {
      it("doesn't prepend empty dfns to data-lt", () => {
        const dfn = document.createElement("dfn");
        dfn.dataset.lt = "DFN|DFN2|DFN3";
        document.body.appendChild(dfn);

        const titles = utils.getDfnTitles(dfn, { isDefinition: true });
        expect(titles[0]).toBe("DFN");
        expect(titles[1]).toBe("DFN2");
        expect(titles[2]).toBe("DFN3");

        dfn.remove();
      });

      it("doesn't use the text content when data-lt-noDefault is present", () => {
        const dfn = document.createElement("dfn");
        dfn.dataset.lt = "DFN|DFN2|DFN3";
        dfn.setAttribute("data-lt-noDefault", true);
        document.body.appendChild(dfn);

        const titles = utils.getDfnTitles(dfn, { isDefinition: true });
        expect(titles[0]).toBe("DFN");
        expect(titles[1]).toBe("DFN2");
        expect(titles[2]).toBe("DFN3");
        expect(titles[3]).toBeUndefined();

        dfn.remove();
      });

      it("finds the data-lts", () => {
        const dfn = document.createElement("dfn");
        dfn.dataset.lt = "DFN|DFN2|DFN3";
        dfn.innerHTML = "<abbr title='ABBR'>TEXT</abbr>";
        document.body.appendChild(dfn);

        const titles = utils.getDfnTitles(dfn, { isDefinition: true });
        expect(titles[0]).toBe("DFN");
        expect(titles[1]).toBe("DFN2");
        expect(titles[2]).toBe("DFN3");
        expect(titles[3]).toBe("TEXT");

        dfn.removeAttribute("data-lt");
        expect(utils.getDfnTitles(dfn)[0]).toBe("ABBR");

        dfn.querySelector("abbr").removeAttribute("title");
        expect(utils.getDfnTitles(dfn)[0]).toBe("TEXT");

        dfn.remove();
      });
    });

    describe("getElementIndentation", () => {
      it("should return the indentation of the given element", () => {
        const fragment = document.createRange().createContextualFragment(`
          <a>My link</a>
        `);
        const [anchor] = fragment.children;

        expect(utils.getElementIndentation(anchor)).toBe("          ");
      });
    });

    describe("toMDCode()", () => {
      it("wraps a string in backticks", () => {
        expect(utils.toMDCode("")).toBe("");
        expect(utils.toMDCode("test")).toBe("`test`");
      });
    });

    describe("codedJoinOr()", () => {
      it("uses disjunction", () => {
        expect(utils.codedJoinOr([])).toBe("");
        expect(utils.codedJoinOr(["a", "b", "c"])).toBe("`a`, `b`, or `c`");
      });
      it("quotes and uses disjunction", () => {
        expect(utils.codedJoinOr([], { quotes: true })).toBe("");
        expect(utils.codedJoinOr(["a", "b", "c"], { quotes: true })).toBe(
          '`"a"`, `"b"`, or `"c"`'
        );
      });
    });

    describe("codedJoinAnd()", () => {
      it("uses conjunction", () => {
        expect(utils.codedJoinAnd([])).toBe("");
        expect(utils.codedJoinAnd(["a", "b", "c"])).toBe("`a`, `b`, and `c`");
      });
      it("quotes and uses conjunction", () => {
        expect(utils.codedJoinAnd([], { quotes: true })).toBe("");
        expect(utils.codedJoinAnd(["a", "b", "c"], { quotes: true })).toBe(
          '`"a"`, `"b"`, and `"c"`'
        );
      });
    });
    describe("docLink", () => {
      const docLink = utils.docLink;
      it("it allows unlinked strings", () => {
        const result = docLink`Link to ${"nothing"}.`;
        expect(result).toBe("Link to nothing.");
      });

      it("it links to [config] options", () => {
        const result = docLink`Link to ${"[specStatus]"}.`;
        expect(result).toBe(
          "Link to [`specStatus`](https://respec.org/docs/#specStatus)."
        );
      });

      it("it aliases relative to docs folder", () => {
        const result = docLink`See ${"[using `data-dfn-for`|#data-dfn-for]"}.`;
        expect(result).toBe(
          "See [using `data-dfn-for`](https://respec.org/docs/#data-dfn-for)."
        );
      });

      it("it aliases absolute URLs", () => {
        const result = docLink`Link to ${"[doc status|https://somewhere.else]"}.`;
        expect(result).toBe("Link to [doc status](https://somewhere.else/).");
      });

      it("it allows mixing known, aliased, and absolute URLs", () => {
        const result = docLink`Link to ${"[authors]"} ${"[writers|editors]"} ${"[somewhere|https://somewhere.else]"}.`;
        expect(result).toBe(
          "Link to [`authors`](https://respec.org/docs/#authors) [writers](https://respec.org/docs/editors) [somewhere](https://somewhere.else/)."
        );
      });
    });
  });
});
