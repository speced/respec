"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core - Tables", () => {
  afterAll(flushIframes);
  it("creates autolinks from the anchor to the table", async () => {
    const body = `
       <table id='tab' class='numbered'>
        <caption>test table caption</caption>
       </table>
       <a id='anchor-tab-title-empty' title='' href='#tab'></a>
       <a id='anchor-tab-title-set' title='pass' href='#tab'></a>
       <a id='anchor-tab' href='#tab'></a>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const anchorTab = doc.getElementById("anchor-tab");
    const anchorTabTitleSet = doc.getElementById("anchor-tab-title-set");
    const anchorTabTitleEmpty = doc.getElementById("anchor-tab-title-empty");

    expect(anchorTab.textContent).toBe("Table 1");
    expect(anchorTab.title).toBe("test table caption");

    expect(anchorFigTitleSet.textContent).toBe("Table 1");
    expect(anchorFigTitleSet.title).toBe("pass");

    expect(anchorFigTitleEmpty.textContent).toBe("Table 1");
    expect(anchorFigTitleEmpty.title).toBe("");
  });

  it("localizes the anchor of table", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "ja",
      },
      body: `${makeDefaultBody()}<table id='tab' class='numbered'>
        <caption>漢字と仮名のサイズの示し方</caption>
       </table>
       <a id='anchor-tab' href='#tab'></a>`,
    };
    const doc = await makeRSDoc(ops);
    const anchorFig = doc.getElementById("anchor-tab");
    expect(anchorFig.innerText).toBe("図 1");
    expect(anchorFig.title).toBe("漢字と仮名のサイズの示し方");
  });

  it("generates list of tables", async () => {
    const body = `
      <table class='numbered'>
        <caption>test 1</caption>
      </table>
      <table class='numbered'>
        <caption>test 2</caption>
      </table>
      <section id=tot></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const tot = doc.getElementById("tot");
    const totHeader = tot.querySelector("h2");
    const totItems = tot.querySelectorAll("ul li");
    const tabLinks = tot.querySelectorAll("ul li a");
    expect(tot.querySelector("caption")).toBeNull();
    expect(totHeader).toBeTruthy();
    expect(totHeader.textContent).toBe("1. List of Tables");
    expect(totItems).toHaveSize(2);
    expect(tabLinks[0].textContent).toBe("Table 1 test 1");
    expect(tabLinks[1].textContent).toBe("Table 2 test 2");
  });

  it("warns when no <caption>", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "ja",
      },
      body: `${makeDefaultBody()}<table id='tab' class='numbered'></table>`,
    };
    const doc = await makeRSDoc(ops);
    const anchorFig = doc.getElementById("tab");
    expect(anchorFig.classList).toContain("respec-offending-element");
  });

  it("excludes tables with no <caption>", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "ja",
      },
      body: `${makeDefaultBody()}
      <table class='numbered'></table>
      <table class='numbered'><caption>Geralt of Rivia</caption</table>
      <section id='tot'></section>`,
    };
    const doc = await makeRSDoc(ops);
    const tot = doc.getElementById("tot");
    const totItems = tot.querySelectorAll("ul li");
    expect(tot.querySelector("caption")).toBeNull();
    expect(totItems).toHaveSize(1);
  });
});
