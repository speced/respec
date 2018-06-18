"use strict";
describe("W3C — Defaults", () => {
  afterAll(flushIframes);
  it("sets sensible defaults for w3c specs", async () => {
    const ops = {
      config: { editors: [{ name: "foo" }] },
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    const rsConf = doc.defaultView.respecConfig;
    expect(rsConf.lint).toEqual({
      "no-headingless-sections": true,
      "privsec-section": true,
      "no-http-props": true,
      "local-refs-exist": false,
      "check-punctuation": false,
    });
    expect(rsConf.highlightVars).toEqual(true);
    expect(rsConf.license).toEqual("w3c-software-doc");
    expect(rsConf.specStatus).toEqual("base");
  });

  it("allows w3c defaults to be overridden", async () => {
    const ops = {
      config: {
        editors: [{ name: "foo" }],
        lint: {
          "privsec-section": false,
          "no-http-props": false,
          "local-refs-exist": true,
          "check-punctuation": false,
          "fake-linter-rule": "foo",
        },
        license: "c0",
        specStatus: "unofficial",
        shortName: "foo",
        highlightVars: false,
      },
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    const rsConf = doc.defaultView.respecConfig;
    expect(rsConf.lint).toEqual({
      "no-headingless-sections": true,
      "privsec-section": false,
      "no-http-props": false,
      "local-refs-exist": true,
      "check-punctuation": false,
      "fake-linter-rule": "foo",
    });
    expect(rsConf.highlightVars).toEqual(false);
    expect(rsConf.license).toEqual("c0");
    expect(rsConf.specStatus).toEqual("unofficial");
  });
});
