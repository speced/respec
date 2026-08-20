"use strict";

import {
  errorFilters,
  flushIframes,
  getExportedDoc,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

const errorsFilter = errorFilters.filter("core/diagrams");

/**
 * Replace the clipboard with a stub whose promises the test can await, instead
 * of sleeping: the copy handler resolves off the very same promise.
 * @param {Document} doc
 * @param {Error} [rejectWith] Reject the write, as a refusing platform does.
 * @returns {Promise<void>[]} Collected writes, filled on each click.
 */
function stubClipboard(doc, rejectWith) {
  const writes = [];
  doc.defaultView.navigator.clipboard.writeText = () => {
    const write = rejectWith
      ? Promise.reject(rejectWith)
      : Promise.resolve(undefined);
    writes.push(write);
    return write;
  };
  return writes;
}

describe("Core - Diagrams", () => {
  afterAll(flushIframes);

  describe("Mermaid rendering", () => {
    it("renders a mermaid diagram to SVG", async () => {
      const body = `
        <figure id="fig-test">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Test diagram</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const svg = doc.querySelector("#fig-test .diagram-container svg");
      expect(svg).toBeTruthy();
    });

    it("includes a toolbar with flip and copy buttons on hover", async () => {
      const body = `
        <figure id="fig-toolbar">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Toolbar test</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const header = doc.querySelector("#fig-toolbar .diagramHeader");
      expect(header).toBeTruthy();
      expect(header.textContent).toContain("Mermaid");
      const flipBtn = doc.querySelector("#fig-toolbar .diagram-flip-btn");
      expect(flipBtn).toBeTruthy();
      const copyBtn = doc.querySelector(
        "#fig-toolbar .respec-button-copy-paste"
      );
      expect(copyBtn).toBeTruthy();
    });

    it("acknowledges a copy with a check, an anchored popover, and a live region", async () => {
      const body = `
        <figure id="fig-ack">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Copy acknowledgement</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // Headless browsers refuse clipboard writes, so stand in for a write the
      // platform accepted, and let the test await that same promise.
      const writes = stubClipboard(doc);
      const copyBtn = doc.querySelector("#fig-ack .respec-button-copy-paste");
      expect(copyBtn.querySelector(".respec-copy-check")).toBeTruthy();
      expect(copyBtn.classList).not.toContain("respec-copied");

      copyBtn.click();
      await Promise.all(writes);

      expect(copyBtn.classList).toContain("respec-copied");
      const toast = doc.getElementById("respec-copy-toast");
      expect(toast.textContent).toBe("Copied!");
      expect(toast.matches(":popover-open")).toBeTrue();
      // The popover positions itself against the button that was clicked.
      expect(copyBtn.style.getPropertyValue("anchor-name")).toBe(
        "--respec-copy-anchor"
      );
      const announcer = doc.getElementById("respec-copy-status");
      expect(announcer.getAttribute("aria-live")).toBe("polite");
      expect(announcer.textContent).toContain("Copied!");
    });

    it("keeps the popover on the most recently copied button", async () => {
      const body = `
        <figure id="fig-one">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>First</figcaption>
        </figure>
        <figure id="fig-two">
          <pre class="mermaid">
            flowchart LR
              C --> D
          </pre>
          <figcaption>Second</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const writes = stubClipboard(doc);
      const [first, second] = doc.querySelectorAll(
        ".diagramHeader .respec-button-copy-paste"
      );

      // Copy the second one late enough that the first button's 2s expiry lands
      // between the two clicks and the assertions below. Real waits, because
      // that expiry is the only moment the bug can show itself.
      first.click();
      await Promise.all(writes);
      await new Promise(resolve => setTimeout(resolve, 1500));
      second.click();
      await Promise.all(writes);
      await new Promise(resolve => setTimeout(resolve, 700));

      // The first button's expiry must not close the second button's popover.
      const toast = doc.getElementById("respec-copy-toast");
      expect(toast.matches(":popover-open")).toBeTrue();
      expect(second.style.getPropertyValue("anchor-name")).toBe(
        "--respec-copy-anchor"
      );
      expect(first.style.getPropertyValue("anchor-name")).toBe("");
    });

    it("still copies from a saved export of the document", async () => {
      const body = `
        <figure id="fig-export">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Exported copy</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const exportedDoc = await getExportedDoc(doc);
      // An export carries no ReSpec, so the inlined runtime is the only copy
      // logic there. This is the one test that exercises that serialized code.
      expect(exportedDoc.getElementById("respec-copy-paste")).toBeTruthy();
      const writes = stubClipboard(exportedDoc);
      const copyBtn = exportedDoc.querySelector(".respec-button-copy-paste");
      expect(copyBtn).toBeTruthy();

      copyBtn.click();
      await Promise.all(writes);

      expect(copyBtn.classList).toContain("respec-copied");
      expect(
        exportedDoc.getElementById("respec-copy-status").textContent
      ).toContain("Copied!");
    });

    it("stays silent when the clipboard refuses the write", async () => {
      const body = `
        <figure id="fig-refused">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Refused copy</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // A cross-origin frame or a denied permission rejects the write. Claiming
      // "Copied!" there would be a lie.
      const writes = stubClipboard(doc, new Error("refused"));
      const copyBtn = doc.querySelector(
        "#fig-refused .respec-button-copy-paste"
      );

      copyBtn.click();
      await Promise.allSettled(writes);

      expect(copyBtn.classList).not.toContain("respec-copied");
      expect(doc.getElementById("respec-copy-toast")).toBeNull();
      expect(doc.getElementById("respec-copy-status")).toBeNull();
    });

    it("preserves the original source in the back face", async () => {
      const body = `
        <figure id="fig-source">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Source test</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const code = doc.querySelector("#fig-source .mermaid-source");
      expect(code).toBeTruthy();
      expect(code.textContent).toContain("flowchart LR");
      expect(code.textContent).toContain("A --> B");
    });

    it("does nothing when no mermaid blocks are present", async () => {
      const body = `<p>No diagrams here.</p>`;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const container = doc.querySelector(".diagram-container");
      expect(container).toBeNull();
    });

    it("silently skips whitespace-only mermaid blocks", async () => {
      const body = `<pre class="mermaid">   </pre>`;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".diagram-container")).toBeNull();
      expect(errorsFilter(doc).length).toBe(0);
    });

    it("injects the runtime script", async () => {
      const body = `
        <figure id="fig-runtime">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Runtime test</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const script = doc.getElementById("respec-diagrams-runtime");
      expect(script).toBeTruthy();
    });

    it("renders multiple diagrams on one page", async () => {
      const body = `
        <figure id="fig-a">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Diagram A</figcaption>
        </figure>
        <figure id="fig-b">
          <pre class="mermaid">
            flowchart LR
              C --> D
          </pre>
          <figcaption>Diagram B</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const containers = doc.querySelectorAll(".diagram-container");
      expect(containers.length).toBe(2);
    });
  });

  describe("Diagram types", () => {
    it("renders a sequence diagram", async () => {
      const body = `
        <figure id="fig-seq">
          <pre class="mermaid">
            sequenceDiagram
              Alice->>Bob: Hello
          </pre>
          <figcaption>Sequence</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const svg = doc.querySelector("#fig-seq .diagram-container svg");
      expect(svg).toBeTruthy();
    });

    it("renders a class diagram", async () => {
      const body = `
        <figure id="fig-class">
          <pre class="mermaid">
            classDiagram
              class Animal
          </pre>
          <figcaption>Class</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const svg = doc.querySelector("#fig-class .diagram-container svg");
      expect(svg).toBeTruthy();
    });

    it("renders a state diagram", async () => {
      const body = `
        <figure id="fig-state">
          <pre class="mermaid">
            stateDiagram-v2
              [*] --> s1
          </pre>
          <figcaption>State</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const svg = doc.querySelector("#fig-state .diagram-container svg");
      expect(svg).toBeTruthy();
    });

    it("renders a pie chart", async () => {
      const body = `
        <figure id="fig-pie">
          <pre class="mermaid">
            pie title Pets
              "Dogs" : 386
              "Cats" : 85
          </pre>
          <figcaption>Pie</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const svg = doc.querySelector("#fig-pie .diagram-container svg");
      expect(svg).toBeTruthy();
    });
  });

  describe("Error handling", () => {
    it("displays inline error for invalid mermaid syntax", async () => {
      const body = `
        <figure id="fig-broken">
          <pre class="mermaid">
            this is not valid mermaid syntax !!!
          </pre>
          <figcaption>Broken diagram</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const errorBlock = doc.querySelector(".diagram-container--error");
      expect(errorBlock).toBeTruthy();
      const errors = errorsFilter(doc);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("error cards start flipped showing source", async () => {
      const body = `
        <figure id="fig-flipped-err">
          <pre class="mermaid">
            invalid!!!syntax
          </pre>
          <figcaption>Error flipped</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const container = doc.querySelector(
        ".diagram-container--error.diagram-container--flipped"
      );
      expect(container).toBeTruthy();
    });

    it("preserves source in error block for debugging", async () => {
      const body = `
        <figure id="fig-debug">
          <pre class="mermaid">
            invalid!!!syntax
          </pre>
          <figcaption>Debug diagram</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const code = doc.querySelector(
        ".diagram-container--error .diagram-source-grid"
      );
      expect(code).toBeTruthy();
      expect(code.textContent).toContain("invalid!!!syntax");
    });

    it("stores clean source in data attribute for copy", async () => {
      const body = `
        <figure id="fig-copy-src">
          <pre class="mermaid">
            bad-syntax!!!
          </pre>
          <figcaption>Copy source</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const container = doc.querySelector(".diagram-container--error");
      expect(container.dataset.diagramSource).toContain("bad-syntax!!!");
    });
  });

  describe("Accessibility", () => {
    it("flip button has aria-expanded attribute", async () => {
      const body = `
        <figure id="fig-aria">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>ARIA test</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const btn = doc.querySelector("#fig-aria .diagram-flip-btn");
      expect(btn.getAttribute("aria-expanded")).toBe("false");
    });

    it("error block flip button starts with aria-expanded=true", async () => {
      const body = `
        <figure id="fig-aria-err">
          <pre class="mermaid">
            invalid!!!
          </pre>
          <figcaption>ARIA error</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const btn = doc.querySelector(
        ".diagram-container--error .diagram-flip-btn"
      );
      expect(btn.getAttribute("aria-expanded")).toBe("true");
    });

    it("flip button carries data attributes for label toggling", async () => {
      const body = `
        <figure id="fig-data">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Data attrs</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const btn = doc.querySelector("#fig-data .diagram-flip-btn");
      expect(btn.dataset.labelSource).toBeTruthy();
      expect(btn.dataset.labelDiagram).toBeTruthy();
    });
  });

  describe("Configuration", () => {
    it("respects mermaid.theme config", async () => {
      const body = `
        <figure id="fig-themed">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Themed diagram</figcaption>
        </figure>
      `;
      const ops = makeStandardOps({ mermaid: { theme: "dark" } }, body);
      const doc = await makeRSDoc(ops);
      const svg = doc.querySelector("#fig-themed .diagram-container svg");
      expect(svg).toBeTruthy();
    });

    it("renders with default theme when mermaid config is absent", async () => {
      const body = `
        <figure id="fig-default">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>Default theme</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const svg = doc.querySelector("#fig-default .diagram-container svg");
      expect(svg).toBeTruthy();
    });
  });

  describe("Highlight exclusion", () => {
    it("does not syntax-highlight the diagram source", async () => {
      const body = `
        <figure id="fig-no-hl">
          <pre class="mermaid">
            flowchart LR
              A --> B
          </pre>
          <figcaption>No highlight</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const sourceCode = doc.querySelector("#fig-no-hl .mermaid-source");
      expect(sourceCode).toBeTruthy();
      expect(sourceCode.classList.contains("hljs")).toBeFalse();
    });
  });

  describe("Security", () => {
    it("does not execute script payloads in diagram labels", async () => {
      const body = `
        <figure id="fig-xss">
          <pre class="mermaid">
            flowchart LR
              A["&lt;img src=x onerror=window.__xss=true&gt;"] --> B
          </pre>
          <figcaption>XSS test</figcaption>
        </figure>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      expect(doc.defaultView.__xss).toBeUndefined();
    });
  });

  it("does not remove author content that reuses a renderer id", async () => {
    // The render id is deterministic (respec-mermaid-diagram-0), and cleanup used
    // to search the whole document for it, so a spec using that id lost the
    // element. See the review note on worker/respec-mermaid.js.
    const body = `
      <section>
        <p id="respec-mermaid-diagram-0">Author content, must survive.</p>
        <figure>
          <pre class="mermaid">
graph TD;
  A-->B;
          </pre>
          <figcaption>Diagram</figcaption>
        </figure>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const victim = doc.getElementById("respec-mermaid-diagram-0");
    expect(victim).toBeTruthy();
    expect(victim.textContent).toContain("must survive");
  });
});
