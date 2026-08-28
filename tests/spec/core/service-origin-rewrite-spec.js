// @ts-check
import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";
import {
  installFetchRewrite,
  rewriteServiceUrl,
  validateServiceOrigins,
} from "../service-origin-rewrite.js";

describe("SpecHelper - rewriteServiceUrl", () => {
  const origins = new Map([
    ["https://respec.org", "http://localhost:8000"],
    ["https://api.specref.org", "http://localhost:8001"],
  ]);

  it("rewrites a mapped origin and keeps the path, query and hash", () => {
    expect(
      rewriteServiceUrl("https://respec.org/xref/search/?q=1#f", origins)
    ).toBe("http://localhost:8000/xref/search/?q=1#f");
  });

  it("leaves an unmapped origin alone", () => {
    const url = "https://w3c.github.io/mdn-spec-links/x.json";
    expect(rewriteServiceUrl(url, origins)).toBe(url);
  });

  it("returns a relative url unchanged", () => {
    // toBe, not not.toThrow(): a guard returning undefined would pass that.
    const url = "/base/builds/respec-w3c.js";
    expect(rewriteServiceUrl(url, origins)).toBe(url);
  });
});

describe("SpecHelper - validateServiceOrigins", () => {
  it("accepts a bare origin", () => {
    expect(() =>
      validateServiceOrigins(
        new Map([["https://respec.org", "http://localhost:8000"]])
      )
    ).not.toThrow();
  });

  it("rejects a scheme-less value, which would redirect nothing", () => {
    // Parses fine as scheme "localhost:", so a URL check alone misses it.
    expect(() =>
      validateServiceOrigins(
        new Map([["https://respec.org", "localhost:8000"]])
      )
    ).toThrowError(/needs an http:\/\/ or https:\/\/ prefix/);
  });

  it("rejects an unparseable value", () => {
    expect(() =>
      validateServiceOrigins(new Map([["https://respec.org", "8000"]]))
    ).toThrowError(/is not a valid URL/);
  });
});

describe("SpecHelper - installFetchRewrite", () => {
  const origins = new Map([["https://respec.org", "http://localhost:8000"]]);

  /** A stand-in window that records what reached the underlying fetch. */
  function fakeWindow() {
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
    const targetWindow = fakeWindow();
    const before = targetWindow.fetch;
    installFetchRewrite(targetWindow, new Map());
    expect(targetWindow.fetch).toBe(before);
    expect(targetWindow.caches).toBe("untouched");
  });
  it("clones a Request onto the rewritten url, keeping method and headers", async () => {
    // This is the shape core/utils.js fetchAndCache passes: a bodyless GET.
    const targetWindow = fakeWindow();
    installFetchRewrite(targetWindow, origins);
    const request = new Request("https://respec.org/w3c/groups/webapps", {
      headers: { "X-Probe": "1" },
    });
    await targetWindow.fetch(request);
    const sent = targetWindow.calls[0].input;
    expect(sent.url).toBe("http://localhost:8000/w3c/groups/webapps");
    expect(sent.method).toBe("GET");
    expect(sent.headers.get("X-Probe")).toBe("1");
  });

  it("forwards an unmapped Request as the very same object", async () => {
    const targetWindow = fakeWindow();
    installFetchRewrite(targetWindow, origins);
    const request = new Request("https://w3c.github.io/x.json");
    await targetWindow.fetch(request);
    expect(targetWindow.calls[0].input).toBe(request);
    expect(targetWindow.__respecRewrittenUrls).toEqual([]);
  });

  it("forwards the same init object rather than rebuilding it", async () => {
    const targetWindow = fakeWindow();
    installFetchRewrite(targetWindow, origins);
    const init = {
      method: "POST",
      body: JSON.stringify({ queries: [] }),
      headers: { "Content-Type": "application/json" },
    };
    await targetWindow.fetch("https://respec.org/xref/search/", init);
    expect(targetWindow.calls[0].input).toBe(
      "http://localhost:8000/xref/search/"
    );
    // Identity, so a POST body cannot be lost: nothing here copies init.
    expect(targetWindow.calls[0].init).toBe(init);
  });

  it("hides caches, so a seeded entry cannot answer before fetch runs", async () => {
    // Asserts behavior, not shape: `"caches" in window` stays true either way.
    const targetWindow = fakeWindow();
    installFetchRewrite(targetWindow, origins);
    expect("caches" in targetWindow).toBe(true);
    const cache = await targetWindow.caches.open("https://respec.org");
    expect(
      await cache.match(new Request("https://respec.org/x"))
    ).toBeUndefined();
  });

  it("refuses to install with a bad origin rather than failing per request", () => {
    const targetWindow = fakeWindow();
    const before = targetWindow.fetch;
    expect(() =>
      installFetchRewrite(
        targetWindow,
        new Map([["https://respec.org", "localhost:8000"]])
      )
    ).toThrowError(/needs an http:\/\/ or https:\/\/ prefix/);
    expect(targetWindow.fetch).toBe(before);
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
    expect(() =>
      validateServiceOrigins(new Map(Object.entries(original)))
    ).not.toThrow();
  });

  it("redirects a request ReSpec itself makes", async () => {
    // Unreachable on purpose: this asserts where the request went, not that it
    // succeeded.
    karmaConfig.serviceOrigins = {
      "https://respec.org": "http://service-rewrite-probe.invalid",
    };
    // Unique per run: xref-db keys IndexedDB on the query alone, origin-wide, and
    // jasmine randomizes spec order, so a shared term can arrive already warm.
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

  it("still installs for a fixture loaded via src", async () => {
    // makeRSDoc decorates an src-loaded document from the iframe's load handler,
    // so the wrapper exists but misses whatever ReSpec already issued. How much
    // it catches depends on timing; do not rely on src fixtures for coverage.
    karmaConfig.serviceOrigins = {
      "https://respec.org": "http://service-rewrite-probe.invalid",
    };
    const doc = await makeRSDoc(makeStandardOps({}), "spec/core/simple.html");
    expect(doc.defaultView.__respecRewrittenUrls).toBeDefined();
  });
});
