"use strict";
describe("W3C — Headers", function() {
  afterEach(function(done) {
    flushIframes();
    done();
  });
  var simpleSpecURL = "spec/core/simple.html";
  // prevRecShortname & prevRecURI
  it("should take prevRecShortname and prevRecURI into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      prevRecURI: "URI"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Latest Recommendation:')", doc).next("dd").text())
        .toEqual("URI");
    }).then(done);
  });
  // specStatus
  it("should take specStatus into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "ED"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head h2", doc).text())
        .toMatch(/W3C Editor's Draft/);
    }).then(done);
  });

  // shortName
  it("should take shortName into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      shortName: "xxx"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('This version:')", doc).next("dd").text()).toMatch(/\/REC-xxx-/);
      expect($("dt:contains('Latest published version:')", doc).next("dd").text()).toMatch(/\/TR\/xxx\//);
    }).then(done);
  });

  // editors
  it("should take a single editors into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      doRDFa: false,
      "editors": [{
        name: "NAME",
        url: "http://URI",
        company: "COMPANY",
        companyURL: "http://COMPANY",
        mailto: "EMAIL",
        note: "NOTE",
        w3cid: "1234"
      }]
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Editors:')", doc).length)
        .toEqual(0);
      expect($("dt:contains('Editor:')", doc).length)
        .toEqual(1);
      var $dd = $("dt:contains('Editor:')", doc).next("dd");
      expect($dd.find("a[href='http://URI']").length)
        .toEqual(1);
      expect($dd.find("a[href='http://URI']").text())
        .toEqual("NAME");
      expect($dd.find("a[href='http://COMPANY']").length)
        .toEqual(1);
      expect($dd.find("a[href='http://COMPANY']").text())
        .toEqual("COMPANY");
      expect($dd.find("a[href='mailto:EMAIL']").length)
        .toEqual(1);
      expect($dd.find("a[href='mailto:EMAIL']").text())
        .toEqual("EMAIL");
      expect($dd.get(0).dataset.editorId)
        .toEqual("1234");
      expect($dd.text()).toMatch(/\(NOTE\)/);
    }).then(done);
  });

  it("should take multiple editors into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      doRDFa: false,
      "editors": [{
        name: "NAME1"
      }, {
        name: "NAME2"
      }]
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Editors:')", doc).length)
        .toEqual(1);
      expect($("dt:contains('Editor:')", doc).length)
        .toEqual(0);
      var $dd = $("dt:contains('Editors:')", doc).next("dd");
      expect($dd.text())
        .toEqual("NAME1");
      expect($dd.next("dd").text())
        .toEqual("NAME2");
    }).then(done);
  });

  it("should not add RDFa stuff to editors extras when doRDFa is false", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      doRDFa: false,
      editors: [{
        name: "Mr foo",
        extras: [{
          "name": "0000-0003-0782-2704",
          "href": "http://orcid.org/0000-0003-0782-2704",
          "class": "orcid"
        }]
      }]
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var oricdHref = ops.config.editors[0].extras[0].href;
      var orcidAnchor = doc.querySelector("a[href='" + oricdHref + "']");
      // Check that RDFa is applied
      expect(orcidAnchor.getAttribute("property"))
        .toEqual(null);
      expect(orcidAnchor.parentNode.className)
        .toEqual("orcid");
    }).then(done);
  });

  it("should take editors extras into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      doRDFa: true,
      editors: [{
        name: "Mr foo",
        extras: [{
          "name": "0000-0003-0782-2704",
          "href": "http://orcid.org/0000-0003-0782-2704",
          "class": "orcid"
        }, {
          "name": "@ivan_herman",
          "href": "http://twitter.com/ivan_herman",
          "class": "twitter"
        }, {
          "href": "http://not-valid-missing-name",
          "class": "invalid"
        }, {
          "name": "\n\t  \n",
          "href": "http://empty-name",
          "class": "invalid"
        }, ]
      }]
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var oricdHref = ops.config.editors[0].extras[0].href;
      var twitterHref = ops.config.editors[0].extras[1].href;
      var orcidAnchor = doc.querySelector("a[href='" + oricdHref + "']");
      var twitterAnchor = doc.querySelector("a[href='" + twitterHref + "']");
      // general checks
      var header = doc.querySelector("#respecHeader");
      [orcidAnchor, twitterAnchor].forEach(function(elem) {
        // Check parent is correct.
        expect(elem.parentNode.localName)
          .toEqual("span");
        // Check that RDFa is applied
        expect(elem.hasAttribute("property"))
          .toEqual(true);
        // Check that it's in the header of the document
        expect(header.contains(elem))
          .toEqual(true);
      });
      // Check CSS is correctly applied
      expect(orcidAnchor.parentNode.className)
        .toEqual("orcid");
      expect(twitterAnchor.parentNode.className)
        .toEqual("twitter");
      // check that extra items with no name are ignored
      expect(doc.querySelector("a[href='http://not-valid']"))
        .toEqual(null);
      expect(doc.querySelector("a[href='http://empty-name']"))
        .toEqual(null);
    }).then(done);
  });

  // authors
  it("should take a single author into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      doRDFa: false,
      "authors": [{
        name: "NAME1"
      }]
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Authors:')", doc).length)
        .toEqual(0);
      expect($("dt:contains('Author:')", doc).length)
        .toEqual(1);
      var $dd = $("dt:contains('Author:')", doc).next("dd");
      expect($dd.text())
        .toEqual("NAME1");
    }).then(done);
  });

  it("should take a multiple authors into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      doRDFa: false,
      "authors": [{
        name: "NAME1"
      }, {
        name: "NAME2"
      }]
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Authors:')", doc).length)
        .toEqual(1);
      expect($("dt:contains('Author:')", doc).length)
        .toEqual(0);
      var $dd = $("dt:contains('Authors:')", doc).next("dd");
      expect($dd.text())
        .toEqual("NAME1");
      expect($dd.next("dd").text())
        .toEqual("NAME2");
    }).then(done);
  });

  // subtitle
  it("should handle missing subtitle", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("#subtitle", doc).length)
        .toEqual(0);
    }).then(done);
  });

  it("should take subtitle into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      "subtitle": "SUB"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("#subtitle", doc).length)
        .toEqual(1);
      expect($("#subtitle", doc).text())
        .toEqual("SUB");
    }).then(done);
  });

  // publishDate
  it("should take publishDate into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      publishDate: "1977-03-15"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("h2:contains('15 March 1977')", doc).length)
        .toEqual(1);
    }).then(done);
  });

  // previousPublishDate & previousMaturity
  it("should take previousPublishDate and previousMaturity into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      publishDate: "2017-03-15",
      previousPublishDate: "1977-03-15",
      previousMaturity: "CR"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Previous version:')", doc).next("dd").text())
        .toMatch(/\/1977\/CR-[^\/]+-19770315\//);
    }).then(done);
  });

  // errata
  it("should take errata into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      errata: "ERR"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head a:contains('errata')", doc).attr("href"))
        .toEqual("ERR");
    }).then(done);
  });

  // license "w3c-software-doc"
  it("should include the W3C Software and Document Notice and License (w3c-software-doc)", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "FPWD",
      license: "w3c-software-doc"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var document = doc;
      var licenses = document.querySelectorAll("#respecHeader a[rel=license]");
      expect(licenses.length)
        .toEqual(1);
      expect(licenses.item(0).tagName)
        .toEqual("A");
      expect(licenses.item(0).href)
        .toEqual("https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document");
    }).then(done);
  });

  // alternateFormats
  it("should take alternateFormats into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "FPWD",
      "alternateFormats": [{
        uri: "URI",
        label: "LABEL"
      }]
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head a:contains('LABEL')", doc).attr("href"))
        .toEqual("URI");
    }).then(done);
  });

  // testSuiteURI
  it("should take testSuiteURI into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      testSuiteURI: "URI"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Test suite:')", doc).next("dd").text())
        .toEqual("URI");
    }).then(done);
  });

  // implementationReportURI
  it("should take implementationReportURI into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      implementationReportURI: "URI"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Implementation report:')", doc).next("dd").text())
        .toEqual("URI");
    }).then(done);
  });

  // edDraftURI
  it("should take edDraftURI into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "WD",
      edDraftURI: "URI"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Latest editor\\'s draft:')", doc).next("dd").text())
        .toEqual("URI");
    }).then(done);
  });

  // prevED
  it("should take prevED into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "ED",
      prevED: "URI"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var query = "dt:contains('Previous editor\\'s draft:')";
      expect($(query, doc).next("dd").text())
        .toEqual("URI");
    }).then(done);
  });

  // additionalCopyrightHolders
  it("should take additionalCopyrightHolders into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      additionalCopyrightHolders: "XXX"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head .copyright", doc).text()).toMatch(/XXX\s+&\s+W3C/);
    }).then(done);
  });

  it("should take additionalCopyrightHolders into account when spec is unofficial", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "unofficial",
      additionalCopyrightHolders: "XXX"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head .copyright", doc).text())
        .toEqual("XXX");
    }).then(done);
  });

  it("should handle additionalCopyrightHolders when text is markup", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "REC",
      additionalCopyrightHolders: "<span class='test'>XXX</span>"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head .copyright .test", doc).text())
        .toEqual("XXX");
    }).then(done);
  });

  // overrideCopyright
  it("should take overrideCopyright into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      overrideCopyright: "<p class='copyright2'>XXX</p>"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head .copyright", doc).length)
        .toEqual(0);
      expect($(".head .copyright2", doc).length)
        .toEqual(1);
      expect($(".head .copyright2", doc).text())
        .toEqual("XXX");
    }).then(done);
  });

  // copyrightStart
  it("should take copyrightStart with an old date", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      publishDate: "2012-03-15",
      copyrightStart: "1977"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head .copyright", doc).text()).toMatch(/1977-2012/);
    }).then(done);
  });

  it("should handle copyrightStart with a new date", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      publishDate: "2012-03-15",
      copyrightStart: "2012"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head .copyright", doc).text()).not.toMatch(/2012-2012/);
    }).then(done);
  });

  // wg, wgURI, wgPatentURI, wgPublicList
  it("should take wg configurations into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      wg: "WGNAME",
      wgURI: "WGURI",
      wgPatentURI: "WGPATENT",
      wgPublicList: "WGLIST",
      subjectPrefix: "[The Prefix]"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var $sotd = $("#sotd", doc);
      expect($sotd.find("p:contains('CUSTOM PARAGRAPH')").length)
        .toEqual(1);
      expect($sotd.find("a:contains('WGNAME')").length)
        .toEqual(1);
      expect($sotd.find("a:contains('WGNAME')").attr("href"))
        .toEqual("WGURI");
      expect($sotd.find("a:contains('WGLIST@w3.org')").length)
        .toEqual(1);
      expect($sotd.find("a:contains('WGLIST@w3.org')").attr("href"))
        .toEqual("mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D");
      expect($sotd.find("a:contains('subscribe')").attr("href"))
        .toEqual("mailto:WGLIST-request@w3.org?subject=subscribe");
      expect($sotd.find("a:contains('archives')").attr("href"))
        .toEqual("https://lists.w3.org/Archives/Public/WGLIST/");
      expect($sotd.find("a:contains('disclosures')").attr("href"))
        .toEqual("WGPATENT");
    }, simpleSpecURL).then(done);
  });

  it("should take multi-group configurations into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      "wg": ["WGNAME1", "WGNAME2"],
      "wgURI": ["WGURI1", "WGURI2"],
      "wgPatentURI": ["WGPATENT1", "WGPATENT2"],
      wgPublicList: "WGLIST"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var $sotd = $("#sotd", doc);
      expect($sotd.find("a:contains('WGNAME1')").length)
        .toEqual(2);
      expect($sotd.find("a:contains('WGNAME2')").length)
        .toEqual(2);
      expect($sotd.find("a:contains('WGNAME1')").first().attr("href"))
        .toEqual("WGURI1");
      expect($sotd.find("a:contains('WGNAME1')").last().attr("href"))
        .toEqual("WGPATENT1");
      expect($sotd.find("a:contains('WGNAME2')").first().attr("href"))
        .toEqual("WGURI2");
      expect($sotd.find("a:contains('WGNAME2')").last().attr("href"))
        .toEqual("WGPATENT2");
      expect($sotd.find("a:contains('disclosures')").length)
        .toEqual(2);
    }).then(done);
  });

  // perEnd
  it("should correctly flag a PER", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      previousMaturity: "REC",
      previousPublishDate: "2014-01-01",
      prevRecURI: "http://www.example.com/rec.html",
      implementationReportURI: "http://www.example.com/report.html",
      perEnd: "2014-12-01",
      specStatus: "PER",
      wg: "WGNAME",
      wgURI: "WGURI",
      wgPublicList: "WGLIST",
      subjectPrefix: "[The Prefix]"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var $sotd = $("#sotd", doc);
      var $f = $($sotd.find("p:contains('Proposed Edited Recommendation')"));
      expect($f.length)
        .toEqual(2);
      var $p = $f[0];
      expect($("a:contains('questionnaires')", $p).length)
        .toEqual(1);
    }).then(done);
  });

  // sotdAfterWGinfo
  it("should relocate custom sotd", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      sotdAfterWGinfo: true,
      wg: "WGNAME",
      wgURI: "WGURI",
      wgPublicList: "WGLIST",
      subjectPrefix: "[The Prefix]",
      implementationReportURI: "",
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var $sotd = $("#sotd", doc);
      var $f = $($sotd.find("p:contains('CUSTOM PARAGRAPH')"));
      expect($f.length)
        .toEqual(1);
      var $p = $f.prev();
      expect($("a:contains('WGNAME')", $p).length)
        .toEqual(1);
      expect($("a:contains('WGNAME')", $p).attr("href"))
        .toEqual("WGURI");
      expect($("a:contains('WGLIST@w3.org')", $p).attr("href"))
        .toEqual("mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D");
    }, simpleSpecURL).then(done);
  });

  // charterDisclosureURI
  it("should take charterDisclosureURI into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "IG-NOTE",
      charterDisclosureURI: "URI"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("#sotd a:contains('charter')", doc).attr("href"))
        .toEqual("URI");
    }).then(done);
  });

  // addPatentNote
  it("should take addPatentNote into account", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      addPatentNote: "<strong>PATENTNOTE</strong>"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("#sotd p strong", doc).text())
        .toEqual("PATENTNOTE");
    }).then(done);
  });

  // CG/BG
  it("should handle CG-DRAFT status", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "CG-DRAFT",
      wg: "WGNAME",
      wgURI: "http://WG",
      wgPublicList: "WGLIST",
      subjectPrefix: "[The Prefix]"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var $c = $(".head .copyright", doc);
      expect($c.find("a[href='http://WG']").length)
        .toEqual(1);
      expect($c.find("a:contains(WGNAME)").length)
        .toEqual(1);
      expect($c.find("a[href='https://www.w3.org/community/about/agreements/cla/']").length)
        .toEqual(1);
      expect($(".head h2", doc).text()).toMatch(/Draft Community Group Report/);
      var $sotd = $("#sotd", doc);
      expect($sotd.find("a[href='http://WG']").length)
        .toEqual(1);
      expect($sotd.find("a:contains(WGNAME)").length)
        .toEqual(1);
      expect($sotd.find("a[href='https://www.w3.org/community/about/agreements/cla/']").length)
        .toEqual(1);
      expect($sotd.find("a:contains('WGLIST@w3.org')").length)
        .toEqual(1);
      expect($sotd.find("a:contains('WGLIST@w3.org')").attr("href"))
        .toEqual("mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D");
      expect($sotd.find("a:contains('subscribe')").attr("href"))
        .toEqual("mailto:WGLIST-request@w3.org?subject=subscribe");
      expect($sotd.find("a:contains('archives')").attr("href"))
        .toEqual("https://lists.w3.org/Archives/Public/WGLIST/");
    }).then(done);
  });

  it("should handle BG-FINAL status", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "BG-FINAL",
      wg: "WGNAME",
      wgURI: "http://WG",
      thisVersion: "http://THIS",
      latestVersion: "http://LATEST"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head .copyright a[href='https://www.w3.org/community/about/agreements/fsa/']", doc).length)
        .toEqual(1);
      expect($(".head h2", doc).text()).toMatch(/Final Business Group Report/);
      expect($("dt:contains('This version:')", doc).next("dd").text()).toMatch(/http:\/\/THIS/);
      expect($("dt:contains('Latest published version:')", doc).next("dd").text()).toMatch(/http:\/\/LATEST/);
      var $sotd = $("#sotd", doc);
      expect($sotd.find("a[href='http://WG']").length)
        .toEqual(1);
      expect($sotd.find("a:contains(WGNAME)").length)
        .toEqual(1);
      expect($sotd.find("a[href='https://www.w3.org/community/about/agreements/final/']").length)
        .toEqual(1);
    }).then(done);
  });

  // Member-SUBM
  it("should not expose a Previous version link for Member submissions", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "Member-SUBM"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Previous version:')", doc).length)
        .toEqual(0);
    }).then(done);
  });
  it("should display the Member Submission logo for Member submissions", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "Member-SUBM"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head img[src='https://www.w3.org/Icons/member_subm']", doc).length)
        .toEqual(1);
    }).then(done);
  });
  it("should use the right SoTD boilerplate for Member submissions", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "Member-SUBM"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var $sotd = $("#sotd", doc);
      expect($sotd.find(
        "p:contains('W3C acknowledges that the Submitting Members have made a formal Submission request')"
      ).length)
        .toEqual(1);
    }).then(done);
  });

  // Team-SUBM
  it("should not expose a Previous version link for Team submissions", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "Team-SUBM"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($("dt:contains('Previous version:')", doc).length)
        .toEqual(0);
    }).then(done);
  });
  it("should display the Team Submission logo for Team submissions", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "Team-SUBM"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      expect($(".head img[src='https://www.w3.org/Icons/team_subm']", doc).length)
        .toEqual(1);
    }).then(done);
  });
  it("should use the right SoTD boilerplate for Team submissions", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      specStatus: "Team-SUBM"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var $sotd = $("#sotd", doc);
      expect($sotd.find("a[href='https://www.w3.org/TeamSubmission/']").length)
        .toEqual(1);
    }).then(done);
  });
  // statusOverride
  it("should allow status paragraph to be overridden", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      overrideStatus: true,
      wg: "WGNAME",
      wgURI: "WGURI",
      wgPatentURI: "WGPATENT",
      wgPublicList: "WGLIST"
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var $sotd = $("#sotd", doc);
      expect($sotd.find("p:contains('CUSTOM PARAGRAPH')").length)
        .toEqual(1);
      expect($sotd.find("a:contains('WGNAME')").length)
        .toEqual(0);
      expect($sotd.find("a:contains('WGLIST@w3.org')").length)
        .toEqual(0);
      expect($sotd.find("a:contains('subscribe')").length)
        .toEqual(0);
      expect($sotd.find("a:contains('disclosures')").attr("href"))
        .toEqual("WGPATENT");
    }, simpleSpecURL).then(done);
  });
  // See https://github.com/w3c/respec/issues/653
  xit("should state that the spec is destined to become a note", function(done) {
    var ops = makeStandardOps();
    var newProps = {
      noRecTrack: true,
      specStatus: "WD",
      recNotExpected: true,
    };
    Object.assign(ops.config, newProps);
    makeRSDoc(ops, function(doc) {
      var sotdText = doc.getElementById("sotd").textContent;
      var expectedString = /It is expected to become a W3C Note/;
      expect(sotdText).toMatch(expectedString);
    }).then(done);
  });
});
