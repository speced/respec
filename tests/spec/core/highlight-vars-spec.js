"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

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
    </section>

    <section id="overmatch">
      <p><var id="level-1">foo</var></p>
      <p><var id="level-1-1">foo</var></p>
      <section>
        <p><var id="level-2">foo</var></p>
      </section>
    </section>
    `;

  it("toggles highlight class on click", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);
    const elemVar = doc.getElementById("section1-foo");

    elemVar.click(); // enable
    expect(doc.querySelectorAll(".respec-hl").length).toBe(2);
    expect(elemVar.classList).toContain("respec-hl");
    expect(elemVar.classList).toContain("respec-hl-c1");

    elemVar.click(); // disable
    expect(doc.querySelectorAll(".respec-hl").length).toBe(0);
  });

  it("removes highlight when clicked outside", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);

    const elemVar = doc.getElementById("section1-bar");

    elemVar.click(); // activate
    doc.body.click(); // external click, deactivate
    expect(elemVar.classList).not.toContain("respec-hl");
  });

  it("highlights variables only in current section", async () => {
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

  it("doesn't overmatch outside its own section's vars", async () => {
    const ops = makeStandardOps({ highlightVars: true }, testBody);
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("var.respec-hl")).toBeNull();
    doc.getElementById("level-1").click();
    expect(doc.querySelector("#level-1-1.respec-hl")).toBeTruthy();
    const level2 = doc.querySelector("#overmatch > section > .respec-hl");
    expect(level2).toBeNull();
  });
});
