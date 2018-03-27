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

  const getBgColor = el => {
    return el.style.getPropertyValue("--respec-background-color");
  };

  it("toggles highlight class on click", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);
    const elemVar = doc.getElementById("section1-foo");

    elemVar.click(); // enable
    expect(doc.querySelectorAll(".respec-active").length).toBe(2);
    expect(elemVar.classList.contains("respec-active")).toBe(true);
    expect(getBgColor(elemVar)).toBe("yellow");

    elemVar.click(); // disable
    expect(doc.querySelectorAll(".respec-active").length).toBe(0);
  });

  it("removes highlight when clicked outside", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);

    const elemVar = doc.getElementById("section1-bar");

    elemVar.click(); // activate
    doc.body.click(); // external click, deactivate
    expect(elemVar.classList.contains("respec-active")).toBe(false);
  });

  it("highlights variables only in current section", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);

    doc.querySelector("#section1-foo").click();
    const highlightedSec1 = doc.querySelectorAll("#section1 var.respec-active");
    let highlightedSec2 = doc.querySelectorAll("#section2 var.respec-active");
    expect(highlightedSec1.length).toBe(2);
    expect(highlightedSec2.length).toBe(0);

    doc.querySelector("#section2-foo").click();
    highlightedSec2 = doc.querySelectorAll("#section2 var.respec-active");
    expect(highlightedSec2.length).toBe(2);
  });
});
