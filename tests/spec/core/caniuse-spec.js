"use strict";

import {
  flushIframes,
  getExportedDoc,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Can I Use", () => {
  afterAll(flushIframes);
  const apiURL = `${window.location.origin}/tests/data/caniuse/FEATURE.json`;

  it("uses meaningful defaults", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const { caniuse } = doc.defaultView.respecConfig;

    expect(caniuse.feature).toBe("FEATURE");
    expect(caniuse.browsers).toEqual([]);
  });

  it("allows overriding defaults", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        browsers: ["firefox", "chrome"],
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const { caniuse } = doc.defaultView.respecConfig;

    expect(caniuse.feature).toBe("FEATURE");
    expect(caniuse.browsers).toEqual(["firefox", "chrome"]);
  });

  it("does nothing if caniuse is not enabled", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    const { caniuse } = doc.defaultView.respecConfig;

    expect(caniuse).toBeFalsy();
    expect(doc.querySelector(".caniuse-title")).toBeFalsy();
    expect(doc.querySelector(".caniuse-stats")).toBeFalsy();
  });

  it("shows caniuse.com link on error", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL: `${window.location.origin}/tests/data/caniuse/DOES-NOT-EXIST`,
      },
    });
    const doc = await makeRSDoc(ops);

    const link = doc.querySelector(".caniuse-stats a");
    expect(link.textContent).toBe("caniuse.com");
    expect(link.href).toBe("https://caniuse.com/FEATURE");
  });

  it("shows caniuse browser support table", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
        browsers: ["chrome", "firefox", "ios_saf", "opera"],
      },
    });
    const doc = await makeRSDoc(ops);
    const stats = doc.querySelector(".caniuse-stats");
    const cells = stats.querySelectorAll(".caniuse-cell");
    expect(cells).toHaveSize(4);

    // Check a cell
    const [cell] = cells;
    expect(cell.title).toBe(
      "Supported by default in Android Chrome version 78."
    );
    expect(cell.getAttribute("area-label")).toBe(
      "FEATURE is supported by default in Android Chrome version 78."
    );

    // The logo images
    const [chrome, firefox, safari] =
      stats.querySelectorAll(".caniuse-browser");
    expect(firefox.src).toContain("firefox.svg");
    expect(chrome.src).toContain("chrome.svg");
    expect(safari.src).toContain("safari-ios.svg");
    expect(firefox.width).toBe(20);
    expect(firefox.height).toBe(20);
    expect(chrome.alt).toBe("Android Chrome logo");

    // The version numbers
    const [chromeVersion, firefoxVersion, safariVersion] =
      stats.querySelectorAll(".browser-version");
    expect(chromeVersion.textContent).toBe("78");
    expect(firefoxVersion.textContent).toBe("66");
    expect(safariVersion.textContent).toBe("—");

    // More info link
    const moreInfoLink = cells.item(3);
    expect(moreInfoLink.href).toBe("https://caniuse.com/FEATURE");
    expect(moreInfoLink.textContent.trim()).toBe("More info");
  });

  it("removes irrelevant config for caniuse feature", async () => {
    const opsWithCaniuse = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    opsWithCaniuse.config.publishDate = "1999-12-11";
    opsWithCaniuse.config.caniuse = {
      feature: "FEATURE",
      apiURL,
    };
    const doc = await makeRSDoc(opsWithCaniuse);
    const text = doc.getElementById("initialUserConfig").textContent;
    const json = JSON.parse(text);
    expect(json.caniuse).toBe("FEATURE");
  });

  it("includes caniuse by default in exported documents", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
      },
    });
    const exportedDoc = await getExportedDoc(await makeRSDoc(ops));
    // make sure there is a style element with id caniuse-stylesheet
    const style = exportedDoc.querySelector("#caniuse-stylesheet");
    expect(style).toBeTruthy();
    // make sure that removeOnSave is not present in classlist
    expect(style.classList.contains("removeOnSave")).toBeFalsy();
  });

  it("includes caniuse cells via explicit removeOnSave being false", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
        removeOnSave: false,
      },
    });
    const exportedDoc = await getExportedDoc(await makeRSDoc(ops));
    // make sure there is a style element with id caniuse-stylesheet
    const style = exportedDoc.querySelector("#caniuse-stylesheet");
    expect(style).toBeTruthy();
    // make sure that removeOnSave is not present in classlist
    expect(style.classList.contains("removeOnSave")).toBeFalsy();
  });

  it("allows removing caniuse cells from exported docs via configuration", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
        removeOnSave: true,
      },
    });
    const exportedDoc = await getExportedDoc(await makeRSDoc(ops));
    // make sure there is a style element with id caniuse-stylesheet
    const style = exportedDoc.querySelector("#caniuse-stylesheet");
    expect(style).toBeNull();
    expect(exportedDoc.querySelector(".caniuse-browser")).toBeFalsy();
  });
});
