"use strict";

import { cgbgStatus, tagStatus } from "../../../src/w3c/headers.js";

import {
  flushIframes,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../SpecHelper.js";

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

  it("doesn't show the W3C logo if no group or an invalid group is specified", async () => {
    const ops = makeStandardOps({ specStatus: "WD" });
    const docNoGroup = await makeRSDoc(ops);
    expect(docNoGroup.querySelector("img[alt='W3C']")).toBeNull();
  });

  it("doesn't show the W3C logo an unknown group is specified", async () => {
    const ops = makeStandardOps({
      specStatus: "WD",
      group: "not a real group",
    });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("img[alt='W3C']")).toBeNull();
  });

  it("shows the W3C logo if a valid group and specStatus is specified", async () => {
    const ops = makeStandardOps({
      specStatus: "WD",
      group: "css",
    });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("img[alt='W3C']")).not.toBeNull();
  });

  it("allows W3C TAG to show logos", async () => {
    for (const specStatus of tagStatus) {
      const ops = makeStandardOps({
        specStatus,
        group: "tag",
      });
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector("img[alt='W3C']")).not.toBeNull();
    }
  });

  it("doesn't allow the W3C TAG to show logo when status is from another group type", async () => {
    for (const specStatus of cgbgStatus) {
      const ops = makeStandardOps({
        specStatus,
        group: "tag",
      });
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector("img[alt='W3C']")).toBeNull();
    }
  });

  it("warns when using a W3C specStatus, but no group is configured and defaults to 'base'", async () => {
    const warningFilter = warningFilters.filter("w3c/defaults");
    const ops = makeStandardOps({ specStatus: "WD" });
    const doc = await makeRSDoc(ops);
    const warnings = warningFilter(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain(
      "Document is not associated with a [W3C group]"
    );
    const config = doc.defaultView.respecConfig;
    expect(config.specStatus).toBe("base");
  });

  it("warns when specStatus is missing, and defaults to 'base' for the specStatus", async () => {
    const warningFilter = warningFilters.filter("w3c/defaults");
    const ops = makeStandardOps({
      config: {
        editors: [{ name: "foo" }],
      },
      specStatus: "",
    });
    const doc = await makeRSDoc(ops);
    const warnings = warningFilter(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain(
      "#specStatus) configuration option is required"
    );
    const config = doc.defaultView.respecConfig;
    expect(config.specStatus).toBe("base");
  });
});
