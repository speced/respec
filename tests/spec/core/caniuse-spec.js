"use strict";

import {
  flushIframes,
  getExportedDoc,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

import { BROWSERS } from "../../../src/core/caniuse.js";

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
    const defaultBrowsers = new Set(BROWSERS.keys());
    defaultBrowsers.delete("op_mob");
    defaultBrowsers.delete("opera");

    const doc = await makeRSDoc(ops);
    const { caniuse } = doc.defaultView.respecConfig;

    expect(caniuse.feature).toBe("FEATURE");
    expect(caniuse.browsers).toEqual([...defaultBrowsers]);
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
      "Almost supported (aka Partial support) since Firefox version 66."
    );
    expect(cell.getAttribute("aria-label")).toBe(
      "FEATURE is almost supported (aka Partial support) since Firefox version 66 on desktop."
    );

    // The logo images (sorted by deskop/mobile)
    const [firefox, chrome, safari] =
      stats.querySelectorAll(".caniuse-browser");
    expect(firefox.src).toContain("firefox.svg");
    expect(chrome.src).toContain("chrome.svg");
    expect(safari.src).toContain("safari-ios.svg");

    expect(firefox.width).toBe(20);
    expect(firefox.height).toBe(20);
    expect(chrome.alt).toBe("Android Chrome logo");

    // The version numbers
    const [firefoxVersion, chromeVersion, safariVersion] =
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

  it("does not includes caniuse by default in exported documents", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
      },
    });
    const exportedDoc = await getExportedDoc(await makeRSDoc(ops));
    // make sure there is a style element with id caniuse-stylesheet
    expect(exportedDoc.querySelector("#caniuse-stylesheet")).toBeFalsy();
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

  it("loads every BROWSER logo from www.w3.org", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "payment-request",
        browsers: [...BROWSERS.keys()],
      },
    });
    const doc = await makeRSDoc(ops);
    const images = [
      ...doc.querySelectorAll(
        `.caniuse-stats img.caniuse-browser[src^='https://www.w3.org/assets/logos/browser-logos/']`
      ),
    ];
    expect(images).toHaveSize(BROWSERS.size);
    const promises = images
      .filter(img => !img.complete)
      .map(img => {
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => {
            reject(new Error(`Image failed to load: ${img.src}`));
          };
        });
      });
    await Promise.all(promises);
    expect(images.every(img => img.complete)).toBeTruthy();
  });

  it("visually groups results into desktop and mobile", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    const stats = doc.querySelector(".caniuse-stats");
    const groups = stats.querySelectorAll(".caniuse-group");
    expect(groups).toHaveSize(2);
    const [desktop, mobile] = groups;
    const mobileBrowsers = mobile.querySelectorAll(".caniuse-browser");
    expect(mobileBrowsers).toHaveSize(2);
    const [chrome, safari] = mobileBrowsers;
    expect(chrome.src).toContain("chrome.svg");
    expect(safari.src).toContain("safari-ios.svg");
    const desktopBrowsers = desktop.querySelectorAll(".caniuse-browser");
    expect(desktopBrowsers).toHaveSize(1);
    const [firefox] = desktopBrowsers;
    expect(firefox.src).toContain("firefox.svg");
    expect(desktop.querySelector(".caniuse-type > span").textContent).toBe(
      "desktop"
    );
    expect(mobile.querySelector(".caniuse-type > span").textContent).toBe(
      "mobile"
    );
  });
});
