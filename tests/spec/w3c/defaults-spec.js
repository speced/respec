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
    expect(rsConf.processVersion).toEqual(2017);
    expect(rsConf.lint).toEqual({
      "no-headingless-sections": true,
      "privsec-section": true,
      "no-http-props": true,
    });
    expect(rsConf.doRDFa).toBe(false);
    expect(rsConf.license).toEqual("w3c-software-doc");
    expect(rsConf.specStatus).toEqual("base");
  });

  it("allows w3c defaults to be overriden", async () => {
    const ops = {
      config: {
        editors: [{ name: "foo" }],
        processVersion: 2020,
        lint: {
          "no-headingless-sections": false,
          "privsec-section": false,
          "no-http-props": false,
          "fake-linter-rule": "foo",
        },
        doRDFa: true,
        license: "c0",
        specStatus: "unofficial",
        shortName: "foo",
      },
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    const rsConf = doc.defaultView.respecConfig;
    expect(rsConf.processVersion).toEqual(2020);
    expect(rsConf.lint).toEqual({
      "no-headingless-sections": false,
      "privsec-section": false,
      "no-http-props": false,
      "fake-linter-rule": "foo",
    });
    expect(rsConf.doRDFa).toBe(true);
    expect(rsConf.license).toEqual("c0");
    expect(rsConf.specStatus).toEqual("unofficial");
  });
});
