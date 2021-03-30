"use strict";

import { flushIframes, makePluginDoc } from "../SpecHelper.js";

describe("Core - highlightVars", () => {
  afterAll(flushIframes);

  const plugins = ["/src/core/highlight-vars.js"];
  const config = { highlightVars: true };

  const body = `
    <section id="section1">
      <p><var id="section1-foo">a foo</var></p>
      <ol>
        <li><var id="section1-bar">bar</var>
        <li><var>a
         foo</foo>
      </ol>
    </section>

    <section id="section2">
      <p><var id="section2-foo">a foo</var></p>
      <ol>
        <li><var>a foo</foo>
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

  const makeDoc = () => makePluginDoc(plugins, { config, body });

  it("toggles highlight class on click", async () => {
    const doc = await makeDoc();
    const elemVar = doc.getElementById("section1-foo");

    elemVar.click(); // enable
    expect(doc.querySelectorAll(".respec-hl")).toHaveSize(2);
    expect(elemVar.classList).toContain("respec-hl");
    expect(elemVar.classList).toContain("respec-hl-c1");

    elemVar.click(); // disable
    expect(doc.querySelectorAll(".respec-hl")).toHaveSize(0);
  });

  it("removes highlight when clicked outside", async () => {
    const doc = await makeDoc();

    const elemVar = doc.getElementById("section1-bar");

    elemVar.click(); // activate
    doc.body.click(); // external click, deactivate
    expect(elemVar.classList).not.toContain("respec-hl");
  });

  it("highlights variables only in current section", async () => {
    const doc = await makeDoc();

    doc.getElementById("section1-foo").click();
    const highlightedSec1 = doc.querySelectorAll("#section1 var.respec-hl");
    let highlightedSec2 = doc.querySelectorAll("#section2 var.respec-hl");
    expect(highlightedSec1).toHaveSize(2);
    expect(highlightedSec2).toHaveSize(0);

    doc.getElementById("section2-foo").click();
    highlightedSec2 = doc.querySelectorAll("#section2 var.respec-hl");
    expect(highlightedSec2).toHaveSize(2);
  });

  it("doesn't overmatch outside its own section's vars", async () => {
    const doc = await makeDoc();
    expect(doc.querySelector("var.respec-hl")).toBeNull();
    doc.getElementById("level-1").click();
    expect(doc.querySelector("#level-1-1.respec-hl")).toBeTruthy();
    const level2 = doc.querySelector("#overmatch > section > .respec-hl");
    expect(level2).toBeNull();
  });
});
