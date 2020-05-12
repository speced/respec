import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - MDN Annotation", () => {
  afterAll(flushIframes);

  const baseJsonPath = `${window.location.origin}/tests/data/mdn-annotation/`;
  let doc;
  beforeAll(async () => {
    const ops = makeStandardOps({
      mdn: { baseJsonPath },
      shortName: "payment-request",
    });
    doc = await makeRSDoc(ops, "spec/core/mdn-annotation.html");
  });

  describe("key", () => {
    const getMdnBox = doc =>
      doc.getElementById("paymentrequest-interface").previousElementSibling;

    it("does nothing if neither shortName or key are providded", async () => {
      const ops = makeStandardOps({ mdn: { baseJsonPath }, shortName: null });
      const doc = await makeRSDoc(ops, "spec/core/mdn-annotation.html");
      expect(getMdnBox(doc).matches("aside.mdn")).toBeFalse();
    });

    it("prefers `mdn.key` over shortName", async () => {
      const ops = makeStandardOps({
        mdn: { baseJsonPath, key: "payment-request" },
        shortName: "whatever",
      });
      const doc = await makeRSDoc(ops, "spec/core/mdn-annotation.html");
      expect(getMdnBox(doc).matches("aside.mdn")).toBeTrue();
    });

    it("supports mdn to be a string", async () => {
      const ops = makeStandardOps({
        mdn: "payment-request",
        shortName: null,
      });
      const doc = await makeRSDoc(ops, "spec/core/mdn-annotation.html");
      expect(getMdnBox(doc).matches("aside.mdn")).toBeTrue();
    });
  });

  it("attaches MDNbox if there exists ID in the spec", () => {
    const mdnBox = doc.querySelector("aside.mdn");
    expect(mdnBox).toBeTruthy();
  });

  it("attaches MDNbox to the closest <section>", () => {
    const paymentInterfaceSection = doc.getElementById(
      "paymentrequest-interface"
    );
    const {
      previousElementSibling: { classList, tagName },
    } = paymentInterfaceSection;
    expect(tagName).toBe("ASIDE");
    expect(classList).toContain("mdn");
  });

  it("attaches MDNbox with browser list", () => {
    const paymentInterfaceSection = doc.getElementById(
      "paymentrequest-interface"
    );
    const { previousElementSibling } = paymentInterfaceSection;
    const mdnSupport = previousElementSibling.querySelector("p.mdnsupport");
    expect(mdnSupport).toBeTruthy();
    const browserRows = previousElementSibling.querySelectorAll(
      "p.mdnsupport > span"
    );
    expect(browserRows.length).toBeGreaterThan(0);
  });

  it("displays correct browser support info", () => {
    const paymentInterfaceSection = doc.getElementById(
      "paymentrequest-interface"
    );
    const { previousElementSibling } = paymentInterfaceSection;
    const firstBrowserRow = previousElementSibling.querySelector(
      "p.mdnsupport > span"
    );
    expect(firstBrowserRow.classList).toContain("chrome");
    const versionSpan = firstBrowserRow.querySelector("span.version");
    expect(versionSpan.textContent).toBe("61+");
  });

  it("doesn't attach MDNbox if ID is not in the spec", () => {
    const {
      previousElementSibling: { classList },
    } = doc.getElementById("not-in-spec");
    expect(classList).not.toContain("mdn");
  });

  it("allows overriding defaults", () => {
    const {
      previousElementSibling: { classList, tagName },
    } = doc.getElementById("custom-method");
    expect(tagName).toBe("ASIDE");
    expect(classList).toContain("mdn");
  });
});
