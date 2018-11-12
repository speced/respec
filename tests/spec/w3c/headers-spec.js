"use strict";
const findContent = string => {
  return ({ textContent }) => textContent.trim() === string;
};
describe("W3C — Headers", () => {
  afterEach(flushIframes);
  const simpleSpecURL = "spec/core/simple.html";
  describe("prevRecShortname & prevRecURI", () => {
    it("takes prevRecShortname and prevRecURI into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        prevRecURI: "URI",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(
        $("dt:contains('Latest Recommendation:')", doc)
          .next("dd")
          .text()
          .trim()
      ).toEqual("URI");
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
      expect($(".head h2", doc).text()).toMatch(/W3C Editor's Draft/);
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
      expect(
        $("dt:contains('This version:')", doc)
          .next("dd")
          .text()
      ).toMatch(/\/REC-xxx-/);
      expect(
        $("dt:contains('Latest published version:')", doc)
          .next("dd")
          .text()
      ).toMatch(/\/TR\/xxx\//);
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
      expect($("dt:contains('Editors:')", doc).length).toEqual(0);
      expect($("dt:contains('Editor:')", doc).length).toEqual(1);
      const $dd = $("dt:contains('Editor:')", doc).next("dd");
      expect($dd.find("a[href='http://COMPANY']").length).toEqual(1);
      expect($dd.find("a[href='http://COMPANY']").text()).toEqual("COMPANY");
      expect($dd.find("a[href='mailto:EMAIL']").length).toEqual(1);
      expect($dd.find("a[href='mailto:EMAIL']").text()).toEqual("NAME");
      // if `mailto` is specified in People, `url` won't be used
      expect($dd.find("a[href='http://URI']").length).toEqual(0);
      expect($dd.get(0).dataset.editorId).toEqual("1234");
      expect($dd.text()).toMatch(/\(NOTE\)/);
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
      expect($("dt:contains('Editors:')", doc).length).toEqual(1);
      expect($("dt:contains('Editor:')", doc).length).toEqual(0);
      const $dd = $("dt:contains('Editors:')", doc).next("dd");
      expect($dd.text()).toEqual("NAME1");
      expect($dd.next("dd").text()).toEqual("NAME2");
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
      const orcidAnchor = doc.querySelector("a[href='" + oricdHref + "']");
      const twitterAnchor = doc.querySelector("a[href='" + twitterHref + "']");
      // general checks
      const header = doc.querySelector("div.head");
      [orcidAnchor, twitterAnchor].forEach(elem => {
        // Check parent is correct.
        expect(elem.parentNode.localName).toEqual("span");
        // Check that it's in the header of the document
        expect(header.contains(elem)).toEqual(true);
      });
      // Check CSS is correctly applied
      expect(orcidAnchor.parentNode.className).toEqual("orcid");
      expect(twitterAnchor.parentNode.className).toEqual("twitter");
      // check that extra items with no name are ignored
      expect(doc.querySelector("a[href='http://not-valid']")).toEqual(null);
      expect(doc.querySelector("a[href='http://empty-name']")).toEqual(null);
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
      expect(ddElem.textContent.replace(/\s\s+/g, " ").trim()).toEqual(
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
      expect(editor.localName).toEqual("dd");
      expect(editor.textContent.replace(/\s+/gm, " ").trim()).toEqual(
        "NAME (COMPANY)"
      );

      const editorCompany = editor.querySelectorAll("a[href='http://COMPANY']");
      expect(editorCompany.length).toEqual(1);
      expect(editorCompany[0].textContent).toEqual("COMPANY");

      const editorEmail = editor.querySelectorAll("a[href='mailto:EMAIL']");
      expect(editorEmail.length).toEqual(1);
      expect(editorEmail[0].textContent).toEqual("NAME");

      // if `mailto` is specified in People, `url` won't be used
      const editorUrl = editor.querySelectorAll("a[href='http://URI']");
      expect(editorUrl.length).toEqual(0);

      const { editorId } = editor.dataset;
      expect(editorId).toEqual("1234");
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
      expect(firstEditor.localName).toEqual("dd");
      expect(firstEditor.textContent).toEqual("NAME1");

      const secondEditor = firstEditor.nextSibling;
      expect(secondEditor.localName).toEqual("dd");
      expect(secondEditor.textContent).toEqual("NAME2");
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
      expect(ddElem.textContent.replace(/\s\s+/g, " ").trim()).toEqual(
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
      expect($("dt:contains('Authors:')", doc).length).toEqual(0);
      expect($("dt:contains('Author:')", doc).length).toEqual(1);
      const $dd = $("dt:contains('Author:')", doc).next("dd");
      expect($dd.text()).toEqual("NAME1");
    });

    it("takes a multiple authors into account", async () => {
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
      expect($("dt:contains('Authors:')", doc).length).toEqual(1);
      expect($("dt:contains('Author:')", doc).length).toEqual(0);
      const $dd = $("dt:contains('Authors:')", doc).next("dd");
      expect($dd.text()).toEqual("NAME1");
      expect($dd.next("dd").text()).toEqual("NAME2");
    });
  });

  describe("use existing h1 element", () => {
    it("uses the <h1>'s value as the document's title", async () => {
      const body =
        `
        <h1 id='title'>
          This should be <code>pass</code>.
         </h1>` + makeDefaultBody();
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toEqual("This should be pass.");
      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toEqual("This should be pass.");
    });

    it("uses <h1> if already present", async () => {
      const ops = makeStandardOps();
      ops.body = "<h1 id='title'><code>pass</code></h1>" + makeDefaultBody();
      const doc = await makeRSDoc(ops);

      // Title was relocated to head
      const titleInHead = doc.querySelector(".head h1");
      expect(titleInHead.classList.contains("p-name")).toBe(true);
      expect(titleInHead.id).toEqual("title");

      // html is not escaped
      expect(titleInHead.firstChild.tagName).toEqual("CODE");
      expect(titleInHead.textContent).toEqual("pass");

      // the config title is overridden
      const { title } = doc.defaultView.respecConfig;
      expect(title).toEqual("pass");
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
      expect(doc.getElementById("subtitle")).toEqual(null);
    });

    it("uses existing h2#subtitle as subtitle", async () => {
      const ops = makeStandardOps();
      ops.body = "<h2 id='subtitle'><code>pass</code></h2>" + makeDefaultBody();
      const doc = await makeRSDoc(ops);

      const subTitleElements = doc.querySelectorAll("h2#subtitle");
      expect(subTitleElements.length).toEqual(1);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toEqual("pass");

      const [h2Elem] = subTitleElements;
      expect(h2Elem.textContent).toEqual("pass");

      // make sure it was relocated to head
      expect(h2Elem.closest(".head")).toBeTruthy();

      expect(h2Elem.firstElementChild.localName).toEqual("code");
      expect(h2Elem.firstElementChild.textContent).toEqual("pass");
    });

    it("overwrites conf.subtitle if it exists", async () => {
      const ops = makeStandardOps();
      ops.body = "<h2 id='subtitle'><code>pass</code></h2>" + makeDefaultBody();
      const newProps = {
        subtitle: "fail - this should have been overridden by the <h2>",
      };
      Object.assign(ops.config, newProps);

      const doc = await makeRSDoc(ops);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toEqual("pass");
    });

    it("sets conf.subtitle if it doesn't exist, but h2#subtitle exists", async () => {
      const ops = makeStandardOps();
      ops.body = "<h2 id='subtitle'><code>pass</code></h2>" + makeDefaultBody();
      const doc = await makeRSDoc(ops);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toEqual("pass");
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
      expect(h2Elem.textContent.trim()).toEqual("pass");
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
      expect($("h2:contains('15 March 1977')", doc).length).toEqual(1);
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
      expect(
        $("dt:contains('Previous version:')", doc)
          .next("dd")
          .text()
      ).toMatch(/\/1977\/CR-[^/]+-19770315\//);
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
      expect($(".head a:contains('errata')", doc).attr("href")).toEqual("ERR");
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
      expect(licenses.length).toEqual(1);
      expect(licenses[0].tagName).toEqual("A");
      expect(licenses[0].href).toEqual(
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
    expect($(".head a:contains('LABEL')", doc).attr("href")).toEqual("URI");
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
    expect(
      $("dt:contains('Test suite:')", doc)
        .next("dd")
        .text()
    ).toEqual("URI");
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
      expect(dd.textContent.trim()).toEqual("URI");
    });
  });

  describe("edDraftURI", () => {
    it("takes edDraftURI into account", async () => {
      const ops = makeStandardOps({
        specStatus: "WD",
        edDraftURI: "URI",
      });

      const doc = await makeRSDoc(ops);
      expect(
        $("dt:contains('Latest editor\\'s draft:')", doc)
          .next("dd")
          .text()
      ).toEqual("URI");
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
      const query = "dt:contains('Previous editor\\'s draft:')";
      expect(
        $(query, doc)
          .next("dd")
          .text()
      ).toEqual("URI");
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
      expect($(".head .copyright", doc).text()).toMatch(/XXX\s+&\s+W3C/);
    });
    it("takes additionalCopyrightHolders into account for CG drafts", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "CG-DRAFT",
        additionalCopyrightHolders: "XXX",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect($(".head .copyright", doc).text()).toMatch(
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
      expect($(".head .copyright", doc).text()).toMatch(
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
      expect($(".head .copyright", doc).text()).toMatch(
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
      expect($(".head .copyright", doc).text()).toMatch(
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
      expect(
        $(".head .copyright", doc)
          .text()
          .trim()
      ).toEqual("XXX");
    });

    it("handles additionalCopyrightHolders when text is markup", async () => {
      const ops = makeStandardOps({
        specStatus: "REC",
        additionalCopyrightHolders: "<span class='test'>XXX</span>",
      });

      const doc = await makeRSDoc(ops);
      expect($(".head .copyright .test", doc).text()).toEqual("XXX");
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
      expect($(".head .copyright", doc).length).toEqual(0);
      expect($(".head .copyright2", doc).length).toEqual(1);
      expect($(".head .copyright2", doc).text()).toEqual("XXX");
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
      expect($(".head .copyright", doc).text()).toMatch(/1977-2012/);
    });

    it("handles copyrightStart with a new date", async () => {
      const ops = makeStandardOps();
      const newProps = {
        publishDate: "2012-03-15",
        copyrightStart: "2012",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect($(".head .copyright", doc).text()).not.toMatch(/2012-2012/);
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
      expect(wgId).toEqual("123456");
      expect(elem).toBeTruthy();
      expect(elem.dataset.deliverer).toEqual("123456");
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
      expect(wgId).toEqual("");
      expect(elem).toBeTruthy();
      expect(elem.dataset.deliverer).toEqual("");
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
      expect(wgId).toEqual("123456");
      expect(elem).toEqual(null);
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
      const $sotd = $("#sotd", doc);
      expect($sotd.find("p:contains('CUSTOM PARAGRAPH')").length).toEqual(1);
      expect($sotd.find("a:contains('WGNAME')").length).toEqual(1);
      expect($sotd.find("a:contains('WGNAME')").attr("href")).toEqual("WGURI");
      expect($sotd.find("a:contains('WGLIST@w3.org')").length).toEqual(1);
      expect($sotd.find("a:contains('WGLIST@w3.org')").attr("href")).toEqual(
        "mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D"
      );
      expect($sotd.find("a:contains('archives')").attr("href")).toEqual(
        "https://lists.w3.org/Archives/Public/WGLIST/"
      );
      expect($sotd.find("a:contains('disclosures')").attr("href")).toEqual(
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
      const $sotd = $("#sotd", doc);
      expect($sotd.find("a:contains('WGNAME1')").length).toEqual(2);
      expect($sotd.find("a:contains('WGNAME2')").length).toEqual(2);
      expect(
        $sotd
          .find("a:contains('WGNAME1')")
          .first()
          .attr("href")
      ).toEqual("WGURI1");
      expect(
        $sotd
          .find("a:contains('WGNAME1')")
          .last()
          .attr("href")
      ).toEqual("WGPATENT1");
      expect(
        $sotd
          .find("a:contains('WGNAME2')")
          .first()
          .attr("href")
      ).toEqual("WGURI2");
      expect(
        $sotd
          .find("a:contains('WGNAME2')")
          .last()
          .attr("href")
      ).toEqual("WGPATENT2");
      expect($sotd.find("a:contains('disclosures')").length).toEqual(2);
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
      const $sotd = $("#sotd", doc);
      const $f = $($sotd.find("p:contains('Proposed Edited Recommendation')"));
      expect($f.length).toEqual(2);
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
      const $sotd = $("#sotd", doc);
      const $f = $($sotd.find("p:contains('CUSTOM PARAGRAPH')"));
      expect($f.length).toEqual(1);
      const $p = $f.prev();
      expect($("a:contains('WGLIST')", $p).length).toEqual(1);
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
      expect($("#sotd a:contains('charter')", doc).attr("href")).toEqual("URI");
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
      expect($("#sotd p strong", doc).text()).toEqual("PATENTNOTE");
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
      const $c = $(".head .copyright", doc);
      expect($c.find("a[href='http://WG']").length).toEqual(1);
      expect($c.find("a:contains(WGNAME)").length).toEqual(1);
      expect(
        $c.find("a[href='https://www.w3.org/community/about/agreements/cla/']")
          .length
      ).toEqual(1);
      expect($(".head h2", doc).text()).toMatch(/Draft Community Group Report/);
      const $sotd = $("#sotd", doc);
      expect($sotd.find("a[href='http://WG']").length).toEqual(1);
      expect($sotd.find("a:contains(WGNAME)").length).toEqual(1);
      expect(
        $sotd.find(
          "a[href='https://www.w3.org/community/about/agreements/cla/']"
        ).length
      ).toEqual(1);
      expect($sotd.find("a:contains('WGLIST@w3.org')").length).toEqual(1);
      expect($sotd.find("a:contains('WGLIST@w3.org')").attr("href")).toEqual(
        "mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D"
      );
      expect($sotd.find("a:contains('subscribe')").attr("href")).toEqual(
        "mailto:WGLIST-request@w3.org?subject=subscribe"
      );
      expect($sotd.find("a:contains('archives')").attr("href")).toEqual(
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
        $(
          ".head .copyright a[href='https://www.w3.org/community/about/agreements/fsa/']",
          doc
        ).length
      ).toEqual(1);
      expect($(".head h2", doc).text()).toMatch(/Final Business Group Report/);
      expect(
        $("dt:contains('This version:')", doc)
          .next("dd")
          .text()
      ).toMatch(/http:\/\/THIS/);
      expect(
        $("dt:contains('Latest published version:')", doc)
          .next("dd")
          .text()
      ).toMatch(/http:\/\/LATEST/);
      const $sotd = $("#sotd", doc);
      expect($sotd.find("a[href='http://WG']").length).toEqual(1);
      expect($sotd.find("a:contains(WGNAME)").length).toEqual(1);
      expect(
        $sotd.find(
          "a[href='https://www.w3.org/community/about/agreements/final/']"
        ).length
      ).toEqual(1);
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
      expect($("dt:contains('Previous version:')", doc).length).toEqual(0);
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
      const $sotd = $("#sotd", doc);
      expect($sotd.find("p:contains('CUSTOM PARAGRAPH')").length).toEqual(1);
      expect($sotd.find("a:contains('WGNAME')").length).toEqual(0);
      expect($sotd.find("a:contains('WGLIST@w3.org')").length).toEqual(0);
      expect($sotd.find("a:contains('subscribe')").length).toEqual(0);
      expect($sotd.find("a:contains('disclosures')").attr("href")).toEqual(
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
    expect(textContent).toEqual("See also translations.");
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
    expect(aElem).toEqual(null);
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
      expect(elems.length).toEqual(2);
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
        expect(img.src).toEqual(logo.src);
        expect(img.alt).toEqual(logo.alt);
        expect(img.height).toEqual(logo.height);
        expect(img.width).toEqual(logo.width);
        expect(anchor.href).toEqual(logo.url);
      }
    });
  });
});
