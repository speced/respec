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
  const apiURL = `${window.location.origin}/tests/data/caniuse/FEATURE.html`;

  it("uses meaningful defaults", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    await doc.respec.ready;
    const { caniuse } = doc.defaultView.respecConfig;

    expect(caniuse.feature).toBe("FEATURE");
    expect(caniuse.versions).toBe(4);
    expect(caniuse.browsers).toBeUndefined(); // uses server default
  });

  it("allows overriding defaults", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        versions: 10,
        browsers: ["firefox", "chrome"],
        apiURL,
      },
    });
    const doc = await makeRSDoc(ops);
    await doc.respec.ready;
    const { caniuse } = doc.defaultView.respecConfig;

    expect(caniuse.feature).toBe("FEATURE");
    expect(caniuse.browsers).toEqual(["firefox", "chrome"]);
    expect(caniuse.versions).toBe(10);
  });

  it("does nothing if caniuse is not enabled", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    await doc.respec.ready;
    const { caniuse } = doc.defaultView.respecConfig;

    expect(caniuse).toBeFalsy();
    expect(doc.querySelector(".caniuse-title")).toBeFalsy();
    expect(doc.querySelector(".caniuse-stats")).toBeFalsy();
  });

  it("shows caniuse.com link on error", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL: "DOES-NOT-EXIST",
      },
    });
    const doc = await makeRSDoc(ops);
    await doc.respec.ready;

    const link = doc.querySelector(".caniuse-stats a");
    expect(link.textContent).toBe("caniuse.com");
    expect(link.href).toBe("https://caniuse.com/FEATURE");
  });

  it("shows caniuse browser support table", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL,
        browsers: ["firefox", "chrome", "opera"],
        versions: 5,
      },
    });
    const doc = await makeRSDoc(ops);
    await doc.respec.ready;

    const stats = doc.querySelector(".caniuse-stats");

    const moreInfoLink = stats.querySelector("a");
    expect(moreInfoLink.href).toBe("https://caniuse.com/FEATURE");
    expect(moreInfoLink.textContent.trim()).toBe("More info");

    const browsers = stats.querySelectorAll(".caniuse-browser");
    expect(browsers).toHaveSize(2); // not 3, as there is no data for "opera"
    const [firefox, chrome] = browsers;

    const chromeVersions = chrome.querySelectorAll("ul li.caniuse-cell");
    expect(chromeVersions).toHaveSize(2);

    const firefoxVersions = firefox.querySelectorAll("ul li.caniuse-cell");
    expect(firefoxVersions).toHaveSize(4);

    const firefoxButton = firefox.querySelector("button");
    expect(firefoxButton.textContent.trim()).toBe("Firefox 61");
    expect(firefoxButton.classList.value).toBe("caniuse-cell y");

    expect(firefoxVersions[0].textContent.trim()).toBe("60");
    expect(firefoxVersions[0].classList.value).toBe("caniuse-cell n d");
  });

  it("removes irrelevant config for caniuse feature", async () => {
    const expectedObj = Object.assign(makeBasicConfig(), {
      publishDate: "1999-12-11",
      publishISODate: "1999-12-11T00:00:00.000Z",
      generatedSubtitle: "Editor's Draft 11 December 1999",
      caniuse: "FEATURE",
    });
    const opsWithCaniuse = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    opsWithCaniuse.config.publishDate = "1999-12-11";
    opsWithCaniuse.config.caniuse = {
      feature: "FEATURE",
      apiURL: `${window.location.origin}/tests/data/caniuse/{FEATURE}.json`,
    };
    const doc = await makeRSDoc(opsWithCaniuse);
    await doc.respec.ready;

    const text = doc.getElementById("initialUserConfig").textContent;
    expect(JSON.parse(text)).toEqual(expectedObj);
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
