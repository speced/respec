"use strict";

import {
  errorFilters,
  flushIframes,
  getExportedDoc,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../SpecHelper.js";

const flowchart = `flowchart TD\n  A[Start] --> B[End]`;
const sequence = `sequenceDiagram\n  Alice->>Bob: Hi\n  Bob-->>Alice: Hello`;
const classDiag = `classDiagram\n  class Animal {\n    +String name\n  }\n  class Dog\n  Animal <|-- Dog`;
const state = `stateDiagram-v2\n  [*] --> Idle\n  Idle --> Busy\n  Busy --> [*]`;
const pie = `pie title Pets\n  "Dogs" : 386\n  "Cats" : 85`;

function wrap(text, attrs = {}) {
  const figAttrs = attrs.figId ? ` id="${attrs.figId}"` : "";
  const preAttrs = attrs.preId ? ` id="${attrs.preId}"` : "";
  const cap = attrs.noCap ? "" : `<figcaption>Caption</figcaption>`;
  return `<figure${figAttrs}><pre class="mermaid"${preAttrs}>${text}</pre>${cap}</figure>`;
}

describe("Core - Diagrams", () => {
  afterAll(flushIframes);

  it("renders all five diagram types", async () => {
    const body =
      wrap(flowchart) +
      wrap(sequence) +
      wrap(classDiag) +
      wrap(state) +
      wrap(pie);
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const cards = doc.querySelectorAll(".diagram-container");
    expect(cards).toHaveSize(5);
    cards.forEach(card => {
      expect(card.querySelector("svg.pele.diagram-svg--desktop"))
        .withContext("desktop SVG")
        .toBeTruthy();
    });
  });

  it("keeps script payloads in labels as text", async () => {
    const body = wrap(
      `graph TD\n  A["&lt;img src=x onerror=window.__xss=1&gt;"] --> B`
    );
    const doc = await makeRSDoc(makeStandardOps(null, body));
    expect(doc.defaultView.__xss).toBeUndefined();

    const card = doc.querySelector(".diagram-container");
    expect(card.getAttribute("data-diagram-source")).toContain("onerror=");

    const svg = doc.querySelector("svg.pele");
    expect(svg.querySelector("script")).toBeNull();
    const hasOnAttr = Array.from(svg.querySelectorAll("*")).some(el =>
      Array.from(el.attributes).some(attr => attr.name.startsWith("on"))
    );
    expect(hasOnAttr).toBeFalse();
  });

  it("marks the failing line for invalid diagrams with a line number", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(`graph TD\n  A -->`))
    );
    const card = doc.querySelector(".diagram-container");

    expect(card.classList).toContain("diagram-container--error");
    expect(card.classList).toContain("diagram-container--flipped");
    expect(card.querySelector(".dg-code--error")).toBeTruthy();
    expect(
      card.querySelector(".dg-code--hint").textContent.trim().length
    ).toBeGreaterThan(0);

    const errors = errorFilters.filter("core/diagrams")(doc);
    expect(errors).toHaveSize(1);
    expect(errors[0].message).toMatch(/line/i);
    expect(errors[0].hint).toBeTruthy();
    expect(errors[0].hint).not.toBe(errors[0].message);
    expect(errors[0].elements).toHaveSize(1);
    expect(errors[0].elements[0]).toBe(card);
  });

  it("reports an error for an invalid diagram even when not in a figure", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, `<pre class="mermaid">graph TD\n  A --></pre>`)
    );
    const card = doc.querySelector(".diagram-container");

    expect(card.classList).toContain("diagram-container--error");

    const errors = errorFilters.filter("core/diagrams")(doc);
    expect(errors).toHaveSize(1);
    expect(errors[0].elements).toHaveSize(1);
    expect(errors[0].elements[0]).toBe(card);
  });

  it("shows a hint and no marked line for a mistyped diagram name", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(`flowchrt TD\n  A --> B`))
    );
    const card = doc.querySelector(".diagram-container");

    expect(card.classList).toContain("diagram-container--error");
    expect(card.querySelector(".dg-code--error")).toBeNull();
    expect(
      card.querySelector(".dg-code--hint").textContent.trim().length
    ).toBeGreaterThan(0);

    const errors = errorFilters.filter("core/diagrams")(doc);
    expect(errors).toHaveSize(1);
    expect(errors[0].elements).toHaveSize(1);
    expect(errors[0].elements[0]).toBe(card);
  });

  it("moves the pre id to the card", async () => {
    const body = wrap(flowchart, { preId: "my-diagram-id" });
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const card = doc.getElementById("my-diagram-id");
    expect(card).toBeTruthy();
    expect(card.classList).toContain("diagram-container");
  });

  it("keeps all IDs unique and preserves author IDs", async () => {
    const accTitle = `flowchart LR\n  accTitle: Release flow\n  A --> B`;
    const body = `<div id="respec-diagram-0-title">Author Div</div>${wrap(
      accTitle
    )}${wrap(accTitle)}`;
    const doc = await makeRSDoc(makeStandardOps(null, body));

    // Without drawn diagrams there would be no duplicates to find.
    const cards = doc.querySelectorAll(".diagram-container");
    expect(cards).toHaveSize(2);
    cards.forEach(card => {
      expect(card.querySelector("svg[aria-labelledby]"))
        .withContext("diagram with an accessible title")
        .not.toBeNull();
    });

    const allIds = Array.from(doc.querySelectorAll("[id]")).map(el => el.id);
    const uniqueIds = new Set(allIds);
    expect(allIds.length).toBe(uniqueIds.size);
    expect(doc.getElementById("respec-diagram-0-title").textContent).toBe(
      "Author Div"
    );
  });

  it("converts click links to anchor elements without dfn warnings", async () => {
    const body = wrap(
      `graph TD\n  A[Start] --> B[End]\n  click A "https://example.com" "go there"`
    );
    const doc = await makeRSDoc(makeStandardOps(null, body));
    expect(
      doc.querySelector(`svg a[href^="https://example.com"]`)
    ).toBeTruthy();
    expect(warningFilters.filter("core/link-to-dfn")(doc)).toHaveSize(0);
    expect(errorFilters.filter("core/link-to-dfn")(doc)).toHaveSize(0);
  });

  it("flips faces and manages inert/focus states", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(flowchart)),
      null,
      "display: block; width: 800px; height: 600px"
    );
    const card = doc.querySelector(".diagram-container");
    const flipBtn = doc.querySelector(".diagram-flip-btn");
    const copyBtn = doc.querySelector(".respec-button-copy-paste");
    const front = doc.querySelector(".diagram-face--front");
    const back = doc.querySelector(".diagram-face--back");
    const header = doc.querySelector(".diagramHeader");

    expect(doc.defaultView.getComputedStyle(header).visibility).not.toBe(
      "hidden"
    );

    flipBtn.focus();
    expect(doc.activeElement).toBe(flipBtn);

    copyBtn.focus();
    expect(doc.activeElement).toBe(copyBtn);

    const initialLabel = flipBtn.getAttribute("aria-label");
    expect(card.classList).not.toContain("diagram-container--flipped");
    expect(flipBtn.getAttribute("aria-expanded")).toBe("false");
    expect(back.hasAttribute("inert")).toBeTrue();
    expect(front.hasAttribute("inert")).toBeFalse();

    flipBtn.click();
    expect(card.classList).toContain("diagram-container--flipped");
    expect(flipBtn.getAttribute("aria-expanded")).toBe("true");
    expect(flipBtn.getAttribute("aria-label")).toBe(initialLabel);
    expect(back.hasAttribute("inert")).toBeFalse();
    expect(front.hasAttribute("inert")).toBeTrue();

    flipBtn.click();
    expect(card.classList).not.toContain("diagram-container--flipped");
    expect(flipBtn.getAttribute("aria-expanded")).toBe("false");
    expect(back.hasAttribute("inert")).toBeTrue();
    expect(front.hasAttribute("inert")).toBeFalse();
  });

  it("ignores whitespace-only diagrams without warnings or errors", async () => {
    const body = wrap("   \n  \t", { preId: "empty-pre" });
    const doc = await makeRSDoc(makeStandardOps(null, body));
    expect(doc.querySelector(".diagram-container")).toBeNull();
    const pre = doc.getElementById("empty-pre");
    expect(pre).toBeTruthy();
    expect(pre.localName).toBe("pre");
    expect(errorFilters.filter("core/diagrams")(doc)).toHaveSize(0);
    expect(warningFilters.filter("core/diagrams")(doc)).toHaveSize(0);
  });

  it("does not define the global when there are no diagrams", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, `<p>Just some text.</p>`)
    );
    expect(doc.defaultView.pele).toBeUndefined();
  });

  it("warns and leaves the pre untouched if the renderer fails to load", async () => {
    const interceptScript = `<script>
      const desc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
      Object.defineProperty(HTMLScriptElement.prototype, "src", {
        ...desc,
        set(val) {
          if (val && val.includes("respec-pele")) val = "does-not-exist.js";
          return desc.set.call(this, val);
        }
      });
    </script>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, interceptScript + wrap(flowchart))
    );
    const pre = doc.querySelector("pre.mermaid");
    expect(pre).toBeTruthy();
    expect(pre.classList.contains("hljs")).toBeFalse();
    expect(pre.querySelector(".hljs")).toBeNull();
    expect(doc.querySelector(".diagram-container")).toBeNull();
    expect(warningFilters.filter("core/diagrams")(doc)).toHaveSize(1);
  });

  it("warns about missing figures, but not missing figcaptions", async () => {
    const body = `<pre class="mermaid">${flowchart}</pre>${wrap(sequence, {
      noCap: true,
    })}`;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const warnings = warningFilters.filter("core/diagrams")(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].elements[0].localName).toBe("pre");
  });

  it("warns when respecConfig.mermaid is used", async () => {
    const config = { mermaid: { theme: "dark" } };
    const doc = await makeRSDoc(makeStandardOps(config, wrap(flowchart)));
    const warnings = warningFilters.filter("core/diagrams")(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toMatch(/mermaid/i);
    expect(warnings[0].hint).toMatch(/--pele-/);
  });

  it("sets aria-labelledby to the figcaption ID, generating one if missing", async () => {
    const body = wrap(flowchart) + wrap(sequence, { noCap: true });
    const doc = await makeRSDoc(makeStandardOps(null, body));

    const cards = doc.querySelectorAll(".diagram-container");
    expect(cards).toHaveSize(2);

    const cap1 = cards[0].closest("figure").querySelector("figcaption");
    expect(cap1.id).toBeTruthy();
    expect(cards[0].getAttribute("aria-labelledby")).toBe(cap1.id);
    expect(cards[1].hasAttribute("aria-labelledby")).toBeFalse();
  });

  it("switches --pele-fg color based on the color-scheme toggle", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(flowchart)),
      null,
      "display: block; width: 800px; height: 600px"
    );
    const svg = doc.querySelector("svg.pele");
    const readFg = () =>
      doc.defaultView.getComputedStyle(svg).getPropertyValue("--pele-fg");
    const lightFg = readFg();

    // ReSpec adds its own color-scheme radios a moment after it is ready.
    let darkRadio = null;
    for (let tries = 0; tries < 100 && !darkRadio; tries++) {
      darkRadio = doc.querySelector("input[name='color-scheme'][value='dark']");
      if (!darkRadio) await new Promise(resolve => setTimeout(resolve, 20));
    }
    expect(darkRadio).withContext("ReSpec dark radio").not.toBeNull();
    darkRadio.click();

    expect(lightFg).not.toBe("");
    expect(readFg()).not.toBe(lightFg);
  });

  it("toggles between mobile and desktop SVGs for wide diagrams based on width", async () => {
    const wide = `flowchart LR\n  A[Author writes text] --> B[Validate] --> C[Render SVG] --> D[Insert in page] --> E[Save HTML] --> F[Publish]`;
    const narrow = `flowchart LR\n  X --> Y`;
    const body =
      wrap(wide, { figId: "fig-wide" }) + wrap(narrow, { figId: "fig-narrow" });

    const doc360 = await makeRSDoc(
      makeStandardOps(null, body),
      null,
      "width: 360px; display: block"
    );
    const wideCard360 = doc360.querySelector("#fig-wide .diagram-container");
    expect(
      doc360.defaultView.getComputedStyle(
        wideCard360.querySelector(".diagram-svg--mobile")
      ).display
    ).not.toBe("none");
    expect(
      doc360.defaultView.getComputedStyle(
        wideCard360.querySelector(".diagram-svg--desktop")
      ).display
    ).toBe("none");

    const doc900 = await makeRSDoc(
      makeStandardOps(null, body),
      null,
      "width: 900px; display: block"
    );
    const wideCard900 = doc900.querySelector("#fig-wide .diagram-container");
    expect(
      doc900.defaultView.getComputedStyle(
        wideCard900.querySelector(".diagram-svg--mobile")
      ).display
    ).toBe("none");
    expect(
      doc900.defaultView.getComputedStyle(
        wideCard900.querySelector(".diagram-svg--desktop")
      ).display
    ).not.toBe("none");

    const narrowCard360 = doc360.querySelector(
      "#fig-narrow .diagram-container"
    );
    expect(narrowCard360.querySelector(".diagram-svg--mobile")).toBeNull();
    expect(
      doc360.defaultView.getComputedStyle(
        narrowCard360.querySelector(".diagram-svg--desktop")
      ).display
    ).not.toBe("none");
  });

  it("keeps SVGs and runtime script, and drops leaked flipped state when exported", async () => {
    const rsDoc = await makeRSDoc(makeStandardOps(null, wrap(flowchart)));
    rsDoc.querySelector(".diagram-flip-btn").click();

    const doc = await getExportedDoc(rsDoc);
    expect(doc.getElementById("respec-diagrams-runtime")).toBeTruthy();

    const exportCard = doc.querySelector(".diagram-container");
    expect(exportCard.querySelector("svg.pele")).toBeTruthy();
    expect(
      exportCard.classList.contains("diagram-container--flipped")
    ).toBeFalse();
    expect(
      exportCard
        .querySelector(".diagram-flip-btn")
        .getAttribute("aria-expanded")
    ).toBe("false");
    expect(
      exportCard.querySelector(".diagram-face--back").hasAttribute("inert")
    ).toBeTrue();

    exportCard.querySelector(".diagram-flip-btn").click();
    expect(
      exportCard.classList.contains("diagram-container--flipped")
    ).toBeTrue();
  });

  it("localizes the flip button's aria-label", async () => {
    const langs = ["en", "cs", "de", "es", "fr", "ja", "ko", "nl", "zh"];
    let enLabel = "";

    for (const lang of langs) {
      const opts = {
        config: makeBasicConfig(),
        htmlAttrs: { lang },
        body: makeDefaultBody() + wrap(flowchart),
      };
      const doc = await makeRSDoc(opts);
      const label = doc
        .querySelector(".diagram-flip-btn")
        .getAttribute("aria-label");

      expect(label).withContext(`lang ${lang}`).toBeTruthy();
      if (lang === "en") {
        enLabel = label;
      } else {
        expect(label).withContext(`lang ${lang}`).not.toBe(enLabel);
      }
    }
  }, 60000);

  describe("copying the source", () => {
    function stubClipboard(win) {
      const copied = [];
      Object.defineProperty(win.navigator, "clipboard", {
        value: {
          writeText: text => {
            copied.push(text);
            return Promise.resolve();
          },
        },
        configurable: true,
      });
      return copied;
    }

    it("copies exactly the source text in live and exported documents", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, wrap(flowchart)));

      let copied = stubClipboard(rsDoc.defaultView);
      rsDoc.querySelector(".respec-button-copy-paste").click();
      await new Promise(r => setTimeout(r, 0));
      expect(copied).toEqual([flowchart]);

      const doc = await getExportedDoc(rsDoc);
      copied = stubClipboard(doc.defaultView);
      doc.querySelector(".respec-button-copy-paste").click();
      await new Promise(r => setTimeout(r, 0));
      expect(copied).toEqual([flowchart]);
    });
  });
});
