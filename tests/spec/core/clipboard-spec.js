"use strict";

import {
  flushIframes,
  getExportedDoc,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core - Clipboard", () => {
  afterAll(flushIframes);

  const idlBody = `
    <section>
      <pre class="idl">
        [Exposed=Window]
        interface Foo {};
      </pre>
    </section>
  `;
  const cddlBody = `
    <section>
      <pre class="cddl">
        attire = "bow tie" / "necktie"
      </pre>
    </section>
  `;

  /** @param {Element} button */
  function layoutOf(button) {
    const { position, top, left, width, height } = getComputedStyle(button);
    return { position, top, left, width, height };
  }

  describe("in an exported document", () => {
    it("keeps the WebIDL copy button", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      expect(rsDoc.querySelectorAll("pre.idl .respec-button-copy-paste"))
        .withContext("live document")
        .toHaveSize(1);
      const doc = await getExportedDoc(rsDoc);
      expect(doc.querySelectorAll("pre.idl .respec-button-copy-paste"))
        .withContext("exported document")
        .toHaveSize(1);
    });

    it("keeps the CDDL copy button", async () => {
      const doc = await getExportedDoc(
        await makeRSDoc(makeStandardOps(null, cddlBody))
      );
      expect(doc.querySelectorAll("pre.cddl .respec-button-copy-paste"))
        .withContext("exported document")
        .toHaveSize(1);
    });

    it("lays out the copy button as the live document does", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const liveButton = rsDoc.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(liveButton).withContext("live document").not.toBeNull();
      const liveLayout = layoutOf(liveButton);
      const doc = await getExportedDoc(rsDoc);
      const savedButton = doc.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(savedButton).withContext("exported document").not.toBeNull();
      const savedLayout = layoutOf(savedButton);
      expect(liveLayout.position).toBe("absolute");
      expect(savedLayout).toEqual(liveLayout);
    });

    it("copies the IDL without its header", async () => {
      const doc = await getExportedDoc(
        await makeRSDoc(makeStandardOps(null, idlBody))
      );
      const copied = [];
      Object.defineProperty(doc.defaultView.navigator, "clipboard", {
        value: { writeText: text => copied.push(text) && Promise.resolve() },
        configurable: true,
      });
      const pre = doc.querySelector("pre.idl");
      const headerText = pre.querySelector(".idlHeader").textContent;
      expect(headerText).not.toBe("");
      const button = pre.querySelector(".respec-button-copy-paste");
      expect(button).withContext("exported document").not.toBeNull();

      button.click();

      expect(copied).toEqual([pre.textContent.slice(headerText.length)]);
      expect(copied[0]).toContain("interface Foo");
    });
  });
});
