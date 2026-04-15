"use strict";

import {
  flushIframes,
  getExportedDoc,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";
import { prepare } from "../../../src/core/implementation-status.js";

describe("Core — Implementation Status", () => {
  afterAll(flushIframes);
  const apiURL = `${window.location.origin}/tests/data/baseline/data.json`;

  it("does nothing if implementationStatus is not enabled", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);

    expect(doc.querySelector(".baseline-title")).toBeFalsy();
    expect(doc.querySelector(".baseline-status")).toBeFalsy();
  });

  it("renders badge for an explicit feature ID", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "test-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dt = doc.querySelector(".baseline-title");
    const dd = doc.querySelector(".baseline-status");

    expect(dt).toBeTruthy();
    expect(dd).toBeTruthy();
    expect(dt.textContent).toContain("Widely available");
  });

  it("shows correct status for limited availability", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "limited-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dt = doc.querySelector(".baseline-title");

    expect(dt).toBeTruthy();
    expect(dt.textContent).toContain("Limited availability");
  });

  it("shows browser support icons", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "test-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const browsers = doc.querySelectorAll(".baseline-browser");

    expect(browsers.length).toBe(4);
    for (const browser of browsers) {
      expect(browser.classList.contains("support-available")).toBeTrue();
    }
  });

  it("shows unsupported browsers correctly", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "limited-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const supported = doc.querySelectorAll(
      ".baseline-browser.support-available"
    );
    const notSupported = doc.querySelectorAll(
      ".baseline-browser.support-unavailable"
    );

    expect(supported.length).toBe(1);
    expect(notSupported.length).toBe(3);
    // Each unsupported browser must have its own SVG icon (not shared)
    for (const el of notSupported) {
      expect(el.querySelector(".baseline-support-icon")).toBeTruthy();
    }
  });

  it("auto-detects features from edDraftURI", async () => {
    const ops = makeStandardOps({
      edDraftURI: "https://w3c.github.io/test-spec/",
      implementationStatus: {
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dt = doc.querySelector(".baseline-title");

    expect(dt).toBeTruthy();
    expect(dt.textContent).toContain("Widely available");
  });

  it("aggregates multiple features with worst-of semantics", async () => {
    const ops = makeStandardOps({
      edDraftURI: "https://w3c.github.io/multi-spec/",
      implementationStatus: {
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dt = doc.querySelector(".baseline-title");

    expect(dt).toBeTruthy();
    expect(dt.textContent).toContain("Newly available");
  });

  it("handles missing feature gracefully", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "nonexistent-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dt = doc.querySelector(".baseline-title");

    expect(dt).toBeTruthy();
  });

  it("defaults removeOnSave to false", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "test-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const { implementationStatus } = doc.defaultView.respecConfig;

    expect(implementationStatus.feature).toBe("test-feature");
    expect(implementationStatus.removeOnSave).toBeFalse();
  });

  it("shows correct status for newly available", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "multi-feature-b",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dt = doc.querySelector(".baseline-title");

    expect(dt).toBeTruthy();
    expect(dt.textContent).toContain("Newly available");
  });

  it("groups browsers by engine in pills", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "test-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const pills = doc.querySelectorAll(".baseline-pill");

    // 3 pills: Chromium (Chrome+Edge), Gecko (Firefox), WebKit (Safari)
    expect(pills.length).toBe(3);
    // First pill has 2 browsers (Chrome + Edge)
    expect(pills[0].querySelectorAll(".baseline-browser").length).toBe(2);
    // Other pills have 1 each
    expect(pills[1].querySelectorAll(".baseline-browser").length).toBe(1);
    expect(pills[2].querySelectorAll(".baseline-browser").length).toBe(1);
  });

  it("renders baseline icon with accessible title", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "limited-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const icon = doc.querySelector(".baseline-icon");

    expect(icon).toBeTruthy();
    expect(icon.getAttribute("role")).toBe("img");
    const title = icon.querySelector("title");
    expect(title).toBeTruthy();
    expect(title.textContent).toBe("Limited availability");
  });

  it("links to webstatus.dev for more info", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "test-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const link = doc.querySelector(".baseline-more-info");

    expect(link).toBeTruthy();
    expect(link.href).toContain("webstatus.dev/features/test-feature");
    expect(link.getAttribute("aria-label")).toContain("More info about");
  });

  it("normalizes object config with null feature", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: null,
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const { implementationStatus } = doc.defaultView.respecConfig;

    expect(implementationStatus.feature).toBeNull();
    expect(implementationStatus.removeOnSave).toBeFalse();
  });

  it("preserves badge on save by default", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "test-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dd = doc.querySelector(".baseline-status");

    expect(dd).toBeTruthy();
    // Badge should have browser pills, not just a plain link
    expect(dd.querySelector(".baseline-browsers")).toBeTruthy();
  });

  it("accepts string shorthand config for explicit feature ID", () => {
    const conf = { implementationStatus: "test-feature" };
    prepare(conf);
    const { implementationStatus } = conf;
    expect(implementationStatus.feature).toBe("test-feature");
    expect(implementationStatus.removeOnSave).toBeFalse();
    document.getElementById("baseline-stylesheet")?.remove();
  });

  it("accepts boolean true config for auto-detect", () => {
    const conf = { implementationStatus: true };
    prepare(conf);
    const { implementationStatus } = conf;
    expect(implementationStatus.feature).toBeNull();
    expect(implementationStatus.removeOnSave).toBeFalse();
    document.getElementById("baseline-stylesheet")?.remove();
  });

  it("exports static feature link when removeOnSave is enabled", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "test-feature",
        removeOnSave: true,
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const exportedDoc = await getExportedDoc(doc);
    const exportedStatus = exportedDoc.querySelector(".baseline-status");
    const exportedLink = exportedStatus.querySelector("a");

    expect(exportedStatus.querySelector(".baseline-browsers")).toBeNull();
    expect(exportedLink.getAttribute("href")).toContain(
      "webstatus.dev/features/test-feature"
    );
    expect(exportedLink.textContent).toContain("Web Platform Status");
  });
});
