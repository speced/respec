"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

import { licenses, recTrackStatus } from "../../../src/w3c/headers.js";

const findContent = string => {
  return ({ textContent }) => textContent.trim() === string;
};
describe("W3C — Headers", () => {
  afterEach(flushIframes);
  const simpleSpecURL = "spec/core/simple.html";
  /**
   * @param {Node} node
   */
  function collapsedTextContent({ textContent }) {
    return textContent.replace(/\s+/g, " ");
  }
  function contains(el, query, string) {
    return [...el.querySelectorAll(query)].filter(child =>
      collapsedTextContent(child).includes(string)
    );
  }

  it("has a details and summary", async () => {
    const opts = makeStandardOps({ specStatus: "FPWD" });
    const doc = await makeRSDoc(opts);
    const details = doc.querySelector(".head details");
    const summary = doc.querySelector(".head summary");
    const dl = doc.querySelector(".head details > dl");
    expect(details).toBeTruthy();
    expect(details.open).toBe(true);
    expect(summary).toBeTruthy();
    expect(dl).toBeTruthy();
  });

  it("sets the open attribute from details on save", async () => {
    const opts = makeStandardOps({ specStatus: "WD" });
    const doc = await makeRSDoc(opts);
    doc.querySelector(".head details").open = true;
    const exportedDoc = new DOMParser().parseFromString(
      await doc.respec.toHTML(),
      "text/html"
    );
    expect(exportedDoc.querySelector(".head details[open]")).toBeTruthy();
  });

  it("links to the 'kinds of documents' only for W3C documents", async () => {
    const statuses = ["FPWD", "WD", "CR", "CRD", "PR", "REC", "NOTE"];
    for (const specStatus of statuses) {
      const doc = await makeRSDoc(makeStandardOps({ specStatus }));
      const w3cLink = doc.querySelector(
        `.head a[href='https://www.w3.org/standards/types#${specStatus}']`
      );
      expect(w3cLink).withContext(`specStatus: ${specStatus}`).toBeTruthy();
    }

    for (const specStatus of ["unofficial", "base"]) {
      const doc = await makeRSDoc(makeStandardOps({ specStatus }));
      const w3cLink = doc.querySelector(
        ".head a[href='https://www.w3.org/standards/types#UD']"
      );
      expect(w3cLink).withContext(`specStatus: ${specStatus}`).toBeNull();
    }
  });

  describe("prevRecShortname & prevRecURI", () => {
    it("takes prevRecShortname and prevRecURI into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        prevRecURI: "URI",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);

      const terms = doc.querySelectorAll("dt");
      expect(terms[4].textContent).toBe("Latest Recommendation:");
      expect(terms[4].nextElementSibling.localName).toBe("dd");
      expect(terms[4].nextElementSibling.textContent.trim()).toBe("URI");
    });
  });
  describe("specStatus", () => {
    it("takes specStatus into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "ED",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head p").textContent).toContain(
        "W3C Editor's Draft"
      );
      expect(collapsedTextContent(doc.getElementById("sotd"))).toContain(
        "does not imply endorsement by W3C and its Members."
      );
    });

    it("indicates as recommended", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const sotd = collapsedTextContent(doc.getElementById("sotd"));
      expect(sotd).toContain(
        "W3C recommends the wide deployment of this specification as a standard for the Web."
      );
      expect(sotd).toContain("royalty-free licensing");
    });

    it("includes version links for 'draft-finding'", async () => {
      const ops = makeStandardOps({
        shortName: "test",
        specStatus: "draft-finding",
      });
      const doc = await makeRSDoc(ops);
      const definitions = doc.querySelectorAll(".head dt");
      const [firstDt, secondDt, thirdDt] = definitions;

      expect(firstDt.textContent).toContain("This version:");
      const firstA = firstDt.nextElementSibling.querySelector("a");
      expect(firstA.href).toContain("/2001/tag/doc/test-");

      expect(secondDt.textContent).toContain("Latest published version:");
      const secondA = secondDt.nextElementSibling.querySelector("a");
      expect(secondA.href).toContain("/2001/tag/doc/test");

      expect(thirdDt.textContent).toContain("Latest editor's draft:");
    });

    it("does not include version links for 'editor-draft-finding'", async () => {
      const ops = makeStandardOps({
        shortName: "test",
        specStatus: "editor-draft-finding",
      });
      const doc = await makeRSDoc(ops);
      const definitions = doc.querySelectorAll(".head dt");
      const [firstDt] = definitions;

      expect(firstDt.textContent).toContain("Latest editor's draft:");
    });

    it("prefixes status text properly", async () => {
      const edDoc = await makeRSDoc(
        makeStandardOps({
          shortName: "test",
          specStatus: "ED",
        })
      );
      const [result] = contains(
        edDoc,
        "p",
        "Publication as an Editor's Draft does not imply endorsement by W3C and its Members."
      );
      expect(result).toBeTruthy();
      const dNoteDoc = await makeRSDoc(
        makeStandardOps({
          shortName: "test",
          specStatus: "DNOTE",
          group: "webperf",
        })
      );
      const [result2] = contains(
        dNoteDoc,
        "p",
        "This document was published by the Web Performance Working Group as a Group Draft Note using the Note track."
      );
      expect(result2).toBeTruthy();
    });

    describe("specStatus - base", () => {
      it("doesn't add 'w3c' to header when status is base", async () => {
        const ops = makeStandardOps({
          specStatus: "base",
        });
        const doc = await makeRSDoc(ops);
        expect(doc.querySelector(".head p").textContent).not.toContain("W3C");
      });
    });
  });

  describe("shortName", () => {
    it("takes shortName into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        shortName: "xxx",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);

      const terms = doc.querySelectorAll("dt");
      expect(terms[0].textContent).toBe("This version:");
      expect(terms[0].nextElementSibling.localName).toBe("dd");
      expect(terms[0].nextElementSibling.textContent).toContain("REC-xxx-");
      expect(terms[1].textContent).toBe("Latest published version:");
      expect(terms[1].nextElementSibling.localName).toBe("dd");
      expect(terms[1].nextElementSibling.textContent).toContain("TR/xxx");
    });
  });

  describe("editors", () => {
    const findEditor = findContent("Editor:");
    describe("retiredDate", () => {
      it("localizes", async () => {
        const ops = makeStandardOps();
        ops.htmlAttrs = { lang: "es" };
        const newProps = {
          specStatus: "REC",
          editors: [
            {
              name: "NAME",
            },
          ],
          formerEditors: [
            {
              name: "FORMER EDITOR 1",
              retiredDate: "2020-03-01",
            },
          ],
        };
        Object.assign(ops.config, newProps);
        const doc = await makeRSDoc(ops);
        const [dtFormerEditor] = contains(doc, "dt", "Antiguo editor:");
        expect(dtFormerEditor.nextElementSibling.textContent).toContain(
          "Hasta"
        );
        expect(dtFormerEditor.nextElementSibling.textContent).toContain(
          "marzo"
        );
        const time = dtFormerEditor.nextElementSibling.querySelector("time");
        expect(time.dateTime).toBe("2020-03-01");
      });
      it("relocates single editor with retiredDate member to single formerEditor", async () => {
        const ops = makeStandardOps();
        const newProps = {
          specStatus: "REC",
          editors: [
            {
              name: "NAME",
              retiredDate: "2020-03-01",
            },
          ],
        };
        Object.assign(ops.config, newProps);
        const doc = await makeRSDoc(ops);
        expect(contains(doc, "dt", "Editors:")).toHaveSize(0);
        expect(contains(doc, "dt", "Former editor:")).toHaveSize(1);
      });
      it("relocates single editor with retiredDate member to multiple formerEditors", async () => {
        const ops = makeStandardOps();
        const newProps = {
          specStatus: "REC",
          editors: [
            {
              name: "FORMER EDITOR 2",
              retiredDate: "2020-03-01",
            },
          ],
          formerEditors: [
            {
              name: "FORMER EDITOR 1",
            },
          ],
        };
        Object.assign(ops.config, newProps);
        const doc = await makeRSDoc(ops);
        const dtFormerEditors = contains(doc, "dt", "Former editors:");
        const dtEditors = contains(doc, "dt", "Editors:");
        expect(dtEditors).toHaveSize(0);
        const dd = dtFormerEditors[0].nextElementSibling;
        expect(dd.textContent.trim()).toBe("FORMER EDITOR 1");
        expect(dd.nextElementSibling.textContent.trim()).toContain(
          "FORMER EDITOR 2"
        );
      });
      it("relocates multiple editors with retiredDate member to multiple formerEditor", async () => {
        const ops = makeStandardOps();
        const newProps = {
          specStatus: "REC",
          editors: [
            {
              name: "FORMER EDITOR 1",
              retiredDate: "2020-03-02",
            },
            {
              name: "FORMER EDITOR 2",
              retiredDate: "2020-03-01",
            },
          ],
        };
        Object.assign(ops.config, newProps);
        const doc = await makeRSDoc(ops);
        const dtFormerEditors = contains(doc, "dt", "Former editors:");
        const dtEditors = contains(doc, "dt", "Editors:");
        expect(dtEditors).toHaveSize(0);
        const dd = dtFormerEditors[0].nextElementSibling;
        expect(dd.textContent).toContain("FORMER EDITOR 1");
        expect(dd.querySelector("time").dateTime).toBe("2020-03-02");
        expect(dd.nextElementSibling.textContent).toContain("FORMER EDITOR 2");
      });
      it("relocates multiple editors with retiredDate member to multiple formerEditors", async () => {
        const ops = makeStandardOps();
        const newProps = {
          specStatus: "REC",
          editors: [
            {
              name: "EDITOR 1",
            },
            {
              name: "FORMER EDITOR 2",
              retiredDate: "2020-03-01",
            },
            {
              name: "FORMER EDITOR 3",
              retiredDate: "2020-03-01",
            },
          ],
          formerEditors: [
            {
              name: "FORMER EDITOR 1",
            },
          ],
        };
        Object.assign(ops.config, newProps);
        const doc = await makeRSDoc(ops);
        const dtFormerEditors = contains(doc, "dt", "Former editors:");
        const dtEditors = contains(doc, "dt", "Editors:");
        const dtEditor = contains(doc, "dt", "Editor:");
        expect(dtEditor).toHaveSize(1);
        expect(dtEditors).toHaveSize(0);
        const dd = dtFormerEditors[0].nextElementSibling;
        expect(dd.textContent).toContain("FORMER EDITOR 1");
        expect(dd.nextElementSibling.textContent).toContain("FORMER EDITOR 2");
        expect(dd.nextElementSibling.nextElementSibling.textContent).toContain(
          "FORMER EDITOR 3"
        );
      });
    });
    it("takes a single editors into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        editors: [
          {
            name: "NAME",
            url: "http://URI",
            company: "COMPANY",
            companyURL: "http://COMPANY",
            mailto: "EMAIL",
            note: "NOTE",
            w3cid: "1234",
            orcid: "https://orcid.org/0000-0002-1694-233X",
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(contains(doc, "dt", "Editors:")).toHaveSize(0);
      const editors = contains(doc, "dt", "Editor:");
      expect(editors).toHaveSize(1);
      const [editor] = editors;
      const dd = editor.nextElementSibling;
      expect(dd.querySelectorAll("a[href='http://COMPANY']")).toHaveSize(1);
      expect(dd.querySelector("a[href='http://COMPANY']").textContent).toBe(
        "COMPANY"
      );
      expect(dd.querySelectorAll("a[href='mailto:EMAIL']")).toHaveSize(1);
      expect(dd.querySelector("a[href='mailto:EMAIL']").textContent).toBe(
        "NAME"
      );
      // if `mailto` is specified in People, `url` won't be used
      expect(dd.querySelectorAll("a[href='http://URI']")).toHaveSize(0);
      expect(dd.dataset.editorId).toBe("1234");
      expect(dd.textContent).toContain("(NOTE)");
      expect(
        dd.querySelector("a[href='https://orcid.org/0000-0002-1694-233X']")
      ).not.toBeNull();
      // It puts orcid after the editor's name, but before the organization's details
      expect(doc.querySelector("dd > .p-name + .orcid + .org")).not.toBeNull();
    });

    it("takes multiple editors into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        editors: [
          {
            name: "NAME1",
          },
          {
            name: "NAME2",
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const dtEditors = contains(doc, "dt", "Editors:");
      const dtEditor = contains(doc, "dt", "Editor:");
      expect(dtEditors).toHaveSize(1);
      expect(dtEditor).toHaveSize(0);
      const dd = dtEditors[0].nextElementSibling;
      expect(dd.textContent.trim()).toBe("NAME1");
      expect(dd.nextElementSibling.textContent.trim()).toBe("NAME2");
    });

    it("takes editors extras into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        editors: [
          {
            name: "Mr foo",
            extras: [
              {
                name: "@ivan_herman",
                href: "http://twitter.com/ivan_herman",
                class: "twitter",
              },
            ],
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const twitterHref = ops.config.editors[0].extras[0].href;
      const twitterAnchor = doc.querySelector(`a[href='${twitterHref}']`);
      // general checks
      const header = doc.querySelector("div.head");
      expect(twitterAnchor.localName).toBe("a");
      // Check that it's in the header of the document
      expect(header.contains(twitterAnchor)).toBe(true);

      // Check CSS is correctly applied
      expect(twitterAnchor.className).toBe("twitter");
    });

    it("treats editor's info as HTML", async () => {
      const config = {
        specStatus: "REC",
        editors: [
          {
            name: "<span lang='ja'>阿南 康宏</span> (Yasuhiro Anan), (<span lang='ja'>第１版</span> 1st edition)",
            company: "<span lang='ja'>マイクロソフト</span> (Microsoft)",
          },
        ],
      };
      const ops = makeStandardOps(config);
      const doc = await makeRSDoc(ops);
      const dtElems = [...doc.querySelectorAll(".head dt")];
      const dtElem = dtElems.find(findEditor);
      const ddElem = dtElem.nextElementSibling;
      const [personName, edition, company] =
        ddElem.querySelectorAll("span[lang=ja]");
      expect(personName.lang).toBe("ja");
      expect(personName.textContent).toBe("阿南 康宏");
      expect(edition.textContent).toBe("第１版");
      expect(company.textContent).toBe("マイクロソフト");
      expect(ddElem.textContent.replace(/\s\s+/g, " ").trim()).toBe(
        "阿南 康宏 (Yasuhiro Anan), (第１版 1st edition) (マイクロソフト (Microsoft))"
      );
    });
  });

  describe("formerEditors", () => {
    const formerEditors = findContent("Former editors:");
    const formerEditor = findContent("Former editor:");
    it("takes no former editor into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        formerEditors: [],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);

      const dtElems = [...doc.querySelectorAll("dt")];
      const formerEditorsLabel = dtElems.find(formerEditors);
      expect(formerEditorsLabel).toBeUndefined();

      const formerEditorLabel = dtElems.find(formerEditor);
      expect(formerEditorLabel).toBeUndefined();
    });

    it("takes a single former editor into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        formerEditors: [
          {
            name: "NAME",
            url: "http://URI",
            company: "COMPANY",
            companyURL: "http://COMPANY",
            mailto: "EMAIL",
            w3cid: "1234",
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const dtElems = [...doc.querySelectorAll("dt")];
      const formerEditorLabel = dtElems.find(formerEditor);
      expect(formerEditorLabel).toBeDefined();

      const formerEditorsLabel = dtElems.find(formerEditors);
      expect(formerEditorsLabel).toBeUndefined();

      const editor = formerEditorLabel.nextSibling;
      expect(editor.localName).toBe("dd");
      expect(editor.textContent.replace(/\s+/gm, " ").trim()).toBe(
        "NAME (COMPANY)"
      );

      const editorCompany = editor.querySelectorAll("a[href='http://COMPANY']");
      expect(editorCompany).toHaveSize(1);
      expect(editorCompany[0].textContent).toBe("COMPANY");

      const editorEmail = editor.querySelectorAll("a[href='mailto:EMAIL']");
      expect(editorEmail).toHaveSize(1);
      expect(editorEmail[0].textContent).toBe("NAME");

      // if `mailto` is specified in People, `url` won't be used
      const editorUrl = editor.querySelectorAll("a[href='http://URI']");
      expect(editorUrl).toHaveSize(0);

      const { editorId } = editor.dataset;
      expect(editorId).toBe("1234");
    });

    it("takes multiple former editors into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        formerEditors: [
          {
            name: "NAME1",
          },
          {
            name: "NAME2",
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const dtElems = [...doc.querySelectorAll("dt")];
      const formerEditorLabel = dtElems.find(formerEditor);
      expect(formerEditorLabel).toBeUndefined();

      const formerEditorsLabel = dtElems.find(formerEditors);
      expect(formerEditorsLabel).toBeDefined();

      const firstEditor = formerEditorsLabel.nextSibling;
      expect(firstEditor.localName).toBe("dd");
      expect(firstEditor.textContent.trim()).toBe("NAME1");

      const secondEditor = firstEditor.nextSibling;
      expect(secondEditor.localName).toBe("dd");
      expect(secondEditor.textContent.trim()).toBe("NAME2");
    });

    it("treats formerEditor's name as HTML", async () => {
      const config = {
        specStatus: "REC",
        formerEditors: [
          {
            name: "<span lang='ja'>阿南 康宏</span> (Yasuhiro Anan), (<span lang='ja'>第１版</span> 1st edition)",
            company: "Microsoft",
          },
        ],
      };
      const ops = makeStandardOps(config);
      const doc = await makeRSDoc(ops);
      const dtElems = [...doc.querySelectorAll(".head dt")];
      const dtElem = dtElems.find(formerEditor);
      const ddElem = dtElem.nextElementSibling;
      const [personName, edition] = ddElem.querySelectorAll("span>span");
      expect(personName.lang).toBe("ja");
      expect(personName.textContent).toBe("阿南 康宏");
      expect(edition.textContent).toBe("第１版");
      expect(ddElem.textContent.replace(/\s\s+/g, " ").trim()).toBe(
        "阿南 康宏 (Yasuhiro Anan), (第１版 1st edition) (Microsoft)"
      );
    });
  });

  describe("authors", () => {
    it("takes a single author into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        authors: [
          {
            name: "NAME1",
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const dtAuthors = contains(doc, "dt", "Authors:");
      const dtAuthor = contains(doc, "dt", "Author:");
      expect(dtAuthors).toHaveSize(0);
      expect(dtAuthor).toHaveSize(1);
      const dd = dtAuthor[0].nextElementSibling;
      expect(dd.textContent.trim()).toBe("NAME1");
    });

    it("takes multiple authors into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        authors: [
          {
            name: "NAME1",
          },
          {
            name: "NAME2",
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(contains(doc, "dt", "Authors:")).toHaveSize(1);
      expect(contains(doc, "dt", "Author:")).toHaveSize(0);
      expect(
        contains(doc, "dt", "Authors:")[0].nextSibling.textContent.trim()
      ).toBe("NAME1");
      expect(
        contains(
          doc,
          "dt",
          "Authors:"
        )[0].nextSibling.nextSibling.textContent.trim()
      ).toBe("NAME2");
    });
  });

  describe("valid level config", () => {
    it("updates relevant locations with the level when level is the integer 0", async () => {
      const body = `
        <h1 id="title">Spec <code>Marked</code> Up</h1>${makeDefaultBody()}`;
      const ops = makeStandardOps(
        { level: 0, specStatus: "REC", shortName: "abc" },
        body
      );

      const doc = await makeRSDoc(ops);

      const h1Elem = doc.querySelector("h1#title");
      // html is not escaped
      expect(h1Elem.childNodes[1].localName).toBe("code");
      expect(h1Elem.textContent).toBe("Spec Marked Up Level 0");
      expect(doc.title).toBe("Spec Marked Up Level 0");

      const terms = doc.querySelectorAll("dt");
      expect(terms[0].textContent).toBe("This version:");
      expect(terms[0].nextElementSibling.localName).toBe("dd");
      expect(terms[0].nextElementSibling.textContent).toContain("REC-abc-0");
      expect(terms[1].textContent).toBe("Latest published version:");
      expect(terms[1].nextElementSibling.localName).toBe("dd");
      expect(terms[1].nextElementSibling.textContent).toContain("TR/abc-0/");
    });

    it("updates relevant locations with the level when level is an integer greater than 0", async () => {
      const body = `
      <h1 id="title">Spec <code>Marked</code> Up</h1>${makeDefaultBody()}`;
      const ops = makeStandardOps(
        { level: 9870, specStatus: "REC", shortName: "xyz" },
        body
      );

      const doc = await makeRSDoc(ops);

      const h1Elem = doc.querySelector("h1#title");
      // html is not escaped
      expect(h1Elem.childNodes[1].localName).toBe("code");
      expect(h1Elem.textContent).toBe("Spec Marked Up Level 9870");
      expect(doc.title).toBe("Spec Marked Up Level 9870");

      const terms = doc.querySelectorAll("dt");
      expect(terms[0].textContent).toBe("This version:");
      expect(terms[0].nextElementSibling.localName).toBe("dd");
      expect(terms[0].nextElementSibling.textContent).toContain("REC-xyz-9870");
      expect(terms[1].textContent).toBe("Latest published version:");
      expect(terms[1].nextElementSibling.localName).toBe("dd");
      expect(terms[1].nextElementSibling.textContent).toContain("TR/xyz-9870/");
    });
  });

  describe("invalid level configs", () => {
    it("warns the user and does not add the level to the relevant places when level is a string that doesn't convert to an integer", async () => {
      const body = `
      <h1 id="title">Spec <code>Marked</code> Up</h1>${makeDefaultBody()}`;
      const ops = makeStandardOps(
        { level: "a1", specStatus: "REC", shortName: "xxx" },
        body
      );

      const doc = await makeRSDoc(ops);

      const h1Elem = doc.querySelector("h1#title");
      expect(h1Elem.classList).toContain("respec-offending-element");
      expect(h1Elem.textContent).toBe("Spec Marked Up");

      const terms = doc.querySelectorAll("dt");
      expect(terms[0].textContent).toBe("This version:");
      expect(terms[0].nextElementSibling.localName).toBe("dd");
      expect(terms[0].nextElementSibling.textContent).toMatch(
        /REC-xxx-[0-9]{8}/
      );
      expect(terms[1].textContent).toBe("Latest published version:");
      expect(terms[1].nextElementSibling.localName).toBe("dd");
      expect(terms[1].nextElementSibling.textContent).toContain("TR/xxx/");
    });

    it("warns the user and does not add the level to the relevant places when level is negative integer", async () => {
      const ops = makeStandardOps({ level: -2 });
      const doc = await makeRSDoc(ops);

      const h1Elem = doc.querySelector("h1#title");
      expect(h1Elem.classList).toContain("respec-offending-element");
      expect(h1Elem.textContent).toBe("No Title");
    });

    it("warns the user and does not add the level to the relevant places when level is null", async () => {
      const ops = makeStandardOps({ level: null });
      const doc = await makeRSDoc(ops);

      const h1Elem = doc.querySelector("h1#title");
      expect(h1Elem.classList).toContain("respec-offending-element");
      expect(h1Elem.textContent).toBe("No Title");
    });
  });

  describe("precedence order of document title when h1#title and <title> elements are present", () => {
    it('makes h1 always win even when h1#title textContent is ""', async () => {
      const body = `
        <title>Doc Title</title>
        <h1 id='title'></h1>
        ${makeDefaultBody()}
      `;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("");
      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("");
      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe("");
      expect(h1.classList).toContain("respec-offending-element");
    });

    it("uses h1#title content and overrides <title> when h1#title has content", async () => {
      const body = `
        <title>hi</title>
        <h1 id='title'>
          override!!!
        </h1>
        ${makeDefaultBody()}`;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("override!!!");
      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("override!!!");
      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent.trim()).toBe("override!!!");
    });

    it("handles special case of localized spec title by doing replacement of <br> elements", async () => {
      const body = `
      <title>hi</title>
      <h1 id="title">Requirements for Chinese Text:<br/>Layout<br/><span lang="zh">中文排版需求</span></h1>
      ${makeDefaultBody()}`;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe(
        "Requirements for Chinese Text: Layout - 中文排版需求"
      );
    });
  });

  describe("precedence rules for h1#title is present and <title> is absent", () => {
    it("always uses h1#title content for all the document's titles", async () => {
      const body = `
      <h1 id='title'>This should be <code>pass</code>.</h1>${makeDefaultBody()}`;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("This should be pass.");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("This should be pass.");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.innerHTML).toBe("This should be <code>pass</code>.");
    });

    it("uses h1#title content when h1#title has content", async () => {
      const ops = makeStandardOps();
      ops.body = `
        <h1 id='title'><code>pass</code></h1>
        ${makeDefaultBody()}
      `;
      const doc = await makeRSDoc(ops);

      // Title was relocated to head
      const titleInHead = doc.querySelector(".head h1");
      expect(titleInHead.id).toBe("title");

      // html is not escaped
      expect(titleInHead.firstChild.localName).toBe("code");
      expect(titleInHead.textContent).toBe("pass");
    });

    it("makes h1 win even when h1#title is only whitespace", async () => {
      const body = `
        <h1 id='title'>       </h1>
        ${makeDefaultBody()}
      `;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.classList).toContain("respec-offending-element");
    });

    it('makes h1 always win even when h1#title is ""', async () => {
      const body = `
      <h1 id='title'></h1>${makeDefaultBody()}`;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe("");
      expect(h1.classList).toContain("respec-offending-element");
    });
  });

  describe("precedence rules for title when h1#title element is not present", () => {
    it("uses <title> when it contains a non-empty string", async () => {
      const body = `<title>Title!!!</title>${makeDefaultBody()}`;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("Title!!!");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("Title!!!");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe("Title!!!");
    });

    it("uses a default title when the document excludes a title", async () => {
      const ops = makeStandardOps({}, makeDefaultBody());
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("No Title");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("No Title");

      const h1 = doc.querySelector("h1#title");
      expect(h1.textContent).toBe("No Title");
    });

    it("uses a default title when <title> contains an empty string", async () => {
      const body = `<title></title>${makeDefaultBody()}`;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("No Title");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("No Title");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe("No Title");
    });
  });

  describe("subtitle", () => {
    it("handles missing subtitle", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.getElementById("subtitle")).toBeNull();
    });

    it("uses existing h2#subtitle as subtitle", async () => {
      const ops = makeStandardOps();
      ops.body = `<h2 id='subtitle'><code>pass</code></h2>${makeDefaultBody()}`;
      const doc = await makeRSDoc(ops);

      const subTitleElements = doc.querySelectorAll("h2#subtitle");
      expect(subTitleElements).toHaveSize(1);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toBe("pass");

      const [h2Elem] = subTitleElements;
      expect(h2Elem.textContent).toBe("pass");

      // make sure it was relocated to head
      expect(h2Elem.closest(".head")).toBeTruthy();

      expect(h2Elem.firstElementChild.localName).toBe("code");
      expect(h2Elem.firstElementChild.textContent).toBe("pass");
    });

    it("overwrites conf.subtitle if it exists", async () => {
      const ops = makeStandardOps();
      ops.body = `<h2 id='subtitle'><code>pass</code></h2>${makeDefaultBody()}`;
      const newProps = {
        subtitle: "fail - this should have been overridden by the <h2>",
      };
      Object.assign(ops.config, newProps);

      const doc = await makeRSDoc(ops);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toBe("pass");
    });

    it("sets conf.subtitle if it doesn't exist, but h2#subtitle exists", async () => {
      const ops = makeStandardOps();
      ops.body = `<h2 id='subtitle'><code>pass</code></h2>${makeDefaultBody()}`;
      const doc = await makeRSDoc(ops);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toBe("pass");
    });

    it("generates a subtitle from the `subtitle` configuration option", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        subtitle: "pass",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const h2Elem = doc.getElementById("subtitle");
      expect(h2Elem).toBeTruthy();
      expect(h2Elem.textContent.trim()).toBe("pass");
    });
  });

  describe("publishDate", () => {
    it("takes publishDate into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        publishDate: "1977-03-15",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(contains(doc, "p", "15 March 1977")).toHaveSize(1);
    });
  });

  describe("modificationDate", () => {
    it("takes modificationDate into account", async () => {
      const ops = makeStandardOps({
        publishDate: "1977-03-15",
        modificationDate: "2012-12-21",
      });
      const doc = await makeRSDoc(ops);

      const [dateStatusEl] = contains(doc, "p", "15 March 1977");
      expect(dateStatusEl).toBeDefined();

      const dateModified = dateStatusEl.querySelector(".dt-modified");
      expect(dateModified).toBeTruthy();
      expect(dateModified.localName).toBe("time");
      expect(dateModified.getAttribute("datetime")).toBe("2012-12-21");
      expect(dateModified.textContent).toBe("21 December 2012");

      const text = collapsedTextContent(dateStatusEl).trim();
      expect(text).toMatch(/15 March 1977, edited in place 21 December 2012$/);
    });

    it("doesn't add any content if modificationDate is not provided", async () => {
      const ops = makeStandardOps({ publishDate: "1977-03-15" });
      const doc = await makeRSDoc(ops);

      const [dateStatusEl] = contains(doc, "p", "15 March 1977");
      const text = collapsedTextContent(dateStatusEl).trim();
      expect(text).toMatch(/15 March 1977$/);
    });
  });

  describe("previousPublishDate & previousMaturity", () => {
    it("recovers given bad date inputs", async () => {
      const { ISODate } = await import("../../../src/core/utils.js");

      const ops = makeStandardOps();
      const start = new Date(ISODate.format(Date.now())).valueOf();
      const newProps = {
        publishDate: "2117-0123-15",
        previousPublishDate: "197-123131-15",
        crEnd: "bad date",
        prEnd: "next wednesday",
        perEnd: "today",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const end = Date.now();
      const allInBetween = Object.keys(newProps).every(key => {
        const value = doc.defaultView.respecConfig[key].valueOf();
        return value <= end && value >= start;
      });
      expect(allInBetween).toBe(true);
    });

    it("takes previousPublishDate and previousMaturity into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "finding",
        publishDate: "2017-03-15",
        previousPublishDate: "1977-03-15",
        previousMaturity: "CR",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const [dt] = contains(doc, "dt", "Previous version:");
      expect(dt.nextElementSibling.localName).toBe("dd");
      expect(dt.nextElementSibling.textContent).toContain(
        "https://www.w3.org/2001/tag/doc"
      );
    });
  });

  describe("errata", () => {
    it("takes errata into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        errata: "https://foo.com",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const [errata] = contains(
        doc,
        ".head dd>a[href='https://foo.com']",
        "Errata exists"
      );
      expect(errata).toBeTruthy();
    });
  });

  describe("license configuration", () => {
    it("shows and error when the license is unknown", async () => {
      const ops = makeStandardOps({
        specStatus: "WD",
        license: "unknown",
        github: "w3c/respec",
      });
      const doc = await makeRSDoc(ops, simpleSpecURL);
      expect(doc.respec.errors).toHaveSize(1);
      const [error] = doc.respec.errors;
      expect(error.plugin).toBe("w3c/headers");
      expect(error.message).toContain(
        'The license "`unknown`" is not supported.'
      );
    });

    it("defaults to cc-by when spec status is unofficial", async () => {
      const ops = makeStandardOps({
        shortName: "whatever",
        specStatus: "unofficial",
      });

      const doc = await makeRSDoc(ops);
      const licenses = doc.querySelectorAll("div.head a[rel=license]");
      expect(licenses).toHaveSize(1);
      expect(licenses[0].tagName).toBe("A");
      expect(licenses[0].href).toBe(
        "https://creativecommons.org/licenses/by/4.0/legalcode"
      );
    });

    it("falls back to cc-by when license is unknown and spec status is unofficial", async () => {
      const ops = makeStandardOps({
        shortName: "whatever",
        specStatus: "unofficial",
        license: "not a thing",
        editors: [{ name: "foo" }],
      });
      const doc = await makeRSDoc(ops);
      const licenses = doc.querySelectorAll("div.head a[rel=license]");
      expect(licenses).toHaveSize(1);
      expect(licenses[0].tagName).toBe("A");
      expect(licenses[0].href).toBe(
        "https://creativecommons.org/licenses/by/4.0/legalcode"
      );
    });

    it("supports various licenses", async () => {
      for (const license of licenses.keys()) {
        if (!license) continue; // skip 'undefined' special case
        const ops = makeStandardOps({
          specStatus: "FPWD",
          license,
          shortName: "whatever",
          editors: [{ name: "foo" }],
        });
        const doc = await makeRSDoc(ops);
        const licenseLinks = doc.querySelectorAll("div.head a[rel=license]");
        expect(licenseLinks).withContext(license).toHaveSize(1);
        const { url, short, name } = licenses.get(license);
        const [link] = licenseLinks;
        expect(link.href).withContext(license).toBe(url);
        expect(link.textContent).withContext(license).toContain(short);
        expect(link.title).withContext(license).toBe(name);
      }
    });

    it("shows an error when a w3c document is unlicensed", async () => {
      const ops = makeStandardOps({
        license: "",
      });
      const doc = await makeRSDoc(ops, simpleSpecURL);
      expect(doc.respec.errors).toHaveSize(1);
      const [error] = doc.respec.errors;
      expect(error.plugin).toBe("w3c/headers");
      expect(error.message).toContain("not supported");
    });

    it("shows an error when a w3c document a disallowed license", async () => {
      for (const license of ["cc-by", "cc0"]) {
        const ops = makeStandardOps({ license });
        const doc = await makeRSDoc(ops, simpleSpecURL);
        expect(doc.respec.errors).toHaveSize(1);
        const [error] = doc.respec.errors;
        expect(error.plugin).withContext(license).toBe("w3c/headers");
        expect(error.message)
          .withContext(license)
          .toContain("not allowed for W3C Specifications");
      }
    });

    it("supports cc0 when spec status is unofficial", async () => {
      const ops = makeStandardOps({
        specStatus: "unofficial",
        license: "cc0",
        shortName: "whatever",
        editors: [{ name: "foo" }],
      });
      const doc = await makeRSDoc(ops);
      const licenses = doc.querySelectorAll("div.head a[rel=license]");
      expect(licenses).toHaveSize(1);
      expect(licenses[0].tagName).toBe("A");
      expect(licenses[0].href).toBe(
        "https://creativecommons.org/publicdomain/zero/1.0/"
      );
      expect(doc.respec.errors).toHaveSize(0);
    });

    it("makes sure that p.copyright wins", async () => {
      const config = {
        specStatus: "unofficial",
        license: "cc0",
        shortName: "whatever",
        editors: [{ name: "foo" }],
      };
      const body = "<p class='copyright'>pass</p>";
      const ops = makeStandardOps(config, body);

      const doc = await makeRSDoc(ops);
      const copyright = doc.querySelectorAll("div.head p.copyright");
      expect(copyright).toHaveSize(1);
      expect(copyright[0].tagName).toBe("P");
      expect(copyright[0].textContent).toBe("pass");
    });
  });

  describe("alternateFormats", () => {
    it("takes alternateFormats into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "FPWD",
        alternateFormats: [
          {
            uri: "URI",
            label: "LABEL",
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(
        contains(doc.querySelector(".head"), "a", "LABEL")[0].getAttribute(
          "href"
        )
      ).toBe("URI");
    });
  });

  describe("otherLinks", () => {
    it("renders otherLinks with value and href", async () => {
      const otherLinks = [
        {
          class: "key-other-link",
          key: "KEY:",
          data: [{ value: "VALUE", href: "HREF" }],
        },
      ];
      const ops = makeStandardOps({ otherLinks });
      const doc = await makeRSDoc(ops);

      const dt = doc.querySelector(".head dt.key-other-link");
      expect(dt.textContent).toBe("KEY:");
      const dd = dt.nextElementSibling;
      expect(dd.localName).toBe("dd");
      expect(dd.querySelector("a").textContent).toBe("VALUE");
      expect(dd.querySelector("a").getAttribute("href")).toBe("HREF");
    });

    it("renders otherLinks without href", async () => {
      const otherLinks = [
        {
          class: "key-other-link",
          key: "KEY:",
          data: [{ value: "VALUE" }],
        },
      ];
      const ops = makeStandardOps({ otherLinks });
      const doc = await makeRSDoc(ops);

      const dt = doc.querySelector(".head dt.key-other-link");
      expect(dt.textContent).toBe("KEY:");
      const dd = dt.nextElementSibling;
      expect(dd.localName).toBe("dd");
      expect(dd.textContent.trim()).toBe("VALUE");
      expect(dd.querySelector("a")).toBeNull();
    });
  });

  describe("testSuiteURI", () => {
    it("takes testSuiteURI into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        testSuiteURI: "my:uri",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const [dt] = contains(doc, ".head dt", "Test suite:");
      expect(dt.nextElementSibling.localName).toBe("dd");
      expect(dt.nextElementSibling.textContent).toBe("my:uri");
    });
  });

  describe("implementationReportURI", () => {
    it("takes implementationReportURI into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        implementationReportURI: "URI",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const dt = Array.from(doc.querySelectorAll("dt")).find(
        ({ textContent }) => /Implementation report:/.test(textContent)
      );
      const dd = dt.nextElementSibling;
      expect(dd.textContent.trim()).toBe("URI");
    });
  });

  describe("edDraftURI", () => {
    it("takes edDraftURI into account", async () => {
      const ops = makeStandardOps({
        specStatus: "WD",
        edDraftURI: "URI",
      });

      const doc = await makeRSDoc(ops);
      const terms = doc.querySelectorAll("dt");

      expect(terms[2].textContent).toBe("Latest editor's draft:");
      expect(terms[2].nextElementSibling.localName).toBe("dd");
      expect(terms[2].nextElementSibling.textContent).toBe("URI");
    });
  });

  describe("latestVersion", () => {
    it("adds a latest published version link", async () => {
      const ops = makeStandardOps({ shortName: "foo", specStatus: "ED" });
      const doc = await makeRSDoc(ops);

      const terms = [...doc.querySelectorAll("dt")];
      const latestVersion = terms.find(
        el => el.textContent.trim() === "Latest published version:"
      );
      expect(latestVersion).toBeTruthy();
      const latestVersionEl = latestVersion.nextElementSibling;
      expect(latestVersionEl.localName).toBe("dd");
      const latestVersionLink = latestVersionEl.querySelector("a");
      expect(latestVersionLink.href).toBe("https://www.w3.org/TR/foo/");
      expect(latestVersionLink.textContent).toBe("https://www.w3.org/TR/foo/");
    });

    it("allows skipping latest published version link in initial ED", async () => {
      const ops = makeStandardOps({ specStatus: "ED", latestVersion: null });
      const doc = await makeRSDoc(ops);

      const terms = [...doc.querySelectorAll("dt")];
      const latestVersion = terms.find(
        el => el.textContent.trim() === "Latest published version:"
      );
      expect(latestVersion).toBeTruthy();
      const latestVersionEl = latestVersion.nextElementSibling;
      expect(latestVersionEl.localName).toBe("dd");
      const latestVersionLink = latestVersionEl.querySelector("a");
      expect(latestVersionLink).toBeNull();
      expect(latestVersionEl.textContent.trim()).toBe("none");
    });

    it("allows overriding latest published version to a different location", async () => {
      const ops = makeStandardOps({
        shortName: "spec",
        specStatus: "CR",
        latestVersion: "https://somewhere.else/",
      });
      const doc = await makeRSDoc(ops);

      const terms = [...doc.querySelectorAll("dt")];
      const latestVersion = terms.find(
        el => el.textContent.trim() === "Latest published version:"
      );
      expect(latestVersion).toBeTruthy();
      const latestVersionEl = latestVersion.nextElementSibling;
      expect(latestVersionEl.localName).toBe("dd");
      const latestVersionLink = latestVersionEl.querySelector("a");
      expect(latestVersionLink.href).toBe("https://somewhere.else/");
      expect(latestVersionEl.textContent.trim()).toBe(
        "https://somewhere.else/"
      );
    });
    it("allows resolves latestVersion using w3c.org as the base", async () => {
      const ops = makeStandardOps({
        shortName: "some-spec",
        level: 3,
        specStatus: "CR",
        latestVersion: "TR/its-here",
      });
      const doc = await makeRSDoc(ops);

      const terms = [...doc.querySelectorAll("dt")];
      const latestVersion = terms.find(
        el => el.textContent.trim() === "Latest published version:"
      );
      expect(latestVersion).toBeTruthy();
      const latestVersionEl = latestVersion.nextElementSibling;
      expect(latestVersionEl.localName).toBe("dd");
      const latestVersionLink = latestVersionEl.querySelector("a");
      expect(latestVersionLink.href).toBe("https://www.w3.org/TR/its-here");
      expect(latestVersionEl.textContent.trim()).toBe(
        "https://www.w3.org/TR/its-here"
      );
    });
  });

  describe("prevED", () => {
    it("takes prevED into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "ED",
        prevED: "URI",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const [dt] = contains(doc, ".head dt", "Previous editor's draft:");
      expect(dt.nextElementSibling.localName).toBe("dd");
      expect(dt.nextElementSibling.textContent).toBe("URI");
    });
  });

  describe("additionalCopyrightHolders", () => {
    it("takes additionalCopyrightHolders into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        additionalCopyrightHolders: "XXX",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright").textContent).toMatch(
        /XXX\s+&\s+W3C/
      );
    });
    it("takes additionalCopyrightHolders into account for CG drafts", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "CG-DRAFT",
        additionalCopyrightHolders: "XXX",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright").textContent).toMatch(
        /XXX\s+&\s+the\s+Contributors\s+to\s+the/
      );
    });
    it("takes additionalCopyrightHolders into account for CG final reports", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "CG-FINAL",
        additionalCopyrightHolders: "XXX",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright", doc).textContent).toMatch(
        /XXX\s+&\s+the\s+Contributors\s+to\s+the/
      );
    });
    it("takes additionalCopyrightHolders into account for BG drafts", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "BG-DRAFT",
        additionalCopyrightHolders: "XXX",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright").textContent).toMatch(
        /XXX\s+&\s+the\s+Contributors\s+to\s+the/
      );
    });
    it("takes additionalCopyrightHolders into account for BG final reports", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "BG-FINAL",
        additionalCopyrightHolders: "XXX",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright").textContent).toMatch(
        /XXX\s+&\s+the\s+Contributors\s+to\s+the/
      );
    });

    it("handles additionalCopyrightHolders when text is markup, is a CGBG spec, and has a valid level", async () => {
      const ops = makeStandardOps({
        specStatus: "CG-DRAFT",
        additionalCopyrightHolders: "<span class='test'>XXX</span>",
        level: 99,
      });

      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright").textContent).toContain(
        "Level 99"
      );
      expect(doc.querySelector(".head .copyright .test").textContent).toBe(
        "XXX"
      );
    });
  });

  it("it allows custom copyright directly in document, which gets relocated to the .head", async () => {
    const body = `
      <p class="copyright">
        No copyright intended.
      </p>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const copyright = doc.querySelector(".head p.copyright");
    expect(copyright).toBeTruthy();
    expect(copyright.textContent.trim()).toBe("No copyright intended.");
    expect(doc.querySelectorAll(".copyright")).toHaveSize(1);
  });

  it("it allows custom copyright for different kinds of documents", async () => {
    const body = `
      <p class="copyright">
        No copyright intended.
      </p>
    `;
    for (const specStatus of ["CD-DRAFT", "unofficial", "CG-FINAL"]) {
      const ops = makeStandardOps({ specStatus }, body);
      const doc = await makeRSDoc(ops);
      const copyright = doc.querySelector(".head p.copyright");
      expect(copyright).withContext(specStatus).toBeTruthy();
      expect(copyright.textContent.trim())
        .withContext(specStatus)
        .toBe("No copyright intended.");
      expect(doc.querySelectorAll(".copyright"))
        .withContext(specStatus)
        .toHaveSize(1);
    }
  });

  describe("copyrightStart", () => {
    it("takes copyrightStart with an old date", async () => {
      const ops = makeStandardOps();
      const newProps = {
        publishDate: "2012-03-15",
        copyrightStart: "1977",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright").textContent).toContain(
        "1977-2012"
      );
    });

    it("handles copyrightStart with a new date", async () => {
      const ops = makeStandardOps();
      const newProps = {
        publishDate: "2012-03-15",
        copyrightStart: "2012",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright").textContent).not.toContain(
        "2012-2012"
      );
    });
  });

  describe("wgPatentPolicy", () => {
    it("supports wgPatentPolicy as string", async () => {
      const ops = makeStandardOps({
        wgPatentPolicy: "PP2020",
      });
      const doc = await makeRSDoc(ops, simpleSpecURL);
      expect(doc.respec.errors).toHaveSize(0);
      const patentPolicyLink = doc.querySelector(
        "#sotd a[href='https://www.w3.org/Consortium/Patent-Policy/']"
      );
      expect(patentPolicyLink).toBeTruthy();
    });

    it("supports wgPatentPolicy as an array", async () => {
      const ops = makeStandardOps({
        wgPatentPolicy: ["PP2020", "PP2020"],
      });
      const doc = await makeRSDoc(ops, simpleSpecURL);
      expect(doc.respec.errors).toHaveSize(0);
      const patentPolicyLink = doc.querySelector(
        "#sotd a[href='https://www.w3.org/Consortium/Patent-Policy/']"
      );
      expect(patentPolicyLink).toBeTruthy();
    });

    it("errors when the patent policy is invalid", async () => {
      const ops = makeStandardOps({
        wgPatentPolicy: "NOT A Patent Policy",
      });
      const doc = await makeRSDoc(ops, simpleSpecURL);
      expect(doc.respec.errors).toHaveSize(1);
      const [error] = doc.respec.errors;
      expect(error.plugin).toBe("w3c/headers");
      expect(error.message).toContain("Invalid [`wgPatentPolicy`]");
    });

    it("errors when patent policies don't match", async () => {
      const ops = makeStandardOps({
        wgPatentPolicy: ["PP2017", "PP2020"],
      });
      const doc = await makeRSDoc(ops, simpleSpecURL);
      expect(doc.respec.errors).toHaveSize(1);
      const [error] = doc.respec.errors;
      expect(error.plugin).toBe("w3c/headers");
      expect(error.message).toContain("must use the same patent policy");
    });

    it("errors when some patent policy is invalid", async () => {
      const ops = makeStandardOps({
        wgPatentPolicy: ["PP2020", "NOT A Patent Policy", "PP2017"],
      });
      const doc = await makeRSDoc(ops, simpleSpecURL);
      expect(doc.respec.errors).toHaveSize(2);
      const [error1, error2] = doc.respec.errors;
      expect(error1.plugin).toBe("w3c/headers");
      expect(error1.message).toContain("Invalid [`wgPatentPolicy`]");
      expect(error2.plugin).toBe("w3c/headers");
      expect(error2.message).toContain("must use the same patent policy");
    });
  });

  describe("wgId, data-deliverer, and isNote", () => {
    it("gracefully handles missing wgPatentURI", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "NOTE",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops, simpleSpecURL);
      const elem = doc.querySelector("p[data-deliverer]");
      const { wgId, isNote } = doc.defaultView.respecConfig;
      expect(isNote).toBe(true);
      expect(wgId).toBe("");
      expect(elem).toBeTruthy();
      expect(elem.dataset.deliverer).toBe("");
    });
    it("only doesn't data-deliverer for non-notes", async () => {
      const ops = makeStandardOps();
      const newProps = {
        group: "webapps",
        specStatus: "WD",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops, simpleSpecURL);
      const elem = doc.querySelector("p[data-deliverer]");
      const { wgId, isNote } = doc.defaultView.respecConfig;
      expect(isNote).toBe(false);
      expect(wgId).toBe(114929);
      expect(elem).toBeNull();
    });
    it("excludes the long patent text for note types", async () => {
      const noteTypes = ["DNOTE", "NOTE"];
      for (const specStatus of noteTypes) {
        const opts = makeStandardOps({ specStatus });
        const doc = await makeRSDoc(opts);
        const sotd = doc.querySelector("#sotd");
        const [p] = contains(sotd, "p", "Patent Policy");
        const normalized = p.textContent.trim().replace(/\s+/gm, " ");
        expect(normalized).toBe(
          "The W3C Patent Policy does not carry any licensing requirements or commitments on this document."
        );
      }
    });
  });

  describe("perEnd", () => {
    it("correctly flags a PER", async () => {
      const ops = makeStandardOps();
      const newProps = {
        previousMaturity: "REC",
        previousPublishDate: "2014-01-01",
        prevRecURI: "https://www.example.com/rec.html",
        implementationReportURI: "https://www.example.com/report.html",
        perEnd: "2014-12-01",
        specStatus: "PER",
        wg: "WGNAME",
        wgURI: "WGURI",
        wgPublicList: "WGLIST",
        subjectPrefix: "[The Prefix]",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const sotd = doc.getElementById("sotd");
      const f = contains(sotd, "p", "Proposed Edited Recommendation");
      expect(f).toHaveSize(2);
      const questionnaires = doc
        .getElementById("sotd")
        .querySelector(
          "a[href='https://www.w3.org/2002/09/wbs/myQuestionnaires']"
        );
      expect(questionnaires).toBeNull();
    });
  });

  describe("sotdAfterWGinfo", () => {
    it("relocates custom sotd", async () => {
      const ops = makeStandardOps();
      const newProps = {
        sotdAfterWGinfo: true,
        wg: "WGNAME",
        wgURI: "WGURI",
        wgPublicList: "WGLIST",
        subjectPrefix: "[The Prefix]",
        implementationReportURI: "",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops, simpleSpecURL);
      const sotd = doc.getElementById("sotd");
      const f = contains(sotd, "p", "CUSTOM PARAGRAPH");
      expect(f).toHaveSize(1);
    });

    it("localizes sotd", async () => {
      const ops = {
        config: makeBasicConfig(),
        htmlAttrs: {
          lang: "es",
        },
        body: `
        <section id="sotd">
          State of the document
        </section>
      `,
      };
      const doc = await makeRSDoc(ops);
      const { textContent } = doc.querySelector("#sotd h2");
      expect(doc.documentElement.lang).toBe("es");
      expect(textContent).toContain("Estado de este Document");
    });
  });

  describe("addPatentNote", () => {
    it("takes addPatentNote into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        addPatentNote: "<strong>PATENTNOTE</strong>",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector("#sotd p strong").textContent).toBe(
        "PATENTNOTE"
      );
    });
  });

  describe("CG/BG", () => {
    it("handles CG-DRAFT status", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "CG-DRAFT",
        wg: "WGNAME",
        wgURI: "http://WG",
        wgPublicList: "WGLIST",
        subjectPrefix: "[The Prefix]",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const c = doc.querySelector(".head .copyright");
      expect(c.querySelectorAll("a[href='http://WG']")).toHaveSize(1);
      expect(contains(c, "a", "WGNAME")).toHaveSize(1);
      expect(
        c.querySelectorAll(
          "a[href='https://www.w3.org/community/about/agreements/cla/']"
        )
      ).toHaveSize(1);
      expect(doc.querySelector(".head h2").textContent).toContain(
        "Draft Community Group Report"
      );
      const sotd = doc.getElementById("sotd");
      expect(sotd.querySelectorAll("a[href='http://WG']")).toHaveSize(1);
      expect(contains(sotd, "a", "WGNAME")).toHaveSize(1);
      expect(
        sotd.querySelectorAll(
          "a[href='https://www.w3.org/community/about/agreements/cla/']"
        )
      ).toHaveSize(1);
      expect(contains(sotd, "a", "WGLIST")).toHaveSize(1);
      expect(contains(sotd, "a", "WGLIST")[0].getAttribute("href")).toBe(
        "mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D"
      );
      expect(contains(sotd, "a", "subscribe")[0].getAttribute("href")).toBe(
        "mailto:WGLIST-request@w3.org?subject=subscribe"
      );
      expect(contains(sotd, "a", "archives")[0].getAttribute("href")).toBe(
        "https://lists.w3.org/Archives/Public/WGLIST/"
      );
    });

    it("handles CG-DRAFT status with just github preferred", async () => {
      const ops = makeStandardOps({
        specStatus: "CG-DRAFT",
        group: "maps4html",
        github: "Maps4HTML/MapML",
        editors: [{ name: "test" }],
      });
      const doc = await makeRSDoc(ops);
      const sotd = doc.getElementById("sotd");
      // Link to github
      expect(
        sotd.querySelectorAll(
          "a[href='https://github.com/Maps4HTML/MapML/issues/']"
        )
      ).toHaveSize(1);
      expect(contains(sotd, "a", "GitHub Issues")).toHaveSize(1);
      // No Mailiing list
      expect(sotd.querySelector("a[href^=mailto]")).toBeNull();
    });

    it("handles CG-DRAFT status with github and mailing list", async () => {
      const ops = makeStandardOps({
        specStatus: "CG-DRAFT",
        group: "maps4html",
        wgPublicList: "WGLIST",
        subjectPrefix: "[The Prefix]",
        github: "Maps4HTML/MapML",
        editors: [{ name: "test" }],
      });
      const doc = await makeRSDoc(ops);
      const sotd = doc.getElementById("sotd");
      // Link to github
      expect(
        sotd.querySelectorAll(
          "a[href='https://github.com/Maps4HTML/MapML/issues/']"
        )
      ).toHaveSize(1);
      expect(contains(sotd, "a", "GitHub Issues")).toHaveSize(1);
      // Mailiing list
      expect(contains(sotd, "a", "Maps For HTML Community Group")).toHaveSize(
        1
      );
      expect(contains(sotd, "a", "WGLIST")).toHaveSize(1);
      expect(contains(sotd, "a", "WGLIST")[0].getAttribute("href")).toBe(
        "mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D"
      );
      expect(contains(sotd, "a", "subscribe")[0].getAttribute("href")).toBe(
        "mailto:WGLIST-request@w3.org?subject=subscribe"
      );
      expect(contains(sotd, "a", "archives")[0].getAttribute("href")).toBe(
        "https://lists.w3.org/Archives/Public/WGLIST/"
      );
    });

    it("handles BG-FINAL status", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "BG-FINAL",
        wg: "WGNAME",
        wgURI: "http://WG",
        thisVersion: "http://THIS",
        latestVersion: "https://some.places/LATEST",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(
        doc.querySelectorAll(
          ".head .copyright a[href='https://www.w3.org/community/about/agreements/fsa/']"
        )
      ).toHaveSize(1);
      expect(doc.querySelector(".head h2").textContent).toContain(
        "Final Business Group Report"
      );
      const terms = doc.querySelectorAll("dt");
      expect(terms[0].textContent).toBe("This version:");
      expect(terms[0].nextElementSibling.localName).toBe("dd");
      expect(terms[0].nextElementSibling.textContent).toContain("http://THIS");
      expect(terms[1].textContent).toBe("Latest published version:");
      expect(terms[1].nextElementSibling.localName).toBe("dd");
      expect(terms[1].nextElementSibling.textContent).toContain(
        "https://some.places/LATEST"
      );
      const sotd = doc.getElementById("sotd");
      expect(sotd.querySelectorAll("a[href='http://WG']")).toHaveSize(1);
      expect(contains(sotd, "a", "WGNAME")).toHaveSize(1);
      expect(
        sotd.querySelectorAll(
          "a[href='https://www.w3.org/community/about/agreements/final/']"
        )
      ).toHaveSize(1);
    });

    it("handles the spec title in the copyright section correctly when the h1#title has markup", async () => {
      const body = `<h1 id="title">Spec with <code>markup</code>!</h1>${makeDefaultBody()}`;
      const props = { specStatus: "BG-FINAL" };
      const ops = makeStandardOps(props, body);
      const doc = await makeRSDoc(ops);

      // html is not escaped
      const elemWithSpecTitle = doc.querySelector(".head .copyright");
      expect(elemWithSpecTitle.textContent).toContain("Spec with markup!");

      const markupNode = elemWithSpecTitle.querySelector("code");
      expect(markupNode.textContent).toBe("markup");
    });
  });

  describe("Member-SUBM", () => {
    let doc;
    beforeAll(async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "Member-SUBM",
        submissionCommentNumber: "01",
        publishDate: "2018-05-25",
        shortName: "yolo",
      };
      Object.assign(ops.config, newProps);
      doc = await makeRSDoc(ops);
    });
    it("shouldn't expose a Previous version link for Member submissions", async () => {
      expect(contains(doc, "dt", "Previous version:")).toHaveSize(0);
    });
    it("displays the Member Submission logo for Member submissions", async () => {
      const img = doc.querySelector(
        ".head img[src^='https://www.w3.org/Icons/member_subm']"
      );
      expect(img).toBeTruthy();
    });
    it("uses the right SoTD boilerplate for Member submissions", async () => {
      const sotd = doc.getElementById("sotd").textContent.replace(/\s+/gm, " ");
      const testString =
        "the Submitting Members have made a formal Submission request";
      expect(sotd).toContain(testString);
    });
    it("links the right submitting members", async () => {
      const anchor = doc.querySelector(
        "#sotd a[href='https://www.w3.org/Submission/2018/Member-SUBM-yolo-20180525/']"
      );
      expect(anchor).toBeTruthy();
    });
    it("shows the correct staff comments", async () => {
      const anchor = doc.querySelector(
        "#sotd a[href='https://www.w3.org/Submission/2018/01/Comment/']"
      );
      expect(anchor).toBeTruthy();
    });
  });

  it("allows sotd section to be completely overridden", async () => {
    const body = `
      <section id="sotd" class="override">
        <h2>Override</h2>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const sotd = doc.getElementById("sotd");
    expect(sotd).toBeTruthy();
    expect(sotd.firstElementChild.localName).toBe("h2");
    expect(sotd.firstElementChild.textContent).toBe("Override");
    expect(sotd.firstElementChild).toBe(sotd.lastElementChild);
  });

  it("allows custom sections and custom content, not just paragraphs", async () => {
    const body = `
    <section>
      <h2>PASS</h2>
      <p>Normal section.</p>
    </section>
    <!-- nothing here will appear in the ToC -->
    <section id="sotd" class="introductory notoc">
      <h2>test</h2>
      <p id="p1">
        CUSTOM PARAGRAPH 1
      </p>
      <p id="p2">
        CUSTOM PARAGRAPH 2
      </p><!--
      comment node
      -->
      text node
      <ol id="ol">
        <li>item 1</li>
        <li>item 2</li>
      </ol>
      <section id="first-sub-section">
        <h3>Testing</h3>
      </section>
      <p id="p3">
        This is terrible, but can happen.
      </p>
      <section id="last-sub-section">
        <h2>not in toc...</h2>
      </section>
    </section>`;
    const theTest = (doc, context) => {
      // the class introductory is added by script
      const sotd = doc.getElementById("sotd");

      expect(sotd.classList).toContain("introductory");

      const p1 = doc.getElementById("p1");
      expect(p1).toBeTruthy();
      expect(p1.textContent.trim()).toBe("CUSTOM PARAGRAPH 1");

      const p2 = doc.getElementById("p2");
      expect(p2).toBeTruthy();
      expect(p2.textContent.trim()).toBe("CUSTOM PARAGRAPH 2");

      const commentNode = p2.nextSibling;
      expect(commentNode.nodeType).toBe(Node.COMMENT_NODE);

      const textNode = commentNode.nextSibling;
      expect(textNode.nodeType).toBe(Node.TEXT_NODE);

      const ol = doc.getElementById("ol");
      expect(ol).toBeTruthy();
      expect(ol.querySelectorAll("li")).toHaveSize(2);
      const firstSection = doc.getElementById("first-sub-section");

      expect(sotd.lastElementChild).not.toBe(firstSection);

      const lastSection = doc.getElementById("last-sub-section");
      expect(sotd.lastElementChild).toBe(lastSection);

      // p3 is sandwiched in between the sections
      const p3 = doc.getElementById("p3");
      expect(p3).toBeTruthy();
      expect(p3.previousElementSibling).toBe(firstSection);
      expect(p3.nextElementSibling).toBe(lastSection);

      // Abstract, PASS, Another TOC thing
      expect(doc.querySelectorAll("#toc li"))
        .withContext(context)
        .toHaveSize(2);
      // and it should say "PASS"
      expect(doc.querySelector("#toc li bdi").nextSibling.textContent).toBe(
        "PASS"
      );
    };
    theTest(await makeRSDoc(makeStandardOps({}, body)), "normal working group");
    theTest(
      await makeRSDoc(
        makeStandardOps({ specStatus: "CG-DRAFT", wg: "WICG" }, body)
      ),
      "community group draft"
    );
  });
  it("includes translation link when it's a REC", async () => {
    const ops = makeStandardOps();
    const newProps = {
      specStatus: "REC",
      shortName: "PASS",
    };
    Object.assign(ops.config, newProps);
    const doc = await makeRSDoc(ops);
    const aElem = doc.querySelector(
      `a[href^="https://www.w3.org/Translations/"]`
    );
    expect(aElem.href.endsWith("PASS")).toBeTruthy();
    const textContent = aElem.parentElement.textContent
      .trim()
      .replace("\n", "")
      .replace(/\s+/g, " ");
    expect(textContent).toBe("See also translations.");
  });
  it("doesn't include a translation link when it's not REC", async () => {
    const ops = makeStandardOps();
    const newProps = {
      specStatus: "CR",
      shortName: "FAIL",
    };
    Object.assign(ops.config, newProps);
    const doc = await makeRSDoc(ops);
    const aElem = doc.querySelector(
      `a[href^="https://www.w3.org/Translations/"]`
    );
    expect(aElem).toBeNull();
  });
  describe("isPreview", () => {
    it("adds annoying warning when isPreview", async () => {
      const ops = makeStandardOps();
      const newProps = {
        isPreview: true,
        shortName: "whatever",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      // has details with annoying annoying warning
      const aElem = doc.querySelector(`#sotd details.annoying-warning[open]`);
      expect(aElem).toBeTruthy();
    });
  });

  describe("logos", () => {
    it("does not add any default logo when spec is unofficial", async () => {
      const ops = makeStandardOps({ specStatus: "unofficial" });
      const doc = await makeRSDoc(ops);
      const logos = doc.querySelectorAll("a.logo");
      expect(logos).toHaveSize(0);
    });

    it("adds allows multiple logos when spec is unofficial", async () => {
      const ops = makeStandardOps();
      const logos = [
        {
          src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          alt: "Logo 1",
          id: "logo1",
        },
        {
          src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          alt: "Logo 2",
          id: "logo2",
        },
      ];
      Object.assign(ops.config, { logos, specStatus: "unofficial" });
      const doc = await makeRSDoc(ops);
      const elems = doc.querySelectorAll("a.logo");
      expect(elems).toHaveSize(2);
    });

    it("adds W3C logo for status EDs by default", async () => {
      const ops = makeStandardOps({ specStatus: "ED" });
      const doc = await makeRSDoc(ops);
      const logo = doc.querySelector("a.logo");
      expect(logo.href).toBe("https://www.w3.org/");
    });

    it("adds W3C logo for status W3C Notes", async () => {
      const notes = ["DNOTE", "NOTE"];
      for (const specStatus of notes) {
        const ops = makeStandardOps({ specStatus });
        const doc = await makeRSDoc(ops);
        const logo = doc.querySelector("a.logo");
        expect(logo.href)
          .withContext(`specStatus : "${specStatus}"`)
          .toBe("https://www.w3.org/");
      }
    });

    it("allows overriding logos for EDs", async () => {
      const ops = makeStandardOps({
        specStatus: "ED",
        logos: [
          {
            src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
            alt: "Logo",
            id: "logo",
            url: "https://somewhere.else/",
          },
        ],
      });
      const doc = await makeRSDoc(ops);
      expect(doc.querySelectorAll("a.logo")).toHaveSize(1);
      const logo = doc.querySelector("a.logo");
      expect(logo.href).toBe("https://somewhere.else/");
    });

    it("adds logos defined by configuration", async () => {
      const logos = [
        {
          src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          alt: "this is a small gif",
          height: 765,
          width: 346,
          url: "http://hyperlink/",
        },
        {
          src: 'data:image/svg+xml,<svg%20xmlns="http://www.w3.org/2000/svg"/>',
          alt: "this is an svg",
          height: 315,
          width: 961,
          url: "http://prod/",
        },
        {
          src: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
          alt: "this is a larger gif",
          height: 876,
          width: 283,
          url: "http://shiny/",
        },
      ];
      const ops = makeStandardOps({ specStatus: "WD", logos });
      const doc = await makeRSDoc(ops);
      // get logos
      const logosAnchors = [...doc.querySelectorAll(".logo")];
      expect(logos).toHaveSize(3);

      // remove W3C logo
      const w3cLogo = logosAnchors.shift();
      expect(w3cLogo).toBeTruthy();
      // check w3c logo url
      expect(w3cLogo.href).toBe("https://www.w3.org/");

      logosAnchors.forEach((anchor, i) => {
        const logo = logos[i];
        const img = anchor.querySelector("img");
        expect(anchor.href).toBe(logo.url);
        expect(img.src).toBe(logo.src);
        expect(img.alt).toBe(logo.alt);
        expect(img.height).toBe(logo.height);
        expect(img.width).toBe(logo.width);
        expect(img.crossOrigin).toBe("anonymous");
      });
    });

    it("shows errors if a logo are lacks a alt and src", async () => {
      const logos = [
        {
          // not alt, no src - so 2 errors
          id: "logo-1",
        },
        {
          id: "logo-2",
          src: "", // error
          alt: "", // error
        },
        {
          id: "logo-3",
          src: "https://www.w3.org/StyleSheets/TR/2021/logos/W3C",
          alt: "some alt",
        },
      ];
      const ops = makeStandardOps({ specStatus: "ED", logos });
      const doc = await makeRSDoc(ops);
      expect(doc.respec.errors).toHaveSize(4);
      doc.respec.errors.every(
        ({ plugin }) => plugin === "core/templates/show-logo"
      );
    });
  });

  describe("Feedback", () => {
    it("includes a Feedback: with a <dd> to github issues", async () => {
      const doc = await makeRSDoc(
        makeStandardOps({ github: "w3c/respec", specStatus: "WD" })
      );
      const [dt] = contains(doc, ".head dt", "Feedback:");
      const dd = dt.nextElementSibling;
      expect(dd.querySelector("a[href^='https://github.com/']")).toBeTruthy();
    });

    it("includes links for to new issue, pull requests, open issues", async () => {
      const doc = await makeRSDoc(makeStandardOps({ github: "w3c/respec" }));
      const [prLink] = contains(
        doc,
        ".head a[href='https://github.com/w3c/respec/pulls/']",
        "pull requests"
      );
      expect(prLink).toBeTruthy();
      const [openIssue] = contains(
        doc,
        ".head a[href='https://github.com/w3c/respec/issues/']",
        "open issues"
      );
      expect(openIssue).toBeTruthy();
      const [newIssue] = contains(
        doc,
        ".head a[href='https://github.com/w3c/respec/issues/new/choose']",
        "new issue"
      );
      expect(newIssue).toBeTruthy();
    });

    it("includes a Feedback: with a <dd> for mailing list, when mailing list is supplied", async () => {
      const opts = makeStandardOps({
        wgPublicList: "public-webapps",
      });
      const doc = await makeRSDoc(opts);
      const [dd] = contains(doc, ".head dd", "public-webapps@w3.org");

      // Check the archive link
      const archive = dd.querySelector(
        "a[rel='discussion'][href^='https://lists.w3.org/']"
      );
      expect(archive).toBeTruthy();
      expect(archive.textContent.trim()).toBe("archives");
    });
  });

  describe("History", () => {
    it("shows the publication history of the spec", async () => {
      const ops = makeStandardOps({ shortName: "test", specStatus: "WD" });
      const doc = await makeRSDoc(ops);
      const [history] = contains(doc, ".head dt", "History:");
      expect(history).toBeTruthy();
      expect(history.nextElementSibling).toBeTruthy();
      const historyLink = history.nextElementSibling.querySelector("a");
      expect(historyLink).toBeTruthy();
      expect(historyLink.href).toBe(
        "https://www.w3.org/standards/history/test"
      );
      expect(historyLink.textContent).toContain(
        "https://www.w3.org/standards/history/test"
      );
    });

    it("includes a dd for the commit history of the document", async () => {
      const ops = makeStandardOps({
        github: "w3c/respec",
        shortName: "test",
        specStatus: "WD",
      });
      const doc = await makeRSDoc(ops);
      const commitHistory = doc.querySelector(
        ".head dd>a[href='https://github.com/w3c/respec/commits/']"
      );
      expect(commitHistory).toBeTruthy();
      const [publicationHistory] = contains(
        doc,
        ".head dd>a[href='https://www.w3.org/standards/history/test']",
        "https://www.w3.org/standards/history/test"
      );
      expect(publicationHistory).toBeTruthy();
    });

    it("includes a dd for the commit history, but excludes a publication history for unpublished types", async () => {
      for (const specStatus of ["unofficial", "base"]) {
        const ops = makeStandardOps({
          github: "my/some-repo",
          shortName: "test",
          specStatus,
        });
        const doc = await makeRSDoc(ops);
        const [commitHistory] = contains(doc, ".head dd>a", "Commit history");
        expect(commitHistory).withContext(specStatus).toBeTruthy();
        const publicationHistory = contains(
          doc,
          ".head dd>a",
          "Publication history"
        );
        expect(publicationHistory.length).withContext(specStatus).toBe(0);
      }
    });

    it("allows overriding the historyURI", async () => {
      const ops = makeStandardOps({
        shortName: "test",
        specStatus: "WD",
        historyURI: "http://example.com/history",
      });
      const doc = await makeRSDoc(ops);
      const [history] = contains(doc, ".head dt", "History:");
      expect(history).toBeTruthy();
      expect(history.nextElementSibling).toBeTruthy();
      const historyLink = history.nextElementSibling.querySelector("a");
      expect(historyLink).toBeTruthy();
      expect(historyLink.href).toBe("http://example.com/history");
    });

    it("allowing removing the history entirely buy nulling it out", async () => {
      const ops = makeStandardOps({
        shortName: "test",
        specStatus: "WD",
        historyURI: null,
      });
      const doc = await makeRSDoc(ops);
      const [history] = contains(doc, ".head dt", "History:");
      expect(history).toBeFalsy();
    });

    it("derives the historyURI automatically when it's missing, but the document is on TR", async () => {
      const ops = makeStandardOps({
        shortName: "payment-request",
        specStatus: "ED",
      });
      const doc = await makeRSDoc(ops);
      const [history] = contains(doc, ".head dt", "History:");
      expect(history).toBeTruthy();
      expect(history.nextElementSibling).toBeTruthy();
      const historyLink = history.nextElementSibling.querySelector("a");
      expect(historyLink).toBeTruthy();
      expect(historyLink.href).toBe(
        "https://www.w3.org/standards/history/payment-request"
      );
    });

    it("includes the history for all rec-track status docs", async () => {
      for (const specStatus of recTrackStatus) {
        const shortName = `${specStatus}-test`;
        const ops = makeStandardOps({
          shortName,
          specStatus,
        });
        const doc = await makeRSDoc(ops);
        const [history] = contains(doc, ".head dt", "History:");
        expect(history).withContext(specStatus).toBeTruthy();
        expect(history.nextElementSibling).withContext(specStatus).toBeTruthy();
        const historyLink = history.nextElementSibling.querySelector("a");
        expect(historyLink).withContext(specStatus).toBeTruthy();
        expect(historyLink.href)
          .withContext(specStatus)
          .toBe(`https://www.w3.org/standards/history/${shortName}`);
      }
    });
  });

  describe("Add Preview Status in title", () => {
    it("when document title is present", async () => {
      const ops = makeStandardOps();
      const doc = await makeRSDoc(
        ops,
        "spec/core/simple.html?isPreview=true&prNumber=123&prUrl=%22http%3A//w3c.github.io/respec/%22"
      );
      expect(doc.title).toBe("Preview of PR #123: Simple Spec");
      const h1 = doc.querySelector("h1#title");
      expect(h1.textContent).toContain("Preview of PR #123:");
      expect(h1.textContent).toContain("Simple Spec");
      expect(h1.querySelector("a").href).toBe("http://w3c.github.io/respec/");
    });

    it("constructs PR URL when prURL is not provided", async () => {
      const ops = makeStandardOps({ github: "w3c/some-spec" });
      const doc = await makeRSDoc(
        ops,
        "spec/core/simple.html?isPreview=true&prNumber=123"
      );
      expect(doc.title).toBe("Preview of PR #123: Simple Spec");
      const h1 = doc.querySelector("h1#title");
      expect(h1.textContent).toContain("Preview of PR #123:");
      expect(h1.textContent).toContain("Simple Spec");
      expect(h1.querySelector("a").href).toBe(
        "https://github.com/w3c/some-spec/pull/123"
      );
    });

    it("when only <h1> title is present", async () => {
      const ops = {
        config: {
          isPreview: true,
          prNumber: 123,
          prUrl: "http://w3c.github.io/respec/",
        },
        body: `<h1 id='title'>Simple Spec</h1>${makeDefaultBody()}`,
      };
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("Preview of PR #123: Simple Spec");
      const h1 = doc.querySelector("h1#title");
      expect(h1.textContent).toContain("Preview of PR #123:");
      expect(h1.textContent).toContain("Simple Spec");
      expect(h1.querySelector("a").href).toBe("http://w3c.github.io/respec/");
    });
  });
});
