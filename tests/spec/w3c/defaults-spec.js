"use strict";

import { flushIframes, makeDefaultBody, makeRSDoc } from "../SpecHelper.js";

describe("W3C — Defaults", () => {
  afterAll(flushIframes);
  it("sets sensible defaults for w3c specs", async () => {
    const ops = {
      config: { editors: [{ name: "foo" }], specStatus: "base" },
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    const rsConf = doc.defaultView.respecConfig;
    expect(rsConf.lint).toEqual({
      "privsec-section": false,
      "no-headingless-sections": true,
      "no-http-props": true,
      "no-unused-vars": false,
      "local-refs-exist": true,
      "check-punctuation": false,
      "check-internal-slots": false,
      "check-charset": false,
      "wpt-tests-exist": false,
      "no-unused-dfns": "warn",
      "required-sections": true,
      a11y: false,
    });
    expect(rsConf.highlightVars).toBe(true);
    expect(rsConf.license).toBe("w3c-software-doc");
    expect(rsConf.specStatus).toBe("base");
    expect(rsConf.addSectionLinks).toBe(true);
    expect(rsConf.xref).toBe(true);
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
          "check-internal-slots": true,
          "no-unused-dfns": "error",
          "required-sections": "warn",
        },
        license: "c0",
        specStatus: "ED",
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
      "no-unused-vars": false,
      "local-refs-exist": true,
      "check-punctuation": false,
      "fake-linter-rule": "foo",
      "check-internal-slots": true,
      "check-charset": false,
      "wpt-tests-exist": false,
      "no-unused-dfns": "error",
      "required-sections": "warn",
      a11y: false,
    });
    expect(rsConf.highlightVars).toBe(false);
    expect(rsConf.license).toBe("c0");
    expect(rsConf.specStatus).toBe("ED");
  });
});
