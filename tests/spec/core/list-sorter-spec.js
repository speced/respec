"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — list-sorter", () => {
  afterAll(flushIframes);
  let doc;
  beforeAll(async () => {
    const body = `
      <ol data-sort=ascending>
        <li>F</li>
        <li>Z</li>
        <li>a</li>
        <li>B</li>
      </ol>
      <ul data-sort=descending>
        <li>F</li>
        <li>Z</li>
        <li>a</li>
        <li>c</li>
      </ul>
      <ol id="ol-default" data-sort>
        <li>F</li>
        <li>Z</li>
        <li>a</li>
        <li>B</li>
      </ol>
      <ul data-sort=descending id="nested-list">
        <li>F</li>
        <li>A
          <ol data-sort=ascending>
            <li>3</li>
            <li>9</li>
            <li>1</li>
            <li>5</li>
          </ol>
        </li>
        <li>z</li>
        <li>c</li>
      </ul>
      <dl data-sort="ascending">
        <dt>Z</dt>
        <dd>First</dd>
        <dd>Second last</dd>
        <dd>Last when sorted.</dd>
        <dt>h</dt>
        <dt>a</dt>
        <dt>W</dt>
      </dl>
      <dl data-sort="descending">
        <dt>3</dt>
        <dt>9</dt>
        <dd>First</dd>
        <dt>1</dt>
        <dd>First</dd>
        <dd>Second last</dd>
        <dd>Last when sorted.</dd>
      </dl>
      <dl id="dont-sort">
        <dt>dont</dt>
        <dt>sort</dt>
        <dt>me</dt>
      </dl>
      <dl id="default-sort" data-sort>
        <dt>9</dt>
        <dt>3</dt>
        <dt>1</dt>
      </dl>
      <ul id="whitespace" data-sort="ascending">
        <li>F</li>
        <li> Z</li>
        <li> <dfn>a</dfn></li>
        <li>B </li>
        <li>B</li>
      </ul>
    `;
    const ops = makeStandardOps(null, body);
    doc = await makeRSDoc(ops);
  });
  describe("Ordered and unordered lists", () => {
    it("sorts ordered lists in ascending order", () => {
      const list = doc.querySelector("ol[data-sort='ascending']");
      const first = list.querySelector("li:first-of-type");
      const last = list.querySelector("li:last-of-type");
      expect(first.textContent).toBe("a");
      expect(last.textContent).toBe("Z");
    });

    it("sorts unordered lists in descending order", () => {
      const list = doc.querySelector("ul[data-sort='descending']");
      const first = list.querySelector("li:first-of-type");
      const last = list.querySelector("li:last-of-type");
      expect(first.textContent).toBe("Z");
      expect(last.textContent).toBe("a");
    });

    it("defaults to sorting in ascending order", () => {
      const list = doc.getElementById("ol-default");
      expect(list.firstElementChild.textContent).toBe("a");
      expect(list.lastElementChild.textContent).toBe("Z");
    });

    it("sorts nested lists", () => {
      const list = doc.getElementById("nested-list");
      const first = list.querySelector("li:first-of-type");
      const last = list.querySelector("li:last-of-type");
      expect(first.textContent).toBe("z");
      expect(last.firstChild.textContent.startsWith("A")).toBe(true);
    });

    it("ignores surrounding whitespace while sorting", () => {
      const listItems = [...doc.querySelectorAll("ul#whitespace li")].map(
        el => el.textContent
      );
      expect(listItems).toEqual([" a", "B ", "B", "F", " Z"]);
    });
  });
  describe("Definition lists", () => {
    it("sorts definition lists in ascending order", () => {
      const list = doc.querySelector("dl[data-sort='ascending']");
      const firstDt = list.querySelector("dt:first-of-type");
      const lastDt = list.querySelector("dt:last-of-type");
      expect(firstDt.textContent).toBe("a");
      expect(lastDt.textContent).toBe("Z");
      expect(lastDt.nextElementSibling.textContent).toBe("First");
      expect(list.lastElementChild.textContent).toBe("Last when sorted.");
      expect(list.lastElementChild.previousElementSibling.textContent).toBe(
        "Second last"
      );
    });

    it("sorts definition lists in descending order", () => {
      const list = doc.querySelector("dl[data-sort='descending']");
      expect(list.firstElementChild.textContent).toBe("9");
      const lastDt = list.querySelector("dt:last-of-type");
      expect(lastDt.nextElementSibling.textContent).toBe("First");
      expect(list.lastElementChild.textContent).toBe("Last when sorted.");
      expect(list.lastElementChild.previousElementSibling.textContent).toBe(
        "Second last"
      );
    });

    it("defaults to sorting in definition lists in ascending order", () => {
      const list = doc.getElementById("default-sort");
      expect(list.firstElementChild.textContent).toBe("1");
      expect(list.lastElementChild.textContent).toBe("9");
    });

    it("leaves unmarked lists alone", () => {
      const list = doc.getElementById("dont-sort");
      expect(list.firstElementChild.textContent).toBe("dont");
      expect(list.lastElementChild.textContent).toBe("me");
    });
  });
});
