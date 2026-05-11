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
  function cleanupBaselineStylesheet() {
    document.getElementById("baseline-stylesheet")?.remove();
    expect(document.getElementById("baseline-stylesheet")).toBeNull();
  }

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
    expect(dt.textContent).toContain("Browser support");
    expect(dd.textContent).toContain("Widely available");
  });

  it("shows correct status for limited availability", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "limited-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dd = doc.querySelector(".baseline-status");

    expect(dd).toBeTruthy();
    expect(dd.textContent).toContain("Limited availability");
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
    const dd = doc.querySelector(".baseline-status");

    expect(dd).toBeTruthy();
    expect(dd.textContent).toContain("Widely available");
  });

  it("aggregates multiple features with worst-of semantics", async () => {
    const ops = makeStandardOps({
      edDraftURI: "https://w3c.github.io/multi-spec/",
      implementationStatus: {
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dd = doc.querySelector(".baseline-status");

    expect(dd).toBeTruthy();
    expect(dd.textContent).toContain("Newly available");
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
    const warnings = doc.respec.warnings.filter(
      warning => warning.plugin === "core/implementation-status"
    );

    expect(dt).toBeTruthy();
    expect(warnings).toHaveSize(1);
    expect(warnings[0].hint).toContain("web-features/blob/main/data.json");
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
    const dd = doc.querySelector(".baseline-status");

    expect(dd).toBeTruthy();
    expect(dd.textContent).toContain("Newly available");
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
    const browsersPerPill = [...pills].map(
      pill => pill.querySelectorAll(".baseline-browser").length
    );

    expect(pills.length).toBe(3);
    expect(browsersPerPill).toEqual([2, 1, 1]);
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
    expect(icon.hasAttribute("role")).toBeFalse();
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("title")).toBeNull();
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
    expect(dd.querySelector(".baseline-browsers")).toBeTruthy();
  });

  it("accepts string shorthand config for explicit feature ID", () => {
    const conf = { implementationStatus: "test-feature" };
    prepare(conf);
    const { implementationStatus } = conf;
    expect(implementationStatus.feature).toBe("test-feature");
    expect(implementationStatus.removeOnSave).toBeFalse();
    cleanupBaselineStylesheet();
  });

  it("accepts boolean true config for auto-detect", () => {
    const conf = { implementationStatus: true };
    prepare(conf);
    const { implementationStatus } = conf;
    expect(implementationStatus.feature).toBeNull();
    expect(implementationStatus.removeOnSave).toBeFalse();
    cleanupBaselineStylesheet();
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

  it("ignores moved features in auto-detect", async () => {
    const ops = makeStandardOps({
      edDraftURI: "https://w3c.github.io/test-spec/",
      implementationStatus: {
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dd = doc.querySelector(".baseline-status");

    expect(dd).toBeTruthy();
    expect(dd.textContent).toContain("Widely available");
  });

  it("ignores split features in auto-detect", async () => {
    const ops = makeStandardOps({
      edDraftURI: "https://w3c.github.io/multi-spec/",
      implementationStatus: {
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const dd = doc.querySelector(".baseline-status");

    expect(dd).toBeTruthy();
    expect(dd.textContent).toContain("Newly available");
  });

  it("ignores moved features when looking up explicit feature ID", async () => {
    const ops = makeStandardOps({
      implementationStatus: {
        feature: "moved-feature",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const warnings = doc.respec.warnings.filter(
      warning => warning.plugin === "core/implementation-status"
    );

    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("No Baseline data found");
  });

  describe("loading state and accessibility", () => {
    it("removes loading class after render", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const dd = doc.querySelector(".baseline-status");

      expect(dd).toBeTruthy();
      expect(dd.classList.contains("baseline-status--loading")).toBeFalse();
      expect(dd.classList.contains("baseline-status--loaded")).toBeTrue();
    });

    it("removes aria-busy after render", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const dd = doc.querySelector(".baseline-status");

      expect(dd).toBeTruthy();
      expect(dd.hasAttribute("aria-busy")).toBeFalse();
    });

    it("populates the accessibility summary after render", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const summary = doc.querySelector(".baseline-a11y-summary");

      expect(summary).toBeTruthy();
      expect(summary.getAttribute("aria-live")).toBe("polite");
      expect(summary.getAttribute("aria-atomic")).toBe("true");
      expect(summary.textContent).toContain("Widely available");
      expect(summary.textContent).toContain("Supported in");
    });

    it("uses static dt label 'Browser support:'", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const dt = doc.querySelector(".baseline-title");

      expect(dt.textContent.trim()).toBe("Browser support:");
    });

    it("includes status label in the dd element", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const label = doc.querySelector(".baseline-status-label");

      expect(label).toBeTruthy();
      expect(label.textContent).toContain("Widely available");
    });

    it("adds preconnect link for browser logos", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const preconnect = doc.querySelector(
        'link[rel="preconnect"][href="https://www.w3.org"]'
      );

      expect(preconnect).toBeTruthy();
    });

    it("removes a11y summary span from exported document", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const exportedDoc = await getExportedDoc(doc);

      expect(exportedDoc.querySelector(".baseline-a11y-summary")).toBeNull();
    });

    it("removes loading classes from exported document", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const exportedDoc = await getExportedDoc(doc);
      const dd = exportedDoc.querySelector(".baseline-status");

      expect(dd.classList.contains("baseline-status--loading")).toBeFalse();
      expect(dd.classList.contains("baseline-status--loaded")).toBeFalse();
      expect(dd.hasAttribute("aria-busy")).toBeFalse();
    });

    it("changes 'More info' to 'Current browser support' in exported doc", async () => {
      const ops = makeStandardOps({
        implementationStatus: {
          feature: "test-feature",
          apiURL,
        },
      });
      const doc = await makeRSDoc(ops);
      const exportedDoc = await getExportedDoc(doc);
      const link = exportedDoc.querySelector(".baseline-more-info");

      expect(link.textContent).toBe("Current browser support");
      expect(link.getAttribute("aria-label")).toContain(
        "Current browser support for"
      );
    });
  });
});
