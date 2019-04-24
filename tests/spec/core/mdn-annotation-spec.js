import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - MDN Annotation", () => {
  afterAll(flushIframes);
  let doc;
  beforeAll(async () => {
    const ops = makeStandardOps({
      mdn: {
        baseJsonPath: `${window.location.origin}/tests/data/mdn-annotation/`,
      },
      shortName: "payment-request",
    });
    doc = await makeRSDoc(ops, "spec/core/mdn-annotation.html");
  });

  it("should attach MDNbox if there exists ID in the spec", () => {
    const mdnBox = doc.querySelector("aside.mdn");
    expect(mdnBox).toBeTruthy();
  });

  it("should attach MDNbox to the closest <section>", () => {
    const paymentInterfaceSection = doc.getElementById(
      "paymentrequest-interface"
    );
    const {
      previousElementSibling: { classList, tagName },
    } = paymentInterfaceSection;
    expect(tagName).toBe("ASIDE");
    expect(classList).toContain("mdn");
  });

  it("should attach MDNbox with browser list", () => {
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

  it("should display correct browser support info", () => {
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

  it("should not attach MDNbox if ID is not in the spec", () => {
    const {
      previousElementSibling: { classList },
    } = doc.getElementById("not-in-spec");
    expect(classList).not.toContain("mdn");
  });

  it("should allow overriding defaults", () => {
    const {
      previousElementSibling: { classList, tagName },
    } = doc.getElementById("custom-method");
    expect(tagName).toBe("ASIDE");
    expect(classList).toContain("mdn");
  });
});
