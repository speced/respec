"use strict";
describe("W3C — Headers", function() {
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
        $("dt:contains('Latest Recommendation:')", doc).next("dd").text()
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
      expect($("dt:contains('This version:')", doc).next("dd").text()).toMatch(
        /\/REC-xxx-/
      );
      expect(
        $("dt:contains('Latest published version:')", doc).next("dd").text()
      ).toMatch(/\/TR\/xxx\//);
    });

    it("takes shortName into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        shortName: "xxx",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect($("dt:contains('This version:')", doc).next("dd").text()).toMatch(
        /\/REC-xxx-/
      );
      expect(
        $("dt:contains('Latest published version:')", doc).next("dd").text()
      ).toMatch(/\/TR\/xxx\//);
    });
  });

  describe("editors", () => {
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
      var $dd = $("dt:contains('Editor:')", doc).next("dd");
      expect($dd.find("a[href='http://URI']").length).toEqual(1);
      expect($dd.find("a[href='http://URI']").text()).toEqual("NAME");
      expect($dd.find("a[href='http://COMPANY']").length).toEqual(1);
      expect($dd.find("a[href='http://COMPANY']").text()).toEqual("COMPANY");
      expect($dd.find("a[href='mailto:EMAIL']").length).toEqual(1);
      expect($dd.find("a[href='mailto:EMAIL']").text()).toEqual("EMAIL");
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
      var $dd = $("dt:contains('Editors:')", doc).next("dd");
      expect($dd.text()).toEqual("NAME1");
      expect($dd.next("dd").text()).toEqual("NAME2");
    });

    it("shouldn't add RDFa stuff to editors extras when doRDFa is false", async () => {
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
            ],
          },
        ],
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      var oricdHref = ops.config.editors[0].extras[0].href;
      var orcidAnchor = doc.querySelector("a[href='" + oricdHref + "']");
      // Check that RDFa is applied
      expect(orcidAnchor.getAttribute("property")).toEqual(null);
      expect(orcidAnchor.parentNode.className).toEqual("orcid");
    });

    it("takes editors extras into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        doRDFa: true,
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
      var oricdHref = ops.config.editors[0].extras[0].href;
      var twitterHref = ops.config.editors[0].extras[1].href;
      var orcidAnchor = doc.querySelector("a[href='" + oricdHref + "']");
      var twitterAnchor = doc.querySelector("a[href='" + twitterHref + "']");
      // general checks
      var header = doc.querySelector("#respecHeader");
      [orcidAnchor, twitterAnchor].forEach(function(elem) {
        // Check parent is correct.
        expect(elem.parentNode.localName).toEqual("span");
        // Check that RDFa is applied
        expect(elem.hasAttribute("property")).toEqual(true);
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
      var $dd = $("dt:contains('Author:')", doc).next("dd");
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
      var $dd = $("dt:contains('Authors:')", doc).next("dd");
      expect($dd.text()).toEqual("NAME1");
      expect($dd.next("dd").text()).toEqual("NAME2");
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
      expect($("#subtitle", doc).length).toEqual(0);
    });

    it("takes subtitle into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        subtitle: "SUB",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect($("#subtitle", doc).length).toEqual(1);
      expect($("#subtitle", doc).text()).toEqual("SUB");
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
      let ISODate = await new Promise(resolve => {
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
  });

  describe("previousPublishDate & previousMaturity", () => {
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
        $("dt:contains('Previous version:')", doc).next("dd").text()
      ).toMatch(/\/1977\/CR-[^\/]+-19770315\//);
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
      var licenses = doc.querySelectorAll("#respecHeader a[rel=license]");
      expect(licenses.length).toEqual(1);
      expect(licenses.item(0).tagName).toEqual("A");
      expect(licenses.item(0).href).toEqual(
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
    expect($("dt:contains('Test suite:')", doc).next("dd").text()).toEqual(
      "URI"
    );
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
      expect(
        $("dt:contains('Implementation report:')", doc).next("dd").text()
      ).toEqual("URI");
    });
  });

  describe("edDraftURI", () => {
    it("takes edDraftURI into account", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "WD",
        edDraftURI: "URI",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(
        $("dt:contains('Latest editor\\'s draft:')", doc).next("dd").text()
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
      var query = "dt:contains('Previous editor\\'s draft:')";
      expect($(query, doc).next("dd").text()).toEqual("URI");
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
    it("takes additionalCopyrightHolders into account when spec is unofficial", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "unofficial",
        additionalCopyrightHolders: "XXX",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect($(".head .copyright", doc).text()).toEqual("XXX");
    });

    it("handles additionalCopyrightHolders when text is markup", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "REC",
        additionalCopyrightHolders: "<span class='test'>XXX</span>",
      };
      Object.assign(ops.config, newProps);
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
      const doc = await makeRSDoc(ops, () => {}, simpleSpecURL);
      var $sotd = $("#sotd", doc);
      expect($sotd.find("p:contains('CUSTOM PARAGRAPH')").length).toEqual(1);
      expect($sotd.find("a:contains('WGNAME')").length).toEqual(1);
      expect($sotd.find("a:contains('WGNAME')").attr("href")).toEqual("WGURI");
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
      var $sotd = $("#sotd", doc);
      expect($sotd.find("a:contains('WGNAME1')").length).toEqual(2);
      expect($sotd.find("a:contains('WGNAME2')").length).toEqual(2);
      expect($sotd.find("a:contains('WGNAME1')").first().attr("href")).toEqual(
        "WGURI1"
      );
      expect($sotd.find("a:contains('WGNAME1')").last().attr("href")).toEqual(
        "WGPATENT1"
      );
      expect($sotd.find("a:contains('WGNAME2')").first().attr("href")).toEqual(
        "WGURI2"
      );
      expect($sotd.find("a:contains('WGNAME2')").last().attr("href")).toEqual(
        "WGPATENT2"
      );
      expect($sotd.find("a:contains('disclosures')").length).toEqual(2);
    });
  });

  describe("perEnd", () => {
    it("correctlys flag a PER", async () => {
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
      var $sotd = $("#sotd", doc);
      var $f = $($sotd.find("p:contains('Proposed Edited Recommendation')"));
      expect($f.length).toEqual(2);
      var $p = $f[0];
      expect($("a:contains('questionnaires')", $p).length).toEqual(1);
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
      const doc = await makeRSDoc(ops, () => {}, simpleSpecURL);
      var $sotd = $("#sotd", doc);
      var $f = $($sotd.find("p:contains('CUSTOM PARAGRAPH')"));
      expect($f.length).toEqual(1);
      var $p = $f.prev();
      expect($("a:contains('WGNAME')", $p).length).toEqual(1);
      expect($("a:contains('WGNAME')", $p).attr("href")).toEqual("WGURI");
      expect($("a:contains('WGLIST@w3.org')", $p).attr("href")).toEqual(
        "mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D"
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
      var $c = $(".head .copyright", doc);
      expect($c.find("a[href='http://WG']").length).toEqual(1);
      expect($c.find("a:contains(WGNAME)").length).toEqual(1);
      expect(
        $c.find("a[href='https://www.w3.org/community/about/agreements/cla/']")
          .length
      ).toEqual(1);
      expect($(".head h2", doc).text()).toMatch(/Draft Community Group Report/);
      var $sotd = $("#sotd", doc);
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
      expect($("dt:contains('This version:')", doc).next("dd").text()).toMatch(
        /http:\/\/THIS/
      );
      expect(
        $("dt:contains('Latest published version:')", doc).next("dd").text()
      ).toMatch(/http:\/\/LATEST/);
      var $sotd = $("#sotd", doc);
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
    it("shouldn't expose a Previous version link for Member submissions", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "Member-SUBM",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect($("dt:contains('Previous version:')", doc).length).toEqual(0);
    });
    it("displays the Member Submission logo for Member submissions", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "Member-SUBM",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(
        $(".head img[src^='https://www.w3.org/Icons/member_subm']", doc).length
      ).toEqual(1);
    });
    it("uses the right SoTD boilerplate for Member submissions", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "Member-SUBM",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      var $sotd = $("#sotd", doc);
      expect(
        $sotd.find(
          "p:contains('W3C acknowledges that the Submitting Members have made a formal Submission request')"
        ).length
      ).toEqual(1);
    });
  });

  describe("Team-SUBM", () => {
    it("shouldn't expose a Previous version link for Team submissions", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "Team-SUBM",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect($("dt:contains('Previous version:')", doc).length).toEqual(0);
    });
    it("displays the Team Submission logo for Team submissions", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "Team-SUBM",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(
        $(".head img[src^='https://www.w3.org/Icons/team_subm']", doc).length
      ).toEqual(1);
    });
    it("uses the right SoTD boilerplate for Team submissions", async () => {
      const ops = makeStandardOps();
      const newProps = {
        specStatus: "Team-SUBM",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      var $sotd = $("#sotd", doc);
      expect(
        $sotd.find("a[href='https://www.w3.org/TeamSubmission/']").length
      ).toEqual(1);
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
      const doc = await makeRSDoc(ops, () => {}, simpleSpecURL);
      var $sotd = $("#sotd", doc);
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

      const p1 = sotd.querySelector("#p1");
      expect(p1).toBeTruthy();
      expect(p1.textContent.trim()).toEqual("CUSTOM PARAGRAPH 1");

      const p2 = sotd.querySelector("#p2");
      expect(p2).toBeTruthy();
      expect(p2.textContent.trim()).toEqual("CUSTOM PARAGRAPH 2");

      const commentNode = p2.nextSibling;
      expect(commentNode.nodeType).toEqual(Node.COMMENT_NODE);

      const textNode = commentNode.nextSibling;
      expect(textNode.nodeType).toEqual(Node.TEXT_NODE);

      const ol = sotd.querySelector("#ol");
      expect(ol).toBeTruthy();
      expect(ol.querySelectorAll("li").length).toEqual(2);

      const firstSection = sotd.querySelector("#first-sub-section");
      expect(sotd.lastElementChild).not.toEqual(firstSection);

      const lastSection = sotd.querySelector("#last-sub-section");
      expect(sotd.lastElementChild).toEqual(lastSection);

      // p3 is sadwiched in between the sections
      const p3 = sotd.querySelector("#p3");
      expect(p3).toBeTruthy();
      expect(p3.previousElementSibling).toEqual(firstSection);
      expect(p3.nextElementSibling).toEqual(lastSection);

      // There should only be one thing in the ToC
      expect(doc.querySelectorAll("#toc li").length).toEqual(1);
      // and it should say "PASS"
      expect(doc.querySelector("#toc li span").nextSibling.textContent).toEqual(
        "PASS"
      );
    };
    const cgOpts = Object.assign({}, ops, {
      config: { specStatus: "CG-DRAFT" },
    });
    // Test regular spec using "stod.html"
    theTest(await makeRSDoc(ops));
    // Test CG spec, using "cg-bg-stod.html"
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
  xit("states that the spec is destined to become a note", async () => {
    const ops = makeStandardOps();
    const newProps = {
      noRecTrack: true,
      specStatus: "WD",
      recNotExpected: true,
    };
    Object.assign(ops.config, newProps);
    const doc = await makeRSDoc(ops);
    var sotdText = doc.getElementById("sotd").textContent;
    var expectedString = /It is expected to become a W3C Note/;
    expect(sotdText).toMatch(expectedString);
  });
});
