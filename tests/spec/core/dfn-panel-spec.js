"use strict";
import {
  flushIframes,
  getExportedDoc,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — dfnPanel", () => {
  afterAll(flushIframes);

  const getPanelId = dfnId => `dfn-panel-for-${dfnId}`;
  const body = `
    <section>
      <h2>top level heading</h2>
      <p><dfn data-export>many</dfn>, <dfn>one</dfn>, <dfn>zero</dfn> references.</p>
      <p>[=many=] [=many=] [=one=]</p>
      <section>
        <h3>nested section heading</h3>
        <p>[=many=] [=many=]</p>
      </section>
      <p>[= many =]</p>
    </section>
  `;
  const ops = makeStandardOps(null, body);

  describe("panel container", () => {
    const dfnId = "dfn-many";

    it("doesn't add a panel for legacy <dfn data-cite>", async () => {
      const body = `
        <p>
          <dfn id="legacy" data-cite="html#event">legacy link</dfn>
          <a>legacy link</a>
        </p>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const panel = doc.getElementById(getPanelId("legacy"));
      expect(panel).toBeNull();
    });

    it("has role and aria attributes", async () => {
      const doc = await makeRSDoc(ops);
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.getAttribute("role")).toBe("dialog");
      expect(panel.getAttribute("aria-modal")).toBe("true");
      expect(panel.getAttribute("aria-label")).toBe(
        "Links in this document to definition: many"
      );

      const permalink = panel.querySelector(".self-link");
      expect(permalink.getAttribute("aria-label")).toBe(
        "Permalink for definition: many. Activate to close this dialog."
      );
    });
  });

  describe("dfnPanel state", () => {
    const dfnId = "dfn-many";

    it("opens panel on dfn click", async () => {
      const doc = await makeRSDoc(ops);
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.hidden).toBeTrue();
      const dfn = doc.getElementById(dfnId);
      dfn.click();
      expect(panel.hidden).toBeFalse();
      expect(panel.classList).not.toContain("docked");
    });

    it("closes open panel on external click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.hidden).toBeFalse();
      doc.body.click();
      expect(panel.hidden).toBeTrue();
    });

    it("closes open panel on self link click", async () => {
      const doc = await makeRSDoc(ops);
      const panel = doc.getElementById(getPanelId(dfnId));
      doc.getElementById(dfnId).click();
      expect(panel.hidden).toBeFalse();
      panel.querySelector("a.self-link").click();
      expect(panel.hidden).toBeTrue();
    });

    it("does not close panel on panel click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.hidden).toBeFalse();
      panel.click();
      expect(panel.hidden).toBeFalse();
    });

    it("docks open panel on reference click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.classList).not.toContain("docked");
      panel.querySelector("ul a").click();
      expect(panel.classList).toContain("docked");
    });

    it("closes docked panel on panel click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      panel.querySelector("ul a").click();
      expect(panel.classList).toContain("docked");

      panel.click();
      expect(panel.hidden).toBeTrue();
    });

    it("opens a new panel if another dfn is clicked", async () => {
      const doc = await makeRSDoc(ops);
      const dfnManyId = "dfn-many";
      const dfnOneId = "dfn-one";
      const panelDfnMany = doc.getElementById(getPanelId(dfnManyId));
      const panelDfnOne = doc.getElementById(getPanelId(dfnOneId));

      const [dfnMany, dfnOne] = doc.querySelectorAll("dfn");

      dfnMany.click();
      expect(panelDfnMany.hidden).toBeFalse();
      expect(panelDfnMany.querySelector("a.self-link").hash).toBe("#dfn-many");

      dfnOne.click();
      expect(panelDfnMany.hidden).toBeTrue();
      expect(panelDfnOne.hidden).toBeFalse();
      expect(doc.querySelectorAll(".dfn-panel:not([hidden])")).toHaveSize(1);
      expect(panelDfnOne.querySelector("a.self-link").hash).toBe("#dfn-one");
    });
  });

  it("renders only self link to dfn if no local references", async () => {
    const doc = await makeRSDoc(ops);
    const dfnId = "dfn-zero";
    const dfnZero = doc.getElementById(dfnId);
    dfnZero.click();
    const panel = doc.getElementById(getPanelId(dfnId));

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
    const dfnId = "dfn-one";
    const dfnOne = doc.getElementById(dfnId);
    dfnOne.click();
    const panel = doc.getElementById(getPanelId(dfnId));

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-one");

    const referenceHeading = panel.querySelector("b");
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll("ul li");
    expect(referenceListItems).toHaveSize(1);

    const references = panel.querySelectorAll("ul li a");
    expect(references).toHaveSize(1);
    expect(references[0].textContent).toBe("§ 1. top level heading");
    expect(references[0].hash).toBe("#ref-for-dfn-one-1");
  });

  it("renders multiple references with relevant titles", async () => {
    const doc = await makeRSDoc(ops);
    const dfnId = "dfn-many";
    const dfnMany = doc.getElementById(dfnId);
    dfnMany.click();
    const panel = doc.getElementById(getPanelId(dfnId));

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-many");

    const referenceHeading = panel.querySelector("b");
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll("ul li");
    expect(referenceListItems).toHaveSize(2);
    const [item1, item2] = referenceListItems;

    const item1Links = item1.querySelectorAll("a");
    expect(item1Links).toHaveSize(3);
    expect(item1Links[0].textContent).toBe("§ 1. top level heading");
    expect(item1Links[0].hash).toBe("#ref-for-dfn-many-1");
    expect(item1Links[1].textContent).toBe("(2)");
    expect(item1Links[1].hash).toBe("#ref-for-dfn-many-2");
    expect(item1Links[2].textContent).toBe("(3)");
    expect(item1Links[2].hash).toBe("#ref-for-dfn-many-5");
    expect(item1.textContent.trim()).toBe("§ 1. top level heading (2) (3)");

    const item2Links = item2.querySelectorAll("a");
    expect(item2Links).toHaveSize(2);
    expect(item2Links[0].textContent).toBe("§ 1.1 nested section heading");
    expect(item2Links[0].hash).toBe("#ref-for-dfn-many-3");
    expect(item2Links[1].textContent).toBe("(2)");
    expect(item2Links[1].hash).toBe("#ref-for-dfn-many-4");
    expect(item2.textContent.trim()).toBe("§ 1.1 nested section heading (2)");
  });

  it("renders a marker on exported definitions", async () => {
    const doc = await makeRSDoc(ops);

    const panelDnExported = doc.getElementById(getPanelId("dfn-many"));
    expect(panelDnExported.querySelectorAll(".marker")).toHaveSize(1);
    const marker = panelDnExported.querySelector(".marker.dfn-exported");
    expect(marker).toBeTruthy();
    expect(marker.textContent).toBe("exported");
    expect(marker.previousElementSibling.textContent).toBe("Permalink");

    const panelDfnNotExported = doc.getElementById(getPanelId("dfn-one"));
    expect(panelDfnNotExported.querySelector(".dfn-exported")).toBeFalsy();
  });

  it("renders a link to jump to IDL block", async () => {
    const body = `
      <section data-dfn-for="Foo">
        <h2><dfn>Foo</dfn> interface</h2>
        <pre class="idl" id="test-webidl-block">
        [Exposed=Window]
        interface Foo {
          constructor();
          attribute DOMString bar;
        };
        </pre>
        <dfn id="test-dfn-idl">bar</dfn>
        <dfn id="test-dfn-no-idl">baz</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const panelDfnIdl = doc.getElementById(getPanelId("test-dfn-idl"));
    expect(panelDfnIdl.querySelectorAll(".marker")).toHaveSize(2);

    const marker = panelDfnIdl.querySelector(".marker.idl-block");
    expect(marker).toBeTruthy();
    expect(marker.textContent).toBe("IDL");
    expect(marker.hash).toBe("#test-webidl-block");

    const panelDfnNotIdl = doc.getElementById(getPanelId("test-dfn-no-idl"));
    expect(panelDfnNotIdl.querySelectorAll(".marker")).toHaveSize(0);
  });

  it("works in exported document", async () => {
    const rdoc = await makeRSDoc(ops);
    const doc = await getExportedDoc(rdoc);

    const dfnId = "dfn-one";
    const panel = doc.getElementById(getPanelId(dfnId));
    const dfn = doc.getElementById(dfnId);

    expect(panel).toBeTruthy();
    expect(panel.hidden).toBeTrue();

    dfn.click();
    expect(panel.hidden).toBeFalse();

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-one");

    const referenceHeading = panel.querySelector("b");
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll("ul li");
    expect(referenceListItems).toHaveSize(1);

    const references = panel.querySelectorAll("ul li a");
    expect(references).toHaveSize(1);
    expect(references[0].textContent).toBe("§ 1. top level heading");
    expect(references[0].hash).toBe("#ref-for-dfn-one-1");
  });
});
