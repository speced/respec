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
      panel.querySelector(".dfn-panel-refs a").click();
      expect(panel.classList).toContain("docked");
    });

    it("closes docked panel on panel click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      panel.querySelector(".dfn-panel-refs a").click();
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

    const referenceSection = panel.querySelector(".dfn-panel-refs");
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

    const referenceHeading = [...panel.querySelectorAll("b")].find(b =>
      b.textContent.includes("Referenced in:")
    );
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll(".dfn-panel-refs li");
    expect(referenceListItems).toHaveSize(1);

    const references = panel.querySelectorAll(".dfn-panel-refs li a");
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

    const referenceHeading = [...panel.querySelectorAll("b")].find(b =>
      b.textContent.includes("Referenced in:")
    );
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll(".dfn-panel-refs li");
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

    const referenceHeading = [...panel.querySelectorAll("b")].find(b =>
      b.textContent.includes("Referenced in:")
    );
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll(".dfn-panel-refs li");
    expect(referenceListItems).toHaveSize(1);

    const references = panel.querySelectorAll(".dfn-panel-refs li a");
    expect(references).toHaveSize(1);
    expect(references[0].textContent).toBe("§ 1. top level heading");
    expect(references[0].hash).toBe("#ref-for-dfn-one-1");
  });
});

describe("possible linking syntaxes", () => {
  afterAll(flushIframes);

  it("renders linking syntax section for a plain dfn", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-concept">my concept</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById(`dfn-panel-for-test-concept`);

    const syntaxHeading = [...panel.querySelectorAll("b")].find(b =>
      b.textContent.includes("Possible linking syntaxes:")
    );
    expect(syntaxHeading).toBeTruthy();

    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList).toBeTruthy();

    const items = syntaxList.querySelectorAll("li");
    expect(items).toHaveSize(1);
    expect(items[0].querySelector("code").textContent).toBe("[=my concept=]");
  });

  it("adds the heading and list directly to the panel", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-direct">my concept</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-direct");

    // `.dfn-panel > div` is a flex row, so a wrapper div would put the heading
    // and the list side by side.
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList.parentElement).toBe(panel);
    const heading = syntaxList.previousElementSibling.querySelector("b");
    expect(heading.textContent).toBe("Possible linking syntaxes:");
  });

  it("lists what links to the term before the linking syntaxes", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-order">my concept</dfn>
        <a>my concept</a>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-order");
    const references = panel.querySelector(".dfn-panel-refs");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    const position = references.compareDocumentPosition(syntaxList);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders [= =] syntax for dfn type", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-dfn">widget</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-dfn");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList.querySelector("code").textContent).toBe("[=widget=]");
  });

  it("renders [= For/term =] syntax when dfn has dfn-for", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-dfn" data-dfn-for="Request">mode</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-dfn");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList.querySelector("code").textContent).toBe(
      "[=Request/mode=]"
    );
  });

  it("renders {{ }} syntax for IDL interface type", async () => {
    const body = `
      <section data-dfn-for="Foo">
        <h2>Foo</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Foo {};
        </pre>
        <dfn id="test-dfn">Foo</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-dfn");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList).toBeTruthy();
    const code = syntaxList.querySelector("code");
    expect(code.textContent).toBe("{{Foo}}");
  });

  it("renders [^ ^] syntax for element type", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-element" data-dfn-type="element">video</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-element");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList.querySelector("code").textContent).toBe("[^video^]");
  });

  it("renders [^ element/attr ^] syntax for element-attr type", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn
          id="test-attr"
          data-dfn-type="element-attr"
          data-dfn-for="video"
          >src</dfn
        >
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-attr");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList.querySelector("code").textContent).toBe("[^video/src^]");
  });

  it("renders multiple syntaxes when dfn has data-lt aliases", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-lt" data-lt="widget|thing">widget</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-lt");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    const items = syntaxList.querySelectorAll("li");
    expect(items).toHaveSize(2);
    expect(items[0].querySelector("code").textContent).toBe("[=widget=]");
    expect(items[1].querySelector("code").textContent).toBe("[=thing=]");
  });

  it("renders a copy button per syntax item, hidden until hover or focus", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-copy" data-lt="foo|bar">foo</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-copy");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    const copyBtns = syntaxList.querySelectorAll(".dfn-panel-copy-btn");
    expect(copyBtns).toHaveSize(2);
    expect(copyBtns[0].dataset.copyText).toBe("[=foo=]");
    expect(copyBtns[1].dataset.copyText).toBe("[=bar=]");
    expect(copyBtns[0].getAttribute("aria-label")).toBe(
      "Copy [=foo=] to clipboard"
    );
    expect(copyBtns[0].type).toBe("button");

    // The test frame is not rendered or focused, so computed styles, :hover and
    // :focus are unavailable (Firefox returns ""): read the rules instead.
    // Only <style> sheets: cssRules on a cross-origin <link> throws.
    const rules = [...doc.querySelectorAll("style")].flatMap(style => [
      ...(style.sheet?.cssRules ?? []),
    ]);
    const atRest = rules.filter(
      rule => rule.selectorText === ".dfn-panel .dfn-panel-copy-btn"
    );
    expect(atRest).toHaveSize(1);
    expect(atRest[0].style.opacity).toBe("0");
    const reveal = rules.filter(
      rule =>
        rule.selectorText?.includes("li:hover .dfn-panel-copy-btn") &&
        rule.selectorText.includes(".dfn-panel-copy-btn:focus")
    );
    expect(reveal).toHaveSize(1);
    expect(reveal[0].style.opacity).toBe("1");
  });

  it("styles the copy button differently while it is pressed", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-pressed">foo</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    // The test frame is not rendered, so :active cannot be driven: read the rule.
    const rules = [...doc.querySelectorAll("style")].flatMap(style => [
      ...(style.sheet?.cssRules ?? []),
    ]);
    const pressed = rules.filter(
      rule => rule.selectorText === ".dfn-panel .dfn-panel-copy-btn:active"
    );
    expect(pressed).toHaveSize(1);
    expect(pressed[0].style.boxShadow).not.toBe("");
  });

  it("keeps a docked panel open when a copy button is clicked", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-docked" data-lt="foo|bar">foo</dfn>
        <a>foo</a>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const dfn = doc.getElementById("test-docked");
    const panel = doc.getElementById("dfn-panel-for-test-docked");

    dfn.click();
    // Clicking a reference inside the panel docks it.
    panel.querySelector(".dfn-panel-refs a").click();
    expect(panel.classList.contains("docked")).toBeTrue();

    panel.querySelector(".dfn-panel-copy-btn").click();
    expect(panel.hidden).toBeFalse();
  });

  it("keeps the copy buttons in an exported document, and they copy", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-export-copy" data-lt="foo|bar">foo</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const rdoc = await makeRSDoc(ops);
    const doc = await getExportedDoc(rdoc);
    const copied = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: text => copied.push(text) && Promise.resolve() },
      configurable: true,
    });

    const panel = doc.getElementById("dfn-panel-for-test-export-copy");
    const buttons = panel.querySelectorAll(".dfn-panel-copy-btn");
    expect(buttons).toHaveSize(2);
    buttons[1].click();
    expect(copied).toEqual(["[=bar=]"]);
  });

  it("lists a const in {{ }} form that links back to it", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <pre class="idl">
          [Exposed=Window]
          interface ConstHolder {
            const unsigned short MAX = 1;
          };
        </pre>
        <p id="ref">{{ConstHolder/MAX}}</p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-dom-constholder-max");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(["{{ConstHolder/MAX}}"]);
    const link = doc.querySelector("#ref a");
    expect(link.getAttribute("href")).toBe("#dom-constholder-max");
  });

  it("lists enum values in quotes so every value links back", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <pre class="idl">
          enum Mode2 { "first", "with-dash" };
        </pre>
        <p id="ref">{{Mode2/"with-dash"}}</p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-dom-mode2-with-dash");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(['{{Mode2/"with-dash"}}']);
    const link = doc.querySelector("#ref a");
    expect(link.getAttribute("href")).toBe("#dom-mode2-with-dash");
  });

  it("lists no syntax for an overload that no inline syntax can link to", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Over2 {
            undefined over();
            undefined over(long x);
          };
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const first = doc.getElementById("dfn-panel-for-dom-over2-over");
    const second = doc.getElementById(
      "dfn-panel-for-dom-over2-over!overload-1"
    );
    expect(first.querySelector(".dfn-panel-lt")).toBeTruthy();
    expect(second.querySelector(".dfn-panel-lt")).toBeNull();
  });

  it("lists no syntax for dfn types that no inline syntax links to", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-event" data-dfn-type="event">my-event</dfn>
        <dfn id="test-header" data-dfn-type="http-header">My-Header</dfn>
        <dfn id="test-plain">my concept</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    for (const id of ["test-event", "test-header"]) {
      const panel = doc.getElementById(`dfn-panel-for-${id}`);
      expect(panel.querySelector(".dfn-panel-lt")).toBeNull();
    }
    const plain = doc.getElementById("dfn-panel-for-test-plain");
    expect(plain.querySelector(".dfn-panel-lt")).toBeTruthy();
  });

  it("shows markup in data-lt as text, ignores a blank data-dfn-for, and survives a missing clipboard", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="test-odd" data-lt="&lt;img src=x onerror=alert(1)&gt;">hostile</dfn>
        <dfn id="test-blank-for" data-dfn-for=" ">blank for</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const win = doc.defaultView;

    const hostile = doc.getElementById("dfn-panel-for-test-odd");
    expect(hostile.querySelector("img")).toBeNull();
    const codes = [...hostile.querySelectorAll(".dfn-panel-lt code")];
    expect(codes.map(c => c.textContent)).toEqual([
      "[=hostile=]",
      "[=<img src=x onerror=alert(1)>=]",
    ]);

    const blank = doc.getElementById("dfn-panel-for-test-blank-for");
    const blankCodes = [...blank.querySelectorAll(".dfn-panel-lt code")];
    expect(blankCodes.map(c => c.textContent)).toEqual(["[=blank for=]"]);

    // Outside secure contexts navigator.clipboard is undefined.
    Object.defineProperty(win.navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    const errors = [];
    win.addEventListener("error", e => errors.push(e.message));
    hostile.querySelector(".dfn-panel-copy-btn").click();
    expect(errors).toEqual([]);
  });

  it("does not render linking syntaxes section for index-term dfns", async () => {
    const body = `
      <section data-cite="DOM">
        <h2>TEST</h2>
        <p>{{ Event }}</p>
      </section>
      <section id="index"></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const index = doc.getElementById("index-defined-elsewhere");
    const term = index && index.querySelector(".index-term");
    if (!term) return; // Skip if no external terms resolved

    const termPanel = doc.getElementById(`dfn-panel-for-${term.id}`);
    if (!termPanel) return;

    const syntaxList = termPanel.querySelector(".dfn-panel-lt");
    expect(syntaxList).toBeNull();
  });
});
