// @ts-check
import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";
import { rewriteServiceUrl } from "../service-origin-rewrite.js";

describe("SpecHelper - rewriteServiceUrl", () => {
  const map = {
    "https://respec.org": "http://localhost:8000",
    "https://api.specref.org": "http://localhost:8001",
  };

  it("rewrites a mapped origin and keeps the path and query", () => {
    expect(rewriteServiceUrl("https://respec.org/xref/search/?q=1", map)).toBe(
      "http://localhost:8000/xref/search/?q=1"
    );
  });

  it("leaves an unmapped origin alone", () => {
    const url = "https://w3c.github.io/mdn-spec-links/x.json";
    expect(rewriteServiceUrl(url, map)).toBe(url);
  });

  it("rewrites the xref cache version probe, which config cannot reach", () => {
    expect(rewriteServiceUrl("https://respec.org/xref/meta/version", map)).toBe(
      "http://localhost:8000/xref/meta/version"
    );
  });

  it("accepts a replacement with a trailing slash without doubling it", () => {
    expect(
      rewriteServiceUrl("https://respec.org/caniuse/x", {
        "https://respec.org": "http://localhost:8000/",
      })
    ).toBe("http://localhost:8000/caniuse/x");
  });

  it("returns the input unchanged when the map is empty", () => {
    const url = "https://respec.org/xref/search/";
    expect(rewriteServiceUrl(url, {})).toBe(url);
  });

  it("does not throw on a relative url", () => {
    expect(() =>
      rewriteServiceUrl("/base/builds/respec-w3c.js", map)
    ).not.toThrow();
  });

  it("is handed a serviceOrigins object by the karma client config", () => {
    // Proves the wiring exists. Which origins it holds depends on the
    // environment, so the values are asserted end to end below instead.
    expect(globalThis.__karma__.config.serviceOrigins).toEqual(
      jasmine.any(Object)
    );
  });
});

describe("SpecHelper - service origin rewrite, end to end", () => {
  const karmaConfig = globalThis.__karma__.config;
  /** @type {Record<string, string> | undefined} */
  let original;

  beforeEach(() => {
    original = karmaConfig.serviceOrigins;
  });
  afterEach(() => {
    karmaConfig.serviceOrigins = original;
  });
  afterAll(flushIframes);

  it("redirects a request ReSpec itself makes", async () => {
    // Unreachable on purpose: this asserts where the request went, not that it
    // succeeded. The xref lookup failing is expected and is not the assertion.
    karmaConfig.serviceOrigins = {
      "https://respec.org": "http://service-rewrite-probe.invalid",
    };
    const body = `<section><p>A <a>dictionary</a> here.</p></section>`;
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

  it("is installed but only partially effective for a fixture loaded via src", async () => {
    // makeRSDoc decorates an src-loaded document from the iframe's load
    // handler, so the wrapper exists but misses any request ReSpec already
    // issued. It does catch later ones, because the pipeline continues past
    // load. How many is timing dependent and deliberately not asserted: the
    // point is that src-loaded fixtures cannot be relied on for coverage.
    karmaConfig.serviceOrigins = {
      "https://respec.org": "http://service-rewrite-probe.invalid",
    };
    const doc = await makeRSDoc(makeStandardOps({}), "spec/core/simple.html");
    expect(doc.defaultView.__respecRewrittenUrls).toBeDefined();
  });
});
