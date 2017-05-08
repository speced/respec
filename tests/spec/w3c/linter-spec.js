"use strict";
describe("W3C - Linter", function() {
  var linter;
  beforeAll(function(done) {
    require(["w3c/linter"], function(l) {
      linter = l;
      done();
    });
  });
  describe("hasPriSecConsiderations", function() {
    it("finds just privacy sections", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      elem.innerHTML = "the privacy of things";
      doc.body.appendChild(elem);
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
    });
    it("finds just security sections", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      elem.innerHTML = "security of things";
      doc.body.appendChild(elem);
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
    });
    it("ignores just considerations sections", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      elem.innerHTML = "Considerations for other things";
      doc.body.appendChild(elem);
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
    });
    it("finds privacy considerations sections", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      elem.innerHTML = "Considerations of privacy of things";
      doc.body.appendChild(elem);
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
    });
    it("finds security considerations sections", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      elem.innerHTML = "Considerations of security of things";
      doc.body.appendChild(elem);
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
    });
    it("finds privacy and security considerations sections, irrespective of order", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      elem.innerHTML = "Privacy and Security Considerations";
      doc.body.appendChild(elem);
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
      elem.innerHTML = "Security and Privacy Considerations";
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
      elem.innerHTML = "Considerations Security Privacy";
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
    });
    it("finds privacy and security considerations case insensitive", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      doc.body.appendChild(elem);
      elem.innerHTML = "Privacy and Security Considerations";
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
      elem.innerHTML = "Privacy and Security Considerations";
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
      elem.innerHTML = "PRIVACY and Security Considerations";
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
      elem.innerHTML = "PriVacy and SECURITY Considerations";
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
      elem.innerHTML = "PRIVACY AND SECURITY CONSIDERATIONS";
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(true);
      elem.innerHTML = "privacy considerations security";
    });
  });
  describe("findHTTPProps", function() {
    it("checks any prop ending with 'URI' (case sensitive)", function() {
      var conf = {
        FAIL_uri: "http://fail",
        failURIfail: "http://fail",
        URI: "http://pass",
        charterDisclosureURI: "http://pass",
        URI_FAIL: "http://fail",
        uri_FAIL: "http://fail",
      };
      var props = linter.rules.findHTTPProps(conf, document.location.href);
      expect(props).toEqual(
        jasmine.arrayContaining(["URI", "charterDisclosureURI"])
      );
      conf.charterDisclosureURI = "https://valid";
      conf.URI = "https://valid";
      props = linter.rules.findHTTPProps(conf, document.location.href);
      expect(props.length).toEqual(0);
    });
    it("checks for prevED, as special case", function() {
      var conf = {
        FAIL_uri: "http://fail",
        failURIfail: "http://fail",
        prevED: "http://pass",
        charterDisclosureURI: "http://pass",
        URI_FAIL: "http://fail",
      };
      var props = linter.rules.findHTTPProps(conf, document.location.href);
      expect(props).toEqual(
        jasmine.arrayContaining(["prevED", "charterDisclosureURI"])
      );
      conf.prevED = "https://valid-now";
      props = linter.rules.findHTTPProps(conf, document.location.href);
      expect(props).toEqual(jasmine.arrayContaining(["charterDisclosureURI"]));
    });
    it("flags well-known props as invalid, when invalid URLs are present", function() {
      var conf = {
        charterDisclosureURI: "http://invalid",
        edDraftURI: "http://invalid",
        implementationReportURI: "http://invalid",
        previousDiffURI: "http://invalid",
        previousMaturityURI: "http://invalid",
        previousURI: "http://invalid",
        prevRecURI: "http://invalid",
        testSuiteURI: "http://invalid",
        wgPatentURI: "http://invalid",
        wgURI: "http://invalid",
      };
      var props = linter.rules.findHTTPProps(conf, document.location.href);
      expect(props).toEqual(
        jasmine.arrayContaining([
          "charterDisclosureURI",
          "edDraftURI",
          "implementationReportURI",
          "previousDiffURI",
          "previousMaturityURI",
          "previousURI",
          "prevRecURI",
          "testSuiteURI",
          "wgPatentURI",
          "wgURI",
        ])
      );
    });
    it("ignores well-known URIs when they are valid", function() {
      var conf = {
        charterDisclosureURI: "https://valid.com",
        edDraftURI: "https://valid.net",
        implementationReportURI: "https://valid.org",
        previousDiffURI: "https://valid.net",
        previousMaturityURI: "https://valid.org",
        previousURI: "https://valid.com",
        prevRecURI: "https://valid.example",
        testSuiteURI: "https://valid.baz",
        wgPatentURI: "https://valid.bar",
        wgURI: "https://valid.com",
      };
      var props = linter.rules.findHTTPProps(conf, document.location.href);
      expect(props.length).toEqual(0);
    });
    it("lints URLs by resolving them as real URLs", function() {
      var conf = {
        someRelativeURI: "./foo/bar",
        somePathURI: "/foo/bar",
        someControlURI: "https://valid",
      };
      var props = linter.rules.findHTTPProps(conf, "http://invalid");
      expect(props).toEqual(
        jasmine.arrayContaining(["someRelativeURI", "somePathURI"])
      );
      conf.someControlURI = "http://invalid";
      props = linter.rules.findHTTPProps(conf, "http://valid");
      expect(props).toEqual(jasmine.arrayContaining(["someControlURI"]));
    });
  });
});
