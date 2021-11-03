"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Override Configuration", () => {
  afterAll(flushIframes);
  const simpleURL = new URL("./spec/core/simple.html", document.location);
  it("overrides a simple string setting and decodes URL key/values strings correctly", async () => {
    const url = new URL(simpleURL.href);
    url.searchParams.set("specStatus", "RSCND");
    url.searchParams.set("previousMaturity", "REC");
    url.searchParams.set("previousPublishDate", "1994-03-01");
    url.searchParams.set(
      "additionalCopyrightHolders",
      "Internet Engineering Task Force"
    );
    const doc = await makeRSDoc(makeStandardOps(), url);
    const { respecConfig: conf } = doc.defaultView;
    const { textContent } = doc.querySelector(".head p");
    expect(textContent).toContain("W3C Rescinded Recommendation");
    const month = conf.previousPublishDate.getUTCMonth();
    expect(month).toBe(2);
    const { previousMaturity } = conf;
    expect(previousMaturity).toBe("REC");
    const copyrightText = doc.querySelector(".copyright").textContent;
    expect(copyrightText).toContain("Internet Engineering Task Force");
  });
});
