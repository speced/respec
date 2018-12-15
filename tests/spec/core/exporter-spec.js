"use strict";

describe("Core - exporter", () => {
  afterAll(flushIframes);

  async function getExportedDoc(ops) {
    const { rsDocToDataURL } = await new Promise(resolve => {
      require(["core/exporter"], resolve);
    });
    const doc = await makeRSDoc(ops);
    await doc.respecIsReady;
    const parser = new DOMParser();
    const docString = decodeURIComponent(
      rsDocToDataURL("text/html", doc)
    ).replace("data:text/html;charset=utf-8,", "");
    const exportedDoc = parser.parseFromString(docString, "text/html");
    return exportedDoc;
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
});
