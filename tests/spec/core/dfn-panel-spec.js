"use strict";
import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — dfnPanel", () => {
  afterAll(flushIframes);

  const body = `
    <section>
      <h2>top level heading</h2>
      <p><dfn>many</dfn>, <dfn>one</dfn>, <dfn>zero</dfn> references.</p>
      <p>[=many=] [=many=] [=one=]</p>
      <section>
        <h3>nested section heading</h3>
        <p>[=many=] [=many=]</p>
      </section>
      <p>[= many =]</p>
    </section>
  `;
  const ops = makeStandardOps(null, body);

  describe("dfnPanel state", () => {
    it("opens panel on dfn click", async () => {
      const doc = await makeRSDoc(ops);
      expect(doc.getElementById("dfn-panel")).toBeNull();
      const dfn = doc.querySelector("dfn");
      dfn.click();
      const panel = doc.getElementById("dfn-panel");
      expect(panel).not.toBeNull();
      expect(panel.classList).not.toContain("docked");
    });

    it("closes open panel on external click", async () => {
      const doc = await makeRSDoc(ops);
      doc.querySelector("dfn").click();
      let panel = doc.getElementById("dfn-panel");
      expect(panel).not.toBeNull();
      doc.body.click();
      panel = doc.getElementById("dfn-panel");
      expect(panel).toBeNull();
    });

    it("closes open panel on self link click", async () => {
      const doc = await makeRSDoc(ops);
      doc.querySelector("dfn").click();
      const panel = doc.getElementById("dfn-panel");
      expect(panel).not.toBeNull();
      panel.querySelector("a.self-link").click();
      expect(doc.getElementById("dfn-panel")).toBeNull();
    });

    it("does not close panel on panel click", async () => {
      const doc = await makeRSDoc(ops);
      doc.querySelector("dfn").click();
      const panel = doc.getElementById("dfn-panel");

      panel.click();
      expect(doc.getElementById("dfn-panel")).toBe(panel);
    });

    it("docks open panel on reference click", async () => {
      const doc = await makeRSDoc(ops);
      doc.querySelector("dfn").click();
      const panel = doc.getElementById("dfn-panel");
      expect(panel.classList).not.toContain("docked");
      panel.querySelector("ul a").click();
      expect(panel.classList).toContain("docked");
    });

    it("closes docked panel on panel click", async () => {
      const doc = await makeRSDoc(ops);
      doc.querySelector("dfn").click();
      const panel = doc.getElementById("dfn-panel");
      panel.querySelector("ul a").click();
      expect(panel.classList).toContain("docked");

      panel.click();
      expect(doc.getElementById("dfn-panel")).toBeNull();
    });

    it("opens a new panel if another dfn is clicked", async () => {
      const doc = await makeRSDoc(ops);
      expect(doc.getElementById("dfn-panel")).toBeNull();
      const [dfnMany, dfnOne] = doc.querySelectorAll("dfn");

      dfnMany.click();
      let panel = doc.getElementById("dfn-panel");
      expect(panel.querySelector("a.self-link").hash).toBe("#dfn-many");

      dfnOne.click();
      expect(doc.querySelectorAll(".dfn-panel").length).toBe(1);
      expect(doc.getElementById("dfn-panel")).not.toBe(panel);
      panel = doc.getElementById("dfn-panel");
      expect(panel.querySelector("a.self-link").hash).toBe("#dfn-one");
    });
  });

  it("renders only self link to dfn if no local references", async () => {
    const doc = await makeRSDoc(ops);
    const dfnZero = doc.querySelector("dfn#dfn-zero");
    dfnZero.click();
    const panel = doc.getElementById("dfn-panel");

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-zero");

    const referenceSection = panel.querySelector("ul");
    expect(referenceSection).not.toBeNull();
    expect(referenceSection.textContent.trim()).toBe(
      "Not referenced in this document."
    );
  });

  it("renders reference with relevant title", async () => {
    const doc = await makeRSDoc(ops);
    const dfnOne = doc.querySelector("dfn#dfn-one");
    dfnOne.click();
    const panel = doc.getElementById("dfn-panel");

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-one");

    const referenceHeading = panel.querySelectorAll("b")[1];
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll("ul li");
    expect(referenceListItems.length).toBe(1);

    const references = panel.querySelectorAll("ul li a");
    expect(references.length).toBe(1);
    expect(references[0].textContent).toBe("1. top level heading");
    expect(references[0].hash).toBe("#ref-for-dfn-one-1");
  });

  it("renders multiple references with relevant titles", async () => {
    const doc = await makeRSDoc(ops);
    const dfnMany = doc.querySelector("dfn#dfn-many");
    dfnMany.click();
    const panel = doc.getElementById("dfn-panel");

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-many");

    const referenceHeading = panel.querySelectorAll("b")[1];
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll("ul li");
    expect(referenceListItems.length).toBe(2);
    const [item1, item2] = referenceListItems;

    const item1Links = item1.querySelectorAll("a");
    expect(item1Links.length).toBe(3);
    expect(item1Links[0].textContent).toBe("1. top level heading");
    expect(item1Links[0].hash).toBe("#ref-for-dfn-many-1");
    expect(item1Links[1].textContent).toBe("(2)");
    expect(item1Links[1].hash).toBe("#ref-for-dfn-many-2");
    expect(item1Links[2].textContent).toBe("(3)");
    expect(item1Links[2].hash).toBe("#ref-for-dfn-many-5");
    expect(item1.textContent).toBe("1. top level heading (2) (3) ");

    const item2Links = item2.querySelectorAll("a");
    expect(item2Links.length).toBe(2);
    expect(item2Links[0].textContent).toBe("1.1 nested section heading");
    expect(item2Links[0].hash).toBe("#ref-for-dfn-many-3");
    expect(item2Links[1].textContent).toBe("(2)");
    expect(item2Links[1].hash).toBe("#ref-for-dfn-many-4");
    expect(item2.textContent).toBe("1.1 nested section heading (2) ");
  });
});
