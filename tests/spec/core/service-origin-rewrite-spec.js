// @ts-check
import {
  flushIframes,
  makeRSDoc,
  makeStandardOps,
  serviceWorkerRedirects,
} from "../SpecHelper.js";
import {
  rewriteServiceUrl,
  validateServiceOrigins,
} from "../service-origin-rewrite.js";
import { seedCache } from "../respec-cache-helper.js";

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

describe("SpecHelper - service origin rewrite, end to end", () => {
  const karmaConfig = globalThis.__karma__.config;
  const original = karmaConfig.serviceOrigins;
  // A host that cannot resolve, so a request the worker fails to redirect
  // rejects instead of reaching a real server.
  const probeOrigin = "https://service-rewrite-probe.invalid";
  const probeURL = `${probeOrigin}/base/tests/data/groups.json`;

  afterEach(() => {
    karmaConfig.serviceOrigins = original;
  });
  afterAll(flushIframes);

  it("is configured with service origins that validate", () => {
    // Pins the karma wiring, and fails the suite early on a typo'd variable
    // rather than after every request has quietly gone to production.
    expect(original).toEqual(jasmine.any(Object));
    expect(() =>
      validateServiceOrigins(new Map(Object.entries(original)))
    ).not.toThrow();
  });

  it("sends a spec document's requests to the replacement origin, and stops when the config clears", async () => {
    karmaConfig.serviceOrigins = { [probeOrigin]: location.origin };
    const redirected = await makeRSDoc(makeStandardOps());
    const response = await redirected.defaultView.fetch(probeURL);
    const groups = await response.json();
    // Only karma serves this fixture, so these bytes cannot come from anywhere
    // but the replacement origin.
    expect(groups["https://respec.org/w3c/groups/css/"].body.shortname).toBe(
      "css"
    );

    karmaConfig.serviceOrigins = {};
    const untouched = await makeRSDoc(makeStandardOps());
    await expectAsync(untouched.defaultView.fetch(probeURL)).toBeRejected();
  });

  it("answers 502 when the replacement origin is not running", async () => {
    // ReSpec handles a response that is not ok. A rejection instead surfaces as
    // an unhandled rejection inside the spec iframe, which no spec can see.
    karmaConfig.serviceOrigins = { "https://respec.org": probeOrigin };
    const doc = await makeRSDoc(makeStandardOps());
    const response = await doc.defaultView.fetch("https://respec.org/anything");
    expect(response.status).toBe(502);
  });

  it("redirects a request ReSpec itself makes", async () => {
    karmaConfig.serviceOrigins = { "https://respec.org": probeOrigin };
    // Unique per run: xref-db keys IndexedDB on the query alone, origin-wide, and
    // jasmine randomizes spec order, so a shared term can arrive already warm.
    const term = `probe-${Math.random().toString(36).slice(2)}`;
    const body = `<section><p>A <a>${term}</a> here.</p></section>`;
    await makeRSDoc(makeStandardOps({ xref: ["webidl"] }, body));
    const redirects = await serviceWorkerRedirects();
    expect(redirects.some(url => url.startsWith(`${probeOrigin}/`))).toBe(true);
  });
});

describe("SpecHelper - seedCache under redirected service origins", () => {
  const karmaConfig = globalThis.__karma__.config;
  const original = karmaConfig.serviceOrigins;
  // Its own origin, so the cache this opens and deletes is not one another spec
  // seeded.
  const probeOrigin = "https://cache-guard-probe.invalid";
  const probeURL = `${probeOrigin}/groups/probe/`;

  afterEach(async () => {
    karmaConfig.serviceOrigins = original;
    await caches.delete(probeOrigin);
  });
  afterAll(flushIframes);

  it("stores nothing while requests go to a local service", async () => {
    karmaConfig.serviceOrigins = { "https://respec.org": location.origin };
    await seedCache({ [probeURL]: { body: { seeded: true } } });
    expect(await caches.has(probeOrigin)).toBe(false);
  });

  it("still seeds when every request goes to production", async () => {
    karmaConfig.serviceOrigins = {};
    await seedCache({ [probeURL]: { body: { seeded: true } } });
    const cache = await caches.open(probeOrigin);
    const hit = await cache.match(new Request(probeURL));
    expect((await hit.json()).seeded).toBe(true);
  });

  it("leaves a redirected document unable to read or write the cache", async () => {
    karmaConfig.serviceOrigins = { "https://respec.org": location.origin };
    const { defaultView: view } = await makeRSDoc(makeStandardOps());
    // fetchAndCache checks for the property, so it has to stay present.
    expect("caches" in view).toBe(true);
    const cache = await view.caches.open("https://respec.org");
    await cache.put(
      new view.Request("https://respec.org/w3c/groups/probe/"),
      new view.Response('{"body":{}}')
    );
    expect(
      await cache.match(
        new view.Request("https://respec.org/w3c/groups/probe/")
      )
    ).toBeUndefined();
  });

  it("leaves the cache working in a document when nothing is redirected", async () => {
    karmaConfig.serviceOrigins = {};
    const { defaultView: view } = await makeRSDoc(makeStandardOps());
    const cache = await view.caches.open(probeOrigin);
    await cache.put(
      new view.Request(probeURL),
      new view.Response('{"real":1}')
    );
    const hit = await cache.match(new view.Request(probeURL));
    expect(await hit.json()).toEqual({ real: 1 });
  });
});
