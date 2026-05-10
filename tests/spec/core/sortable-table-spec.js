"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — sortable-table", () => {
  afterAll(flushIframes);

  /**
   * Helper: dispatch a click event on an element inside the doc.
   * @param {HTMLElement} el
   */
  function click(el) {
    el.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );
  }

  // Table used in most tests
  const sortableBody = `
    <section>
      <h2>Test Section</h2>
      <table class="sortable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Charlie</td><td>3</td></tr>
          <tr><td>Alice</td><td>1</td></tr>
          <tr><td>Bob</td><td>2</td></tr>
        </tbody>
      </table>
    </section>
  `;

  describe("module bootstrap", () => {
    it("does not run when no sortable table is present", async () => {
      const body = `<table><tr><td>plain table</td></tr></table>`;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const script = doc.getElementById("respec-sortable-table");
      expect(script).toBeNull();
    });

    it("injects the runtime script when a sortable table exists", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const script = doc.getElementById("respec-sortable-table");
      expect(script).not.toBeNull();
    });

    it("injects a <style> element for sortable-table CSS", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      // The style element is injected into <head>; check it contains our marker class.
      const headStyles = [...doc.querySelectorAll("head style")];
      const found = headStyles.some(s => s.textContent.includes(".sortable"));
      expect(found).toBeTrue();
    });
  });

  describe("sort buttons", () => {
    it("adds a sort button to each <th> in the sortable table", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const ths = doc.querySelectorAll("table.sortable thead th");
      for (const th of ths) {
        const btn = th.querySelector("button");
        expect(btn).not.toBeNull();
      }
    });

    it("buttons start with aria-label 'Sort by <column>'", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const ths = [...doc.querySelectorAll("table.sortable thead th")];
      const btn0 = ths[0].querySelector("button");
      expect(btn0.getAttribute("aria-label")).toBe("Sort by Name");
    });

    it("does not add sort buttons to non-sortable tables", async () => {
      const body = `
        ${sortableBody}
        <table class="plain">
          <thead><tr><th>Foo</th></tr></thead>
          <tbody><tr><td>bar</td></tr></tbody>
        </table>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const plainThBtn = doc.querySelector("table.plain thead th button");
      expect(plainThBtn).toBeNull();
    });
  });

  describe("aria-sort attribute", () => {
    it("has no aria-sort before any click", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const th = doc.querySelector("table.sortable thead th");
      expect(th.hasAttribute("aria-sort")).toBeFalse();
    });

    it("sets aria-sort='ascending' after first click", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const th = doc.querySelector("table.sortable thead th");
      click(th.querySelector("button"));
      expect(th.getAttribute("aria-sort")).toBe("ascending");
    });

    it("sets aria-sort='descending' after second click", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const th = doc.querySelector("table.sortable thead th");
      const btn = th.querySelector("button");
      click(btn);
      click(btn);
      expect(th.getAttribute("aria-sort")).toBe("descending");
    });

    it("removes aria-sort and restores order after third click", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const th = doc.querySelector("table.sortable thead th");
      const btn = th.querySelector("button");
      click(btn);
      click(btn);
      click(btn);
      expect(th.hasAttribute("aria-sort")).toBeFalse();
    });

    it("resets aria-sort on other columns when a new column is clicked", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const [th0, th1] = doc.querySelectorAll("table.sortable thead th");
      click(th0.querySelector("button"));
      expect(th0.getAttribute("aria-sort")).toBe("ascending");
      click(th1.querySelector("button"));
      expect(th1.getAttribute("aria-sort")).toBe("ascending");
      expect(th0.hasAttribute("aria-sort")).toBeFalse();
    });
  });

  describe("text sort", () => {
    it("sorts rows ascending (A→Z) on first click", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const th = doc.querySelector("table.sortable thead th");
      click(th.querySelector("button"));
      const rows = [...doc.querySelectorAll("table.sortable tbody tr")];
      const names = rows.map(r => r.cells[0].textContent.trim());
      expect(names).toEqual(["Alice", "Bob", "Charlie"]);
    });

    it("sorts rows descending (Z→A) on second click", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const th = doc.querySelector("table.sortable thead th");
      const btn = th.querySelector("button");
      click(btn);
      click(btn);
      const rows = [...doc.querySelectorAll("table.sortable tbody tr")];
      const names = rows.map(r => r.cells[0].textContent.trim());
      expect(names).toEqual(["Charlie", "Bob", "Alice"]);
    });

    it("restores original row order on third click (reset)", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const th = doc.querySelector("table.sortable thead th");
      const btn = th.querySelector("button");
      click(btn);
      click(btn);
      click(btn);
      const rows = [...doc.querySelectorAll("table.sortable tbody tr")];
      const names = rows.map(r => r.cells[0].textContent.trim());
      expect(names).toEqual(["Charlie", "Alice", "Bob"]);
    });
  });

  describe("numeric sort", () => {
    it("sorts numeric columns by numeric value, not lexicographic order", async () => {
      const ops = makeStandardOps(null, sortableBody);
      const doc = await makeRSDoc(ops);
      const ths = [...doc.querySelectorAll("table.sortable thead th")];
      const scoreBtn = ths[1].querySelector("button");
      click(scoreBtn);
      const rows = [...doc.querySelectorAll("table.sortable tbody tr")];
      const scores = rows.map(r => r.cells[1].textContent.trim());
      expect(scores).toEqual(["1", "2", "3"]);
    });
  });
});
