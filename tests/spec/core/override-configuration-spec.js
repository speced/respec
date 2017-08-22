"use strict";
describe("Core — Override Configuration", () => {
  afterAll(flushIframes);
  const simpleURL = new URL("./spec/core/simple.html", document.location);
  it("overrides a simple string setting and decodes URL key/values strings correctly", done => {
    const url = new URL(simpleURL.href);
    url.searchParams.set("specStatus", "RSCND");
    url.searchParams.set("previousMaturity", "REC");
    url.searchParams.set("previousPublishDate", "1994-03-01");
    url.searchParams.set(
      "additionalCopyrightHolders",
      "Internet Engineering Task Force"
    );
    const test = doc => {
      const { respecConfig: conf } = doc.defaultView;
      const { textContent } = doc.querySelector(".head h2");
      expect(textContent).toMatch(/W3C Rescinded Recommendation/);
      const month = conf.previousPublishDate.getUTCMonth();
      expect(month).toEqual(2);
      const { previousMaturity } = conf;
      expect(previousMaturity).toEqual("REC");
      const copyrightText = doc.querySelector(".copyright").textContent;
      expect(copyrightText).toMatch(/Internet Engineering Task Force/);
      done();
    };
    makeRSDoc(makeStandardOps(), test, url);
  });
});
