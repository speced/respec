import { html } from "../../../src/core/import-maps.js";
import showPeople from "../../../src/core/templates/show-people.js";
import { sub } from "../../../src/core/pubsubhub.js";

describe("Core - Templates - Show People", () => {
  describe("showPeople", () => {
    it("handles empty person", () => {
      sub("error", () => {}, { once: true });
      const render = html.bind(document.createDocumentFragment());
      const person = {};
      const result = render`${showPeople({ people: [person] }, "people")}`;
      expect(result.textContent).toBe("");
    });

    it("generates the person's name and h-card", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = { name: "Person's name" };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      // Outer container
      const dd = result.querySelector("dd");
      expect([...dd.classList]).toEqual([
        "editor",
        "p-author",
        "h-card",
        "vcard",
      ]);

      // Inner container
      const span = result.querySelector("dd > span");
      expect([...span.classList]).toEqual(["p-name", "fn"]);
      expect(span.textContent).toBe("Person's name");
    });

    it("generates the person's company and h-card values", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = { name: "name", company: "The Company" };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      /* type HTMLElement */
      const span = result.querySelector("span.p-org.org.h-org");
      expect(span.textContent).toEqual("The Company");
      expect(span.parentElement.textContent.trim()).toBe("name (The Company)");
    });

    it("generates the person's w3cid", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = { name: "name", w3cid: "1234" };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      const dd = result.querySelector("dd");
      expect(dd.dataset.editorId).toBe("1234");
    });

    it("generates the person's mailto", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = { name: "name", mailto: "some@email.address" };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      const a = result.querySelector(
        "dd > a[href='mailto:some@email.address']"
      );
      expect([...a.classList]).toEqual([
        "ed_mailto",
        "u-email",
        "email",
        "p-name",
      ]);
      expect(a.textContent).toBe(person.name);
    });

    it("generates the person's url", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = { name: "name", url: "https://some.url" };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      const a = result.querySelector("dd > a[href='https://some.url']");
      expect([...a.classList]).toEqual(["u-url", "url", "p-name", "fn"]);
      expect(a.textContent).toBe(person.name);
    });

    it("prefers email over their URL", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = {
        name: "name",
        mailto: "pass@pass",
        href: "https://fail",
      };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      expect(result.querySelector("a[href='pass@pass']")).toBeNull();
      expect(result.querySelector("a[href='mailto:pass@pass']")).toBeTruthy();
    });

    it("generates the person's orcid", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = {
        name: "name",
        orcid: "0000-0002-1694-233X",
      };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      const a = result.querySelector("a.orcid");
      expect(a.href).toBe("https://orcid.org/0000-0002-1694-233X");
    });

    it("identifies valid and invalid ORCIDs", async () => {
      sub("error", () => {}, { once: true });
      const people = [
        {
          name: "Valid 1",
          orcid: "https://orcid.org/0000-0002-1694-233X",
        },
        {
          name: "Invalid http",
          orcid: "http://orcid.org/0000-0002-1694-233X",
        },
        {
          name: "Valid 2",
          orcid: "0000-0002-1694-233X",
        },
        {
          name: "Invalid checksum",
          orcid: "0000-0002-1694-2330",
        },
      ];
      const render = html.bind(document.createDocumentFragment());
      const result = render`${showPeople({ people }, "people")}`;
      const valid = result.querySelectorAll("a.orcid");
      expect(valid).toHaveSize(2);
      const [valid1, valid2] = valid;
      expect(valid1.href).toEqual(valid2.href);
      expect(result.querySelectorAll("a.orcid svg")).toHaveSize(2);
    });

    it("generates the person's companyURL", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = {
        name: "name",
        company: "company",
        companyURL: "https://company",
      };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      const a = result.querySelector("a[href='https://company']");
      expect([...a.classList]).toEqual(["p-org", "org", "h-org"]);
    });

    it("ignores companyURL when company is missing", () => {
      sub("warn", () => {}, { once: true });
      const render = html.bind(document.createDocumentFragment());
      const person = {
        name: "name",
        companyURL: "https://company",
      };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      expect(result.querySelector("a[href='https://company']")).toBeNull();
    });

    it("generates the person's note", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = { name: "name", note: "I'm a note" };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      const text = result.querySelector("dd").textContent;
      expect(text).toContain("I'm a note)");
    });

    it("generates the person's retiredDate", () => {
      const render = html.bind(document.createDocumentFragment());
      const person = { name: "name", retiredDate: "2000-12-01" };
      const result = render`${showPeople({ people: [person] }, "people")}`;
      const time = result.querySelector("time");
      expect(time.dateTime).toBe(person.retiredDate);
      expect(time.textContent).toBe("01 December 2000");
    });

    it("handles multiple people", () => {
      const render = html.bind(document.createDocumentFragment());
      const people = [
        { name: "one", w3cid: 123 },
        { name: "two", w3cid: 321 },
      ];
      const result = render`${showPeople({ people }, "people")}`;
      const editors = result.querySelectorAll("dd.editor");
      expect(editors).toHaveSize(2);
      const [one, two] = editors;
      expect(one.dataset.editorId).toBe("123");
      expect(two.dataset.editorId).toBe("321");
    });

    it("filters out editors with invalid extras", () => {
      sub("error", () => {}, { once: true });
      const render = html.bind(document.createDocumentFragment());
      const people = [
        { name: "wrong type", extras: "" },
        { name: "wrong item type", extras: ["", { name: "hello" }] },
        {
          name: "missing name",
          extras: [
            {
              href: "http://not-valid-missing-name",
              class: "invalid",
            },
          ],
        },
      ];
      const result = render`${showPeople({ people }, "people")}`;
      expect(result.querySelector("dd span")).toBeNull();
    });

    describe("PersonExtras", () => {
      const spanPerson = {
        name: "span person",
        extras: [{ name: "span extra name", class: "span" }],
      };
      const hrefPerson = {
        name: "href person",
        extras: [
          { name: "href extra name", class: "href", href: "https://pass" },
        ],
      };

      it("generates the PersonExtras name", () => {
        const render = html.bind(document.createDocumentFragment());
        const person = { name: "person", extras: [{ name: "pass" }] };
        const result = render`${showPeople({ people: [person] }, "people")}`;
        const span = result.querySelector("span:not([class])");
        expect(span.textContent.trim()).toBe("pass");
      });

      it("generates the personExtras href", () => {
        const render = html.bind(document.createDocumentFragment());
        const result = render`${showPeople(
          { people: [hrefPerson] },
          "people"
        )}`;
        const a = result.querySelector("a[href='https://pass']");
        expect(a.textContent.trim()).toBe("href extra name");
      });

      it("generates the personExtras class", () => {
        const render = html.bind(document.createDocumentFragment());
        const result = render`${showPeople(
          { people: [spanPerson, hrefPerson] },
          "people"
        )}`;
        const [span, a] = result.querySelectorAll("span.span, a.href");
        expect(span.textContent.trim()).toBe("span extra name");
        expect(a.textContent.trim()).toBe("href extra name");
      });
    });
  });
});
