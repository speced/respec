"use strict";

fdescribe("Core - exporter", () => {
  afterAll(flushIframes);

  async function getExportedDoc(ops) {
    const rsDocToDataURL = await new Promise(resolve => {
      require(["core/exporter"], ({rsDocToDataURL: _rsDocToDataURL}) => {
        resolve(_rsDocToDataURL);
      });
    });
    const doc = await makeRSDoc(ops);
    await doc.respecIsReady;
    const parser = new DOMParser();
    const docString = decodeURIComponent(rsDocToDataURL("text/html", doc))
      .replace("data:text/html;charset=utf-8,", "");
    const exportedDoc = parser.parseFromString(docString, "text/html");
    return exportedDoc;
  }

  it("should remove .removeOnSave elements", async () => {
    const ops = makeStandardOps();
    ops.body = `<div class="removeOnSave" id="this-should-be-removed">this should be removed</div>`;
    const doc = await getExportedDoc(ops);

    expect(doc.getElementById("this-should-be-removed")).toBeFalsy();
    expect(doc.querySelectorAll(".removeOnSave").length).toBe(0);
  });

  it("should cleanup hyperHTML comments", async () => {
    const ops = makeStandardOps();
    ops.body = `<div><!--_hyper: LEAVE;-->PASS<!-- STAY --></div>`;
    const doc = await getExportedDoc(ops);

    const walker = document.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_COMMENT,
    );
    const comments = [];
    while (walker.nextNode()) {
      comments.push(walker.currentNode);
    }

    const hyperComments = comments.filter(
      comment => comment.textContent.startsWith("_hyper"));
    expect(hyperComments.length).toBe(0);

    expect(comments.length).toBe(1);
    expect(comments[0].textContent.trim()).toBe("STAY");
  });
});
