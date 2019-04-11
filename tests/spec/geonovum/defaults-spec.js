"use strict";

import { flushIframes, makeDefaultBody, makeRSDoc } from "../SpecHelper.js";

describe("Geonovum — Defaults", () => {
  afterAll(flushIframes);
  it("sets sensible defaults for geonovum specs", async () => {
    const ops = {
      config: { editors: [{ name: "foo" }] },
      body: makeDefaultBody(),
      profile: "profile-geonovum",
    };
    const doc = await makeRSDoc(ops);
    const rsConf = doc.defaultView.respecConfig;
    expect(rsConf.lint).toEqual({
      "no-headingless-sections": true,
      "privsec-section": true,
      "no-http-props": true,
      "local-refs-exist": true,
      "check-punctuation": false,
      "check-internal-slots": false,
      "check-charset": false,
    });
    expect(rsConf.highlightVars).toEqual(true);
    expect(rsConf.license).toEqual("cc-by");
    expect(rsConf.specStatus).toEqual("GN-BASIS");
    expect(rsConf.addSectionLinks).toBe(true);
  });

  it("allows geonovum defaults to be overridden", async () => {
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
        },
        license: "cc-by-nd",
        specStatus: "GN-WV",
        shortName: "foo",
        highlightVars: false,
      },
      body: makeDefaultBody(),
      profile: "profile-geonovum",
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
      "check-internal-slots": true,
      "check-charset": false,
    });
    expect(rsConf.highlightVars).toEqual(false);
    expect(rsConf.license).toEqual("cc-by-nd");
    expect(rsConf.specStatus).toEqual("GN-WV");
  });
});
