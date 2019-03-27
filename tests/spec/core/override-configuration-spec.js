"use strict";
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
      // URL will perform encodeURIComponent automatically
      "Internet Engineering Task Force"
    );
    const doc = await makeRSDoc(makeStandardOps(), url);
    const { respecConfig: conf } = doc.defaultView;
    const { textContent } = doc.querySelector(".head h2");
    expect(textContent).toMatch(/W3C Rescinded Recommendation/);
    const month = conf.previousPublishDate.getUTCMonth();
    expect(month).toEqual(2);
    const { previousMaturity } = conf;
    expect(previousMaturity).toEqual("REC");
    const copyrightText = doc.querySelector(".copyright").textContent;
    expect(copyrightText).toMatch(/Internet Engineering Task Force/);
  });

  it("doesn't allow HTML tags", async () => {
    const url = new URL(simpleURL.href);
    url.searchParams.set(
      "additionalCopyrightHolders",
      // URL will perform encodeURIComponent automatically
      "<span id=\"xss-attempt\">Internet Engineering Task Force</span>"
    );
    const doc = await makeRSDoc(makeStandardOps(), url);
    const copyrightText = doc.querySelector(".copyright").textContent;
    // if the ID is in the textContent, the HTML must not have been parsed.
    expect(copyrightText).toMatch(/xss-attempt/);
  });
});
