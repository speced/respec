import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - Web Monetization", () => {
  afterAll(flushIframes);

  it("does not add monetization meta-tag if disabled", async () => {
    const ops = makeStandardOps({ monetization: false });
    const doc = await makeRSDoc(ops);

    const metaTag = doc.querySelector("meta[name='monetization']");
    expect(metaTag).toBeNull();
  });

  it("is enabled by default", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);

    const metaTag = doc.querySelector("meta[name='monetization']");
    expect(metaTag.content).toBe("$respec.org");
    expect(metaTag.classList).toContain("removeOnSave");
  });

  it("uses default payment pointer when set to `true`", async () => {
    const ops = makeStandardOps({ monetization: true });
    const doc = await makeRSDoc(ops);

    const metaTag = doc.querySelector("meta[name='monetization']");
    expect(metaTag.content).toBe("$respec.org");
    expect(metaTag.classList).toContain("removeOnSave");
  });

  it("allows changing payment pointer", async () => {
    const ops = makeStandardOps({ monetization: "$wallet.example.org" });
    const doc = await makeRSDoc(ops);

    const metaTag = doc.querySelector("meta[name='monetization']");
    expect(metaTag.content).toBe("$wallet.example.org");
    expect(metaTag.classList).toContain("removeOnSave");
  });

  describe("object-based configuration", () => {
    it("uses default payment pointer when using an empty object", async () => {
      const ops = makeStandardOps({ monetization: {} });
      const doc = await makeRSDoc(ops);

      const metaTag = doc.querySelector("meta[name='monetization']");
      expect(metaTag.content).toBe("$respec.org");
      expect(metaTag.classList).toContain("removeOnSave");
    });

    it("allows just setting removeOnSave", async () => {
      const ops = makeStandardOps({ monetization: { removeOnSave: false } });
      const doc = await makeRSDoc(ops);

      const metaTag = doc.querySelector("meta[name='monetization']");
      expect(metaTag.content).toBe("$respec.org");
      expect(metaTag.classList).not.toContain("removeOnSave");
    });

    it("allows changing payment pointer", async () => {
      const ops = makeStandardOps({
        monetization: {
          paymentPointer: "$wallet.example.org",
          removeOnSave: false,
        },
      });
      const doc = await makeRSDoc(ops);

      const metaTag = doc.querySelector("meta[name='monetization']");
      expect(metaTag.content).toBe("$wallet.example.org");
      expect(metaTag.classList).not.toContain("removeOnSave");
    });
  });
});
