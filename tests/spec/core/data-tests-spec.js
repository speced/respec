"use strict";
describe("Core — data-tests attribute", () => {
  let doc;
  beforeAll(async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `
        <section>
          <h2>test</h2>
          <p id="testable"
            data-tests="test0.html,
             test1.html, \t ./test2.html,
              ../test3.html,test4.html
            ">
            <a id="t1" data-cite="#test">a</a>
            <dfn id="t2" data-cite="#test">a</dfn>
          </p>
        </section>`,
    };
    ops.config.testSuiteURI = "https://wpt.fyi/respec/";
    doc = await makeRSDoc(ops);
  });
  afterAll(flushIframes);
  it("deletes the data-tests attribute after processing", () => {
    const testable = doc.getElementById("testable");
    expect(testable.hasAttribute("data-tests")).toBe(false);
  });
  describe("generated details element", () => {
    it("gets generated and added", () => {
      expect(doc.querySelector("#testable > details")).toBeTruthy();
    });
    it(`includes the css classes`, () => {
      expect(
        doc.querySelector("#testable > details.respec-tests-details")
      ).toBeTruthy();
      expect(
        doc.querySelector("#testable > details.removeOnSave")
      ).toBeTruthy();
    });
  });
  describe("generated summary element", () => {
    it(`lists the number of tests in the summary`, () => {
      const { textContent } = doc.querySelector(
        "#testable > details > summary"
      );
      expect(textContent.trim()).toContain("5");
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
      expect(items.length).toEqual(5);
      items.forEach(({ origin, pathname }, i) => {
        expect(origin).toEqual("https://wpt.fyi");
        expect(pathname.endsWith(`test${i}.html`)).toBe(true);
      });
    });
  });
});
