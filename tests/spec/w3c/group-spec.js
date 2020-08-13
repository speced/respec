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
    const conf = await getGroupConf({ group: "payments" });
    expect(conf.wg).toBe("Web Payments Working Group");
    expect(conf.wgId).toBe("83744");
    expect(conf.wgPatentURI).toBe(
      "https://www.w3.org/2004/01/pp-impl/83744/status"
    );
    expect(conf.wgURI).toBe("https://www.w3.org/Payments/WG/");
  });

  it("adds group details when a multiple groups are specified", async () => {
    const conf = await getGroupConf({ group: ["payments", "webapps"] });
    expect(conf.wg).toEqual([
      "Web Payments Working Group",
      "Web Applications Working Group",
    ]);
    expect(conf.wgId).toEqual([83744, 114929]);
    expect(conf.wgPatentURI).toEqual([
      "https://www.w3.org/2004/01/pp-impl/83744/status",
      "https://www.w3.org/2004/01/pp-impl/114929/status",
    ]);
    expect(conf.wgURI).toEqual([
      "https://www.w3.org/Payments/WG/",
      "https://www.w3.org/2019/webapps/",
    ]);
  });

  it("overrides superseded options", async () => {
    const inputConf = { group: "payments", wg: "foo", wgId: "1234" };
    const conf = await getGroupConf(inputConf);
    expect(conf.wg).not.toBe(inputConf.wg);
    expect(conf.wgId).not.toBe(inputConf.wgId);
    expect(conf.wgPatentURI).not.toBe(inputConf.wgPatentURI);
    expect(conf.wgURI).not.toBe(inputConf.wgURI);
  });

  it("fails if group name is not known, even if it looks right", async () => {
    const conf = await getGroupConf({ group: ["404", "webapps"] });
    expect(conf.wg).toEqual(["Web Applications Working Group"]);
    expect(conf.wgId).toEqual([114929]);
    expect(conf.wgPatentURI).toEqual([
      "https://www.w3.org/2004/01/pp-impl/114929/status",
    ]);
    expect(conf.wgURI).toEqual(["https://www.w3.org/2019/webapps/"]);
  });
});
