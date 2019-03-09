"use strict";

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
    expect(doc.querySelectorAll(".removeOnSave").length).toBe(0);
  });

  it("cleans up hyperHTML comments", async () => {
    const ops = makeStandardOps();
    ops.body = `<div><!---LEAVE%-->PASS<!-- STAY --></div>`;
    const doc = await getExportedDoc(ops);

    const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_COMMENT);
    const comments = [];
    while (walker.nextNode()) {
      comments.push(walker.currentNode);
    }

    const hyperComments = comments.filter(
      comment =>
        comment.textContent.startsWith("-") && comment.textContent.endsWith("%")
    );
    expect(hyperComments.length).toBe(0);

    expect(comments.length).toBe(1);
    expect(comments[0].textContent.trim()).toBe("STAY");
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
      "https://www.w3.org/StyleSheets/TR/2016/W3C-ED"
    );
  });
});
