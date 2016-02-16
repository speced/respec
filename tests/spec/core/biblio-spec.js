/*jshint strict: true, jasmine:true, jquery:true*/
/*global makeRSDoc, flushIframes*/
"use strict";
describe("W3C — Bibliographic References", function() {
  var MAXOUT = 5000;
  var basicConfig = {
    editors: [
        {name: "Robin Berjon"}
    ], specStatus: "WD",
    localBiblio: {
      "TestRef1": {
        title: "Test ref title",
        href: "http://test.com",
        authors: ["William Shakespeare"],
        publisher: "Publishers Inc."
      },
      "TestRef2": {
        title: "Second test",
        href: "http://test.com",
        authors: ["Another author"],
        publisher: "Testing 123"
      },
      "TestRef3": {
        title: "Third test",
        href: "http://test.com",
        publisher: "Publisher Here"
      },
    }
  };

  it("should display the publisher when present", function() {
    var doc;
    runs(function() {
      makeRSDoc({
          config: basicConfig,
          body: $("<section id='sample'><p>foo [[!TestRef1]] [[TestRef2]] [[!TestRef3]]</p></section>")
      }, function(rsdoc) {
            doc = rsdoc;
        });
    });
    waitsFor(function() {
      return doc;
    }, MAXOUT);
    runs(function() {
      // Make sure the reference is added.
      var ref = doc.querySelector("#bib-TestRef1 + dd");
      expect(ref).toBeTruthy();
      expect(ref.textContent).toMatch(/Publishers Inc\.\s/);
      ref = null;
      // Make sure the ". " is automatically added to publisher.
      ref = doc.querySelector("#bib-TestRef2 + dd");
      expect(ref).toBeTruthy();
      expect(ref.textContent).toMatch(/Testing 123\.\s/);
      ref = null;

      // Make sure publisher is shown even when there is no author
      ref = doc.querySelector("#bib-TestRef3 + dd");
      expect(ref).toBeTruthy();
      expect(ref.textContent).toMatch(/^Publisher Here\.\s/);

      //Done!
      flushIframes();
    });
  });
});
