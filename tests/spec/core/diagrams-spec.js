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

    expect(card.querySelector(".dg-gutter--error").textContent).toBe("2");

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

  it("keeps click links as anchors without link-to-dfn warnings", async () => {
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

  it("switches to the phone layout at three quarters of each diagram's own width", async () => {
    const wide =
      "flowchart LR\n  A[Author writes text] --> B[Validate] --> C[Render SVG] --> D[Insert in page] --> E[Save HTML] --> F[Publish]";
    let hasAbove = false;
    let hasBelow = false;
    let hasBetween = false;

    for (const width of [900, 760, 400]) {
      const doc = await makeRSDoc(
        makeStandardOps(null, wrap(wide, { figId: "fig-wide" })),
        null,
        `width: ${width}px; display: block`
      );
      const card = doc.querySelector("#fig-wide .diagram-container");
      const desktopSvg = card.querySelector(".diagram-svg--desktop");
      const mobileSvg = card.querySelector(".diagram-svg--mobile");
      const W = desktopSvg.viewBox.baseVal.width;
      const switchPoint = Math.floor(W * 0.75);
      const front = card
        .querySelector(".diagram-face--front")
        .getBoundingClientRect().width;

      if (front > switchPoint + 30) hasAbove = true;
      if (front < switchPoint - 30) hasBelow = true;
      if (front > 640 && front <= switchPoint) hasBetween = true;

      const desktopDisplay =
        doc.defaultView.getComputedStyle(desktopSvg).display;
      const mobileDisplay = doc.defaultView.getComputedStyle(mobileSvg).display;

      if (front <= switchPoint) {
        expect(mobileDisplay).not.toBe("none");
        expect(desktopDisplay).toBe("none");
      } else {
        expect(desktopDisplay).not.toBe("none");
        expect(mobileDisplay).toBe("none");
      }
    }

    expect(hasAbove)
      .withContext("at least one frame is clearly above the switch point")
      .toBeTrue();
    expect(hasBelow)
      .withContext("at least one frame is clearly below the switch point")
      .toBeTrue();
    expect(hasBetween)
      .withContext("at least one frame is between 640px and the switch point")
      .toBeTrue();
  });

  it("gives two diagrams of different widths different switch points", async () => {
    const wide =
      "flowchart LR\n  A[Author writes text] --> B[Validate] --> C[Render SVG] --> D[Insert in page] --> E[Save HTML] --> F[Publish]";
    const medium = "flowchart LR\n  A[Start] --> B[Middle step] --> C[End]";
    const body =
      wrap(wide, { figId: "fig-wide" }) + wrap(medium, { figId: "fig-medium" });

    const doc = await makeRSDoc(
      makeStandardOps(null, body),
      null,
      "width: 760px; display: block"
    );

    const desktopWide = doc.querySelector("#fig-wide .diagram-svg--desktop");
    const desktopMedium = doc.querySelector(
      "#fig-medium .diagram-svg--desktop"
    );

    const wWide = desktopWide.viewBox.baseVal.width;
    const wMedium = desktopMedium.viewBox.baseVal.width;

    expect(wMedium)
      .withContext("medium diagram must be wider than 320px")
      .toBeGreaterThan(320);
    expect(wMedium)
      .withContext("medium diagram must be narrower than wide diagram")
      .toBeLessThan(wWide);

    const frontWide = doc
      .querySelector("#fig-wide .diagram-face--front")
      .getBoundingClientRect().width;
    const frontMedium = doc
      .querySelector("#fig-medium .diagram-face--front")
      .getBoundingClientRect().width;

    expect(frontWide)
      .withContext("front-face width is at or below wide switch point")
      .toBeLessThanOrEqual(Math.floor(wWide * 0.75));
    expect(frontMedium)
      .withContext("front-face width is above medium switch point")
      .toBeGreaterThan(Math.floor(wMedium * 0.75));

    const wideDesktopDisplay =
      doc.defaultView.getComputedStyle(desktopWide).display;
    const wideMobileDisplay = doc.defaultView.getComputedStyle(
      doc.querySelector("#fig-wide .diagram-svg--mobile")
    ).display;
    expect(wideMobileDisplay).not.toBe("none");
    expect(wideDesktopDisplay).toBe("none");

    const mediumDesktopDisplay =
      doc.defaultView.getComputedStyle(desktopMedium).display;
    const mediumMobileDisplay = doc.defaultView.getComputedStyle(
      doc.querySelector("#fig-medium .diagram-svg--mobile")
    ).display;
    expect(mediumDesktopDisplay).not.toBe("none");
    expect(mediumMobileDisplay).toBe("none");
  });

  it("takes its colors from the page variables", async () => {
    const style = "<style>:root:root { --text: #eee; --bg: #111; }</style>";
    const body = style + wrap(flowchart, { figId: "fig-colors" });
    const doc = await makeRSDoc(
      makeStandardOps(null, body),
      null,
      "width: 800px; display: block"
    );
    const card = doc.querySelector("#fig-colors .diagram-container");
    const computed = doc.defaultView.getComputedStyle(card);

    expect(computed.getPropertyValue("--pele-fg").trim()).toBe("#eee");
    expect(computed.getPropertyValue("--pele-bg").trim()).toBe("#111");
  });

  it("paints the error card with the page's issue color", async () => {
    const style = "<style>:root:root { --issue-bg: rgb(1, 2, 3); }</style>";
    const broken = "graph TD\n  A -->";
    const body = style + wrap(broken, { figId: "fig-err" });
    const doc = await makeRSDoc(
      makeStandardOps(null, body),
      null,
      "width: 800px; display: block"
    );
    const errorCard = doc.querySelector("#fig-err .diagram-container--error");

    expect(doc.defaultView.getComputedStyle(errorCard).backgroundColor).toBe(
      "rgb(1, 2, 3)"
    );
  });

  it("keeps an author's figcaption id and labels the card with it", async () => {
    const body = `<figure><pre class="mermaid">${flowchart}</pre><figcaption id="my-caption">Caption</figcaption></figure>`;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const card = doc.querySelector(".diagram-container");
    const cap = card.closest("figure").querySelector("figcaption");
    expect(cap.id).toBe("my-caption");
    expect(card.getAttribute("aria-labelledby")).toBe("my-caption");
  });

  it("shows an error card when the renderer returns something that is not an SVG", async () => {
    const script = `<script>window.pele = { render() { return { svg: "not svg", width: 400 }; } };</script>`;
    const body = script + wrap(flowchart);
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const card = doc.querySelector(".diagram-container");
    expect(card.classList.contains("diagram-container--error")).toBeTrue();
    expect(card.querySelector(".diagram-face--front svg")).toBeNull();
    const errors = errorFilters.filter("core/diagrams")(doc);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("did not return valid SVG");
  });

  it("keeps a single layout when the phone layout is not narrower", async () => {
    const script = `<script>
      window.__calls = [];
      window.pele = {
        render(source, options) {
          window.__calls.push({ options });
          return { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100"><text x="5" y="50">stub</text></svg>', width: 400 };
        }
      };
    </script>`;
    const body = script + wrap(flowchart);
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const calls = doc.defaultView.__calls;
    expect(calls.length).withContext("stub recorded two calls").toBe(2);
    expect(calls[1].options.maxWidth)
      .withContext("second call's options.maxWidth is 320")
      .toBe(320);
    const front = doc.querySelector(".diagram-face--front");
    const svgs = front.querySelectorAll("svg");
    expect(svgs.length).toBe(1);
    expect(svgs[0].classList.contains("diagram-svg--desktop")).toBeTrue();
    expect(front.querySelector(".diagram-svg--mobile")).toBeNull();
  });

  it("sizes the card to the source face when flipped and clears the size when flipped back", async () => {
    const body = wrap(flowchart);
    const doc = await makeRSDoc(
      makeStandardOps(null, body),
      null,
      "display: block; width: 800px"
    );
    const btn = doc.querySelector(".diagram-flip-btn");
    const flip = doc.querySelector(".diagram-flip");
    const back = doc.querySelector(".diagram-face--back");
    expect(back.scrollHeight)
      .withContext("back.scrollHeight is greater than 0")
      .toBeGreaterThan(0);
    btn.click();
    expect(flip.style.minHeight).toBe(`${back.scrollHeight}px`);
    expect(flip.style.minHeight).not.toBe("");
    btn.click();
    expect(flip.style.minHeight).toBe("");
  });

  it("paints the copy icon in the toolbar's text color", async () => {
    const body = wrap(flowchart);
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const btn = doc.querySelector(".diagramHeader .respec-button-copy-paste");
    const svg = btn.querySelector("svg");
    const btnStyle = doc.defaultView.getComputedStyle(btn);
    const svgStyle = doc.defaultView.getComputedStyle(svg);
    expect(svgStyle.fill).toBe(btnStyle.color);
    btn.style.color = "rgb(10, 20, 30)";
    expect(doc.defaultView.getComputedStyle(svg).fill).toBe("rgb(10, 20, 30)");
  });

  it("does not insert an empty style element when no diagram needs a phone layout", async () => {
    const narrowSource = "flowchart LR\n  X --> Y";
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(narrowSource) + wrap(narrowSource))
    );

    const fronts = doc.querySelectorAll(".diagram-face--front");
    expect(fronts)
      .withContext("premise: there are exactly 2 front faces")
      .toHaveSize(2);
    for (const front of fronts) {
      expect(front.querySelectorAll("svg"))
        .withContext("premise: exactly 1 SVG per front face")
        .toHaveSize(1);
    }

    const styles = doc.head.querySelectorAll("style");
    for (const style of styles) {
      expect(style.textContent.trim()).not.toBe("");
      expect(style.textContent).not.toContain("@container");
    }
  });

  it("does not tell the author to flip a card that already shows its source", async () => {
    const doc1 = await makeRSDoc(
      makeStandardOps(null, wrap("graph TD\n  A -->"))
    );
    const errors1 = errorFilters.filter("core/diagrams")(doc1);
    expect(errors1[0].hint).toContain("line 2");
    expect(errors1[0].hint).toContain("marked");
    expect(errors1[0].hint).not.toMatch(/flip/i);

    const doc2 = await makeRSDoc(
      makeStandardOps(null, wrap("flowhcart TD\n  A --> B"))
    );
    const errors2 = errorFilters.filter("core/diagrams")(doc2);
    expect(errors2[0].hint).toContain("flowchart");
    expect(errors2[0].hint).not.toMatch(/flip/i);

    const script = `<script>window.pele = { render() { return { svg: "not svg", width: 400 }; } };</script>`;
    const doc3 = await makeRSDoc(
      makeStandardOps(null, script + wrap(flowchart))
    );
    const errors3 = errorFilters.filter("core/diagrams")(doc3);
    expect(errors3[0].hint).toBe("The card shows the diagram source.");
    expect(errors3[0].hint).not.toMatch(/flip/i);
  });

  it("shows the failing line inside the card when the source is long", async () => {
    const longBrokenSource = [
      "flowchart TD",
      "  A1 --> A2",
      "  A2 --> A3",
      "  A3 --> A4",
      "  A4 --> A5",
      "  A5 --> A6",
      "  A6 --> A7",
      "  A7 --> A8",
      "  A8 --> A9",
      "  A9 --> A10",
      "  A10 --> A11",
      "  A11 --> A12",
      "  A12 --> A13",
      "  M[unclosed --> N",
      "  N --> O",
    ].join("\n");

    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(longBrokenSource)),
      null,
      "display: block; width: 900px"
    );
    const container = doc.querySelector(".diagram-container");

    expect(container.classList.contains("diagram-container--error"))
      .withContext("premise: diagram failed, rendered as error card")
      .toBeTrue();

    const back = container.querySelector(".diagram-face--back");
    expect(back.scrollHeight)
      .withContext("premise: source is tall enough to make scrollHeight > 200")
      .toBeGreaterThan(200);

    const errLine = container.querySelector(".dg-code--error");
    expect(errLine)
      .withContext("premise: a marked failing line exists")
      .toBeTruthy();

    expect(back.scrollHeight).toBeLessThanOrEqual(back.clientHeight);

    const backRect = back.getBoundingClientRect();
    const errRect = errLine.getBoundingClientRect();
    expect(errRect.top).toBeGreaterThanOrEqual(backRect.top);
    expect(errRect.bottom).toBeLessThanOrEqual(backRect.bottom);
  });

  it("wraps a long error message instead of clipping it", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(
        null,
        wrap("flowchart TD\n  M[unclosed --> N\n  N --> O")
      ),
      null,
      "display: block; width: 360px"
    );

    const hintCell = doc.querySelector(".dg-code--hint");
    expect(hintCell)
      .withContext("premise: error message cell exists")
      .toBeTruthy();
    expect(hintCell.textContent.length)
      .withContext("premise: text content is longer than 60 characters")
      .toBeGreaterThan(60);

    const grid = doc.querySelector(".diagram-source-grid");
    const hintRect = hintCell.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();

    expect(hintRect.right).toBeLessThanOrEqual(gridRect.right + 1);
    expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth + 1);
  });

  it("removes script, event handlers, foreignObject and script URLs from the renderer's SVG", async () => {
    const evilSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" onload="window.__ran = 6"><script>window.__ran = 1</script><g onclick="window.__ran = 2"></g><a href="javascript:window.__ran = 3"><text>A</text></a><a xlink:href="javascript:window.__ran = 4"></a><a href="data:text/html,x"></a><foreignObject><div xmlns="http://www.w3.org/1999/xhtml" onmouseover="window.__ran = 5">x</div></foreignObject><a href="https://example.com/ok"><text>B</text></a></svg>';
    const script = `<script>window.pele = { render() { return { svg: ${JSON.stringify(evilSvg).replace(/</g, "\\u003c")}, width: 200 }; } };</script>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, script + wrap(flowchart))
    );
    const card = doc.querySelector(".diagram-container");

    expect(card.classList.contains("diagram-container--error"))
      .withContext("card should not be an error card")
      .toBeFalse();

    const svgs = card.querySelectorAll(".diagram-face--front svg");
    expect(svgs).toHaveSize(1);
    const svg = svgs[0];

    expect(svg.querySelectorAll("script")).toHaveSize(0);
    expect(svg.querySelectorAll("foreignObject")).toHaveSize(0);

    const allElements = [svg, ...svg.querySelectorAll("*")];
    for (const el of allElements) {
      for (const attr of el.attributes) {
        expect(attr.name.toLowerCase().startsWith("on")).toBeFalse();
        if (attr.name === "href" || attr.name === "xlink:href") {
          const val = attr.value.trim().toLowerCase();
          expect(val.startsWith("javascript:")).toBeFalse();
          expect(val.startsWith("data:")).toBeFalse();
        }
      }
    }

    const safeLinks = svg.querySelectorAll("a");
    let foundSafe = false;
    for (const link of safeLinks) {
      const href = link.getAttribute("href") || link.getAttribute("xlink:href");
      if (href === "https://example.com/ok") {
        foundSafe = true;
      }
    }
    expect(foundSafe).toBeTrue();

    expect(doc.defaultView.__ran).toBeUndefined();
  });

  it("removes obfuscated and namespaced script content from the renderer's SVG", async () => {
    const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:foo="http://www.w3.org/1999/xlink" xmlns:svg="http://www.w3.org/2000/svg">
      <a href="java&#x09;script:window.__ran = 1"><text>A</text></a>
      <a href="&#x0A; JaVaScRiPt:window.__ran = 2"><text>B</text></a>
      <a foo:href="javascript:window.__ran = 3"><text>C</text></a>
      <a xlink:href="data:text/html,x"><text>D</text></a>
      <svg:script>window.__ran = 4</svg:script>
      <animate href="#t" attributeName="href" values="javascript:window.__ran = 5"/>
      <set href="#t" attributeName="href" to="javascript:window.__ran = 6"/>
      <a id="t" href="https://example.com/ok"><text>E</text></a>
    </svg>`;
    const safeSvg = JSON.stringify(rawSvg).replace(/</g, "\\u003c");
    const script = `<script>window.pele = { render() { return { svg: ${safeSvg}, width: 200 }; } };</script>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, script + wrap(flowchart))
    );

    const card = doc.querySelector(".diagram-container");
    expect(card.classList.contains("diagram-container--error"))
      .withContext("the card is not an error card")
      .toBeFalse();

    const svgs = card.querySelectorAll(".diagram-face--front svg");
    expect(svgs.length)
      .withContext(".diagram-face--front holds exactly one SVG")
      .toBe(1);

    const svg = svgs[0];
    const allElements = [svg, ...svg.querySelectorAll("*")];
    const prohibitedLocalNames = ["script", "animate", "set", "foreignObject"];

    for (const el of allElements) {
      expect(prohibitedLocalNames).not.toContain(el.localName);
      for (const attr of el.attributes) {
        expect(attr.localName.toLowerCase().startsWith("on")).toBeFalse();
        if (attr.localName === "href") {
          const cleanVal = [...attr.value]
            .filter(ch => ch.charCodeAt(0) > 32)
            .join("")
            .toLowerCase();
          expect(cleanVal.startsWith("javascript:")).toBeFalse();
          expect(cleanVal.startsWith("data:")).toBeFalse();
        }
      }
    }

    const anchors = svg.querySelectorAll("a");
    expect(anchors.length).toBe(5);

    let hrefCount = 0;
    let hasSafeHref = false;
    for (const a of anchors) {
      for (const attr of a.attributes) {
        if (attr.localName === "href") {
          hrefCount++;
          if (attr.value === "https://example.com/ok") {
            hasSafeHref = true;
          }
        }
      }
    }

    expect(hrefCount).toBe(1);
    expect(hasSafeHref).toBeTrue();
    expect(doc.defaultView.__ran).toBeUndefined();
  });

  it("shows a card's toolbar after a touch tap and hides the others", async () => {
    const bodyHtml =
      wrap(flowchart, { figId: "fig-a" }) + wrap(flowchart, { figId: "fig-b" });
    const doc = await makeRSDoc(
      makeStandardOps(null, bodyHtml),
      null,
      "display: block; width: 900px"
    );
    const win = doc.defaultView;
    const cardA = doc
      .getElementById("fig-a")
      .querySelector(".diagram-container");
    const toolbarA = cardA.querySelector(".diagramHeader");
    const cardB = doc
      .getElementById("fig-b")
      .querySelector(".diagram-container");
    const toolbarB = cardB.querySelector(".diagramHeader");

    expect(cardA.classList.contains("diagram-container--active"))
      .withContext("premise: A not active")
      .toBeFalse();
    expect(win.getComputedStyle(toolbarA).pointerEvents)
      .withContext("premise: A none")
      .toBe("none");
    expect(cardB.classList.contains("diagram-container--active"))
      .withContext("premise: B not active")
      .toBeFalse();
    expect(win.getComputedStyle(toolbarB).pointerEvents)
      .withContext("premise: B none")
      .toBe("none");

    cardA.querySelector(".diagram-face--front").dispatchEvent(
      new win.PointerEvent("pointerdown", {
        pointerType: "touch",
        bubbles: true,
      })
    );

    expect(cardA.classList.contains("diagram-container--active")).toBeTrue();
    expect(win.getComputedStyle(toolbarA).pointerEvents).toBe("auto");
    expect(cardB.classList.contains("diagram-container--active")).toBeFalse();
    expect(win.getComputedStyle(toolbarB).pointerEvents).toBe("none");

    cardB.querySelector(".diagram-face--front").dispatchEvent(
      new win.PointerEvent("pointerdown", {
        pointerType: "touch",
        bubbles: true,
      })
    );

    expect(cardB.classList.contains("diagram-container--active")).toBeTrue();
    expect(win.getComputedStyle(toolbarB).pointerEvents).toBe("auto");
    expect(cardA.classList.contains("diagram-container--active")).toBeFalse();
    expect(win.getComputedStyle(toolbarA).pointerEvents).toBe("none");
  });

  it("hides the toolbar when a touch lands outside every card", async () => {
    const bodyHtml = `${wrap(flowchart)}<p id="outside">text</p>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, bodyHtml),
      null,
      "display: block; width: 900px"
    );
    const win = doc.defaultView;
    const card = doc.querySelector(".diagram-container");
    const toolbar = card.querySelector(".diagramHeader");
    const outside = doc.getElementById("outside");

    card.querySelector(".diagram-face--front").dispatchEvent(
      new win.PointerEvent("pointerdown", {
        pointerType: "touch",
        bubbles: true,
      })
    );
    expect(card.classList.contains("diagram-container--active"))
      .withContext("premise: card activated")
      .toBeTrue();
    expect(win.getComputedStyle(toolbar).pointerEvents)
      .withContext("premise: toolbar auto")
      .toBe("auto");

    outside.dispatchEvent(
      new win.PointerEvent("pointerdown", {
        pointerType: "touch",
        bubbles: true,
      })
    );

    expect(card.classList.contains("diagram-container--active")).toBeFalse();
    expect(win.getComputedStyle(toolbar).pointerEvents).toBe("none");
  });

  it("a mouse press clears an active card elsewhere but never activates a card", async () => {
    const body =
      wrap(flowchart, { figId: "fig-a" }) + wrap(flowchart, { figId: "fig-b" });
    const doc = await makeRSDoc(
      makeStandardOps(null, body),
      null,
      "display: block; width: 800px"
    );
    const cardA = doc
      .getElementById("fig-a")
      .querySelector(".diagram-container");
    const cardB = doc
      .getElementById("fig-b")
      .querySelector(".diagram-container");

    cardA.dispatchEvent(
      new doc.defaultView.PointerEvent("pointerdown", {
        pointerType: "mouse",
        bubbles: true,
      })
    );
    expect(cardA.classList).not.toContain("diagram-container--active");

    cardA.dispatchEvent(
      new doc.defaultView.PointerEvent("pointerdown", {
        pointerType: "touch",
        bubbles: true,
      })
    );
    expect(cardA.classList)
      .withContext("card A should be active after touch tap")
      .toContain("diagram-container--active");
    cardB.dispatchEvent(
      new doc.defaultView.PointerEvent("pointerdown", {
        pointerType: "mouse",
        bubbles: true,
      })
    );
    expect(cardA.classList).not.toContain("diagram-container--active");
    expect(cardB.classList).not.toContain("diagram-container--active");

    cardA.dispatchEvent(
      new doc.defaultView.PointerEvent("pointerdown", {
        pointerType: "touch",
        bubbles: true,
      })
    );
    expect(cardA.classList)
      .withContext("card A should be active again after touch tap")
      .toContain("diagram-container--active");
    cardA.querySelector(".diagram-face--front").dispatchEvent(
      new doc.defaultView.PointerEvent("pointerdown", {
        pointerType: "mouse",
        bubbles: true,
      })
    );
    expect(cardA.classList).toContain("diagram-container--active");
  });

  it("treats a pen like a touch", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(flowchart)),
      null,
      "display: block; width: 900px"
    );
    const win = doc.defaultView;
    const card = doc.querySelector(".diagram-container");

    card.querySelector(".diagram-face--front").dispatchEvent(
      new win.PointerEvent("pointerdown", {
        pointerType: "pen",
        bubbles: true,
      })
    );
    expect(card.classList.contains("diagram-container--active")).toBeTrue();
  });

  it("always shows the toolbar of an error card", async () => {
    const brokenDiagram = `graph TD\n  A -->`;
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(brokenDiagram)),
      null,
      "display: block; width: 900px"
    );
    const win = doc.defaultView;
    const card = doc.querySelector(".diagram-container");
    const toolbar = card.querySelector(".diagramHeader");

    expect(card.classList.contains("diagram-container--error")).toBeTrue();
    expect(win.getComputedStyle(toolbar).pointerEvents).toBe("auto");
  });

  it("saves no active state and keeps the tap script working in the saved copy", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap(flowchart)),
      null,
      "display: block; width: 900px"
    );
    const win = doc.defaultView;
    const card = doc.querySelector(".diagram-container");

    card.querySelector(".diagram-face--front").dispatchEvent(
      new win.PointerEvent("pointerdown", {
        pointerType: "touch",
        bubbles: true,
      })
    );
    expect(card.classList.contains("diagram-container--active"))
      .withContext("premise: card activated in live doc")
      .toBeTrue();

    const savedDoc = await getExportedDoc(doc);
    const savedWin = savedDoc.defaultView;
    const savedCard = savedDoc.querySelector(".diagram-container");

    expect(
      savedCard.classList.contains("diagram-container--active")
    ).toBeFalse();

    savedCard.querySelector(".diagram-face--front").dispatchEvent(
      new savedWin.PointerEvent("pointerdown", {
        pointerType: "touch",
        bubbles: true,
      })
    );
    expect(
      savedCard.classList.contains("diagram-container--active")
    ).toBeTrue();
  });

  it("keeps an error card's toolbar tappable after flipping it back", async () => {
    const doc = await makeRSDoc(
      makeStandardOps(null, wrap("graph TD\n  A -->")),
      null,
      "display: block; width: 800px"
    );
    const card = doc.querySelector(".diagram-container");
    const toolbar = card.querySelector(".diagramHeader");
    const flipBtn = card.querySelector(".diagram-flip-btn");

    expect(card.classList)
      .withContext("premise: has error class")
      .toContain("diagram-container--error");
    expect(card.classList)
      .withContext("premise: has flipped class")
      .toContain("diagram-container--flipped");
    expect(doc.defaultView.getComputedStyle(toolbar).pointerEvents)
      .withContext("premise: initial pointer-events is auto")
      .toBe("auto");

    flipBtn.click();

    expect(card.classList)
      .withContext("premise: flipped class removed")
      .not.toContain("diagram-container--flipped");
    expect(card.classList)
      .withContext("premise: error class kept")
      .toContain("diagram-container--error");

    expect(doc.defaultView.getComputedStyle(toolbar).pointerEvents).toBe(
      "auto"
    );
  });

  it("removes elements outside the SVG namespace and style elements from the renderer's SVG", async () => {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><iframe xmlns="http://www.w3.org/1999/xhtml" srcdoc="&lt;script&gt;parent.__ran = 1&lt;/script&gt;"/><object xmlns="http://www.w3.org/1999/xhtml" data="javascript:parent.__ran = 2"/><embed xmlns="http://www.w3.org/1999/xhtml" src="javascript:parent.__ran = 3"/><style>*{display:none}</style><div xmlns="http://www.w3.org/1999/xhtml">x</div><g class="keep"><text>ok</text></g></svg>`;
    const safeStr = JSON.stringify(svgStr).replace(/</g, "\\u003c");
    const stub = `<script>window.pele = { render() { return { svg: ${safeStr}, width: 200 }; } };</script>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, stub + wrap(flowchart)),
      null,
      "display: block; width: 800px"
    );

    const card = doc.querySelector(".diagram-container");
    expect(card.classList)
      .withContext("not an error card")
      .not.toContain("diagram-container--error");
    const frontSvgs = card.querySelectorAll(".diagram-face--front svg");
    expect(frontSvgs.length).withContext("exactly one SVG").toBe(1);

    const svg = frontSvgs[0];
    const localNames = Array.from(svg.querySelectorAll("*")).map(
      el => el.localName
    );
    expect(localNames).not.toContain("iframe");
    expect(localNames).not.toContain("object");
    expect(localNames).not.toContain("embed");
    expect(localNames).not.toContain("style");
    expect(localNames).not.toContain("div");
    expect(doc.querySelectorAll("iframe").length).toBe(0);
    expect(doc.defaultView.__ran).toBeUndefined();
    expect(svg.querySelector("g.keep")).not.toBeNull();
  });

  it("shows an error card when the renderer's SVG is malformed after a correct start", async () => {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg"><text>a & b</text></svg>`;
    const safeStr = JSON.stringify(svgStr).replace(/</g, "\\u003c");
    const stub = `<script>window.pele = { render() { return { svg: ${safeStr}, width: 200 }; } };</script>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, stub + wrap(flowchart)),
      null,
      "display: block; width: 800px"
    );

    const card = doc.querySelector(".diagram-container");
    expect(card.classList).toContain("diagram-container--error");
    expect(card.querySelector(".diagram-face--front svg.pele")).toBeNull();

    const errors = errorFilters.filter("core/diagrams")(doc);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("did not return valid SVG");
  });

  it("marks the last source line when the renderer reports a line past the end", async () => {
    const source = `graph TD\n  A --> B`;
    const stub = `<script>window.pele = { render() { const e = new Error("boom"); e.line = 9; e.code = "syntax"; throw e; } };</script>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, stub + wrap(source)),
      null,
      "display: block; width: 800px"
    );

    const card = doc.querySelector(".diagram-container");
    expect(card.classList).toContain("diagram-container--error");

    const errorGutter = card.querySelector(".dg-gutter--error");
    expect(errorGutter.textContent.trim()).toBe("2");

    const codeHint = card.querySelector(".dg-code--hint");
    expect(codeHint.textContent).toContain("boom");

    const errors = errorFilters.filter("core/diagrams")(doc);
    expect(errors.length).toBe(1);
    expect(errors[0].hint).toContain("line 2");
  });

  it("keeps good cards and error cards inside their figures", async () => {
    const bodyHtml =
      wrap("flowchart LR\n  X --> Y") + wrap("graph TD\n  A -->");
    const doc = await makeRSDoc(
      makeStandardOps(null, bodyHtml),
      null,
      "display: block; width: 360px"
    );

    const errorCards = doc.querySelectorAll(".diagram-container--error");
    expect(errorCards.length).withContext("has one error card").toBe(1);

    const goodCards = doc.querySelectorAll(
      ".diagram-container:not(.diagram-container--error)"
    );
    expect(goodCards.length).withContext("has one other card").toBe(1);

    const allCards = doc.querySelectorAll(".diagram-container");
    for (const card of allCards) {
      const figure = card.closest("figure");
      const style = doc.defaultView.getComputedStyle(figure);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);
      const contentWidth = figure.clientWidth - paddingLeft - paddingRight;

      expect(card.getBoundingClientRect().width).toBeLessThanOrEqual(
        contentWidth + 0.5
      );
    }
  });
});
