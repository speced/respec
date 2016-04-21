"use strict";
describe("W3C — Bibliographic References", function() {
  var isSpecRefAvailable = true;

  afterAll(function(done) {
    flushIframes();
    done();
  });

  // Ping biblio service to see if it's running
  it("should reach biblio service", function(done) {
    var fetchOps = {
      method: "HEAD"
    };
    fetch("https://labs.w3.org/specrefs/bibrefs", fetchOps)
      .then(function(res) {
        isSpecRefAvailable = res.ok;
        expect(res.ok).toBeTruthy();
        done();
      })
      .catch(function(err) {
        fail("Error", err);
        done();
      });
  });

  var customConfig = {
    editors: [{
      name: "Robin Berjon"
    }],
    shortName: "Foo",
    specStatus: "WD",
    prevVersion: "FPWD",
    previousMaturity: "WD",
    previousPublishDate: "2013-12-17",
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

  it("should display the publisher when present", function(done) {
    var ops = {
      config: customConfig,
      body: $("<section id='sotd'><p>foo [[!TestRef1]] [[TestRef2]] [[!TestRef3]]</p></section>")
    };
    makeRSDoc(ops, function(doc) {
      // Make sure the reference is added.
      var ref = doc.querySelector("#bib-TestRef1 + dd");
      expect(ref).toBeTruthy();
      // This prevents Jasmine from taking down the whole test suite if SpecRef is down.
      if (!isSpecRefAvailable) {
        var err = new Error("SpecRef seems to be down. Can't proceed with this spec.");
        return Promise.reject(err);
      }
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
    }).then(done).catch(done);
  });
});