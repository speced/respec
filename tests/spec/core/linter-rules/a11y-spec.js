"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../../SpecHelper.js";

describe("Core — a11y", () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL *= 2;
  });
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL /= 2;
    flushIframes();
  });

  const body = `
    <section>
      <h2>Test</h2>
      <img
        id="image-alt-1"
        src="https://www.w3.org/StyleSheets/TR/2021/logos/W3C"
      />
      <img
        id="image-alt-2"
        src="https://www.w3.org/StyleSheets/TR/2021/logos/W3C"
        alt="W3C Logo"
      />
    </section>
  `;

  it("does nothing if not configured", async () => {
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const offendingElements = doc.querySelectorAll(".respec-offending-element");
    expect(offendingElements).toHaveSize(0);
  });

  it("does nothing if disabled", async () => {
    const ops = makeStandardOps({ lint: { a11y: false } }, body);
    const doc = await makeRSDoc(ops);
    const offendingElements = doc.querySelectorAll(".respec-offending-element");
    expect(offendingElements).toHaveSize(0);
  });

  it("runs default tests if enabled", async () => {
    const ops = makeStandardOps({ lint: { a11y: true } }, body);
    const doc = await makeRSDoc(ops);
    const offendingElements = doc.querySelectorAll(".respec-offending-element");

    expect(offendingElements).toHaveSize(1);
    expect(offendingElements[0].id).toBe("image-alt-1");
    expect(offendingElements[0].title).toContain("a11y/image-alt");
  });

  it("allows overriding options", async () => {
    const a11yOptions = {
      runOnly: ["image-alt", "landmark-one-main"],
    };
    const ops = makeStandardOps({ lint: { a11y: a11yOptions } }, body);
    const doc = await makeRSDoc(ops);

    const offendingElements = doc.querySelectorAll(".respec-offending-element");
    expect(offendingElements).toHaveSize(2);
    expect(offendingElements[0].id).toContain("a11y-landmark-one-main");
    expect(offendingElements[0].localName).toBe("html");
    expect(offendingElements[1].id).toBe("image-alt-1");

    const warnings = doc.respec.warnings.filter(
      warn => warn.plugin === "core/linter-rules/a11y"
    );
    expect(warnings).toHaveSize(2);
    const [imageAltWarning, landmarkWarning] = warnings;
    expect(imageAltWarning.message).toContain("image-alt");
    expect(imageAltWarning.elements).toHaveSize(1);
    expect(imageAltWarning.elements[0].id).toBe("image-alt-1");
    expect(landmarkWarning.message).toContain("landmark-one-main");
  });

  it("allows overriding rules option", async () => {
    const a11yOptions = {
      rules: {
        "landmark-one-main": { enabled: true },
        "image-alt": { enabled: false },
      },
    };
    const ops = makeStandardOps({ lint: { a11y: a11yOptions } }, body);
    const doc = await makeRSDoc(ops);

    const offendingElements = doc.querySelectorAll(".respec-offending-element");
    expect(offendingElements).toHaveSize(1);
    expect(offendingElements[0].id).toContain("a11y-landmark-one-main");
    expect(offendingElements[0].localName).toBe("html");

    const warnings = doc.respec.warnings.filter(
      warn => warn.plugin === "core/linter-rules/a11y"
    );
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("landmark-one-main");
  });
});
