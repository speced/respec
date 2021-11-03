"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - exporter", () => {
  afterAll(flushIframes);

  async function getExportedDoc(ops) {
    const doc = await makeRSDoc(ops);
    const dataURL = await new Promise(resolve => {
      doc.defaultView.require(["core/exporter"], ({ rsDocToDataURL }) =>
        resolve(rsDocToDataURL("text/html", doc))
      );
    });
    const docString = decodeURIComponent(dataURL).replace(
      "data:text/html;charset=utf-8,",
      ""
    );
    return new DOMParser().parseFromString(docString, "text/html");
  }

  it("removes .removeOnSave elements", async () => {
    const ops = makeStandardOps();
    ops.body = `<div class="removeOnSave" id="this-should-be-removed">this should be removed</div>`;
    const doc = await getExportedDoc(ops);

    expect(doc.getElementById("this-should-be-removed")).toBeFalsy();
    expect(doc.querySelectorAll(".removeOnSave")).toHaveSize(0);
  });

  it("removes all comments", async () => {
    const ops = makeStandardOps();
    ops.body = `<div><!-- remove -->PASS <span><!-- remove --></span></div>`;
    const doc = await getExportedDoc(ops);

    const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_COMMENT);
    const comments = [];
    while (walker.nextNode()) {
      comments.push(walker.currentNode);
    }
    expect(comments).toHaveSize(0);
  });

  it("removes temporary element attributes", async () => {
    const body = `
      <a
        id="ANCHOR"
        data-keep-me="FOO"
        data-cite="rfc6454#section-3.2"
        data-xref-type="dfn"
        >origin</a
      >
      <dfn
        id="DFN"
        data-keep-me="BAR"
        data-cite="?rfc6454"
        data-cite-frag="section-3.2"
        >origin</dfn
      >
    `;
    const ops = makeStandardOps(null, body);
    const doc = await getExportedDoc(ops);

    const anchor = doc.getElementById("ANCHOR");
    expect(anchor.hasAttribute("data-cite")).toBeFalse();
    expect(anchor.hasAttribute("data-cite-frag")).toBeFalse();
    expect(anchor.hasAttribute("data-cite-path")).toBeFalse();
    expect(anchor.hasAttribute("data-xref-type")).toBeFalse();
    expect(anchor.hasAttribute("data-keep-me")).toBeTrue();

    const dfn = doc.getElementById("DFN");
    expect(dfn.hasAttribute("data-cite")).toBeFalse();
    expect(dfn.hasAttribute("data-cite-frag")).toBeFalse();
    expect(dfn.hasAttribute("data-cite-path")).toBeFalse();
    expect(dfn.hasAttribute("data-keep-me")).toBeTrue();
  });

  it("moves the W3C style sheet to be last thing in documents head", async () => {
    const ops = makeStandardOps();
    ops.body = `
      <!-- add WebIDL style -->
      <pre class="idl">
        interface Foo {};
      </pre>
      <!-- add examples and hljs styles -->
      <pre class="example js">
        function Foo(){};
      </pre>`;
    const doc = await getExportedDoc(ops);
    const { lastElementChild } = doc.head;
    expect(lastElementChild.href).toBe(
      "https://www.w3.org/StyleSheets/TR/2021/W3C-ED"
    );
  });
});
