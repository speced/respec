"use strict";

// TODO: add tests:
// - right colors are applied

describe("Core - highlightVars", () => {
  afterAll(flushIframes);
  const testBody = `
    <section id="section1">
      <p><var id="section1-foo">foo</var></p>
      <ol>
        <li><var id="section1-bar">bar</var>
        <li><var> foo</foo>
      </ol>
    </section>

    <section id="section2">
      <p><var id="section2-foo">foo</var></p>
      <ol>
        <li><var>foo</foo>
        <li><var id="section2-bar">bar</var>
      </ol>
    </section>`;

  test("toggles highlight class on click", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);
    const elemVar = doc.getElementById("section1-foo");

    elemVar.click(); // enable
    expect(doc.querySelectorAll(".respec-hl").length).toBe(2);
    expect(elemVar.classList.contains("respec-hl")).toBe(true);
    expect(elemVar.classList.contains("respec-hl-c1")).toBe(true);

    elemVar.click(); // disable
    expect(doc.querySelectorAll(".respec-hl").length).toBe(0);
  });

  test("removes highlight when clicked outside", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);

    const elemVar = doc.getElementById("section1-bar");

    elemVar.click(); // activate
    doc.body.click(); // external click, deactivate
    expect(elemVar.classList.contains("respec-hl")).toBe(false);
  });

  test("highlights variables only in current section", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);

    doc.getElementById("section1-foo").click();
    const highlightedSec1 = doc.querySelectorAll("#section1 var.respec-hl");
    let highlightedSec2 = doc.querySelectorAll("#section2 var.respec-hl");
    expect(highlightedSec1.length).toBe(2);
    expect(highlightedSec2.length).toBe(0);

    doc.getElementById("section2-foo").click();
    highlightedSec2 = doc.querySelectorAll("#section2 var.respec-hl");
    expect(highlightedSec2.length).toBe(2);
  });
});
