// @ts-check
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
});
