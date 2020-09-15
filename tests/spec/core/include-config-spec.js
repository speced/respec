"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
} from "../SpecHelper.js";

describe("Core — Include config as JSON", () => {
  afterAll(flushIframes);
  let ops;
  beforeAll(() => {
    ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    ops.config.publishDate = "1999-12-11";
  });
  it("should have a script tag with the correct attributes", async () => {
    const doc = await makeRSDoc(ops);
    const script = doc.getElementById("initialUserConfig");
    expect(script.tagName).toBe("SCRIPT");
    expect(script.id).toBe("initialUserConfig");
    expect(script.type).toBe("application/json");
  });
  it("includes config options from query parameters", async () => {
    const doc = await makeRSDoc(
      ops,
      "spec/core/simple.html?foo=bar&bar=123&baz=[1,2,3]"
    );
    const conf = JSON.parse(
      doc.getElementById("initialUserConfig").textContent
    );
    expect(conf.foo).toBe("bar");
    expect(conf.bar).toBe(123);
    expect(conf.baz).toHaveSize(3);
    expect(conf.baz).toEqual([1, 2, 3]);
  });
  it("should have the same content for the config and the script's text", async () => {
    const expectedObj = Object.assign(makeBasicConfig(), {
      publishDate: "1999-12-11",
      publishISODate: "1999-12-11T00:00:00.000Z",
      generatedSubtitle: "Editor's Draft 11 December 1999",
    });
    const expected = JSON.stringify(expectedObj, null, 2);
    const doc = await makeRSDoc(ops);
    const text = doc.getElementById("initialUserConfig").innerHTML;
    expect(text).toBe(expected);
  });
  it("excludes security sensitive members", async () => {
    const ops = {
      config: {
        specStatus: "unofficial",
        githubToken: "fail",
        githubUser: "fail",
      },
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    const obj = JSON.parse(doc.getElementById("initialUserConfig").innerHTML);
    expect(obj.specStatus).toBe("unofficial");
    expect(obj.githubToken).toBeUndefined();
    expect(obj.githubUser).toBeUndefined();
  });
});
