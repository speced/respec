"use strict";
describe("Core — l10n", () => {
  afterAll(flushIframes);
  const body = makeDefaultBody();
  const config = makeBasicConfig();

  it("uses en and ltr", async () => {
    const ops = {
      config,
      body,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.documentElement.lang).toEqual("en");
    expect(doc.documentElement.dir).toEqual("ltr");
  });

  it("shouldn't override existing dir", async () => {
    const ops = {
      config,
      htmlAttrs: {
        dir: "rtl",
      },
      body,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.documentElement.lang).toEqual("en");
    expect(doc.documentElement.dir).toEqual("rtl");
  });

  it("shouldn't override existing lang and not set dir", async () => {
    const ops = {
      config,
      htmlAttrs: {
        lang: "fr",
      },
      body,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.documentElement.lang).toEqual("fr");
    expect(doc.documentElement.dir).toEqual("");
  });
});
