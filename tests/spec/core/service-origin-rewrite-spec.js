// @ts-check
import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";
import {
  installFetchRewrite,
  rewriteServiceUrl,
  validateServiceOrigins,
} from "../service-origin-rewrite.js";

describe("SpecHelper - rewriteServiceUrl", () => {
  const map = {
    "https://respec.org": "http://localhost:8000",
    "https://api.specref.org": "http://localhost:8001",
  };

  it("rewrites a mapped origin and keeps the path, query and hash", () => {
    expect(
      rewriteServiceUrl("https://respec.org/xref/search/?q=1#f", map)
    ).toBe("http://localhost:8000/xref/search/?q=1#f");
  });

  it("leaves an unmapped origin alone", () => {
    const url = "https://w3c.github.io/mdn-spec-links/x.json";
    expect(rewriteServiceUrl(url, map)).toBe(url);
  });

  it("accepts a replacement with a trailing slash without doubling it", () => {
    expect(
      rewriteServiceUrl("https://respec.org/caniuse/x", {
        "https://respec.org": "http://localhost:8000/",
      })
    ).toBe("http://localhost:8000/caniuse/x");
  });

  it("returns a relative url unchanged", () => {
    // Asserts the return value, not merely that it did not throw: with the
    // guard returning undefined instead, core/data-include.js would fetch the
    // string "undefined".
    const url = "/base/builds/respec-w3c.js";
    expect(rewriteServiceUrl(url, map)).toBe(url);
  });
});

describe("SpecHelper - validateServiceOrigins", () => {
  it("accepts a bare origin", () => {
    expect(() =>
      validateServiceOrigins({ "https://respec.org": "http://localhost:8000" })
    ).not.toThrow();
  });

  it("rejects a scheme-less value, which would redirect nothing", () => {
    // "localhost:8000" parses as scheme "localhost:", so the protocol and host
    // setters are ignored and the whole suite runs against production.
    expect(() =>
      validateServiceOrigins({ "https://respec.org": "localhost:8000" })
    ).toThrowError(/needs an http or https scheme/);
  });

  it("rejects a value carrying a path, which would be dropped", () => {
    expect(() =>
      validateServiceOrigins({
        "https://respec.org": "http://localhost:8000/api",
      })
    ).toThrowError(/must be an origin with no path/);
  });

  it("rejects an unparseable value at install rather than inside fetch", () => {
    expect(() =>
      validateServiceOrigins({ "https://respec.org": "8000" })
    ).toThrowError(/is not a URL/);
  });
});

describe("SpecHelper - installFetchRewrite", () => {
  const map = { "https://respec.org": "http://localhost:8000" };

  /** A stand-in window that records what reached the underlying fetch. */
  function fakeWin() {
    const calls = [];
    return {
      calls,
      Request: window.Request,
      caches: "untouched",
      fetch(input, init) {
        calls.push({ input, init });
        return Promise.resolve("ok");
      },
    };
  }

  it("does nothing at all when the map is empty", () => {
    const win = fakeWin();
    const before = win.fetch;
    installFetchRewrite(win, {});
    expect(win.fetch).toBe(before);
    expect(win.caches).toBe("untouched");
  });
  it("clones a Request onto the rewritten url, keeping method and headers", async () => {
    // This is the shape core/utils.js fetchAndCache passes: a bodyless GET.
    const win = fakeWin();
    installFetchRewrite(win, map);
    const request = new Request("https://respec.org/w3c/groups/webapps", {
      headers: { "X-Probe": "1" },
    });
    await win.fetch(request);
    const sent = win.calls[0].input;
    expect(sent.url).toBe("http://localhost:8000/w3c/groups/webapps");
    expect(sent.method).toBe("GET");
    expect(sent.headers.get("X-Probe")).toBe("1");
  });

  it("forwards an unmapped Request as the very same object", async () => {
    const win = fakeWin();
    installFetchRewrite(win, map);
    const request = new Request("https://w3c.github.io/x.json");
    await win.fetch(request);
    expect(win.calls[0].input).toBe(request);
    expect(win.__respecRewrittenUrls).toEqual([]);
  });

  it("passes init through untouched, so a POST keeps its body", async () => {
    const win = fakeWin();
    installFetchRewrite(win, map);
    const init = {
      method: "POST",
      body: JSON.stringify({ queries: [] }),
      headers: { "Content-Type": "application/json" },
    };
    await win.fetch("https://respec.org/xref/search/", init);
    expect(win.calls[0].input).toBe("http://localhost:8000/xref/search/");
    expect(win.calls[0].init).toBe(init);
  });

  it("hides caches, so a seeded entry cannot answer before fetch runs", async () => {
    // core/utils.js fetchAndCache reads and writes under the pre-rewrite origin,
    // which both shadows the redirect and pollutes the production cache with
    // local responses. Asserts the always-miss behavior rather than the shape,
    // because `"caches" in window` stays true for an own property either way.
    const win = fakeWin();
    installFetchRewrite(win, map);
    expect("caches" in win).toBe(true);
    const cache = await win.caches.open("https://respec.org");
    await expectAsync(
      cache.match(new Request("https://respec.org/x"))
    ).toBeResolvedTo(undefined);
    await expectAsync(cache.put("https://respec.org/x", "body")).toBeResolved();
  });

  it("refuses to install with a bad origin rather than failing per request", () => {
    const win = fakeWin();
    const before = win.fetch;
    expect(() =>
      installFetchRewrite(win, { "https://respec.org": "localhost:8000" })
    ).toThrowError(/needs an http or https scheme/);
    expect(win.fetch).toBe(before);
  });
});

describe("SpecHelper - service origin rewrite, end to end", () => {
  const karmaConfig = globalThis.__karma__.config;
  const original = karmaConfig.serviceOrigins;

  afterEach(() => {
    karmaConfig.serviceOrigins = original;
  });
  afterAll(flushIframes);

  it("is handed a serviceOrigins map the wrapper accepts", () => {
    // Pins the karma wiring, and fails the suite early on a typo'd variable
    // rather than after every request has quietly gone to production.
    expect(original).toEqual(jasmine.any(Object));
    expect(() => validateServiceOrigins(original)).not.toThrow();
  });

  it("redirects a request ReSpec itself makes", async () => {
    // Unreachable on purpose: this asserts where the request went, not that it
    // succeeded. The xref lookup failing is expected and is not the assertion.
    karmaConfig.serviceOrigins = {
      "https://respec.org": "http://service-rewrite-probe.invalid",
    };
    // A term nothing else could have cached. core/xref-db.js answers from
    // IndexedDB keyed on the query alone, shared across the whole origin, and
    // jasmine's spec order is random, so a well-known term like "dictionary"
    // could already be warm from core/xref-spec.js and no request would go out.
    const term = `probe-${Math.random().toString(36).slice(2)}`;
    const body = `<section><p>A <a>${term}</a> here.</p></section>`;
    const doc = await makeRSDoc(makeStandardOps({ xref: ["webidl"] }, body));
    const seen = doc.defaultView.__respecRewrittenUrls;
    expect(seen).toBeDefined();
    expect(
      seen.some(url => url.startsWith("http://service-rewrite-probe.invalid/"))
    ).toBe(true);
  });

  it("installs nothing when no origins are configured", async () => {
    karmaConfig.serviceOrigins = {};
    const doc = await makeRSDoc(makeStandardOps({ specStatus: "WD" }));
    expect(doc.defaultView.__respecRewrittenUrls).toBeUndefined();
  });

  it("survives an origin key carrying a script end tag", async () => {
    // Values are validated, but keys are not: they come from our own karma
    // config rather than from a user. They still land in the injected payload,
    // so the escaping there is the only thing stopping this from closing the
    // script element, spilling raw JS into the body and installing nothing.
    karmaConfig.serviceOrigins = {
      "https://x.invalid</script><b>spilled</b>": "http://localhost:8000",
    };
    const doc = await makeRSDoc(makeStandardOps({ specStatus: "WD" }));
    expect(doc.defaultView.__respecRewrittenUrls).toBeDefined();
    expect(doc.body.textContent).not.toContain("spilled");
  });

  it("still installs for a fixture loaded via src", async () => {
    // Named for what is asserted. makeRSDoc decorates an src-loaded document
    // from the iframe's load handler, so the wrapper exists but misses whatever
    // ReSpec already issued; how much it catches is timing dependent, so src
    // fixtures cannot be relied on for coverage.
    karmaConfig.serviceOrigins = {
      "https://respec.org": "http://service-rewrite-probe.invalid",
    };
    const doc = await makeRSDoc(makeStandardOps({}), "spec/core/simple.html");
    expect(doc.defaultView.__respecRewrittenUrls).toBeDefined();
  });
});
