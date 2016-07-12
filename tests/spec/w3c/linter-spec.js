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
    it("ignores just privacy sections", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      elem.innerHTML = "the privacy of things";
      doc.body.appendChild(elem);
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
    });
    it("ignores just security sections", function() {
      var doc = document.implementation.createHTMLDocument("test doc");
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
      var elem = doc.createElement("h2");
      elem.innerHTML = "security of things";
      doc.body.appendChild(elem);
      expect(linter.rules.hasPriSecConsiderations(doc)).toEqual(false);
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
    it("finds privacy and security considerations sections, irrispective of order", function() {
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
});
