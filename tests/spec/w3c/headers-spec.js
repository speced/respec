"use strict";
const findContent = string => {
  return ({ textContent }) => textContent.trim() === string;
};
describe("W3C — Headers", () => {
  afterEach(flushIframes);
  const simpleSpecURL = "spec/core/simple.html";
  const contains = (el, query, string) =>
    [...el.querySelectorAll(query)].filter(child =>
      child.innerHTML.includes(string)
    );
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
      expect(doc.querySelector(".head h2").textContent).toContain(
        "W3C Editor's Draft"
      );
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
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(contains(doc, "dt", "Editors:").length).toBe(0);
      expect(contains(doc, "dt", "Editor:").length).toBe(1);
      const dd = doc.querySelectorAll("dd")[5];
      expect(dd.querySelectorAll("a[href='http://COMPANY']").length).toBe(1);
      expect(dd.querySelector("a[href='http://COMPANY']").textContent).toBe(
        "COMPANY"
      );
      expect(dd.querySelectorAll("a[href='mailto:EMAIL']").length).toBe(1);
      expect(dd.querySelector("a[href='mailto:EMAIL']").textContent).toBe(
        "NAME"
      );
      // if `mailto` is specified in People, `url` won't be used
      expect(dd.querySelectorAll("a[href='http://URI']").length).toBe(0);
      expect(dd.dataset.editorId).toBe("1234");
      expect(dd.textContent).toMatch("(NOTE)");
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
      expect(dtEditors.length).toBe(1);
      expect(dtEditor.length).toBe(0);
      const dd = dtEditors[0].nextElementSibling;
      expect(dd.textContent).toBe("NAME1");
      expect(dd.nextElementSibling.textContent).toBe("NAME2");
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
                name: "0000-0003-0782-2704",
                href: "http://orcid.org/0000-0003-0782-2704",
                class: "orcid",
              },
              {
                name: "@ivan_herman",
                href: "http://twitter.com/ivan_herman",
                class: "twitter",
              },
              {
                href: "http://not-valid-missing-name",
                class: "invalid",
              },
              {
                name: "\n\t  \n",
                href: "http://empty-name",
                class: "invalid",
              },
            ],
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const oricdHref = ops.config.editors[0].extras[0].href;
      const twitterHref = ops.config.editors[0].extras[1].href;
      const orcidAnchor = doc.querySelector(`a[href='${oricdHref}']`);
      const twitterAnchor = doc.querySelector(`a[href='${twitterHref}']`);
      // general checks
      const header = doc.querySelector("div.head");
      [orcidAnchor, twitterAnchor].forEach(elem => {
        // Check parent is correct.
        expect(elem.parentNode.localName).toBe("span");
        // Check that it's in the header of the document
        expect(header.contains(elem)).toBe(true);
      });
      // Check CSS is correctly applied
      expect(orcidAnchor.parentNode.className).toBe("orcid");
      expect(twitterAnchor.parentNode.className).toBe("twitter");
      // check that extra items with no name are ignored
      expect(doc.querySelector("a[href='http://not-valid']")).toBe(null);
      expect(doc.querySelector("a[href='http://empty-name']")).toBe(null);
    });

    it("treats editor's info as HTML", async () => {
      const config = {
        specStatus: "REC",
        editors: [
          {
            name:
              "<span lang='ja'>阿南 康宏</span> (Yasuhiro Anan), (<span lang='ja'>第１版</span> 1st edition)",
            company: "<span lang='ja'>マイクロソフト</span> (Microsoft)",
          },
        ],
      };
      const ops = makeStandardOps(config);
      const doc = await makeRSDoc(ops);
      const dtElems = [...doc.querySelectorAll(".head dt")];
      const dtElem = dtElems.find(findEditor);
      const ddElem = dtElem.nextElementSibling;
      const [personName, edition, company] = ddElem.querySelectorAll(
        "span[lang=ja]"
      );
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
      expect(editorCompany.length).toBe(1);
      expect(editorCompany[0].textContent).toBe("COMPANY");

      const editorEmail = editor.querySelectorAll("a[href='mailto:EMAIL']");
      expect(editorEmail.length).toBe(1);
      expect(editorEmail[0].textContent).toBe("NAME");

      // if `mailto` is specified in People, `url` won't be used
      const editorUrl = editor.querySelectorAll("a[href='http://URI']");
      expect(editorUrl.length).toBe(0);

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
      expect(firstEditor.textContent).toBe("NAME1");

      const secondEditor = firstEditor.nextSibling;
      expect(secondEditor.localName).toBe("dd");
      expect(secondEditor.textContent).toBe("NAME2");
    });

    it("treats formerEditor's name as HTML", async () => {
      const config = {
        specStatus: "REC",
        formerEditors: [
          {
            name:
              "<span lang='ja'>阿南 康宏</span> (Yasuhiro Anan), (<span lang='ja'>第１版</span> 1st edition)",
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
      expect(dtAuthors.length).toBe(0);
      expect(dtAuthor.length).toBe(1);
      const dd = dtAuthor[0].nextElementSibling;
      expect(dd.textContent).toBe("NAME1");
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
      expect(contains(doc, "dt", "Authors:").length).toBe(1);
      expect(contains(doc, "dt", "Author:").length).toBe(0);
      expect(contains(doc, "dt", "Authors:")[0].nextSibling.textContent).toBe(
        "NAME1"
      );
      expect(
        contains(doc, "dt", "Authors:")[0].nextSibling.nextSibling.textContent
      ).toBe("NAME2");
    });
  });

  describe("use existing h1 element", () => {
    it("uses the <h1>'s value as the document's title", async () => {
      const body = `
        <h1 id='title'>
          This should be <code>pass</code>.
         </h1>${makeDefaultBody()}`;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("This should be pass.");
      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("This should be pass.");
    });

    it("uses <h1> if already present", async () => {
      const ops = makeStandardOps();
      ops.body = `<h1 id='title'><code>pass</code></h1>${makeDefaultBody()}`;
      const doc = await makeRSDoc(ops);

      // Title was relocated to head
      const titleInHead = doc.querySelector(".head h1");
      expect(titleInHead.classList.contains("p-name")).toBe(true);
      expect(titleInHead.id).toBe("title");

      // html is not escaped
      expect(titleInHead.firstChild.tagName).toBe("CODE");
      expect(titleInHead.textContent).toBe("pass");

      // the config title is overridden
      const { title } = doc.defaultView.respecConfig;
      expect(title).toBe("pass");
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
      expect(doc.getElementById("subtitle")).toBe(null);
    });

    it("uses existing h2#subtitle as subtitle", async () => {
      const ops = makeStandardOps();
      ops.body = `<h2 id='subtitle'><code>pass</code></h2>${makeDefaultBody()}`;
      const doc = await makeRSDoc(ops);

      const subTitleElements = doc.querySelectorAll("h2#subtitle");
      expect(subTitleElements.length).toBe(1);

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
      expect(contains(doc, "h2", "15 March 1977").length).toBe(1);
    });
  });

  describe("previousPublishDate & previousMaturity", () => {
    it("recovers given bad date inputs", async () => {
      const ISODate = await new Promise(resolve => {
        require(["core/utils"], ({ ISODate }) => {
          resolve(ISODate);
        });
      });

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
        specStatus: "REC",
        publishDate: "2017-03-15",
        previousPublishDate: "1977-03-15",
        previousMaturity: "CR",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const terms = doc.querySelectorAll("dt");
      expect(terms[4].textContent).toBe("Previous version:");
      expect(terms[4].nextElementSibling.localName).toBe("dd");
      expect(terms[4].nextElementSibling.textContent).toMatch(
        /\/1977\/CR-[^/]+-19770315\//
      );
    });
  });

  describe("errata", () => {
    it("takes errata into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        errata: "ERR",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(
        contains(doc.querySelector(".head"), "a", "errata")[0].getAttribute(
          "href"
        )
      ).toBe("ERR");
    });
  });

  describe("license - w3c-software-doc", () => {
    it("includes the W3C Software and Document Notice and License (w3c-software-doc)", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "FPWD",
        license: "w3c-software-doc",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const licenses = doc.querySelectorAll("div.head a[rel=license]");
      expect(licenses.length).toBe(1);
      expect(licenses[0].tagName).toBe("A");
      expect(licenses[0].href).toBe(
        "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document"
      );
    });
  });

  describe("alternateFormats", () => {});
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
      contains(doc.querySelector(".head"), "a", "LABEL")[0].getAttribute("href")
    ).toBe("URI");
  });

  describe("testSuiteURI", () => {});
  it("takes testSuiteURI into account", async () => {
    const ops = makeStandardOps();
    const newProps = {
      specStatus: "REC",
      testSuiteURI: "URI",
    };
    Object.assign(ops.config, newProps);
    const doc = await makeRSDoc(ops);
    const terms = doc.querySelectorAll("dt");
    expect(terms[3].textContent).toBe("Test suite:");
    expect(terms[3].nextElementSibling.localName).toBe("dd");
    expect(terms[3].nextElementSibling.textContent).toBe("URI");
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

  describe("prevED", () => {
    it("takes prevED into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "ED",
        prevED: "URI",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const terms = doc.querySelectorAll("dt");
      expect(terms[4].textContent).toBe("Previous editor's draft:");
      expect(terms[4].nextElementSibling.localName).toBe("dd");
      expect(terms[4].nextElementSibling.textContent).toBe("URI");
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
    it("takes additionalCopyrightHolders into account when spec is unofficial", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "unofficial",
        additionalCopyrightHolders: "XXX",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright").textContent.trim()).toBe(
        "XXX"
      );
    });

    it("handles additionalCopyrightHolders when text is markup", async () => {
      const ops = makeStandardOps({
        specStatus: "REC",
        additionalCopyrightHolders: "<span class='test'>XXX</span>",
      });

      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head .copyright .test").textContent).toBe(
        "XXX"
      );
    });
  });

  describe("overrideCopyright", () => {
    it("takes overrideCopyright into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        overrideCopyright: "<p class='copyright2'>XXX</p>",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelectorAll(".head .copyright").length).toBe(0);
      expect(doc.querySelectorAll(".head .copyright2").length).toBe(1);
      expect(doc.querySelector(".head .copyright2", doc).textContent).toBe(
        "XXX"
      );
    });
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

  describe("wgId, data-deliverer, and isNote", () => {
    it("derives the wgId from wgPatentURI and adds data-deliverer", async () => {
      const ops = makeStandardOps();
      const newProps = {
        wgPatentURI: "https://www.w3.org/pp-impl/123456/status",
        specStatus: "WG-NOTE",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops, simpleSpecURL);
      const { wgId, isNote } = doc.defaultView.respecConfig;
      const elem = doc.querySelector("p[data-deliverer]");
      expect(isNote).toBe(true);
      expect(wgId).toBe("123456");
      expect(elem).toBeTruthy();
      expect(elem.dataset.deliverer).toBe("123456");
    });
    it("gracefully handles missing wgPatentURI", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "FPWD-NOTE",
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
        wgPatentURI: "https://www.w3.org/pp-impl/123456/status",
        specStatus: "WD",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops, simpleSpecURL);
      const elem = doc.querySelector("p[data-deliverer]");
      const { wgId, isNote } = doc.defaultView.respecConfig;
      expect(isNote).toBe(false);
      expect(wgId).toBe("123456");
      expect(elem).toBe(null);
    });
    it("excludes the long patent text for note types", async () => {
      const noteTypes = ["WG-NOTE", "FPWD-NOTE"];
      for (const specStatus of noteTypes) {
        const opts = makeStandardOps({ specStatus });
        const doc = await makeRSDoc(opts);
        const sotd = doc.querySelector("#sotd");
        const [p] = contains(sotd, "p", "Patent Policy");
        const normalized = p.textContent.trim().replace(/\s+/gm, " ");
        expect(normalized).toBe(
          "This document was produced by a group operating under the W3C Patent Policy."
        );
      }
    });
    it("includes specific text for IG-Notes", async () => {
      const opts = makeStandardOps({ specStatus: "IG-NOTE" });
      const doc = await makeRSDoc(opts);
      const sotd = doc.querySelector("#sotd");
      const [p] = contains(sotd, "p", "The disclosure obligations");
      const normalized = p.textContent.trim().replace(/\s+/gm, " ");
      expect(normalized).toBe(
        "The disclosure obligations of the Participants of this group are described in the charter."
      );
    });
  });

  describe("wg, wgURI, wgPatentURI, wgPublicList", () => {
    it("takes wg configurations into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        wg: "WGNAME",
        wgURI: "WGURI",
        wgPatentURI: "WGPATENT",
        wgPublicList: "WGLIST",
        subjectPrefix: "[The Prefix]",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops, simpleSpecURL);
      const sotd = doc.getElementById("sotd");
      expect(contains(sotd, "p", "CUSTOM PARAGRAPH").length).toBe(1);
      expect(contains(sotd, "a", "WGNAME").length).toBe(1);
      expect(contains(sotd, "a", "WGNAME")[0].getAttribute("href")).toBe(
        "WGURI"
      );
      expect(contains(sotd, "a", "WGLIST").length).toBe(1);
      expect(contains(sotd, "a", "WGLIST")[0].getAttribute("href")).toBe(
        "mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D"
      );
      expect(contains(sotd, "a", "archives")[0].getAttribute("href")).toBe(
        "https://lists.w3.org/Archives/Public/WGLIST/"
      );
      expect(contains(sotd, "a", "disclosures")[0].getAttribute("href")).toBe(
        "WGPATENT"
      );
    });

    it("takes multi-group configurations into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        wg: ["WGNAME1", "WGNAME2"],
        wgURI: ["WGURI1", "WGURI2"],
        wgPatentURI: ["WGPATENT1", "WGPATENT2"],
        wgPublicList: "WGLIST",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const sotd = doc.getElementById("sotd");
      expect(contains(sotd, "a", "WGNAME1").length).toBe(2);
      expect(contains(sotd, "a", "WGNAME2").length).toBe(2);
      expect(contains(sotd, "a", "WGNAME1")[0].getAttribute("href")).toBe(
        "WGURI1"
      );
      expect(contains(sotd, "a", "WGNAME2")[0].getAttribute("href")).toBe(
        "WGURI2"
      );
      expect(contains(sotd, "a", "WGNAME1")[1].getAttribute("href")).toBe(
        "WGPATENT1"
      );
      expect(contains(sotd, "a", "WGNAME2")[1].getAttribute("href")).toBe(
        "WGPATENT2"
      );
      expect(contains(sotd, "a", "disclosures").length).toBe(2);
      expect(contains(sotd, "a", "WGLIST").length).toBe(1);
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
      expect(f.length).toBe(3);
      const questionnaires = doc
        .getElementById("sotd")
        .querySelector(
          "a[href='https://www.w3.org/2002/09/wbs/myQuestionnaires']"
        );
      expect(questionnaires).toBeTruthy();
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
      expect(f.length).toBe(1);
      expect(contains(f[0].previousElementSibling, "a", "WGLIST").length).toBe(
        1
      );
    });
  });

  describe("charterDisclosureURI", () => {
    it("takes charterDisclosureURI into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "IG-NOTE",
        charterDisclosureURI: "URI",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(contains(doc, "#sotd a", "charter")[0].getAttribute("href")).toBe(
        "URI"
      );
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
      expect(c.querySelectorAll("a[href='http://WG']").length).toBe(1);
      expect(contains(c, "a", "WGNAME").length).toBe(1);
      expect(
        c.querySelectorAll(
          "a[href='https://www.w3.org/community/about/agreements/cla/']"
        ).length
      ).toBe(1);
      expect(doc.querySelector(".head h2").textContent).toMatch(
        /Draft Community Group Report/
      );
      const sotd = doc.getElementById("sotd");
      expect(sotd.querySelectorAll("a[href='http://WG']").length).toBe(1);
      expect(contains(sotd, "a", "WGNAME").length).toBe(1);
      expect(
        sotd.querySelectorAll(
          "a[href='https://www.w3.org/community/about/agreements/cla/']"
        ).length
      ).toBe(1);
      expect(contains(sotd, "a", "WGLIST").length).toBe(1);
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
        latestVersion: "http://LATEST",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(
        doc.querySelectorAll(
          ".head .copyright a[href='https://www.w3.org/community/about/agreements/fsa/']"
        ).length
      ).toBe(1);
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
        "http://LATEST"
      );
      const sotd = doc.getElementById("sotd");
      expect(sotd.querySelectorAll("a[href='http://WG']").length).toBe(1);
      expect(contains(sotd, "a", "WGNAME").length).toBe(1);
      expect(
        sotd.querySelectorAll(
          "a[href='https://www.w3.org/community/about/agreements/final/']"
        ).length
      ).toBe(1);
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
      expect(contains(doc, "dt", "Previous version:").length).toBe(0);
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
      expect(sotd).toMatch(testString);
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

  describe("statusOverride", () => {
    it("allows status paragraph to be overridden", async () => {
      const ops = makeStandardOps();
      const newProps = {
        overrideStatus: true,
        wg: "WGNAME",
        wgURI: "WGURI",
        wgPatentURI: "WGPATENT",
        wgPublicList: "WGLIST",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops, simpleSpecURL);
      const sotd = doc.getElementById("sotd");
      expect(contains(sotd, "p", "CUSTOM PARAGRAPH").length).toBe(1);
      expect(contains(sotd, "a", "WGNAME").length).toBe(0);
      expect(contains(sotd, "a", "WGLIST@w3.org").length).toBe(0);
      expect(contains(sotd, "a", "subscribe").length).toBe(0);
      expect(contains(sotd, "a", "disclosures")[0].getAttribute("href")).toBe(
        "WGPATENT"
      );
    });
  });
  it("allows custom sections and custom content, not just paragraphs", async () => {
    const ops = makeStandardOps();
    ops.body = `
        <section>
          <h2>PASS</h2>
          <p>Normal section.</p>
        </section>
        <section id="sotd" class="introductory">
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
    const theTest = doc => {
      // the class introductory is added by script
      const sotd = doc.getElementById("sotd");

      expect(sotd.classList.contains("introductory")).toBe(true);

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
      expect(ol.querySelectorAll("li").length).toBe(2);
      const firstSection = doc.getElementById("first-sub-section");

      expect(sotd.lastElementChild).not.toBe(firstSection);

      const lastSection = doc.getElementById("last-sub-section");
      expect(sotd.lastElementChild).toBe(lastSection);

      // p3 is sadwiched in between the sections
      const p3 = doc.getElementById("p3");
      expect(p3).toBeTruthy();
      expect(p3.previousElementSibling).toBe(firstSection);
      expect(p3.nextElementSibling).toBe(lastSection);

      // There should only be one thing in the ToC
      expect(doc.querySelectorAll("#toc li").length).toBe(1);
      // and it should say "PASS"
      expect(doc.querySelector("#toc li span").nextSibling.textContent).toBe(
        "PASS"
      );
    };
    theTest(await makeRSDoc(ops));
    const cgOpts = Object.assign({}, ops, {
      config: { specStatus: "CG-DRAFT" },
    });
    theTest(await makeRSDoc(cgOpts));
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
      `a[href^="http://www.w3.org/2003/03/Translations/"]`
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
      `a[href^="http://www.w3.org/2003/03/Translations/"]`
    );
    expect(aElem).toBe(null);
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
  // See https://github.com/w3c/respec/issues/653
  it("states that the spec is destined to become a note", async () => {
    const ops = makeStandardOps();
    const newProps = {
      noRecTrack: true,
      specStatus: "WD",
      recNotExpected: true,
    };
    Object.assign(ops.config, newProps);
    const doc = await makeRSDoc(ops);
    const sotdText = doc
      .getElementById("sotd")
      .textContent.replace(/\s+/gm, " ");
    const expectedString =
      "does not expect this document to become a W3C Recommendation";
    expect(sotdText).toMatch(expectedString);
  });
  describe("logos", () => {
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
      const elems = doc.querySelectorAll("img#logo1, img#logo2");
      expect(elems.length).toBe(2);
    });

    it("adds logos defined by configuration", async () => {
      const ops = makeStandardOps();
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
          src:
            "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
          alt: "this is a larger gif",
          height: 876,
          width: 283,
          url: "http://shiny/",
        },
      ];
      Object.assign(ops.config, { logos });
      const doc = await makeRSDoc(ops);
      // get logos
      const anchors = doc.querySelectorAll(
        ".head p:not(.copyright):first-child > a"
      );
      for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i];
        const img = anchor.children[0];
        const logo = logos[i];
        expect(img.src).toBe(logo.src);
        expect(img.alt).toBe(logo.alt);
        expect(img.height).toBe(logo.height);
        expect(img.width).toBe(logo.width);
        expect(anchor.href).toBe(logo.url);
      }
    });
  });
});
