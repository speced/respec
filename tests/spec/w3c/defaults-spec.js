"use strict";

import { cgbgStatus, tagStatus } from "../../../src/w3c/headers.js";

import {
  errorFilters,
  flushIframes,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";
const errorsFilter = errorFilters.filter("w3c/defaults");

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
      "informative-dfn": "warn",
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
          "informative-dfn": false,
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
      "informative-dfn": false,
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
    expect(rsConf.specStatus).toBe("base");
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
    for (const specStatus of [...tagStatus, "ED"]) {
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
    const ops = makeStandardOps({ specStatus: "WD" });
    const doc = await makeRSDoc(ops);
    const errors = errorsFilter(doc);
    expect(errors).toHaveSize(1);
    expect(errors[0].message).toContain(
      "Document is not associated with a [W3C group]"
    );
    const config = doc.defaultView.respecConfig;
    expect(config.specStatus).toBe("base");
  });

  it("errors when specStatus is missing, and defaults to 'base' for the specStatus", async () => {
    const ops = makeStandardOps({
      editors: [{ name: "foo" }],
      specStatus: "",
    });
    const doc = await makeRSDoc(ops);
    const errors = errorsFilter(doc);
    expect(errors).toHaveSize(1);
    expect(errors[0].message).toContain(
      "#specStatus) configuration option is required"
    );
    const config = doc.defaultView.respecConfig;
    expect(config.specStatus).toBe("base");
  });

  it("requires that a group option be in the configuration", async () => {
    for (const specStatus of cgbgStatus) {
      const ops = makeStandardOps({
        shortName: "foo",
        specStatus,
        latestVersion: "somewhere",
      });
      const doc = await makeRSDoc(ops);
      const errors = errorsFilter(doc);
      expect(errors).withContext(specStatus).toHaveSize(1);
      expect(errors[0].message)
        .withContext(specStatus)
        .toContain("s not associated with a [W3C group](");
    }
  });
});
