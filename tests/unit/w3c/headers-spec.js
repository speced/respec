"use strict";

import { isOffTR } from "/src/w3c/headers.js";

describe("W3C - headers - isOffTR", () => {
  it("is false for statuses that aren't published under /TR/, regardless of location", () => {
    for (const specStatus of ["ED", "unofficial", "base", "CG-DRAFT", "MO"]) {
      expect(isOffTR(specStatus, "https://example.com/spec/"))
        .withContext(specStatus)
        .toBeFalse();
    }
  });

  it("is true for a /TR/-track status rendered off https://www.w3.org/TR/", () => {
    for (const specStatus of ["WD", "DNOTE", "REC", "CRY"]) {
      expect(isOffTR(specStatus, "https://example.com/spec/"))
        .withContext(specStatus)
        .toBeTrue();
      expect(isOffTR(specStatus, "https://example.github.io/spec/"))
        .withContext(specStatus)
        .toBeTrue();
    }
  });

  it("is false for a /TR/-track status actually served from https://www.w3.org/TR/", () => {
    expect(isOffTR("WD", "https://www.w3.org/TR/some-spec/")).toBeFalse();
    expect(isOffTR("REC", "https://w3.org/TR/some-spec/")).toBeFalse();
  });

  it("is true when on w3.org but outside of /TR/", () => {
    expect(isOffTR("WD", "https://www.w3.org/Consortium/")).toBeTrue();
  });

  it("is false for an unparsable href instead of throwing", () => {
    expect(isOffTR("WD", "not a url")).toBeFalse();
  });
});
