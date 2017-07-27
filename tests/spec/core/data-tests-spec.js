"use strict";
describe("Core — data-tests attribute", () => {
  let doc;
  beforeAll(done => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `
        <section>
          <h2>test</h2>
          <p id="testable" data-tests="test0.html test1.html ./test2.html ../test3.html">
            <a id="t1" data-cite="#test">a</a>
            <dfn id="t2" data-cite="#test">a</dfn>
          </p>
        </section>`,
    };
    ops.config.testSuiteURI = "https://wpt.fyi/respec/";
    makeRSDoc(ops).then(testDoc => {
      doc = testDoc;
      done();
    });
  });
  afterAll(done => {
    flushIframes();
    done();
  });

  it("deletes the data-tests attribute after processing", () => {
    const testable = doc.getElementById("testable");
    expect(testable.hasAttribute("data-tests")).toBe(false);
  });
  describe("generated details element", () => {
    it("gets generated and added", () => {
      expect(doc.querySelector("#testable > details")).toBeTruthy();
    });
    it(`includes the css class`, () => {
      expect(
        doc.querySelector("#testable > details.respec-tests-details")
      ).toBeTruthy();
    });
  });
  describe("generated summary element", () => {
    it(`lists the number of tests in the summary`, () => {
      const { textContent } = doc.querySelector(
        "#testable > details > summary"
      );
      expect(textContent.trim()).toContain("4");
    });
  });
  describe("generated test list", () => {
    it(`adds tests into an unordered list`, () => {
      const ul = doc.querySelector("#testable > .respec-tests-details > ul");
      expect(ul).toBeTruthy();
    });
    it(`links the tests to the test site, resolved as proper URLs`, () => {
      const items = Array.from(
        doc.querySelectorAll("#testable > .respec-tests-details > ul > li > a")
      );
      expect(items.length).toEqual(4);
      for (let i = 0; i < items.length; i++) {
        expect(items[i].origin).toEqual("https://wpt.fyi");
        expect(items[i].pathname.endsWith(`test${i}.html`)).toBe(true);
      }
    });
  });
});
