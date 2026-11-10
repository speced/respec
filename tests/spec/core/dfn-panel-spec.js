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
        "Details for definition: many"
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
        <dfn data-export id="test-concept">my concept</dfn>
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
        <dfn data-export id="test-direct">my concept</dfn>
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
        <dfn data-export id="test-order">my concept</dfn>
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
        <dfn data-export id="test-dfn">widget</dfn>
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
        <dfn data-export id="test-dfn" data-dfn-for="Request">mode</dfn>
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
        <dfn data-export id="test-dfn">Foo</dfn>
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
        <dfn data-export id="test-element" data-dfn-type="element">video</dfn>
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
        <dfn data-export
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
        <dfn data-export id="test-lt" data-lt="widget|thing">widget</dfn>
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

  it("does not submit an author's form when a copy button inside it is clicked", async () => {
    const body = `
      <form id="author-form" action="#submitted"><script></script></form>
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-form">foo</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const form = doc.getElementById("author-form");
    const panel = doc.getElementById("dfn-panel-for-test-form");
    // Panels go before the first <script> in the body, here the one in the form.
    expect(form.contains(panel)).toBeTrue();

    let submits = 0;
    form.addEventListener("submit", event => {
      event.preventDefault();
      submits++;
    });
    panel.querySelector(".dfn-panel-copy-btn").click();
    expect(submits).toBe(0);
  });

  it("keeps a docked panel open when a copy button is clicked", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-docked" data-lt="foo|bar">foo</dfn>
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

  it("keeps the panel open when Enter is pressed on a copy button, and closes it on a link", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-enter" data-lt="foo|bar">foo</dfn>
        <a>foo</a>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    // A hidden frame has no layout, and then showing a panel throws before it traps focus.
    const doc = await makeRSDoc(ops, null, "display: block");
    const pressEnter = target =>
      target.dispatchEvent(
        new doc.defaultView.KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
        })
      );
    const dfn = doc.getElementById("test-enter");
    const panel = doc.getElementById("dfn-panel-for-test-enter");

    dfn.click();
    expect(panel.contains(doc.activeElement)).toBeTrue();

    pressEnter(panel.querySelector(".dfn-panel-copy-btn"));
    expect(panel.hidden).toBeFalse();

    pressEnter(panel.querySelector(".dfn-panel-refs a"));
    expect(panel.hidden).toBeTrue();
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
        <dfn data-export id="test-event" data-dfn-type="event">my-event</dfn>
        <dfn data-export id="test-header" data-dfn-type="http-header">My-Header</dfn>
        <dfn data-export id="test-plain">my concept</dfn>
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
        <dfn data-export id="test-odd" data-lt="&lt;img src=x onerror=alert(1)&gt;">hostile</dfn>
        <dfn data-export id="test-blank-for" data-dfn-for=" ">blank for</dfn>
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

  it("lists linking syntax for a concept containing a slash, and it round-trips", async () => {
    const body = `
      <p><dfn data-export id="t-io">I/O queue</dfn></p>
      <p id="t-io-use">[=I\\/O queue=]</p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-io");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(["[=I\\/O queue=]"]);
    const link = doc.querySelector("#t-io-use a");
    expect(link.getAttribute("href")).toBe("#t-io");
  });

  it("lists linking syntax for a for-concept containing a slash, and it round-trips", async () => {
    const body = `
      <p><dfn data-export id="t-io-for" data-dfn-for="Host">I/O queue</dfn></p>
      <p id="ref">[=Host/I\\/O queue=]</p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-io-for");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(["[=Host/I\\/O queue=]"]);
    const link = doc.querySelector("#ref a");
    expect(link.getAttribute("href")).toBe("#t-io-for");
  });

  it("lists no syntax for an attribute value containing a slash", async () => {
    const body = `
      <p>
        <dfn data-export id="t-enc" data-dfn-type="attr-value" data-dfn-for="form/enctype">application/x-www-form-urlencoded</dfn>
      </p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-enc");
    expect(panel.querySelector(".dfn-panel-lt")).toBeNull();
  });

  it("lists correct syntax for element attributes (global and specific)", async () => {
    const body = `
      <p><dfn data-export id="t-role" data-dfn-type="element-attr">role</dfn></p>
      <p id="ref-role">[^/role^]</p>
      <p><dfn data-export id="t-allow" data-dfn-type="element-attr" data-dfn-for="iframe">allow</dfn></p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panelRole = doc.getElementById("dfn-panel-for-t-role");
    const listedRole = [
      ...panelRole.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(listedRole).toEqual(["[^/role^]"]);
    const linkRole = doc.querySelector("#ref-role a");
    expect(linkRole.getAttribute("href")).toBe("#t-role");
    const panelAllow = doc.getElementById("dfn-panel-for-t-allow");
    const listedAllow = [
      ...panelAllow.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(listedAllow).toEqual(["[^iframe/allow^]"]);
  });

  it("lists no syntax for inconsistent definitions, but does for simple elements", async () => {
    const body = `
      <p><dfn data-export id="t-blink" data-dfn-type="element" data-dfn-for="html">blink</dfn></p>
      <p><dfn data-export id="t-on" data-dfn-type="attr-value">on</dfn></p>
      <p><dfn data-export id="t-iframe" data-dfn-type="element">iframe</dfn></p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panelBlink = doc.getElementById("dfn-panel-for-t-blink");
    expect(panelBlink.querySelector(".dfn-panel-lt")).toBeNull();
    const panelOn = doc.getElementById("dfn-panel-for-t-on");
    expect(panelOn.querySelector(".dfn-panel-lt")).toBeNull();
    const panelIframe = doc.getElementById("dfn-panel-for-t-iframe");
    const listedIframe = [
      ...panelIframe.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(listedIframe).toEqual(["[^iframe^]"]);
  });

  it("lists no syntax for the empty-string enum value ReSpec generates from IDL", async () => {
    const body = `
      <pre class="idl">enum Mode { "", "a" };</pre>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panelEmptyIdl = doc.getElementById(
      "dfn-panel-for-dom-mode-the-empty-string"
    );
    expect(panelEmptyIdl.querySelector(".dfn-panel-lt")).toBeNull();
    const panelA = doc.getElementById("dfn-panel-for-dom-mode-a");
    const listedA = [...panelA.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listedA).toEqual(['{{Mode/"a"}}']);
  });

  it("allows tabbing forward and backward between copy buttons", async () => {
    const body = `
      <p><dfn data-export id="t-focus" data-lt="foo|bar">foo</dfn></p>
      <a>foo</a>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops, null, "display: block");
    const dfn = doc.getElementById("t-focus");
    dfn.click();
    const panel = doc.getElementById("dfn-panel-for-t-focus");
    const buttons = [...panel.querySelectorAll(".dfn-panel-copy-btn")];
    buttons[0].focus();
    buttons[0].dispatchEvent(
      new doc.defaultView.KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      })
    );
    expect(doc.activeElement).toBe(buttons[1]);
    buttons[1].focus();
    buttons[1].dispatchEvent(
      new doc.defaultView.KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    );
    expect(doc.activeElement).toBe(buttons[0]);
  });

  it("labels the list of syntaxes with its heading", async () => {
    const body = `<p><dfn data-export id="t-aria" data-lt="foo">foo</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-aria");
    const list = panel.querySelector(".dfn-panel-lt");
    expect(list).not.toBeNull();
    const labelledby = list.getAttribute("aria-labelledby");
    expect(labelledby).toBeTruthy();
    const heading = panel.querySelector(`#${labelledby}`);
    expect(heading).not.toBeNull();
    expect(heading.textContent.trim()).toBe("Possible linking syntaxes:");
  });

  it("styles linking syntaxes to be selectable with one click", async () => {
    const body = `<p><dfn data-export id="t-select" data-lt="foo">foo</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const rules = [...doc.styleSheets]
      .filter(ss => ss.ownerNode.localName === "style")
      .flatMap(ss => [...ss.cssRules]);
    const matchingRules = rules.filter(
      rule => rule.selectorText === ".dfn-panel .dfn-panel-lt code"
    );
    expect(matchingRules.length).toBe(1);
    const rule = matchingRules[0];
    expect(rule.style.getPropertyValue("user-select")).toBe("all");
  });

  it("lists no syntax for an enum value containing a slash, but does for one without", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <pre class="idl">
          enum Mode3 { "text/plain", "b" };
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panelWithSlash = doc.getElementById(
      "dfn-panel-for-dom-mode3-text/plain"
    );
    expect(panelWithSlash.querySelector(".dfn-panel-lt")).toBeNull();
    const panelWithoutSlash = doc.getElementById("dfn-panel-for-dom-mode3-b");
    const listed = [
      ...panelWithoutSlash.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(listed).toEqual(['{{Mode3/"b"}}']);
  });

  it("lists both the term and a local alias, and both link back", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><dfn data-export id="t-local" data-local-lt="loc alias">local term</dfn></p>
        <p id="use-term">[=local term=]</p>
        <p id="use-alias">[=loc alias=]</p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-local");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(["[=local term=]", "[=loc alias=]"]);
    const termLink = doc.querySelector("#use-term a");
    expect(termLink.getAttribute("href")).toBe("#t-local");
    const aliasLink = doc.querySelector("#use-alias a");
    expect(aliasLink.getAttribute("href")).toBe("#t-local");
  });

  it("lists and links a CDDL value containing a slash", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <pre class="cddl">attire = "a/b" / "c"</pre>
        <p id="use-ab">{^attire/"a/b"^}</p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-cddl-value-attire-a-b");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(['{^attire/"a/b"^}']);
    const link = doc.querySelector("#use-ab a");
    expect(link.getAttribute("href")).toBe("#cddl-value-attire-a-b");
  });

  it("moves focus to the first/last control on Tab/Shift+Tab when focus is outside the panel's controls", async () => {
    const body = `
      <p><dfn data-export id="t-out" data-lt="foo|bar">foo</dfn></p><a>foo</a>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops, null, "display: block");
    const dfn = doc.getElementById("t-out");
    const panel = doc.getElementById("dfn-panel-for-t-out");

    dfn.click(); // Show panel, which also moves focus inside it
    const controls = [
      ...panel.querySelectorAll("a[href], button:not([disabled])"),
    ];
    expect(controls.length).toBeGreaterThan(1);

    // Test forward tabbing (Tab)
    doc.activeElement.blur();
    expect(doc.activeElement).toBe(doc.body);
    panel.dispatchEvent(
      new doc.defaultView.KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      })
    );
    expect(doc.activeElement).toBe(controls[0]);

    // Test backward tabbing (Shift+Tab)
    doc.activeElement.blur();
    expect(doc.activeElement).toBe(doc.body);
    panel.dispatchEvent(
      new doc.defaultView.KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    );
    expect(doc.activeElement).toBe(controls[controls.length - 1]);
  });

  it("lists two linking syntaxes for a hand-written empty string enum value, and both link back", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><dfn data-export id="t-empty2" data-dfn-type="enum-value" data-dfn-for="Other">""</dfn></p>
        <p id="use-a">{{Other/"the-empty-string"}}</p>
        <p id="use-b">{{Other/""}}</p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-empty2");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(['{{Other/""}}', '{{Other/"the-empty-string"}}']);
    const linkA = doc.querySelector("#use-a a");
    expect(linkA.getAttribute("href")).toBe("#t-empty2");
    const linkB = doc.querySelector("#use-b a");
    expect(linkB.getAttribute("href")).toBe("#t-empty2");
  });

  it("lists the definition's own text first, then data-lt aliases", async () => {
    const body = `
      <p><dfn data-export id="t-order" data-lt="gadget|gizmo">thing</dfn></p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-order");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(["[=thing=]", "[=gadget=]", "[=gizmo=]"]);
  });

  it("lists the definition's own text only once, even if also in data-lt", async () => {
    const body = `
      <p><dfn data-export id="t-order2" data-lt="gadget|thing">thing</dfn></p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-order2");
    const listed = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(["[=thing=]", "[=gadget=]"]);
  });

  it("lists only plain IDL member syntax, not qualified aliases", async () => {
    const body = `
      <pre class="idl">
        [Exposed=Window]
        interface Parent {
          attribute long attr;
          undefined method(long arg);
        };
      </pre>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const attrPanel = doc.getElementById("dfn-panel-for-dom-parent-attr");
    const attrListed = [
      ...attrPanel.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(attrListed).toEqual(["{{Parent/attr}}"]);
    const methodPanel = doc.getElementById("dfn-panel-for-dom-parent-method");
    const methodListed = [
      ...methodPanel.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(methodListed.length).toBeGreaterThan(0);
    for (const syntax of methodListed) {
      expect(syntax).toMatch(/^\{\{Parent\/method/);
      expect(syntax).not.toContain("Parent.method");
    }
  });

  it("lists no linking syntax for an unquoted CDDL term containing a slash", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><dfn data-export id="t-cddl-slash" data-dfn-type="cddl-type">group/subgroup</dfn></p>
        <p><dfn data-export id="t-cddl-plain" data-dfn-type="cddl-type">plain</dfn></p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const panelSlash = doc.getElementById("dfn-panel-for-t-cddl-slash");
    expect(panelSlash.querySelector(".dfn-panel-lt")).toBeNull();

    const panelPlain = doc.getElementById("dfn-panel-for-t-cddl-plain");
    const listed = [...panelPlain.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(listed).toEqual(["{^plain^}"]);
  });

  it("renders a copy button per syntax item, with an icon hidden until hover or focus", async () => {
    const body = `
    <section>
      <h2>Test</h2>
      <dfn data-export id="test-copy" data-lt="foo|bar">foo</dfn>
    </section>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-copy");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    const copyBtns = syntaxList.querySelectorAll(".dfn-panel-copy-btn");
    expect(copyBtns).toHaveSize(2);
    expect(copyBtns[0].textContent.trim().replace(/\s+/g, " ")).toBe(
      "Copy [=foo=]"
    );
    expect(copyBtns[0].type).toBe("button");

    const rules = [...doc.querySelectorAll("style")].flatMap(style => [
      ...(style.sheet?.cssRules ?? []),
    ]);
    const atRest = rules.filter(
      rule => rule.selectorText === ".dfn-panel .dfn-panel-copy-btn svg"
    );
    expect(atRest).toHaveSize(1);
    expect(atRest[0].style.opacity).toBe("0");
    const reveal = rules.filter(
      rule =>
        rule.selectorText?.includes("li:hover .dfn-panel-copy-btn svg") &&
        rule.selectorText.includes(".dfn-panel-copy-btn:focus svg")
    );
    expect(reveal).toHaveSize(1);
    expect(reveal[0].style.opacity).toBe("1");
  });

  it("styles the copy button's icon differently while it is pressed", async () => {
    const body = `
    <section>
      <h2>Test</h2>
      <dfn data-export id="test-pressed">foo</dfn>
    </section>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const rules = [...doc.querySelectorAll("style")].flatMap(style => [
      ...(style.sheet?.cssRules ?? []),
    ]);
    const pressed = rules.filter(
      rule => rule.selectorText === ".dfn-panel .dfn-panel-copy-btn:active svg"
    );
    expect(pressed).toHaveSize(1);
    expect(pressed[0].style.boxShadow).not.toBe("");
  });

  it("has copy buttons that copy the correct syntax and have correct attributes", async () => {
    const body = `
    <p><dfn data-export id="t-copy" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-copy");
    const buttons = [...panel.querySelectorAll(".dfn-panel-copy-btn")];
    buttons.forEach(button => {
      expect(button.querySelector("svg")).not.toBeNull();
      expect(button.hasAttribute("data-copy-text")).toBeFalse();
      expect(button.getAttribute("type")).toBe("button");
      expect(button.hasAttribute("aria-label")).toBeFalse();
      expect(button.hasAttribute("title")).toBeFalse();
    });
    const copied = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: {
        writeText: text => {
          copied.push(text);
          return Promise.resolve();
        },
      },
      configurable: true,
    });
    buttons[1].click();
    expect(copied).toEqual(["[=bar=]"]);
  });

  it("copies syntax when clicking the icon inside a copy button and keeps the panel open", async () => {
    const body = `
    <p><dfn data-export id="t-icon" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const dfn = doc.getElementById("t-icon");
    const panel = doc.getElementById("dfn-panel-for-t-icon");
    const copied = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: {
        writeText: text => {
          copied.push(text);
          return Promise.resolve();
        },
      },
      configurable: true,
    });

    dfn.click();
    const svg = panel.querySelectorAll(".dfn-panel-copy-btn svg")[1];
    svg.dispatchEvent(
      new doc.defaultView.MouseEvent("click", { bubbles: true })
    );

    expect(panel.hidden).toBeFalse();
    expect(copied).toEqual(["[=bar=]"]);
  });

  it("keeps the copy buttons in an exported document, and they copy", async () => {
    const body = `
    <section>
      <h2>Test</h2>
      <dfn data-export id="test-export-copy" data-lt="foo|bar">foo</dfn>
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

  it("has a button per syntax as the sole child of the list item", async () => {
    const body = `
    <p><dfn data-export id="t-row" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-row");
    const listItems = [...panel.querySelectorAll(".dfn-panel-lt li")];
    expect(listItems).toHaveSize(2);
    for (const li of listItems) {
      expect(li.children).toHaveSize(1);
      const button = li.firstElementChild;
      expect(button.tagName).toBe("BUTTON");
      expect(button.classList.contains("dfn-panel-copy-btn")).toBeTrue();
      expect(button.querySelector("code")).not.toBeNull();
    }
  });

  it("gives copy buttons an accessible name from their content", async () => {
    const body = `
    <p><dfn data-export id="t-row" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-row");
    const buttons = panel.querySelectorAll(".dfn-panel-copy-btn");
    expect(buttons[0].textContent.trim().replace(/\s+/g, " ")).toBe(
      "Copy [=foo=]"
    );
    expect(buttons[1].textContent.trim().replace(/\s+/g, " ")).toBe(
      "Copy [=bar=]"
    );
    expect(buttons[0].hasAttribute("aria-label")).toBeFalse();
    expect(buttons[0].hasAttribute("title")).toBeFalse();
  });

  it("hides the word 'Copy ' from sighted users", async () => {
    const body = `
    <p><dfn data-export id="t-vhidden" data-lt="foo">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const button = doc.querySelector(".dfn-panel-copy-btn");
    const hiddenSpan = button.querySelector("span.visually-hidden");
    expect(hiddenSpan).not.toBeNull();
    expect(hiddenSpan.textContent).toBe("Copy ");
    expect(hiddenSpan.nextElementSibling.tagName).toBe("CODE");
    const rules = [...doc.querySelectorAll("style")].flatMap(style => [
      ...(style.sheet?.cssRules ?? []),
    ]);
    const hiddenRule = rules.filter(
      rule => rule.selectorText === ".dfn-panel .visually-hidden"
    );
    expect(hiddenRule).toHaveSize(1);
    expect(hiddenRule[0].style.position).toBe("absolute");
    expect(hiddenRule[0].style.width).toBe("1px");
  });

  it("uses one shared SVG icon symbol for all copy buttons", async () => {
    const body = `
    <p><dfn data-export id="t-a" data-lt="a1|a2">a</dfn></p>
    <p><dfn data-export id="t-b">b</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const symbols = doc.querySelectorAll("symbol");
    expect(symbols).toHaveSize(1);
    const symbol = symbols[0];
    expect(symbol.querySelector("path")).not.toBeNull();
    const uses = [...doc.querySelectorAll(".dfn-panel-copy-btn svg use")];
    expect(uses).toHaveSize(4);
    for (const use of uses) {
      const href = use.getAttribute("href");
      expect(href.startsWith("#")).toBeTrue();
      const target = doc.getElementById(href.substring(1));
      expect(target).toBe(symbol);
    }
    doc.querySelectorAll(".dfn-panel-copy-btn svg").forEach(svg => {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
      expect(svg.querySelector("path")).toBeNull();
    });
  });

  it("hides the SVG sprite definition without using display:none", async () => {
    const body = `
    <p><dfn data-export data-lt="foo">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const sprite = doc.querySelector("svg.dfn-panel-sprite");
    expect(sprite).not.toBeNull();
    expect(sprite.getAttribute("aria-hidden")).toBe("true");
    expect(sprite.querySelector("symbol")).not.toBeNull();
    const rules = [...doc.querySelectorAll("style")].flatMap(style => [
      ...(style.sheet?.cssRules ?? []),
    ]);
    const spriteRule = rules.filter(
      rule => rule.selectorText === ".dfn-panel-sprite"
    );
    expect(spriteRule).toHaveSize(1);
    const style = spriteRule[0].style;
    expect(style.position).toBe("absolute");
    expect(style.width).toBe("0px");
    expect(style.height).toBe("0px");
    expect(style.display).not.toBe("none");
  });

  it("adds no SVG sprite if there are no syntaxes to list", async () => {
    const body = `
    <p><dfn data-export id="t-none" data-dfn-type="event">only</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("symbol")).toBeNull();
    expect(doc.querySelector(".dfn-panel-sprite")).toBeNull();
  });

  it("keeps the SVG sprite and buttons in an exported document", async () => {
    const body = `
    <p><dfn data-export id="t-exp" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const rdoc = await makeRSDoc(ops);
    const doc = await getExportedDoc(rdoc);
    const symbols = doc.querySelectorAll("symbol");
    expect(symbols).toHaveSize(1);
    const symbol = symbols[0];
    const buttons = doc.querySelectorAll(".dfn-panel-copy-btn");
    expect(buttons).toHaveSize(2);
    const use = buttons[0].querySelector("svg use");
    const target = doc.getElementById(use.getAttribute("href").substring(1));
    expect(target).toBe(symbol);
  });

  it("copies syntax when clicking text inside a copy button", async () => {
    const body = `
    <p><dfn data-export id="t-click" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const copied = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: text => copied.push(text) && Promise.resolve() },
      configurable: true,
    });
    const panel = doc.getElementById("dfn-panel-for-t-click");
    const click = target =>
      target.dispatchEvent(
        new doc.defaultView.MouseEvent("click", { bubbles: true })
      );

    const code = panel.querySelectorAll("code")[1];
    click(code);
    expect(copied).toEqual(["[=bar=]"]);

    const span = panel.querySelector("span.visually-hidden");
    click(span);
    expect(copied).toEqual(["[=bar=]", "[=foo=]"]);
  });

  it("calls button.ariaNotify on successful copy but not on failure", async () => {
    const body = `
    <p><dfn data-export data-lt="foo|bar|baz">test</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const buttons = doc.querySelectorAll(".dfn-panel-copy-btn");
    const wait = () => new Promise(resolve => setTimeout(resolve, 50));

    const notes1 = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    });
    buttons[0].ariaNotify = msg => notes1.push(msg);
    buttons[0].click();
    await wait();
    expect(notes1).toEqual(["Copied"]);

    const notes2 = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("fail")) },
      configurable: true,
    });
    buttons[1].ariaNotify = msg => notes2.push(msg);
    buttons[1].click();
    await wait();
    expect(notes2).toEqual([]);

    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    });
    buttons[2].ariaNotify = undefined;
    const fail = jasmine.createSpy("fail");
    doc.defaultView.addEventListener("error", fail);
    doc.defaultView.addEventListener("unhandledrejection", fail);
    buttons[2].click();
    await wait();
    expect(fail).not.toHaveBeenCalled();
    doc.defaultView.removeEventListener("error", fail);
    doc.defaultView.removeEventListener("unhandledrejection", fail);
  });

  it("hides the IDL code-block's copy icon from assistive technology", async () => {
    const body = `
    <pre class="idl">[Exposed=Window] interface Thing {};</pre>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const button = doc.querySelector(".respec-button-copy-paste");
    const svg = button.querySelector("svg");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("shows no linking syntaxes section for a non-exported definition", async () => {
    const body = `<p><dfn id="t-local" data-lt="foo|bar">foo</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-local");
    expect(panel).not.toBeNull();
    expect(panel.querySelector(".dfn-panel-lt")).toBeNull();
    const hasHeading = [...panel.querySelectorAll("b")].some(
      el => el.textContent === "Possible linking syntaxes:"
    );
    expect(hasHeading).toBeFalse();
    expect(doc.querySelector("svg.dfn-panel-sprite")).toBeNull();
  });

  it("shows linking syntaxes for a definition with the data-export attribute", async () => {
    const body = `<p><dfn id="t-exported" data-export data-lt="foo|bar">foo</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-exported");
    const syntaxes = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(syntaxes).toEqual(["[=foo=]", "[=bar=]"]);
  });

  it("shows linking syntaxes for a definition with the 'export' class", async () => {
    const body = `<p><dfn id="t-class" class="export">foo</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-class");
    const syntaxes = [...panel.querySelectorAll(".dfn-panel-lt code")].map(
      c => c.textContent
    );
    expect(syntaxes).toEqual(["[=foo=]"]);
  });

  it("shows linking syntaxes for definitions generated from WebIDL", async () => {
    const body = `
      <pre class="idl">
        [Exposed=Window]
        interface Thing {
          attribute long attr;
        };
      </pre>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const thingPanel = doc.getElementById("dfn-panel-for-dom-thing");
    const thingSyntaxes = [
      ...thingPanel.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(thingSyntaxes).toEqual(["{{Thing}}"]);
    const attrPanel = doc.getElementById("dfn-panel-for-dom-thing-attr");
    const attrSyntaxes = [
      ...attrPanel.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(attrSyntaxes).toEqual(["{{Thing/attr}}"]);
  });

  it("shows syntaxes only for exported definitions and a single icon sprite in a mixed document", async () => {
    const body = `<p><dfn id="t-yes" data-export>yes</dfn> <dfn id="t-no">no</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const yesPanel = doc.getElementById("dfn-panel-for-t-yes");
    const yesSyntaxes = [
      ...yesPanel.querySelectorAll(".dfn-panel-lt code"),
    ].map(c => c.textContent);
    expect(yesSyntaxes).toEqual(["[=yes=]"]);
    const noPanel = doc.getElementById("dfn-panel-for-t-no");
    expect(noPanel.querySelector(".dfn-panel-lt")).toBeNull();
    expect(doc.querySelectorAll("symbol").length).toBe(1);
  });
});
