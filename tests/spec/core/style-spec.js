import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Style", () => {
  afterAll(flushIframes);
  it("includes ReSpec's style element", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const style = doc.getElementById("respec-mainstyle");
    expect(style).toBeTruthy();
  });

  it("inserts respec-mainstyle before author-provided stylesheets", async () => {
    const ops = makeStandardOps(
      {},
      "<section id='sotd'><p>foo</p></section><section id='toc'></section>"
    );
    ops.head =
      '<link rel="stylesheet" href="data:text/css," class="custom-author-style">';
    const doc = await makeRSDoc(ops);
    const respecStyle = doc.getElementById("respec-mainstyle");
    const authorLink = doc.querySelector("link.custom-author-style");
    expect(respecStyle).toBeTruthy();
    expect(authorLink).toBeTruthy();
    // Bitmask: Node.DOCUMENT_POSITION_FOLLOWING = 4 means respecStyle comes before authorLink
    const position = respecStyle.compareDocumentPosition(authorLink);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
