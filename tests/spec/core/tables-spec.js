"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - Tables", () => {
  afterAll(flushIframes);
  it("creates autolinks from the anchor to the table", async () => {
    const body = `
       <table id='tab' class='numbered'>
        <caption>test table caption</caption>
       </table>
       <a id='anchor-table-title-empty' title='' href='#tab'></a>
       <a id='anchor-table-title-set' title='pass' href='#tab'></a>
       <a id='anchor-table' href='#tab'></a>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const anchorTab = doc.getElementById("anchor-table");
    const anchorTabTitleSet = doc.getElementById("anchor-table-title-set");
    const anchorTabTitleEmpty = doc.getElementById("anchor-table-title-empty");

    expect(anchorTab.textContent).toBe("Table 1");
    expect(anchorTab.title).toBe("test table caption");

    expect(anchorTabTitleSet.textContent).toBe("Table 1");
    expect(anchorTabTitleSet.title).toBe("pass");

    expect(anchorTabTitleEmpty.textContent).toBe("Table 1");
    expect(anchorTabTitleEmpty.title).toBe("");
  });

  it("creates autolinks from the caption to the table", async () => {
    const body = `
       <table id='tab' class='numbered'>
        <caption>test table caption</caption>
       </table>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const caption = doc.getElementsByTagName("caption")[0];
    const link = caption.querySelector("a");

    expect(link.classList).toContain("self-link");
    expect(link.hash).toBe("#tab");
  });

  it("generates list of tables", async () => {
    const body = `
      <table class='numbered'>
        <caption>test 1</caption>
      </table>
      <table class='numbered'>
        <caption>test 2</caption>
      </table>
      <section id='list-of-tables'></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const listOfTables = doc.getElementById("list-of-tables");
    const listOfTablesHeader = listOfTables.querySelector("h2");
    const listOfTablesItems = listOfTables.querySelectorAll("ul li");
    const tableLinks = listOfTables.querySelectorAll("ul li a");
    expect(listOfTables.querySelector("caption")).toBeNull();
    expect(listOfTablesHeader).toBeTruthy();
    expect(listOfTablesHeader.textContent).toBe("1. List of Tables");
    expect(listOfTablesItems).toHaveSize(2);
    expect(tableLinks[0].textContent).toBe("Table 1 test 1");
    expect(tableLinks[1].textContent).toBe("Table 2 test 2");
  });
});
