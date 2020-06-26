"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("W3C — Group", () => {
  afterAll(flushIframes);

  async function getGroupConf(config) {
    const ops = makeStandardOps(config);
    const doc = await makeRSDoc(ops);
    const { wg, wgId, wgPatentURI, wgURI } = doc.defaultView.respecConfig;
    return { wg, wgId, wgPatentURI, wgURI };
  }

  it("adds group details when a single group is specified", async () => {
    const { wg, wgId, wgPatentURI, wgURI } = await getGroupConf({
      group: "payments",
    });
    expect(wg).toBe("Web Payments Working Group");
    expect(wgId).toBe("83744");
    expect(wgPatentURI).toBe("https://www.w3.org/2004/01/pp-impl/83744/status");
    expect(wgURI).toBe("https://www.w3.org/Payments/WG/");
  });

  it("adds group details when a multiple groups are specified", async () => {
    const { wg, wgId, wgPatentURI, wgURI } = await getGroupConf({
      group: ["payments", "webapps"],
    });
    expect(wg).toEqual([
      "Web Payments Working Group",
      "Web Applications Working Group",
    ]);
    expect(wgId).toEqual([83744, 114929]);
    expect(wgPatentURI).toEqual([
      "https://www.w3.org/2004/01/pp-impl/83744/status",
      "https://www.w3.org/2004/01/pp-impl/114929/status",
    ]);
    expect(wgURI).toEqual([
      "https://www.w3.org/Payments/WG/",
      "https://www.w3.org/2019/webapps/",
    ]);
  });

  it("overrides superseded options", async () => {
    const inputConf = { group: "payments", wg: "foo", wgId: "1234" };
    const outputConf = await getGroupConf(inputConf);
    expect(outputConf.wg).not.toBe(inputConf.wg);
    expect(outputConf.wgId).not.toBe(inputConf.wgId);
    expect(outputConf.wgPatentURI).not.toBe(inputConf.wgPatentURI);
    expect(outputConf.wgURI).not.toBe(inputConf.wgURI);
  });

  it("fails if invalid group name is specified", async () => {
    const { wg, wgId, wgPatentURI, wgURI } = await getGroupConf({
      group: ["404", "webapps"],
    });
    expect(wg).toEqual(["Web Applications Working Group"]);
    expect(wgId).toEqual([114929]);
    expect(wgPatentURI).toEqual([
      "https://www.w3.org/2004/01/pp-impl/114929/status",
    ]);
    expect(wgURI).toEqual(["https://www.w3.org/2019/webapps/"]);
  });
});
